/* spawner.js — AR 진입 시 공유본(content.json)대로 유물을 공간에 배치 */

AFRAME.registerComponent('archive-spawner', {
  init() {
    this.spawned = false;
    this.data = null;
    var self = this;

    if (window.Store) {
      window.Store.loadShared().then(function (d) {
        self.data = d;
        if (window.AppState) {
          window.AppState.total = d.length;
          window.AppState.load();
          var t = document.getElementById('total');
          if (t) t.textContent = d.length;
        }
        window.DBG && DBG.log('데이터 ' + d.length + '개 로드됨');
      });
    }

    this.el.addEventListener('enter-vr', function () {
      if (self.el.is('ar-mode')) self.spawn();
    });
  },

  spawn() {
    if (this.spawned) return;
    var data = this.data || (window.Store ? window.Store.load() : []);
    if (!data || !data.length) { window.DBG && DBG.log('데이터 아직 로드 안 됨'); return; }
    this.spawned = true;

    try {
      data.forEach(function (e) {
        var anchor = document.createElement('a-entity');
        anchor.setAttribute('position', (e.x || 0) + ' ' + (e.y || 1.4) + ' ' + (e.z || -2));

        var obj = document.createElement('a-entity');
        obj.setAttribute('archive-object',
          { title: e.title || '', year: e.year || '', color: e.color || '#2E86C1' });
        obj.eraData = e;

        anchor.appendChild(obj);
        this.el.appendChild(anchor);
      }, this);
      window.DBG && DBG.log('유물 ' + data.length + '개 배치 완료');
    } catch (e) {
      window.DBG && DBG.log('SPAWN ERROR: ' + e.message);
    }
  }
});
