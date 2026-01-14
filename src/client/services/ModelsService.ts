import { modelCapabilities } from "../modelCapabilities";
import { ModelCapabilities } from "../types/Common.types";

export class ModelsService {
  constructor(private apiKey: string, private apiBase: string) {}

  /**
   * List all available models and their capabilities
   */
  public async list(): Promise<any> {
    const models = modelCapabilities.map((m) => this.transformCapability(m));
    return {
      object: "list",
      data: models,
    };
  }

  /**
   * Retrieve specific model details
   */
  public async retrieve(modelId: string): Promise<any> {
    const caps = modelCapabilities.find((m) => m.model === modelId);
    if (!caps) {
      throw new Error(`Model not found: ${modelId}`);
    }
    return this.transformCapability(caps);
  }

  private transformCapability(cap: ModelCapabilities): any {
    return {
      id: cap.model,
      object: "model",
      created: 1715367049, // Dummy timestamp
      owned_by: cap.provider,
    };
  }
}
