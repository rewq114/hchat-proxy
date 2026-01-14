import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
} from "./index";

/**
 * Interface for Native Providers that operate on provider-specific types.
 * Default generics are now top-level Completion types.
 */
export interface IProvider<
  TReq = CompletionRequest,
  TRes = CompletionResponse,
  TChunk = CompletionChunk
> {
  complete(request: TReq): Promise<TRes>;
  stream(request: TReq): AsyncGenerator<TChunk>;
  embed?(input: string | string[], dimensions?: number): Promise<any>;
}
