# 회사 역사 AR 아카이브 — 설계 명세서

> 360° WebAR 전시 시스템 | 45주년 기념 디지털 아카이브 프로젝트  
> 버전 v1.0 | 기술스택: A-Frame + Three.js + GitHub Pages | 예상 비용: ₩0

---

## 문서 정보

| 항목 | 내용 |
|------|------|
| 문서 버전 | v1.0 |
| 작성 목적 | Claude Code 구현을 위한 상세 설계 명세 |
| 기술 스택 | A-Frame 1.5 + Three.js + Vanilla JS + GitHub Pages |
| 예상 비용 | ₩0 (오픈소스 + 무료 호스팅) |
| 대상 기기 | iOS / Android 스마트폰 (앱 설치 불필요) |
| 입력 방식 | QR코드 스캔 → 브라우저 즉시 실행 |

---

## 1. 프로젝트 개요

### 1.1 핵심 컨셉

회의실 벽면에 QR코드를 부착하고, 방문자가 스마트폰으로 스캔하면 브라우저에서 360° 증강현실 역사 공간이 열린다.  
방문자는 실제로 회의실 안을 걸어다니며 스마트폰을 다양한 방향으로 움직여 연도별 역사 콘텐츠를 체험한다.

```
① QR코드 스캔
② 브라우저에서 360° 공간 열림 (앱 설치 불필요)
③ 스마트폰을 들고 회의실 안을 실제로 이동
④ 방향을 바꾸면 → 다른 연도/시대 콘텐츠가 보임
⑤ 핫스팟(빛나는 오브젝트) 터치 → 사진·영상·텍스트 팝업
⑥ 씬 전환 게이트 통과 → 다음 시대로 이동
```

### 1.2 핵심 기술 요건

- 앱 설치 불필요 (Pure WebAR, 브라우저만으로 동작)
- 디바이스 자이로스코프 활용 (스마트폰 방향 = 360° 시점)
- 360° 파노라마 이미지 기반 씬 구성
- 씬 간 이동 (시대 전환) 지원
- GitHub Pages 무료 호스팅 (HTTPS 필수 — 자이로스코프 API 보안 요건)

### 1.3 프로젝트 목표

- 45주년 기념 회사 역사를 몰입형 AR 체험으로 전달
- QR 스캔만으로 즉시 접근 가능한 Zero-Friction 경험 제공
- 7개 이상 시대별 360° 씬으로 회사의 발자취 표현
- 역사 사진, 인터뷰 영상, 3D 오브젝트를 통합한 멀티미디어 전시
- 스마트폰만으로 체험 가능 — 별도 기기/앱 불필요

---

## 2. 기술 스택 및 아키텍처

### 2.1 핵심 라이브러리

| 라이브러리 | 버전 | 역할 | 비용 |
|-----------|------|------|------|
| A-Frame | v1.5.x | 360° VR/WebXR 씬 렌더링 엔진 | 무료 |
| Three.js | r158+ | 3D 오브젝트 / 로고 렌더링 | 무료 |
| A-Frame Extras | v7.x | 터치/이동 컨트롤러 | 무료 |
| GSAP | v3.x | 씬 전환 애니메이션 | 무료 |
| GitHub Pages | - | 정적 호스팅 (HTTPS) | 무료 |

### 2.2 시스템 아키텍처

```
[QR 스캔]
    │
    ▼
[index.html] ── 온보딩 + 자이로스코프 권한 요청
    │
    ▼
[scene-0X.html] ── A-Frame 360° 씬 렌더링
    │
    ├─ a-sky: 360° 파노라마 이미지
    ├─ a-entity (hotspot): 핫스팟 오브젝트들
    │       └─ 클릭/Gaze → ui-overlay.js 팝업 호출
    ├─ a-entity (scene-gate): 씬 전환 포털
    │       └─ 근접 감지 → scene-manager.js 전환
    └─ a-camera: 자이로스코프 연동 시점 제어
                └─ a-cursor: Gaze Input (1.5초 응시)

[GitHub Pages HTTPS 호스팅]
```

