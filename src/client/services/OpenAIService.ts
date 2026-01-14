import { AnthropicTransport } from "../transport/AnthropicTransport";
import { GoogleTransport } from "../transport/GoogleTransport";
import { AnthropicMapper } from "../chatCompletionMappers/AnthropicMapper";
import { GoogleMapper } from "../chatCompletionMappers/GoogleMapper";
import { ProviderFactory } from "../ProviderFactory";
import { modelCapabilities } from "../modelCapabilities";
import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "../types";

/**
 * OpenAIService - Unified OpenAI-compatible interface
 *
 * Handles requests in OpenAI format, internally dispatches to
 * the correct transport + mapper based on the model.
 */
export class OpenAIService {
  constructor(private apiKey: string, private apiBase: string) {}

  /**
   * Create a chat completion (streaming or non-streaming)
   */
  async create(
    request: CompletionRequest
  ): Promise<CompletionResponse | AsyncGenerator<CompletionChunk>> {
    const model = request.model || "";

    // Determine provider from model capabilities
    const capability = modelCapabilities.find((cap) => cap.model === model);
    const providerName = capability?.provider || this.inferProvider(model);

    if (request.stream) {
      return this.stream(request, providerName);
    } else {
      return this.complete(request, providerName);
    }
  }

  /**
   * Non-streaming completion
   */
  private async complete(
    request: CompletionRequest,
    providerName: string
  ): Promise<CompletionResponse> {
    if (providerName === "anthropic") {
      const nativeRequest = AnthropicMapper.toNativeRequest(request);
      const transport = new AnthropicTransport({
        apiKey: this.apiKey,
        apiBase: this.apiBase,
        model: request.model,
      });
      const nativeResponse = await transport.complete(nativeRequest);
      return AnthropicMapper.fromNativeResponse(nativeResponse);
    }

    if (providerName === "google") {
      const nativeRequest = GoogleMapper.toNativeRequest(request);
      const transport = new GoogleTransport({
        apiKey: this.apiKey,
        apiBase: this.apiBase,
        model: request.model,
      });
      const nativeResponse = await transport.complete(nativeRequest);
      return GoogleMapper.fromNativeResponse(nativeResponse);
    }

    // Default: OpenAI/Azure (use ProviderFactory for existing provider)
    const provider = await ProviderFactory.getProvider(providerName, {
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: request.model,
    });
    return provider.complete(request);
  }

  /**
   * Streaming completion
   */
  private async *stream(
    request: CompletionRequest,
    providerName: string
  ): AsyncGenerator<CompletionChunk> {
    if (providerName === "anthropic") {
      const nativeRequest = AnthropicMapper.toNativeRequest(request);
      const transport = new AnthropicTransport({
        apiKey: this.apiKey,
        apiBase: this.apiBase,
        model: request.model,
      });
      const nativeStream = transport.stream(nativeRequest);
      for await (const nativeChunk of nativeStream) {
        const chunk = AnthropicMapper.fromNativeStreamChunk(
          nativeChunk,
          request
        );
        if (chunk) yield chunk;
      }
      return;
    }

    if (providerName === "google") {
      const nativeRequest = GoogleMapper.toNativeRequest(request);
      const transport = new GoogleTransport({
        apiKey: this.apiKey,
        apiBase: this.apiBase,
        model: request.model,
      });
      const nativeStream = transport.stream(nativeRequest);
      for await (const nativeChunk of nativeStream) {
        const chunk = GoogleMapper.fromNativeStreamChunk(nativeChunk);
        if (chunk) yield chunk;
      }
      return;
    }

    // Default: OpenAI/Azure
    const provider = await ProviderFactory.getProvider(providerName, {
      apiKey: this.apiKey,
      apiBase: this.apiBase,
      model: request.model,
    });
    yield* provider.stream(request);
  }

  /**
   * Infer provider from model name if not in capabilities
   */
  private inferProvider(model: string): string {
    if (model.includes("claude")) return "anthropic";
    if (model.includes("gemini")) return "google";
    if (model.includes("gpt") || model.includes("o1") || model.includes("o3"))
      return "azure";
    return "azure"; // Default fallback
  }
}
