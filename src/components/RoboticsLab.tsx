'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sliders, Radio, RotateCcw } from 'lucide-react';
import { soundFX } from '@/lib/audio';

export default function RoboticsLab() {
  // PID States
  const [kp, setKp] = useState(1.4);
  const [ki, setKi] = useState(0.06);
  const [kd, setKd] = useState(0.55);

  const pidCanvasRef = useRef<HTMLCanvasElement>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement>(null);

  // 1. PID Canvas Simulator Loop
  useEffect(() => {
    const canvas = pidCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let pos = 0;
    let vel = 0;
    let integral = 0;
    let prevErr = 0;
    const target = 1.0;
    const history: number[] = [];

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const renderPID = () => {
      animId = requestAnimationFrame(renderPID);

      const err = target - pos;
      integral += err * 0.03;
      integral = Math.max(-2, Math.min(2, integral));
      const derivative = (err - prevErr) / 0.03;
      prevErr = err;

      const output = kp * err + ki * integral + kd * derivative;
      vel += (output - vel * 0.15) * 0.03;
      pos += vel * 0.03;

      history.push(pos);
      if (history.length > 240) history.shift();

      const w = rect.width;
      const h = 200;

      ctx.clearRect(0, 0, w, h);

      // Draw Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let y = 30; y < h; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Target Line
      const targetY = h / 2 - 20;
      ctx.strokeStyle = 'rgba(242, 169, 140, 0.4)';
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, targetY);
      ctx.lineTo(w, targetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Trajectory
      if (history.length > 1) {
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        ctx.beginPath();

        history.forEach((val, i) => {
          const x = (i / 240) * w;
          const y = h / 2 + 30 - val * 50;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        });
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };

    renderPID();

    return () => cancelAnimationFrame(animId);
  }, [kp, ki, kd]);

  // 2. 2D LiDAR Radar Canvas Loop
  useEffect(() => {
    const canvas = radarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = 200 * dpr;
    ctx.scale(dpr, dpr);

    const obstacles = [
      { x: 0.6, y: 0.3 },
      { x: -0.5, y: -0.4 },
      { x: 0.2, y: -0.7 },
    ];

    const renderRadar = () => {
      animId = requestAnimationFrame(renderRadar);
      angle += 0.04;

      const w = rect.width;
      const h = 200;
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(cx, cy) - 15;

      ctx.clearRect(0, 0, w, h);

      // Radar Concentric Rings
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.lineWidth = 1;
      [0.33, 0.66, 1.0].forEach((ratio) => {
        ctx.beginPath();
        ctx.arc(cx, cy, r * ratio, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Sweep Beam
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r);
      ctx.stroke();

      // Obstacles
      obstacles.forEach((obs) => {
        const ox = cx + obs.x * r;
        const oy = cy + obs.y * r;
        ctx.fillStyle = '#f2a98c';
        ctx.shadowColor = '#f2a98c';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(ox, oy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };

    renderRadar();

    return () => cancelAnimationFrame(animId);
  }, []);

  const resetPID = () => {
    setKp(1.4);
    setKi(0.06);
    setKd(0.55);
    soundFX?.playClick();
  };

  return (
    <section id="lab" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="hud-pill mb-4">
            <span className="hud-dot" />
            <span>INTERACTIVE EXPERIMENTATION</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
            Robotics Sandbox <br />
            <span className="text-[#00f0ff]">Real-Time Control Labs</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Lab 1: PID Controller */}
          <div className="sly-card p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sliders size={20} className="text-[#00f0ff]" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  PID Trajectory Tuner
                </h3>
              </div>
              <button
                onClick={resetPID}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                title="Reset Gains"
              >
                <RotateCcw size={14} />
              </button>
            </div>

            <div className="w-full h-[200px] bg-black/40 rounded-2xl border border-white/10 overflow-hidden">
              <canvas ref={pidCanvasRef} className="w-full h-full" />
            </div>

            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Kp (Proportional Gain)</span>
                  <span className="text-[#00f0ff]">{kp.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="4.0"
                  step="0.05"
                  value={kp}
                  onChange={(e) => setKp(parseFloat(e.target.value))}
                  className="w-full accent-[#00f0ff]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Ki (Integral Gain)</span>
                  <span className="text-[#f2a98c]">{ki.toFixed(3)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="0.2"
                  step="0.005"
                  value={ki}
                  onChange={(e) => setKi(parseFloat(e.target.value))}
                  className="w-full accent-[#f2a98c]"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white/60">Kd (Derivative Gain)</span>
                  <span className="text-[#8b5cf6]">{kd.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="2.0"
                  step="0.05"
                  value={kd}
                  onChange={(e) => setKd(parseFloat(e.target.value))}
                  className="w-full accent-[#8b5cf6]"
                />
              </div>
            </div>
          </div>

          {/* Lab 2: 2D LiDAR Radar */}
          <div className="sly-card p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Radio size={20} className="text-[#10b981]" />
              <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                2D RPLiDAR Radar Sweep
              </h3>
            </div>

            <div className="w-full h-[200px] bg-black/40 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
              <canvas ref={radarCanvasRef} className="w-full h-full" />
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono text-white/70">
              <div className="flex justify-between">
                <span>RADAR STATUS:</span>
                <span className="text-[#10b981]">ONLINE // 360° RAYCAST</span>
              </div>
              <div className="flex justify-between">
                <span>SAMPLE DENSITY:</span>
                <span className="text-white">12,000 PTS/SEC</span>
              </div>
              <div className="flex justify-between">
                <span>HAZARD THRESHOLD:</span>
                <span className="text-[#f2a98c]">SAFE (&gt; 0.45m)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