### 2.3 디렉터리 구조

```
ar-archive/
├── index.html                  # 진입점 (QR → 이 페이지)
├── scenes/
│   ├── scene-01-founding.html  # 씬1: 창립기
│   ├── scene-02-growth.html    # 씬2: 성장기
│   ├── scene-03-expansion.html # 씬3: 확장기
│   ├── scene-04-innovation.html# 씬4: 혁신기
│   ├── scene-05-global.html    # 씬5: 글로벌기
│   ├── scene-06-digital.html   # 씬6: 디지털기
│   └── scene-07-present.html   # 씬7: 현재 & 미래
├── assets/
│   ├── panoramas/              # 360° 파노라마 이미지 (.webp)
│   ├── photos/                 # 역사 사진 (.webp)
│   ├── videos/                 # 인터뷰 영상 (.mp4)
│   ├── models/                 # 3D 오브젝트 (.glb)
│   └── audio/                  # 배경음악/나레이션 (.mp3)
├── js/
│   ├── scene-manager.js        # 씬 전환 로직
│   ├── hotspot.js              # 핫스팟 인터랙션 컴포넌트
│   ├── ui-overlay.js           # 팝업/UI 컨트롤
│   └── gyro-helper.js          # 자이로스코프 권한 핸들러 (iOS)
├── css/
│   └── style.css               # UI 스타일
└── qr/
    └── generate-qr.html        # QR 생성 도구
```

---

## 3. 씬(Scene) 설계

### 3.1 씬 구성 일람

| 씬 | 시대 | 360° 배경 | 주요 콘텐츠 | 핫스팟 수 |
|----|------|-----------|------------|----------|
| 씬 1 | 창립기 | 파노라마 (창업 현장) | 역사 사진 3장, 창업 스토리 텍스트 | 4개 |
| 씬 2 | 성장기 | 파노라마 (초기 공장) | 제품 사진 4장, 직원 인터뷰 영상 | 5개 |
| 씬 3 | 확장기 | 파노라마 (사무실/공장) | 사업 확장 자료, 3D 로고 | 5개 |
| 씬 4 | 혁신기 | 파노라마 (연구소) | 특허/수상 사진, 임원 인터뷰 영상 | 6개 |
| 씬 5 | 글로벌기 | 파노라마 (해외거점) | 글로벌 진출 사진, 지도 3D 오브젝트 | 5개 |
| 씬 6 | 디지털기 | 파노라마 (현대 사무실) | 디지털 전환 사진, 현 대표 인터뷰 | 6개 |
| 씬 7 | 현재 & 미래 | 파노라마 (본사/현장) | 45주년 기념 영상, 미래 비전, 3D 트로피 | 7개 |

### 3.2 씬 상세 — 씬 1: 창립기 (예시)

모든 씬은 동일한 구조를 따른다. 씬 1을 기준으로 상세 설계를 기술한다.

| 항목 | 내용 |
|------|------|
| 씬 ID | `scene-01-founding` |
| 파노라마 파일 | `assets/panoramas/01-founding.webp` (4096×2048px, equirectangular) |
| 배경 음악 | `assets/audio/01-founding-bgm.mp3` (볼륨 0.3, 루프) |
| 다음 씬 | 동쪽(0°) 방향 게이트 → `scene-02-growth.html` |
| 핫스팟 수 | 4개 |

**핫스팟 배치 (씬 1)**

| 핫스팟 ID | 위치 (x,y,z) | 타입 | 콘텐츠 |
|----------|-------------|------|--------|
| hs-01-photo1 | -3, 1.5, -4 | 사진 | 창업 초기 공장 전경 |
| hs-01-photo2 | 0, 1.5, -5 | 사진 | 창업자 및 초기 임직원 단체사진 |
| hs-01-photo3 | 3, 1.5, -4 | 사진 | 초기 제품 라인업 |
| hs-01-text | 0, 2.5, -3 | 텍스트 | 회사 창립 스토리 (300자 이내) |

