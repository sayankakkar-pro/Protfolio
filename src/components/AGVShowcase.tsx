'use client';

import React, { useState } from 'react';
import AGV3DCanvas from './canvas/AGV3DCanvas';
import { SubsystemDetail } from '@/lib/types';
import { soundFX } from '@/lib/audio';

const subsystems: Record<string, SubsystemDetail> = {
  lidar: {
    title: '360° RPLiDAR S2 Laser Radar',
    badge: 'SCAN RATE: 12,000 SAMPLES/SEC',
    specs: [
      '30-meter detection radius with ±15mm accuracy',
      'Real-time point-cloud transmission to ROS 2 Humble node',
      'Adaptive obstacle clustering & dynamic velocity throttling',
    ],
  },
  jetson: {
    title: 'NVIDIA Jetson Orin Nano AI Core',
    badge: '40 TOPS INT8 INFERENCE',
    specs: [
      'Quantized YOLOv8 perception pipeline running at 45 FPS',
      'TEB local trajectory & DWA path planning nodes',
      'Deterministic fault-tolerant safety supervisor',
    ],
  },
  chassis: {
    title: 'Differential Drive Industrial Chassis',
    badge: 'PAYLOAD RATING: 150 KG',
    specs: [
      'Dual high-torque brushless DC planetary gear motors',
      'High-traction polyurethane caster stabilizer system',
      'Integrated active emergency stop and fail-safe relays',
    ],
  },
};

export default function AGVShowcase() {
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('lidar');

  const detail = subsystems[selectedSubsystem] || subsystems.lidar;

  return (
    <section id="agv" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="hud-pill mb-4">
              <span className="hud-dot" />
              <span>FLAGSHIP HARDWARE // DIGITAL TWIN</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
              Autonomous Factory AGV <br />
              <span className="text-[#f2a98c]">360° SLAM Digital Twin</span>
            </h2>
          </div>

          {/* Subsystem Selector Chips */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'lidar', label: 'RPLiDAR S2' },
              { id: 'jetson', label: 'Jetson Orin' },
              { id: 'chassis', label: 'Chassis & Motors' },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setSelectedSubsystem(s.id);
                  soundFX?.playClick();
                }}
                className={`px-4 py-2 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                  selectedSubsystem === s.id
                    ? 'bg-[#f2a98c] text-black font-bold shadow-[0_0_15px_rgba(242,169,140,0.4)]'
                    : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3D AGV Robot Digital Twin Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 sly-card h-[450px] relative overflow-hidden">
            <AGV3DCanvas activeSubsystem={selectedSubsystem} />
          </div>

          {/* Telemetry HUD Panel */}
          <div className="lg:col-span-4 sly-card p-8 space-y-6">
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-[#f2a98c] px-3 py-1 rounded-full bg-[#f2a98c]/10 border border-[#f2a98c]/20 inline-block">
                {detail.badge}
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight">{detail.title}</h3>
            </div>

            <div className="space-y-3 pt-2">
              {detail.specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-white/70 leading-relaxed font-mono">
                  <span className="text-[#f2a98c]">&gt;</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">MAX SPEED</div>
                <div className="text-lg font-bold font-mono text-white">1.8 m/s</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">SLAM ACCURACY</div>
                <div className="text-lg font-bold font-mono text-[#10b981]">±1.2 cm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
