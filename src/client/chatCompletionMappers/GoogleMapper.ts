import { v4 as uuidv4 } from "uuid";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import {
  GoogleRequest,
  GoogleResponse,
  Part,
  Content,
  GenerationConfig,
  Tool as GoogleTool,
  ToolConfig,
  FunctionDeclaration,
  Type,
} from "../types/Google.types";
import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
  RequestMessages,
  ToolChoice,
  ToolCall,
  Usage,
  Choice,
} from "../types";
import { BaseProvider } from "../providers/BaseProvider";

/**
 * GoogleMapper
 * Handles the conversion between OpenAI standard types and Google Gemini API types.
 */
interface MappedBaseResult {
  id: string;
  created: number;
  model: string;
  candidateIndex: number;
  content: string | null;
  reasoning_content: string | null;
  tool_calls: ToolCall[];
  finishReason: Choice["finish_reason"];
  usage: Usage;
}

export class GoogleMapper {
  public static toNativeRequest(request: CompletionRequest): GoogleRequest {
    const nativeRequest: GoogleRequest = {
      contents: this.convertMessages(request.messages),
      generationConfig: {
        maxOutputTokens:
          (request.max_completion_tokens || request.max_tokens) ?? undefined,
        temperature: request.temperature ?? undefined,
        topP: request.top_p ?? undefined,
        stopSequences: Array.isArray(request.stop)
          ? request.stop
          : request.stop
          ? [request.stop]
          : undefined,
        responseMimeType:
          request.response_format?.type === "json_object"
            ? "application/json"
            : undefined,
      },
    };

    // Handle Built-in Tools (Web Search)
    if (request.web_search_options) {
      if (!nativeRequest.tools) {
        nativeRequest.tools = [];
      }
      // Check if Search tool already exists to avoid duplication
      const hasSearch = nativeRequest.tools.some(
        (t) => !!(t as any).google_search
      );
      if (!hasSearch) {
        nativeRequest.tools.push({
          google_search: {},
        } as any);
      }
    }

    if (
      (request.reasoning_effort && request.reasoning_effort !== "none") ||
      (request as any).reasoning === true
    ) {
      const budgetMap: Record<string, number> = {
        minimal: 1024,
        low: 2048,
        medium: 4096,
        high: 8192,
        xhigh: 16384,
      };
      const effort = request.reasoning_effort || "medium";
      nativeRequest.generationConfig!.thinkingConfig = {
        includeThoughts: true,
        thinkingBudget: budgetMap[effort] || 1024,
      };
    }

    if (request.response_format) {
      if (request.response_format.type === "json_object") {
        nativeRequest.generationConfig!.responseMimeType = "application/json";
      } else if (request.response_format.type === "json_schema") {
        nativeRequest.generationConfig!.responseMimeType = "application/json";
        nativeRequest.generationConfig!.responseSchema = request.response_format
          .json_schema.schema as any;
      }
    }

    const functionDeclarations: FunctionDeclaration[] = [];
    request.tools?.forEach((tool) => {
      if (tool.type === "function") {
        functionDeclarations.push({
          name: tool.function.name,
          description: tool.function.description,
          parameters: tool.function.parameters
            ? (this.cleanSchema(tool.function.parameters) as any)
            : undefined,
        });
      }
    });

    if (functionDeclarations.length > 0) {
      if (!nativeRequest.tools) {
        nativeRequest.tools = [];
      }
      nativeRequest.tools.push({ functionDeclarations });
    }

    if (request.tool_choice) {
      nativeRequest.toolConfig = this.convertToolChoice(request.tool_choice);
    }

    return nativeRequest;
  }

  public static fromNativeResponse(data: GoogleResponse): CompletionResponse {
    const result = this.mapBase(data);

    return {
      id: result.id,
      object: "chat.completion",
      created: result.created,
      model: result.model,
      choices: [
        {
          index: result.candidateIndex,
          message: {
            role: "assistant",
            content: result.content || null,
            refusal: null,
            reasoning_content: result.reasoning_content || null,
            tool_calls:
              result.tool_calls.length > 0 ? result.tool_calls : undefined,
          },
          finish_reason: result.finishReason as any,
        },
      ],
      usage: result.usage,
    };
  }