---

## 4. 핫스팟(Hotspot) 시스템

### 4.1 핫스팟 타입 정의

| 타입 | 트리거 | 팝업 내용 | 닫기 |
|------|--------|-----------|------|
| 📷 사진 | 터치 / Gaze 1.5초 | 전체화면 이미지 + 캡션 | X 버튼 or 백 스와이프 |
| 🎥 영상 | 터치 / Gaze 1.5초 | 인라인 mp4 플레이어 (자동재생 X) | 영상 종료 or X 버튼 |
| 📝 텍스트 | 터치 / Gaze 1.5초 | 스크롤 가능한 텍스트 박스 | X 버튼 |
| 🎯 3D 오브젝트 | 터치 / Gaze 1.5초 | Three.js 3D 뷰어 (드래그 회전) | X 버튼 |
| 🚪 씬 전환 게이트 | 근접 자동 감지 | 페이드아웃 후 다음 씬 로드 | 자동 |

### 4.2 핫스팟 시각 표현

- **기본 상태**: 반투명 파란색 구체 (radius 0.2) + 펄스 애니메이션
- **호버/응시 상태**: 구체 확대 (1.3×) + 흰색 링 표시 + Gaze 진행 바
- **아이콘**: 구체 중앙에 타입별 텍스처 (📷 🎥 📝 🎯)
- **레이블**: 구체 상단에 항상 카메라를 향하는(billboard) 한글 텍스트
- **씬 전환 게이트**: 발광 토러스 형태의 포털 (GSAP 회전 애니메이션)

### 4.3 인터랙션 흐름

```
1. 사용자가 핫스팟 방향으로 스마트폰 조준
2. 화면 중앙 커서가 핫스팟 위에 1.5초 유지 → 자동 트리거 (Gaze Input)
   또는 핫스팟 직접 터치
3. A-Frame 씬 일시 정지
4. 팝업 오버레이 DOM 표시 (GSAP fadeIn 0.3s)
5. 콘텐츠 소비 (사진 감상 / 영상 시청 / 텍스트 읽기)
6. X 버튼 또는 백 스와이프로 팝업 닫기 (GSAP fadeOut 0.3s)
7. A-Frame 씬 재개
```

---

## 5. UI/UX 설계

### 5.1 시작 화면 (index.html)

- 회사 로고 + `"역사 AR 투어 시작"` 버튼
- 자이로스코프 권한 요청 안내 (iOS 13+ DeviceOrientationEvent 필수)
- 간단한 조작법 온보딩 (3슬라이드 스와이프)
  - 슬라이드 1: "스마트폰을 들고 주변을 둘러보세요"
  - 슬라이드 2: "빛나는 오브젝트를 응시하거나 터치하세요"
  - 슬라이드 3: "게이트를 통과하면 다음 시대로 이동해요"
- `"투어 시작"` 버튼 → `scenes/scene-01-founding.html` 로드

### 5.2 씬 내 상시 UI

| UI 요소 | 위치 | 기능 |
|---------|------|------|
| 시대 표시기 | 상단 중앙 | 현재 시대 이름 + 씬 번호 (예: 창립기 1/7) |
| 나침반 | 상단 우측 | 현재 바라보는 방향 (자이로 연동) |
| 탐험 진행도 | 하단 좌측 | 발견한 핫스팟 수 (예: 🔵 3/4) |
| 타임라인 바 | 하단 중앙 | 7개 씬 점 표시 — 터치 시 직접 이동 |
| 홈 버튼 | 하단 우측 | index.html 복귀 |
| 음소거 버튼 | 상단 좌측 | 배경음악 on/off |

### 5.3 팝업 UI 스펙

