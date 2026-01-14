// OpenAI Chat Completions API Types
// Based on: https://platform.openai.com/docs/api-reference/chat

export interface AzureRequest {
  model: string // 필수: 응답 생성에 사용할 모델 ID (예: gpt-4o, o3). OpenAI는 다양한 기능, 성능 특성, 가격대를 가진 다양한 모델을 제공합니다. 모델 가이드를 참조하여 사용 가능한 모델을 탐색하고 비교하세요.
  messages: ChatMessage[] // 필수: 지금까지의 대화를 구성하는 메시지 목록.
  max_tokens?: number | null // 선택사항
  max_completion_tokens?: number | null // 선택사항
  metadata?: Record<string, string> // 선택사항: 객체에 첨부할 수 있는 16개의 키-값 쌍 세트. 구조화된 형식으로 객체에 대한 추가 정보를 저장하고 API나 대시보드를 통해 객체를 쿼리하는 데 유용할 수 있습니다.
  modalities?: Modality[] // 선택사항: 모델이 생성할 출력 타입. 대부분의 모델은 기본값인 텍스트를 생성할 수 있습니다: ["text"]. gpt-4o-audio-preview 모델은 오디오도 생성할 수 있습니다.
  n?: number | null // 선택사항, 기본값: 1: 각 입력 메시지에 대해 생성할 채팅 완성 선택지 수. 생성된 모든 선택지의 토큰 수에 따라 요금이 부과됩니다. 비용을 최소화하려면 n을 1로 유지하세요.
  parallel_tool_calls?: boolean // 선택사항, 기본값: true: 도구 사용 중 병렬 함수 호출을 활성화할지 여부.
  prediction?: PredictionConfig // 선택사항: 예측된 출력에 대한 구성으로, 모델 응답의 큰 부분이 미리 알려져 있을 때 응답 시간을 크게 개선할 수 있습니다.
  presence_penalty?: number | null // 선택사항, 기본값: 0: -2.0과 2.0 사이의 숫자. 양수 값은 지금까지 텍스트에 나타나는지 여부에 따라 새 토큰에 페널티를 부여하여, 모델이 새로운 주제에 대해 이야기할 가능성을 높입니다.
  prompt_cache_key?: string // 선택사항: OpenAI가 유사한 요청에 대한 응답을 캐시하여 캐시 적중률을 최적화하는 데 사용됩니다. user 필드를 대체합니다.
  reasoning_effort?: ReasoningEffort // 선택사항, 기본값: medium: 추론 모델에 대한 추론 노력을 제한합니다. 현재 지원되는 값은 minimal, low, medium, high입니다. 추론 노력을 줄이면 더 빠른 응답과 응답에서 추론에 사용되는 더 적은 토큰을 얻을 수 있습니다.
  response_format?: ResponseFormat // 선택사항: 모델이 출력해야 하는 형식을 지정하는 객체. { "type": "json_schema", "json_schema": {...} }로 설정하면 구조화된 출력을 활성화하여 모델이 제공된 JSON 스키마와 일치하도록 보장합니다.
  safety_identifier?: string // 선택사항: 애플리케이션 사용자가 OpenAI의 사용 정책을 위반할 수 있는지 감지하는 데 도움이 되는 안정적인 식별자. 각 사용자를 고유하게 식별하는 문자열이어야 합니다.
  service_tier?: ServiceTier // 선택사항, 기본값: auto: 요청 제공에 사용되는 처리 타입을 지정합니다. 'auto'로 설정하면 프로젝트 설정에 구성된 서비스 계층으로 요청이 처리됩니다.
  stop?: string | string[] | null // 선택사항, 기본값: null: API가 추가 토큰 생성을 중단할 최대 4개의 시퀀스. 반환된 텍스트는 중지 시퀀스를 포함하지 않습니다. 최신 추론 모델 o3 및 o4-mini에서는 지원되지 않습니다.
  store?: boolean | null // 선택사항, 기본값: false: 이 채팅 완성 요청의 출력을 모델 증류 또는 평가 제품에서 사용하기 위해 저장할지 여부.
  stream?: boolean | null // 선택사항, 기본값: false: true로 설정하면, 모델 응답 데이터가 생성되는 대로 서버 전송 이벤트를 사용하여 클라이언트로 스트리밍됩니다.
  stream_options?: StreamOptions // 선택사항, 기본값: null: 스트리밍 응답에 대한 옵션. stream: true로 설정했을 때만 설정하세요.
  temperature?: number // 선택사항: 사용할 샘플링 온도, 0과 2 사이
  tool_choice?: ToolChoice // 선택사항: 모델이 호출할 도구(있는 경우)를 제어합니다. none은 모델이 도구를 호출하지 않고 대신 메시지를 생성합니다. auto는 모델이 메시지 생성과 하나 이상의 도구 호출 중에서 선택할 수 있습니다. required는 모델이 하나 이상의 도구를 호출해야 합니다. 특정 도구를 지정하면 해당 도구를 강제로 호출합니다. 도구가 없을 때는 none이 기본값이고, 도구가 있을 때는 auto가 기본값입니다.
  tools?: Tool[] // 선택사항: 모델이 호출할 수 있는 도구 목록. 커스텀 도구나 함수 도구를 제공할 수 있습니다.
  top_logprobs?: number // 선택사항: 각 토큰 위치에서 반환할 가장 가능성이 높은 토큰 수를 지정하는 0과 20 사이의 정수로, 각각 관련 로그 확률과 함께 반환됩니다.
  top_p?: number // 선택사항, 기본값: 1: 온도 샘플링의 대안인 핵 샘플링으로, 모델이 top_p 확률 질량을 가진 토큰의 결과를 고려합니다. 0.1은 상위 10% 확률 질량을 구성하는 토큰만 고려한다는 의미입니다. 일반적으로 이 값이나 temperature 중 하나를 변경하는 것을 권장하지만 둘 다는 권장하지 않습니다.
  verbosity?: Verbosity // 선택사항, 기본값: medium: 모델 응답의 상세함을 제한합니다. 낮은 값은 더 간결한 응답을, 높은 값은 더 상세한 응답을 생성합니다.
  web_search_options?: WebSearchOptions // 선택사항: 응답에 사용할 관련 결과를 웹에서 검색하는 도구입니다.
}

