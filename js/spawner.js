/* spawner.js — AR 진입 시 시대별 유물을 공간에 배치 */

/* 7개 시대 정의. pos 는 시작 지점(사용자 발밑) 기준 로컬 좌표 (x 우, y 상, z 앞=-) */
window.ERAS = [
  { era: '01', title: '창립기',     year: '1980', color: '#2E86C1', pos: '0 1.3 -2.0' },
  { era: '02', title: '성장기',     year: '1988', color: '#27AE60', pos: '2.0 1.4 -1.2' },
  { era: '03', title: '확장기',     year: '1996', color: '#16A085', pos: '2.4 1.3 1.0' },
  { era: '04', title: '혁신기',     year: '2004', color: '#8E44AD', pos: '1.4 1.5 2.4' },
  { era: '05', title: '글로벌기',   year: '2012', color: '#E67E22', pos: '-1.4 1.4 2.4' },
  { era: '06', title: '디지털기',   year: '2018', color: '#2980B9', pos: '-2.4 1.3 1.0' },
  { era: '07', title: '현재 & 미래', year: '2025', color: '#C0392B', pos: '-2.0 1.5 -1.2' }
];

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
    window.AppState && window.AppState.reset();

    try {
      window.ERAS.forEach((e) => {
        const anchor = document.createElement('a-entity');
        anchor.setAttribute('position', e.pos);
        const obj = document.createElement('a-entity');
        obj.setAttribute('archive-object',
          `era: ${e.era}; title: ${e.title}; year: ${e.year}; color: ${e.color}`);
        anchor.appendChild(obj);
        this.el.appendChild(anchor);
      });
      window.DBG && DBG.log('유물 ' + window.ERAS.length + '개 배치 완료');
    } catch (e) {
      window.DBG && DBG.log('SPAWN ERROR: ' + e.message);
    }
  }
});
