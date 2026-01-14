// Anthropic Claude API Types
// Based on: https://docs.claude.com/en/api/messages

// ============================================================================
// Core Request & Response Types (Most Important)
// ============================================================================

export interface AnthropicRequest {
  model: string // 필수: 사용할 모델 이름 (예: "claude-sonnet-4-20250514")
  messages: InputMessage[] // 필수: 대화 메시지 배열. user와 assistant 역할이 번갈아 나타나야 함
  max_tokens: number // 필수: 생성할 최대 토큰 수 (1 이상)
  container?: string | null // 선택사항: 컨테이너 식별자 (요청 간 재사용용)
  mcp_servers?: RequestMCPServerURLDefinition[] // 선택사항: MCP 서버 정의 배열 (최대 20개)
  metadata?: RequestMetadata // 선택사항: 요청 메타데이터
  service_tier?: ServiceTier // 선택사항: 서비스 계층 설정
  stop_sequences?: string[] // 선택사항: 모델이 생성 중단할 커스텀 텍스트 시퀀스
  stream?: boolean // 선택사항: 서버 전송 이벤트를 사용한 스트리밍 응답 여부
  system?: string | TextContent[] // 선택사항: 시스템 프롬프트 (컨텍스트 및 지시사항 제공)
  temperature?: number // 선택사항: 샘플링 온도 (0.0-1.0, 높을수록 더 창의적)
  thinking?: ThinkingConfig // 선택사항: 사고 과정 표시 설정
  tool_choice?: ToolChoice // 선택사항: 도구 사용 선택 설정
  tools?: ToolDefinition[] // 선택사항: 사용 가능한 도구 정의 배열
  top_k?: number // 선택사항: 상위 K개 옵션에서만 샘플링 (고급 사용)
  top_p?: number // 선택사항: 핵심 샘플링 (고급 사용, temperature와 함께 사용하지 말 것)
  output_format?: OutputFormat // 선택사항: 구조화된 출력 형식 (Beta)
}

export interface OutputFormat {
  type: 'json_schema'
  json_schema: {
    name: string
    description?: string
    schema: Record<string, any>
    strict?: boolean
  }
}

export interface AnthropicResponse {
  id: string // 고유 메시지 식별자
  type: 'message' // 객체 타입 (항상 "message")
  role: 'assistant' // 대화 역할 (항상 "assistant")
  content: ResponseContentBlock[] // 모델이 생성한 콘텐츠 블록 배열
  model: string // 요청을 처리한 모델 이름
  stop_reason: StopReason | null // 생성이 중단된 이유
  stop_sequence: string | null // 중단을 일으킨 커스텀 시퀀스 (있는 경우)
  usage: Usage // 토큰 사용량 정보
  container?: ContainerInfo | null // 컨테이너 정보 (코드 실행 도구 사용시)
}

export type AnthropicStreamResponse =
  | MessageStart
  | MessageDelta
  | MessageStop
  | Ping
  | ContentBlockStart
  | ContentBlockDelta
  | ContentBlockStop
  | Error

export interface AnthropicError {
  type: 'error' // 오류 객체 타입 (항상 "error")
  error: {
    type: string // 오류 타입
    message: string // 오류 메시지
  } // 오류 상세 정보
}

// ============================================================================
// Enum Types
// ============================================================================

export enum ServiceTier {
  AUTO = 'auto', // 우선순위 용량 사용 가능시 사용
  STANDARD_ONLY = 'standard_only' // 표준 용량만 사용
}

export enum StopReason {
  END_TURN = 'end_turn', // 모델이 자연스러운 중단점에 도달
  MAX_TOKENS = 'max_tokens', // 요청된 max_tokens 또는 모델의 최대값을 초과
  STOP_SEQUENCE = 'stop_sequence', // 제공된 커스텀 stop_sequences 중 하나가 생성됨
  TOOL_USE = 'tool_use', // 모델이 하나 이상의 도구를 호출함
  PAUSE_TURN = 'pause_turn', // 긴 실행 턴을 일시 중지함
  REFUSAL = 'refusal' // 스트리밍 분류기가 잠재적 정책 위반을 처리하기 위해 개입함
}

export enum ThinkingType {
  ENABLED = 'enabled', // 사고 과정 표시 활성화
  DISABLED = 'disabled' // 사고 과정 표시 비활성화
}