export interface AzureResponse {
  id: string // 필수: 채팅 완성에 대한 고유 식별자
  object: 'chat.completion' // 필수: 객체 타입으로 항상 chat.completion입니다
  created: number // 필수: 채팅 완성이 생성된 시점의 Unix 타임스탬프(초)
  model: string // 필수: 채팅 완성에 사용된 모델
  choices: Choice[] // 필수: 채팅 완성 선택 목록. n이 1보다 크면 여러 개일 수 있습니다
  usage?: Usage // 선택사항: 완성 요청에 대한 사용량 통계
  service_tier?: ServiceTier // 선택사항: 요청 제공에 사용된 처리 타입을 지정합니다
}

// ============================================================================
// Streaming Response Types
// ============================================================================

export interface AzureChunk {
  id: string // 필수: 채팅 완성에 대한 고유 식별자. 각 청크는 동일한 ID를 가집니다
  object: 'chat.completion.chunk' // 필수: 객체 타입으로 항상 chat.completion.chunk입니다
  created: number // 필수: 채팅 완성이 생성된 시점의 Unix 타임스탬프(초). 각 청크는 동일한 타임스탬프를 가집니다
  model: string // 필수: 완성을 생성하는 데 사용된 모델
  choices: StreamChoice[] // 필수: 채팅 완성 선택 목록. n이 1보다 크면 여러 요소를 포함할 수 있습니다. stream_options: {"include_usage": true}로 설정한 경우 마지막 청크에서 비어있을 수 있습니다
  usage?: Usage | null // 선택사항: 완성 요청에 대한 사용량 통계. 마지막 청크에서만 포함됩니다
  service_tier?: ServiceTier // 선택사항: 요청 제공에 사용된 처리 타입을 지정합니다
}

