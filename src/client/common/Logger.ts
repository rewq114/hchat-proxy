/**
 * 간단한 로그 레벨 시스템
 * 개발/프로덕션 환경에 따라 다른 로그 레벨을 표시
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

class Logger {
  private static instance: Logger;
  private currentLevel: LogLevel;
  private isDevelopment: boolean;

  private constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
    this.currentLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.currentLevel;
  }

  private formatMessage(
    level: string,
    category: string,
    ...args: any[]
  ): any[] {
    const timestamp = new Date().toISOString().substring(11, 23); // HH:mm:ss.SSS
    return [`[${timestamp}] [${level}] [${category}]`, ...args];
  }

  debug(category: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.log(...this.formatMessage("DEBUG", category, ...args));
    }
  }

  info(category: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(...this.formatMessage("INFO", category, ...args));
    }
  }

  warn(category: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(...this.formatMessage("WARN", category, ...args));
    }
  }

  error(category: string, ...args: any[]): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(...this.formatMessage("ERROR", category, ...args));
    }
  }

  // 개발 환경에서만 표시되는 상세 로그
  dev(category: string, ...args: any[]): void {
    if (this.isDevelopment) {
      console.log(...this.formatMessage("DEV", category, ...args));
    }
  }
}

// 싱글톤 인스턴스
const logger = Logger.getInstance();

// 편의 함수들
export const log = {
  debug: (category: string, ...args: any[]) => logger.debug(category, ...args),
  info: (category: string, ...args: any[]) => logger.info(category, ...args),
  warn: (category: string, ...args: any[]) => logger.warn(category, ...args),
  error: (category: string, ...args: any[]) => logger.error(category, ...args),
  dev: (category: string, ...args: any[]) => logger.dev(category, ...args),
};

export default logger;
