import { AnthropicTransport } from "../transport/AnthropicTransport";

/**
 * AnthropicService - Native Anthropic interface
 *
 * Pure pass-through for native Claude API requests.
 * No format transformation - expects native Anthropic format.
 */
export class AnthropicService {
  constructor(private apiKey: string, private apiBase: string) {}

  /**
   * Create a native Anthropic message
   */
  async create(body: any): Promise<any> {
    if (body.stream) {
      return this.stream(body);
    }
    return this.complete(body);
  }

  /**
   * Non-streaming completion
   */
  async complete(body: any): Promise<any> {
    const transport = new AnthropicTransport({
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: body.model,
    });
    return transport.complete(body);
  }

  /**
   * Streaming completion
   */
  stream(body: any): AsyncGenerator<any> {
    const transport = new AnthropicTransport({
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: body.model,
    });
    return transport.stream(body);
  }
}
