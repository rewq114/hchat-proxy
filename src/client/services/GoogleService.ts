import { GoogleTransport } from "../transport/GoogleTransport";

/**
 * GoogleService - Native Google Gemini interface
 *
 * Pure pass-through for native Gemini API requests.
 * No format transformation - expects native Google format.
 */
export class GoogleService {
  constructor(private apiKey: string, private apiBase: string) {}

  /**
   * Forward a native Google Gemini request
   */
  async forward(path: string, body: any): Promise<any> {
    const isStream = path.includes("stream") || path.includes("sse");
    if (isStream) {
      return this.stream(body, path);
    }
    return this.complete(body, path);
  }

  /**
   * Non-streaming completion
   */
  async complete(body: any, path?: string): Promise<any> {
    const transport = new GoogleTransport({
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: body.model || "gemini-pro",
      path,
    });
    return transport.complete(body);
  }

  /**
   * Streaming completion
   */
  stream(body: any, path?: string): AsyncGenerator<any> {
    const transport = new GoogleTransport({
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: body.model || "gemini-pro",
      path,
    });
    return transport.stream(body);
  }
}