  public static fromNativeStreamChunk(data: GoogleResponse): CompletionChunk {
    const result = this.mapBase(data);

    return {
      id: result.id,
      object: "chat.completion.chunk",
      created: result.created,
      model: result.model,
      choices: [
        {
          index: result.candidateIndex,
          delta: {
            role: "assistant",
            content: result.content || null,
            reasoning_content: result.reasoning_content || null,
            tool_calls:
              result.tool_calls.length > 0
                ? (result.tool_calls.map((tc, idx) => ({
                    ...tc,
                    index: idx,
                  })) as any)
                : undefined,
          },
          finish_reason: result.finishReason as any,
        },
      ],
      usage: result.usage,
    };
  }

  private static mapBase(data: GoogleResponse): MappedBaseResult {
    const prompt_tokens = data.usageMetadata?.promptTokenCount || 0;
    const candidates_sum =
      data.candidates?.reduce(
        (acc: number, c: any) => acc + (c.tokenCount || 0),
        0
      ) || 0;
    const completion_tokens =
      Math.max(data.usageMetadata?.candidatesTokenCount || 0, candidates_sum) +
      (data.usageMetadata?.thoughtsTokenCount || 0);

    const usage: Usage = {
      prompt_tokens,
      completion_tokens,
      total_tokens:
        data.usageMetadata?.totalTokenCount ||
        prompt_tokens + completion_tokens,
      prompt_tokens_details: {
        cached_tokens: data.usageMetadata?.cachedContentTokenCount || 0,
        audio_tokens: 0,
      },
      completion_tokens_details: {
        reasoning_tokens: data.usageMetadata?.thoughtsTokenCount || 0,
        audio_tokens: 0,
        accepted_prediction_tokens: 0,
        rejected_prediction_tokens: 0,
      },
    };

    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    let content = "";
    const tool_calls: ToolCall[] = [];

    for (const part of parts) {
      if (part.text) {
        if (part.thought) {
          content += `<think>\n${part.text}\n</think>\n`;
        } else {
          content += part.text;
        }
      }
      if (part.functionCall) {
        tool_calls.push({
          id: part.functionCall.id || uuidv4(),
          type: "function",
          function: {
            name: part.functionCall.name,
            arguments: JSON.stringify(part.functionCall.args),
          },
        });
      }
    }

    let finishReason = GoogleMapper.mapStopReason(candidate?.finishReason);

    return {
      id: data.responseId || uuidv4(),
      created: Date.now(),
      model: data.modelVersion || "unknown",
      candidateIndex: candidate?.index || 0,
      content: content || null,
      reasoning_content: null,
      tool_calls,
      finishReason,
      usage,
    };
  }

  private static convertMessages(messages: RequestMessages[]): Content[] {
    return messages.map((m) => {
      let parts: Part[] = [];

      if (m.role === "tool") {
        // Find matching tool call to get function name if not provided in 'name'
        let functionName = (m as any).name;
        if (!functionName && (m as any).tool_call_id) {
          const toolCallId = (m as any).tool_call_id;
          for (let i = messages.indexOf(m) - 1; i >= 0; i--) {
            const prev = messages[i];
            if (prev.role === "assistant" && prev.tool_calls) {
              const tc = prev.tool_calls.find((t) => t.id === toolCallId);
              if (tc && tc.type === "function" && (tc as any).function) {
                functionName = (tc as any).function.name;
                break;
              }
            }
          }
        }

        return {
          role: "user",
          parts: [
            {
              functionResponse: {
                name: functionName || "unknown",
                response: { content: m.content || "" },
              },
            },
          ],
        };
      }

      if (!m.content) {
        parts = [];
      } else if (typeof m.content === "string") {
        parts = [{ text: m.content }];
      } else {
        parts = (m.content as any[]).map((p) => {
          if (p.type === "text") return { text: p.text || "" };
          if (p.type === "refusal") return { text: `[Refusal]: ${p.refusal}` };
          if (p.type === "image_url") {
            if (p.image_url.url.startsWith("data:")) {
              const split = (p as any).image_url.url.split(",");
              const mimeType =
                split[0].split(":")[1]?.split(";")[0] || "image/jpeg";
              const data = split[1] || split[0];
              return { inlineData: { mimeType, data } };
            } else {
              // Support external URLs by mapping to fileData (Verified working on H-Chat Gateway)
              return {
                fileData: { mimeType: "image/jpeg", fileUri: p.image_url.url },
              };
            }
          }
          if (p.type === "file") {
            if (p.file.file_data) {
              return {
                inlineData: {
                  mimeType: "application/pdf",
                  data: p.file.file_data,
                },
              };
            } else if (p.file.file_id) {
              // Google's fileData expects a URI, usually from the File API
              return {
                fileData: {
                  mimeType: "application/pdf",
                  fileUri: p.file.file_id,
                },
              };
            }
          }
          return { text: "" };
        });
      }

      // Handle tool_calls for assistant messages
      if (m.role === "assistant" && (m as any).tool_calls) {
        const toolParts = (m as any).tool_calls.map((tc: any) => ({
          functionCall: {
            name: tc.function.name,
            args: JSON.parse(tc.function.arguments),
          },
        }));
        parts.push(...toolParts);
      }

      // Handle top-level refusal for assistant messages
      if (m.role === "assistant" && (m as any).refusal) {
        parts.unshift({ text: `[Refusal]: ${(m as any).refusal}` });
      }

      // Gemini requires at least one part
      if (parts.length === 0) {
        parts.push({ text: "" });
      }

      return {
        role: m.role === "assistant" ? "model" : "user",
        parts,
      };
    });
  }

