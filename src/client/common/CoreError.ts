/**
 * Core 플랫폼의 통일된 에러 처리 시스템
 */

export enum ErrorCode {
  // ==================== 일반 에러 ====================
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  INVALID_STATE = 'INVALID_STATE',

  // ==================== 설정 관련 ====================
  CONFIG_NOT_FOUND = 'CONFIG_NOT_FOUND',
  CONFIG_INVALID = 'CONFIG_INVALID',
  API_KEY_MISSING = 'API_KEY_MISSING',
  API_KEY_INVALID = 'API_KEY_INVALID',

  // ==================== 데이터베이스 관련 ====================
  DB_CONNECTION_FAILED = 'DB_CONNECTION_FAILED',
  DB_QUERY_FAILED = 'DB_QUERY_FAILED',
  DB_TRANSACTION_FAILED = 'DB_TRANSACTION_FAILED',
  DB_CONSTRAINT_VIOLATION = 'DB_CONSTRAINT_VIOLATION',

  // ==================== 파일 시스템 관련 ====================
  FILE_NOT_FOUND = 'FILE_NOT_FOUND',
  FILE_READ_FAILED = 'FILE_READ_FAILED',
  FILE_WRITE_FAILED = 'FILE_WRITE_FAILED',
  FILE_PERMISSION_DENIED = 'FILE_PERMISSION_DENIED',
  DIRECTORY_NOT_FOUND = 'DIRECTORY_NOT_FOUND',

  // ==================== LLM 관련 ====================
  LLM_NOT_INITIALIZED = 'LLM_NOT_INITIALIZED',
  LLM_MODEL_NOT_FOUND = 'LLM_MODEL_NOT_FOUND',
  LLM_API_ERROR = 'LLM_API_ERROR',
  LLM_RATE_LIMIT = 'LLM_RATE_LIMIT',
  LLM_QUOTA_EXCEEDED = 'LLM_QUOTA_EXCEEDED',
  LLM_REQUEST_TIMEOUT = 'LLM_REQUEST_TIMEOUT',

  // ==================== Chat 관련 ====================
  CHAT_SESSION_NOT_FOUND = 'CHAT_SESSION_NOT_FOUND',
  CHAT_SESSION_NOT_SELECTED = 'CHAT_SESSION_NOT_SELECTED',
  CHAT_MESSAGE_NOT_FOUND = 'CHAT_MESSAGE_NOT_FOUND',
  CHAT_MESSAGE_INVALID = 'CHAT_MESSAGE_INVALID',

  // ==================== Context 관련 ====================
  CONTEXT_TYPE_UNSUPPORTED = 'CONTEXT_TYPE_UNSUPPORTED',
  CONTEXT_EXTRACTION_FAILED = 'CONTEXT_EXTRACTION_FAILED',
  CONTEXT_URL_INVALID = 'CONTEXT_URL_INVALID',
  CONTEXT_FILE_UNSUPPORTED = 'CONTEXT_FILE_UNSUPPORTED',

  // ==================== Tool 관련 ====================
  TOOL_NOT_FOUND = 'TOOL_NOT_FOUND',
  TOOL_EXECUTION_FAILED = 'TOOL_EXECUTION_FAILED',
  TOOL_INVALID_ARGUMENTS = 'TOOL_INVALID_ARGUMENTS',

  // ==================== 네트워크 관련 ====================
  NETWORK_ERROR = 'NETWORK_ERROR',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
  HTTP_ERROR = 'HTTP_ERROR',

  // ==================== 내부 에러 ====================
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export enum ErrorSeverity {
  LOW = 'LOW', // 경고 수준, 계속 진행 가능
  MEDIUM = 'MEDIUM', // 중간 수준, 일부 기능 제한
  HIGH = 'HIGH', // 높은 수준, 주요 기능 중단
  CRITICAL = 'CRITICAL' // 치명적, 전체 시스템 중단
}

export interface ErrorContext {
  module?: string
  operation?: string
  resource?: string
  userId?: string
  sessionId?: string
  requestId?: string
  timestamp?: Date
  metadata?: Record<string, any>
}

/**
 * Core 플랫폼의 통일된 에러 클래스
 */
export class CoreError extends Error {
  public readonly code: ErrorCode
  public readonly severity: ErrorSeverity
  public readonly context: ErrorContext
  public readonly originalError?: Error
  public readonly timestamp: Date

