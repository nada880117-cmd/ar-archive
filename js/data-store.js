/* data-store.js — 편집기(admin.html)와 AR(ar.html)이 공유하는 데이터 저장소
   저장 위치: 이 기기 브라우저의 localStorage (같은 태블릿에서 편집→AR 즉시 반영)
   영구/공유하려면 admin 화면의 "내보내기"로 JSON 백업 */

window.Store = {
  KEY: 'ar-archive-data',

  // 기본 템플릿 (처음 실행 시 예시 3개 — admin에서 자유롭게 추가/수정/삭제)
  defaults() {
    return [
      { id: 'e1', title: '창립기', year: '1980', color: '#2E86C1',
        x: 0, y: 1.3, z: -2,
        text: '여기에 이 시대의 설명을 입력하세요. (예: 회사 창립 배경과 초기 이야기)',
        images: [], video: '' },
      { id: 'e2', title: '성장기', year: '1995', color: '#27AE60',
        x: 2, y: 1.4, z: -1,
        text: '여기에 설명을 입력하세요.',
        images: [], video: '' },
      { id: 'e3', title: '현재 & 미래', year: '2025', color: '#C0392B',
        x: -2, y: 1.4, z: -1,
        text: '여기에 설명을 입력하세요.',
        images: [], video: '' }
    ];
  },

  load() {
    try {
      const s = localStorage.getItem(this.KEY);
      if (s) {
        const data = JSON.parse(s);
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return this.defaults();
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  },

  // 새 유물 1개 생성용 빈 템플릿
  blank() {
    const palette = ['#2E86C1', '#27AE60', '#16A085', '#8E44AD', '#E67E22', '#2980B9', '#C0392B', '#F39C12'];
    return {
      id: 'e' + Math.floor(performance.now()) + '_' + (this._n = (this._n || 0) + 1),
      title: '새 시대', year: '', color: palette[(this._n) % palette.length],
      x: 0, y: 1.4, z: -2, text: '', images: [], video: ''
    };
  }
};
