import {
  AnthropicRequest,
  AnthropicResponse,
  AnthropicStreamResponse,
  InputMessage,
  ThinkingType,
  ToolChoice as AnthropicToolChoice,
  ToolChoiceType,
  ToolType,
  WebSearchTool,
  MessageStart,
  ContentBlockDelta,
  MessageDelta,
} from "../types/Anthropic.types";
import {
  CompletionRequest,
  CompletionResponse,
  CompletionChunk,
  Tool,
  ToolChoice,
  RequestMessages,
} from "../types";

/**
 * AnthropicNativeMapper
 * Handles the conversion between OpenAI standard types and Anthropic Claude API types.
 */
export class AnthropicMapper {
  public static toNativeRequest(request: CompletionRequest): AnthropicRequest {
    const { messages, system } = this.convertMessages(request.messages);
    const anthropicRequest: AnthropicRequest = {
      model: request.model,
      messages: messages,
      system: system,
      max_tokens: request.max_completion_tokens ?? 4096,
      temperature:
        request.temperature !== undefined && request.temperature !== null
          ? request.temperature / 2
          : undefined,
      top_p:
        request.temperature !== undefined && request.temperature !== null
          ? undefined
          : request.top_p ?? undefined,
      stop_sequences: Array.isArray(request.stop)
        ? request.stop
        : request.stop
        ? [request.stop]
        : undefined,
      stream: request.stream ?? undefined,
      // tool_choice는 현재 통과되지 않음. 무시
      // tool_choice: request.tool_choice ? this.convertToolChoice(request.tool_choice) : undefined,
    };

    // Handle Built-in Tools (Web Search)
    if (request.web_search_options) {
      if (!anthropicRequest.tools) {
        anthropicRequest.tools = [];
      }

      const searchTool: WebSearchTool = {
        type: ToolType.WEB_SEARCH_20250305,
        name: "web_search",
        max_uses: 5,
      };

      // Map location if provided
      if (request.web_search_options.user_location?.approximate) {
        const { city, country, region, timezone } =
          request.web_search_options.user_location.approximate;
        searchTool.user_location = {
          type: "approximate",
          city: city ?? null,
          country: country ?? null,
          region: region ?? null,
          timezone: timezone ?? null,
        };
      }

      anthropicRequest.tools.push(searchTool);
    }

    // Handle standard tools
    if (request.tools) {
      if (!anthropicRequest.tools) {
        anthropicRequest.tools = [];
      }
      anthropicRequest.tools.push(...this.convertTools(request.tools));
    }

    // Handle reasoning_effort / thinking / reasoning boolean
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
      const budget = budgetMap[effort] || 1024;
      anthropicRequest.thinking = {
        type: ThinkingType.ENABLED,
        budget_tokens: budget,
      };

      // Claude requires max_tokens > budget_tokens
      if (anthropicRequest.max_tokens <= budget) {
        anthropicRequest.max_tokens = budget + 4096; // Add buffer for content
      }

      // Claude requires temperature: 1.0 when thinking is enabled
      anthropicRequest.temperature = 1.0;
    }

    // Handle response_format (Beta)
    if (request.response_format) {
      if (request.response_format.type === "json_schema") {
        anthropicRequest.output_format = {
          type: "json_schema",
          json_schema: {
            name: request.response_format.json_schema.name,
            description: request.response_format.json_schema.description,
            schema: request.response_format.json_schema.schema || {},
            strict: request.response_format.json_schema.strict,
          },
        };
      } else if (request.response_format.type === "json_object") {
        // Hint the model to respond in JSON if json_object is requested
        const jsonHint =
          "\n\nIMPORTANT: Respond strictly in valid JSON format.";
        const lastMsg =
          anthropicRequest.messages[anthropicRequest.messages.length - 1];
        if (lastMsg && typeof lastMsg.content === "string") {
          lastMsg.content += jsonHint;
        } else if (lastMsg && Array.isArray(lastMsg.content)) {
          lastMsg.content.push({ type: "text", text: jsonHint });
        }
      }
    }