  private static convertToolChoice(
    toolChoice: ToolChoice | string | null | undefined
  ): ToolConfig {
    if (typeof toolChoice === "string") {
      if (toolChoice === "none") {
        return { functionCallingConfig: { mode: "NONE" as any } };
      }
      if (toolChoice === "auto") {
        return { functionCallingConfig: { mode: "AUTO" as any } };
      }
      if (toolChoice === "required" || toolChoice === "any") {
        return { functionCallingConfig: { mode: "ANY" as any } };
      }
    }

    if (toolChoice && typeof toolChoice === "object") {
      if (toolChoice.type === "function" && toolChoice.function?.name) {
        return {
          functionCallingConfig: {
            mode: "ANY" as any,
            allowedFunctionNames: [toolChoice.function.name],
          },
        };
      }
    }

    return { functionCallingConfig: { mode: "AUTO" as any } };
  }

  private static mapStopReason(
    reason: string | null | undefined
  ): Choice["finish_reason"] {
    if (!reason) return "stop";
    const r = reason.toLowerCase();
    if (r === "max_tokens" || r === "max_completion_tokens") return "length";
    if (r === "stop" || r === "end_turn" || r === "stop_sequence")
      return "stop";
    if (r === "safety" || r === "recitation" || r === "content_filter")
      return "content_filter";
    // Default to 'stop' for unknown reasons to satisfy union type
    return "stop";
  }

  private static cleanSchema(schema: Record<string, any> | any[] | any): any {
    if (!schema || typeof schema !== "object") return schema;

    // Handle array of schemas
    if (Array.isArray(schema)) {
      return schema.map((item) => this.cleanSchema(item));
    }

    // Capture definitions if they exist at this level (usually the root)
    const definitions = schema.definitions || schema.$defs || {};

    // Recursive helper to dereference and clean
    const processNode = (node: any, defs: any): any => {
      if (!node || typeof node !== "object") return node;

      if (Array.isArray(node)) {
        return node.map((item) => processNode(item, defs));
      }

      // Handle $ref (OpenAI format: #/definitions/Name)
      if (node.$ref && typeof node.$ref === "string") {
        const refPath = node.$ref;
        let resolved = node;

        if (refPath.startsWith("#/definitions/")) {
          const refName = refPath.replace("#/definitions/", "");
          if (defs[refName]) {
            resolved = { ...defs[refName] };
          }
        } else if (refPath.startsWith("#/$defs/")) {
          const refName = refPath.replace("#/$defs/", "");
          if (defs[refName]) {
            resolved = { ...defs[refName] };
          }
        }

        // If we resolved it, process the resolved node (it might contain more refs)
        if (resolved !== node) {
          // Important: also merge description/default from the ref node if they exist
          const { $ref, ...refMetadata } = node;
          return processNode({ ...resolved, ...refMetadata }, defs);
        }
      }

      // Strip unsupported fields that cause 400 errors in Gemini
      const {
        $schema,
        $ref,
        ref,
        additionalProperties,
        definitions: _defs,
        $defs: _sdefs,
        ...rest
      } = node;

      const result: any = { ...rest };
      for (const key of Object.keys(result)) {
        if (typeof result[key] === "object") {
          result[key] = processNode(result[key], defs);
        }
      }
      return result;
    };

    return processNode(schema, definitions);
  }
}
