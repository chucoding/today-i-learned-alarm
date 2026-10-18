# 파일

- [AI 호출 보안·사용량 경계](ai-call-guard.md) - 공개 AI HTTP 엔드포인트가 인증 상태에 따라 호출자를 구분하고 서버 소유 카운터를 원자 차감하며 입력 크기를 제한하는 방식을 설명한다. 질문 재생성의 독립된 카운터와 강제 지점도 함께 다룬다.
- [Firestore 소유권과 접근 경계](firestore-data-boundary.md) - 사용자 설정과 일별 덱, 공개 데모 캐시, 서버 전용 사용량·사전 생성 상태를 Firestore 규칙과 Admin SDK로 분리하는 모델을 설명한다. 규칙 변경 시 직접 쓰기와 서버 쓰기를 함께 검토하는 기준을 제공한다.
- [시스템 개요와 런타임 경계](system-overview.md) - React PWA, Firebase Auth·Firestore·Cloud Functions와 스케줄 작업이 연결되는 실행 경계와 데이터 흐름을 설명한다. 외부 GitHub·OpenAI·FCM 호출의 보안·비용 제약 및 Stripe 구현의 배포 상태도 구분한다.
