// OpenAI API Types
// Based on: https://platform.openai.com/docs/api-reference

// ============================================================================
// Core Request & Response Types (Most Important)
// ============================================================================

export interface OpenAIRequest {
  background?: boolean // 선택사항: 모델 응답을 백그라운드에서 실행할지 여부 (기본값: false)
  conversation?: string | ConversationObject // 선택사항: 이 응답이 속한 대화 (기본값: null)
  include?: IncludeOption[] // 선택사항: 모델 응답에 포함할 추가 출력 데이터 지정
  input?: string | InputItem[] // 선택사항: 모델에 대한 텍스트, 이미지 또는 파일 입력
  instructions?: string // 선택사항: 모델의 컨텍스트에 삽입되는 시스템(또는 개발자) 메시지
  max_output_tokens?: number // 선택사항: 응답에 대해 생성될 수 있는 토큰 수의 상한
  max_tool_calls?: number // 선택사항: 응답에서 처리될 수 있는 내장 도구에 대한 총 호출의 최대 수
  metadata?: Record<string, string> // 선택사항: 객체에 첨부할 수 있는 16개의 키-값 쌍 세트
  model?: string // 선택사항: 응답 생성에 사용할 모델 ID (예: gpt-4o, o3)
  parallel_tool_calls?: boolean // 선택사항: 모델이 도구 호출을 병렬로 실행할 수 있는지 여부 (기본값: true)
  previous_response_id?: string // 선택사항: 모델에 대한 이전 응답의 고유 ID
  prompt?: PromptReference // 선택사항: 프롬프트 템플릿과 그 변수에 대한 참조
  prompt_cache_key?: string // 선택사항: 유사한 요청에 대한 응답을 캐시하기 위해 OpenAI에서 사용
  reasoning?: ReasoningConfig // 선택사항: gpt-5 및 o-series 모델만 해당하는 추론 모델의 구성 옵션
  safety_identifier?: string // 선택사항: OpenAI 사용 정책을 위반할 수 있는 애플리케이션 사용자를 감지하는 데 도움이 되는 안정적인 식별자
  service_tier?: ServiceTier // 선택사항: 요청 제공에 사용되는 처리 유형 지정 (기본값: auto)
  store?: boolean // 선택사항: 생성된 모델 응답을 나중에 API를 통해 검색할 수 있도록 저장할지 여부 (기본값: true)
  stream?: boolean // 선택사항: 모델 응답 데이터를 생성되는 대로 서버 전송 이벤트를 사용하여 클라이언트로 스트리밍할지 여부 (기본값: false)
  stream_options?: StreamOptions // 선택사항: 스트리밍 응답에 대한 옵션 (stream: true일 때만 설정)
  temperature?: number // 선택사항: 사용할 샘플링 온도, 0과 2 사이 (기본값: 1)
  text?: TextConfig // 선택사항: 모델의 텍스트 응답에 대한 구성 옵션
  tool_choice?: ToolChoice // 선택사항: 응답을 생성할 때 모델이 어떤 도구(들)를 사용해야 하는지 선택하는 방법 (tools 매개변수 참조)
  tools?: Tool[] // 선택사항: 응답을 생성하는 동안 모델이 호출할 수 있는 도구 배열
  top_logprobs?: number // 선택사항: 각 토큰 위치에서 반환할 가장 가능성이 높은 토큰 수 (0-20 사이의 정수)
  top_p?: number // 선택사항: 온도로 샘플링하는 대안인 핵 샘플링 (기본값: 1)
  truncation?: TruncationStrategy // 선택사항: 모델 응답에 사용할 잘림 전략 (기본값: disabled)
  user?: string // 선택사항: 사용 중단됨 - safety_identifier와 prompt_cache_key로 대체됨
}

export interface OpenAIResponse {
  background?: boolean // 모델 응답이 백그라운드에서 실행되었는지 여부
  conversation?: ConversationObject // 이 응답이 속한 대화
  created_at: number // 이 응답이 생성된 Unix 타임스탬프 (초)
  error?: ResponseError // 모델이 응답을 생성하는 데 실패했을 때 반환되는 오류 객체
  id: string // 이 응답의 고유 식별자
  incomplete_details?: IncompleteDetails // 응답이 불완전한 이유에 대한 세부 정보
  instructions?: string | InputItem[] // 모델의 컨텍스트에 삽입된 시스템(또는 개발자) 메시지
  max_output_tokens?: number // 응답에 대해 생성될 수 있는 토큰 수의 상한
  max_tool_calls?: number // 응답에서 처리될 수 있는 내장 도구에 대한 총 호출의 최대 수
  metadata?: Record<string, string> // 객체에 첨부된 16개의 키-값 쌍 세트
  model: string // 응답 생성에 사용된 모델 ID (예: gpt-4o, o3)
  object: 'response' // 이 리소스의 객체 타입 - 항상 "response"로 설정
  output: Output[] // 모델이 생성한 콘텐츠 항목 배열
  output_text?: string // SDK 전용: 출력 배열의 모든 output_text 항목에서 집계된 텍스트 출력
  parallel_tool_calls?: boolean // 모델이 도구 호출을 병렬로 실행할 수 있는지 여부
  previous_response_id?: string // 모델에 대한 이전 응답의 고유 ID
  prompt?: PromptReference // 프롬프트 템플릿과 그 변수에 대한 참조
  prompt_cache_key?: string // 유사한 요청에 대한 응답을 캐시하기 위해 OpenAI에서 사용
  reasoning?: ReasoningConfig // gpt-5 및 o-series 모델만 해당하는 추론 모델의 구성 옵션
  safety_identifier?: string // OpenAI 사용 정책을 위반할 수 있는 애플리케이션 사용자를 감지하는 데 도움이 되는 안정적인 식별자
  service_tier?: ServiceTier // 요청 제공에 사용된 처리 유형
  status: ResponseStatus // 응답 생성의 상태
  temperature?: number // 사용된 샘플링 온도, 0과 2 사이
  text?: TextConfig // 모델의 텍스트 응답에 대한 구성 옵션
  tool_choice?: ToolChoice // 모델이 응답을 생성할 때 어떤 도구(들)를 사용해야 하는지 선택하는 방법 (tools 매개변수 참조)
  tools?: Tool[] // 응답을 생성하는 동안 모델이 호출할 수 있는 도구 배열
  top_logprobs?: number // 각 토큰 위치에서 반환된 가장 가능성이 높은 토큰 수
  top_p?: number // 온도로 샘플링하는 대안인 핵 샘플링
  truncation?: TruncationStrategy // 모델 응답에 사용된 잘림 전략
  usage?: Usage // 입력 토큰, 출력 토큰, 출력 토큰의 세부 분석, 사용된 총 토큰을 포함한 토큰 사용량 세부 정보
  user?: string // 사용 중단됨 - safety_identifier와 prompt_cache_key로 대체됨
}

// ============================================================================
// Enum Types
// ============================================================================

export enum ServiceTier {
  AUTO = 'auto', // 프로젝트 설정에 구성된 서비스 계층으로 요청 처리
  DEFAULT = 'default', // 선택된 모델에 대한 표준 가격 및 성능으로 처리
  FLEX = 'flex', // flex 서비스 계층으로 처리
  PRIORITY = 'priority' // priority 서비스 계층으로 처리
}

export enum TruncationStrategy {
  AUTO = 'auto', // 입력이 모델의 컨텍스트 창 크기를 초과하면 대화 시작 부분에서 항목을 삭제하여 컨텍스트 창에 맞게 응답을 잘라냄
  DISABLED = 'disabled' // 입력 크기가 모델의 컨텍스트 창 크기를 초과하면 400 오류로 요청 실패
}

export enum IncludeOption {
  WEB_SEARCH_CALL_ACTION_SOURCES = 'web_search_call.action.sources', // 웹 검색 도구 호출의 소스 포함
  CODE_INTERPRETER_CALL_OUTPUTS = 'code_interpreter_call.outputs', // 코드 인터프리터 도구 호출 항목의 Python 코드 실행 출력 포함
  COMPUTER_CALL_OUTPUT_IMAGE_URL = 'computer_call_output.output.image_url', // 컴퓨터 호출 출력의 이미지 URL 포함
  FILE_SEARCH_CALL_RESULTS = 'file_search_call.results', // 파일 검색 도구 호출의 검색 결과 포함
  MESSAGE_INPUT_IMAGE_IMAGE_URL = 'message.input_image.image_url', // 입력 메시지의 이미지 URL 포함
  MESSAGE_OUTPUT_TEXT_LOGPROBS = 'message.output_text.logprobs', // 어시스턴트 메시지와 함께 logprobs 포함
  REASONING_ENCRYPTED_CONTENT = 'reasoning.encrypted_content' // 추론 항목 출력에 추론 토큰의 암호화된 버전 포함
}

export enum ResponseStatus {
  COMPLETED = 'completed', // 응답이 완료됨
  FAILED = 'failed', // 응답 생성 실패
  IN_PROGRESS = 'in_progress', // 응답 생성 진행 중
  CANCELLED = 'cancelled', // 응답 생성 취소됨
  QUEUED = 'queued', // 응답 생성 대기 중
  INCOMPLETE = 'incomplete' // 응답이 불완전함
}

