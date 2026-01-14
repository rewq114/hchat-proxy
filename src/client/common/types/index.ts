/**
 * Common Types - 공통 타입 정의
 *
 * 애플리케이션 전반에서 사용되는 공통 타입들을 정의합니다.
 */

// === Communication Types ===
export type { SSEEvent } from '../SSEParser'

// === Logger Types ===
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  SILENT = 6
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: Date
  category?: string
  context?: Record<string, any>
  error?: Error
  stack?: string
}

export interface LogMetadata {
  requestId?: string
  userId?: string
  sessionId?: string
  correlationId?: string
  [key: string]: any
}

// === Utils Types ===
export interface TokenCountResult {
  tokens: number
  characters: number
  words: number
  lines: number
}

// === Common Interfaces ===
export interface BaseEntity {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface PaginationOptions {
  page?: number
  limit?: number
  offset?: number
}

export interface SortOptions {
  field: string
  direction: 'asc' | 'desc'
}

export interface FilterOptions {
  [key: string]: any
}
