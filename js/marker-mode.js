/* marker-mode.js — MindAR 이미지 인식: 액자를 비추면 그 내용 팝업 (영상 포함) */

(function () {
  var lastId = null;

  function onFound(e) {
    var popup = document.getElementById('popup');
    var id = e.id || e.title;
    if (popup && !popup.hidden && lastId === id) return; // 같은 액자 중복 방지
    lastId = id;
    window.DBG && DBG.log('액자 인식: ' + (e.title || id));
    window.UIOverlay && window.UIOverlay.showDiscovery(e);
    window.AppState && window.AppState.markDiscovered(id);
  }

  function buildTargets(scene, data) {
    data.forEach(function (e, i) {
      var t = document.createElement('a-entity');
      t.setAttribute('mindar-image-target', 'targetIndex: ' + i);
      t.addEventListener('targetFound', function () { onFound(e); });
      scene.appendChild(t);
    });
    window.DBG && DBG.log('프레임 ' + data.length + '개 연결 (targetIndex 0~' + (data.length - 1) + ')');
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

    buildTargets(scene, data);

    var enterBtn = document.getElementById('enter-ar-btn');
    var enterScreen = document.getElementById('enter-screen');
    var hud = document.getElementById('hud');

    enterBtn.addEventListener('click', function () {
      var sys = scene.systems['mindar-image-system'];
      if (!sys) { alert('MindAR 로드 실패 — 새로고침 해보세요.'); return; }
      if (data.length === 0) {
        alert('편집 화면에서 프레임을 먼저 추가하세요.');
        return;
      }
      var p = sys.start();
      Promise.resolve(p).then(function () {
        enterScreen.hidden = true;
        hud.hidden = false;
        window.DBG && DBG.log('MindAR 시작됨');
      }).catch(function (err) {
        var msg = (err && err.message) ? err.message : err;
        window.DBG && DBG.log('시작 실패: ' + msg);
        alert('AR 시작 실패: ' + msg + '\n(액자 인식표 targets/targets.mind 가 없을 수 있어요)');
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
