import { GoogleMapper } from "../chatCompletionMappers/GoogleMapper";
import { BaseProvider } from "./BaseProvider";
import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";

/**
 * Google Native Provider
 *
 * This provider focuses only on the Gemini API transport and data types.
 * It is independent of the SDK's abstract types.
 */
export class Google extends BaseProvider<
  CompletionRequest,
  CompletionResponse,
  CompletionChunk
> {
  constructor(config: { apiKey: string; apiBase?: string; model: string }) {
    super(
      {
        ...config,
        apiBase:
          config.apiBase || "https://generativelanguage.googleapis.com/v1beta/",
      },
      "google"
    );
  }

  protected async transformRequest(request: CompletionRequest): Promise<any> {
    return GoogleMapper.toNativeRequest(request);
  }

  protected async transformResponse(
    response: any
  ): Promise<CompletionResponse> {
    return GoogleMapper.fromNativeResponse(response);
  }

  protected async transformStreamChunk(
    chunk: any,
    _request: CompletionRequest
  ): Promise<CompletionChunk | null> {
    // Google returns the same structure for both non-streaming and streaming
    return GoogleMapper.fromNativeStreamChunk(chunk);
  }

  protected getUrl(stream: boolean): string {
    const method = stream ? "streamGenerateContent" : "generateContent";
    const endpoint = `${this.config.model}:${method}`;

    let apiBase = this.normalizeApiBase(this.config.apiBase);
    if (!apiBase.includes("models")) {
      apiBase = `${apiBase}models/`;
    }

    let requestUrl = `${apiBase}${endpoint}?key=${this.config.apiKey}`;
    if (stream) {
      requestUrl += "&alt=sse";
    }
    return requestUrl;
  }

  protected getHeaders(): Record<string, string> {
    return {};
  }

  /**
   * Embedding functionality (Optional)
   */
  public async embed(
    input: string | string[],
    dimensions?: number
  ): Promise<any> {
    let apiBase = this.normalizeApiBase(this.config.apiBase);
    if (!apiBase.includes("models")) {
      apiBase = `${apiBase}models/`;
    }
    const url = `${apiBase}${this.config.model}:embedContent?key=${this.config.apiKey}`;

    const body = {
      content: {
        parts: Array.isArray(input)
          ? input.map((t) => ({ text: t }))
          : [{ text: input }],
      },
      output_dimensionality: dimensions,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      await this.handleServerError(response, url);
    }

    return await response.json();
  }
}
