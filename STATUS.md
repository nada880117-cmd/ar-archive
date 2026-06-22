# STATUS — 회사 역사 AR 아카이브

## 현재 상태: Phase 1 스켈레톤 완료 (기기 검증 대기)

### 확정된 방향 (설계 변경 이력)
- 원래 명세서: 360° 파노라마 **VR** (a-sky) → **폐기**
- 1차 전환: 이미지 마커 AR (MindAR) → **폐기**
- **최종 확정: 포켓몬고형 WebXR 공간 AR**
  - 걸어다니면 공간에 시대별 "유물" 7개가 떠 있고, 다가가면 발견·수집
  - 기술: A-Frame 1.6 + WebXR `immersive-ar` (ARCore 6DoF 공간추적)
  - **기기 전제: ARCore 지원 안드로이드 + Chrome** (Tab A 보급형은 미지원 → 별도 기기 확보 필요)
  - iOS 사파리는 WebXR AR 미지원 → 키오스크(제공 기기 1대) 방식 전제
  - 호스팅: GitHub Pages (HTTPS 필수) · 비용 ₩0

### 구현 완료 (Phase 1)
- `index.html` — 온보딩 + 투어 시작
- `ar.html` — WebXR AR 씬 + DOM 오버레이 UI
- `js/app.js` — AR 진입/종료, WebXR 지원 감지, 도감 상태
- `js/spawner.js` — 시대 유물 7개 공간 배치 (ERAS 정의)
- `js/archive-object.js` — 유물 컴포넌트 (발광/회전/부유/근접·터치 발견)
- `js/ui-overlay.js` — 발견 팝업 + 피날레 (임시 콘텐츠)
- `css/style.css` — 전체 UI 스타일
- `qr/generate-qr.html` — QR 생성 도구

### 다음 할 일
1. **[최우선] ARCore 기기에서 실제 동작 검증** — 카메라 켜짐 / 유물 배치 / 걸어가서 발견 / 도감 카운트
   - 로컬 테스트는 HTTPS 필요 → GitHub Pages 또는 `ngrok` 등으로 https 노출
2. 유물 배치 좌표(`spawner.js` ERAS.pos) 현장 공간에 맞게 튜닝
3. (Phase 2) 발견 팝업에 실제 사진/영상/텍스트 콘텐츠 연결
4. (Phase 3) 7개 시대 실제 콘텐츠 제작·교체, 피날레 영상
5. GitHub Pages 배포 + QR 인쇄

### 알려진 리스크
- 기기가 ARCore/WebXR 미지원이면 `ar.html` 진입 화면에 "미지원" 경고 표시됨 → 그 경우 기기 교체 필요
- 조명이 어둡거나 특징 없는 공간은 ARCore 추적 불안정
- 유물 발견은 현재 "근접(0.9m) 또는 터치" 방식