  constructor(
    code: ErrorCode,
    message: string,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: ErrorContext = {},
    originalError?: Error
  ) {
    super(message)
    this.name = 'CoreError'
    this.code = code
    this.severity = severity
    this.context = {
      timestamp: new Date(),
      ...context
    }
    this.originalError = originalError
    this.timestamp = new Date()

    // 스택 트레이스 유지
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CoreError)
    }
  }

  /**
   * 에러를 JSON 형태로 직렬화
   */
  toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      stack: this.stack,
      originalError: this.originalError
        ? {
            name: this.originalError.name,
            message: this.originalError.message,
            stack: this.originalError.stack
          }
        : undefined
    }
  }

  /**
   * 에러가 특정 코드인지 확인
   */
  isCode(code: ErrorCode): boolean {
    return this.code === code
  }

  /**
   * 에러가 특정 심각도 이상인지 확인
   */
  isSeverityOrHigher(severity: ErrorSeverity): boolean {
    const severityOrder = {
      [ErrorSeverity.LOW]: 0,
      [ErrorSeverity.MEDIUM]: 1,
      [ErrorSeverity.HIGH]: 2,
      [ErrorSeverity.CRITICAL]: 3
    }
    return severityOrder[this.severity] >= severityOrder[severity]
  }

  /**
   * 사용자 친화적인 에러 메시지 생성
   */
  getUserMessage(): string {
    switch (this.code) {
      case ErrorCode.API_KEY_MISSING:
        return 'API 키가 설정되지 않았습니다. 설정에서 API 키를 입력해주세요.'
      case ErrorCode.API_KEY_INVALID:
        return 'API 키가 유효하지 않습니다. 올바른 API 키를 입력해주세요.'
      case ErrorCode.CHAT_SESSION_NOT_SELECTED:
        return '채팅 세션이 선택되지 않았습니다. 먼저 세션을 선택해주세요.'
      case ErrorCode.CHAT_SESSION_NOT_FOUND:
        return '요청한 채팅 세션을 찾을 수 없습니다.'
      case ErrorCode.LLM_RATE_LIMIT:
        return 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.'
      case ErrorCode.LLM_QUOTA_EXCEEDED:
        return 'API 사용량 한도를 초과했습니다. 결제 정보를 확인해주세요.'
      case ErrorCode.NETWORK_ERROR:
        return '네트워크 연결에 문제가 있습니다. 인터넷 연결을 확인해주세요.'
      case ErrorCode.FILE_NOT_FOUND:
        return '요청한 파일을 찾을 수 없습니다.'
      case ErrorCode.PERMISSION_DENIED:
        return '해당 작업을 수행할 권한이 없습니다.'
      default:
        return this.message
    }
  }
}

/**
 * 에러 생성 헬퍼 함수들
 */
export class CoreErrorFactory {
  /**
   * 검증 에러 생성
   */
  static validation(message: string, context?: ErrorContext): CoreError {
    return new CoreError(ErrorCode.VALIDATION_ERROR, message, ErrorSeverity.MEDIUM, context)
  }

