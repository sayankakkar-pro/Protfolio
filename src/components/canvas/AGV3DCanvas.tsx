'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFX } from '@/lib/audio';
import { SubsystemDetail } from '@/lib/types';

interface AGV3DCanvasProps {
  onSelectSubsystem?: (subsystem: string) => void;
  activeSubsystem?: string;
}

export default function AGV3DCanvas({ onSelectSubsystem }: AGV3DCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [exploded, setExploded] = useState(false);
  const [wireframe, setWireframe] = useState(false);

  const materialsRef = useRef<THREE.Material[]>([]);
  const partsRef = useRef<{
    chassis?: THREE.Mesh;
    lidar?: THREE.Mesh;
    power?: THREE.Mesh;
    jetson?: THREE.Mesh;
    wheels?: THREE.Group;
  }>({});

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 550;
    const height = container.clientHeight || 450;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.03);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(7, 5, 8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.2);
    mainLight.position.set(5, 10, 8);
    scene.add(mainLight);

    const peachLight = new THREE.PointLight(0xf2a98c, 6, 20);
    peachLight.position.set(4, 3, 4);
    scene.add(peachLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 5, 20);
    cyanLight.position.set(-4, -2, -4);
    scene.add(cyanLight);

    const agvRoot = new THREE.Group();
    scene.add(agvRoot);

    // 1. Chassis
    const chassisGeo = new THREE.BoxGeometry(3.6, 0.7, 2.2);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x181822,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x0a0c16,
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    chassis.position.y = 0.55;
    agvRoot.add(chassis);
    partsRef.current.chassis = chassis;
    materialsRef.current.push(chassisMat);

    // Power Strip
    const stripGeo = new THREE.BoxGeometry(3.65, 0.08, 0.08);
    const stripMat = new THREE.MeshStandardMaterial({
      color: 0xf2a98c,
      emissive: 0xf2a98c,
      emissiveIntensity: 1.2,
    });
    const strip1 = new THREE.Mesh(stripGeo, stripMat);
    strip1.position.set(0, 0.55, 1.11);
    agvRoot.add(strip1);

    // 2. Jetson Computer Unit
    const jetsonGeo = new THREE.BoxGeometry(1.2, 0.35, 1.0);
    const jetsonMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.6,
      metalness: 0.8,
    });
    const jetson = new THREE.Mesh(jetsonGeo, jetsonMat);
    jetson.position.set(0.6, 1.05, 0);
    agvRoot.add(jetson);
    partsRef.current.jetson = jetson;
    materialsRef.current.push(jetsonMat);

    // 3. 360 LiDAR Tower
    const lidarBaseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.5, 24);
    const lidarMat = new THREE.MeshStandardMaterial({ color: 0x22222a, metalness: 0.9, roughness: 0.1 });
    const lidarBase = new THREE.Mesh(lidarBaseGeo, lidarMat);
    lidarBase.position.set(-0.8, 1.15, 0);
    agvRoot.add(lidarBase);
    partsRef.current.lidar = lidarBase;
    materialsRef.current.push(lidarMat);

    // LiDAR Laser Scanning Cone
    const laserConeGeo = new THREE.ConeGeometry(2.8, 0.06, 32, 1, true);
    const laserConeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const laserCone = new THREE.Mesh(laserConeGeo, laserConeMat);
    laserCone.rotation.z = Math.PI / 2;
    laserCone.position.set(0, 0.3, 0);
    lidarBase.add(laserCone);

    // 4. Wheels Group
    const wheelsGroup = new THREE.Group();
    const wheelGeo = new THREE.CylinderGeometry(0.48, 0.48, 0.3, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0f, roughness: 0.7 });
    materialsRef.current.push(wheelMat);

    const positions = [
      [-1.2, 0.48, 1.2],
      [1.2, 0.48, 1.2],
      [-1.2, 0.48, -1.2],
      [1.2, 0.48, -1.2],
    ];

    positions.forEach((pos) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat);
      w.rotation.x = Math.PI / 2;
      w.position.set(pos[0], pos[1], pos[2]);
      wheelsGroup.add(w);
    });
    agvRoot.add(wheelsGroup);
    partsRef.current.wheels = wheelsGroup;

    // Mouse Drag Orbit
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;
    const el = renderer.domElement;
    el.style.cursor = 'grab';

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - prevX;
        const dy = e.clientY - prevY;
        agvRoot.rotation.y += dx * 0.01;
        agvRoot.rotation.x += dy * 0.01;
        prevX = e.clientX;
        prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    const clock = new THREE.Clock();
    let reqId: number;

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      laserCone.rotation.y = time * 8.0;

      if (!isDragging) {
        agvRoot.rotation.y = time * 0.2;
      }

      wheelsGroup.children.forEach((w) => {
        w.rotation.y = time * 3.0;
      });

      camera.lookAt(0, 0.6, 0);
      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 550;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(reqId);
      resizeObserver.disconnect();
      el.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, []);

  const toggleExplodeMode = () => {
    const next = !exploded;
    setExploded(next);
    soundFX?.playClick();

    if (partsRef.current.lidar) {
      partsRef.current.lidar.position.y = next ? 2.4 : 1.15;
    }
    if (partsRef.current.jetson) {
      partsRef.current.jetson.position.y = next ? 1.8 : 1.05;
      partsRef.current.jetson.position.x = next ? 1.2 : 0.6;
    }
    if (partsRef.current.chassis) {
      partsRef.current.chassis.position.y = next ? 0.3 : 0.55;
    }
  };

  const toggleWireframeMode = () => {
    const next = !wireframe;
    setWireframe(next);
    soundFX?.playClick();
    materialsRef.current.forEach((m) => {
      (m as THREE.MeshStandardMaterial).wireframe = next;
    });
  };

  return (
    <div className="relative w-full h-full min-h-[420px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
      {/* HUD Control Actions */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <span className="hud-pill">
          <span className="hud-dot emerald" />
          <span>ROS 2 TELEMETRY: ACTIVE</span>
        </span>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex flex-wrap items-center gap-2">
        <button
          onClick={toggleExplodeMode}
          className="text-[11px] font-mono px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:border-[#f2a98c] backdrop-blur-md transition-colors"
        >
          {exploded ? 'COLLAPSE MODEL' : 'EXPLODE BLUEPRINT'}
        </button>
        <button
          onClick={toggleWireframeMode}
          className="text-[11px] font-mono px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:border-[#f2a98c] backdrop-blur-md transition-colors"
        >
          {wireframe ? 'SOLID SHADER' : 'TOGGLE X-RAY'}
        </button>
      </div>
    </div>
  );
}
