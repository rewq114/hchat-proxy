import { BaseProvider } from "../providers/BaseProvider";

/**
 * Google Transport Provider
 * Pure pass-through for native Gemini/Google requests.
 */
export class GoogleTransport extends BaseProvider<any, any, any> {
  constructor(config: {
    apiKey: string;
    apiBase: string;
    model: string;
    path?: string;
  }) {
    super(config, "google-transport");
  }

  protected getUrl(stream: boolean): string {
    const apiBase = this.normalizeApiBase(this.config.apiBase);

    // Determine method (generateContent vs streamGenerateContent)
    // If stream is true, we prefer streamGenerateContent unless path overrides
    const defaultMethod = stream ? "streamGenerateContent" : "generateContent";

    let url = "";

    if (this.config.path && this.config.path.includes(":")) {
      // Path from Native SDK (e.g. /v1beta/models/gemini-pro:generateContent)
      // Extract part starting from "models/" to avoid double-appending or leaving garbage prefixes
      let cleanPath = this.config.path;

      const modelsIdx = cleanPath.indexOf("models/");
      if (modelsIdx !== -1) {
        cleanPath = cleanPath.substring(modelsIdx);
      } else {
        // Fallback cleanup if "models/" not found but is direct path
        cleanPath = cleanPath.replace(/^(\/?v1beta\/|\/?v1\/)+/, "");
        if (cleanPath.startsWith("/")) cleanPath = cleanPath.substring(1);

        if (!cleanPath.startsWith("models/")) {
          cleanPath = `models/${cleanPath}`;
        }
      }

      url = `${apiBase}${cleanPath}`;
    } else {
      // Constructed from model (e.g. via OpenAI mapper)
      url = `${apiBase}models/${this.config.model}:${defaultMethod}`;
    }

    // Append API Key (Required for H-Chat Google/Gemini)
    const separator = url.includes("?") ? "&" : "?";
    url += `${separator}key=${this.config.apiKey}`;

    if (stream) {
      url += "&alt=sse";
    }
    console.log("[GoogleTransport] Final URL:", url);
    return url;
  }

  protected getHeaders(): Record<string, string> {
    return {
      "Content-Type": "application/json",
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