export enum IncompleteReason {
  MAX_TOKENS = 'max_tokens', // 최대 토큰 수에 도달
  MAX_TOOL_CALLS = 'max_tool_calls', // 최대 도구 호출 수에 도달
  CONTENT_FILTER = 'content_filter', // 콘텐츠 필터에 의해 차단
  SAFETY = 'safety', // 안전 정책에 의해 차단
  CANCELLED = 'cancelled', // 사용자에 의해 취소됨
  TIMEOUT = 'timeout' // 시간 초과
}

// ============================================================================
// Input & Conversation Types
// ============================================================================

export interface ConversationObject {
  id: string // 대화 ID
}

// InputItem은 InputMessage 또는 ItemReference가 될 수 있음
export type InputItem = InputMessage | Item | ItemReference

// InputMessage: 지시사항 계층 구조를 나타내는 역할이 있는 메시지 입력
export interface InputMessage {
  type?: 'message' // 메시지 입력 타입 (항상 "message")
  role: 'user' | 'assistant' | 'system' | 'developer' // 메시지 역할 (developer/system이 user보다 우선순위 높음)
  content: InputContentItem[] // 모델에 대한 하나 이상의 입력 항목 목록 (다양한 콘텐츠 타입 포함)
  status?: ItemStatus // 항목 상태 (API에서 반환될 때 채워짐)
}

// OutputMessage: 모델의 출력 메시지
export interface OutputMessage {
  type: 'message' // 출력 메시지 타입 (항상 "message")
  id: string // 출력 메시지의 고유 ID
  role: 'assistant' // 출력 메시지 역할 (항상 "assistant")
  content: OutputContentItem[] // 출력 메시지의 콘텐츠
  status: ItemStatus // 메시지 입력의 상태 (API에서 반환될 때 채워짐)
}

// Item: 응답 생성에 사용될 컨텍스트의 일부를 나타내는 항목
export type Item =
  | InputMessage
  | OutputMessage
  | FileSearchToolCall
  | ComputerToolCall
  | ComputerToolCallOutput
  | WebSearchToolCall
  | FunctionToolCall
  | FunctionToolCallOutput
  | Reasoning
  | ImageGenerationCall
  | CodeInterpreterToolCall
  | LocalShellCall
  | LocalShellCallOutput
  | MCPListTools
  | MCPApprovalRequest
  | MCPApprovalResponse
  | MCPToolCall
  | CustomToolCallOutput
  | CustomToolCall

// ItemReference: 항목을 참조하기 위한 내부 식별자
export interface ItemReference {
  id: string // 참조할 항목의 ID
  type?: 'item_reference' // 항목 참조 타입 (기본값: item_reference)
}

// InputContentItem: 입력 메시지 내용의 각 항목
export type InputContentItem = InputText | InputImage | InputFile | InputAudio

// OutputContentItem: 출력 메시지 내용의 각 항목
export type OutputContentItem = OutputText | Refusal | ReasoningContentItem

export interface InputText {
  type: 'input_text' // 입력 항목 타입 (항상 "input_text")
  text: string // 모델에 대한 텍스트 입력
}

export interface InputImage {
  type: 'input_image' // 입력 항목 타입 (항상 "input_image")
  detail: 'high' | 'low' | 'auto' // 모델에 전송될 이미지의 세부 수준 (기본값: auto)
  file_id?: string // 모델에 전송할 파일의 ID
  image_url?: string // 모델에 전송할 이미지의 URL (완전한 URL 또는 data URL의 base64 인코딩 이미지)
}

export interface InputFile {
  type: 'input_file' // 입력 항목 타입 (항상 "input_file")
  file_data?: string // 모델에 전송할 파일의 내용
  file_id?: string // 모델에 전송할 파일의 ID
  file_url?: string // 모델에 전송할 파일의 URL
  filename?: string // 파일명
}

export interface InputAudio {
  type: 'input_audio' // 입력 항목 타입 (항상 "input_audio")
  input_audio: {
    data: string // Base64 인코딩된 오디오 데이터
    format: 'mp3' | 'wav' // 오디오 데이터 형식
  }
}

// OutputText: 모델의 텍스트 출력
export interface OutputText {
  type: 'output_text' // 출력 텍스트 타입 (항상 "output_text")
  text: string // 모델의 텍스트 출력
  annotations: TextAnnotation[] // 텍스트 출력의 주석
  logprobs?: LogProbItem[] // 로그 확률 정보 (선택사항)
}

// TextAnnotation: 텍스트 출력의 주석
export type TextAnnotation = FileCitation | URLCitation | ContainerFileCitation | FilePath

// FileCitation: 파일에 대한 인용
export interface FileCitation {
  type: 'file_citation' // 파일 인용 타입 (항상 "file_citation")
  file_id: string // 파일의 ID
  filename: string // 인용된 파일의 파일명
  index: number // 파일 목록에서의 파일 인덱스
}

// URLCitation: 웹 리소스에 대한 인용
export interface URLCitation {
  type: 'url_citation' // URL 인용 타입 (항상 "url_citation")
  end_index: number // 메시지에서 URL 인용의 마지막 문자 인덱스
  start_index: number // 메시지에서 URL 인용의 첫 번째 문자 인덱스
  title: string // 웹 리소스의 제목
  url: string // 웹 리소스의 URL
}

// ContainerFileCitation: 컨테이너 파일에 대한 인용
export interface ContainerFileCitation {
  type: 'container_file_citation' // 컨테이너 파일 인용 타입 (항상 "container_file_citation")
  container_id: string // 컨테이너 파일의 ID
  end_index: number // 메시지에서 컨테이너 파일 인용의 마지막 문자 인덱스
  file_id: string // 파일의 ID
  filename: string // 인용된 컨테이너 파일의 파일명
  start_index: number // 메시지에서 컨테이너 파일 인용의 첫 번째 문자 인덱스
}

// FilePath: 파일에 대한 경로
export interface FilePath {
  type: 'file_path' // 파일 경로 타입 (항상 "file_path")
  file_id: string // 파일의 ID
  index: number // 파일 목록에서의 파일 인덱스
}

// LogProbItem: 로그 확률 항목
export interface LogProbItem {
  bytes: number[] // 바이트 배열
  logprob: number // 로그 확률
  token: string // 토큰
  top_logprobs: TopLogProbItem[] // 상위 로그 확률 항목들
}

// TopLogProbItem: 상위 로그 확률 항목
export interface TopLogProbItem {
  bytes: number[] // 바이트 배열
  logprob: number // 로그 확률
  token: string // 토큰
}

// Refusal: 모델의 거부
export interface Refusal {
  type: 'refusal' // 거부 타입 (항상 "refusal")
  refusal: string // 모델의 거부 설명
}

export enum ItemStatus {
  IN_PROGRESS = 'in_progress', // 진행 중
  COMPLETED = 'completed', // 완료됨
  INCOMPLETE = 'incomplete' // 불완전함
}

export interface PromptReference {
  id: string // 사용할 프롬프트 템플릿의 고유 식별자
  variables?: Record<string, any> // 프롬프트의 변수를 대체할 값들의 선택적 맵 (문자열 또는 다른 Response 입력 타입)
  version?: string // 프롬프트 템플릿의 선택적 버전
}

export interface ReasoningConfig {
  effort?: ReasoningEffort // 추론 모델의 추론 노력 제약 (기본값: medium)
  generate_summary?: ReasoningSummary // 사용 중단됨: summary 대신 사용
  summary?: ReasoningSummary // 모델이 수행한 추론의 요약 (디버깅 및 모델의 추론 과정 이해에 유용)
}

export enum ReasoningEffort {
  MINIMAL = 'minimal', // 최소 노력
  LOW = 'low', // 낮은 노력
  MEDIUM = 'medium', // 중간 노력 (기본값)
  HIGH = 'high' // 높은 노력
}

export enum ReasoningSummary {
  AUTO = 'auto', // 자동 요약
  CONCISE = 'concise', // 간결한 요약
  DETAILED = 'detailed' // 상세한 요약
}

export interface StreamOptions {
  include_obfuscation?: boolean // 스트림 난독화 활성화 여부 (기본값: true, 특정 사이드 채널 공격 완화를 위해 난독화 필드 추가)
}

export interface TextConfig {
  format?: TextFormat // 모델이 출력해야 하는 형식을 지정하는 객체
  verbosity?: TextVerbosity // 모델 응답의 상세함 제약 (기본값: medium)
}

export type TextFormat = TextFormatText | TextFormatJSONSchema | TextFormatJSONObject

export interface TextFormatText {
  type: 'text' // 응답 형식 타입 (항상 "text")
}

export interface TextFormatJSONSchema {
  type: 'json_schema' // 응답 형식 타입 (항상 "json_schema")
  name: string // 응답 형식의 이름 (a-z, A-Z, 0-9, 언더스코어, 대시 포함, 최대 64자)
  schema: Record<string, any> // JSON 스키마 객체로 설명된 응답 형식의 스키마
  description?: string // 응답 형식이 무엇인지에 대한 설명 (모델이 형식에 따라 응답하는 방법을 결정하는 데 사용)
  strict?: boolean // 출력 생성 시 엄격한 스키마 준수 활성화 여부 (기본값: false)
}

