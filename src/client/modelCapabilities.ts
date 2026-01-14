// src/core/llm/capabilities/modelCapabilities.ts

import { ModelCapabilities } from "./types/Common.types";

// 기본 capabilities 생성 함수
export function createDefaultCapabilities(
  model: string,
  provider: string
): ModelCapabilities {
  return {
    model,
    provider,
    reasoning: {
      supported: false,
      includeOutput: false,
      effortControl: false,
      budgetControl: false,
    },
    tools: {
      functionCalling: false,
      toolChoice: true, // Default to true
      builtIn: [],
    },
    tokenLimits: {
      contextWindow: 4096,
      maxOutputTokens: 4096,
    },
    modality: {
      input: {
        text: true,
        image: {
          base64: true,
          url: true,
        },
        file: {
          base64: true,
          id: true,
        },
        video: false,
        audio: false,
      },
      output: {
        text: true,
        image: false,
      },
    },
    responseFormats: {
      json: false,
      structured: false,
    },
    stopSequences: true, // Default to true
  };
}

// capabilities 오버라이드 타입 정의
interface ModelCapabilitiesOverrides {
  reasoning?: Partial<ModelCapabilities["reasoning"]>;
  tools?: Partial<ModelCapabilities["tools"]>;
  tokenLimits?: Partial<ModelCapabilities["tokenLimits"]>;
  modality?: {
    input?: {
      text?: boolean;
      image?: Partial<ModelCapabilities["modality"]["input"]["image"]>;
      file?: Partial<ModelCapabilities["modality"]["input"]["file"]>;
      video?: boolean;
      audio?: boolean;
    };
    output?: Partial<ModelCapabilities["modality"]["output"]>;
  };
  responseFormats?: Partial<ModelCapabilities["responseFormats"]>;
  stopSequences?: boolean;
}

// capabilities 오버라이드 함수
function createModelCapabilities(
  model: string,
  provider: string,
  overrides: ModelCapabilitiesOverrides = {}
): ModelCapabilities {
  const defaults = createDefaultCapabilities(model, provider);

  return {
    ...defaults,
    reasoning: {
      ...defaults.reasoning,
      ...overrides.reasoning,
    },
    tools: {
      ...defaults.tools,
      ...overrides.tools,
    },
    tokenLimits: {
      ...defaults.tokenLimits,
      ...overrides.tokenLimits,
    },
    modality: {
      input: {
        ...defaults.modality.input,
        ...overrides.modality?.input,
        image: {
          ...defaults.modality.input.image,
          ...overrides.modality?.input?.image,
        },
        file: {
          ...defaults.modality.input.file,
          ...overrides.modality?.input?.file,
        },
      },
      output: {
        ...defaults.modality.output,
        ...overrides.modality?.output,
      },
    },
    responseFormats: {
      ...defaults.responseFormats,
      ...overrides.responseFormats,
    },
    stopSequences: overrides.stopSequences ?? defaults.stopSequences,
  };
}

