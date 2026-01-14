import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";
import { BaseProvider } from "./BaseProvider";

/**
 * Azure Native Provider
 *
 * focuses on Azure OpenAI API transport and data types.
 */
export class Azure extends BaseProvider<
  CompletionRequest,
  CompletionResponse,
  CompletionChunk
> {
  constructor(config: { apiKey: string; apiBase: string; model: string }) {
    super(config, "azure");
  }

  protected async transformRequest(request: CompletionRequest): Promise<any> {
    const nativeRequest = { ...request } as any;
    const isO1 =
      request.model.startsWith("o1") || request.model.startsWith("gpt-5");

    if (isO1 && (request.max_tokens || request.max_completion_tokens)) {
      nativeRequest.max_completion_tokens =
        request.max_completion_tokens || request.max_tokens;
      delete nativeRequest.max_tokens;
    }
    // Fix: o1/gpt-5 models only support temperature=1
    if (
      isO1 &&
      request.temperature !== undefined &&
      request.temperature !== 1
    ) {
      nativeRequest.temperature = 1;
    }

    // Fix: Ensure stop is always an array for Azure/OpenAI
    if (request.stop) {
      nativeRequest.stop = Array.isArray(request.stop)
        ? request.stop
        : [request.stop];
    }

    // Fix: Map 'developer' role to 'system' for compatibility
    if (nativeRequest.messages) {
      nativeRequest.messages = nativeRequest.messages.map((m: any) => {
        const newMsg = { ...m };
        if (newMsg.role === "developer") {
          newMsg.role = "system";
        }
        // Fix: OpenAI chat completion doesn't support 'file' content parts
        if (Array.isArray(newMsg.content)) {
          newMsg.content = newMsg.content.filter(
            (part: any) => part.type !== "file"
          );
        }
        return newMsg;
      });
    }

    // Fix: Azure Gateway can fail if tool_choice is provided as an object
    if (nativeRequest.tool_choice) {
      if (typeof nativeRequest.tool_choice === "object") {
        if (nativeRequest.tool_choice.type === "function") {
          // Gateway doesn't seem to support forcing specific functions for GPT yet
          nativeRequest.tool_choice = "required";
        } else {
          nativeRequest.tool_choice = nativeRequest.tool_choice.type || "auto";
        }
      }
      if (nativeRequest.tool_choice === "any") {
        nativeRequest.tool_choice = "required";
      }
    }

    // Fix: Azure Gateway can fail if tool_choice is provided without tools
    if (
      nativeRequest.tool_choice &&
      (!nativeRequest.tools || nativeRequest.tools.length === 0)
    ) {
      delete nativeRequest.tool_choice;
    }

    // Fix: Map extended reasoning_effort to OpenAI supported values (low, medium, high)
    if (nativeRequest.reasoning_effort) {
      if (nativeRequest.reasoning_effort === "none") {
        delete nativeRequest.reasoning_effort;
      } else if (nativeRequest.reasoning_effort === "minimal") {
        nativeRequest.reasoning_effort = "low";
      } else if (nativeRequest.reasoning_effort === "xhigh") {
        nativeRequest.reasoning_effort = "high";
      }
    }

    // Fix: Azure Gateway can fail if stream_options is provided
    if (nativeRequest.stream_options) {
      delete nativeRequest.stream_options;
    }

    // console.log('[Azure Request]', JSON.stringify(nativeRequest, null, 2))
    return nativeRequest;
  }

  protected async transformResponse(
    response: any
  ): Promise<CompletionResponse> {
    return super.transformResponse(response);
  }

  protected async transformStreamChunk(
    chunk: any,
    request: CompletionRequest
  ): Promise<CompletionChunk | null> {
    return super.transformStreamChunk(chunk, request);
  }

  protected getUrl(): string {
    const endpoint = `deployments/${this.config.model}/chat/completions`;

    let apiBase = this.normalizeApiBase(this.config.apiBase);
    if (!apiBase.includes("openai")) {
      apiBase = `${apiBase}openai/`;
    }
    return `${apiBase}${endpoint}`;
  }

  protected getHeaders(): Record<string, string> {
    return {
      "api-key": this.config.apiKey,
    };
  }

  /**
   * Static embed method (Native style)
   */
  public async embed(
    input: string | string[],
    dimensions?: number
  ): Promise<any> {
    const endpoint = `deployments/${this.config.model}/embeddings`;

    let apiBase = this.normalizeApiBase(this.config.apiBase);
    if (!apiBase.includes("openai")) {
      apiBase = `${apiBase}openai/`;
    }
    const url = `${apiBase}${endpoint}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": this.config.apiKey,
      },
      body: JSON.stringify({
        input,
        dimensions,
      }),
    });

    if (!response.ok) {
      await this.handleServerError(response, url);
    }

    return await response.json();
  }
}
