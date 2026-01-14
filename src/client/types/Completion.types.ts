export interface CompletionRequest {
    /** ID of the model to use. */
    model: string
    /** A list of messages comprising the conversation so far. */
    messages: Messages[]
    /** Parameters for audio output. */
    audio?: {
        format: 'wav' | 'mp3' | 'flac' | 'opus' | 'pcm16'
        voice: 'alloy' | 'ash' | 'ballad' | 'coral' | 'echo' | 'fable' | 'nova' | 'onyx' | 'sage' | 'shimmer' | 'marin' | 'cedar' | { id: string }
    } | null
    /** Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency. */
    frequency_penalty?: number | null
    /** @deprecated Deprecated in favor of tool_choice. */
    function_call?: 'none' | 'auto' | { name: string }
    /** @deprecated Deprecated in favor of tools. */
    functions?: any[]
    /** Modify the likelihood of specified tokens appearing in the completion. */
    logit_bias?: Record<string, number> | null
    /** Whether to return log probabilities of the output tokens or not. */
    logprobs?: boolean | null
    /** An integer between 0 and 20 specifying the number of most likely tokens to return at each token position. */
    top_logprobs?: number | null
    /** The maximum number of tokens to generate in the chat completion. */
    max_completion_tokens?: number | null
    /** @deprecated Deprecated in favor of max_completion_tokens. */
    max_tokens?: number | null
    /** Set of 16 key-value pairs that can be attached to an object. */
    metadata?: Record<string, string> | null
    /** Output types that you would like the model to generate. */
    modalities?: ('text' | 'audio')[] | null
    /** How many chat completion choices to generate for each input message. */
    n?: number | null
    /** Whether to enable parallel tool calls. */
    parallel_tool_calls?: boolean
    /** Configuration for a Predicted Output. */
    prediction?: Prediction | null
    /** Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far. */
    presence_penalty?: number | null
    /** Replaces the user field for Maintaining caching optimizations. */
    prompt_cache_key?: string | null
    /** The retention policy for the prompt cache. e.g. '24h' */
    prompt_cache_retention?: string | null
    /** Constrains effort on reasoning for reasoning models. */
    reasoning_effort?: ReasoningEffort | null
    /** An object specifying the format that the model must output. */
    response_format?: ResponseFormat | null
    /** A stable identifier used to help detect users that may be violating OpenAI's usage policies. */
    safety_identifier?: string | null
    /** If specified, our system will make a best effort to sample deterministically. */
    seed?: number | null
    /** Specifies the processing type used for serving the request. */
    service_tier?: 'auto' | 'default' | 'flex' | 'priority' | null
    /** Up to 4 sequences where the API will stop generating further tokens. */
    stop?: string | string[] | null
    /** Whether or not to store the output of this chat completion request. */
    store?: boolean | null
    /** If set, partial message deltas will be sent. */
    stream?: boolean | null
    /** Options for streaming response. */
    stream_options?: {
        include_obfuscation?: boolean
        include_usage?: boolean
    } | null
    /** What sampling temperature to use, between 0 and 2. */
    temperature?: number | null
    /** Controls which (if any) tool is called by the model. */
    tool_choice?: ToolChoice | null
    /** A list of tools the model may call. */
    tools?: Tool[] | null
    /** An alternative to sampling with temperature, called nucleus sampling. */
    top_p?: number | null
    /** @deprecated Deprecated in favor of safety_identifier and prompt_cache_key. */
    user?: string | null
    /** Constrains the verbosity of the model's response. */
    verbosity?: 'low' | 'medium' | 'high' | null
    /** Options for the web search tool. */
    web_search_options?: WebSearchOptions | null
}

export type Prediction = {
    type: 'static'
    content: string | ContentPart[]
}

export type ResponseFormat =
    | { type: 'text' }
    | { type: 'json_object' }
    | {
        type: 'json_schema';
        json_schema: {
            name: string;
            description?: string;
            schema?: Record<string, any>;
            strict?: boolean
        }
    }

export type ReasoningEffort = 'none' | 'minimal' | 'low' | 'medium' | 'high' | 'xhigh'

