// Google Gemini API Types
// Based on: https://ai.google.dev/gemini-api/docs

// ============================================================================
// Core Request & Response Types (Most Important)
// ============================================================================

export interface GoogleRequest {
  contents: Content[] // 필수: 모델과의 현재 대화 콘텐츠 (싱글턴 쿼리의 경우 단일 인스턴스, 채팅과 같은 멀티턴 쿼리의 경우 대화 기록과 최근 요청이 포함된 반복 필드)
  tools?: Tool[] // 선택사항: Model이 다음 대답을 생성하는 데 사용할 수 있는 Tools 목록 (Tool은 시스템이 Model의 지식과 범위를 벗어나 외부 시스템과 상호작용하여 작업 또는 작업 집합을 수행할 수 있도록 하는 코드 조각, 지원되는 Tool는 Function 및 codeExecution)
  toolConfig?: ToolConfig // 선택사항: 요청에 지정된 Tool의 도구 구성
  safetySettings?: SafetySetting[] // 선택사항: 안전하지 않은 콘텐츠를 차단하기 위한 고유한 SafetySetting 인스턴스 목록 (이 규칙은 GenerateContentRequest.contents 및 GenerateContentResponse.candidates에 적용됨, 각 SafetyCategory 유형에 설정이 두 개 이상 있으면 안 됨, API는 이러한 설정에 의해 설정된 기준을 충족하지 않는 콘텐츠와 응답을 차단함)
  systemInstruction?: SystemInstruction // 선택사항: 개발자가 설정한 시스템 요청 사항 (현재는 텍스트만 지원)
  generationConfig?: GenerationConfig // 선택사항: 모델 생성 및 출력의 구성 옵션
  cachedContent?: string // 선택사항: 예측을 제공하기 위한 컨텍스트로 사용하기 위해 캐시된 콘텐츠의 이름 (형식: cachedContents/{cachedContent})
}

export interface GoogleResponse {
  candidates: Candidate[] // 모델의 후보 응답 (여러 후보 응답을 지원하는 모델의 응답)
  promptFeedback?: PromptFeedback // 콘텐츠 필터와 관련된 프롬프트의 의견을 반환
  usageMetadata?: UsageMetadata // 출력 전용: 생성 요청의 토큰 사용량에 관한 메타데이터
  modelVersion?: string // 출력 전용: 대답을 생성하는 데 사용된 모델 버전
  responseId?: string // 출력 전용: responseId는 각 응답을 식별하는 데 사용됨
}

export interface GoogleError {
  error: {
    code: number
    message: string
    status: string
    details?: any[]
  }
}

// ============================================================================
// Caching Request & Response Types
// ============================================================================

export interface CachedContent {
  name: string // 출력 전용: 식별자, 캐시된 콘텐츠를 참조하는 리소스 이름 (형식: cachedContents/{id}) - 사전 처리되었으며 GenerativeService에 대한 후속 요청에서 사용할 수 있는 콘텐츠, 캐시된 콘텐츠는 생성된 모델에서만 사용할 수 있음
  model: string // 필수, 변경할 수 없음: 캐시된 콘텐츠에 사용할 Model의 이름 (형식: models/{model})
  contents?: Content[] // 선택사항, 입력 전용, 변경할 수 없음: 캐시할 콘텐츠
  tools?: Tool[] // 선택사항, 입력 전용, 변경할 수 없음: 모델이 다음 대답을 생성하는 데 사용할 수 있는 Tools 목록
  toolConfig?: ToolConfig // 선택사항, 입력 전용, 변경할 수 없음: 도구 구성 (이 구성은 모든 도구에서 공유됨)
  systemInstruction?: SystemInstruction // 선택사항, 입력 전용, 변경할 수 없음: 개발자가 설정한 시스템 요청 사항 (현재는 텍스트만 지원)
  expiration: Expiration // 이 리소스가 만료되는 시점을 지정 (expireTime 또는 ttl 중 하나여야 함)
  displayName?: string // 선택사항, 변경할 수 없음: 캐시된 콘텐츠의 사용자 생성 의미 있는 표시 이름 (최대 128개의 유니코드 문자)
  usageMetadata?: CachedContentUsageMetadata // 출력 전용: 캐시된 콘텐츠 사용에 관한 메타데이터
  createTime?: string // 출력 전용: 캐시 항목의 생성 시간 (생성된 출력은 항상 Z-정규화되고 소수점 이하 0, 3, 6 또는 9자리인 RFC 3339를 사용, 예: "2014-10-02T15:01:23Z", "2014-10-02T15:01:23.045123456Z" 또는 "2014-10-02T15:01:23+05:30")
  updateTime?: string // 출력 전용: 캐시 항목이 마지막으로 업데이트된 시간(UTC) (생성된 출력은 항상 Z-정규화되고 소수점 이하 0, 3, 6 또는 9자리인 RFC 3339를 사용)
}

// ============================================================================
// Content Types
// ============================================================================

export interface Content {
  role: 'user' | 'model' // 선택사항: 콘텐츠 제작자 ('user' 또는 'model' 중 하나여야 함, 멀티턴 대화에 설정하는 것이 유용하며, 그렇지 않은 경우 비워 두거나 설정하지 않아도 됨) - 메시지의 여러 부분으로 구성된 콘텐츠를 포함하는 구조화된 데이터의 기본 유형
  parts: Part[] // 단일 메시지를 구성하는 순서가 지정된 Parts (부분마다 MIME 유형이 다를 수 있음)
}

export interface Part {
  thought?: boolean // 선택사항: 모델에서 파트를 생성했는지 여부를 나타냄 - 멀티 파트 Content 메시지의 일부인 미디어를 포함하는 데이터 유형 (Part는 연결된 데이터 유형이 있는 데이터로 구성됨, Part에는 Part.data에서 허용되는 유형 중 하나만 포함할 수 있음)
  thoughtSignature?: string // 선택사항: 후속 요청에서 재사용할 수 있도록 생각에 대한 불투명 서명 (base64 인코딩 문자열)
  videoMetadata?: VideoMetadata // 선택사항: 동영상 메타데이터 (메타데이터는 동영상 데이터가 inlineData 또는 fileData에 표시되는 동안에만 지정되어야 함) - 데이터의 추가 전처리를 제어
  text?: string // 인라인 텍스트 (data Union type 중 하나)
  inlineData?: InlineData // 인라인 미디어 바이트 (data Union type 중 하나)
  functionCall?: FunctionCall // 인수와 해당 값이 포함된 FunctionDeclaration.name을 나타내는 문자열이 포함된 모델에서 반환된 예측된 FunctionCall (data Union type 중 하나)
  functionResponse?: FunctionResponse // FunctionDeclaration.name을 나타내는 문자열과 함수의 출력이 포함된 구조화된 JSON 객체가 포함된 FunctionCall의 결과 출력이 모델의 컨텍스트로 사용됨 (data Union type 중 하나)
  fileData?: FileData // URI 기반 데이터 (data Union type 중 하나)
  executableCode?: ExecutableCode // 실행 목적으로 모델에서 생성된 코드 (data Union type 중 하나)
  codeExecutionResult?: CodeExecutionResult // ExecutableCode 실행 결과 (data Union type 중 하나)
}