```css
/* 팝업 오버레이 */
.popup-overlay {
  background: rgba(0, 0, 0, 0.85);
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 팝업 카드 */
.popup-card {
  background: #ffffff;
  border-radius: 16px;
  max-width: 90vw;
  max-height: 85vh;
  overflow-y: auto;
  padding: 20px;
}

/* 닫기 버튼 (최소 터치 영역 44px) */
.popup-close {
  width: 44px;
  height: 44px;
  position: absolute;
  top: 12px;
  right: 12px;
}
```

- 사진 팝업: 이미지 전체폭 + 하단 캡션 (한글, 16px)
- 영상 팝업: `<video controls>` 네이티브 플레이어, 자동재생 금지
- 등장/퇴장 애니메이션: GSAP `fadeIn` / `fadeOut` (duration 0.3s)

---

## 6. 360° 파노라마 촬영 가이드

### 6.1 촬영 방법

스마트폰 기본 카메라 앱의 파노라마 모드를 사용한다.

| 항목 | 권장 사항 |
|------|-----------|
| 해상도 | 최소 4096×2048px (equirectangular 2:1 비율) |
| 포맷 | JPEG 촬영 후 WebP 변환 (파일 크기 40% 절감) |
| 파일 크기 | 씬당 최대 3MB |
| 촬영 위치 | 씬 중심점, 눈높이 약 1.5m |
| 촬영 환경 | 자연광 또는 충분한 실내 조명 |
| iOS | 기본 카메라 → 파노라마 모드 |
| Android | Google Camera → 포토스피어 모드 |
| 보정 | 수평선 맞춤 필수 (Lightroom / Snapseed) |

### 6.2 WebP 변환 명령어

```bash
# cwebp 사용 (권장)
cwebp -q 85 01-founding.jpg -o 01-founding.webp

# 또는 ffmpeg 사용
ffmpeg -i 01-founding.jpg -c:v libwebp -quality 85 01-founding.webp

# 일괄 변환 (bash)
for f in assets/panoramas/*.jpg; do
  cwebp -q 85 "$f" -o "${f%.jpg}.webp"
done
```

---

## 7. 핵심 코드 설계

### 7.1 씬 기본 구조 (scene-0X.html)

```html
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
  <script src="https://cdn.jsdelivr.net/gh/c-frame/aframe-extras/dist/aframe-extras.min.js"></script>
  <script src="../js/hotspot.js"></script>
  <script src="../js/scene-manager.js"></script>
  <script src="../js/ui-overlay.js"></script>
  <script src="../js/gyro-helper.js"></script>
  <link rel="stylesheet" href="../css/style.css">
</head>
<body>
  <!-- 씬 상시 UI -->
  <div id="scene-ui">
    <div id="mute-btn">🔊</div>
    <div id="scene-title">창립기 1/7</div>
    <div id="compass">N</div>
    <div id="hotspot-count">🔵 0/4</div>
    <div id="timeline-bar"><!-- 씬 점 7개 --></div>
    <div id="home-btn">🏠</div>
  </div>

  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="enabled: false"
    renderer="colorManagement: true; antialias: true">

    <a-assets>
      <img id="sky" src="../assets/panoramas/01-founding.webp" crossorigin="anonymous">
      <img id="photo1" src="../assets/photos/01-factory.jpg" crossorigin="anonymous">
      <video id="video1" src="../assets/videos/01-interview.mp4"
             preload="none" crossorigin="anonymous" playsinline></video>
      <audio id="bgm" src="../assets/audio/01-founding-bgm.mp3"
             preload="auto" loop></audio>
    </a-assets>

    <!-- 360° 배경 -->
    <a-sky src="#sky" rotation="0 -90 0"></a-sky>

    <!-- 핫스팟: 사진 -->
    <a-entity
      hotspot="type: photo; target: #photo1; label: 창업 초기 공장; caption: 1980년대 창업 당시 공장 전경"
      position="-3 1.5 -4"
      geometry="primitive: sphere; radius: 0.2"
      material="color: #2E86C1; opacity: 0.8; emissive: #2E86C1; emissiveIntensity: 0.3"
      animation="property: scale; to: 1.1 1.1 1.1; dur: 1000; loop: true; dir: alternate">
    </a-entity>

    <!-- 핫스팟: 영상 -->
    <a-entity
      hotspot="type: video; target: #video1; label: 창업자 인터뷰"
      position="0 1.5 -5"
      geometry="primitive: sphere; radius: 0.2"
      material="color: #E74C3C; opacity: 0.8; emissive: #E74C3C; emissiveIntensity: 0.3"
      animation="property: scale; to: 1.1 1.1 1.1; dur: 1000; loop: true; dir: alternate">
    </a-entity>

    <!-- 씬 전환 게이트 → 씬2 -->
    <a-entity
      scene-gate="target: ../scenes/scene-02-growth.html; label: 성장기로 이동"
      position="0 1.5 -7"
      geometry="primitive: torus; radius: 0.8; radiusTubular: 0.05"
      material="color: #F39C12; emissive: #F39C12; emissiveIntensity: 0.5; opacity: 0.8"
      animation="property: rotation; to: 0 360 0; dur: 8000; loop: true; easing: linear">
    </a-entity>

    <!-- 카메라 (자이로스코프 연동) -->
    <a-camera
      look-controls="magicWindowTrackingEnabled: true; touchEnabled: false"
      wasd-controls="enabled: false"
      position="0 1.6 0">
      <!-- Gaze 커서 -->
      <a-cursor
        fuse="true"
        fuse-timeout="1500"
        color="#FFFFFF"
        opacity="0.8"
        geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.015"
        animation__click="property: scale; startEvents: click; easing: easeInCubic; dur: 150; from: 0.1 0.1 0.1; to: 1 1 1">
      </a-cursor>
    </a-camera>

  </a-scene>
</body>
</html>
```