export interface TextFormatJSONObject {
  type: 'json_object' // 응답 형식 타입 (항상 "json_object")
}

export enum TextVerbosity {
  LOW = 'low', // 낮은 상세함
  MEDIUM = 'medium', // 중간 상세함 (기본값)
  HIGH = 'high' // 높은 상세함
}

// ============================================================================
// Tool Types
// ============================================================================

export type Tool =
  | FunctionTool
  | FileSearchTool
  | ComputerUseTool
  | WebSearchTool
  | MCPTool
  | CodeInterpreterTool
  | ImageGenerationTool
  | LocalShellTool
  | CustomTool
  | WebSearchPreviewTool

// Function Tool
export interface FunctionTool {
  type: 'function' // 도구 타입 (항상 "function")
  name: string // 호출할 함수의 이름
  parameters: Record<string, any> // 함수의 매개변수를 설명하는 JSON 스키마 객체
  strict: boolean // 엄격한 매개변수 유효성 검사 적용 여부 (기본값: true)
  description?: string // 함수에 대한 설명 (모델이 함수를 호출할지 결정하는 데 사용)
}

// File Search Tool
export interface FileSearchTool {
  type: 'file_search' // 도구 타입 (항상 "file_search")
  vector_store_ids: string[] // 검색할 벡터 스토어의 ID
  filters?: FileSearchFilter // 적용할 필터
  max_num_results?: number // 반환할 최대 결과 수 (1-50 사이)
  ranking_options?: FileSearchRankingOptions // 검색을 위한 순위 옵션
}

export type FileSearchFilter = FileSearchComparisonFilter | FileSearchCompoundFilter

export interface FileSearchComparisonFilter {
  key: string // 값과 비교할 키
  type: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' // 비교 연산자
  value: string | number | boolean // 속성 키와 비교할 값
}

export interface FileSearchCompoundFilter {
  filters: FileSearchFilter[] // 결합할 필터 배열
  type: 'and' | 'or' // 연산 유형
}

export interface FileSearchRankingOptions {
  ranker?: string // 파일 검색에 사용할 순위 지정자
  score_threshold?: number // 파일 검색의 점수 임계값 (0-1 사이)
}

// Computer Use Tool
export interface ComputerUseTool {
  type: 'computer_use_preview' // 도구 타입 (항상 "computer_use_preview")
  display_height: number // 컴퓨터 디스플레이의 높이
  display_width: number // 컴퓨터 디스플레이의 너비
  environment: string // 제어할 컴퓨터 환경 유형
}

// Web Search Tool
export interface WebSearchTool {
  type: 'web_search' | 'web_search_2025_08_26' // 도구 타입
  filters?: WebSearchFilters // 검색을 위한 필터
  search_context_size?: 'low' | 'medium' | 'high' // 검색에 사용할 컨텍스트 창 공간의 양에 대한 고급 가이드 (기본값: medium)
  user_location?: WebSearchUserLocation // 사용자의 대략적인 위치
}

export interface WebSearchFilters {
  allowed_domains?: string[] // 검색에 허용된 도메인 (기본값: [])
}

export interface WebSearchUserLocation {
  type?: 'approximate' // 위치 근사 유형 (기본값: approximate)
  city?: string // 사용자의 도시 (예: San Francisco)
  country?: string // 사용자의 두 글자 ISO 국가 코드 (예: US)
  region?: string // 사용자의 지역 (예: California)
  timezone?: string // 사용자의 IANA 시간대 (예: America/Los_Angeles)
}

// MCP Tool
export interface MCPTool {
  type: 'mcp' // 도구 타입 (항상 "mcp")
  server_label: string // 이 MCP 서버를 식별하는 데 사용되는 레이블
  allowed_tools?: string[] | MCPToolFilter // 허용된 도구 이름 목록 또는 필터 객체
  authorization?: string // 원격 MCP 서버와 함께 사용할 수 있는 OAuth 액세스 토큰
  connector_id?: string // 서비스 커넥터의 식별자
  headers?: Record<string, string> // MCP 서버에 보낼 선택적 HTTP 헤더
  require_approval?: MCPToolApprovalFilter | 'always' | 'never' // MCP 서버의 도구 중 승인이 필요한 도구 지정 (기본값: always)
  server_description?: string // MCP 서버의 선택적 설명
  server_url?: string // MCP 서버의 URL
}

export interface MCPToolFilter {
  read_only?: boolean // 도구가 데이터를 수정하는지 또는 읽기 전용인지 표시
  tool_names?: string[] // 허용된 도구 이름 목록
}

export interface MCPToolApprovalFilter {
  always?: MCPToolFilter // 항상 승인이 필요한 도구에 대한 필터 객체
  never?: MCPToolFilter // 승인이 필요하지 않은 도구에 대한 필터 객체
}

// Code Interpreter Tool
export interface CodeInterpreterTool {
  type: 'code_interpreter' // 도구 타입 (항상 "code_interpreter")
  container: string | CodeInterpreterContainerAuto // 코드 인터프리터 컨테이너
}

export interface CodeInterpreterContainerAuto {
  type: 'auto' // 항상 "auto"
  file_ids?: string[] // 코드에서 사용할 수 있도록 업로드된 파일의 선택적 목록
}

// Image Generation Tool
export interface ImageGenerationTool {
  type: 'image_generation' // 도구 타입 (항상 "image_generation")
  background?: 'transparent' | 'opaque' | 'auto' // 생성된 이미지의 배경 유형 (기본값: auto)
  input_fidelity?: 'high' | 'low' // 모델이 입력 이미지의 스타일과 특징을 얼마나 노력할지 제어 (기본값: low)
  input_image_mask?: ImageGenerationMask // 인페인팅을 위한 선택적 마스크
  model?: string // 사용할 이미지 생성 모델 (기본값: gpt-image-1)
  moderation?: string // 생성된 이미지의 조정 수준 (기본값: auto)
  output_compression?: number // 출력 이미지의 압축 수준 (기본값: 100)
  output_format?: 'png' | 'webp' | 'jpeg' // 생성된 이미지의 출력 형식 (기본값: png)
  partial_images?: number // 스트리밍 모드에서 생성할 부분 이미지 수 (기본값: 0, 최대 3)
  quality?: 'low' | 'medium' | 'high' | 'auto' // 생성된 이미지의 품질 (기본값: auto)
  size?: '1024x1024' | '1024x1536' | '1536x1024' | 'auto' // 생성된 이미지의 크기 (기본값: auto)
}

export interface ImageGenerationMask {
  file_id?: string // 마스크 이미지의 파일 ID
  image_url?: string // Base64 인코딩된 마스크 이미지
}

// Local Shell Tool
export interface LocalShellTool {
  type: 'local_shell' // 도구 타입 (항상 "local_shell")
}

// Custom Tool
export interface CustomTool {
  type: 'custom' // 도구 타입 (항상 "custom")
  name: string // 도구 호출에서 식별하는 데 사용되는 사용자 정의 도구의 이름
  description?: string // 사용자 정의 도구의 선택적 설명
  format?: CustomToolFormat // 사용자 정의 도구의 입력 형식 (기본값: 제한되지 않은 텍스트)
}

export type CustomToolFormat = CustomToolTextFormat | CustomToolGrammarFormat

export interface CustomToolTextFormat {
  type: 'text' // 제한되지 않은 자유 형식 텍스트 (항상 "text")
}

export interface CustomToolGrammarFormat {
  type: 'grammar' // 사용자가 정의한 문법 (항상 "grammar")
  definition: string // 문법 정의
  syntax: 'lark' | 'regex' // 문법 정의의 구문
}

// Web Search Preview Tool
export interface WebSearchPreviewTool {
  type: 'web_search_preview' | 'web_search_preview_2025_03_11' // 도구 타입
  search_context_size?: 'low' | 'medium' | 'high' // 검색에 사용할 컨텍스트 창 공간의 양에 대한 고급 가이드 (기본값: medium)
  user_location?: WebSearchUserLocation // 사용자의 위치
}

// ============================================================================
// Tool Choice Types
// ============================================================================
export type ToolChoice =
  | 'none' // 모델이 도구를 호출하지 않고 메시지만 생성
  | 'auto' // 모델이 메시지 생성과 도구 호출 중 선택 가능
  | 'required' // 모델이 반드시 하나 이상의 도구를 호출해야 함
  | ToolChoiceAllowedTools // 허용된 도구 세트로 제한
  | ToolChoiceHostedTool // 내장 도구 사용
  | ToolChoiceFunction // 특정 함수 호출
  | ToolChoiceMCP // MCP 서버의 특정 도구 호출
  | ToolChoiceCustom // 사용자 정의 도구 호출

export interface ToolChoiceAllowedTools {
  type: 'allowed_tools' // 허용된 도구 구성 타입 (항상 "allowed_tools")
  mode: 'auto' | 'required' // 모델이 사용할 수 있는 도구를 미리 정의된 세트로 제한
  tools: ToolChoiceToolDefinition[] // 모델이 호출할 수 있어야 하는 도구 정의 목록
}

