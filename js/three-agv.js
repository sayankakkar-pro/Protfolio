// Three.js Interactive 3D Autonomous AGV Vehicle Model & Exploded Blueprint Inspector
class AGV3DViewer {
  constructor(canvasContainerId, hudDetailId) {
    this.container = document.getElementById(canvasContainerId);
    this.hudDetail = document.getElementById(hudDetailId);
    if (!this.container || typeof THREE === 'undefined') return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.agvRoot = null;
    this.subsystems = {};
    this.isExploded = false;
    this.isWireframe = false;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();

    // Telemetry and Specs for each subsystem
    this.specsData = {
      lidar: {
        title: "360° RPLiDAR S2 Laser Scanner",
        category: "PERCEPTION & SLAM",
        details: "Range: 30m @ 90% reflectivity | Sample Rate: 32,000 pts/sec | Angular Resolution: 0.12° for real-time 2D/3D map generation.",
        rosTopic: "/scan (sensor_msgs/LaserScan)",
        status: "ONLINE (10 Hz SLAM Active)"
      },
      brain: {
        title: "NVIDIA Jetson Orin Nano / ROS 2 Brain",
        category: "COMPUTE & AI NAVIGATION",
        details: "40 TOPS AI Inference | Quad-Core ARM CPU | Custom Path Planning (Nav2, TEB Local Planner) with 14ms latency.",
        rosTopic: "/cmd_vel & /odom (nav_msgs/Odometry)",
        status: "ACTIVE (40 TOPS AI Core)"
      },
      chassis: {
        title: "Reinforced Monocoque Industrial Chassis",
        category: "STRUCTURAL & LOAD BEARING",
        details: "Payload Capacity: 150 kg | Material: 6061-T6 Aircraft Grade Aluminum & Carbon Fiber Base.",
        rosTopic: "/agv/load_cell (std_msgs/Float32)",
        status: "OPTIMAL (Tare: 24.2 kg)"
      },
      wheels: {
        title: "4x High-Torque BLDC Differential Drive",
        category: "PROPULSION & TRACTION",
        details: "Max Speed: 1.8 m/s | 250W Brushless Planetary Gearmotors with 4096-PPR Optical Encoders.",
        rosTopic: "/motor_controller/wheel_speeds",
        status: "SYNCHRONIZED (PID Closed-Loop)"
      },
      battery: {
        title: "24V 40Ah LiFePO4 Smart Power Unit",
        category: "ENERGY & BMS TELEMETRY",
        details: "Operational Time: 12 Hours continuous factory patrol | BMS CAN-Bus Telemetry & Quick-Swap Bays.",
        rosTopic: "/agv/battery_state (sensor_msgs/BatteryState)",
        status: "98.4% (25.6V Nominal)"
      },
      sensors: {
        title: "8x Ultrasonic Array + TOF Safety Mesh",
        category: "SAFETY & OBSTACLE AVOIDANCE",
        details: "Blind-spot proximity detection (2cm - 400cm) | Hard-wired SIL-2 Emergency Stop Loop.",
        rosTopic: "/safety/proximity_zones",
        status: "CLEAR (Zone 1: Safe)"
      }
    };

    this.init();
  }

  init() {
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x000000, 0.025);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(6.5, 4.5, 7.5);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Clear any previous canvas
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.container.appendChild(this.renderer.domElement);

    // Setup Orbit Controls
    this.setupControls();

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(6, 12, 8);
    mainLight.castShadow = true;
    this.scene.add(mainLight);

    const peachFill = new THREE.DirectionalLight(0xf2a98c, 2.5);
    peachFill.position.set(-6, 4, -5);
    this.scene.add(peachFill);

    const violetRim = new THREE.PointLight(0x8b5cf6, 4, 20);
    violetRim.position.set(0, 8, -6);
    this.scene.add(violetRim);

    // Floor Grid
    const gridHelper = new THREE.GridHelper(20, 30, 0xf2a98c, 0x1f2937);
    gridHelper.position.y = -1.2;
    this.scene.add(gridHelper);

    // Build the 3D AGV Robot
    this.buildAGVModel();

    // Interaction Listeners
    this.renderer.domElement.addEventListener('click', this.onClick.bind(this));

    // ResizeObserver for 100% reliable sizing
    if (window.ResizeObserver) {
      new ResizeObserver(() => this.onResize()).observe(this.container);
    }
    window.addEventListener('resize', this.onResize.bind(this));

