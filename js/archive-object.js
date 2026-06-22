/* archive-object.js — 시대 유물. 발광/회전/부유 + 탭(조준) 또는 근접 시 발견.
   한 번 발견해도 다시 탭하면 내용 재열람 가능. */

window._artifacts = window._artifacts || [];

AFRAME.registerComponent('archive-object', {
  schema: {
    title: { type: 'string', default: '' },
    year:  { type: 'string', default: '' },
    color: { type: 'color',  default: '#2E86C1' }
  },

  init() {
    this.discovered = false;
    const el = this.el;
    const c = this.data.color;

    const core = document.createElement('a-entity');
    core.setAttribute('geometry', 'primitive: octahedron; radius: 0.18');
    core.setAttribute('material',
      `color: ${c}; emissive: ${c}; emissiveIntensity: 0.7; metalness: 0.2; roughness: 0.3`);
    core.setAttribute('animation__rot',
      'property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear');
    el.appendChild(core);
    this.core = core;

    const ring = document.createElement('a-entity');
    ring.setAttribute('geometry', 'primitive: torus; radius: 0.32; radiusTubular: 0.012');
    ring.setAttribute('material',
      `color: ${c}; emissive: ${c}; emissiveIntensity: 0.5; opacity: 0.6; transparent: true`);
    ring.setAttribute('rotation', '90 0 0');
    ring.setAttribute('animation__spin',
      'property: rotation; to: 90 0 360; loop: true; dur: 9000; easing: linear');
    el.appendChild(ring);

    const label = document.createElement('a-text');
    label.setAttribute('value', this.data.title);
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#ffffff');
    label.setAttribute('position', '0 0.42 0');
    label.setAttribute('scale', '0.7 0.7 0.7');
    label.setAttribute('side', 'double');
    el.appendChild(label);
    this.label = label;

    el.setAttribute('animation__bob',
      'property: position; from: 0 0 0; to: 0 0.12 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine');

    el.addEventListener('click', () => this.open());

    this._camPos = new THREE.Vector3();
    this._objPos = new THREE.Vector3();
    this.tick = AFRAME.utils.throttleTick(this.tick, 120, this);

    window._artifacts.push(this);

    // 이미 발견된 시대면 발견 상태로 표시 (새로고침 후 진행 유지)
    const id = this.eraId();
    if (id && window.AppState && window.AppState.has(id)) this.markFound(false);
  },

  remove() {
    const i = window._artifacts.indexOf(this);
    if (i >= 0) window._artifacts.splice(i, 1);
  },

  eraId() {
    const d = this.el.eraData || this.data;
    return d.id || d.title;
  },

  worldPos(out) { this.el.object3D.getWorldPosition(out); return out; },

  tick() {
    const cam = this.el.sceneEl.camera;
    if (!cam) return;
    cam.getWorldPosition(this._camPos);
    this.label.object3D.lookAt(this._camPos);

    if (this.discovered) return;
    this.worldPos(this._objPos);
    const d = this._camPos.distanceTo(this._objPos);
    if (d < 3) {
      const i = THREE.MathUtils.clamp(1.4 - d / 3, 0.4, 1.4);
      this.core.setAttribute('material', 'emissiveIntensity', i);
    }
    if (d < 1.1) this.open(); // 가까이 가면 자동 발견
  },

  // 팝업 열기 (탭/근접 공통). 처음이면 발견 처리, 이후엔 재열람.
  open() {
    const d = this.el.eraData || this.data;
    if (!this.discovered) this.markFound(true);
    window.UIOverlay && window.UIOverlay.showDiscovery(d);
  },

  markFound(countUp) {
    this.discovered = true;
    this.core.setAttribute('material', 'color', '#FFD700');
    this.core.setAttribute('material', 'emissive', '#FFD700');
    if (countUp) {
      this.core.setAttribute('animation__pop',
        'property: scale; from: 1 1 1; to: 1.8 1.8 1.8; dir: alternate; loop: 2; dur: 220; easing: easeOutBack');
      window.AppState && window.AppState.markDiscovered(this.eraId());
    }
  },

  // "다시 시작" 시 원상 복귀
  resetState() {
    this.discovered = false;
    this.core.setAttribute('material', 'color', this.data.color);
    this.core.setAttribute('material', 'emissive', this.data.color);
  }
});