### 7.2 scene-manager.js

```javascript
const SceneManager = {
  currentScene: null,
  visitedScenes: new Set(),

  // 씬 전환 (페이드 효과)
  transitionToScene(url) {
    const overlay = document.getElementById('fade-overlay');
    // 페이드아웃
    overlay.style.opacity = '1';
    setTimeout(() => {
      this.saveProgress(url);
      window.location.href = url;
    }, 500);
  },

  // 진행 상태 저장
  saveProgress(sceneUrl) {
    localStorage.setItem('ar-last-scene', sceneUrl);
    const visited = JSON.parse(localStorage.getItem('ar-visited') || '[]');
    visited.push(sceneUrl);
    localStorage.setItem('ar-visited', JSON.stringify([...new Set(visited)]));
  },

  // 저장된 씬 불러오기
  loadProgress() {
    return localStorage.getItem('ar-last-scene') || 'scenes/scene-01-founding.html';
  },

  // 타임라인 바 업데이트
  updateTimeline(sceneIndex) {
    const dots = document.querySelectorAll('.timeline-dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === sceneIndex);
      dot.classList.toggle('visited', i < sceneIndex);
    });
  }
};
```

### 7.3 hotspot.js (A-Frame 커스텀 컴포넌트)

```javascript
AFRAME.registerComponent('hotspot', {
  schema: {
    type:    { type: 'string', default: 'photo' }, // photo | video | text | model
    target:  { type: 'selector' },
    label:   { type: 'string', default: '' },
    caption: { type: 'string', default: '' },
  },

  init() {
    this.el.addEventListener('click', () => this.trigger());
    this.el.addEventListener('fusing', () => this.onFusing());

    // 레이블 텍스트 엔티티 생성
    const label = document.createElement('a-text');
    label.setAttribute('value', this.data.label);
    label.setAttribute('align', 'center');
    label.setAttribute('position', '0 0.35 0');
    label.setAttribute('scale', '0.5 0.5 0.5');
    label.setAttribute('look-at', '[camera]');
    this.el.appendChild(label);
  },

  trigger() {
    const { type, target, caption } = this.data;
    const overlay = window.UIOverlay;
    if (type === 'photo')  overlay.showPhoto(target.src, caption);
    if (type === 'video')  overlay.showVideo(target);
    if (type === 'text')   overlay.showText(this.data.caption);
    if (type === 'model')  overlay.show3DModel(target.src);
  },

  onFusing() {
    // Gaze 진행 표시 (커서 채워지는 애니메이션)
    this.el.setAttribute('material', 'emissiveIntensity', 0.7);
  }
});

// 씬 전환 게이트 컴포넌트
AFRAME.registerComponent('scene-gate', {
  schema: {
    target: { type: 'string' },
    label:  { type: 'string', default: '다음으로' },
  },
  init() {
    this.el.addEventListener('click', () => {
      SceneManager.transitionToScene(this.data.target);
    });
  }
});
```

