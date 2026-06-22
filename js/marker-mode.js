/* marker-mode.js — MindAR(고정 타겟): 액자 인식 → 위에 제목 표시 + 내용 팝업 자동 */

(function () {
  var MAX = 12;
  var lastId = null;

  function onFound(item) {
    var popup = document.getElementById('popup');
    var id = item.id || item.title;
    window.DBG && DBG.log('액자 인식: ' + (item.title || id));
    if (popup && !popup.hidden && lastId === id) return; // 같은 액자 중복 방지
    lastId = id;
    window.UIOverlay && window.UIOverlay.showDiscovery(item);
    window.AppState && window.AppState.markDiscovered(id);
  }

  document.addEventListener('DOMContentLoaded', async function () {
    var scene = document.querySelector('a-scene');
    var data = window.Store ? await window.Store.loadShared() : [];

    if (window.AppState) {
      window.AppState.total = data.length;
      window.AppState.load();
      var tot = document.getElementById('total');
      if (tot) tot.textContent = data.length;
    }

    // 고정 타겟(t0~)에 내용 연결
    var connected = 0;
    data.forEach(function (item, i) {
      if (i >= MAX) return;
      var el = document.getElementById('t' + i);
      if (!el) return;
      var title = el.querySelector('.atitle');
      if (title) title.setAttribute('value', item.title || ('#' + (i + 1)));
      el.addEventListener('targetFound', function () { onFound(item); });
      el.addEventListener('targetLost', function () { /* 표시는 자동으로 사라짐 */ });
      connected++;
    });
    window.DBG && DBG.log('프레임 ' + connected + '개 연결');
    if (data.length > MAX) window.DBG && DBG.log('주의: 액자가 ' + MAX + '개를 넘어 일부만 연결됨');

    var enterBtn = document.getElementById('enter-ar-btn');
    var enterScreen = document.getElementById('enter-screen');
    var hud = document.getElementById('hud');

    enterBtn.addEventListener('click', function () {
      var sys = scene.systems['mindar-image-system'];
      if (!sys) { alert('MindAR 로드 실패 — 새로고침 해보세요.'); return; }
      if (data.length === 0) { alert('편집 화면에서 액자를 먼저 추가하세요.'); return; }
      var p = sys.start();
      Promise.resolve(p).then(function () {
        enterScreen.hidden = true;
        hud.hidden = false;
        window.DBG && DBG.log('MindAR 시작됨 — 액자를 비춰보세요');
      }).catch(function (err) {
        var msg = (err && err.message) ? err.message : err;
        window.DBG && DBG.log('시작 실패: ' + msg);
        alert('AR 시작 실패: ' + msg);
      });
    });

    document.getElementById('exit-ar-btn').addEventListener('click', function () {
      var sys = scene.systems['mindar-image-system'];
      try { if (sys) sys.stop(); } catch (e) {}
      enterScreen.hidden = false;
      hud.hidden = true;
      window.UIOverlay && window.UIOverlay.closePopup();
      lastId = null;
    });

    document.getElementById('reset-btn').addEventListener('click', function () {
      if (confirm('도감을 처음부터 다시 시작할까요?')) window.AppState.reset();
    });
  });
})();