export enum ToolChoiceType {
  AUTO = 'auto', // 자동 도구 선택
  ANY = 'any', // 모든 도구 사용 가능
  TOOL = 'tool', // 특정 도구만 사용
  NONE = 'none' // 도구 사용 비활성화
}

export enum ToolType {
  CUSTOM = 'custom', // 사용자 정의 도구
  BASH_20250124 = 'bash_20250124', // Bash 도구 (2025-01-24 버전)
  CODE_EXECUTION_20250522 = 'code_execution_20250522', // 코드 실행 도구 (2025-05-22 버전)
  CODE_EXECUTION_20250825 = 'CodeExecutionTool_20250825', // 코드 실행 도구 (2025-08-25 버전)
  COMPUTER_20241022 = 'computer_20241022', // 컴퓨터 사용 도구 (2024-10-22 버전)
  COMPUTER_20250124 = 'computer_20250124', // 컴퓨터 사용 도구 (2025-01-24 버전)
  TEXT_EDITOR_20250124 = 'text_editor_20250124', // 텍스트 에디터 도구 (2025-01-24 버전)
  TEXT_EDITOR_20250429 = 'text_editor_20250429', // 텍스트 에디터 도구 (2025-04-29 버전)
  TEXT_EDITOR_20250728 = 'text_editor_20250728', // 텍스트 에디터 도구 (2025-07-28 버전)
  WEB_SEARCH_20250305 = 'web_search_20250305', // 웹 검색 도구 (2025-03-05 버전)
  WEB_FETCH_20250910 = 'WebFetchTool_20250910' // 웹 페치 도구 (2025-09-10 버전)
}

export enum CacheControlType {
  EPHEMERAL = 'ephemeral' // 임시 캐시
}

export enum CacheControlTTL {
  FIVE_MINUTES = '5m', // 5분
  ONE_HOUR = '1h' // 1시간
}

export enum StreamEventType {
  MESSAGE_START = 'message_start', // 메시지 시작
  CONTENT_BLOCK_START = 'content_block_start', // 콘텐츠 블록 시작
  CONTENT_BLOCK_DELTA = 'content_block_delta', // 콘텐츠 블록 델타 (증분 데이터)
  CONTENT_BLOCK_STOP = 'content_block_stop', // 콘텐츠 블록 종료
  MESSAGE_DELTA = 'message_delta', // 메시지 델타 (사용량 정보)
  MESSAGE_STOP = 'message_stop' // 메시지 종료
}

export enum DeltaType {
  TEXT_DELTA = 'text_delta', // 텍스트 델타
  INPUT_JSON_DELTA = 'input_json_delta', // JSON 입력 델타
  THINKING_DELTA = 'thinking_delta', // 사고 과정 델타
  SIGNATURE_DELTA = 'signature_delta' // 서명 델타
}

export enum FilePurpose {
  ASSISTANTS = 'assistants', // 어시스턴트용
  VISION = 'vision' // 비전용
}

export enum PromptCacheTTL {
  FIVE_MINUTES = '5m', // 5분
  ONE_HOUR = '1h' // 1시간
}

// ============================================================================
// Message Types
// ============================================================================

export interface InputMessage {
  role: 'user' | 'assistant' // 메시지 역할 (user: 사용자, assistant: 어시스턴트)
  content: string | ContentBlock[] // 메시지 내용 (문자열 또는 콘텐츠 블록 배열)
}

export type ContentBlock =
  | TextContent // 일반 텍스트
  | ImageContent // 이미지
  | DocumentContent // 문서
  | SearchResultContent // 검색 결과
  | ThinkingContent // 사고 과정 (Claude 내부)
  | RedactedThinkingContent // 편집된 사고 과정
  | ToolUseContent // 도구 사용
  | ServerToolUseContent // 서버 도구 사용
  | WebSearchToolResultContent // 웹 검색 도구 결과
  | WebFetchToolResultContent // 웹 페치 도구 결과
  | CodeExecutionToolResultContent // 코드 실행 도구 결과
  | BashCodeExecutionToolResultContent // Bash 코드 실행 도구 결과
  | TextEditorCodeExecutionToolResultContent // 텍스트 에디터 코드 실행 도구 결과
  | MCPToolUseContent // MCP 도구 사용
  | MCPToolResultContent // MCP 도구 결과
  | ContainerUploadContent // 컨테이너 업로드

