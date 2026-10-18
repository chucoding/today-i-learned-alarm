---
type: quickstart
title: CodeRecall 변경 안내
description: CodeRecall의 프런트엔드·Cloud Functions 실행 단위와 안전한 로컬 설정·검증·배포의 출발점을 안내한다. 변경 과제별로 확인할 architecture, flashcard, integrations, operations 문서로 연결한다.
tags: [quickstart, development, deployment, architecture]
verified:
  - by: openwiki/0.7.0
    at: 2026-10-18T17:37:30.715Z
sources:
  - id: openwiki-source-57b81e54d1113287ebfdf6f8
    resource: repo://.github/CONTRIBUTING.md
  - id: openwiki-source-8037e2358a2c4f9b2c722a11
    resource: repo://AGENTS.md
  - id: openwiki-source-bb10b670204c16db33dbab0b
    resource: repo://app/package.json
  - id: openwiki-source-ad966d6b0a022a609a8c370f
    resource: repo://docs/adr/README.md
  - id: openwiki-source-e2d36065640e6201821ff884
    resource: repo://firebase.json
  - id: openwiki-source-354704af6b257d0a5d6ce676
    resource: repo://functions/package.json
  - id: openwiki-source-5b54a58d1b51cd490b0e7162
    resource: repo://package.json
  - id: openwiki-source-23775c3de52f3ab95a13cb8b
    resource: repo://README.md
  - id: openwiki-source-82f574a2d5a654bb69161540
    resource: repo://scripts/setup-proxy.js
generated: { by: "openwiki/0.7.0", at: "2026-10-18T17:37:30.715Z" }
---

# CodeRecall 변경 안내

CodeRecall은 `app`의 Vite 브라우저 번들과 `functions`의 Firebase Cloud Functions를 별도로 빌드·배포한다. 변경 전에는 이 페이지에서 **영향을 받는 경계**를 찾고, 연결한 상세 문서와 현재 코드를 함께 확인한다. 위키와 코드가 다르면 현재 동작의 정본은 코드다.

## 가장 짧은 로컬 시작 경로

Node.js 22 이상, pnpm, Firebase CLI가 필요하다. `app/.env`, `functions/.env`, `.firebaserc`는 커밋하지 않으며, 값·키·운영 프로젝트 정보도 문서, 로그, 스크린샷에 남기지 않는다. 새 clone 또는 worktree에서는 프로젝트를 다시 선택한다. 저장소가 이미 Firebase 배포 구성과 규칙, Functions 소스를 소유하므로 `firebase init` 대신 `firebase use --add`를 사용한다.

```bash
cp app/.env.example app/.env
firebase login
firebase use --add
pnpm install
pnpm proxy
pnpm serve
```

다른 터미널에서 프런트엔드를 시작한다.

```bash
pnpm dev
```

`app/.env`에는 브라우저 Firebase 설정과 `VITE_PROJECT_ID`를 준비한다. `pnpm proxy`는 이 프로젝트 ID로 Functions 관련 주소·리전 변수의 누락되거나 빈 값만 보완하고, 이미 비어 있지 않은 값은 보존한다. 프로젝트 또는 리전을 바꾼 경우에는 주소가 의도한 대상인지 검토한 뒤 다시 빌드한다.

`pnpm serve`는 Functions를 빌드한 뒤 Functions Emulator만 시작한다. `pnpm dev`는 별도로 Vite 개발 서버를 시작한다. 따라서 Firestore·Authentication Emulator는 이 명령으로 시작하지 않으며, 로컬 앱의 Firestore 읽기·쓰기는 선택한 Firebase 프로젝트에 영향을 줄 수 있다. 환경 변수의 역할, 개발 프록시와 배포 URL의 차이, Emulator 범위는 [로컬 개발·검증·배포](operations/local-development-and-deployment.md)에서 확인한다.

## 작업 유형별 라우팅 맵

