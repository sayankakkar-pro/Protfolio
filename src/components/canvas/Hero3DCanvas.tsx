'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { soundFX } from '@/lib/audio';

export default function Hero3DCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [wireframe, setWireframe] = useState(false);
  const knotMatRef = useRef<THREE.MeshStandardMaterial | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 550;
    const height = container.clientHeight || 550;

    // Scene & Fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.02);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 13.5;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 3.5);
    mainLight.position.set(8, 12, 10);
    scene.add(mainLight);

    const pointLight1 = new THREE.PointLight(0xf2a98c, 8, 30);
    pointLight1.position.set(6, 6, 8);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x00f0ff, 6, 25);
    pointLight2.position.set(-6, -6, 6);
    scene.add(pointLight2);

    // Root Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // 1. Titanium Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(2.6, 0.44, 220, 36, 2, 3);
    const knotMat = new THREE.MeshStandardMaterial({
      color: 0x14161f,
      roughness: 0.1,
      metalness: 0.95,
      emissive: 0xf2a98c,
      emissiveIntensity: 0.5,
      wireframe: false,
    });
    knotMatRef.current = knotMat;
    const torusKnot = new THREE.Mesh(knotGeo, knotMat);
    rootGroup.add(torusKnot);

    // 2. Glowing Core
    const coreGeo = new THREE.IcosahedronGeometry(1.3, 2);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.9,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const innerCore = new THREE.Mesh(coreGeo, coreMat);
    rootGroup.add(innerCore);

    // 3. Gyro Rings
    const ringGeo1 = new THREE.TorusGeometry(4.6, 0.045, 16, 140);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xf2a98c,
      emissive: 0xf2a98c,
      emissiveIntensity: 0.9,
    });
    const outerRing1 = new THREE.Mesh(ringGeo1, ringMat1);
    outerRing1.rotation.x = Math.PI * 0.35;
    rootGroup.add(outerRing1);

    const ringGeo2 = new THREE.TorusGeometry(5.5, 0.03, 16, 140);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
    });
    const outerRing2 = new THREE.Mesh(ringGeo2, ringMat2);
    outerRing2.rotation.y = Math.PI * 0.45;
    rootGroup.add(outerRing2);

    // 4. Luminous Starfield Particles
    const pCount = 1400;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const r = 3.6 + Math.random() * 18;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);

      pColors[i * 3] = 0.95;
      pColors[i * 3 + 1] = 0.7;
      pColors[i * 3 + 2] = 0.55;
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Mouse Tracking
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, isDragging: false, prevX: 0, prevY: 0 };
    const el = renderer.domElement;
    el.style.cursor = 'grab';

    const onMouseDown = (e: MouseEvent) => {
      mouse.isDragging = true;
      mouse.prevX = e.clientX;
      mouse.prevY = e.clientY;
      el.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mouse.targetX = x * 2.0;
      mouse.targetY = y * 2.0;

      if (mouse.isDragging) {
        const dx = e.clientX - mouse.prevX;
        const dy = e.clientY - mouse.prevY;
        rootGroup.rotation.y += dx * 0.01;
        rootGroup.rotation.x += dy * 0.01;
        mouse.prevX = e.clientX;
        mouse.prevY = e.clientY;
      }
    };

    const onMouseUp = () => {
      mouse.isDragging = false;
      el.style.cursor = 'grab';
    };

    el.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // SLY Chromatic Palette
    const colorCycle = [
      new THREE.Color(0xf2a98c), // Peach
      new THREE.Color(0x00f0ff), // Cyan
      new THREE.Color(0x8b5cf6), // Violet
      new THREE.Color(0xfacc15), // Gold
    ];
    const currentColor = new THREE.Color(0xf2a98c);
    const clock = new THREE.Clock();

    let reqId: number;
    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      // SLY Color Interpolation
      const period = 8.0;
      const cyclePos = (time % period) / period;
      const idx = Math.floor(cyclePos * colorCycle.length);
      const nextIdx = (idx + 1) % colorCycle.length;
      const alpha = cyclePos * colorCycle.length - idx;

      currentColor.lerpColors(colorCycle[idx], colorCycle[nextIdx], alpha);

      knotMat.emissive.copy(currentColor);
      ringMat1.emissive.copy(currentColor);
      pointLight1.color.copy(currentColor);

      if (!mouse.isDragging) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
        rootGroup.rotation.y = time * 0.28 + mouse.x * 0.9;
        rootGroup.rotation.x = Math.sin(time * 0.18) * 0.25 - mouse.y * 0.7;
        rootGroup.position.y = Math.sin(time * 0.8) * 0.25;
      }

      torusKnot.rotation.z = time * 0.15;
      innerCore.rotation.x = time * -0.4;
      outerRing1.rotation.z += 0.01;
      outerRing2.rotation.x += 0.007;

      particles.rotation.y = time * 0.04 + mouse.x * 0.18;

      camera.position.x = mouse.x * 1.6;
      camera.position.y = mouse.y * 1.1;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };
    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const w = container.clientWidth || 550;
      const h = container.clientHeight || 550;
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

  const toggleWireframeMode = () => {
    if (knotMatRef.current) {
      const next = !wireframe;
      knotMatRef.current.wireframe = next;
      setWireframe(next);
      soundFX?.playClick();
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[580px] flex items-center justify-center">
      <div ref={containerRef} className="w-full h-full" />
      {/* Interactive Controls Overlay */}
      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-3">
        <button
          onClick={toggleWireframeMode}
          className="text-[11px] font-mono px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 hover:text-white hover:border-[#f2a98c] backdrop-blur-md transition-colors"
        >
          {wireframe ? 'SOLID SHADER' : 'WIREFRAME'}
        </button>
        <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest hidden sm:inline">
          DRAG TO ORBIT
        </span>
      </div>
    </div>
  );
}