export interface StreamChoice {
  index: number // 필수: 선택 목록에서의 선택 인덱스
  delta?: StreamDelta // 선택사항: 스트리밍 모델 응답에 의해 생성된 채팅 완성 델타
  finish_reason?: FinishReason | null // 선택사항: 모델이 토큰 생성을 중단한 이유
  logprobs?: LogProbs | null // 선택사항: 선택에 대한 로그 확률 정보
}

export interface StreamDelta {
  content?: string // 선택사항: 청크 메시지의 내용
  role?: string // 선택사항: 이 메시지 작성자의 역할
  tool_calls?: StreamToolCall[] // 선택사항: 모델에 의해 생성된 도구 호출
  refusal?: string // 선택사항: 모델에 의해 생성된 거부 메시지
}

export interface StreamToolCall {
  index: number // 필수: 도구 호출의 인덱스
  id?: string // 선택사항: 도구 호출의 ID
  type?: 'function' // 선택사항: 도구의 타입. 현재는 function만 지원됩니다
  function?: StreamFunctionCall // 선택사항: 모델이 호출한 함수
}

export interface StreamFunctionCall {
  name?: string // 선택사항: 호출할 함수의 이름
  arguments?: string // 선택사항: 함수를 호출할 때 사용할 인수로, 모델에 의해 JSON 형식으로 생성됩니다. 모델이 항상 유효한 JSON을 생성하지는 않으며, 함수 스키마에 정의되지 않은 매개변수를 환각할 수 있습니다. 함수를 호출하기 전에 코드에서 인수를 검증하세요
}

// ============================================================================
// Message Types (Union of all possible message types)
// ============================================================================

export type ChatMessage =
  | DeveloperMessage
  | SystemMessage
  | UserMessage
  | AssistantMessage
  | ToolMessage
  | FunctionMessage

// ============================================================================
// Developer Message (o1 models and newer)
// ============================================================================

export interface DeveloperMessage {
  role: 'developer'
  content: string | TextContentPart[]
  name?: string
}

// ============================================================================
// System Message
// ============================================================================

export interface SystemMessage {
  role: 'system'
  content: string | TextContentPart[]
  name?: string
}

// ============================================================================
// User Message
// ============================================================================

export interface UserMessage {
  role: 'user'
  content: string | UserContentPart[]
  name?: string
}

// ============================================================================
// Assistant Message
// ============================================================================

export interface AssistantMessage {
  role: 'assistant'
  content?: string | AssistantContentPart[] // 선택사항: 메시지의 내용
  name?: string
  tool_calls?: ToolCall[] // 선택사항: 모델에 의해 생성된 도구 호출
  refusal?: string // 선택사항: 모델에 의해 생성된 거부 메시지
  audio?: AudioOutput // 선택사항: 오디오 출력 모달리티가 요청된 경우, 모델의 오디오 응답에 대한 데이터를 포함하는 객체
  annotations?: Annotation[] // 선택사항: 웹 검색 도구 사용 시와 같이 해당하는 경우 메시지에 대한 주석
}

export interface AudioOutput {
  id: string // 필수: 이 오디오 응답에 대한 고유 식별자
  data: string // 필수: 요청에서 지정된 형식으로 모델에 의해 생성된 Base64 인코딩된 오디오 바이트
  transcript: string // 필수: 모델에 의해 생성된 오디오의 전사
  expires_at: number // 필수: 이 오디오 응답이 멀티턴 대화에서 사용하기 위해 서버에서 더 이상 접근할 수 없게 되는 Unix 타임스탬프(초)
}

export type Annotation = UrlCitation