    // Default HUD selection
    this.selectSubsystem('lidar');

    this.animate();
  }

  setupControls() {
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.targetRotation = { x: 0.28, y: 0.75 };
    this.currentRotation = { x: 0.28, y: 0.75 };
    this.zoom = 9.5;
    this.targetZoom = 9.5;

    const el = this.renderer.domElement;
    el.style.cursor = 'grab';

    el.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
      el.style.cursor = 'grabbing';
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.prevMouse.x;
      const dy = e.clientY - this.prevMouse.y;
      this.targetRotation.y += dx * 0.008;
      this.targetRotation.x += dy * 0.008;
      this.targetRotation.x = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, this.targetRotation.x));
      this.prevMouse.x = e.clientX;
      this.prevMouse.y = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
      el.style.cursor = 'grab';
    });

    el.addEventListener('wheel', (e) => {
      e.preventDefault();
      this.targetZoom += e.deltaY * 0.008;
      this.targetZoom = Math.max(4.5, Math.min(15, this.targetZoom));
    }, { passive: false });

    // Touch support
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.prevMouse.x = e.touches[0].clientX;
        this.prevMouse.y = e.touches[0].clientY;
      }
    });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.prevMouse.x;
      const dy = e.touches[0].clientY - this.prevMouse.y;
      this.targetRotation.y += dx * 0.008;
      this.targetRotation.x += dy * 0.008;
      this.targetRotation.x = Math.max(-Math.PI * 0.35, Math.min(Math.PI * 0.35, this.targetRotation.x));
      this.prevMouse.x = e.touches[0].clientX;
      this.prevMouse.y = e.touches[0].clientY;
    });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  buildAGVModel() {
    this.agvRoot = new THREE.Group();
    this.scene.add(this.agvRoot);

    const darkChassisMat = new THREE.MeshStandardMaterial({
      color: 0x141a29,
      roughness: 0.2,
      metalness: 0.9
    });

    const neonPeachMat = new THREE.MeshStandardMaterial({
      color: 0xf2a98c,
      emissive: 0xf2a98c,
      emissiveIntensity: 0.8,
      roughness: 0.1
    });

    const wheelRubberMat = new THREE.MeshStandardMaterial({
      color: 0x111317,
      roughness: 0.7,
      metalness: 0.3
    });

    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0xf2a98c,
      metalness: 0.9,
      roughness: 0.1
    });

    // 1. CHASSIS GROUP
    const chassisGroup = new THREE.Group();
    chassisGroup.userData = { id: 'chassis', defaultPos: new THREE.Vector3(0, 0, 0), explodePos: new THREE.Vector3(0, -0.4, 0) };

    const baseGeo = new THREE.BoxGeometry(3.6, 0.6, 2.4);
    const baseMesh = new THREE.Mesh(baseGeo, darkChassisMat);
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    chassisGroup.add(baseMesh);

    const bumperGeo = new THREE.BoxGeometry(3.8, 0.2, 2.6);
    const bumperMesh = new THREE.Mesh(bumperGeo, neonPeachMat);
    bumperMesh.position.y = -0.2;
    chassisGroup.add(bumperMesh);

    this.subsystems.chassis = chassisGroup;
    this.agvRoot.add(chassisGroup);

    // 2. COMPUTE BRAIN (Jetson & Electronics)
    const brainGroup = new THREE.Group();
    brainGroup.userData = { id: 'brain', defaultPos: new THREE.Vector3(0, 0.5, 0), explodePos: new THREE.Vector3(0, 1.4, 0) };

    const brainBoxGeo = new THREE.BoxGeometry(1.6, 0.4, 1.2);
    const brainBoxMat = new THREE.MeshStandardMaterial({ color: 0x221a38, metalness: 0.85, roughness: 0.2, emissive: 0x8b5cf6, emissiveIntensity: 0.3 });
    const brainMesh = new THREE.Mesh(brainBoxGeo, brainBoxMat);
    brainGroup.add(brainMesh);

    for (let f = -0.6; f <= 0.6; f += 0.2) {
      const finGeo = new THREE.BoxGeometry(0.04, 0.18, 1.0);
      const finMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x8b5cf6, emissiveIntensity: 0.9 });
      const fin = new THREE.Mesh(finGeo, finMat);
      fin.position.set(f, 0.28, 0);
      brainGroup.add(fin);
    }

    this.subsystems.brain = brainGroup;
    this.agvRoot.add(brainGroup);

    // 3. LIDAR TURRET
    const lidarGroup = new THREE.Group();
    lidarGroup.userData = { id: 'lidar', defaultPos: new THREE.Vector3(0.9, 0.9, 0), explodePos: new THREE.Vector3(1.8, 2.4, 0) };

    const mastGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.6, 16);
    const mastMesh = new THREE.Mesh(mastGeo, darkChassisMat);
    lidarGroup.add(mastMesh);

    const turretGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.4, 24);
    const turretMat = new THREE.MeshStandardMaterial({ color: 0x050b14, metalness: 0.95, roughness: 0.1, emissive: 0x00f0ff, emissiveIntensity: 0.4 });
    this.lidarTurret = new THREE.Mesh(turretGeo, turretMat);
    this.lidarTurret.position.y = 0.45;
    lidarGroup.add(this.lidarTurret);

    const laserConeGeo = new THREE.ConeGeometry(3.8, 0.06, 20, 1, true);
    const laserConeMat = new THREE.MeshBasicMaterial({ color: 0x00ff88, transparent: true, opacity: 0.35, side: THREE.DoubleSide });
    this.laserCone = new THREE.Mesh(laserConeGeo, laserConeMat);
    this.laserCone.rotation.x = Math.PI * 0.5;
    this.laserCone.position.y = 0.45;
    lidarGroup.add(this.laserCone);

    this.subsystems.lidar = lidarGroup;
    this.agvRoot.add(lidarGroup);

    // 4. WHEELS GROUP
    const wheelsGroup = new THREE.Group();
    wheelsGroup.userData = { id: 'wheels', defaultPos: new THREE.Vector3(0, 0, 0), explodePos: new THREE.Vector3(0, 0, 0) };

    this.wheelMeshes = [];
    const wheelPositions = [
      { x: 1.2, y: -0.35, z: 1.35, explode: new THREE.Vector3(0.9, -0.4, 1.5) },
      { x: -1.2, y: -0.35, z: 1.35, explode: new THREE.Vector3(-0.9, -0.4, 1.5) },
      { x: 1.2, y: -0.35, z: -1.35, explode: new THREE.Vector3(0.9, -0.4, -1.5) },
      { x: -1.2, y: -0.35, z: -1.35, explode: new THREE.Vector3(-0.9, -0.4, -1.5) }
    ];

    wheelPositions.forEach((pos) => {
      const singleWheelGroup = new THREE.Group();
      singleWheelGroup.position.set(pos.x, pos.y, pos.z);
      singleWheelGroup.userData = { defaultPos: new THREE.Vector3(pos.x, pos.y, pos.z), explodePos: pos.explode };

      const tireGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.35, 24);
      tireGeo.rotateX(Math.PI * 0.5);
      const tire = new THREE.Mesh(tireGeo, wheelRubberMat);
      tire.castShadow = true;
      singleWheelGroup.add(tire);

      const rimGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.37, 16);
      rimGeo.rotateX(Math.PI * 0.5);
      const rim = new THREE.Mesh(rimGeo, wheelRimMat);
      singleWheelGroup.add(rim);

      wheelsGroup.add(singleWheelGroup);
      this.wheelMeshes.push(singleWheelGroup);
    });

    this.subsystems.wheels = wheelsGroup;
    this.agvRoot.add(wheelsGroup);

    // 5. BATTERY POWER UNIT
    const batteryGroup = new THREE.Group();
    batteryGroup.userData = { id: 'battery', defaultPos: new THREE.Vector3(-0.8, 0.45, 0), explodePos: new THREE.Vector3(-1.9, 1.5, 0) };

    const batGeo = new THREE.BoxGeometry(1.3, 0.4, 1.7);
    const batMat = new THREE.MeshStandardMaterial({ color: 0x06331a, emissive: 0x10b981, emissiveIntensity: 0.4, metalness: 0.85, roughness: 0.2 });
    const batMesh = new THREE.Mesh(batGeo, batMat);
    batteryGroup.add(batMesh);

    this.subsystems.battery = batteryGroup;
    this.agvRoot.add(batteryGroup);

    // 6. SENSORS & SAFETY BEACONS
    const sensorsGroup = new THREE.Group();
    sensorsGroup.userData = { id: 'sensors', defaultPos: new THREE.Vector3(0, 0, 0), explodePos: new THREE.Vector3(0, 0.9, 0) };

    [-0.8, 0, 0.8].forEach(xOffset => {
      const sonicGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12);
      sonicGeo.rotateZ(Math.PI * 0.5);
      const sonicMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.95 });
      const sonic = new THREE.Mesh(sonicGeo, sonicMat);
      sonic.position.set(1.85, -0.1, xOffset);
      sensorsGroup.add(sonic);
    });

    const estopBaseGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.09, 16);
    const estopBaseMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.7 });
    const estopBase = new THREE.Mesh(estopBaseGeo, estopBaseMat);
    estopBase.position.set(-1.4, 0.35, 0.7);
    sensorsGroup.add(estopBase);

    const estopBtnGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 16);
    const estopBtnMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xef4444, emissiveIntensity: 0.7 });
    const estopBtn = new THREE.Mesh(estopBtnGeo, estopBtnMat);
    estopBtn.position.set(-1.4, 0.44, 0.7);
    sensorsGroup.add(estopBtn);

    this.subsystems.sensors = sensorsGroup;
    this.agvRoot.add(sensorsGroup);
  }

  toggleExplode() {
    this.isExploded = !this.isExploded;
    if (window.soundFX) window.soundFX.playClick();
    return this.isExploded;
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    this.agvRoot.traverse(node => {
      if (node.isMesh && node.material) {
        node.material.wireframe = this.isWireframe;
      }
    });
    if (window.soundFX) window.soundFX.playClick();
    return this.isWireframe;
  }

  onClick(e) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.agvRoot.children, true);

    if (intersects.length > 0) {
      let curr = intersects[0].object;
      while (curr && curr.parent && curr.parent !== this.agvRoot && curr.parent !== this.scene) {
        if (curr.userData && curr.userData.id) break;
        curr = curr.parent;
      }

      if (curr && curr.userData && curr.userData.id) {
        this.selectSubsystem(curr.userData.id);
        if (window.soundFX) window.soundFX.playHover();
      }
    }
  }

  selectSubsystem(subsystemKey) {
    const data = this.specsData[subsystemKey];
    if (!data || !this.hudDetail) return;

    this.hudDetail.innerHTML = `
      <div class="hud-tag">${data.category}</div>
      <h3 class="hud-title">${data.title}</h3>
      <p class="hud-desc">${data.details}</p>
      <div class="hud-meta">
        <div class="hud-meta-row">
          <span class="hud-lbl">ROS 2 TOPIC:</span>
          <span class="hud-val text-peach">${data.rosTopic}</span>
        </div>
        <div class="hud-meta-row">
          <span class="hud-lbl">SUBSYSTEM STATUS:</span>
          <span class="hud-val text-emerald"><span class="hud-dot"></span>${data.status}</span>
        </div>
      </div>
    `;

    document.querySelectorAll('.subsystem-btn').forEach(btn => {
      if (btn.dataset.subsystem === subsystemKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  onResize() {
    if (!this.container || !this.renderer || !this.camera) return;
    const width = this.container.clientWidth || 600;
    const height = this.container.clientHeight || 450;
    if (width === 0 || height === 0) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = this.clock.getElapsedTime();

    this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.08;
    this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.08;
    this.zoom += (this.targetZoom - this.zoom) * 0.08;

    this.camera.position.x = this.zoom * Math.sin(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    this.camera.position.y = this.zoom * Math.sin(this.currentRotation.x);
    this.camera.position.z = this.zoom * Math.cos(this.currentRotation.y) * Math.cos(this.currentRotation.x);
    this.camera.lookAt(0, 0, 0);

    Object.keys(this.subsystems).forEach(key => {
      const sys = this.subsystems[key];
      if (key === 'wheels') {
        this.wheelMeshes.forEach(w => {
          const target = this.isExploded ? w.userData.explodePos : w.userData.defaultPos;
          w.position.lerp(target, 0.08);
          w.children.forEach(c => { c.rotation.z += 0.035; });
        });
      } else if (sys && sys.userData) {
        const target = this.isExploded ? sys.userData.explodePos : sys.userData.defaultPos;
        sys.position.lerp(target, 0.08);
      }
    });

    if (this.lidarTurret) {
      this.lidarTurret.rotation.y = time * 8.5;
    }
    if (this.laserCone) {
      this.laserCone.rotation.z = time * 8.5;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.AGV3DViewer = AGV3DViewer;
