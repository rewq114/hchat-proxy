import { BaseProvider } from "../providers/BaseProvider";
import { log } from "../common/Logger";

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
    log.dev(this.provider, "Original request model:", request.model);

    // Normalize model name: strip date suffix (e.g., -20250514)
    if (request.model) {
      const originalModel = request.model;
      request.model = this.normalizeModelName(request.model);
      if (originalModel !== request.model) {
        log.dev(
          this.provider,
          `Model normalized: ${originalModel} -> ${request.model}`
        );
      }
    }

    // Aggressively remove tool_choice to prevent H-Chat parsing errors
    if ("tool_choice" in request) {
      log.dev(this.provider, "Removing tool_choice field from request");
      delete request.tool_choice;
    }

    return request;
  }

  /**
   * Normalize Claude model names for H-Chat compatibility
   */
  private normalizeModelName(model: string): string {
    const MODEL_MAPPINGS: Record<string, string> = {
      "claude-sonnet-4-5": "claude-sonnet-4-5",
      "claude-haiku-4-5": "claude-haiku-4-5",
      "claude-3-5-sonnet": "claude-3-5-sonnet-v2",
      "claude-3.7-sonnet": "claude-3-7-sonnet",
      "claude-sonnet-4": "claude-sonnet-4",
      "claude-haiku-4": "claude-haiku-4-5",
    };

    // Strip date suffix (e.g., -20250514)
    const withoutDate = model.replace(/-\d{8}$/, "");

    if (MODEL_MAPPINGS[withoutDate]) {
      return MODEL_MAPPINGS[withoutDate];
    }

    for (const [pattern, mapped] of Object.entries(MODEL_MAPPINGS)) {
      if (withoutDate.startsWith(pattern)) {
        return mapped;
      }
    }

    return withoutDate;
  }

  protected async transformResponse(response: any): Promise<any> {
    return response;
  }

  protected async transformStreamChunk(chunk: any): Promise<any> {
    return chunk;
  }
}