### 7.4 gyro-helper.js (iOS 자이로스코프 권한)

```javascript
// iOS 13+ 는 DeviceOrientationEvent 권한을 명시적으로 요청해야 함
async function requestGyroPermission() {
  if (typeof DeviceOrientationEvent !== 'undefined' &&
      typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const permission = await DeviceOrientationEvent.requestPermission();
      return permission === 'granted';
    } catch (e) {
      console.warn('Gyro permission denied:', e);
      return false;
    }
  }
  return true; // Android / Desktop은 권한 불필요
}

// 시작 버튼 클릭 시 호출
document.getElementById('start-btn').addEventListener('click', async () => {
  const granted = await requestGyroPermission();
  if (granted) {
    window.location.href = 'scenes/scene-01-founding.html';
  } else {
    alert('자이로스코프 권한이 필요합니다. 설정에서 허용해주세요.');
  }
});
```

---

## 8. 성능 최적화 요건

| 항목 | 목표값 | 방법 |
|------|--------|------|
| 초기 로딩 | < 2초 | 진입 페이지 경량화, 씬은 별도 로드 |
| 씬 전환 | < 3초 | 다음 씬 파노라마 prefetch |
| 파노라마 파일 | < 3MB/씬 | WebP 변환, 압축률 85% |
| 영상 파일 | < 50MB/개 | H.264 720p, 스트리밍 |
| 3D 모델 | < 2MB/개 | GLB 포맷 |
| FPS | ≥ 30fps | A-Frame renderer 최적화 |
| 캐싱 | Service Worker | 재방문 시 오프라인 가능 |

```html
<!-- 다음 씬 prefetch (현재 씬 하단에 추가) -->
<link rel="prefetch" href="../scenes/scene-02-growth.html">
<link rel="prefetch" href="../assets/panoramas/02-growth.webp">
```

---

## 9. 개발 단계 (Phase 체크리스트)

### Phase 1 — 기반 구조 (1~2일)

- [ ] 프로젝트 폴더 구조 생성 및 GitHub 저장소 초기화
- [ ] `index.html` 진입점 (온보딩 3슬라이드 + 자이로 권한 요청)
- [ ] `gyro-helper.js` iOS 권한 핸들러
- [ ] `scene-manager.js` 씬 전환 + 진행 저장 로직
- [ ] `hotspot.js` A-Frame 커스텀 컴포넌트 (photo 타입 우선)
- [ ] `ui-overlay.js` 팝업 렌더링
- [ ] `style.css` 전체 UI 스타일
- [ ] GitHub Pages 배포 설정 및 HTTPS URL 확인
- [ ] `qr/generate-qr.html` QR 생성 도구

### Phase 2 — 씬 구현 (3~5일)

- [ ] `scene-01` ~ `scene-07` HTML 파일 생성 (임시 파노라마로 먼저)
- [ ] 각 씬 핫스팟 배치 및 `position` 값 현장 튜닝
- [ ] 씬 전환 게이트 연결 (씬1→씬2→...→씬7 체인)
- [ ] 하단 타임라인 바 UI 구현 + 직접 이동 기능
- [ ] 나침반 자이로 연동
- [ ] 핫스팟 video / text / model 타입 구현

