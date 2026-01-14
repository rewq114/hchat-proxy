/**
 * Common Types for HChat SDK
 */

export type Providers = 'anthropic' | 'google' | 'openai' | 'azure' | 'ollama'

export interface ModelInfo {
    model: string
    name: string
    maxToken: number
}

export interface ModelCapabilities {
    model: string
    provider: string
    reasoning: {
        supported: boolean
        includeOutput: boolean
        effortControl: boolean
        budgetControl: boolean
    }

    tools: {
        functionCalling: boolean
        toolChoice: boolean
        builtIn: string[]
    }

    tokenLimits: {
        contextWindow: number
        maxOutputTokens: number
        maxThinkingTokens?: number
    }

    modality: {
        input: {
            text: boolean
            image: {
                base64: boolean
                url: boolean
            }
            file: {
                base64: boolean
                id: boolean
            }
            video: boolean
            audio: boolean
        }
        output: {
            text: boolean
            image: boolean
        }
    }

    responseFormats: {
        json: boolean
        structured: boolean
    }
    stopSequences: boolean
}
