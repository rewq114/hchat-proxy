import { modelCapabilities } from "../modelCapabilities";
import { ProviderFactory } from "../ProviderFactory";

export class EmbeddingsService {
  constructor(private apiKey: string, private apiBase: string) {}

  public async create(options: {
    model: string;
    input: string | string[];
    dimensions?: number;
    user?: string;
  }): Promise<any> {
    // 1. Determine provider
    const capability = modelCapabilities.find(
      (cap) => cap.model === options.model
    );
    const providerName = capability?.provider || "openai";

    // 2. Get the Native Provider
    const nativeProvider = await ProviderFactory.getProvider(providerName, {
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: options.model,
    });

    if (!nativeProvider.embed) {
      throw new Error(
        `Embedding is not supported for provider: ${providerName}`
      );
    }

    return nativeProvider.embed(options.input, options.dimensions);
  }
}