export type ResponseContentBlock =
  | TextContent // 일반 텍스트
  | ThinkingContent // 사고 과정
  | RedactedThinkingContent // 편집된 사고 과정
  | ToolUseContent // 도구 사용
  | ServerToolUseContent // 서버 도구 사용
  | WebSearchToolResultContent // 웹 검색 도구 결과
  | WebFetchToolResultContent // 웹 페치 도구 결과
  | CodeExecutionToolResultContent // 코드 실행 도구 결과
  | BashCodeExecutionToolResultContent // Bash 코드 실행 도구 결과
  | TextEditorCodeExecutionToolResultContent // 텍스트 에디터 코드 실행 도구 결과
  | MCPToolUseContent // MCP 도구 사용
  | MCPToolResultContent // MCP 도구 결과
  | ContainerUploadContent // 컨테이너 업로드

// ============================================================================
// Content Types
// ============================================================================

export interface TextContent {
  type: 'text' // 콘텐츠 타입 (항상 "text")
  text: string // 텍스트 내용
  cache_control?: CacheControl | null // 캐시 제어 설정
  citations?: CitationLocation[] // 인용 위치 정보 배열
}

export interface ImageContent {
  type: 'image' // 콘텐츠 타입 (항상 "image")
  source: Base64ImageSource | URLImageSource | FileImageSource // 이미지 소스 (Base64, URL, 또는 파일 ID)
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface DocumentContent {
  type: 'document' // 콘텐츠 타입 (항상 "document")
  source:
  | Base64DocumentSource
  | PlainTextDocumentSource
  | ContentBlockDocumentSource
  | URLDocumentSource
  | FileDocumentSource // 문서 소스 (Base64, 텍스트, 콘텐츠 블록, URL, 또는 파일 ID)
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface SearchResultContent {
  type: 'search_result' // 콘텐츠 타입 (항상 "search_result")
  title: string // 검색 결과 제목
  source: string // 검색 결과 소스
  content: TextContent[] // 검색 결과 내용 (텍스트 콘텐츠 배열)
  cache_control?: CacheControl | null // 캐시 제어 설정
  citations?: { enabled: boolean } // 인용 설정
}

export interface ThinkingContent {
  type: 'thinking' // 콘텐츠 타입 (항상 "thinking")
  thinking: string // 사고 과정 텍스트
  signature: string // 사고 과정의 디지털 서명
}

export interface RedactedThinkingContent {
  type: 'redacted_thinking' // 콘텐츠 타입 (항상 "redacted_thinking")
  text: string // 편집된 사고 과정 텍스트
}

export interface ToolUseContent {
  type: 'tool_use' // 콘텐츠 타입 (항상 "tool_use")
  id: string // 도구 사용의 고유 식별자
  name: string // 사용할 도구의 이름
  input: object // 도구에 전달할 입력 매개변수
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface ToolResultContent {
  type: 'tool_result' // 콘텐츠 타입 (항상 "tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content?: string | ContentBlock[] // 도구 실행 결과 (문자열 또는 콘텐츠 블록 배열)
  is_error?: boolean // 오류 발생 여부
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface ServerToolUseContent {
  type: 'server_tool_use' // 콘텐츠 타입 (항상 "server_tool_use")
  id: string // 도구 사용의 고유 식별자
  input: object // 도구에 전달할 입력 매개변수
  name:
  | 'web_search'
  | 'web_fetch'
  | 'code_execution'
  | 'bash_code_execution'
  | 'text_editor_code_execution' // 서버 도구 이름
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface WebSearchToolResultContent {
  type: 'web_search_tool_result' // 콘텐츠 타입 (항상 "web_search_tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content: WebSearchToolResultError | WebSearchResult // 웹 검색 결과 또는 오류
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface WebFetchToolResultContent {
  type: 'web_fetch_tool_result' // 콘텐츠 타입 (항상 "web_fetch_tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content: WebFetchToolResultError | WebFetchToolResult // 웹 페치 결과 또는 오류
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface CodeExecutionToolResultContent {
  type: 'code_execution_tool_result' // 콘텐츠 타입 (항상 "code_execution_tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content: CodeExecutionToolResultError | CodeExecutionResult // 코드 실행 결과 또는 오류
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface BashCodeExecutionToolResultContent {
  type: 'bash_code_execution_tool_result' // 콘텐츠 타입 (항상 "bash_code_execution_tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content: BashCodeExecutionToolResultError | BashCodeExecutionResult // Bash 코드 실행 결과 또는 오류
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface TextEditorCodeExecutionToolResultContent {
  type: 'text_editor_code_execution_tool_result' // 콘텐츠 타입 (항상 "text_editor_code_execution_tool_result")
  content:
  | TextEditorCodeExecutionToolResultError
  | TextEditorCodeExecutionViewResult
  | TextEditorCodeExecutionCreateResult
  | TextEditorCodeExecutionStrReplaceResult // 텍스트 에디터 코드 실행 결과 또는 오류
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface MCPToolUseContent {
  type: 'mcp_tool_use' // 콘텐츠 타입 (항상 "mcp_tool_use")
  id: string // 도구 사용의 고유 식별자
  input: object // 도구에 전달할 입력 매개변수
  name: string // MCP 도구 이름
  server_name: string // MCP 서버 이름
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface MCPToolResultContent {
  type: 'mcp_tool_result' // 콘텐츠 타입 (항상 "mcp_tool_result")
  tool_use_id: string // 연결된 도구 사용의 ID
  content: string | TextContent[] // MCP 도구 실행 결과
  is_error?: boolean // 오류 발생 여부
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface ContainerUploadContent {
  type: 'container_upload' // 콘텐츠 타입 (항상 "container_upload")
  file_id: string // 업로드된 파일 ID
  cache_control?: CacheControl | null // 캐시 제어 설정
}

// ============================================================================
// Tool Types
// ============================================================================

export type ToolDefinition =
  | CustomTool // 사용자 정의 도구
  | BashTool // Bash 명령어 실행 도구
  | CodeExecutionTool // 코드 실행 도구
  | ComputerUseTool // 컴퓨터 사용 도구 (화면 조작)
  | OldTextEditorTool // 구 텍스트 에디터 도구
  | TextEditorTool // 텍스트 에디터 도구
  | WebSearchTool // 웹 검색 도구
  | WebFetchTool // 웹 페치 도구

export type ToolChoice =
  | { type: ToolChoiceType.AUTO; disable_parallel_tool_use?: boolean } // 자동 도구 선택
  | { type: ToolChoiceType.ANY; disable_parallel_tool_use?: boolean } // 모든 도구 사용 가능
  | { type: ToolChoiceType.TOOL; name: string; disable_parallel_tool_use?: boolean } // 특정 도구만 사용
  | { type: ToolChoiceType.NONE } // 도구 사용 비활성화

export interface CustomTool {
  type: ToolType.CUSTOM // 도구 타입 (항상 "custom")
  name: string // 도구 이름
  description?: string // 도구 설명 (권장)
  input_schema: ToolInputSchema // 도구 입력 스키마 (JSON Schema)
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface BashTool {
  name: 'bash' // 도구 이름 (항상 "bash")
  type: ToolType.BASH_20250124 // 도구 버전 타입
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface CodeExecutionTool {
  name: 'code_execution' // 도구 이름 (항상 "code_execution")
  type: ToolType.CODE_EXECUTION_20250522 | ToolType.CODE_EXECUTION_20250825 // 도구 버전 타입
}

export interface ComputerUseTool {
  name: 'computer' // 도구 이름 (항상 "computer")
  type: ToolType.COMPUTER_20241022 | ToolType.COMPUTER_20250124 // 도구 버전 타입
  display_height_px: number // 화면 높이 (픽셀)
  display_width_px: number // 화면 너비 (픽셀)
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface OldTextEditorTool {
  name: 'str_replace_editor' // 도구 이름 (항상 "str_replace_editor")
  type: ToolType.TEXT_EDITOR_20250124 // 도구 버전 타입
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface TextEditorTool {
  name: 'str_replace_based_edit_tool' // 도구 이름 (항상 "str_replace_based_edit_tool")
  type: ToolType.TEXT_EDITOR_20250429 | ToolType.TEXT_EDITOR_20250728 // 도구 버전 타입
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface WebSearchTool {
  name: 'web_search' // 도구 이름 (항상 "web_search")
  type: ToolType.WEB_SEARCH_20250305 // 도구 버전 타입
  allowed_domains?: string[] | null // 허용된 도메인 목록
  blocked_domains?: string[] | null // 차단된 도메인 목록
  max_uses?: number | null // 최대 사용 횟수
  user_location?: {
    type: 'approximate'
    city?: string | null
    country?: string | null
    region?: string | null
    timezone?: string | null
  } | null // 사용자 위치 정보 (검색 결과 지역화용)
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface WebFetchTool {
  name: 'web_fetch' // 도구 이름 (항상 "web_fetch")
  type: ToolType.WEB_FETCH_20250910 // 도구 버전 타입
  allowed_domains?: string[] | null // 허용된 도메인 목록
  blocked_domains?: string[] | null // 차단된 도메인 목록
  max_uses?: number | null // 최대 사용 횟수
  max_content_tokens?: number | null // 최대 콘텐츠 토큰 수
  citations?: { enabled: boolean } | null // 인용 설정
  cache_control?: CacheControl | null // 캐시 제어 설정
}

export interface ToolInputSchema {
  type: 'object' // 스키마 타입 (항상 "object")
  properties?: object | null // 속성 정의 (매개변수별 타입과 설명)
  required?: string[] | null // 필수 속성 목록
}

// ============================================================================
// Source Types
// ============================================================================

export interface Base64ImageSource {
  type: 'base64' // 소스 타입 (항상 "base64")
  media_type: 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp' // 이미지 MIME 타입
  data: string // Base64 인코딩된 이미지 데이터
}

export interface URLImageSource {
  type: 'url' // 소스 타입 (항상 "url")
  url: string // 이미지 URL
}

export interface FileImageSource {
  type: 'file' // 소스 타입 (항상 "file")
  file_id: string // 파일 ID
}

export interface Base64DocumentSource {
  type: 'base64' // 소스 타입 (항상 "base64")
  media_type: string // 문서 MIME 타입
  data: string // Base64 인코딩된 문서 데이터
}

export interface PlainTextDocumentSource {
  type: 'text' // 소스 타입 (항상 "text")
  media_type: 'text/plain' // 텍스트 MIME 타입
  data: string // 텍스트 데이터
}

export interface ContentBlockDocumentSource {
  type: 'content' // 소스 타입 (항상 "content")
  content: string | ContentBlock[] // 콘텐츠 블록 또는 문자열
}

export interface URLDocumentSource {
  type: 'url' // 소스 타입 (항상 "url")
  url: string // 문서 URL
}

export interface FileDocumentSource {
  type: 'file' // 소스 타입 (항상 "file")
  file_id: string // 파일 ID
}

export interface Base64ContainerSource {
  type: 'base64' // 소스 타입 (항상 "base64")
  media_type: string // 컨테이너 MIME 타입
  data: string // Base64 인코딩된 컨테이너 데이터
}

export interface URLContainerSource {
  type: 'url' // 소스 타입 (항상 "url")
  url: string // 컨테이너 URL
}

export interface FileContainerSource {
  type: 'file' // 소스 타입 (항상 "file")
  file_id: string // 파일 ID
}

// ============================================================================
// Citation Types
// ============================================================================

export type CitationLocation =
  | CharacterLocation
  | PageLocation
  | ContentBlockLocation
  | WebSearchResultLocation
  | SearchResultLocation

export interface CharacterLocation {
  cited_text: string // 인용된 텍스트
  document_index: number // 문서 인덱스
  document_title: string | null // 문서 제목
  end_chat_index: number // 채팅 종료 인덱스
  start_chat_index: number // 채팅 시작 인덱스
  type: 'chat_location' // 위치 타입 (항상 "chat_location")
}

export interface PageLocation {
  cited_text: string // 인용된 텍스트
  document_index: number // 문서 인덱스
  document_title: string | null // 문서 제목
  end_page_index: number // 페이지 종료 인덱스
  start_page_index: number // 페이지 시작 인덱스
  type: 'page_location' // 위치 타입 (항상 "page_location")
}

export interface ContentBlockLocation {
  cited_text: string // 인용된 텍스트
  document_index: number // 문서 인덱스
  document_title: string | null // 문서 제목
  end_block_index: number // 블록 종료 인덱스
  start_block_index: number // 블록 시작 인덱스
  type: 'content_block_location' // 위치 타입 (항상 "content_block_location")
}

export interface WebSearchResultLocation {
  cited_text: string // 인용된 텍스트
  encrypted_index: string // 암호화된 인덱스
  title: string | null // 제목
  type: 'web_search_result_location' // 위치 타입 (항상 "web_search_result_location")
  url: string // URL
}

export interface SearchResultLocation {
  cited_text: string // 인용된 텍스트
  end_block_index: number // 블록 종료 인덱스
  search_result_index: number // 검색 결과 인덱스
  source: string // 소스
  start_block_index: number // 블록 시작 인덱스
  title: string | null // 제목
  type: 'search_result_location' // 위치 타입 (항상 "search_result_location")
}

// ============================================================================
// Search Result Types
// ============================================================================

export interface SearchResult {
  title: string // 검색 결과 제목
  url: string // 검색 결과 URL
  snippet: string // 검색 결과 스니펫
  published_date?: string // 게시 날짜
  author?: string // 작성자
}

export interface WebSearchToolResultError {
  type: 'web_search_tool_result_error' // 오류 타입 (항상 "web_search_tool_result_error")
  error_code:
  | 'invalid_tool_input'
  | 'unavailable'
  | 'max_uses_exceeded'
  | 'too_many_requests'
  | 'query_too_long' // 오류 코드
}

export interface WebSearchResult {
  type: 'web_search_result' // 결과 타입 (항상 "web_search_result")
  title: string // 검색 결과 제목
  url: string // 검색 결과 URL
  encrypted_content: string // 암호화된 콘텐츠
  page_age?: string | null // 페이지 나이
}

export interface WebFetchToolResultError {
  type: 'web_fetch_tool_result_error' // 오류 타입 (항상 "web_fetch_tool_result_error")
  error_code:
  | 'invalid_tool_input'
  | 'url_too_long'
  | 'url_not_allowed'
  | 'url_not_accessible'
  | 'unsupported_content_type'
  | 'too_many_requests'
  | 'max_use_exceeded'
  | 'unavailable' // 오류 코드
}

export interface WebFetchToolResult {
  type: 'web_fetch_result' // 결과 타입 (항상 "web_fetch_result")
  url: string // 가져온 URL
  content: {
    source:
    | Base64DocumentSource
    | PlainTextDocumentSource
    | ContentBlockDocumentSource
    | URLDocumentSource
    | FileDocumentSource // 문서 소스
    type: 'document' // 콘텐츠 타입 (항상 "document")
    cache_control?: CacheControl | null // 캐시 제어 설정
    citations?: { enabled: boolean } | null // 인용 설정
    context?: string | null // 컨텍스트
    title?: string | null // 제목
  } // 가져온 콘텐츠
  retrieved_at: string | null // 가져온 시간
}

// ============================================================================
// Code Execution Types
// ============================================================================

export interface CodeExecutionToolResultError {
  type: 'code_execution_tool_result_error' // 오류 타입 (항상 "code_execution_tool_result_error")
  error_code: 'invalid_tool_input' | 'unavailable' | 'too_many_requests' | 'execution_time_exceeded' // 오류 코드
}

export interface CodeExecutionResult {
  type: 'code_execution_result' // 결과 타입 (항상 "code_execution_result")
  content: { file_id: string; type: 'code_execution_output' }[] // 실행 결과 콘텐츠
  return_code: number // 반환 코드
  stderr: string // 표준 오류 출력
  stdout: string // 표준 출력
}

export interface BashCodeExecutionToolResultError {
  type: 'bash_code_execution_tool_result_error' // 오류 타입 (항상 "bash_code_execution_tool_result_error")
  error_code:
  | 'invalid_tool_input'
  | 'unavailable'
  | 'too_many_requests'
  | 'execution_time_exceeded'
  | 'output_file_too_large' // 오류 코드
}

export interface BashCodeExecutionResult {
  type: 'bash_code_execution_result' // 결과 타입 (항상 "bash_code_execution_result")
  content: { file_id: string; type: 'bash_code_execution_output' }[] // 실행 결과 콘텐츠
  return_code: number // 반환 코드
  stderr: string // 표준 오류 출력
  stdout: string // 표준 출력
}

export interface TextEditorCodeExecutionToolResultError {
  type: 'text_editor_code_execution_tool_result_error' // 오류 타입 (항상 "text_editor_code_execution_tool_result_error")
  error_code:
  | 'invalid_tool_input'
  | 'unavailable'
  | 'too_many_requests'
  | 'execution_time_exceeded'
  | 'file_not_found' // 오류 코드
  error_message?: string | null // 오류 메시지
}

export interface TextEditorCodeExecutionViewResult {
  type: 'text_editor_code_execution_view_result' // 결과 타입 (항상 "text_editor_code_execution_view_result")
  content: string // 파일 내용
  file_type: 'text' | 'image' | 'pdf' // 파일 타입
  num_lines?: number | null // 줄 수
  start_line?: number | null // 시작 줄
  total_lines?: number | null // 전체 줄 수
}

export interface TextEditorCodeExecutionCreateResult {
  type: 'text_editor_code_execution_create_result' // 결과 타입 (항상 "text_editor_code_execution_create_result")
  is_file_update: boolean // 파일 업데이트 여부
}

export interface TextEditorCodeExecutionStrReplaceResult {
  type: 'text_editor_code_execution_str_replace_result' // 결과 타입 (항상 "text_editor_code_execution_str_replace_result")
  lines?: string[] | null // 줄 배열
  new_lines?: number | null // 새 줄 수
  new_start?: number | null // 새 시작 위치
  old_lines?: number | null // 기존 줄 수
  old_start?: number | null // 기존 시작 위치
}

// ============================================================================
// MCP Server Types
// ============================================================================

export interface RequestMCPServerURLDefinition {
  name: string // MCP 서버 이름
  type: 'url' // 서버 타입 (항상 "url")
  url: string // MCP 서버 URL
  authorization_token?: string | null // 인증 토큰
  tool_configuration?: {
    allowed_tools?: string[] | null // 허용된 도구 목록
    enabled?: boolean | null // 도구 활성화 여부
  } | null // 도구 구성
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface RequestMetadata {
  user_id?: string | null // 사용자 ID
}

export interface ThinkingConfig {
  type: ThinkingType // 사고 과정 타입
  budget_tokens?: number // 사고 토큰 예산
}

// ============================================================================
// Usage & Stop Reason Types
// ============================================================================

export interface Usage {
  input_tokens: number // 입력 토큰 수
  output_tokens: number // 출력 토큰 수
  cache_creation_input_tokens: number | null // 캐시 생성 입력 토큰 수
  cache_read_input_tokens: number | null // 캐시 읽기 입력 토큰 수
  service_tier: 'standard' | 'priority' | 'batch' | null // 서비스 계층
  cache_creation: {
    ephemeral_1h_input_tokens: number // 1시간 임시 캐시 입력 토큰 수
    ephemeral_5m_input_tokens: number // 5분 임시 캐시 입력 토큰 수
  } | null // 캐시 생성 정보
  server_tool_use: {
    web_fetch_requests: number // 웹 페치 요청 수
    web_search_requests: number // 웹 검색 요청 수
  } | null // 서버 도구 사용 정보
}

export interface ContainerInfo {
  id: string // 컨테이너 ID
  expired_at: string // 만료 시간
}

// ============================================================================
// Streaming Types
// ============================================================================

export interface MessageStart {
  type: StreamEventType.MESSAGE_START // 이벤트 타입 (항상 "message_start")
  message: AnthropicResponse // 완전한 메시지 객체
}

export interface MessageDelta {
  type: StreamEventType.MESSAGE_DELTA // 이벤트 타입 (항상 "message_delta")
  delta: {
    stop_reason: StopReason | null // 중단 이유
    stop_sequence: string | null // 중단 시퀀스
  } // 델타 정보
  usage: {
    output_tokens: number // 출력 토큰 수
  } // 토큰 사용량 정보
}

export interface MessageStop {
  type: StreamEventType.MESSAGE_STOP // 이벤트 타입 (항상 "message_stop")
}

export interface Ping {
  type: 'ping' // 이벤트 타입 (항상 "ping")
}

export interface ContentBlockStart {
  type: StreamEventType.CONTENT_BLOCK_START // 이벤트 타입 (항상 "content_block_start")
  index: number // 콘텐츠 블록 인덱스
  content_block: ContentBlock // 콘텐츠 블록 정보
}

export interface ContentBlockDelta {
  type: StreamEventType.CONTENT_BLOCK_DELTA // 이벤트 타입 (항상 "content_block_delta")
  index: number // 콘텐츠 블록 인덱스
  delta: TextBlockDelta | ThinkingBlockDelta | SignatureBlockDelta | InputJsonBlockDelta // 델타 데이터
}

export interface TextBlockDelta {
  type: DeltaType.TEXT_DELTA // 델타 타입 (항상 "text_delta")
  text: string // 추가된 텍스트
}

export interface InputJsonBlockDelta {
  type: DeltaType.INPUT_JSON_DELTA // 델타 타입 (항상 "input_json_delta")
  partial_json: string // 부분 JSON 문자열
}

export interface ThinkingBlockDelta {
  type: DeltaType.THINKING_DELTA // 델타 타입 (항상 "thinking_delta")
  thinking: string // 추가된 사고 과정 텍스트
}

export interface SignatureBlockDelta {
  type: DeltaType.SIGNATURE_DELTA // 델타 타입 (항상 "signature_delta")
  signature: string // 추가된 서명
}

export interface ContentBlockStop {
  type: StreamEventType.CONTENT_BLOCK_STOP // 이벤트 타입 (항상 "content_block_stop")
  index: number // 콘텐츠 블록 인덱스
}

// ============================================================================
// Files API Types
// ============================================================================

export interface FileUploadRequest {
  file: File | Buffer | string // 업로드할 파일 (File 객체, Buffer, 또는 문자열)
  purpose: FilePurpose // 파일 용도
}

export interface FileUploadResponse {
  id: string // 파일 고유 식별자
  object: 'file' // 객체 타입 (항상 "file")
  created_at: number // 생성 시간 (Unix 타임스탬프)
  name: string // 파일명
  size: number // 파일 크기 (바이트)
  type: string // 파일 MIME 타입
  purpose: string // 파일 용도
}

export interface FileListResponse {
  object: 'list' // 객체 타입 (항상 "list")
  data: FileUploadResponse[] // 파일 목록
}

// ============================================================================
// Batch API Types
// ============================================================================

export interface AnthropicBatchRequest {
  custom_id: string
  params: AnthropicRequest
}

export interface AnthropicBatchResponse {
  id: string
  type: 'message_batch'
  processing_status: 'in_progress' | 'ended' | 'canceling' | 'canceled' | 'expired'
  request_counts: {
    processing: number
    succeeded: number
    errored: number
    canceled: number
    expired: number
  }
  created_at: string
  ended_at: string | null
  archived_at: string | null
  expires_at: string
  cancel_initiated_at: string | null
  results_url: string | null
}

export interface BatchError {
  type: 'error'
  error: {
    type: string
    message: string
  }
}

export interface BatchResults {
  custom_id: string
  result:
  | {
    type: 'succeeded'
    message: AnthropicResponse
  }
  | {
    type: 'errored'
    error: BatchError
  }
  | {
    type: 'canceled'
  }
  | {
    type: 'expired'
  }
}

export interface FileRetrieveResponse extends FileUploadResponse { }

export interface FileDeleteResponse {
  id: string // 파일 고유 식별자
  object: 'file' // 객체 타입 (항상 "file")
  deleted: boolean // 삭제 성공 여부
}

// ============================================================================
// Prompt Caching Types
// ============================================================================

export interface PromptCacheConfig {
  ttl: PromptCacheTTL // 캐시 수명
  enabled: boolean // 캐시 활성화 여부
}

export interface CacheMetrics {
  cache_hit_rate: number // 캐시 히트율 (0.0-1.0)
  cache_miss_rate: number // 캐시 미스율 (0.0-1.0)
  total_requests: number // 총 요청 수
  cached_requests: number // 캐시된 요청 수
}

// ============================================================================
// Legacy Types (for backward compatibility)
// ============================================================================

export interface CacheControl {
  type: CacheControlType // 캐시 타입 (항상 "ephemeral")
  ttl: CacheControlTTL // 캐시 수명
}

export interface AnthropicHeaders {
  'anthropic-version': string // API 버전 (예: "2023-06-01")
  'x-api-key': string // API 키
  'anthropic-beta'?: string[] // 베타 기능 헤더 (선택사항)
  'content-type': 'application/json' // 콘텐츠 타입 (항상 "application/json")
}

export interface AnthropicResponseHeaders {
  'anthropic-organization-id': string // 조직 ID
  'request-id': string // 요청 ID (디버깅용)
}
