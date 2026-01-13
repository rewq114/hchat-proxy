# HChat Proxy 배포 가이드 (Release Guide)

HChat Proxy는 GitHub Actions를 통해 Windows 및 macOS용 설치 파일을 자동으로 빌드하고 배포합니다.

## 1. 사전 설정 (최초 1회)

GitHub 저장소에서 다음 설정을 확인해야 합니다:

- **경로**: `Settings > Actions > General`
- **설정**: `Workflow permissions` 항목을 **"Read and write permissions"**로 변경하고 저장합니다. (기본값은 Read 이며, 이 경우 빌드 결과물 업로드가 실패합니다.)

## 2. 배포 프로세스

새로운 버전을 배포하려면 다음 단계를 따릅니다.

### 1) 코드 변경 및 확인

- 변경 사항을 커밋하고 메인 브랜치에 푸시합니다.
  ```bash
  git add .
  git commit -m "feat: 새로운 기능 추가"
  git push origin main
  ```

### 2) 버전 태그 생성 및 푸시

- `package.json`의 버전과 일치하는 태그를 생성하고 푸시합니다. 태그는 `v`로 시작해야 합니다.
  ```bash
  git tag v1.1.2
  git push origin v1.1.2
  ```

### 3) 빌드 확인 (Actions)

- GitHub 저장소 상단의 **Actions** 탭으로 이동합니다.
- "Build/Release" 워크플로우가 실행 중인지 확인합니다.
- `windows-latest`와 `macos-latest` 두 가지 환경에서 빌드가 동시에 진행됩니다.

### 4) 배포물 확인 (Releases)

- 모든 빌드가 성공하면 GitHub 저장소 우측의 **Releases** 페이지에 새로운 릴리스가 생성됩니다.
- 다음 파일들이 포함되어 있는지 확인합니다:
  - `HChat-Proxy-Setup-1.1.2.exe` (Windows 설치파일)
  - `HChat-Proxy-1.1.2.dmg` (macOS 설치파일)
  - `HChat-Proxy-1.1.2-mac.zip` (macOS 포터블)

## 3. 로컬 빌드 (선택 사항)

로컬에서 수동으로 빌드하고 싶은 경우:

- **Windows**: `npm run package` (EXE 생성)
- **macOS**: `npm run package:mac` (DMG 생성 - **Mac PC에서만 가능**)

---

> [!TIP]
> 배포 중 에러가 발생하면 GitHub Actions의 로그를 확인하세요. 주로 `GITHUB_TOKEN` 권한 문제나 의존성 설치 실패가 원인인 경우가 많습니다.
