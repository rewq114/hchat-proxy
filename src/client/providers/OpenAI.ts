import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";
import { BaseProvider } from "./BaseProvider";

/**
 * Standard OpenAI Native Provider
 *
 * focuses on OpenAI API transport and data types.
 */
export class OpenAI extends BaseProvider<
  CompletionRequest,
  CompletionResponse,
  CompletionChunk
> {
  constructor(config: { apiKey: string; apiBase: string; model: string }) {
    super(config, "openai");
  }

  protected async transformRequest(
    request: CompletionRequest
  ): Promise<CompletionRequest> {
    const nativeRequest = { ...request } as any;
    const isO1 =
      request.model.startsWith("o1") || request.model.startsWith("gpt-5");

    if (isO1 && request.max_completion_tokens) {
      nativeRequest.max_completion_tokens = request.max_completion_tokens;
    }

    // Map 'developer' role to 'system'
    if (nativeRequest.messages) {
      nativeRequest.messages = nativeRequest.messages.map((m: any) => {
        if (m.role === "developer") {
          return { ...m, role: "system" };
        }
        return m;
      });
    }

    return nativeRequest;
  }

  protected getUrl(): string {
    const apiBase = this.normalizeApiBase(this.config.apiBase);
    return `${apiBase}chat/completions`;
  }

  protected getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }
}
