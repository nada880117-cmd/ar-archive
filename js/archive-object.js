/* archive-object.js — 시대 유물 1개. 발광/회전/부유 + 근접·터치 시 '발견' */

AFRAME.registerComponent('archive-object', {
  schema: {
    era:   { type: 'string' },
    title: { type: 'string', default: '' },
    year:  { type: 'string', default: '' },
    color: { type: 'color',  default: '#2E86C1' }
  },

  init() {
    this.discovered = false;
    const el = this.el;
    const c = this.data.color;

    // 발광 본체 (회전)
    const core = document.createElement('a-entity');
    core.setAttribute('geometry', 'primitive: octahedron; radius: 0.18');
    core.setAttribute('material',
      `color: ${c}; emissive: ${c}; emissiveIntensity: 0.7; metalness: 0.2; roughness: 0.3`);
    core.setAttribute('animation__rot',
      'property: rotation; to: 0 360 0; loop: true; dur: 6000; easing: linear');
    el.appendChild(core);
    this.core = core;

    // 후광 링
    const ring = document.createElement('a-entity');
    ring.setAttribute('geometry', 'primitive: torus; radius: 0.32; radiusTubular: 0.012');
    ring.setAttribute('material',
      `color: ${c}; emissive: ${c}; emissiveIntensity: 0.5; opacity: 0.6; transparent: true`);
    ring.setAttribute('rotation', '90 0 0');
    ring.setAttribute('animation__spin',
      'property: rotation; to: 90 0 360; loop: true; dur: 9000; easing: linear');
    el.appendChild(ring);

    // 라벨 (카메라를 향하도록 매 프레임 빌보드)
    const label = document.createElement('a-text');
    label.setAttribute('value', this.data.title);
    label.setAttribute('align', 'center');
    label.setAttribute('color', '#ffffff');
    label.setAttribute('position', '0 0.42 0');
    label.setAttribute('scale', '0.7 0.7 0.7');
    label.setAttribute('side', 'double');
    el.appendChild(label);
    this.label = label;

    // 위아래 부유
    el.setAttribute('animation__bob',
      'property: position; from: 0 0 0; to: 0 0.12 0; dir: alternate; loop: true; dur: 2000; easing: easeInOutSine');

    // 직접 터치(레이캐스터/제스처)로도 발견 가능
    el.addEventListener('click', () => this.discover());

    this._camPos = new THREE.Vector3();
    this._objPos = new THREE.Vector3();
    this.tick = AFRAME.utils.throttleTick(this.tick, 100, this);
  },

  tick() {
    const cam = this.el.sceneEl.camera;
    if (!cam) return;

    cam.getWorldPosition(this._camPos);
    // 라벨 빌보드
    this.label.object3D.lookAt(this._camPos);

    if (this.discovered) return;

    this.el.object3D.getWorldPosition(this._objPos);
    const d = this._camPos.distanceTo(this._objPos);

    // 가까울수록 더 밝게 (피드백)
    if (d < 3) {
      const i = THREE.MathUtils.clamp(1.4 - d / 3, 0.4, 1.4);
      this.core.setAttribute('material', 'emissiveIntensity', i);
    }
    // 1m 이내 접근 → 자동 발견
    if (d < 0.9) this.discover();
  },

  discover() {
    if (this.discovered) return;
    this.discovered = true;

    this.core.setAttribute('material', 'color', '#FFD700');
    this.core.setAttribute('material', 'emissive', '#FFD700');
    this.core.setAttribute('animation__pop',
      'property: scale; from: 1 1 1; to: 1.8 1.8 1.8; dir: alternate; loop: 2; dur: 220; easing: easeOutBack');

    const d = this.el.eraData || this.data;
    window.UIOverlay && window.UIOverlay.showDiscovery(d);
    window.AppState && window.AppState.markDiscovered(d.id || d.title);
  }
});
