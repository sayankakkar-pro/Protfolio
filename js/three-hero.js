// Three.js Hero 3D Kinetic Sculpture - SLY Chromatic Masterpiece
class Hero3DScene {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rootGroup = null;
    this.torusKnot = null;
    this.outerRing1 = null;
    this.outerRing2 = null;
    this.innerCore = null;
    this.particles = null;
    this.floatingNodes = [];
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 };
    this.wireframeMode = false;
    this.clock = new THREE.Clock();

    // SLY Signature Chromatic Flow Spectrum: Peach -> Cyan -> Violet -> Gold -> Peach
    this.colorCycle = [
      new THREE.Color(0xf2a98c), // SLY Peach
      new THREE.Color(0x00f0ff), // Electric Cyan
      new THREE.Color(0x8b5cf6), // Cyber Violet
      new THREE.Color(0xfacc15), // Luminous Gold
      new THREE.Color(0x10b981)  // Emerald
    ];

    this.currentColor = new THREE.Color(0xf2a98c);

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 580;
    const height = this.container.clientHeight || 580;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.z = 13.5;

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);

    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // Studio Lighting
    this.ambLight = new THREE.AmbientLight(0xffffff, 1.5);
    this.scene.add(this.ambLight);

    this.mainLight = new THREE.DirectionalLight(0xffffff, 3.8);
    this.mainLight.position.set(8, 12, 10);
    this.scene.add(this.mainLight);

    this.dynamicLight1 = new THREE.PointLight(0xf2a98c, 8, 30);
    this.dynamicLight1.position.set(6, 6, 8);
    this.scene.add(this.dynamicLight1);

    this.dynamicLight2 = new THREE.PointLight(0x00f0ff, 6, 25);
    this.dynamicLight2.position.set(-6, -6, 6);
    this.scene.add(this.dynamicLight2);

    this.rimLight = new THREE.PointLight(0x8b5cf6, 5, 20);
    this.rimLight.position.set(0, -8, -5);
    this.scene.add(this.rimLight);

    // Root Hierarchy
    this.rootGroup = new THREE.Group();
    this.scene.add(this.rootGroup);

    // 1. Kinetic Titanium Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(2.6, 0.44, 220, 36, 2, 3);
    this.knotMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0xf2a98c,
      emissiveIntensity: 0.5,
      wireframe: false
    });
    this.torusKnot = new THREE.Mesh(knotGeo, this.knotMat);
    this.rootGroup.add(this.torusKnot);

    // 2. Inner Glowing Hologram Core
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 2);
    this.coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    this.innerCore = new THREE.Mesh(coreGeo, this.coreMat);
    this.rootGroup.add(this.innerCore);

    // 3. Gyro Outer Ring 1
    const ringGeo1 = new THREE.TorusGeometry(4.6, 0.045, 16, 140);
    this.ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf2a98c,
      emissive: 0xf2a98c,
      emissiveIntensity: 0.9,
      roughness: 0.1,
      metalness: 0.9
    });
    this.outerRing1 = new THREE.Mesh(ringGeo1, this.ringMat1);
    this.outerRing1.rotation.x = Math.PI * 0.35;
    this.rootGroup.add(this.outerRing1);

    // 4. Counter-Rotating Precision Ring 2
    const ringGeo2 = new THREE.TorusGeometry(5.5, 0.03, 16, 140);
    this.ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.2
    });
    this.outerRing2 = new THREE.Mesh(ringGeo2, this.ringMat2);
    this.outerRing2.rotation.y = Math.PI * 0.45;
    this.rootGroup.add(this.outerRing2);

    // 5. Floating Quantum Nodes
    const nodeGeo = new THREE.SphereGeometry(0.09, 12, 12);
    for (let n = 0; n < 14; n++) {
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xf2a98c });
      const node = new THREE.Mesh(nodeGeo, nodeMat);
      const angle = (n / 14) * Math.PI * 2;
      node.position.set(Math.cos(angle) * 4.6, Math.sin(angle) * 4.6, (Math.random() - 0.5) * 1.5);
      this.floatingNodes.push({ mesh: node, mat: nodeMat, angle: angle, speed: 0.01 + Math.random() * 0.012 });
      this.rootGroup.add(node);
    }

    // 6. Luminous Particle Galaxy
    const count = 1400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(count * 3);
    const pColors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 3.6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = radius * Math.cos(phi);

      pColors[i * 3] = 0.95;
      pColors[i * 3 + 1] = 0.7;
      pColors[i * 3 + 2] = 0.55;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    this.particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(pGeo, this.particleMat);
    this.scene.add(this.particles);

    // Setup Drag Controls
    this.setupInteractivity();

    // Use ResizeObserver for reliable sizing
    if (window.ResizeObserver) {
      new ResizeObserver(() => this.onResize()).observe(this.container);
    }
    window.addEventListener('resize', this.onResize.bind(this));

    this.animate();
  }

  setupInteractivity() {
    const el = this.renderer.domElement;
    el.style.cursor = 'grab';

    el.addEventListener('mousedown', (e) => {
      this.mouse.isDragging = true;
      this.mouse.prevX = e.clientX;
      this.mouse.prevY = e.clientY;
      el.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = x * 2.0;
      this.mouse.targetY = y * 2.0;

      if (this.mouse.isDragging) {
        const dx = e.clientX - this.mouse.prevX;
        const dy = e.clientY - this.mouse.prevY;
        if (this.rootGroup) {
          this.rootGroup.rotation.y += dx * 0.01;
          this.rootGroup.rotation.x += dy * 0.01;
        }
        this.mouse.prevX = e.clientX;
        this.mouse.prevY = e.clientY;
      }
    });

    window.addEventListener('mouseup', () => {
      this.mouse.isDragging = false;
      el.style.cursor = 'grab';
    });

    // Touch support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.mouse.isDragging = true;
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (this.mouse.isDragging && e.touches.length === 1) {
        const dx = e.touches[0].clientX - this.mouse.prevX;
        const dy = e.touches[0].clientY - this.mouse.prevY;
        if (this.rootGroup) {
          this.rootGroup.rotation.y += dx * 0.01;
          this.rootGroup.rotation.x += dy * 0.01;
        }
        this.mouse.prevX = e.touches[0].clientX;
        this.mouse.prevY = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchend', () => {
      this.mouse.isDragging = false;
    });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 580;
    const height = this.container.clientHeight || 580;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  toggleWireframe() {
    this.wireframeMode = !this.wireframeMode;
    if (this.torusKnot) {
      this.torusKnot.material.wireframe = this.wireframeMode;
    }
    return this.wireframeMode;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    // SLY Chromatic Flow
    const colorPeriod = 8.0;
    const cyclePos = (time % colorPeriod) / colorPeriod;
    const idx = Math.floor(cyclePos * this.colorCycle.length);
    const nextIdx = (idx + 1) % this.colorCycle.length;
    const alpha = (cyclePos * this.colorCycle.length) - idx;

    this.currentColor.lerpColors(this.colorCycle[idx], this.colorCycle[nextIdx], alpha);

    if (this.knotMat) {
      this.knotMat.emissive.copy(this.currentColor);
      this.knotMat.emissiveIntensity = 0.4 + Math.sin(time * 2) * 0.15;
    }

    if (this.ringMat1) {
      this.ringMat1.emissive.copy(this.currentColor);
    }

    if (this.dynamicLight1) {
      this.dynamicLight1.color.copy(this.currentColor);
    }

    // Smooth Cursor Parallax
    if (!this.mouse.isDragging) {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

      if (this.rootGroup) {
        this.rootGroup.rotation.y = time * 0.28 + this.mouse.x * 0.9;
        this.rootGroup.rotation.x = Math.sin(time * 0.18) * 0.25 - this.mouse.y * 0.7;
        this.rootGroup.position.y = Math.sin(time * 0.8) * 0.25;
      }
    }

    if (this.torusKnot) {
      this.torusKnot.rotation.z = time * 0.15;
    }

    if (this.innerCore) {
      this.innerCore.rotation.x = time * -0.4;
      this.innerCore.rotation.y = time * 0.5;
    }

    if (this.outerRing1) {
      this.outerRing1.rotation.z += 0.01;
      this.outerRing1.rotation.y += 0.006;
    }

    if (this.outerRing2) {
      this.outerRing2.rotation.x += 0.007;
      this.outerRing2.rotation.z -= 0.008;
    }

    // Floating Nodes
    this.floatingNodes.forEach(node => {
      node.angle += node.speed;
      node.mesh.position.x = Math.cos(node.angle) * 4.6;
      node.mesh.position.y = Math.sin(node.angle) * 4.6;
      node.mat.color.copy(this.currentColor);
      node.mesh.scale.setScalar(1 + Math.sin(time * 3 + node.angle) * 0.3);
    });

    if (this.particles) {
      this.particles.rotation.y = time * 0.04 + this.mouse.x * 0.18;
      this.particles.rotation.x = time * 0.02 - this.mouse.y * 0.09;
    }

    this.camera.position.x = this.mouse.x * 1.6;
    this.camera.position.y = this.mouse.y * 1.1;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }
}

window.Hero3DScene = Hero3DScene;
