import { AnthropicMapper } from "../chatCompletionMappers/AnthropicMapper";
import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";
import { BaseProvider } from "./BaseProvider";

/**
 * Anthropic Native Provider
 *
 * focuses on Claude API transport and data types.
 */
export class Anthropic extends BaseProvider<
  CompletionRequest,
  CompletionResponse,
  CompletionChunk
> {
  constructor(config: { apiKey: string; apiBase?: string; model: string }) {
    super(
      {
        ...config,
        apiBase: config.apiBase || "https://api.anthropic.com/v1/",
      },
      "anthropic"
    );
  }

  protected async transformRequest(request: CompletionRequest): Promise<any> {
    return AnthropicMapper.toNativeRequest(request);
  }

  protected async transformResponse(
    response: any
  ): Promise<CompletionResponse> {
    return AnthropicMapper.fromNativeResponse(response);
  }

  protected async transformStreamChunk(
    chunk: any,
    request: CompletionRequest
  ): Promise<CompletionChunk | null> {
    return AnthropicMapper.fromNativeStreamChunk(chunk, request);
  }

  protected getUrl(): string {
    const endpoint = `claude/messages`;
    const apiBase = this.normalizeApiBase(this.config.apiBase);
    return `${apiBase}${endpoint}`;
  }

  protected getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }
}

export default Anthropic;
