# STATUS — 회사 역사 AR 아카이브

## 현재 상태: 마커(액자) AR로 전환 — targets.mind(인식표) 대기

### 확정된 방향 (변경 이력)
- 360° 파노라마 VR → 폐기
- WebXR 자유공간 AR(포켓몬고형) → **구현·검증 완료** (`ar-space.html`로 백업 보관)
  - Z 플립6에서 카메라/배치/탭 발견 정상 동작 확인
  - 한계: 시작 위치마다 유물이 어긋남 → "특정 액자=특정 내용" 보장 불가
- **최종 확정: 마커(이미지 인식) AR — MindAR**
  - 목표: **벽에 액자를 걸고, 태블릿을 액자에 비추면 그 내용(사진·영상·설명)이 뜸**
  - 시작 위치 무관, 항상 정확히 일치
  - 기술: A-Frame 1.5 + MindAR 1.2.5 (이미지 트래킹, ARCore 불필요)
  - **영상 재생 포함** (팝업에 controls + autoplay)

### 파일 구성
- `index.html` — 진입(투어 시작 + 편집 링크)
- `ar.html` — **MindAR 마커 AR** (액자 비추면 내용 팝업)
- `ar-space.html` — WebXR 자유공간 버전 백업 (참고용)
- `admin.html` — 편집 화면: 액자(프레임) 순서 + 제목/연도/색/마커이미지/설명/사진/영상
- `js/marker-mode.js` — 마커 인식 → 팝업 로직
- `js/data-store.js` — localStorage 공유 저장소 (마커/사진/영상/순서)
- `js/ui-overlay.js` — 내용 팝업(사진·영상·설명)
- `js/app.js` — AppState(도감 진행 저장) + (구)WebXR 컴포넌트
- `js/archive-object.js`, `js/spawner.js` — 구 WebXR용 (ar-space에서 사용)
- `targets/targets.mind` — **(미생성) 액자 인식표. 다음 단계 필수**
- `assets/markers/` — 액자에 들어갈 실제 사진(마커 원본)

### 다음 할 일 (가장 중요)
1. **[차단요소] 액자 이미지 확보 → targets.mind 컴파일**
   - 각 액자에 들어갈 사진을 MindAR 컴파일러에 **편집기 순서대로** 업로드
   - https://hiukim.github.io/mind-ar-js-doc/tools/compile/
   - 출력된 `targets.mind` 를 `targets/` 에 넣고 커밋
2. 편집기(admin.html)에서 각 액자 내용(제목·설명·사진·영상) 입력
3. 사진/영상 파일을 저장소 `assets/` 에 업로드 (또는 외부 URL)
4. 인쇄한 액자 앞에서 현장 테스트 (조명 충분히)

### 배포
- 저장소: https://github.com/nada880117-cmd/ar-archive (public)
- URL: https://nada880117-cmd.github.io/ar-archive/
- HTTPS 강제 적용됨

### 리스크
- MindAR은 특징 많은(디테일/대비 큰) 사진일수록 인식 잘 됨. 단색/밋밋한 액자는 인식 불량
- 어두운 환경 인식 저하 → 조명 필요
- 영상 자동재생은 기기 정책상 막힐 수 있음 → controls로 직접 재생 가능