  /**
   * 리소스 없음 에러 생성
   */
  static notFound(resource: string, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.NOT_FOUND,
      `${resource} not found`,
      ErrorSeverity.MEDIUM,
      context
    )
  }

  /**
   * API 키 관련 에러 생성
   */
  static apiKeyMissing(provider: string, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.API_KEY_MISSING,
      `${provider} API key is not set`,
      ErrorSeverity.HIGH,
      { ...context, resource: provider }
    )
  }

  /**
   * API 키 무효 에러 생성
   */
  static apiKeyInvalid(provider: string, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.API_KEY_INVALID,
      `${provider} API key is invalid`,
      ErrorSeverity.HIGH,
      { ...context, resource: provider }
    )
  }

  /**
   * LLM API 에러 생성
   */
  static llmApiError(
    provider: string,
    status: number,
    message: string,
    context?: ErrorContext
  ): CoreError {
    const code =
      status === 429
        ? ErrorCode.LLM_RATE_LIMIT
        : status === 401
          ? ErrorCode.API_KEY_INVALID
          : status === 403
            ? ErrorCode.LLM_QUOTA_EXCEEDED
            : ErrorCode.LLM_API_ERROR

    return new CoreError(code, `${provider} API error: ${status} ${message}`, ErrorSeverity.HIGH, {
      ...context,
      resource: provider,
      metadata: { status }
    })
  }

  /**
   * 데이터베이스 에러 생성
   */
  static databaseError(operation: string, originalError: Error, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.DB_QUERY_FAILED,
      `Database ${operation} failed: ${originalError.message}`,
      ErrorSeverity.HIGH,
      { ...context, operation },
      originalError
    )
  }

  /**
   * 파일 시스템 에러 생성
   */
  static fileError(
    operation: string,
    filePath: string,
    originalError: Error,
    context?: ErrorContext
  ): CoreError {
    const code = originalError.message.includes('ENOENT')
      ? ErrorCode.FILE_NOT_FOUND
      : originalError.message.includes('EACCES')
        ? ErrorCode.FILE_PERMISSION_DENIED
        : ErrorCode.FILE_READ_FAILED

    return new CoreError(
      code,
      `File ${operation} failed for ${filePath}: ${originalError.message}`,
      ErrorSeverity.MEDIUM,
      { ...context, operation, resource: filePath },
      originalError
    )
  }

  /**
   * Chat 관련 에러 생성
   */
  static chatSessionNotFound(sessionId: string, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.CHAT_SESSION_NOT_FOUND,
      `Chat session ${sessionId} not found`,
      ErrorSeverity.MEDIUM,
      { ...context, sessionId }
    )
  }

  static chatSessionNotSelected(context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.CHAT_SESSION_NOT_SELECTED,
      'No chat session selected',
      ErrorSeverity.MEDIUM,
      context
    )
  }

  /**
   * 내부 에러 생성
   */
  static internal(message: string, originalError?: Error, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.INTERNAL_ERROR,
      message,
      ErrorSeverity.CRITICAL,
      context,
      originalError
    )
  }

  /**
   * 미구현 에러 생성
   */
  static notImplemented(feature: string, context?: ErrorContext): CoreError {
    return new CoreError(
      ErrorCode.NOT_IMPLEMENTED,
      `${feature} is not implemented yet`,
      ErrorSeverity.MEDIUM,
      { ...context, resource: feature }
    )
  }
}

/**
 * 에러 처리 유틸리티
 */
export class ErrorHandler {
  /**
   * 에러를 로깅하고 적절히 처리
   */
  static handle(error: Error, context?: ErrorContext): void {
    if (error instanceof CoreError) {
      // CoreError는 이미 구조화되어 있음
      this.logCoreError(error)
    } else {
      // 일반 Error를 CoreError로 변환
      const coreError = new CoreError(
        ErrorCode.UNKNOWN_ERROR,
        error.message,
        ErrorSeverity.MEDIUM,
        context,
        error
      )
      this.logCoreError(coreError)
    }
  }

  /**
   * CoreError 로깅
   */
  private static logCoreError(error: CoreError): void {
    const logData = {
      code: error.code,
      severity: error.severity,
      message: error.message,
      context: error.context,
      timestamp: error.timestamp.toISOString()
    }

    // 심각도에 따른 로그 레벨 결정
    switch (error.severity) {
      case ErrorSeverity.LOW:
        console.warn('Core Warning:', logData)
        break
      case ErrorSeverity.MEDIUM:
        console.error('Core Error:', logData)
        break
      case ErrorSeverity.HIGH:
        console.error('Core Critical Error:', logData)
        break
      case ErrorSeverity.CRITICAL:
        console.error('Core Fatal Error:', logData)
        break
    }
  }

  /**
   * 에러를 사용자에게 안전하게 표시
   */
  static getSafeUserMessage(error: Error): string {
    if (error instanceof CoreError) {
      return error.getUserMessage()
    }
    return '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
  }
}