export interface UrlCitation {
  type: 'url_citation' // 필수: URL 인용의 타입. 항상 url_citation입니다
  url_citation: {
    start_index: number // 필수: 메시지에서 URL 인용의 첫 번째 문자 인덱스
    end_index: number // 필수: 메시지에서 URL 인용의 마지막 문자 인덱스
    title: string // 필수: 웹 리소스의 제목
    url: string // 필수: 웹 리소스의 URL
  }
}

// ============================================================================
// Tool Message
// ============================================================================

export interface ToolMessage {
  role: 'tool'
  content: string | TextContentPart[]
  tool_call_id: string
}

// ============================================================================
// Function Message (Deprecated)
// ============================================================================

export interface FunctionMessage {
  role: 'function'
  content: string
  name: string
}

// ============================================================================
// Content Part Types
// ============================================================================

export type UserContentPart =
  | TextContentPart
  | ImageContentPart
  | AudioContentPart
  | FileContentPart

export type AssistantContentPart = TextContentPart | RefusalContentPart

export interface TextContentPart {
  type: 'text'
  text: string
}

export interface ImageContentPart {
  type: 'image_url'
  image_url: ImageURL
}

export interface AudioContentPart {
  type: 'input_audio'
  input_audio: AudioData
}

export interface FileContentPart {
  type: 'file'
  file: FileData
}

export interface RefusalContentPart {
  type: 'refusal'
  refusal: string
}

export interface ImageURL {
  url: string
  detail?: 'auto' | 'low' | 'high'
}

export interface AudioData {
  data: string // Base64 encoded audio data
  format: 'wav' | 'mp3'
}

export interface FileData {
  file_data?: string // Base64 encoded file data
  file_id?: string // ID of uploaded file
  filename?: string // Name of the file
}

export interface Choice {
  index: number // 필수: 선택 목록에서의 선택 인덱스
  message?: ChatMessage // 선택사항: 모델에 의해 생성된 채팅 완성 메시지
  delta?: ChatMessage // 선택사항: 스트리밍 응답에서의 메시지 델타
  logprobs?: LogProbs // 선택사항: 선택에 대한 로그 확률 정보
  finish_reason?: FinishReason // 선택사항: 모델이 토큰 생성을 중단한 이유
}

export enum FinishReason {
  STOP = 'stop', // 모델이 자연스러운 중지점이나 제공된 중지 시퀀스에 도달했을 때
  LENGTH = 'length', // 요청에서 지정된 최대 토큰 수에 도달했을 때
  TOOL_CALLS = 'tool_calls', // 모델이 도구를 호출했을 때
  CONTENT_FILTER = 'content_filter' // 콘텐츠 필터의 플래그로 인해 콘텐츠가 생략되었을 때
}

export type Tool = FunctionTool | CustomTool

// Function tool - 함수 도구
export interface FunctionTool {
  type: 'function' // 필수: 도구의 타입. 현재는 function만 지원됩니다.
  function: FunctionDefinition // 필수: 함수 정의
}

export interface FunctionDefinition {
  name: string // 필수: 호출할 함수의 이름. a-z, A-Z, 0-9, 언더스코어, 대시만 포함 가능하며 최대 64자입니다.
  description?: string // 선택사항: 함수가 무엇을 하는지에 대한 설명으로, 모델이 언제 어떻게 함수를 호출할지 선택하는 데 사용됩니다.
  parameters?: JSONSchema // 선택사항: 함수가 받는 매개변수로, JSON 스키마 객체로 설명됩니다. 매개변수를 생략하면 빈 매개변수 목록을 가진 함수가 정의됩니다.
  strict?: boolean // 선택사항, 기본값: false: 함수 호출을 생성할 때 엄격한 스키마 준수를 활성화할지 여부. true로 설정하면 모델이 parameters 필드에 정의된 정확한 스키마를 따릅니다.
}

// Custom tool - 커스텀 도구
export interface CustomTool {
  type: 'custom' // 필수: 커스텀 도구의 타입. 항상 custom입니다.
  custom: CustomToolDefinition // 필수: 커스텀 도구 정의
}

