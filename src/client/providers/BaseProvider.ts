import { SSEParser } from "../common/SSEParser";
import { CoreErrorFactory } from "../common/CoreError";
import { IProvider } from "../types/provider";

export const HCHAT_API_BASE = "https://h-chat-api.autoever.com/v2/api";

/**
 * BaseHttpProvider
 *
 * Abstract base class for providers that use HTTP transport.
 * Consolidates complete and stream logic.
 */
export abstract class BaseProvider<TReq, TRes, TChunk>
  implements IProvider<TReq, TRes, TChunk>
{
  constructor(
    protected config: {
      apiKey: string;
      apiBase: string;
      model: string;
      [key: string]: any;
    },
    protected provider: string
  ) {}

  private lastId: string =
    "chatcmpl-" + Math.random().toString(36).substring(7);
  private lastCreated: number = Math.floor(Date.now() / 1000);

  protected abstract getUrl(stream: boolean): string;
  protected abstract getHeaders(): Record<string, string>;

  public async complete(request: TReq): Promise<TRes> {
    const nativeRequest = await this.transformRequest(request);
    const response = await this.fetchResponse(nativeRequest as any, false);
    const nativeResponse = await response.json();
    return await this.transformResponse(nativeResponse);
  }

  public async *stream(request: TReq): AsyncGenerator<TChunk> {
    const nativeRequest = await this.transformRequest(request);
    const response = await this.fetchResponse(nativeRequest as any, true);

    let previousChunk: TChunk | null = null;
    for await (const rawChunk of this.iterateChunks<any>(response)) {
      const transformedChunk = await this.transformStreamChunk(
        rawChunk,
        request
      );
      if (transformedChunk) {
        if (previousChunk) yield previousChunk;
        previousChunk = transformedChunk;
      }
    }
    if (previousChunk) {
      // Ensure the last chunk has a finish_reason if the provider didn't send one
      const pc = previousChunk as any;
      if (pc.choices && pc.choices[0] && !pc.choices[0].finish_reason) {
        pc.choices[0].finish_reason = "stop";
      }
      yield previousChunk;
    }
  }

  protected async transformRequest(request: TReq): Promise<any> {
    return request;
  }

  protected async transformResponse(response: any): Promise<TRes> {
    if (!response.id) response.id = this.lastId;
    if (!response.object) response.object = "chat.completion";
    if (!response.created) response.created = this.lastCreated;
    if (!response.model) response.model = this.config.model;

    if (response?.choices && Array.isArray(response.choices)) {
      response.choices.forEach((choice: any) => {
        if (!choice.finish_reason) choice.finish_reason = "stop";
        if (choice.message) {
          const { content, reasoning_content } = BaseProvider.extractReasoning(
            choice.message.content,
            choice.message.reasoning_content
          );
          choice.message.content = content;
          choice.message.reasoning_content = reasoning_content;
        }
      });
    }
    return response as TRes;
  }

  protected async transformStreamChunk(
    chunk: any,
    request?: TReq
  ): Promise<TChunk | null> {
    if (!chunk.id || chunk.id === "") chunk.id = this.lastId;
    else this.lastId = chunk.id;

    if (!chunk.object) chunk.object = "chat.completion.chunk";

    if (!chunk.created || chunk.created === 0) chunk.created = this.lastCreated;
    else this.lastCreated = chunk.created;

    if (!chunk.model || chunk.model === "") chunk.model = this.config.model;

    if (chunk?.choices && Array.isArray(chunk.choices)) {
      chunk.choices.forEach((choice: any) => {
        if (!choice.delta && !choice.message) {
          choice.delta = {};
        }
        if (choice.delta) {
          const { content, reasoning_content } = BaseProvider.extractReasoning(
            choice.delta.content,
            choice.delta.reasoning_content
          );
          choice.delta.content = content;
          choice.delta.reasoning_content = reasoning_content;

          // Ensure tool_calls have an index (required for OpenAI alignment)
          if (
            choice.delta.tool_calls &&
            Array.isArray(choice.delta.tool_calls)
          ) {
            choice.delta.tool_calls.forEach((tc: any, idx: number) => {
              if (tc.index === undefined) {
                tc.index = idx;
              }
            });
          }
        }
      });
    }
    if (!chunk.choices || chunk.choices.length === 0) {
      return null;
    }
    return chunk as TChunk;
  }

  /**
   * Helper to extract reasoning content from text (e.g. <think> tags used by Ollama/DeepSeek)
   */
  public static extractReasoning(
    content: any,
    existingReasoning?: any
  ): { content: any; reasoning_content: any } {
    if (typeof content !== "string") {
      return { content, reasoning_content: null };
    }

    let finalContent = content;
    if (existingReasoning && typeof existingReasoning === "string") {
      finalContent = `<think>\n${existingReasoning}\n</think>\n${
        content || ""
      }`;
    }

    return {
      content: finalContent || (content === "" ? "" : null),
      reasoning_content: null,
    };
  }

  protected async fetchResponse(
    requestBody: any,
    stream: boolean
  ): Promise<Response> {
    const url = this.getUrl(stream);
    const headers = this.getHeaders();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      await this.handleServerError(response, url);
    }

    return response;
  }

  /**
   * Parse SSE stream into JSON objects
   */
  protected async *iterateChunks<T = any>(
    response: Response
  ): AsyncIterableIterator<T> {
    const parser = new SSEParser();

    for await (const event of parser.parse(response)) {
      if (event.data === "[DONE]" || event.data === "DONE") {
        break;
      }

      try {
        const json = JSON.parse(event.data);
        yield json;
      } catch (e) {
        console.error(
          `[${this.provider}] Failed to parse SSE data:`,
          event.data,
          "Error:",
          e
        );
      }
    }
  }

  /**
   * Standardized server error handling
   */
  protected async handleServerError(
    response: Response,
    requestUrl: string
  ): Promise<never> {
    console.error(
      `[${this.provider}] Server Error ${response.status} at ${requestUrl}`
    );
    const status = response.status;
    const contentType = response.headers.get("content-type") || "";

    if (
      contentType.includes("text/html") ||
      contentType.includes("application/octet-stream")
    ) {
      const htmlText = await response.text();
      throw this.mapHtmlError(status, htmlText);
    }

    if (contentType.includes("application/json")) {
      const errorData = await response.json();
      const message =
        errorData.error?.message || errorData.message || "Unknown error";
      throw CoreErrorFactory.llmApiError(this.provider, status, message, {
        module: "LLM",
        operation: "request",
        resource: this.config.model,
        metadata: { status, errorData },
      });
    }

    throw CoreErrorFactory.llmApiError(
      this.provider,
      status,
      response.statusText,
      {
        module: "LLM",
        operation: "request",
        resource: this.config.model,
        metadata: { status },
      }
    );
  }

  private mapHtmlError(status: number, htmlText: string): Error {
    switch (status) {
      case 403:
        if (
          htmlText.includes("Access Denied") ||
          htmlText.includes("접근이 거부")
        ) {
          return new Error(
            "Network access issue: Please use from internal network."
          );
        }
        return new Error("Access denied: Check your API Key or permissions.");
      case 404:
        return new Error("API endpoint not found.");
      case 500:
        return new Error("Internal server error occurred.");
      default:
        return new Error(
          `Server error (${status}): ${htmlText.substring(0, 100)}`
        );
    }
  }

  protected normalizeApiBase(apiBase: string): string {
    return apiBase.endsWith("/") ? apiBase : `${apiBase}/`;
  }
}
