import { IProvider } from "./types/provider";
import { CoreErrorFactory } from "./common/CoreError";
import { Anthropic } from "./providers/Anthropic";
import { Google } from "./providers/Google";
import { Azure } from "./providers/Azure";
import { OpenAI } from "./providers/OpenAI";
import { Ollama } from "./providers/Ollama";

/**
 * ProviderFactory
 *
 * Instantiates LLM providers.
 * Standardized to return IProvider (OpenAI-compatible) by default.
 */
export class ProviderFactory {
  /**
   * Get Native Provider instance (Standardized)
   */
  static async getProvider(
    providerName: string,
    config: { apiKey: string; apiBase: string; model: string }
  ): Promise<IProvider> {
    const fullConfig = {
      ...config,
      apiBase: config.apiBase || "", // Ensure string type
    };
    switch (providerName) {
      case "anthropic":
        return new Anthropic(fullConfig);
      case "google":
        return new Google(fullConfig);
      case "azure":
        return new Azure(fullConfig as any);
      case "openai":
        return new OpenAI(fullConfig);
      case "ollama":
        return new Ollama({
          ...fullConfig,
          apiKey: fullConfig.apiKey || "ollama",
        });
      default:
        throw CoreErrorFactory.validation(
          `Unsupported provider: ${providerName}`
        );
    }
  }
}
