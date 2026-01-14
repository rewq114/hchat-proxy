import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";
import { BaseProvider } from "./BaseProvider";

/**
 * Ollama Native Provider
 * Uses OpenAI-compatible API
 */
export class Ollama extends BaseProvider<
  CompletionRequest,
  CompletionResponse,
  CompletionChunk
> {
  constructor(config: { apiKey?: string; apiBase: string; model: string }) {
    super(
      {
        ...config,
        apiKey: config.apiKey || "ollama",
      },
      "ollama"
    );
  }

  protected getUrl(): string {
    const apiBase = this.normalizeApiBase(this.config.apiBase);
    return `${apiBase}v1/chat/completions`;
  }

  protected getHeaders(): Record<string, string> {
    return {
      ...(this.config.apiKey !== "ollama"
        ? { Authorization: `Bearer ${this.config.apiKey}` }
        : {}),
    };
  }
}