export interface ToolChoiceHostedTool {
  type:
    | 'file_search' // 파일 검색 도구
    | 'web_search_preview' // 웹 검색 미리보기 도구
    | 'computer_use_preview' // 컴퓨터 사용 미리보기 도구
    | 'code_interpreter' // 코드 인터프리터 도구
    | 'image_generation' // 이미지 생성 도구
}

export interface ToolChoiceFunction {
  type: 'function' // 함수 호출의 경우 항상 "function"
  name: string // 호출할 함수의 이름
}

export interface ToolChoiceMCP {
  type: 'mcp' // MCP 도구의 경우 항상 "mcp"
  server_label: string // 사용할 MCP 서버의 레이블
  name?: string // 서버에서 호출할 도구의 이름
}

export interface ToolChoiceCustom {
  type: 'custom' // 사용자 정의 도구 호출의 경우 항상 "custom"
  name: string // 호출할 사용자 정의 도구의 이름
}

export type ToolChoiceToolDefinition =
  | { type: 'function'; name: string } // 함수 도구 정의
  | { type: 'mcp'; server_label: string } // MCP 서버 도구 정의
  | { type: 'image_generation' } // 이미지 생성 도구 정의

export interface ToolCall {
  id: string
  type: 'function'
  function: {
    name: string
    arguments: string
  }
}

// ============================================================================
// Output Types
// ============================================================================

export type Output =
  | OutputMessage
  | FileSearchToolCall
  | FunctionToolCall
  | WebSearchToolCall
  | ComputerToolCall
  | Reasoning
  | ImageGenerationCall
  | CodeInterpreterToolCall
  | LocalShellCall
  | MCPToolCall
  | MCPListTools
  | MCPApprovalRequest
  | CustomToolCall

// File Search Tool Call: 파일 검색 도구 호출의 결과
export interface FileSearchToolCall {
  type: 'file_search_call' // 파일 검색 도구 호출 타입 (항상 "file_search_call")
  id: string // 파일 검색 도구 호출의 고유 ID
  queries: string[] // 파일 검색에 사용된 쿼리들
  status: 'in_progress' | 'searching' | 'incomplete' | 'failed' // 파일 검색 도구 호출의 상태
  results?: FileSearchResult[] // 파일 검색 도구 호출의 결과 (선택사항)
}

// File Search Result: 파일 검색 결과
export interface FileSearchResult {
  attributes?: Record<string, string | boolean | number> // 객체에 첨부할 수 있는 16개의 키-값 쌍 세트
  file_id?: string // 파일의 고유 ID
  filename?: string // 파일명
  score?: number // 파일의 관련성 점수 (0-1 사이의 값)
  text?: string // 파일에서 검색된 텍스트
}

// Computer Tool Call: 컴퓨터 사용 도구에 대한 도구 호출
export interface ComputerToolCall {
  type: 'computer_call' // 컴퓨터 호출 타입 (항상 "computer_call")
  id: string // 컴퓨터 호출의 고유 ID
  call_id: string // 도구 호출에 대한 출력으로 응답할 때 사용되는 식별자
  action: ComputerAction // 컴퓨터 액션
  pending_safety_checks: PendingSafetyCheck[] // 컴퓨터 호출에 대한 대기 중인 안전 검사
  status: ItemStatus // 항목의 상태 (API에서 반환될 때 채워짐)
}

// Computer Action: 컴퓨터 액션
export type ComputerAction =
  | ClickAction
  | DoubleClickAction
  | DragAction
  | KeyPressAction
  | MoveAction
  | ScreenshotAction
  | ScrollAction
  | TypeAction
  | WaitAction

// Click Action: 클릭 액션
export interface ClickAction {
  type: 'click' // 이벤트 타입 (클릭 액션의 경우 항상 "click")
  button: 'left' | 'right' | 'wheel' | 'back' | 'forward' // 클릭 중에 눌린 마우스 버튼
  x: number // 클릭이 발생한 x 좌표
  y: number // 클릭이 발생한 y 좌표
}

// Double Click Action: 더블 클릭 액션
export interface DoubleClickAction {
  type: 'double_click' // 이벤트 타입 (더블 클릭 액션의 경우 항상 "double_click")
  x: number // 더블 클릭이 발생한 x 좌표
  y: number // 더블 클릭이 발생한 y 좌표
}

// Drag Action: 드래그 액션
export interface DragAction {
  type: 'drag' // 이벤트 타입 (드래그 액션의 경우 항상 "drag")
  path: Coordinate[] // 드래그 액션의 경로를 나타내는 좌표 배열
}

// Coordinate: 좌표
export interface Coordinate {
  x: number // x 좌표
  y: number // y 좌표
}

// Key Press Action: 키 누르기 액션
export interface KeyPressAction {
  type: 'keypress' // 이벤트 타입 (키 누르기 액션의 경우 항상 "keypress")
  keys: string[] // 모델이 누르기를 요청하는 키 조합 (각 키를 나타내는 문자열 배열)
}

// Move Action: 마우스 이동 액션
export interface MoveAction {
  type: 'move' // 이벤트 타입 (이동 액션의 경우 항상 "move")
  x: number // 이동할 x 좌표
  y: number // 이동할 y 좌표
}

// Screenshot Action: 스크린샷 액션
export interface ScreenshotAction {
  type: 'screenshot' // 이벤트 타입 (스크린샷 액션의 경우 항상 "screenshot")
}

// Scroll Action: 스크롤 액션
export interface ScrollAction {
  type: 'scroll' // 이벤트 타입 (스크롤 액션의 경우 항상 "scroll")
  scroll_x: number // 수평 스크롤 거리
  scroll_y: number // 수직 스크롤 거리
  x: number // 스크롤이 발생한 x 좌표
  y: number // 스크롤이 발생한 y 좌표
}

// Type Action: 텍스트 입력 액션
export interface TypeAction {
  type: 'type' // 이벤트 타입 (타입 액션의 경우 항상 "type")
  text: string // 입력할 텍스트
}

// Wait Action: 대기 액션
export interface WaitAction {
  type: 'wait' // 이벤트 타입 (대기 액션의 경우 항상 "wait")
}

// Pending Safety Check: 대기 중인 안전 검사
export interface PendingSafetyCheck {
  code: string // 대기 중인 안전 검사의 유형
  id: string // 대기 중인 안전 검사의 ID
  message: string // 대기 중인 안전 검사에 대한 세부 정보
}

// Computer Tool Call Output: 컴퓨터 도구 호출의 출력
export interface ComputerToolCallOutput {
  type: 'computer_call_output' // 컴퓨터 도구 호출 출력 타입 (항상 "computer_call_output")
  call_id: string // 출력을 생성한 컴퓨터 도구 호출의 ID
  output: ComputerScreenshot // 컴퓨터 사용 도구와 함께 사용되는 컴퓨터 스크린샷 이미지
  acknowledged_safety_checks?: AcknowledgedSafetyCheck[] // API에서 보고한 안전 검사 중 개발자가 승인한 것들
  id?: string // 컴퓨터 도구 호출 출력의 ID
  status?: ItemStatus // 메시지 입력의 상태 (API에서 반환될 때 채워짐)
}

// Computer Screenshot: 컴퓨터 스크린샷 이미지
export interface ComputerScreenshot {
  type: 'computer_screenshot' // 이벤트 타입 (컴퓨터 스크린샷의 경우 항상 "computer_screenshot")
  file_id?: string // 스크린샷을 포함하는 업로드된 파일의 식별자
  image_url?: string // 스크린샷 이미지의 URL
}

// Acknowledged Safety Check: 승인된 안전 검사
export interface AcknowledgedSafetyCheck {
  id: string // 대기 중인 안전 검사의 ID (필수)
  code?: string // 대기 중인 안전 검사의 유형 (선택사항)
  message?: string // 대기 중인 안전 검사에 대한 세부 정보 (선택사항)
}

// Web Search Tool Call: 웹 검색 도구 호출의 결과
export interface WebSearchToolCall {
  type: 'web_search_call' // 웹 검색 도구 호출 타입 (항상 "web_search_call")
  id: string // 웹 검색 도구 호출의 고유 ID
  action: WebSearchAction // 이 웹 검색 호출에서 취한 특정 액션을 설명하는 객체
  status: string // 웹 검색 도구 호출의 상태
}

// Web Search Action: 웹 검색 액션
export type WebSearchAction = SearchAction | OpenPageAction | FindAction

// Search Action: 검색 액션
export interface SearchAction {
  type: 'search' // 액션 타입
  query: string // 검색 쿼리
  sources?: WebSearchSource[] // 검색에 사용된 소스들
}

// Open Page Action: 페이지 열기 액션
export interface OpenPageAction {
  type: 'open_page' // 액션 타입
  url: string // 모델이 연 URL
}

// Find Action: 찾기 액션
export interface FindAction {
  type: 'find' // 액션 타입
  pattern: string // 페이지 내에서 검색할 패턴 또는 텍스트
  url: string // 패턴을 검색한 페이지의 URL
}

// Web Search Source: 웹 검색 소스
export interface WebSearchSource {
  type: 'url' // 소스 타입 (항상 "url")
  url: string // 소스의 URL
}

