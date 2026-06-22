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

  showDiscovery(data) {
    if (!this.popup) return;
    // TODO(Phase3): placeholder → 실제 사진/영상/텍스트 콘텐츠로 교체
    this.body.innerHTML = `
      <div class="badge">✨ 새로운 시대 발견!</div>
      <h2>${data.title} <small>${data.year || ''}</small></h2>
      <div class="ph-photo" style="background:${data.color}">사진 자리</div>
      <p>여기에 <b>${data.title}</b>의 역사 사진 · 인터뷰 영상 · 설명 텍스트가
      들어갑니다. (현재는 임시 콘텐츠 — Phase 3 에서 실제 자료로 교체)</p>
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
