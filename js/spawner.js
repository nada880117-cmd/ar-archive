/* spawner.js — AR 진입 시 저장된 데이터(Store)대로 유물을 공간에 배치 */

AFRAME.registerComponent('archive-spawner', {
  init() {
    this.spawned = false;
    this.el.addEventListener('enter-vr', () => {
      if (this.el.is('ar-mode')) this.spawn();
    });
  },

  spawn() {
    if (this.spawned) return;
    this.spawned = true;

    const data = (window.Store ? window.Store.load() : []);
    if (window.AppState) {
      window.AppState.total = data.length;
      window.AppState.load(); // 저장된 진행 복원 (새로고침해도 유지)
      const t = document.getElementById('total');
      if (t) t.textContent = data.length;
    }

    try {
      data.forEach((e) => {
        const anchor = document.createElement('a-entity');
        anchor.setAttribute('position', (e.x || 0) + ' ' + (e.y || 1.4) + ' ' + (e.z || -2));

        const obj = document.createElement('a-entity');
        // 특수문자 안전하게 객체 형태로 전달
        obj.setAttribute('archive-object', { title: e.title || '', year: e.year || '', color: e.color || '#2E86C1' });
        obj.eraData = e; // 발견 시 팝업에 쓸 전체 데이터

        anchor.appendChild(obj);
        this.el.appendChild(anchor);
      });
      window.DBG && DBG.log('유물 ' + data.length + '개 배치 완료');
      if (data.length === 0) window.DBG && DBG.log('데이터 없음 — 편집(admin) 화면에서 추가하세요');
    } catch (e) {
      window.DBG && DBG.log('SPAWN ERROR: ' + e.message);
    }
  }
});