// Function Tool Call: 함수 실행을 위한 도구 호출
export interface FunctionToolCall {
  type: 'function_call' // 함수 도구 호출 타입 (항상 "function_call")
  arguments: string // 함수에 전달할 인수의 JSON 문자열
  call_id: string // 모델에서 생성한 함수 도구 호출의 고유 ID
  name: string // 실행할 함수의 이름
  id?: string // 함수 도구 호출의 고유 ID
  status?: ItemStatus // 항목의 상태 (API에서 반환될 때 채워짐)
}

// Function Tool Call Output: 함수 도구 호출의 출력
export interface FunctionToolCallOutput {
  type: 'function_call_output' // 함수 도구 호출 출력 타입 (항상 "function_call_output")
  call_id: string // 모델에서 생성한 함수 도구 호출의 고유 ID
  output: string | InputContentItem[] // 함수 도구 호출의 텍스트, 이미지 또는 파일 출력
  id?: string // 함수 도구 호출 출력의 고유 ID (API에서 반환될 때 채워짐)
  status?: ItemStatus // 항목의 상태 (API에서 반환될 때 채워짐)
}

// Reasoning: 추론 모델이 응답을 생성하는 동안 사용한 사고의 연쇄에 대한 설명
export interface Reasoning {
  type: 'reasoning' // 객체 타입 (항상 "reasoning")
  id: string // 추론 콘텐츠의 고유 식별자
  summary: ReasoningSummaryItem[] // 추론 요약 콘텐츠
  content?: ReasoningContentItem[] // 추론 텍스트 콘텐츠
  encrypted_content?: string // 추론 항목의 암호화된 콘텐츠
  status?: ItemStatus // 항목의 상태 (API에서 반환될 때 채워짐)
}

// Reasoning Summary Item: 추론 요약 항목
export interface ReasoningSummaryItem {
  text: string // 지금까지 모델의 추론 출력 요약
  type: 'summary_text' // 객체 타입 (항상 "summary_text")
}

// Reasoning Content Item: 추론 콘텐츠 항목
export interface ReasoningContentItem {
  text: string // 모델의 추론 텍스트
  type: 'reasoning_text' // 추론 텍스트 타입 (항상 "reasoning_text")
}

// Image Generation Call: 모델이 만든 이미지 생성 요청
export interface ImageGenerationCall {
  type: 'image_generation_call' // 이미지 생성 호출 타입 (항상 "image_generation_call")
  id: string // 이미지 생성 호출의 고유 ID
  result: string // Base64로 인코딩된 생성된 이미지
  status: string // 이미지 생성 호출의 상태
}

// Code Interpreter Tool Call: 코드 실행을 위한 도구 호출
export interface CodeInterpreterToolCall {
  type: 'code_interpreter_call' // 코드 인터프리터 도구 호출 타입 (항상 "code_interpreter_call")
  code: string // 실행할 코드 또는 사용할 수 없는 경우 null
  container_id: string // 코드 실행에 사용된 컨테이너의 ID
  id: string // 코드 인터프리터 도구 호출의 고유 ID
  outputs: CodeInterpreterOutput[] // 코드 인터프리터에서 생성된 출력들
  status: 'in_progress' | 'completed' | 'incomplete' | 'interpreting' | 'failed' // 코드 인터프리터 도구 호출의 상태
}

// Code Interpreter Output: 코드 인터프리터 출력
export type CodeInterpreterOutput = CodeInterpreterLogsOutput | CodeInterpreterImageOutput

// Code Interpreter Logs Output: 코드 인터프리터 로그 출력
export interface CodeInterpreterLogsOutput {
  type: 'logs' // 출력 타입 (항상 "logs")
  logs: string // 코드 인터프리터의 로그 출력
}

// Code Interpreter Image Output: 코드 인터프리터 이미지 출력
export interface CodeInterpreterImageOutput {
  type: 'image' // 출력 타입 (항상 "image")
  url: string // 코드 인터프리터의 이미지 출력 URL
}

// Local Shell Call: 로컬 셸에서 명령을 실행하기 위한 도구 호출
export interface LocalShellCall {
  type: 'local_shell_call' // 로컬 셸 호출 타입 (항상 "local_shell_call")
  action: LocalShellAction // 서버에서 셸 명령을 실행
  call_id: string // 모델에서 생성한 로컬 셸 도구 호출의 고유 ID
  id: string // 로컬 셸 호출의 고유 ID
  status: string // 로컬 셸 호출의 상태
}

// Local Shell Action: 로컬 셸 액션
export interface LocalShellAction {
  type: 'exec' // 로컬 셸 액션 타입 (항상 "exec")
  command: string[] // 실행할 명령
  env: Record<string, string> // 명령에 설정할 환경 변수
  timeout_ms?: number // 명령에 대한 선택적 타임아웃 (밀리초)
  user?: string // 명령을 실행할 선택적 사용자
  working_directory?: string // 명령을 실행할 선택적 작업 디렉토리
}

// Local Shell Call Output: 로컬 셸 도구 호출의 출력
export interface LocalShellCallOutput {
  type: 'local_shell_call_output' // 로컬 셸 도구 호출 출력 타입 (항상 "local_shell_call_output")
  id: string // 모델에서 생성한 로컬 셸 도구 호출의 고유 ID
  output: string // 로컬 셸 도구 호출의 출력 JSON 문자열
  status?: ItemStatus // 항목의 상태
}

// MCP List Tools: MCP 서버에서 사용 가능한 도구 목록
export interface MCPListTools {
  type: 'mcp_list_tools' // 항목 타입 (항상 "mcp_list_tools")
  id: string // 목록의 고유 ID
  server_label: string // MCP 서버의 레이블
  tools: MCPToolDefinition[] // 서버에서 사용 가능한 도구들
  error?: string // 서버가 도구를 나열할 수 없는 경우 오류 메시지
}

// MCP Tool Definition: MCP 도구 정의
export interface MCPToolDefinition {
  input_schema: Record<string, any> // 도구의 입력을 설명하는 JSON 스키마
  name: string // 도구의 이름
  annotations?: Record<string, any> // 도구에 대한 추가 주석
  description?: string // 도구의 설명
}

// MCP Approval Request: 도구 호출에 대한 인간 승인 요청
export interface MCPApprovalRequest {
  type: 'mcp_approval_request' // 항목 타입 (항상 "mcp_approval_request")
  arguments: string // 도구에 대한 인수의 JSON 문자열
  id: string // 승인 요청의 고유 ID
  name: string // 실행할 도구의 이름
  server_label: string // 요청을 만드는 MCP 서버의 레이블
}

// MCP Approval Response: MCP 승인 요청에 대한 응답
export interface MCPApprovalResponse {
  type: 'mcp_approval_response' // 항목 타입 (항상 "mcp_approval_response")
  approval_request_id: string // 답변하는 승인 요청의 ID
  approve: boolean // 요청이 승인되었는지 여부
  id?: string // 승인 응답의 고유 ID
  reason?: string // 결정에 대한 선택적 이유
}

// MCP Tool Call: MCP 서버의 도구 호출
export interface MCPToolCall {
  type: 'mcp_call' // 항목 타입 (항상 "mcp_call")
  arguments: string // 도구에 전달된 인수의 JSON 문자열
  id: string // 도구 호출의 고유 ID
  name: string // 실행된 도구의 이름
  server_label: string // 도구를 실행하는 MCP 서버의 레이블
  error?: string // 도구 호출의 오류 (있는 경우)
  output?: string // 도구 호출의 출력
}

// Custom Tool Call Output: 사용자 코드에서 모델로 다시 보내는 사용자 정의 도구 호출의 출력
export interface CustomToolCallOutput {
  type: 'custom_tool_call_output' // 사용자 정의 도구 호출 출력 타입 (항상 "custom_tool_call_output")
  call_id: string // 이 사용자 정의 도구 호출 출력을 사용자 정의 도구 호출에 매핑하는 데 사용되는 호출 ID
  output: string | InputContentItem[] // 사용자 코드에서 생성한 사용자 정의 도구 호출의 출력
  id?: string // OpenAI 플랫폼의 사용자 정의 도구 호출 출력 고유 ID
}

// Custom Tool Call: 모델이 생성한 사용자 정의 도구에 대한 호출
export interface CustomToolCall {
  type: 'custom_tool_call' // 사용자 정의 도구 호출 타입 (항상 "custom_tool_call")
  call_id: string // 이 사용자 정의 도구 호출을 도구 호출 출력에 매핑하는 데 사용되는 식별자
  input: string // 모델에서 생성한 사용자 정의 도구 호출의 입력
  name: string // 호출되는 사용자 정의 도구의 이름
  id?: string // OpenAI 플랫폼의 사용자 정의 도구 호출 고유 ID
}

export interface ToolResult {
  tool_call_id: string // 도구 호출 ID
  content: string | object // 도구 실행 결과 콘텐츠
  is_error?: boolean // 오류 발생 여부
  error?: {
    type: string // 오류 타입
    message: string // 오류 메시지
  } // 오류 정보 (is_error가 true일 때)
}

// ============================================================================
// Error & Status Types
// ============================================================================

export interface ResponseError {
  message?: string // 오류 메시지
  code?: string // 오류 코드
}

export interface IncompleteDetails {
  reason: IncompleteReason // 불완전한 이유
}

export interface Usage {
  input_tokens?: number
  input_tokens_details?: InputTokenDetails
  output_tokens?: number
  output_tokens_details?: OutputTokenDetails
  total_tokens: number
}