// ============================================================================
// Response Candidate Types
// ============================================================================

export interface Candidate {
  content: Content // 출력 전용: 모델에서 반환된 생성된 콘텐츠 (모델에서 생성된 대답 후보)
  finishReason?: FinishReason // 선택사항, 출력 전용: 모델 토큰 생성이 중지된 이유 (비어 있으면 모델이 토큰 생성을 중단하지 않은 것)
  safetyRatings?: SafetyRating[] // 대답 후보의 안전에 대한 평가 목록 (카테고리당 등급은 최대 1개)
  citationMetadata?: CitationMetadata // 출력 전용: 모델 생성 후보의 인용 정보 (content에 포함된 텍스트의 낭독 정보로 채워질 수 있음, 기본 LLM의 학습 데이터에 있는 저작권이 있는 자료에서 '인용'된 구절)
  tokenCount?: number // 출력 전용: 이 후보의 토큰 수
  groundingAttributions?: GroundingAttribution[] // 출력 전용: 그라운딩된 답변에 기여한 소스의 저작자 표시 정보 (GenerateAnswer 호출에 채워짐)
  groundingMetadata?: GroundingMetadata // 출력 전용: 후보의 그라운딩 메타데이터 (GenerateContent 호출에 채워짐)
  avgLogprobs?: number // 출력 전용: 후보의 평균 로그 확률 점수
  logprobsResult?: LogprobsResult // 출력 전용: 대답 토큰 및 상위 토큰의 로그 가능도 점수
  urlContextMetaData?: UrlContextMetaData // 출력 전용: URL 컨텍스트 가져오기 도구와 관련된 메타데이터
  index: number // 출력 전용: 대답 후보 목록에서 후보의 색인
}

// ============================================================================
// Data Types
// ============================================================================

export interface InlineData {
  mimeType: string // 소스 데이터의 IANA 표준 MIME 유형 (예: image/png, image/jpeg, 지원되지 않는 MIME 유형이 제공되면 오류가 반환됨, 지원되는 유형의 전체 목록은 지원되는 파일 형식을 참고) - 원시 미디어 바이트 (텍스트는 원시 바이트로 전송하면 안 됨, 'text' 필드를 사용해야 함)
  data: string // 미디어 형식의 원시 바이트 (base64 인코딩 문자열)
}

export interface FileData {
  mimeType: string // 선택사항: 소스 데이터의 IANA 표준 MIME 유형 - URI 기반 데이터
  fileUri: string // 필수: URI
}

export interface VideoMetadata {
  startOffset?: string // 선택사항: 동영상의 시작 오프셋 (소수점 아래가 최대 9자리까지이고 's'로 끝나는 초 단위 기간, 예: "3.5s") - 메타데이터는 입력 동영상 콘텐츠를 설명
  endOffset?: string // 선택사항: 동영상의 종료 오프셋 (소수점 아래가 최대 9자리까지이고 's'로 끝나는 초 단위 기간, 예: "3.5s")
  fps?: number // 선택사항: 모델로 전송된 동영상의 프레임 속도 (지정하지 않으면 기본값은 1.0, fps 범위는 (0.0, 24.0])
}

export interface ExecutableCode {
  language: Language // 필수: code의 프로그래밍 언어 - 실행 목적으로 모델에서 생성된 코드와 모델에 반환된 결과 (CodeExecution 도구를 사용하는 경우에만 생성됨, 이 경우 코드가 자동으로 실행되고 해당 CodeExecutionResult도 생성됨)
  code: string // 필수: 실행할 코드
}

export interface CodeExecutionResult {
  language: Language // 필수: code의 프로그래밍 언어 - ExecutableCode 실행 결과 (CodeExecution를 사용하는 경우에만 생성되며 항상 ExecutableCode를 포함하는 part가 뒤따름)
  code: string // 필수: 실행할 코드
  output?: string // 선택사항: 코드 실행이 성공하면 stdout을 포함하고, 그렇지 않으면 stderr 또는 기타 설명을 포함
  outcome?: Outcome // 필수: 코드 실행의 결과
  executionTime?: string // 선택사항: 실행 시간 (Duration format)
}

export enum Language {
  LANGUAGE_UNSPECIFIED = 'LANGUAGE_UNSPECIFIED', // 지정되지 않은 언어입니다 (이 값은 사용하면 안 됨) - 생성된 코드에 지원되는 프로그래밍 언어
  PYTHON = 'PYTHON' // numpy 및 simpy를 사용할 수 있는 Python >= 3.10
}

export enum Outcome {
  OUTCOME_UNSPECIFIED = 'OUTCOME_UNSPECIFIED', // 지정되지 않은 상태입니다 (이 값은 사용하면 안 됨) - 코드 실행의 가능한 결과의 열거형
  OUTCOME_OK = 'OUTCOME_OK', // 코드 실행이 완료되었습니다
  OUTCOME_FAILED = 'OUTCOME_FAILED', // 코드 실행이 완료되었지만 실패했습니다 (stderr에는 이유가 포함됨)
  OUTCOME_DEADLINE_EXCEEDED = 'OUTCOME_DEADLINE_EXCEEDED' // 코드 실행이 너무 오래 실행되어 취소되었습니다 (출력이 부분적으로 표시되거나 표시되지 않을 수 있음)
}

// ============================================================================
// Tool & Function Calling Types
// ============================================================================

export interface Tool {
  functionDeclarations?: FunctionDeclaration[] // 선택사항: 함수 호출에 사용할 수 있는 모델에 제공되는 FunctionDeclarations 목록 (모델 또는 시스템이 함수를 실행하지 않음, 대신 정의된 함수가 실행을 위해 클라이언트 측에 인수가 있는 FunctionCall로 반환될 수 있음) - 모델이 대답을 생성하는 데 사용할 수 있는 도구 세부정보 (Tool은 시스템이 모델의 지식과 범위를 벗어나 외부 시스템과 상호작용하여 작업 또는 작업 집합을 수행할 수 있도록 하는 코드 조각)
  googleSearchRetrieval?: GoogleSearchRetrieval // 선택사항: 그라운딩을 위해 공개 웹 데이터를 검색하는 도구로, Google에서 제공
  codeExecution?: CodeExecution // 선택사항: 모델이 생성의 일부로 코드를 실행할 수 있도록 지원
  googleSearch?: GoogleSearch // 선택사항: GoogleSearch 도구 유형, 모델에서 Google 검색을 지원하는 도구 Google에서 제공
  urlContext?: UrlContext // 선택사항: URL 컨텍스트 가져오기를 지원하는 도구
}

