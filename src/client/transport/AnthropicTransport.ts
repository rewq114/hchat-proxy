import { BaseProvider } from "../providers/BaseProvider";

/**
 * Anthropic Transport Provider
 * Pure pass-through for native Claude requests.
 */
export class AnthropicTransport extends BaseProvider<any, any, any> {
  constructor(config: { apiKey: string; apiBase: string; model: string }) {
    super(config, "anthropic-transport");
  }

  protected getUrl(stream: boolean): string {
    const apiBase = this.normalizeApiBase(this.config.apiBase);
    return `${apiBase}claude/messages`;
  }

  protected getHeaders(): Record<string, string> {
    return {
      Authorization: this.config.apiKey,
    };
  }

  protected async transformRequest(request: any): Promise<any> {
    return request;
  }

  protected async transformResponse(response: any): Promise<any> {
    return response;
  }

  protected async transformStreamChunk(chunk: any): Promise<any> {
    return chunk;
  }
}