export interface InputTokenDetails {
  cached_tokens?: number
}

export interface OutputTokenDetails {
  reasoning_tokens?: number
}

export interface JSONSchema {
  type: 'object'
  properties?: Record<string, JSONSchemaProperty>
  required?: string[]
  additionalProperties?: boolean | JSONSchema
  patternProperties?: Record<string, JSONSchema>
  minProperties?: number
  maxProperties?: number
  dependencies?: Record<string, string[] | JSONSchema>
  propertyNames?: JSONSchema
  if?: JSONSchema
  then?: JSONSchema
  else?: JSONSchema
  allOf?: JSONSchema[]
  anyOf?: JSONSchema[]
  oneOf?: JSONSchema[]
  not?: JSONSchema
  format?: string
  contentEncoding?: string
  contentMediaType?: string
  contentSchema?: JSONSchema
  title?: string
  description?: string
  default?: any
  readOnly?: boolean
  writeOnly?: boolean
  examples?: any[]
  const?: any
  enum?: any[]
}

export interface JSONSchemaProperty {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'array' | 'object' | 'null'
  format?: string
  description?: string
  default?: any
  examples?: any[]
  const?: any
  enum?: any[]
  multipleOf?: number
  maximum?: number
  exclusiveMaximum?: number | boolean
  minimum?: number
  exclusiveMinimum?: number | boolean
  maxLength?: number
  minLength?: number
  pattern?: string
  maxItems?: number
  minItems?: number
  uniqueItems?: boolean
  maxContains?: number
  minContains?: number
  maxProperties?: number
  minProperties?: number
  required?: string[]
  properties?: Record<string, JSONSchemaProperty>
  patternProperties?: Record<string, JSONSchemaProperty>
  additionalProperties?: boolean | JSONSchemaProperty
  items?: JSONSchemaProperty | JSONSchemaProperty[]
  contains?: JSONSchemaProperty
  additionalItems?: JSONSchemaProperty
  unevaluatedItems?: JSONSchemaProperty
  unevaluatedProperties?: JSONSchemaProperty
  prefixItems?: JSONSchemaProperty[]
  if?: JSONSchemaProperty
  then?: JSONSchemaProperty
  else?: JSONSchemaProperty
  allOf?: JSONSchemaProperty[]
  anyOf?: JSONSchemaProperty[]
  oneOf?: JSONSchemaProperty[]
  not?: JSONSchemaProperty
  contentEncoding?: string
  contentMediaType?: string
  contentSchema?: JSONSchemaProperty
  title?: string
  readOnly?: boolean
  writeOnly?: boolean
}

// ============================================================================
// Streaming Response Types
// ============================================================================

// Base streaming event interface
export interface StreamingEvent {
  type: string // 이벤트 타입
  sequence_number: number // 이벤트의 시퀀스 번호
}

// Response Created Event: 응답이 생성되었을 때 발생하는 이벤트
export interface ResponseCreatedEvent extends StreamingEvent {
  type: 'response.created' // 이벤트 타입 (항상 "response.created")
  response: OpenAIResponse // 생성된 응답
}

// Response In Progress Event: 응답이 진행 중일 때 발생하는 이벤트
export interface ResponseInProgressEvent extends StreamingEvent {
  type: 'response.in_progress' // 이벤트 타입 (항상 "response.in_progress")
  response: OpenAIResponse // 진행 중인 응답
}

// Response Completed Event: 모델 응답이 완료되었을 때 발생하는 이벤트
export interface ResponseCompletedEvent extends StreamingEvent {
  type: 'response.completed' // 이벤트 타입 (항상 "response.completed")
  response: OpenAIResponse // 완료된 응답
}

// Response Failed Event: 응답이 실패했을 때 발생하는 이벤트
export interface ResponseFailedEvent extends StreamingEvent {
  type: 'response.failed' // 이벤트 타입 (항상 "response.failed")
  response: OpenAIResponse // 실패한 응답
}

// Response Incomplete Event: 응답이 불완전하게 완료되었을 때 발생하는 이벤트
export interface ResponseIncompleteEvent extends StreamingEvent {
  type: 'response.incomplete' // 이벤트 타입 (항상 "response.incomplete")
  response: OpenAIResponse // 불완전한 응답
}

// Response Queued Event: 응답이 대기열에 있을 때 발생하는 이벤트
export interface ResponseQueuedEvent extends StreamingEvent {
  type: 'response.queued' // 이벤트 타입 (항상 "response.queued")
  response: OpenAIResponse // 대기 중인 응답
}

// Output Item Added Event: 새로운 출력 항목이 추가되었을 때 발생하는 이벤트
export interface OutputItemAddedEvent extends StreamingEvent {
  type: 'response.output_item.added' // 이벤트 타입 (항상 "response.output_item.added")
  output_index: number // 추가된 출력 항목의 인덱스
  item: Output // 추가된 출력 항목
}

// Output Item Done Event: 출력 항목이 완료되었을 때 발생하는 이벤트
export interface OutputItemDoneEvent extends StreamingEvent {
  type: 'response.output_item.done' // 이벤트 타입 (항상 "response.output_item.done")
  output_index: number // 완료된 출력 항목의 인덱스
  item: Output // 완료된 출력 항목
}

// Content Part Added Event: 새로운 콘텐츠 부분이 추가되었을 때 발생하는 이벤트
export interface ContentPartAddedEvent extends StreamingEvent {
  type: 'response.content_part.added' // 이벤트 타입 (항상 "response.content_part.added")
  item_id: string // 콘텐츠 부분이 추가된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 추가된 콘텐츠 부분의 인덱스
  part: OutputContentItem // 추가된 콘텐츠 부분
}

// Content Part Done Event: 콘텐츠 부분이 완료되었을 때 발생하는 이벤트
export interface ContentPartDoneEvent extends StreamingEvent {
  type: 'response.content_part.done' // 이벤트 타입 (항상 "response.content_part.done")
  item_id: string // 콘텐츠 부분이 완료된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 완료된 콘텐츠 부분의 인덱스
  part: OutputContentItem // 완료된 콘텐츠 부분
}

// Output Text Delta Event: 텍스트 델타가 추가되었을 때 발생하는 이벤트
export interface OutputTextDeltaEvent extends StreamingEvent {
  type: 'response.output_text.delta' // 이벤트 타입 (항상 "response.output_text.delta")
  item_id: string // 텍스트 델타가 추가된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 콘텐츠 부분의 인덱스
  delta: string // 추가된 텍스트 델타
  logprobs?: LogProbItem[] // 델타의 토큰 로그 확률 (선택사항)
}

// Output Text Done Event: 텍스트 콘텐츠가 완료되었을 때 발생하는 이벤트
export interface OutputTextDoneEvent extends StreamingEvent {
  type: 'response.output_text.done' // 이벤트 타입 (항상 "response.output_text.done")
  item_id: string // 텍스트 콘텐츠가 완료된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 콘텐츠 부분의 인덱스
  text: string // 완료된 텍스트 콘텐츠
  logprobs?: LogProbItem[] // 텍스트의 토큰 로그 확률 (선택사항)
}

// Refusal Delta Event: 거부 텍스트 델타가 추가되었을 때 발생하는 이벤트
export interface RefusalDeltaEvent extends StreamingEvent {
  type: 'response.refusal.delta' // 이벤트 타입 (항상 "response.refusal.delta")
  item_id: string // 거부 텍스트가 추가된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 콘텐츠 부분의 인덱스
  delta: string // 추가된 거부 텍스트
}

// Refusal Done Event: 거부 텍스트가 완료되었을 때 발생하는 이벤트
export interface RefusalDoneEvent extends StreamingEvent {
  type: 'response.refusal.done' // 이벤트 타입 (항상 "response.refusal.done")
  item_id: string // 거부 텍스트가 완료된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  content_index: number // 콘텐츠 부분의 인덱스
  refusal: string // 완료된 거부 텍스트
}

// Function Call Arguments Delta Event: 함수 호출 인수 델타가 추가되었을 때 발생하는 이벤트
export interface FunctionCallArgumentsDeltaEvent extends StreamingEvent {
  type: 'response.function_call_arguments.delta' // 이벤트 타입 (항상 "response.function_call_arguments.delta")
  item_id: string // 함수 호출 인수가 추가된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  delta: string // 추가된 함수 호출 인수 델타
}

// Function Call Arguments Done Event: 함수 호출 인수가 완료되었을 때 발생하는 이벤트
export interface FunctionCallArgumentsDoneEvent extends StreamingEvent {
  type: 'response.function_call_arguments.done' // 이벤트 타입 (항상 "response.function_call_arguments.done")
  item_id: string // 함수 호출 인수가 완료된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
  name: string // 호출된 함수의 이름
  arguments: string // 완료된 함수 호출 인수
}

// File Search Call In Progress Event: 파일 검색 호출이 진행 중일 때 발생하는 이벤트
export interface FileSearchCallInProgressEvent extends StreamingEvent {
  type: 'response.file_search_call.in_progress' // 이벤트 타입 (항상 "response.file_search_call.in_progress")
  item_id: string // 파일 검색 호출이 시작된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
}

