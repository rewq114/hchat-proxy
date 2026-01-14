import path from 'path'
import os from 'os'
import { mkdirSync } from 'fs'

/**
 * 앱의 루트 디렉토리 경로를 반환합니다.
 *
 * @returns 앱 루트 디렉토리 경로
 * - Windows: %APPDATA%\update-chat
 * - macOS: ~/Library/Application Support/update-chat
 * - Linux: ~/.config/update-chat
 */
export function getAppRootDir(): string {
  const platform = process.platform
  const appName = 'update-chat'

  switch (platform) {
    case 'win32': {
      // Windows: %APPDATA%\update-chat
      const appData = process.env.APPDATA
      if (appData) {
        return path.join(appData, appName)
      }
      return path.join(os.homedir(), 'AppData', 'Roaming', appName)
    }
    case 'darwin':
      // macOS: ~/Library/Application Support/update-chat
      return path.join(os.homedir(), 'Library', 'Application Support', appName)
    default:
      // Linux: ~/.config/update-chat
      return path.join(os.homedir(), '.config', appName)
  }
}

/**
 * 플랫폼별 기본 설정 디렉토리 경로를 반환합니다.
 *
 * @returns 설정 디렉토리 경로
 * - Windows: %APPDATA%\update-chat\config
 * - macOS: ~/Library/Application Support/update-chat/config
 * - Linux: ~/.config/update-chat/config
 */
export function getConfigDir(): string {
  return path.join(getAppRootDir(), 'config')
}

/**
 * 플랫폼별 기본 데이터 디렉토리 경로를 반환합니다.
 *
 * @returns 데이터 디렉토리 경로
 * - Windows: %APPDATA%\update-chat\data
 * - macOS: ~/Library/Application Support/update-chat/data
 * - Linux: ~/.config/update-chat/data
 */
export function getDataDir(): string {
  return path.join(getAppRootDir(), 'data')
}

/**
 * 플랫폼별 기본 로그 디렉토리 경로를 반환합니다.
 *
 * @returns 로그 디렉토리 경로
 * - Windows: %APPDATA%\update-chat\logs
 * - macOS: ~/Library/Application Support/update-chat/logs
 * - Linux: ~/.config/update-chat/logs
 */
export function getLogDir(): string {
  return path.join(getAppRootDir(), 'logs')
}

/**
 * 플랫폼별 기본 캐시 디렉토리 경로를 반환합니다.
 *
 * @returns 캐시 디렉토리 경로
 * - Windows: %APPDATA%\update-chat\cache
 * - macOS: ~/Library/Application Support/update-chat/cache
 * - Linux: ~/.config/update-chat/cache
 */
export function getCacheDir(): string {
  return path.join(getAppRootDir(), 'cache')
}

/**
 * 디렉토리가 존재하지 않으면 생성합니다.
 *
 * @param dirPath 생성할 디렉토리 경로
 * @param recursive 재귀적으로 상위 디렉토리도 생성할지 여부 (기본값: true)
 */
export function ensureDirExists(dirPath: string, recursive: boolean = true): void {
  try {
    mkdirSync(dirPath, { recursive })
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

/**
 * 파일 경로가 유효한지 확인합니다.
 *
 * @param filePath 확인할 파일 경로
 * @returns 유효한 경로인지 여부
 */
export function isValidPath(filePath: string): boolean {
  try {
    path.resolve(filePath)
    return true
  } catch {
    return false
  }
}

/**
 * 상대 경로를 절대 경로로 변환합니다.
 *
 * @param relativePath 상대 경로
 * @param basePath 기준 경로 (기본값: 현재 작업 디렉토리)
 * @returns 절대 경로
 */
export function resolvePath(relativePath: string, basePath?: string): string {
  return path.resolve(basePath || process.cwd(), relativePath)
}