export interface ToolConfig {
  functionCallingConfig?: FunctionCallingConfig // 선택사항: 함수 호출 구성 - 요청에서 Tool 사용을 지정하는 매개변수가 포함된 도구 구성
}

export interface FunctionCallingConfig {
  mode?: FunctionCallingMode // 선택사항: 함수 호출이 실행되어야 하는 모드를 지정 (지정하지 않으면 기본값이 AUTO로 설정됨) - 함수 호출 동작을 지정하기 위한 구성
  allowedFunctionNames?: string[] // 선택사항: 제공 시 모델이 호출할 함수를 제한하는 함수 이름 세트 (모드가 ANY 또는 VALIDATED인 경우에만 설정해야 함, 함수 이름은 FunctionDeclaration.name과 일치해야 함)
}

export enum FunctionCallingMode {
  MODE_UNSPECIFIED = 'MODE_UNSPECIFIED', // 지정되지 않은 함수 호출 모드입니다 (이 값은 사용하면 안 됨) - 실행 모드를 정의하여 함수 호출의 실행 동작을 정의
  AUTO = 'AUTO', // 기본 모델 동작으로, 모델이 함수 호출 또는 자연어 응답을 예측하도록 결정합니다
  ANY = 'ANY', // 모델이 항상 함수 호출만 예측하도록 제한됩니다 ('allowedFunctionNames'가 설정되면 예측 함수 호출이 'allowedFunctionNames' 중 하나로 제한됨)
  NONE = 'NONE', // 모델이 함수 호출을 예측하지 않습니다 (모델 동작은 함수 선언을 전달하지 않는 경우와 동일함)
  VALIDATED = 'VALIDATED' // 모델이 함수 호출 또는 자연어 응답을 예측하도록 결정하지만 제한된 디코딩으로 함수 호출을 검증합니다
}

export interface FunctionDeclaration {
  name: string // 필수: 함수 이름 (a~z, A~Z, 0~9이거나 밑줄과 대시를 포함해야 함, 최대 63자 길이) - OpenAPI 3.03 사양에 따라 정의된 함수 선언의 구조화된 표현 (이 선언에는 함수 이름과 매개변수가 포함됨, 이 FunctionDeclaration은 모델에서 Tool로 사용하고 클라이언트에서 실행할 수 있는 코드 블록을 나타냄)
  description?: string // 필수: 함수에 대한 간단한 설명
  parameters: Schema // 선택사항: 이 함수의 매개변수를 설명 (Open API 3.03 매개변수 객체 문자열 키를 반영, 매개변수의 이름은 대소문자를 구분함)
  behavior?: Behavior // 선택사항: 함수 동작을 지정 (현재 BidiGenerateContent 메서드에서만 지원됨)
  response?: Schema // 선택사항: 이 함수의 출력을 JSON 스키마 형식으로 설명 (Open API 3.03 응답 객체를 반영)
}

export enum Behavior {
  UNSPECIFIED = 'UNSPECIFIED', // 이 값은 사용되지 않습니다 - 함수 동작을 정의 (기본값은 BLOCKING)
  BLOCKING = 'BLOCKING', // 설정된 경우 시스템은 대화를 계속하기 전에 함수 응답을 기다립니다
  NON_BLOCKING = 'NON_BLOCKING' // 설정된 경우 시스템은 함수 응답을 기다리지 않습니다 (대신 사용자와 모델 간의 대화를 유지하면서 함수 응답이 제공되는 대로 처리하려고 시도함)
}

export interface FunctionCall {
  name: string // 필수: 호출하려는 함수의 이름 (a~z, A~Z, 0~9이거나 밑줄과 대시를 포함해야 함, 최대 63자 길이) - 인수와 해당 값이 포함된 FunctionDeclaration.name을 나타내는 문자열이 포함된 모델에서 반환된 예측된 FunctionCall
  args: Record<string, any> // 선택사항: JSON 객체 형식의 함수 파라미터와 값
  id?: string // 선택사항: 함수 호출의 고유 ID (채워진 경우 클라이언트가 functionCall를 실행하고 일치하는 id를 가진 응답을 반환)
}

export interface FunctionResponse {
  name: string // 필수: 호출하려는 함수의 이름 (a~z, A~Z, 0~9이거나 밑줄과 대시를 포함해야 함, 최대 63자 길이) - FunctionDeclaration.name을 나타내는 문자열과 함수의 출력이 포함된 구조화된 JSON 객체가 포함된 FunctionCall의 결과 출력이 모델의 컨텍스트로 사용됨
  response: Record<string, any> // 필수: JSON 객체 형식의 함수 응답
  id?: string // 선택사항: 이 응답이 속한 함수 호출의 ID (클라이언트가 해당 함수 호출 id와 일치하도록 채움)
  willContinue?: boolean // 선택사항: 함수 호출이 계속되고 더 많은 응답이 반환되어 함수 호출이 생성기로 전환됨을 나타냄 (NON_BLOCKING 함수 호출에만 적용되며, 그 외의 경우에는 무시됨)
  scheduling?: Scheduling // 선택사항: 대화에서 대답이 예약되는 방식을 지정 (NON_BLOCKING 함수 호출에만 적용되며, 그 외의 경우에는 무시됨, 기본값은 WHEN_IDLE)
}

export enum Scheduling {
  SCHEDULING_UNSPECIFIED = 'SCHEDULING_UNSPECIFIED', // 이 값은 사용되지 않습니다 - 대화에서 대답이 예약되는 방식을 지정
  SILENT = 'SILENT', // 결과를 대화 컨텍스트에만 추가하고 생성을 중단하거나 트리거하지 마세요
  WHEN_IDLE = 'WHEN_IDLE', // 결과를 대화 컨텍스트에 추가하고 진행 중인 생성을 중단하지 않고 출력을 생성하라는 메시지를 표시합니다
  INTERRUPT = 'INTERRUPT' // 결과를 대화 컨텍스트에 추가하고, 진행 중인 생성을 중단하고, 출력을 생성하라는 메시지를 표시합니다
}

export interface GoogleSearchRetrieval {
  dynamicRetrievalConfig?: DynamicRetrievalConfig // 지정된 소스의 동적 검색 구성을 지정 - 그라운딩을 위해 공개 웹 데이터를 검색하는 도구로, Google에서 제공
}

export interface DynamicRetrievalConfig {
  mode?: Mode // 동적 검색에 사용할 예측 변수의 모드 - 동적 검색을 맞춤설정하는 옵션을 설명
  dynamicThreshold?: number // 동적 검색에 사용할 임계값 (설정하지 않으면 시스템 기본값이 사용됨)
}