export interface CustomToolDefinition {
  name: string // 필수: 커스텀 도구의 이름으로, 도구 호출에서 식별하는 데 사용됩니다.
  description?: string // 선택사항: 커스텀 도구에 대한 선택적 설명으로, 더 많은 컨텍스트를 제공하는 데 사용됩니다.
  format?: CustomToolFormat // 선택사항: 커스텀 도구의 입력 형식. 기본값은 제약이 없는 텍스트입니다.
}

export type CustomToolFormat = TextFormat | GrammarFormat

// Text format - 제약이 없는 자유 형식 텍스트
export interface TextFormat {
  type: 'text' // 필수: 제약이 없는 텍스트 형식. 항상 text입니다.
}

// Grammar format - 사용자가 정의한 문법
export interface GrammarFormat {
  type: 'grammar' // 필수: 문법 형식. 항상 grammar입니다.
  grammar: GrammarDefinition // 필수: 선택한 문법
}

export enum GrammarSyntax {
  LARK = 'lark',
  REGEX = 'regex'
}

export interface GrammarDefinition {
  definition: string // 필수: 문법 정의
  syntax: GrammarSyntax // 필수: 문법 정의의 구문. lark 또는 regex 중 하나입니다.
}

export type ToolChoice = ToolChoiceMode | AllowedTools | FunctionToolChoice | CustomToolChoice

// Tool choice mode - 간단한 문자열 모드
export enum ToolChoiceMode {
  NONE = 'none',
  AUTO = 'auto',
  REQUIRED = 'required'
}

// Allowed tools - 허용된 도구들을 제한하는 객체
export interface AllowedTools {
  type: 'allowed_tools' // 필수: 허용된 도구 구성 타입. 항상 allowed_tools입니다.
  allowed_tools: {
    mode: ToolChoiceMode.AUTO | ToolChoiceMode.REQUIRED // 필수: 허용된 도구들을 사용하는 모델의 동작을 제한합니다.
    tools: Tool[] // 필수: 모델이 호출할 수 있어야 하는 도구 정의 목록
  }
}

// Function tool choice - 특정 함수 도구를 강제로 호출
export interface FunctionToolChoice {
  type: 'function' // 필수: 함수 호출의 경우 항상 function입니다.
  function: {
    name: string // 필수: 호출할 함수의 이름
  }
}

