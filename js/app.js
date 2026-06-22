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
    window.DBG && DBG.log('app init OK · A-Frame ' + AFRAME.version);

    // WebXR immersive-ar 지원 여부 확인
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-ar').then((ok) => {
        window.DBG && DBG.log('immersive-ar supported: ' + ok);
        if (!ok) this.markUnsupported(enterBtn);
      }).catch((e) => { window.DBG && DBG.log('isSessionSupported err: ' + e); this.markUnsupported(enterBtn); });
    } else {
      window.DBG && DBG.log('navigator.xr 없음 (WebXR 미지원 브라우저)');
      this.markUnsupported(enterBtn);
    }

    // AR 진입 (사용자 제스처 필요)
    enterBtn.addEventListener('click', () => {
      window.DBG && DBG.log('enterAR 호출');
      const p = scene.enterAR ? scene.enterAR() : scene.enterVR(true);
      if (p && p.catch) {
        p.catch((err) => {
          window.DBG && DBG.log('AR 진입 실패: ' + (err && err.message ? err.message : err));
          alert('AR 진입 실패: ' + (err && err.message ? err.message : err));
        });
      }
    });

    exitBtn.addEventListener('click', () => scene.exitVR());

    scene.addEventListener('enter-vr', () => {
      window.DBG && DBG.log('enter-vr 이벤트 · ar-mode=' + scene.is('ar-mode'));
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