// File Search Call Searching Event: 파일 검색이 진행 중일 때 발생하는 이벤트
export interface FileSearchCallSearchingEvent extends StreamingEvent {
  type: 'response.file_search_call.searching' // 이벤트 타입 (항상 "response.file_search_call.searching")
  item_id: string // 파일 검색이 진행 중인 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
}

// File Search Call Completed Event: 파일 검색 호출이 완료되었을 때 발생하는 이벤트
export interface FileSearchCallCompletedEvent extends StreamingEvent {
  type: 'response.file_search_call.completed' // 이벤트 타입 (항상 "response.file_search_call.completed")
  item_id: string // 파일 검색 호출이 완료된 출력 항목의 ID
  output_index: number // 출력 항목의 인덱스
}

// Web Search Call In Progress Event: 웹 검색 호출이 진행 중일 때 발생하는 이벤트
export interface WebSearchCallInProgressEvent extends StreamingEvent {
  type: 'response.web_search_call.in_progress' // 이벤트 타입 (항상 "response.web_search_call.in_progress")
  item_id: string // 웹 검색 호출과 연결된 출력 항목의 고유 ID
  output_index: number // 웹 검색 호출과 연결된 출력 항목의 인덱스
}

// Web Search Call Searching Event: 웹 검색 호출이 실행 중일 때 발생하는 이벤트
export interface WebSearchCallSearchingEvent extends StreamingEvent {
  type: 'response.web_search_call.searching' // 이벤트 타입 (항상 "response.web_search_call.searching")
  item_id: string // 웹 검색 호출과 연결된 출력 항목의 고유 ID
  output_index: number // 웹 검색 호출과 연결된 출력 항목의 인덱스
}

// Web Search Call Completed Event: 웹 검색 호출이 완료되었을 때 발생하는 이벤트
export interface WebSearchCallCompletedEvent extends StreamingEvent {
  type: 'response.web_search_call.completed' // 이벤트 타입 (항상 "response.web_search_call.completed")
  item_id: string // 웹 검색 호출과 연결된 출력 항목의 고유 ID
  output_index: number // 웹 검색 호출과 연결된 출력 항목의 인덱스
}

// Reasoning Summary Part Added Event: 새로운 추론 요약 부분이 추가되었을 때 발생하는 이벤트
export interface ReasoningSummaryPartAddedEvent extends StreamingEvent {
  type: 'response.reasoning_summary_part.added' // 이벤트 타입 (항상 "response.reasoning_summary_part.added")
  item_id: string // 이 요약 부분과 연결된 항목의 ID
  output_index: number // 이 요약 부분과 연결된 출력 항목의 인덱스
  summary_index: number // 추론 요약 내의 요약 부분 인덱스
  part: ReasoningSummaryItem // 추가된 요약 부분
}

// Reasoning Summary Part Done Event: 추론 요약 부분이 완료되었을 때 발생하는 이벤트
export interface ReasoningSummaryPartDoneEvent extends StreamingEvent {
  type: 'response.reasoning_summary_part.done' // 이벤트 타입 (항상 "response.reasoning_summary_part.done")
  item_id: string // 이 요약 부분과 연결된 항목의 ID
  output_index: number // 이 요약 부분과 연결된 출력 항목의 인덱스
  summary_index: number // 추론 요약 내의 요약 부분 인덱스
  part: ReasoningSummaryItem // 완료된 요약 부분
}

// Reasoning Summary Text Delta Event: 추론 요약 텍스트에 델타가 추가되었을 때 발생하는 이벤트
export interface ReasoningSummaryTextDeltaEvent extends StreamingEvent {
  type: 'response.reasoning_summary_text.delta' // 이벤트 타입 (항상 "response.reasoning_summary_text.delta")
  item_id: string // 이 요약 텍스트 델타와 연결된 항목의 ID
  output_index: number // 이 요약 텍스트 델타와 연결된 출력 항목의 인덱스
  summary_index: number // 추론 요약 내의 요약 부분 인덱스
  delta: string // 요약에 추가된 텍스트 델타
}

// Reasoning Summary Text Done Event: 추론 요약 텍스트가 완료되었을 때 발생하는 이벤트
export interface ReasoningSummaryTextDoneEvent extends StreamingEvent {
  type: 'response.reasoning_summary_text.done' // 이벤트 타입 (항상 "response.reasoning_summary_text.done")
  item_id: string // 이 요약 텍스트와 연결된 항목의 ID
  output_index: number // 이 요약 텍스트와 연결된 출력 항목의 인덱스
  summary_index: number // 추론 요약 내의 요약 부분 인덱스
  text: string // 완료된 추론 요약의 전체 텍스트
}

// Reasoning Text Delta Event: 추론 텍스트에 델타가 추가되었을 때 발생하는 이벤트
export interface ReasoningTextDeltaEvent extends StreamingEvent {
  type: 'response.reasoning_text.delta' // 이벤트 타입 (항상 "response.reasoning_text.delta")
  item_id: string // 이 추론 텍스트 델타와 연결된 항목의 ID
  output_index: number // 이 추론 텍스트 델타와 연결된 출력 항목의 인덱스
  content_index: number // 이 델타와 연결된 추론 콘텐츠 부분의 인덱스
  delta: string // 추론 콘텐츠에 추가된 텍스트 델타
}

// Reasoning Text Done Event: 추론 텍스트가 완료되었을 때 발생하는 이벤트
export interface ReasoningTextDoneEvent extends StreamingEvent {
  type: 'response.reasoning_text.done' // 이벤트 타입 (항상 "response.reasoning_text.done")
  item_id: string // 이 추론 텍스트와 연결된 항목의 ID
  output_index: number // 이 추론 텍스트와 연결된 출력 항목의 인덱스
  content_index: number // 추론 콘텐츠 부분의 인덱스
  text: string // 완료된 추론 콘텐츠의 전체 텍스트
}

// Image Generation Call In Progress Event: 이미지 생성 도구 호출이 진행 중일 때 발생하는 이벤트
export interface ImageGenerationCallInProgressEvent extends StreamingEvent {
  type: 'response.image_generation_call.in_progress' // 이벤트 타입 (항상 "response.image_generation_call.in_progress")
  item_id: string // 처리 중인 이미지 생성 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
}

// Image Generation Call Generating Event: 이미지 생성 도구 호출이 활발히 이미지를 생성하고 있을 때 발생하는 이벤트
export interface ImageGenerationCallGeneratingEvent extends StreamingEvent {
  type: 'response.image_generation_call.generating' // 이벤트 타입 (항상 "response.image_generation_call.generating")
  item_id: string // 처리 중인 이미지 생성 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
}

// Image Generation Call Completed Event: 이미지 생성 도구 호출이 완료되고 최종 이미지가 사용 가능할 때 발생하는 이벤트
export interface ImageGenerationCallCompletedEvent extends StreamingEvent {
  type: 'response.image_generation_call.completed' // 이벤트 타입 (항상 "response.image_generation_call.completed")
  item_id: string // 처리 중인 이미지 생성 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
}

// Image Generation Call Partial Image Event: 이미지 생성 스트리밍 중 부분 이미지가 사용 가능할 때 발생하는 이벤트
export interface ImageGenerationCallPartialImageEvent extends StreamingEvent {
  type: 'response.image_generation_call.partial_image' // 이벤트 타입 (항상 "response.image_generation_call.partial_image")
  item_id: string // 처리 중인 이미지 생성 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
  partial_image_index: number // 부분 이미지의 0 기반 인덱스 (백엔드는 1 기반이지만 사용자를 위해 0 기반)
  partial_image_b64: string // 이미지로 렌더링하기에 적합한 Base64 인코딩된 부분 이미지 데이터
}

// MCP Call Arguments Delta Event: MCP 도구 호출의 인수에 델타(부분 업데이트)가 있을 때 발생하는 이벤트
export interface MCPCallArgumentsDeltaEvent extends StreamingEvent {
  type: 'response.mcp_call_arguments.delta' // 이벤트 타입 (항상 "response.mcp_call_arguments.delta")
  item_id: string // 처리 중인 MCP 도구 호출 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
  delta: string // MCP 도구 호출의 인수에 대한 부분 업데이트를 포함하는 JSON 문자열
}

// MCP Call Arguments Done Event: MCP 도구 호출의 인수가 완료되었을 때 발생하는 이벤트
export interface MCPCallArgumentsDoneEvent extends StreamingEvent {
  type: 'response.mcp_call_arguments.done' // 이벤트 타입 (항상 "response.mcp_call_arguments.done")
  item_id: string // 처리 중인 MCP 도구 호출 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
  arguments: string // MCP 도구 호출의 완료된 인수를 포함하는 JSON 문자열
}

// MCP Call In Progress Event: MCP 도구 호출이 진행 중일 때 발생하는 이벤트
export interface MCPCallInProgressEvent extends StreamingEvent {
  type: 'response.mcp_call.in_progress' // 이벤트 타입 (항상 "response.mcp_call.in_progress")
  item_id: string // 처리 중인 MCP 도구 호출 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
}