| 변경하려는 작업 | 먼저 읽을 페이지 | 함께 확인할 경계 |
| --- | --- | --- |
| 화면, 라우트, 랜딩과 앱 진입점, `/api` 호출 주소 | [시스템 개요와 런타임 경계](architecture/system-overview.md) | Hosting의 `/app` rewrite, Vite 다중 진입점, 개발 프록시와 배포 URL 계약 |
| 로컬 실행, 환경 변수, Emulator, Firebase 배포 | [로컬 개발·검증·배포](operations/local-development-and-deployment.md) | `pnpm proxy`, build, Functions·규칙, `app/dist` Hosting 산출물 |
| Firestore 문서·필드·규칙 또는 Admin SDK 쓰기 | [Firestore 소유권과 접근 경계](architecture/firestore-data-boundary.md) | 사용자 소유 데이터와 공개 캐시, 서버 전용 상태, 규칙과 서버 입력 검증 |
| AI HTTP 함수, 인증, 호출량·입력 제한 | [AI 호출 보안·사용량 경계](architecture/ai-call-guard.md) | 공개 URL이 아닌 서버 인증·트랜잭션 한도·입력 검증 |
| 오늘의 카드, 생성 프롬프트·응답, 번역·질문 재생성, 데모 캐시 | [플래시카드 생성과 복구 경로](flashcard/generation-paths.md) | 앱 즉시 생성·사용자 사전 생성·랜딩 캐시의 분기와 언어별 날짜 덱 |
| 카드 수·diff·저장 필드 또는 Firestore 문서 크기 | [일별 덱 크기 예산](flashcard/deck-size-budget.md) | 앱과 Functions에 복제된 크기 계산·축소 규칙 및 두 언어 배열의 합산 |
| 자정 이후 카드 준비, Scheduler, Cloud Tasks, 중복·재시도 | [시간대별 덱 사전 생성](flashcard/pregeneration.md) | 사용자 시간대, 완료 기록, 태스크 재시도와 앱 즉시 생성의 경합 |
| GitHub 로그인, 선택 저장소·브랜치, 커밋·raw 파일 조회 | [GitHub 인증과 저장소 접근](integrations/github-access.md) | Firebase ID 토큰, 서버의 사용자 토큰 조회, 저장소 허용 목록과 공개 데모 경로 |
| 브라우저 알림 권한, FCM 토큰, 알림 시각·시간대, 정기 발송 | [푸시 알림과 정기 정리 작업](operations/push-notifications.md) | 사용자 설정 필드, 매시 시간대 판정, 500개 배치와 실패 기록의 한계 |

여러 행에 걸치는 변경은 해당 문서를 모두 읽는다. 예를 들어 카드 생성 결과에 필드를 추가하면 생성 경로·덱 예산·Firestore 규칙을 함께 검토한다. 알림 클릭 URL을 바꾸면 푸시 흐름과 Hosting rewrite를 함께 확인한다.

## 시스템을 읽는 순서

1. [시스템 개요와 런타임 경계](architecture/system-overview.md)에서 브라우저, Hosting, Firestore, HTTP Functions, Scheduler·Cloud Tasks와 외부 서비스의 책임을 구분한다.
2. 데이터나 외부 호출을 바꾸면 해당 경계 문서에서 소유자, 인증, 저장 위치, 실패 의미를 확인한다.
3. 같은 계약을 `app`과 `functions`가 각각 구현하는 경우, 특히 카드 생성과 덱 크기 정책은 한 패키지만 바꾸지 않는다.
4. 공개 HTTP 함수의 URL은 접근 가능한 주소일 뿐 권한 부여가 아니다. 개인 데이터, 외부 자격 증명, 모델 호출량은 Functions에서 검증·제한해야 한다.

## 빌드·검증·배포

PR 전에는 최소한 전체 빌드와 Functions lint를 실행한다.

```bash
pnpm build
pnpm --filter functions lint
```

`pnpm build`는 워크스페이스의 `app`과 `functions` build를 모두 실행한다. 이 저장소에는 현재 자동화된 테스트 스위트가 없으므로, 화면 변경은 `pnpm dev`에서 직접 확인하고 수동 확인 결과를 PR에 남긴다. 변경한 인증·규칙·캐시·스케줄 경계는 정상 경로뿐 아니라 예상한 거부 또는 실패 경로도 수동으로 확인한다.

Firebase 설정은 Functions 배포 전에 Functions build를 실행한다. Hosting은 `app/dist`를 배포하지만 Hosting predeploy로 Vite build를 실행하지 않는다. 따라서 Hosting 배포 전에는 현재 검토한 `app/.env`로 `pnpm build`가 성공해 새 산출물을 만들었는지 확인한다. Functions와 Firestore 규칙을 함께 변경했다면 서버 측 계약을 먼저 배포하고, 검증한 번들을 Hosting에 배포한다.

```bash
firebase use
pnpm proxy
pnpm build
pnpm --filter functions lint
firebase deploy --only functions,firestore:rules
firebase deploy --only hosting
```

`pnpm push`는 `firebase deploy`의 별칭이며 Hosting 빌드를 대신하지 않는다. 배포 뒤에는 `/`, `/app`, `/app/` 하위 새로고침, `/terms`, `/privacy`와 변경한 API 또는 설정 흐름을 확인한다. Hosting은 `/app`과 `/app/**`를 `app.html`로 rewrite한다. 전체 절차와 배포 단위는 [로컬 개발·검증·배포](operations/local-development-and-deployment.md)에 있다.

## 변경을 제출하기 전

- 관련 이슈를 먼저 검색하고, 큰 변경은 구현 전에 방향을 맞춘다. 브랜치·커밋·PR 형식은 [기여 가이드](../.github/CONTRIBUTING.md)를 따른다.
- 한 PR에는 한 가지 목적만 담고, 리팩터링과 기능 추가는 나눈다.
- 설계 결정을 새로 내리거나 바꾸는 경우에는 위키 대신 [ADR 작성 규칙](../docs/adr/README.md)에 따라 `docs/adr/`에 새 ADR을 추가한다. 채택한 ADR 본문은 고치지 않는다.
- 비밀 값, API 키, 사용자 개인정보, 운영 계정 정보와 비용·매출 수치는 공개 문서·PR 산출물에 기록하지 않는다.