export enum Mode {
  MODE_UNSPECIFIED = 'MODE_UNSPECIFIED', // 항상 검색을 트리거합니다 - 동적 검색에 사용할 예측 변수의 모드
  MODE_DYNAMIC = 'MODE_DYNAMIC' // 시스템에서 필요하다고 판단하는 경우에만 가져오기를 실행합니다
}

export interface GoogleSearch {
  timeRangeFilter?: Interval // 선택사항: 검색 결과를 특정 기간으로 필터링 (고객이 시작 시간을 설정하는 경우 종료 시간도 설정해야 함) - GoogleSearch 도구 유형, 모델에서 Google 검색을 지원하는 도구 Google에서 제공
}

export interface UrlContext {
  // URL 컨텍스트 가져오기를 지원하는 도구 (이 유형에는 필드가 없음)
}

export interface CodeExecution {
  // 모델에서 생성된 코드를 실행하고 결과를 모델에 자동으로 반환하는 도구 (이 유형에는 필드가 없음, 이 도구를 사용할 때만 생성되는 ExecutableCode 및 CodeExecutionResult도 참고)
}

export interface Interval {
  startTime?: string // 선택사항: 간격의 시작(포함) (지정된 경우 이 간격과 일치하는 타임스탬프는 시작과 같거나 시작 이후여야 함, 생성된 출력은 항상 Z-정규화되고 소수점 이하 0, 3, 6 또는 9자리인 RFC 3339를 사용) - 타임스탬프 시작 (포함) 및 타임스탬프 종료 (제외)로 인코딩된 시간 간격을 나타냄
  endTime?: string // 선택사항: 시작과 끝 값을 제외한 간격의 끝 (지정된 경우 이 간격과 일치하는 타임스탬프는 종료 시간 이전이어야 함, 생성된 출력은 항상 Z-정규화되고 소수점 이하 0, 3, 6 또는 9자리인 RFC 3339를 사용)
}

// ============================================================================
// Schema Types
// ============================================================================

export interface Schema {
  type: Type // 필수: 데이터 유형 - Schema 객체를 사용하면 입력 및 출력 데이터 유형을 정의할 수 있음 (이러한 유형은 객체일 수도 있지만 기본 유형과 배열일 수도 있음, OpenAPI 3.0 스키마 객체의 선택된 하위 집합을 나타냄)
  format?: string // 선택사항: 데이터 형식 (모든 값이 허용되지만 대부분은 특별한 기능을 트리거하지 않음)
  title?: string // 선택사항: 스키마의 제목
  description?: string // 선택사항: 매개변수에 대한 간략한 설명 (여기에는 사용 예가 포함될 수 있음, 매개변수 설명은 마크다운 형식일 수 있음)
  nullable?: boolean // 선택사항: null 값을 나타냄
  enum?: string[] // 선택사항: enum 형식의 Type.STRING 요소의 가능한 값 (예: 열거형 방향을 {type:STRING, format:enum, enum:["EAST", NORTH", "SOUTH", "WEST"]}로 정의할 수 있음)
  maxItems?: string // 선택사항: Type.ARRAY의 최대 요소 수 (int64 format)
  minItems?: string // 선택사항: Type.ARRAY의 최소 요소 수 (int64 format)
  properties?: Record<string, Schema> // 선택사항: Type.OBJECT의 속성 ("key": value 쌍 목록을 포함하는 객체, 예: { "name": "wrench", "mass": "1.3kg", "count": "3" })
  required?: string[] // 선택사항: Type.OBJECT의 필수 속성
  minProperties?: string // 선택사항: Type.OBJECT의 최소 속성 수 (int64 format)
  maxProperties?: string // 선택사항: Type.OBJECT의 최대 속성 수 (int64 format)
  minLength?: string // 선택사항: Type.STRING의 최소 길이 (int64 format)
  maxLength?: string // 선택사항: Type.STRING의 최대 길이 (int64 format)
  pattern?: string // 선택사항: 문자열을 정규 표현식으로 제한하는 Type.STRING의 패턴
  example?: any // 선택사항: 객체의 예 (객체가 루트인 경우에만 채워짐, Value format)
  anyOf?: Schema[] // 선택사항: 값은 목록에 있는 하위 스키마 중 하나 이상에 대해 검증되어야 함
  propertyOrdering?: string[] // 선택사항: 속성의 순서 (Open API 사양의 표준 필드가 아님, 응답의 속성 순서를 결정하는 데 사용됨)
  default?: any // 선택사항: 필드의 기본값 (JSON 스키마에 따라 이 필드는 문서 생성기를 위한 것이며 유효성 검사에는 영향을 미치지 않음, Value format)
  items?: Schema // 선택사항: Type.ARRAY 요소의 스키마
  minimum?: number // 선택사항: Type.INTEGER 및 Type.NUMBER의 최솟값
  maximum?: number // 선택사항: Type.INTEGER 및 Type.NUMBER의 최댓값
}

export enum Type {
  TYPE_UNSPECIFIED = 'TYPE_UNSPECIFIED', // 지정되지 않았으므로 사용해서는 안 됩니다 - Type에는 OpenAPI 데이터 유형 목록이 포함됨
  STRING = 'STRING', // 문자열 유형입니다
  NUMBER = 'NUMBER', // 번호 유형입니다
  INTEGER = 'INTEGER', // 정수 유형입니다
  BOOLEAN = 'BOOLEAN', // 불리언 유형입니다
  ARRAY = 'ARRAY', // 배열 유형입니다
  OBJECT = 'OBJECT', // 객체 유형입니다
  NULL = 'NULL' // Null 유형입니다
}

// ============================================================================
// Configuration Types
// ============================================================================

export interface GenerationConfig {
  // 출력 제어
  stopSequences?: string[] // 출력 생성을 중지하는 문자 시퀀스 집합 (최대 5개)
  responseMimeType?: string // 생성된 후보 텍스트의 MIME 유형 (text/plain, application/json, text/x.enum 등)
  responseSchema?: Schema // 생성된 후보 텍스트의 출력 스키마 (OpenAPI 스키마 하위 집합)
  responseJsonSchema?: any // JSON 스키마를 허용하는 responseSchema의 대안
  responseModalities?: Modality[] // 요청된 응답의 모달리티 (텍스트, 이미지, 오디오 등)

  // 생성 파라미터
  candidateCount?: number // 반환할 생성된 응답 수 (기본값: 1)
  maxOutputTokens?: number // 대답 후보에 포함할 최대 토큰 수
  temperature?: number // 출력의 무작위성 제어 (범위: [0.0, 2.0])
  topP?: number // 샘플링 시 고려할 토큰의 최대 누적 확률 (핵 샘플링)
  topK?: number // 샘플링 시 고려할 최대 토큰 수