export interface WebSearchOptions {
    /** Guidance for the context window space for search. */
    search_context_size?: 'low' | 'medium' | 'high'
    /** Approximate location parameters for the search. */
    user_location?: {
        approximate: {
            city?: string
            country?: string
            region?: string
            timezone?: string
            type: 'approximate'
        }
    } | null
}

export interface Messages {
    /** The role of the messages author. */
    role: 'developer' | 'system' | 'user' | 'assistant' | 'tool'
    /** The contents of the message. */
    content?: string | ContentPart[] | null
    /** An optional name for the participant. */
    name?: string
    /** Tool call that this message is responding to. */
    tool_call_id?: string
    /** The tool calls generated by the model, such as function calls. */
    tool_calls?: ToolCall[]
    /** The refusal message by the model. */
    refusal?: string | null
    /** Data about a previous audio response from the model. */
    audio?: { id: string }
}

export interface ContentPart {
    type: 'text' | 'image_url' | 'input_audio'
    text?: string
    image_url?: {
        url: string
        detail?: 'auto' | 'low' | 'high'
    }
    input_audio?: {
        data: string
        format: 'wav' | 'mp3'
    }
}

export type Tool = FunctionTool | CustomTool

export interface FunctionTool {
    type: 'function'
    function: {
        name: string
        description?: string
        parameters?: Record<string, any>
        strict?: boolean
    }
}

export interface CustomTool {
    type: 'custom'
    custom: {
        name: string
        description?: string
        format?: { type: 'text' } | { type: 'grammar'; grammar: { definition: string; syntax: 'lark' | 'regex' } }
    }
}

export interface ToolCall {
    id: string
    type: 'function' | 'custom'
    function?: {
        name: string
        arguments: string
    }
    custom?: {
        name: string
        arguments: string
    }
}

export type ToolChoice =
    | 'auto' | 'none' | 'required'
    | { type: 'function'; function: { name: string } }
    | { type: 'custom'; custom: { name: string } }
    | { type: 'allowed_tools'; allowed_tools: { mode: 'auto' | 'required'; tools: Tool[] } }

export interface CompletionResponse {
    id: string
    object: 'chat.completion'
    created: number
    model: string
    choices: Choice[]
    usage: Usage
    system_fingerprint?: string
    service_tier?: 'scale' | 'default' | 'flex' | 'priority'
}

export interface Choice {
    index: number
    message: Messages
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'null' | 'function_call'
    logprobs?: {
        content: TokenLogprob[] | null
        refusal: TokenLogprob[] | null
    } | null
}

export interface TokenLogprob {
    token: string
    logprob: number
    bytes: number[] | null
    top_logprobs: { token: string; logprob: number; bytes: number[] | null }[]
}

export interface Usage {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
    prompt_tokens_details?: {
        cached_tokens?: number
        audio_tokens?: number
    }
    completion_tokens_details?: {
        reasoning_tokens?: number
        audio_tokens?: number
        accepted_prediction_tokens?: number
        rejected_prediction_tokens?: number
    }
}

// Stream Types
export interface CompletionChunk {
    id: string
    object: 'chat.completion.chunk'
    created: number
    model: string
    choices: StreamChoice[]
    usage?: Usage
    system_fingerprint?: string
    service_tier?: 'scale' | 'default' | 'flex' | 'priority'
}

export interface StreamChoice {
    index: number
    delta: StreamDelta
    finish_reason: 'stop' | 'length' | 'tool_calls' | 'content_filter' | 'null' | 'function_call' | null
    logprobs?: {
        content: TokenLogprob[] | null
        refusal: TokenLogprob[] | null
    } | null
}

export interface StreamDelta {
    role?: 'developer' | 'system' | 'user' | 'assistant' | 'tool'
    content?: string | null
    refusal?: string | null
    tool_calls?: {
        index: number
        id?: string
        type?: 'function' | 'custom'
        function?: {
            name?: string
            arguments?: string
        }
        custom?: {
            name?: string
            arguments?: string
        }
    }[]
    audio?: {
        id?: string
        data?: string
        expires_at?: number
        transcript?: string
    }
}