// 모델별 capabilities 정의
// HChatGuide.html 의 '사용 모델 명' 테이블 기준
export const modelCapabilities: ModelCapabilities[] = [
  // OpenAI Family
  createModelCapabilities("gpt-5-mini", "azure", {
    reasoning: {
      supported: true,
      includeOutput: false,
      effortControl: true,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: [] },
    tokenLimits: { contextWindow: 128000, maxOutputTokens: 16384 },
    modality: {
      input: {
        image: { base64: true, url: true },
        file: { base64: false, id: false },
      },
    },
    responseFormats: { json: true, structured: true },
    stopSequences: false,
  }),
  createModelCapabilities("gpt-4.1", "azure", {
    reasoning: {
      supported: false,
      includeOutput: false,
      effortControl: false,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: [] },
    tokenLimits: { contextWindow: 128000, maxOutputTokens: 16384 },
    modality: {
      input: {
        image: { base64: true, url: true },
        file: { base64: false, id: false },
      },
    },
    responseFormats: { json: true, structured: true },
    stopSequences: false,
  }),
  createModelCapabilities("gpt-4o", "azure", {
    reasoning: {
      supported: false,
      includeOutput: false,
      effortControl: false,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: [] },
    tokenLimits: { contextWindow: 128000, maxOutputTokens: 4096 },
    modality: {
      input: {
        image: { base64: true, url: true },
        file: { base64: false, id: false },
      },
    },
    responseFormats: { json: true, structured: true },
    stopSequences: false,
  }),
  // createModelCapabilities('gpt-4.1-mini', 'azure', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: true, toolChoice: true, builtIn: [] },
  //   tokenLimits: { contextWindow: 128000, maxOutputTokens: 16384 },
  //   modality: { input: { image: { base64: true, url: true }, file: { base64: false, id: false } } },
  //   responseFormats: { json: true, structured: true },
  //   stopSequences: false
  // }),
  // createModelCapabilities('gpt-4o-mini', 'azure', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: true, toolChoice: true, builtIn: [] },
  //   tokenLimits: { contextWindow: 128000, maxOutputTokens: 16384 },
  //   modality: { input: { image: { base64: true, url: true }, file: { base64: false, id: false } } },
  //   responseFormats: { json: true, structured: true },
  //   stopSequences: false
  // }),

  // Claude Family
  createModelCapabilities("claude-sonnet-4-5", "anthropic", {
    reasoning: {
      supported: true,
      includeOutput: true,
      effortControl: true,
      budgetControl: true,
    },
    tools: { functionCalling: true, toolChoice: false, builtIn: [] },
    tokenLimits: { contextWindow: 200000, maxOutputTokens: 64000 },
    modality: {
      input: {
        image: { base64: true, url: false },
        file: { base64: true, id: true },
      },
    },
    responseFormats: { json: true, structured: false },
  }),
  createModelCapabilities("claude-haiku-4-5", "anthropic", {
    reasoning: {
      supported: true,
      includeOutput: true,
      effortControl: true,
      budgetControl: true,
    },
    tools: { functionCalling: true, toolChoice: false, builtIn: [] },
    tokenLimits: { contextWindow: 200000, maxOutputTokens: 64000 },
    modality: {
      input: {
        image: { base64: true, url: false },
        file: { base64: true, id: true },
      },
    },
    responseFormats: { json: true, structured: false },
  }),
  // createModelCapabilities('claude-sonnet-4', 'anthropic', {
  //   reasoning: { supported: true, includeOutput: true, effortControl: true, budgetControl: true },
  //   tools: { functionCalling: true, toolChoice: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 200000, maxOutputTokens: 8192 },
  //   modality: { input: { image: { base64: true, url: false }, file: { base64: true, id: true } } },
  //   responseFormats: { json: true, structured: false }
  // }),
  // createModelCapabilities('claude-3-7-sonnet', 'anthropic', {
  //   reasoning: { supported: true, includeOutput: true, effortControl: true, budgetControl: true },
  //   tools: { functionCalling: true, toolChoice: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 200000, maxOutputTokens: 8192 },
  //   modality: { input: { image: { base64: true, url: false }, file: { base64: true, id: true } } },
  //   responseFormats: { json: true, structured: false }
  // }),
  // createModelCapabilities('claude-3-5-sonnet-v2', 'anthropic', {
  //   reasoning: { supported: true, includeOutput: true, effortControl: true, budgetControl: true },
  //   tools: { functionCalling: true, toolChoice: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 200000, maxOutputTokens: 8192 },
  //   modality: { input: { image: { base64: true, url: false }, file: { base64: true, id: true } } },
  //   responseFormats: { json: true, structured: false }
  // }),

  // Gemini Family
  createModelCapabilities("gemini-2.5-pro", "google", {
    reasoning: {
      supported: true,
      includeOutput: true,
      effortControl: true,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: ["web_search"] },
    tokenLimits: { contextWindow: 1048576, maxOutputTokens: 8192 },
    modality: { input: { image: { base64: true, url: true } } },
    responseFormats: { json: true, structured: true },
  }),
  createModelCapabilities("gemini-2.5-flash", "google", {
    reasoning: {
      supported: true,
      includeOutput: true,
      effortControl: true,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: ["web_search"] },
    tokenLimits: { contextWindow: 1048576, maxOutputTokens: 8192 },
    modality: { input: { image: { base64: true, url: true } } },
    responseFormats: { json: true, structured: true },
  }),
  createModelCapabilities("gemini-2.5-flash-image", "google", {
    reasoning: {
      supported: true,
      includeOutput: true,
      effortControl: true,
      budgetControl: false,
    },
    tools: { functionCalling: true, toolChoice: true, builtIn: ["web_search"] },
    tokenLimits: { contextWindow: 1048576, maxOutputTokens: 8192 },
    modality: {
      input: { image: { base64: true, url: true } },
      output: { image: true },
    },
    responseFormats: { json: true, structured: true },
  }),
  // createModelCapabilities('gemini-1.5-flash', 'google', {
  //   reasoning: { supported: false },
  //   tools: { functionCalling: true, toolChoice: true, builtIn: ['web_search'] },
  //   tokenLimits: { contextWindow: 1048576, maxOutputTokens: 8192 },
  //   modality: { input: { image: { base64: true, url: true } } },
  //   responseFormats: { json: true, structured: true }
  // }),
  // createModelCapabilities('gemini-2.0-flash', 'google', {
  //   reasoning: { supported: false },
  //   tools: { functionCalling: true, toolChoice: true, builtIn: ['web_search'] },
  //   tokenLimits: { contextWindow: 1048576, maxOutputTokens: 8192 },
  //   modality: { input: { image: { base64: true, url: true } } },
  //   responseFormats: { json: true, structured: true }
  // }),

  // Ollama Family
  // createModelCapabilities('llama3', 'ollama', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 8192, maxOutputTokens: 4096 },
  //   modality: { input: { text: true } },
  //   responseFormats: { json: true, structured: false }
  // }),
  // createModelCapabilities('mistral', 'ollama', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 8192, maxOutputTokens: 4096 },
  //   modality: { input: { image: false } }, // Mistral usually text only in base
  //   responseFormats: { json: true, structured: false }
  // }),
  // createModelCapabilities('qwen3:4b', 'ollama', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 8192, maxOutputTokens: 4096 },
  //   modality: { input: { image: false } },
  //   responseFormats: { json: true, structured: false }
  // }),
  // createModelCapabilities('tinyllama', 'ollama', {
  //   reasoning: { supported: false, includeOutput: false, effortControl: false, budgetControl: false },
  //   tools: { functionCalling: false, builtIn: [] },
  //   tokenLimits: { contextWindow: 2048, maxOutputTokens: 1024 },
  //   modality: { input: { image: false } },
  //   responseFormats: { json: false, structured: false }
  // })
];
