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

export type ToolCall = FunctionToolCall | CustomToolCall

export interface FunctionToolCall {
    id: string
    type: 'function'
    function: {
        name: string
        arguments: string
    }
}

export interface CustomToolCall {
    id: string
    type: 'custom'
    custom: {
        name: string
        input: string
    }
}

export type ToolChoice =
    | ToolChoiceMode
    | ToolChoiceFunction
    | ToolChoiceCustom
    | ToolChoiceAllowedTools

/** 'auto' is default if tools are present, 'none' is default if not. */
export type ToolChoiceMode = 'auto' | 'none' | 'required'

export interface ToolChoiceFunction {
    type: 'function'
    function: { name: string }
}

export interface ToolChoiceCustom {
    type: 'custom'
    custom: { name: string }
}

export interface ToolChoiceAllowedTools {
    type: 'allowed_tools'
    allowed_tools: {
        mode: 'auto' | 'required'
        tools: Tool[]
    }
}
