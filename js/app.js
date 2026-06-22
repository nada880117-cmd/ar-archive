/* app.js — 세션 진입/종료 제어 + 전역 상태(도감) */

window.AppState = {
  discovered: new Set(),
  total: 7,

  reset() {
    this.discovered.clear();
    const f = document.getElementById('found');
    if (f) f.textContent = '0';
  },

  markDiscovered(era) {
    if (this.discovered.has(era)) return;
    this.discovered.add(era);
    const f = document.getElementById('found');
    if (f) f.textContent = this.discovered.size;

    if (this.discovered.size >= this.total) {
      // 모든 시대 발견 → 피날레
      setTimeout(() => window.UIOverlay && window.UIOverlay.showFinale(), 1000);
    }
  }
};

AFRAME.registerComponent('app', {
  init() {
    const scene = this.el;
    const enterScreen = document.getElementById('enter-screen');
    const hud = document.getElementById('hud');
    const enterBtn = document.getElementById('enter-ar-btn');
    const exitBtn = document.getElementById('exit-ar-btn');

    document.getElementById('total').textContent = window.AppState.total;

    // WebXR immersive-ar 지원 여부 확인
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((ok) => {
        if (!ok) this.markUnsupported(enterBtn);
      }).catch(() => this.markUnsupported(enterBtn));
    } else {
      this.markUnsupported(enterBtn);
    }

    // AR 진입 (사용자 제스처 필요)
    enterBtn.addEventListener('click', () => {
      const p = scene.enterAR ? scene.enterAR() : scene.enterVR(true);
      if (p && p.catch) {
        p.catch((err) => alert('AR 진입 실패: ' + (err && err.message ? err.message : err)));
      }
    });

    exitBtn.addEventListener('click', () => scene.exitVR());

    scene.addEventListener('enter-vr', () => {
      if (scene.is('ar-mode')) {
        enterScreen.hidden = true;
        hud.hidden = false;
      }
    });

    scene.addEventListener('exit-vr', () => {
      enterScreen.hidden = false;
      hud.hidden = true;
      window.UIOverlay && window.UIOverlay.closePopup();
    });
  },

  markUnsupported(btn) {
    const warn = document.getElementById('unsupported');
    if (warn) warn.hidden = false;
    if (btn) { btn.disabled = true; btn.textContent = 'AR 미지원 기기'; }
  }
});
