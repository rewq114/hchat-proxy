import { ChatCompletionRole } from './Message.types'
import { Usage, TokenLogprob } from './Response.types'

export interface CompletionChunk {
    choices: StreamChoice[]
    created: number
    id: string
    model: string
    object: 'chat.completion.chunk'
    service_tier?: 'auto' | 'default' | 'flex' | 'priority' | null
    system_fingerprint?: string
    usage?: Usage | null
}

export interface StreamChoice {
    delta: StreamDelta
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'null' | 'function_call' | null
    index: number
    logprobs?: {
        content: TokenLogprob[] | null
        refusal: TokenLogprob[] | null
    } | null
}

export interface StreamDelta {
    content?: string | null
    refusal?: string | null
    reasoning_content?: string | null
    role?: 'assistant'
    tool_calls?: {
        index: number
        function?: {
            name?: string
            arguments?: string
        }
        id?: string
        type?: 'function'
    }[]
}
