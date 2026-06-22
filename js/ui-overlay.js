/* ui-overlay.js — 발견 팝업 / 피날레 (DOM 오버레이) */

window.UIOverlay = {
  popup: null,
  body: null,

  init() {
    this.popup = document.getElementById('popup');
    if (!this.popup) return;
    this.body = this.popup.querySelector('.popup-body');
    this.popup.querySelector('.popup-close')
      .addEventListener('click', () => this.closePopup());
    // 배경 탭으로도 닫기
    this.popup.addEventListener('click', (e) => {
      if (e.target === this.popup) this.closePopup();
    });
  },

  esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  },

  showDiscovery(data) {
    if (!this.popup) return;
    let media = '';
    (data.images || []).forEach((src) => {
      if (src) media += `<img class="c-img" src="${this.esc(src)}" alt="">`;
    });
    if (data.video) media += `<video class="c-vid" src="${this.esc(data.video)}" controls autoplay playsinline></video>`;
    if (!media) media = `<div class="ph-photo" style="background:${this.esc(data.color)}">사진/영상 자리</div>`;

    const text = this.esc(data.text).replace(/\n/g, '<br>');
    this.body.innerHTML = `
      <div class="badge">✨ 새로운 시대 발견!</div>
      <h2>${this.esc(data.title)} <small>${this.esc(data.year)}</small></h2>
      ${media}
      <p>${text || '설명이 아직 없습니다. 편집 화면에서 입력하세요.'}</p>
    `;
    this.popup.hidden = false;
  },

  showFinale() {
    if (!this.popup) return;
    this.body.innerHTML = `
      <div class="badge gold">🏆 모든 시대 발견 완료!</div>
      <h2>45주년을 축하합니다</h2>
      <div class="ph-photo gold">기념 영상 자리</div>
      <p>7개 시대를 모두 둘러보셨습니다. 이 자리에 45주년 기념 영상과
      미래 비전이 재생됩니다. (Phase 3 에서 삽입)</p>
    `;
    this.popup.hidden = false;
  },

  closePopup() {
    if (this.popup) this.popup.hidden = true;
  }
};

document.addEventListener('DOMContentLoaded', () => window.UIOverlay.init());
