/* debug.js — 폰 화면에 직접 로그를 띄우는 디버그 패널 (원인 추적용) */
window.DBG = (function () {
  let el = null;
  function mount() {
    if (el) return;
    el = document.getElementById('debug');
    if (!el) {
      el = document.createElement('div');
      el.id = 'debug';
      (document.getElementById('ui') || document.body).appendChild(el);
    }
  }
  function log(msg) {
    try {
      mount();
      if (!el) return;
      const line = document.createElement('div');
      line.textContent = '> ' + msg;
      el.appendChild(line);
      while (el.childNodes.length > 14) el.removeChild(el.firstChild);
    } catch (e) {}
  }
  window.addEventListener('error', (ev) =>
    log('JS ERROR: ' + (ev.message || ev.error) + ' @' + (ev.filename || '').split('/').pop() + ':' + ev.lineno));
  window.addEventListener('unhandledrejection', (ev) =>
    log('PROMISE REJECT: ' + ((ev.reason && ev.reason.message) || ev.reason)));
  document.addEventListener('DOMContentLoaded', () => { mount(); log('DOM ready'); });
  return { log: log };
})();