  // 페널티 설정
  presencePenalty?: number // 이미 사용된 토큰에 대한 존재 페널티 (이진 on/off)
  frequencyPenalty?: number // 토큰 사용 빈도에 비례한 페널티

  // 로그 확률
  responseLogprobs?: boolean // 응답에 logprobs 결과 포함 여부
  logprobs?: number // 반환할 상위 로그 확률 수 (범위: [1, 5])

  // 고급 기능
  seed?: number // 디코딩에 사용할 시드 (재현 가능한 출력)
  enableEnhancedCivicAnswers?: boolean // 향상된 시민 답변 사용 설정
  speechConfig?: SpeechConfig // 음성 생성 구성
  thinkingConfig?: ThinkingConfig // 사고 기능 구성
  mediaResolution?: MediaResolution // 미디어 해상도 설정
}

export interface SafetySetting {
  category: HarmCategory // 필수: 이 설정의 카테고리 (안전 차단 동작에 영향을 미치는 안전 설정)
  threshold: HarmBlockThreshold // 필수: 유해성이 차단되는 확률 기준을 제어 (카테고리의 안전 설정을 전달하면 콘텐츠가 차단될 수 있는 허용된 확률이 변경됨)
}

export interface SystemInstruction {
  parts: Part[]
}

export interface Expiration {
  expireTime?: string // RFC 3339 timestamp
  ttl?: string // Duration format (e.g., "300s")
}

// ============================================================================
// Safety & Harm Types
// ============================================================================

export enum HarmCategory {
  HARM_CATEGORY_UNSPECIFIED = 'HARM_CATEGORY_UNSPECIFIED', // 카테고리가 지정되지 않았습니다
  HARM_CATEGORY_DEROGATORY = 'HARM_CATEGORY_DEROGATORY', // PaLM - ID 또는 보호 속성을 대상으로 하는 부정적이거나 유해한 댓글
  HARM_CATEGORY_TOXICITY = 'HARM_CATEGORY_TOXICITY', // PaLM - 무례하거나 모욕적이거나 욕설이 있는 콘텐츠
  HARM_CATEGORY_VIOLENCE = 'HARM_CATEGORY_VIOLENCE', // PaLM - 개인 또는 그룹에 대한 폭력을 묘사하는 시나리오 또는 유혈 콘텐츠에 대한 일반적인 설명을 묘사합니다
  HARM_CATEGORY_SEXUAL = 'HARM_CATEGORY_SEXUAL', // PaLM - 성행위 또는 기타 외설적인 콘텐츠에 대한 참조가 포함되어 있습니다
  HARM_CATEGORY_MEDICAL = 'HARM_CATEGORY_MEDICAL', // PaLM - 확인되지 않은 의학적 조언을 홍보합니다
  HARM_CATEGORY_DANGEROUS = 'HARM_CATEGORY_DANGEROUS', // PaLM - 유해한 행위를 조장, 촉진 또는 장려하는 위험한 콘텐츠입니다
  HARM_CATEGORY_HARASSMENT = 'HARM_CATEGORY_HARASSMENT', // Gemini - 괴롭힘 콘텐츠
  HARM_CATEGORY_HATE_SPEECH = 'HARM_CATEGORY_HATE_SPEECH', // Gemini - 증오심 표현 및 콘텐츠
  HARM_CATEGORY_SEXUALLY_EXPLICIT = 'HARM_CATEGORY_SEXUALLY_EXPLICIT', // Gemini - 음란물
  HARM_CATEGORY_DANGEROUS_CONTENT = 'HARM_CATEGORY_DANGEROUS_CONTENT', // Gemini - 위험한 콘텐츠
  HARM_CATEGORY_CIVIC_INTEGRITY = 'HARM_CATEGORY_CIVIC_INTEGRITY' // Gemini - 시민적 무결성을 해치는 데 사용될 수 있는 콘텐츠 (지원 중단됨: 대신 enableEnhancedCivicAnswers를 사용하세요)
}

export enum HarmBlockThreshold {
  HARM_BLOCK_THRESHOLD_UNSPECIFIED = 'HARM_BLOCK_THRESHOLD_UNSPECIFIED', // 기준점이 지정되지 않았습니다
  BLOCK_LOW_AND_ABOVE = 'BLOCK_LOW_AND_ABOVE', // 무시할 수 있는 콘텐츠는 허용됩니다 (지정된 유해 가능성 이상에서 차단)
  BLOCK_MEDIUM_AND_ABOVE = 'BLOCK_MEDIUM_AND_ABOVE', // 무시할 수 있는 수준 및 낮음 콘텐츠는 허용됩니다
  BLOCK_ONLY_HIGH = 'BLOCK_ONLY_HIGH', // '무시할 수 있음', '낮음', '중간' 콘텐츠는 허용됩니다
  BLOCK_NONE = 'BLOCK_NONE', // 모든 콘텐츠가 허용됩니다
  OFF = 'OFF' // 안전 필터를 사용 중지합니다
}

export interface SafetyRating {
  category: HarmCategory
  probability: HarmProbability
  blocked: boolean
}

export enum HarmProbability {
  HARM_PROBABILITY_UNSPECIFIED = 'HARM_PROBABILITY_UNSPECIFIED', // 유해성 확률이 지정되지 않았습니다
  NEGLIGIBLE = 'NEGLIGIBLE', // 무시할 수 있는 수준의 유해성
  LOW = 'LOW', // 낮은 수준의 유해성
  MEDIUM = 'MEDIUM', // 중간 수준의 유해성
  HIGH = 'HIGH' // 높은 수준의 유해성
}

// ============================================================================
// Attribution & Grounding Types
// ============================================================================

export interface GroundingAttribution {
  sourceId: AttributionSourceId // 출력 전용: 이 기여에 기여한 소스의 식별자 (답변에 기여한 소스의 출처 표시)
  content: Content // 이 출처를 구성하는 그라운딩 소스 콘텐츠
}

export type AttributionSourceId = GroundingPassageId | SemanticRetrieverChunk // 이 기여에 기여한 소스의 식별자 (Union type: groundingPassage 또는 semanticRetrieverChunk 중 하나)

export interface GroundingPassageId {
  passageId: string // 출력 전용: GenerateAnswerRequest의 GroundingPassage.id와 일치하는 섹션의 ID (GroundingPassage 내의 파트 식별자)
  partIndex: number // 출력 전용: GenerateAnswerRequest의 GroundingPassage.content 내에서 파트의 색인
}

export interface SemanticRetrieverChunk {
  source: string // 출력 전용: 요청의 SemanticRetrieverConfig.source와 일치하는 소스의 이름 (SemanticRetrieverConfig를 사용하여 GenerateAnswerRequest에 지정된 시맨틱 검색기를 통해 가져온 Chunk의 식별자)
  chunk: string // 출력 전용: 저작자 표시 텍스트가 포함된 Chunk의 이름 (예: corpora/123/documents/abc/chunks/xyz)
}