    return anthropicRequest;
  }

  public static fromNativeResponse(
    data: AnthropicResponse
  ): CompletionResponse {
    const usage = {
      prompt_tokens: data.usage?.input_tokens || 0,
      completion_tokens: data.usage?.output_tokens || 0,
      total_tokens:
        (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0),
      prompt_tokens_details: {
        cached_tokens: data.usage?.cache_read_input_tokens || 0,
        audio_tokens: 0, // Anthropic hasn't exposed audio tokens in this structure yet
      },
      completion_tokens_details: {
        reasoning_tokens: data.content.reduce((acc, block) => {
          if (block.type === "thinking")
            return acc + Math.ceil(block.thinking.length / 4);
          return acc;
        }, 0),
        audio_tokens: 0,
        accepted_prediction_tokens: 0,
        rejected_prediction_tokens: 0,
      },
    };

    let content = "";

    data.content.forEach((block) => {
      if (block.type === "text") {
        content += block.text;
      } else if (block.type === "thinking") {
        content += `<think>\n${block.thinking}\n</think>\n`;
      } else if (block.type === "redacted_thinking") {
        content += `<think>\n[Redacted Thinking]\n</think>\n`;
      }
    });

    const tool_calls = data.content
      .filter((block) => block.type === "tool_use")
      .map((block) => ({
        id: (block as any).id,
        type: "function" as const,
        function: {
          name: (block as any).name,
          arguments: JSON.stringify((block as any).input),
        },
      }));

    // console.log('[Anthropic Response]', JSON.stringify(data, null, 2))
    return {
      id: data.id,
      object: "chat.completion",
      created: Date.now(),
      model: data.model,
      choices: [
        {
          index: 0,
          message: {
            role: "assistant",
            content: content || null,
            refusal: null,
            reasoning_content: null, // Industry standard moves reasoning to <think> tag
            tool_calls: tool_calls.length > 0 ? tool_calls : undefined,
          },
          finish_reason: AnthropicMapper.mapStopReason(data.stop_reason),
        },
      ],
      usage: usage,
    };
  }

  private static mapStopReason(reason: string | null | undefined): any {
    if (!reason) return "stop";
    const r = reason.toLowerCase();
    if (r === "max_tokens" || r === "max_completion_tokens") return "length";
    if (r === "end_turn" || r === "stop_sequence" || r === "stop")
      return "stop";
    if (r === "tool_use") return "tool_calls";
    if (r === "content_filter" || r === "recitation") return "content_filter";
    return r;
  }

  public static fromNativeStreamChunk(
    rawChunk: any,
    request?: CompletionRequest
  ): CompletionChunk | null {
    const type = rawChunk.type;
    const isThinkingRequest =
      (request?.reasoning_effort && request.reasoning_effort !== "none") ||
      (request as any)?.reasoning === true;

    switch (type) {
      case "message_start":
        const start = rawChunk as MessageStart;
        return {
          id: start.message?.id || "",
          object: "chat.completion.chunk",
          created: Date.now(),
          model: start.message?.model || "unknown",
          choices: [
            {
              index: 0,
              delta: { role: "assistant" },
              finish_reason: null,
            },
          ],
          usage: start.message?.usage
            ? {
                prompt_tokens: start.message.usage.input_tokens || 0,
                completion_tokens: start.message.usage.output_tokens || 0,
                total_tokens:
                  (start.message.usage.input_tokens || 0) +
                  (start.message.usage.output_tokens || 0),
                prompt_tokens_details: {
                  cached_tokens:
                    (start.message.usage as any).cache_read_input_tokens || 0,
                  audio_tokens: 0,
                },
              }
            : undefined,
        };
      case "content_block_start":
        const startBlock = rawChunk as any;
        if (startBlock.content_block?.type === "tool_use") {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: [
              {
                index: 0,
                delta: {
                  // If this is index 1 and it's a thinking request, we close the thinking block at index 0
                  content:
                    isThinkingRequest && startBlock.index === 1
                      ? "\n</think>\n"
                      : undefined,
                  tool_calls: [
                    {
                      index: startBlock.index,
                      id: startBlock.content_block.id,
                      type: "function",
                      function: {
                        name: startBlock.content_block.name,
                        arguments: "",
                      },
                    },
                  ],
                },
                finish_reason: null,
              },
            ],
          };
        } else if (startBlock.content_block?.type === "thinking") {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: [
              {
                index: 0,
                delta: { content: "<think>\n" },
                finish_reason: null,
              },
            ],
          };
        } else if (startBlock.content_block?.type === "text") {
          if (isThinkingRequest && startBlock.index === 1) {
            return {
              id: "",
              object: "chat.completion.chunk",
              created: Date.now(),
              model: "",
              choices: [
                {
                  index: 0,
                  delta: { content: "\n</think>\n" },
                  finish_reason: null,
                },
              ],
            };
          }
        }
        break;
      case "content_block_delta":
        const delta = rawChunk as any;
        if (delta.delta?.type === "text_delta") {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: [
              {
                index: 0,
                delta: {
                  content: delta.delta.text || null,
                },
                finish_reason: null,
              },
            ],
          };
        } else if (delta.delta?.type === "thinking_delta") {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: [
              {
                index: 0,
                delta: { content: delta.delta.thinking },
                finish_reason: null,
              },
            ],
            usage: {
              prompt_tokens: 0,
              completion_tokens: 0,
              total_tokens: 0,
              completion_tokens_details: {
                reasoning_tokens: Math.ceil(delta.delta.thinking.length / 4),
                audio_tokens: 0,
                accepted_prediction_tokens: 0,
                rejected_prediction_tokens: 0,
              },
            },
          };
        } else if (delta.delta?.type === "input_json_delta") {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: [
              {
                index: 0,
                delta: {
                  tool_calls: [
                    {
                      index: delta.index,
                      function: {
                        arguments: delta.delta.partial_json,
                      },
                    },
                  ],
                },
                finish_reason: null,
              },
            ],
          };
        }
        break;
      case "content_block_stop":
        // Removed blind closing of <think> tags.
        // Now handled by content_block_start of next block or message_delta.
        break;
      case "message_delta":
        const msgDelta = rawChunk as MessageDelta;
        if (msgDelta.usage || msgDelta.delta?.stop_reason) {
          return {
            id: "",
            object: "chat.completion.chunk",
            created: Date.now(),
            model: "",
            choices: msgDelta.delta?.stop_reason
              ? [
                  {
                    index: 0,
                    delta: {
                      // If message is stopping and it's a thinking request, add closing tag
                      // Note: In case the message stops within block 0 (thinking)
                      content:
                        isThinkingRequest &&
                        msgDelta.delta.stop_reason !== "end_turn"
                          ? "\n</think>\n"
                          : undefined,
                    },
                    finish_reason: AnthropicMapper.mapStopReason(
                      msgDelta.delta.stop_reason
                    ),
                  },
                ]
              : [],
            usage: msgDelta.usage
              ? {
                  prompt_tokens: 0,
                  completion_tokens: msgDelta.usage.output_tokens || 0,
                  total_tokens: msgDelta.usage.output_tokens || 0,
                  completion_tokens_details: {
                    reasoning_tokens: 0,
                    audio_tokens: 0,
                    accepted_prediction_tokens: 0,
                    rejected_prediction_tokens: 0,
                  },
                }
              : undefined,
          };
        }
        break;
      case "message_stop":
        return {
          id: "",
          object: "chat.completion.chunk",
          created: Date.now(),
          model: "",
          choices: [
            {
              index: 0,
              delta: {},
              finish_reason: null, // Already sent in message_delta
            },
          ],
        };
    }
    return null;
  }

  private static convertMessages(messages: RequestMessages[]): {
    messages: any[];
    system: string | undefined;
  } {
    let systemPrompt = "";
    const filteredMessages = messages.filter((m) => {
      if (m.role === "system") {
        systemPrompt +=
          (systemPrompt ? "\n" : "") +
          (typeof m.content === "string"
            ? m.content
            : JSON.stringify(m.content));
        return false;
      }
      return true;
    });

    const convertedMessages = filteredMessages.map((m) => {
      if (m.role === "tool") {
        let toolContent =
          typeof m.content === "string" ? m.content : JSON.stringify(m.content);
        if (!toolContent || toolContent.trim() === "")
          toolContent = "Result processed.";
        return {
          role: "user",
          content: [
            {
              type: "tool_result",
              tool_use_id: m.tool_call_id,
              content: toolContent,
            },
          ],
        };
      }

      const role = m.role === "assistant" ? "assistant" : "user";
      let content: any = m.content || "";

      if (Array.isArray(m.content)) {
        content = (m.content as any[])
          .map((part) => {
            if (part.type === "text") {
              return part.text && part.text.trim()
                ? { type: "text", text: part.text }
                : null;
            }
            if (part.type === "refusal") {
              return { type: "text", text: `[Refusal]: ${part.refusal}` };
            }
            if (part.type === "image_url") {
              if (part.image_url.url.startsWith("data:")) {
                const split = (part as any).image_url.url.split(",");
                const mediaType =
                  split[0].split(":")[1]?.split(";")[0] || "image/jpeg";
                const data = split[1] || split[0];
                return {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mediaType as any,
                    data,
                  },
                };
              }
              return {
                type: "text",
                text: `[Image URL: ${part.image_url.url}]`,
              };
            }
            if (part.type === "file") {
              const source: any = {};
              if (part.file.file_data) {
                source.type = "base64";
                source.media_type = "application/pdf";
                source.data = part.file.file_data;
              } else if (part.file.file_id) {
                source.type = "file";
                source.file_id = part.file.file_id;
              }
              return { type: "document", source } as any;
            }
            return null;
          })
          .filter((p) => p !== null);
      } else if (m.role === "assistant" && (m as any).refusal) {
        const refusalText = `[Refusal]: ${(m as any).refusal}`;
        const assistantContent = typeof m.content === "string" ? m.content : "";
        content = assistantContent
          ? `${refusalText}\n\n${assistantContent}`
          : refusalText;
      }

      const msg: any = { role, content };

      if (m.role === "assistant" && m.tool_calls) {
        const toolUseBlocks = m.tool_calls
          .map((tc) => {
            if (tc.type === "function") {
              return {
                type: "tool_use",
                id: tc.id,
                name: tc.function.name,
                input: JSON.parse(tc.function.arguments),
              };
            }
            if (tc.type === "custom") {
              return {
                type: "tool_use",
                id: tc.id,
                name: tc.custom.name,
                input: JSON.parse(tc.custom.input),
              };
            }
            return null;
          })
          .filter(Boolean) as any[];

        if (Array.isArray(content)) {
          msg.content = [...content, ...toolUseBlocks];
        } else {
          const contentBlocks: any[] = [];
          if (typeof content === "string" && content.trim()) {
            contentBlocks.push({ type: "text", text: content });
          } else if (Array.isArray(content) && content.length > 0) {
            contentBlocks.push(...content);
          }
          msg.content = [...contentBlocks, ...toolUseBlocks];
        }

        // Anthropic requires a non-empty content for assistant messages if tool_calls is not mapped to the direct field (which it isn't here, it's mapped to content blocks)
        if (msg.content.length === 0) {
          msg.content = [{ type: "text", text: "Processing..." }];
        }
      }

      // Final check for empty content in any message
      if (
        !msg.content ||
        (Array.isArray(msg.content) && msg.content.length === 0) ||
        (typeof msg.content === "string" && msg.content.trim() === "")
      ) {
        msg.content = role === "assistant" ? "..." : " ";
      }

      return msg;
    });

    return {
      messages: convertedMessages,
      system: systemPrompt || undefined,
    };
  }

  private static convertTools(tools: Tool[]): any[] {
    return tools
      .map((t) => {
        if (t.type === "function") {
          return {
            name: t.function.name,
            description: t.function.description,
            input_schema: t.function.parameters,
          };
        }
        // Anthropic native types also support 'CUSTOM' tool type matching our CustomTool
        if (t.type === "custom") {
          return {
            type: "custom",
            name: t.custom.name,
            description: t.custom.description,
            input_schema: { type: "object" }, // Custom tools often handle raw text or specific formats
          };
        }
        return null;
      })
      .filter(Boolean);
  }

  private static convertToolChoice(
    toolChoice: ToolChoice
  ): AnthropicToolChoice {
    if (typeof toolChoice === "string") {
      if (toolChoice === "auto") return { type: ToolChoiceType.AUTO };
      if (toolChoice === "required") return { type: ToolChoiceType.ANY };
      if (toolChoice === "none") return { type: ToolChoiceType.NONE };
    }
    if (toolChoice.type === "function") {
      return { type: ToolChoiceType.TOOL, name: toolChoice.function.name };
    }
    if (toolChoice.type === "custom") {
      return { type: ToolChoiceType.TOOL, name: toolChoice.custom.name };
    }
    return { type: ToolChoiceType.AUTO };
  }
}
