# 개발 일지 — 회사 역사 AR 아카이브

## 2026-06-22

- **decision**: AR 방식 확정 = 자유공간 WebXR(공간에 콘텐츠 떠 있고 걸어가 탭). 대안 반려: ① 360 파노라마 VR(걸어다니기 불가) ② 이미지 마커 스캔(MindAR — "액자에 카메라 갖다대기"가 원하는 UX 아님)
- **decision**: 기기 = ARCore 지원 안드로이드(갤럭시 Z 플립6 확인). Tab A 보급형은 ARCore 미지원이라 제외
- **fix**: hidden 속성이 CSS display:flex에 무시돼 팝업/HUD가 항상 떠있던 버그 → `[hidden]{display:none!important}` 로 해결 (핵심 버그였음)
- **fix**: A-Frame 기본 흰 'VR' 버튼/권한모달이 카드보드 스테레오로 새던 문제 → CSS 강제 숨김 + device-orientation-permission-ui off
- **feat**: 탭(조준) 발견 + 진행 localStorage 저장 + ↻ 리셋 + 재열람
- **feat**: 웹 편집기(admin.html) — 지도 드래그 배치 + 내용 입력, content.json 공유본으로 모든 기기 동기화
- **chore**: GitHub Pages 배포 (nada880117-cmd/ar-archive, public)
- **note**: 미디어는 로컬 C:\ 경로 불가 → assets/ 업로드 또는 공개 URL 필요. 내일 사진/영상 받아서 연결 예정