export interface GroundingMetadata {
  groundingChunks: GroundingChunk[] // 지정된 그라운딩 소스에서 가져온 지원 참조 목록 (그라운딩이 사용 설정된 경우 클라이언트에 반환되는 메타데이터)
  groundingSupports: GroundingSupport[] // 그라운딩 지원 목록
  webSearchQueries: string[] // 후속 웹 검색을 위한 웹 검색어
  searchEntryPoint: SearchEntryPoint // 선택사항: 후속 웹 검색을 위한 Google 검색 항목
  retrievalMetadata: RetrievalMetadata // 그라운딩 흐름의 검색과 관련된 메타데이터
}

export interface GroundingChunk {
  web: Web // 웹의 그라운딩 청크 (그라운딩 청크의 청크 유형)
}

export interface Web {
  uri: string // 청크의 URI 참조 (웹에서 가져온 청크)
  title: string // 청크의 제목
}

export interface GroundingSupport {
  grouningChunkIndices: number[] // 클레임과 연결된 인용을 지정하는 색인('grounding_chunk'에 대한) 목록 (그라운딩 지원)
  confidenceScores: number[] // 지원 참조의 신뢰도 점수 (범위는 0~1, 1이 가장 확신하는 것, 이 목록의 크기는 groundingChunkIndices와 같아야 함)
  segment: Segment // 이 지원이 속한 콘텐츠의 세그먼트
}

export interface Segment {
  partIndex: number // 출력 전용: 상위 콘텐츠 객체 내의 파트 객체의 색인 (콘텐츠의 세그먼트)
  startIndex: number // 출력 전용: 지정된 파트의 시작 색인(바이트 단위) (파트 시작 부분에서 오프셋, 0부터 시작, 포함)
  endIndex: number // 출력 전용: 지정된 부분의 끝 색인(바이트 단위) (파트 시작 부분에서 오프셋, 0부터 시작, 제외)
  text: string // 출력 전용: 대답의 세그먼트에 해당하는 텍스트
}

export interface SearchEntryPoint {
  renderedContent: string // 선택사항: 웹페이지 또는 앱 웹뷰에 삽입할 수 있는 웹 콘텐츠 스니펫 (Google 검색 진입점)
  sdkBlob: string // 선택사항: <검색어, 검색 URL> 튜플 배열을 나타내는 Base64 인코딩 JSON (Base64 인코딩 문자열)
}

export interface RetrievalMetadata {
  googleSearchDynamicRetrievalScore: number // 선택사항: Google 검색의 정보가 프롬프트에 답변하는 데 얼마나 도움이 될 수 있는지를 나타내는 점수 (그라운딩 흐름의 검색과 관련된 메타데이터)
  // 점수는 [0, 1] 범위에 속하며, 0은 가능성이 가장 낮고 1은 가능성이 가장 높습니다
  // 이 점수는 Google 검색 그라운딩 및 동적 검색이 사용 설정된 경우에만 채워집니다
  // Google 검색을 트리거할지 여부를 결정하기 위해 기준점과 비교됩니다
}

// ============================================================================
// Semantic Retrieval Types
// ============================================================================

export interface SemanticRetrievalConfig {
  source: SemanticRetrievalSource
  query?: SemanticRetrievalQuery
  dynamicRetrievalConfig?: DynamicRetrievalConfig
}

export interface SemanticRetrievalSource {
  groundingPassage?: GroundingPassageId
  semanticRetrieverChunk?: SemanticRetrieverChunk
}

export interface SemanticRetrievalQuery {
  query: string
}

export interface DynamicRetrievalConfig {
  mode?: Mode
  dynamicThreshold?: number
}

// ============================================================================
// Citation & Feedback Types
// ============================================================================

export interface CitationMetadata {
  citationSources: CitationSource[] // 특정 대답의 소스에 대한 인용 (콘텐츠의 소스 저작자 표시 모음)
}

export interface CitationSource {
  startIndex?: number // 선택사항: 이 출처에 기여한 응답 세그먼트의 시작 (바이트 단위로 측정된 세그먼트의 시작을 나타냄)
  endIndex?: number // 선택사항: 기여도가 부여된 세그먼트의 끝(해당 값 제외) (바이트 단위로 측정)
  uri?: string // 선택사항: 텍스트의 일부에 대한 소스로 표시되는 URI
  license?: string // 선택사항: 세그먼트의 소스로 표시된 GitHub 프로젝트의 라이선스 (코드 인용에는 라이선스 정보가 필요)
}

export interface PromptFeedback {
  blockReason?: BlockReason // 선택사항: 설정된 경우 프롬프트가 차단되고 후보가 반환되지 않음 (프롬프트를 변경해야 함) - GenerateContentRequest.content에 지정된 프롬프트의 피드백 메타데이터 세트
  safetyRatings?: SafetyRating[] // 프롬프트의 안전 등급 (카테고리당 등급은 최대 1개)
}

export enum BlockReason {
  BLOCK_REASON_UNSPECIFIED = 'BLOCK_REASON_UNSPECIFIED', // 기본값 (이 값은 사용되지 않음) - 프롬프트가 차단된 이유를 지정
  SAFETY = 'SAFETY', // 안전상의 이유로 프롬프트가 차단되었습니다 (safetyRatings를 검사하여 차단한 안전 카테고리를 파악)
  OTHER = 'OTHER', // 알 수 없는 이유로 프롬프트가 차단되었습니다
  BLOCKLIST = 'BLOCKLIST', // 용어 차단 목록에 포함된 용어로 인해 프롬프트가 차단되었습니다
  PROHIBITED_CONTENT = 'PROHIBITED_CONTENT', // 금지된 콘텐츠로 인해 프롬프트가 차단되었습니다
  IMAGE_SAFETY = 'IMAGE_SAFETY' // 안전하지 않은 이미지 생성 콘텐츠로 인해 후보자가 차단되었습니다
}

// ============================================================================
// Usage & Token Types
// ============================================================================