// Custom tool choice - 특정 커스텀 도구를 강제로 호출
export interface CustomToolChoice {
  type: 'custom' // 필수: 커스텀 도구 호출의 경우 항상 custom입니다.
  custom: {
    name: string // 필수: 호출할 커스텀 도구의 이름
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

export type ResponseFormat =
  | TextResponseFormat
  | JsonSchemaResponseFormat
  | JsonObjectResponseFormat

export interface TextResponseFormat {
  type: 'text' // 필수: 정의되는 응답 형식의 타입. 항상 text입니다.
}

export interface JsonSchemaResponseFormat {
  type: 'json_schema' // 필수: 정의되는 응답 형식의 타입. 항상 json_schema입니다.
  json_schema: JsonSchemaConfig // 필수: 구조화된 출력 구성 옵션, JSON 스키마를 포함합니다.
}

export interface JsonObjectResponseFormat {
  type: 'json_object' // 필수: 정의되는 응답 형식의 타입. 항상 json_object입니다.
}

export interface JsonSchemaConfig {
  name: string // 필수: 응답 형식의 이름. a-z, A-Z, 0-9이거나 밑줄과 대시를 포함해야 하며, 최대 64자 길이여야 합니다.
  description?: string // 선택사항: 응답 형식이 무엇을 위한 것인지에 대한 설명으로, 모델이 형식에 따라 어떻게 응답할지 결정하는 데 사용됩니다.
  schema?: JSONSchema // 선택사항: JSON 스키마 객체로 설명되는 응답 형식의 스키마입니다.
  strict?: boolean // 선택사항, 기본값: false: 출력을 생성할 때 엄격한 스키마 준수를 활성화할지 여부. true로 설정하면 모델이 항상 스키마 필드에 정의된 정확한 스키마를 따릅니다.
}

export interface LogProbs {
  content?: LogProbItem[] // 선택사항: 로그 확률 정보가 있는 메시지 콘텐츠 토큰 목록
  refusal?: LogProbItem[] // 선택사항: 로그 확률 정보가 있는 메시지 거부 토큰 목록
}

export interface LogProbItem {
  token: string // 필수: 토큰
  logprob: number // 필수: 이 토큰의 로그 확률. 상위 20개 가장 가능성이 높은 토큰에 속하는 경우. 그렇지 않으면 토큰이 매우 가능성이 낮다는 것을 나타내기 위해 -9999.0 값이 사용됩니다
  bytes?: number[] | null // 선택사항: 토큰의 UTF-8 바이트 표현을 나타내는 정수 목록. 문자가 여러 토큰으로 표현되고 올바른 텍스트 표현을 생성하기 위해 바이트 표현을 결합해야 하는 경우에 유용합니다. 토큰에 대한 바이트 표현이 없는 경우 null일 수 있습니다
  top_logprobs?: TopLogProbItem[] // 선택사항: 이 토큰 위치에서 가장 가능성이 높은 토큰과 그 로그 확률 목록. 드물게 요청된 top_logprobs 수보다 적은 수가 반환될 수 있습니다
}

export interface TopLogProbItem {
  token: string // 필수: 토큰
  logprob: number // 필수: 이 토큰의 로그 확률. 상위 20개 가장 가능성이 높은 토큰에 속하는 경우. 그렇지 않으면 토큰이 매우 가능성이 낮다는 것을 나타내기 위해 -9999.0 값이 사용됩니다
  bytes?: number[] | null // 선택사항: 토큰의 UTF-8 바이트 표현을 나타내는 정수 목록. 문자가 여러 토큰으로 표현되고 올바른 텍스트 표현을 생성하기 위해 바이트 표현을 결합해야 하는 경우에 유용합니다. 토큰에 대한 바이트 표현이 없는 경우 null일 수 있습니다
}

export interface Usage {
  prompt_tokens: number // 필수: 프롬프트의 토큰 수
  completion_tokens: number // 필수: 생성된 완성의 토큰 수
  total_tokens: number // 필수: 요청에 사용된 총 토큰 수 (프롬프트 + 완성)
  completion_tokens_details?: CompletionTokensDetails // 선택사항: 완성에서 사용된 토큰의 세부 분석
  prompt_tokens_details?: PromptTokensDetails // 선택사항: 프롬프트에서 사용된 토큰의 세부 분석
}

export interface CompletionTokensDetails {
  accepted_prediction_tokens?: number // 선택사항: 예측된 출력을 사용할 때 완성에 나타난 예측의 토큰 수
  audio_tokens?: number // 선택사항: 모델에 의해 생성된 오디오 입력 토큰
  reasoning_tokens?: number // 선택사항: 모델에 의해 추론을 위해 생성된 토큰
  rejected_prediction_tokens?: number // 선택사항: 예측된 출력을 사용할 때 완성에 나타나지 않은 예측의 토큰 수. 그러나 추론 토큰과 마찬가지로 이러한 토큰은 여전히 청구, 출력 및 컨텍스트 창 제한 목적으로 총 완성 토큰에 계산됩니다
}

export interface PromptTokensDetails {
  audio_tokens?: number // 선택사항: 프롬프트에 있는 오디오 입력 토큰
  cached_tokens?: number // 선택사항: 프롬프트에 있는 캐시된 토큰
}

export interface JSONSchema {
  type: 'object' | 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'null'
  properties?: Record<string, JSONSchema>
  items?: JSONSchema | JSONSchema[]
  required?: string[]
  description?: string
  enum?: any[]
  additionalProperties?: boolean | JSONSchema
}

export interface OpenAIStreamResponse {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: Choice[]
  usage: Usage
  service_tier?: ServiceTier
}

export interface OpenAIError {
  error: {
    message: string
    type: string
    param?: string
    code?: string
  }
}

export enum Role {
  DEVELOPER = 'developer',
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool',
  FUNCTION = 'function'
}

// ============================================================================
// Additional Types for OpenAIRequest
// ============================================================================

export enum Modality {
  TEXT = 'text',
  AUDIO = 'audio'
}

export interface AudioOutput {
  format: AudioFormat // 필수: 출력 오디오 형식을 지정합니다. wav, mp3, flac, opus, pcm16 중 하나여야 합니다.
  voice: AudioVoice // 필수: 모델이 응답에 사용할 음성입니다. 지원되는 음성은 alloy, ash, ballad, coral, echo, fable, nova, onyx, sage, shimmer입니다.
}

export enum AudioFormat {
  WAV = 'wav',
  MP3 = 'mp3',
  FLAC = 'flac',
  OPUS = 'opus',
  PCM16 = 'pcm16'
}

export enum AudioVoice {
  ALLOY = 'alloy',
  ASH = 'ash',
  BALLAD = 'ballad',
  CORAL = 'coral',
  ECHO = 'echo',
  FABLE = 'fable',
  NOVA = 'nova',
  ONYX = 'onyx',
  SAGE = 'sage',
  SHIMMER = 'shimmer'
}

export interface PredictionConfig {
  type: 'content' // 필수: 제공하려는 예측된 콘텐츠의 타입. 현재 이 타입은 항상 content입니다.
  content: string | PredictionContentPart[] // 필수: 모델 응답을 생성할 때 일치해야 하는 콘텐츠입니다. 생성된 토큰이 이 콘텐츠와 일치하면 전체 모델 응답을 훨씬 더 빠르게 반환할 수 있습니다.
}

export interface PredictionContentPart {
  type: 'text' // 필수: 콘텐츠 파트의 타입
  text: string // 필수: 텍스트 콘텐츠
}

export enum ReasoningEffort {
  MINIMAL = 'minimal',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum Verbosity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export enum ServiceTier {
  AUTO = 'auto',
  DEFAULT = 'default',
  FLEX = 'flex',
  PRIORITY = 'priority'
}

export interface StreamOptions {
  include_obfuscation?: boolean
  include_usage?: boolean
}

export enum SearchContextSize {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

export interface WebSearchOptions {
  // Web search tool configuration
  search_context_size?: SearchContextSize
  user_location?: WebSearchUserLocation
}

export interface WebSearchUserLocation {
  type?: 'approximate'
  approximate?: {
    city?: string
    country?: string
    region?: string
    timezone?: string
  }
}

// ============================================================================
// Batch API Types
// ============================================================================

export interface OpenAIBatchRequest {
  input_file_id: string
  endpoint: '/v1/chat/completions' | '/v1/embeddings'
  completion_window: '24h'
  metadata?: Record<string, string>
}

export interface OpenAIBatchResponse {
  id: string
  object: 'batch'
  endpoint: string
  errors?: {
    object: 'list'
    data: {
      code: string
      message: string
      param?: string
      line?: number
    }[]
  }
  input_file_id: string
  completion_window: string
  status:
  | 'validating'
  | 'failed'
  | 'in_progress'
  | 'finalizing'
  | 'completed'
  | 'expired'
  | 'cancelling'
  | 'cancelled'
  output_file_id?: string
  error_file_id?: string
  created_at: number
  in_progress_at?: number
  expires_at?: number
  finalizing_at?: number
  completed_at?: number
  failed_at?: number
  cancelled_at?: number
  request_counts?: {
    total: number
    completed: number
    failed: number
  }
  metadata?: Record<string, string>
}