// MCP Call Completed Event: MCP 도구 호출이 성공적으로 완료되었을 때 발생하는 이벤트
export interface MCPCallCompletedEvent extends StreamingEvent {
  type: 'response.mcp_call.completed' // 이벤트 타입 (항상 "response.mcp_call.completed")
  item_id: string // 완료된 MCP 도구 호출 항목의 ID
  output_index: number // 완료된 출력 항목의 인덱스
}

// MCP Call Failed Event: MCP 도구 호출이 실패했을 때 발생하는 이벤트
export interface MCPCallFailedEvent extends StreamingEvent {
  type: 'response.mcp_call.failed' // 이벤트 타입 (항상 "response.mcp_call.failed")
  item_id: string // 실패한 MCP 도구 호출 항목의 ID
  output_index: number // 실패한 출력 항목의 인덱스
}

// MCP List Tools In Progress Event: 사용 가능한 MCP 도구 목록을 검색하는 과정에서 발생하는 이벤트
export interface MCPListToolsInProgressEvent extends StreamingEvent {
  type: 'response.mcp_list_tools.in_progress' // 이벤트 타입 (항상 "response.mcp_list_tools.in_progress")
  item_id: string // 처리 중인 MCP 도구 호출 항목의 ID
  output_index: number // 처리 중인 출력 항목의 인덱스
}

// MCP List Tools Completed Event: 사용 가능한 MCP 도구 목록이 성공적으로 검색되었을 때 발생하는 이벤트
export interface MCPListToolsCompletedEvent extends StreamingEvent {
  type: 'response.mcp_list_tools.completed' // 이벤트 타입 (항상 "response.mcp_list_tools.completed")
  item_id: string // 이 출력을 생성한 MCP 도구 호출 항목의 ID
  output_index: number // 처리된 출력 항목의 인덱스
}

// MCP List Tools Failed Event: 사용 가능한 MCP 도구 목록을 나열하려는 시도가 실패했을 때 발생하는 이벤트
export interface MCPListToolsFailedEvent extends StreamingEvent {
  type: 'response.mcp_list_tools.failed' // 이벤트 타입 (항상 "response.mcp_list_tools.failed")
  item_id: string // 실패한 MCP 도구 호출 항목의 ID
  output_index: number // 실패한 출력 항목의 인덱스
}

// Code Interpreter Call In Progress Event: 코드 인터프리터 호출이 진행 중일 때 발생하는 이벤트
export interface CodeInterpreterCallInProgressEvent extends StreamingEvent {
  type: 'response.code_interpreter_call.in_progress' // 이벤트 타입 (항상 "response.code_interpreter_call.in_progress")
  item_id: string // 코드 인터프리터 도구 호출 항목의 고유 식별자
  output_index: number // 코드 인터프리터 호출이 진행 중인 응답의 출력 항목 인덱스
}

// Code Interpreter Call Interpreting Event: 코드 인터프리터가 코드 스니펫을 활발히 해석하고 있을 때 발생하는 이벤트
export interface CodeInterpreterCallInterpretingEvent extends StreamingEvent {
  type: 'response.code_interpreter_call.interpreting' // 이벤트 타입 (항상 "response.code_interpreter_call.interpreting")
  item_id: string // 코드 인터프리터 도구 호출 항목의 고유 식별자
  output_index: number // 코드가 해석되고 있는 응답의 출력 항목 인덱스
}

// Code Interpreter Call Completed Event: 코드 인터프리터 호출이 완료되었을 때 발생하는 이벤트
export interface CodeInterpreterCallCompletedEvent extends StreamingEvent {
  type: 'response.code_interpreter_call.completed' // 이벤트 타입 (항상 "response.code_interpreter_call.completed")
  item_id: string // 코드 인터프리터 도구 호출 항목의 고유 식별자
  output_index: number // 코드 인터프리터 호출이 완료된 응답의 출력 항목 인덱스
}

// Code Interpreter Call Code Delta Event: 코드 인터프리터에 의해 부분 코드 스니펫이 스트리밍될 때 발생하는 이벤트
export interface CodeInterpreterCallCodeDeltaEvent extends StreamingEvent {
  type: 'response.code_interpreter_call_code.delta' // 이벤트 타입 (항상 "response.code_interpreter_call_code.delta")
  item_id: string // 코드 인터프리터 도구 호출 항목의 고유 식별자
  output_index: number // 코드가 스트리밍되고 있는 응답의 출력 항목 인덱스
  delta: string // 코드 인터프리터에 의해 스트리밍되는 부분 코드 스니펫
}

// Code Interpreter Call Code Done Event: 코드 인터프리터에 의해 코드 스니펫이 완료되었을 때 발생하는 이벤트
export interface CodeInterpreterCallCodeDoneEvent extends StreamingEvent {
  type: 'response.code_interpreter_call_code.done' // 이벤트 타입 (항상 "response.code_interpreter_call_code.done")
  item_id: string // 코드 인터프리터 도구 호출 항목의 고유 식별자
  output_index: number // 코드가 완료된 응답의 출력 항목 인덱스
  code: string // 코드 인터프리터에 의해 출력된 최종 코드 스니펫
}

// Output Text Annotation Added Event: 출력 텍스트 콘텐츠에 주석이 추가되었을 때 발생하는 이벤트
export interface OutputTextAnnotationAddedEvent extends StreamingEvent {
  type: 'response.output_text.annotation.added' // 이벤트 타입 (항상 "response.output_text.annotation.added")
  item_id: string // 주석이 추가되는 항목의 고유 식별자
  output_index: number // 응답의 출력 배열에서 출력 항목의 인덱스
  content_index: number // 출력 항목 내의 콘텐츠 부분 인덱스
  annotation_index: number // 콘텐츠 부분 내의 주석 인덱스
  annotation: TextAnnotation // 추가되는 주석 객체
}

// Custom Tool Call Input Delta Event: 사용자 정의 도구 호출의 입력에 델타(부분 업데이트)가 있을 때 발생하는 이벤트
export interface CustomToolCallInputDeltaEvent extends StreamingEvent {
  type: 'response.custom_tool_call_input.delta' // 이벤트 타입 (항상 "response.custom_tool_call_input.delta")
  item_id: string // 이 이벤트와 연결된 API 항목의 고유 식별자
  output_index: number // 이 델타가 적용되는 출력의 인덱스
  delta: string // 사용자 정의 도구 호출의 증분 입력 데이터(델타)
}

// Custom Tool Call Input Done Event: 사용자 정의 도구 호출의 입력이 완료되었음을 나타내는 이벤트
export interface CustomToolCallInputDoneEvent extends StreamingEvent {
  type: 'response.custom_tool_call_input.done' // 이벤트 타입 (항상 "response.custom_tool_call_input.done")
  item_id: string // 이 이벤트와 연결된 API 항목의 고유 식별자
  output_index: number // 이 이벤트가 적용되는 출력의 인덱스
  input: string // 사용자 정의 도구 호출의 완전한 입력 데이터
}

// Streaming Error Event: 오류가 발생했을 때 발생하는 이벤트
export interface StreamingErrorEvent extends StreamingEvent {
  type: 'error' // 이벤트 타입 (항상 "error")
  code: string // 오류 코드
  message: string // 오류 메시지
  param?: string // 오류 매개변수 (선택사항)
}

// All streaming events union type
export type StreamingEvents =
  | ResponseCreatedEvent
  | ResponseInProgressEvent
  | ResponseCompletedEvent
  | ResponseFailedEvent
  | ResponseIncompleteEvent
  | ResponseQueuedEvent
  | OutputItemAddedEvent
  | OutputItemDoneEvent
  | ContentPartAddedEvent
  | ContentPartDoneEvent
  | OutputTextDeltaEvent
  | OutputTextDoneEvent
  | RefusalDeltaEvent
  | RefusalDoneEvent
  | FunctionCallArgumentsDeltaEvent
  | FunctionCallArgumentsDoneEvent
  | FileSearchCallInProgressEvent
  | FileSearchCallSearchingEvent
  | FileSearchCallCompletedEvent
  | WebSearchCallInProgressEvent
  | WebSearchCallSearchingEvent
  | WebSearchCallCompletedEvent
  | ReasoningSummaryPartAddedEvent
  | ReasoningSummaryPartDoneEvent
  | ReasoningSummaryTextDeltaEvent
  | ReasoningSummaryTextDoneEvent
  | ReasoningTextDeltaEvent
  | ReasoningTextDoneEvent
  | ImageGenerationCallInProgressEvent
  | ImageGenerationCallGeneratingEvent
  | ImageGenerationCallCompletedEvent
  | ImageGenerationCallPartialImageEvent
  | MCPCallArgumentsDeltaEvent
  | MCPCallArgumentsDoneEvent
  | MCPCallInProgressEvent
  | MCPCallCompletedEvent
  | MCPCallFailedEvent
  | MCPListToolsInProgressEvent
  | MCPListToolsCompletedEvent
  | MCPListToolsFailedEvent
  | CodeInterpreterCallInProgressEvent
  | CodeInterpreterCallInterpretingEvent
  | CodeInterpreterCallCompletedEvent
  | CodeInterpreterCallCodeDeltaEvent
  | CodeInterpreterCallCodeDoneEvent
  | OutputTextAnnotationAddedEvent
  | CustomToolCallInputDeltaEvent
  | CustomToolCallInputDoneEvent
  | StreamingErrorEvent