export interface UsageMetadata {
  promptTokenCount: number // 프롬프트의 토큰 수 (cachedContent가 설정된 경우에도 이는 여전히 총 유효 프롬프트 크기이며 캐시된 콘텐츠의 토큰 수를 포함) - 생성 요청의 토큰 사용량에 관한 메타데이터
  cachedContentTokenCount?: number // 프롬프트의 캐시된 부분 (캐시된 콘텐츠)에 있는 토큰 수
  candidatesTokenCount?: number // 생성된 모든 대답 후보의 총 토큰 수
  toolUsePromptTokenCount?: number // 출력 전용: 도구 사용 프롬프트에 있는 토큰 수
  thoughtsTokenCount?: number // 출력 전용: 사고 모델의 사고 토큰 수
  totalTokenCount?: number // 생성 요청 (프롬프트 + 응답 후보)의 총 토큰 수
  promptTokenDetails?: ModalityTokenCount[] // 출력 전용: 요청 입력에서 처리된 모달리티 목록
  cacheTokenDetails?: ModalityTokenCount[] // 출력 전용: 요청 입력에 있는 캐시된 콘텐츠의 모달리티 목록
  candidatesTokensDetails?: ModalityTokenCount[] // 출력 전용: 대답에 반환된 모달리티 목록
  toolUsePromptTokensDetails?: ModalityTokenCount[] // 출력 전용: 도구 사용 요청 입력에 대해 처리된 모달리티 목록
}

// CachedContent용 UsageMetadata (다른 구조)
export interface CachedContentUsageMetadata {
  totalTokenCount: number // 캐시된 콘텐츠가 사용하는 총 토큰 수 - 캐시된 콘텐츠 사용에 관한 메타데이터
}

export interface ModalityTokenCount {
  modality: Modality // 이 토큰 수와 연결된 모달리티
  tokenCount: number // 토큰 수
}

export enum Modality {
  MODALITY_UNSPECIFIED = 'MODALITY_UNSPECIFIED', // 모달리티가 지정되지 않았습니다
  IMAGE = 'IMAGE', // 이미지 모달리티
  AUDIO = 'AUDIO', // 오디오 모달리티
  TEXT = 'TEXT', // 텍스트 모달리티
  VIDEO = 'VIDEO', // 비디오 모달리티
  DOCUMENT = 'DOCUMENT' // 문서 모달리티
}

// ============================================================================
// Speech & Media Configuration Types
// ============================================================================

export interface SpeechConfig {
  voiceConfig?: VoiceConfig // 단일 음성 출력의 경우의 구성
  multiSpeakerVoiceConfig?: MultiSpeakerVoiceConfig // 다중 스피커 설정의 구성 (voiceConfig와 상호 배타적)
  languageCode?: SupportedLanguageCode // 음성 합성을 위한 언어 코드 (BCP 47 형식)
}

export interface VoiceConfig {
  prebuiltVoiceConfig?: PrebuiltVoiceConfig // 사용할 사전 빌드 음성의 구성
}

export interface PrebuiltVoiceConfig {
  voiceName: string // 사용할 사전 설정된 음성의 이름
}

export interface MultiSpeakerVoiceConfig {
  speakerVoiceConfigs: SpeakerVoiceConfig[] // 사용 설정된 모든 스피커 음성
}

export interface SpeakerVoiceConfig {
  speaker: string // 사용할 스피커의 이름 (프롬프트와 동일해야 함)
  voiceConfig: VoiceConfig // 사용할 음성의 구성
}

// 지원되는 언어 코드 상수
export const SUPPORTED_LANGUAGE_CODES = [
  'de-DE',
  'en-AU',
  'en-GB',
  'en-IN',
  'en-US',
  'es-US',
  'fr-FR',
  'hi-IN',
  'pt-BR',
  'ar-XA',
  'es-ES',
  'fr-CA',
  'id-ID',
  'it-IT',
  'ja-JP',
  'tr-TR',
  'vi-VN',
  'bn-IN',
  'gu-IN',
  'kn-IN',
  'ml-IN',
  'mr-IN',
  'ta-IN',
  'te-IN',
  'nl-NL',
  'ko-KR',
  'cmn-CN',
  'pl-PL',
  'ru-RU',
  'th-TH'
] as const

export type SupportedLanguageCode = (typeof SUPPORTED_LANGUAGE_CODES)[number]

export interface ThinkingConfig {
  includeThoughts?: boolean // 대답에 생각을 포함할지 여부 (true인 경우 생각이 사용 가능한 경우에만 반환됨)
  thinkingBudget?: number // 모델이 생성해야 하는 사고 토큰 수
  thinkingLevel?: string // 사고의 복잡도 수준
}

export enum MediaResolution {
  MEDIA_RESOLUTION_UNSPECIFIED = 'MEDIA_RESOLUTION_UNSPECIFIED', // 미디어 해상도가 설정되지 않았습니다
  MEDIA_RESOLUTION_LOW = 'MEDIA_RESOLUTION_LOW', // 미디어 해상도가 낮음으로 설정됨 (64개 토큰)
  MEDIA_RESOLUTION_MEDIUM = 'MEDIA_RESOLUTION_MEDIUM', // 미디어 해상도가 중간 (256개 토큰)으로 설정되어 있습니다
  MEDIA_RESOLUTION_HIGH = 'MEDIA_RESOLUTION_HIGH' // 미디어 해상도가 높음으로 설정됨 (256개의 토큰으로 확대된 프레임 재구성)
}

// ============================================================================
// Logprobs Types
// ============================================================================

export interface LogprobsResult {
  topCandidates: TopCandidates[] // 길이 = 총 디코딩 단계 수 (Logprobs 결과)
  chosenCandidates: LogprobsCandidate[] // 길이 = 총 디코딩 단계 수 (선택한 후보는 topCandidates에 있을 수도 있고 없을 수도 있음)
}

export interface TopCandidates {
  candidates: LogprobsCandidate[] // 각 디코딩 단계에서 로그 확률이 가장 높은 후보 (로그 확률을 기준으로 내림차순으로 정렬됨)
}

export interface LogprobsCandidate {
  token: string // 후보자의 토큰 문자열 값
  tokenId: number // 후보자의 토큰 ID 값
  logProbability: number // 후보의 로그 확률 (logprobs 토큰 및 점수의 후보)
}

// ============================================================================
// URL Context Types
// ============================================================================

export interface UrlContextMetaData {
  urlMetaData: UrlMetaData[] // URL 컨텍스트 목록 (URL 컨텍스트 가져오기 도구와 관련된 메타데이터)
}

export interface UrlMetaData {
  retrievedUrl: string // 도구에서 가져온 URL
  urlRetrievalStatus: UrlRetrievalStatus // URL 가져오기의 상태 (단일 URL 검색의 컨텍스트)
}

export enum UrlRetrievalStatus {
  URL_RETRIEVAL_STATUS_UNSPECIFIED = 'URL_RETRIEVAL_STATUS_UNSPECIFIED', // 기본값 (이 값은 사용되지 않음)
  URL_RETRIEVAL_STATUS_SUCCESS = 'URL_RETRIEVAL_STATUS_SUCCESS', // URL 가져오기가 완료되었습니다
  URL_RETRIEVAL_STATUS_ERROR = 'URL_RETRIEVAL_STATUS_ERROR', // 오류로 인해 URL을 가져올 수 없습니다
  URL_RETRIEVAL_STATUS_PAYWALL = 'URL_RETRIEVAL_STATUS_PAYWALL', // 콘텐츠가 페이월 뒤에 있어 URL 가져오기에 실패했습니다
  URL_RETRIEVAL_STATUS_UNSAFE = 'URL_RETRIEVAL_STATUS_UNSAFE' // 콘텐츠가 안전하지 않아 URL 가져오기에 실패했습니다
}

