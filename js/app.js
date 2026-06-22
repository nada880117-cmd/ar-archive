/* app.js — 세션 진입/종료, 진행 저장(localStorage), 탭(조준) 발견 */

window.AppState = {
  KEY: 'ar-progress',
  discovered: new Set(),
  total: 0,

  load() {
    try {
      const s = localStorage.getItem(this.KEY);
      this.discovered = new Set(s ? JSON.parse(s) : []);
    } catch (e) { this.discovered = new Set(); }
    this.refresh();
  },
  persist() {
    try { localStorage.setItem(this.KEY, JSON.stringify([...this.discovered])); } catch (e) {}
  },
  has(id) { return this.discovered.has(id); },

  markDiscovered(id) {
    if (!id || this.discovered.has(id)) return;
    this.discovered.add(id);
    this.persist();
    this.refresh();
    if (this.total > 0 && this.discovered.size >= this.total) {
      setTimeout(() => window.UIOverlay && window.UIOverlay.showFinale(), 1000);
    }
  },

  reset() {
    this.discovered.clear();
    this.persist();
    this.refresh();
    (window._artifacts || []).forEach((a) => a.resetState && a.resetState());
  },

  refresh() {
    const f = document.getElementById('found');
    if (f) f.textContent = this.discovered.size;
  }
};

AFRAME.registerComponent('app', {
  init() {
    const scene = this.el;
    const enterScreen = document.getElementById('enter-screen');
    const hud = document.getElementById('hud');
    const reticle = document.getElementById('reticle');
    const enterBtn = document.getElementById('enter-ar-btn');
    const exitBtn = document.getElementById('exit-ar-btn');
    const resetBtn = document.getElementById('reset-btn');

    window.DBG && DBG.log('app init OK · A-Frame ' + AFRAME.version);

    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((ok) => {
        window.DBG && DBG.log('immersive-ar supported: ' + ok);
        if (!ok) this.markUnsupported(enterBtn);
      }).catch((e) => { this.markUnsupported(enterBtn); });
    } else {
      this.markUnsupported(enterBtn);
    }

    enterBtn.addEventListener('click', () => {
      const p = scene.enterAR ? scene.enterAR() : scene.enterVR(true);
      if (p && p.catch) p.catch((err) => alert('AR 진입 실패: ' + (err && err.message ? err.message : err)));
    });
    exitBtn.addEventListener('click', () => scene.exitVR());
    resetBtn.addEventListener('click', () => {
      if (confirm('도감을 처음부터 다시 시작할까요?')) window.AppState.reset();
    });

    scene.addEventListener('enter-vr', () => {
      if (scene.is('ar-mode')) {
        enterScreen.hidden = true;
        hud.hidden = false;
        if (reticle) reticle.hidden = false;
      }
    });
    scene.addEventListener('exit-vr', () => {
      enterScreen.hidden = false;
      hud.hidden = true;
      if (reticle) reticle.hidden = true;
      window.UIOverlay && window.UIOverlay.closePopup();
    });
  },

  markUnsupported(btn) {
    const warn = document.getElementById('unsupported');
    if (warn) warn.hidden = false;
    if (btn) { btn.disabled = true; btn.textContent = 'AR 미지원 기기'; }
  }
});

/* 화면 탭 → 화면 중앙에 가장 가까운 유물을 발견(조준식) */
AFRAME.registerComponent('tap-picker', {
  init() {
    this.fwd = new THREE.Vector3();
    this.camPos = new THREE.Vector3();
    this.to = new THREE.Vector3();

    this.el.addEventListener('enter-vr', () => {
      const s = this.el.xrSession;
      if (s && !this._bound) {
        this._bound = true;
        s.addEventListener('select', () => this.pick());
      }
    });
  },

  pick() {
    const popup = document.getElementById('popup');
    if (popup && !popup.hidden) return;        // 팝업 떠 있으면 무시
    const cam = this.el.camera;
    if (!cam || !window._artifacts) return;

    cam.getWorldPosition(this.camPos);
    cam.getWorldDirection(this.fwd);           // 카메라 정면(-z)
    let best = null, bestAng = 0.45;           // 약 26도 이내
    window._artifacts.forEach((a) => {
      a.worldPos(this.to);
      this.to.sub(this.camPos).normalize();
      const ang = this.fwd.angleTo(this.to);
      if (ang < bestAng) { bestAng = ang; best = a; }
    });
    if (best) best.open();
  }
});
