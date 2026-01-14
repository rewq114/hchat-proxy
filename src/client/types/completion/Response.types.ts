import { ResponseMessage } from './Message.types'

export interface CompletionResponse {
    choices: Choice[]
    created: number
    id: string
    model: string
    object: 'chat.completion'
    service_tier?: 'auto' | 'default' | 'flex' | 'priority' | null
    system_fingerprint?: string
    usage: Usage
}

export interface Choice {
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'function_call'
    index: number
    logprobs?: {
        content: TokenLogprob[] | null
        refusal: TokenLogprob[] | null
    } | null
    message: ResponseMessage
}

export interface TokenLogprob {
    bytes: number[] | null
    token: string
    logprob: number
    top_logprobs: { bytes: number[] | null; logprob: number; token: string; }[]
}

export interface Usage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    completion_tokens_details?: {
        accepted_prediction_tokens: number
        audio_tokens: number
        reasoning_tokens: number
        rejected_prediction_tokens: number
    }
    prompt_tokens_details?: {
        audio_tokens: number
        cached_tokens: number
    }
}