// ============================================================================
// Finish Reason Types
// ============================================================================

export enum FinishReason {
  FINISH_REASON_UNSPECIFIED = 'FINISH_REASON_UNSPECIFIED', // 기본값 (이 값은 사용되지 않음) - 모델 토큰 생성이 중지된 이유를 정의
  STOP = 'STOP', // 모델의 자연 중단 지점 또는 중지 시퀀스가 제공됩니다
  MAX_TOKENS = 'MAX_TOKENS', // 요청에 지정된 최대 토큰 수에 도달했습니다
  SAFETY = 'SAFETY', // 안전상의 이유로 응답 후보 콘텐츠가 신고되었습니다
  RECITATION = 'RECITATION', // 응답 후보 콘텐츠가 암송 이유로 신고되었습니다
  LANGUAGE = 'LANGUAGE', // 지원되지 않는 언어를 사용한 것으로 응답 후보 콘텐츠가 신고되었습니다
  OTHER = 'OTHER', // 알 수 없는 이유입니다
  BLOCKLIST = 'BLOCKLIST', // 콘텐츠에 금지된 용어가 포함되어 있어 토큰 생성이 중지되었습니다
  PROHIBITED_CONTENT = 'PROHIBITED_CONTENT', // 금지된 콘텐츠가 포함되어 있을 수 있어 토큰 생성이 중지되었습니다
  SPII = 'SPII', // 콘텐츠에 민감한 개인 식별 정보 (SPII)가 포함되어 있을 수 있으므로 토큰 생성이 중지되었습니다
  MALFORMED_FUNCTION_CALL = 'MALFORMED_FUNCTION_CALL', // 모델에서 생성된 함수 호출이 잘못되었습니다
  IMAGE_SAFETY = 'IMAGE_SAFETY', // 생성된 이미지에 안전 위반이 포함되어 있어 토큰 생성이 중지되었습니다
  UNEXPECTED_TOOL_CALL = 'UNEXPECTED_TOOL_CALL', // 모델에서 도구 호출을 생성했지만 요청에서 사용 설정된 도구가 없습니다
  TOO_MANY_TOOL_CALLS = 'TOO_MANY_TOOL_CALLS' // 모델이 연속으로 너무 많은 도구를 호출하여 시스템이 실행을 종료했습니다
}

// ============================================================================
// Model Types
// ============================================================================

export interface Model {
  name: string
  version: string
  displayName: string
  description: string
  inputTokenLimit: number
  outputTokenLimit: number
  supportedGenerationMethods: string[]
  temperature?: number
  topP?: number
  topK?: number
}

export interface ListModelsResponse {
  models: Model[]
  nextPageToken?: string
}

// ============================================================================
// File Types
// ============================================================================

export interface File {
  name: string
  displayName: string
  mimeType: string
  sizeBytes: string
  createTime: string
  updateTime: string
  expirationTime?: string
  sha256Hash?: string
  uri: string
  state: FileState
}

export enum FileState {
  STATE_UNSPECIFIED = 'STATE_UNSPECIFIED',
  PROCESSING = 'PROCESSING',
  ACTIVE = 'ACTIVE',
  FAILED = 'FAILED'
}

export interface UploadFileRequest {
  file: {
    displayName: string
    mimeType: string
  }
}

export interface UploadFileResponse {
  file: File
}

// ============================================================================
// Embedding Types
// ============================================================================

export interface EmbedContentRequest {
  model: string
  content: Content
  taskType?: TaskType
  title?: string
  outputDimensionality?: number
}

export interface EmbedContentResponse {
  embedding: {
    values: number[]
  }
}

export interface BatchEmbedContentsRequest {
  requests: EmbedContentRequest[]
}

export interface BatchEmbedContentsResponse {
  embeddings: {
    values: number[]
  }[]
}

export enum TaskType {
  TASK_TYPE_UNSPECIFIED = 'TASK_TYPE_UNSPECIFIED',
  RETRIEVAL_DOCUMENT = 'RETRIEVAL_DOCUMENT',
  RETRIEVAL_QUERY = 'RETRIEVAL_QUERY',
  SEMANTIC_SIMILARITY = 'SEMANTIC_SIMILARITY',
  CLASSIFICATION = 'CLASSIFICATION',
  CLUSTERING = 'CLUSTERING'
}

// ============================================================================
// Count Tokens Types
// ============================================================================

export interface CountTokensRequest {
  contents: Content[]
}

export interface CountTokensResponse {
  totalTokens: number
}

// ============================================================================
// Live API Types
// ============================================================================

export interface LiveConfig {
  responseModalities?: Modality[]
  systemInstruction?: string
}

export interface LiveSession {
  connect(config: LiveConfig): Promise<LiveConnection>
}

export interface LiveConnection {
  sendRealtimeInput(input: RealtimeInput): Promise<void>
  receive(): AsyncIterable<LiveResponse>
  close(): void
}

export interface RealtimeInput {
  audio?: {
    data: string // base64 encoded audio
    mimeType: string
  }
  text?: string
}

export interface LiveResponse {
  data?: string // base64 encoded audio data
  serverContent?: {
    modelTurn?: {
      parts: Part[]
    }
    turnComplete?: boolean
  }
}

// ============================================================================
// OpenAI Compatible API Types
// ============================================================================

export interface OpenAICompatibleRequest {
  model: string
  messages: OpenAICompatibleMessage[]
  stream?: boolean
  temperature?: number
  max_tokens?: number
  top_p?: number
  frequency_penalty?: number
  presence_penalty?: number
  stop?: string | string[]
}

export interface OpenAICompatibleMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface OpenAICompatibleResponse {
  id: string
  object: 'chat.completion'
  created: number
  model: string
  choices: OpenAICompatibleChoice[]
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface OpenAICompatibleChoice {
  index: number
  message?: {
    role: 'assistant'
    content: string
  }
  delta?: {
    content?: string
  }
  finish_reason?: string | null
}

export interface OpenAICompatibleStreamResponse {
  id: string
  object: 'chat.completion.chunk'
  created: number
  model: string
  choices: OpenAICompatibleChoice[]
}

// ============================================================================
// Legacy Types (for backward compatibility)
// ============================================================================

export interface CacheControl {
  type: 'ephemeral'
  ttl: '5m' | '1h'
}

export interface GoogleHeaders {
  'x-goog-api-key': string
  'Content-Type': 'application/json'
}