### Phase 3 — 콘텐츠 통합 (2~3일)

- [ ] 7개 씬 360° 파노라마 촬영 → WebP 변환
- [ ] 역사 사진 최적화 (WebP, 최대 1200px)
- [ ] 인터뷰 영상 mp4 인코딩 (H.264, 720p)
- [ ] 3D 오브젝트 GLB 제작 (로고, 트로피 — Blender 또는 무료 에셋)
- [ ] 각 씬 실제 콘텐츠 교체 및 캡션 텍스트 작성
- [ ] 배경 음악/나레이션 삽입

### Phase 4 — QA 및 배포 (1~2일)

- [ ] iOS Safari 테스트 (자이로스코프 권한, 영상 자동재생 정책)
- [ ] Android Chrome 테스트
- [ ] 씬 로딩 시간 측정 (목표 3초 이내)
- [ ] 파노라마 lazy loading 적용
- [ ] 오프라인 캐싱 Service Worker 적용 (선택)
- [ ] 회의실 현장 테스트 — 실제 걸어다니며 QR→AR 체험
- [ ] QR코드 최종 디자인 인쇄 (A5 액자 또는 스티커)

---

## 10. 배포 및 QR 운영

### 10.1 GitHub Pages 배포

```bash
# 1. 저장소 생성 및 push
git init
git add .
git commit -m "init: AR archive project"
git remote add origin https://github.com/[계정]/company-ar-archive.git
git push -u origin main

# 2. GitHub Settings → Pages → Branch: main / Folder: / (root)
# 3. URL 자동 발급: https://[계정].github.io/company-ar-archive/
```

### 10.2 QR코드 운영 방안

| QR 종류 | 링크 목적지 | 부착 위치 |
|---------|------------|----------|
| 메인 QR | `index.html` (전체 투어) | 회의실 입구 액자 (A5) |
| 씬 직접 접근 QR | `scenes/scene-0X.html` | 각 씬 관련 벽면 옆 |
| 조작법 QR | 조작 안내 페이지 | 회의실 테이블 |

### 10.3 콘텐츠 업데이트

- 파일 교체 후 `git push` → GitHub Pages 자동 재배포 (수분 내)
- 핫스팟 추가: 해당 `scene-0X.html`에 `<a-entity hotspot>` 추가
- 씬 추가: 새 HTML 파일 생성 → `index.html` 타임라인에 점 추가

---

## 11. Claude Code 시작 프롬프트

아래 프롬프트를 Claude Code에 그대로 붙여넣어 구현을 시작한다.

```
이 설계 명세서(ar-archive-spec.md)를 기반으로 WebAR 360° 역사 아카이브를 구현해줘.

기술스택:
- A-Frame 1.5.0
- Three.js (A-Frame 내장)
- Vanilla JS (빌드 도구 없이 순수 HTML/JS/CSS)
- GitHub Pages 정적 호스팅

구현 순서:
1. 프로젝트 폴더 구조 생성
2. index.html (온보딩 + iOS 자이로 권한 요청)
3. gyro-helper.js
4. scene-manager.js
5. hotspot.js (A-Frame 커스텀 컴포넌트)
6. ui-overlay.js (팝업 시스템)
7. style.css
8. scene-01-founding.html ~ scene-07-present.html (7개 씬)
9. qr/generate-qr.html (QR 생성 도구)

각 씬 핫스팟 타입: photo / video / text / model / scene-gate
컨트롤: 자이로스코프(스마트폰) + 터치 + Gaze Input (1.5초 응시)

임시 파노라마 이미지는 equirectangular 그라데이션으로 대체하고,
실제 파일 경로만 맞춰두면 나중에 교체할 수 있게 해줘.

Phase 1부터 시작해줘.
```

---

> **총 예상 개발 기간: 7~10일**  
> **총 예상 비용: ₩0** (오픈소스 + GitHub Pages 무료 호스팅)
