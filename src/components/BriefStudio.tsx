'use client';

import React, { useState } from 'react';
import { Sparkles, Send, CheckCircle2, Database } from 'lucide-react';
import { soundFX } from '@/lib/audio';
import { saveBriefToDatabase } from '@/lib/mongodb';

const domainDescriptions: Record<string, string> = {
  'Autonomous AGV Logistics': 'Architecture incorporates 360° RPLiDAR S2 SLAM navigation, ROS 2 Humble node orchestration, TEB local trajectory planner, and safety fallback loop.',
  'Edge AI & Computer Vision': 'Edge AI perception pipeline on NVIDIA Jetson Orin Nano, TensorRT model quantization, YOLOv8 object segmentation, and real-time inference at 45 FPS.',
  'Full-Stack Next.js Platform': 'Production Next.js 14 / TypeScript web application with WebSocket telemetry feeds, high-performance UI components, and resilient cloud architecture.',
  'National Hackathon Sprint': 'High-velocity prototype development, real-time physics engine, API orchestration, and technical pitch deck architecture.',
};

export default function BriefStudio() {
  const [domain, setDomain] = useState('Autonomous AGV Logistics');
  const [timeline, setTimeline] = useState('Rapid Sprint (1-2 Weeks)');
  const [hardware, setHardware] = useState('ROS 2 + Physical HW');
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    soundFX?.playClick();

    // Store in MongoDB Collection
    await saveBriefToDatabase({
      domain,
      timeline,
      hardware,
      email,
      createdAt: new Date(),
    });

    setTimeout(() => {
      setSent(false);
      setEmail('');
    }, 5000);
  };

  return (
    <section id="brief-studio" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="hud-pill mb-4">
            <span className="hud-dot" />
            <span>SLY BRIEF STUDIO // CONFIGURATOR</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
            Drop An Idea <br />
            <span className="text-[#f2a98c]">Architect Your Vision</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Step-by-Step Configurator Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 sly-card p-8 md:p-10 space-y-8">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-white/50 uppercase tracking-widest block">
                01 // SELECT DOMAIN ARCHITECTURE
              </span>
              <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] flex items-center gap-1.5">
                <Database size={11} />
                <span>MONGODB STORE READY</span>
              </span>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  'Autonomous AGV Logistics',
                  'Edge AI & Computer Vision',
                  'Full-Stack Next.js Platform',
                  'National Hackathon Sprint',
                ].map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => {
                      setDomain(d);
                      soundFX?.playClick();
                    }}
                    className={`p-3.5 rounded-xl text-left text-xs font-mono border transition-all ${
                      domain === d
                        ? 'bg-[#f2a98c]/15 border-[#f2a98c] text-white shadow-[0_0_15px_rgba(242,169,140,0.2)]'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Target Timeline */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-white/50 uppercase tracking-widest block">
                02 // ESTIMATED TIMELINE
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  'Rapid Sprint (1-2 Weeks)',
                  'Full Build (3-4 Weeks)',
                  'Deep R&D (1-2 Months)',
                ].map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => {
                      setTimeline(t);
                      soundFX?.playClick();
                    }}
                    className={`p-3 rounded-xl text-center text-xs font-mono border transition-all ${
                      timeline === t
                        ? 'bg-[#00f0ff]/15 border-[#00f0ff] text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Hardware Tier */}
            <div className="space-y-3">
              <label className="text-xs font-mono text-white/50 uppercase tracking-widest block">
                03 // HARDWARE INTEGRATION TIER
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  'Pure Software / Web',
                  'ROS 2 + Simulation',
                  'ROS 2 + Physical HW',
                ].map((hw) => (
                  <button
                    type="button"
                    key={hw}
                    onClick={() => {
                      setHardware(hw);
                      soundFX?.playClick();
                    }}
                    className={`p-3 rounded-xl text-center text-xs font-mono border transition-all ${
                      hardware === hw
                        ? 'bg-[#8b5cf6]/15 border-[#8b5cf6] text-white'
                        : 'bg-white/[0.02] border-white/10 text-white/60 hover:text-white'
                    }`}
                  >
                    {hw}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Input & Submit */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to connect..."
                className="w-full px-5 py-3.5 rounded-xl bg-white/[0.04] border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#f2a98c]"
              />

              <button type="submit" className="sly-btn-primary w-full">
                <Send size={16} />
                <span>Transmit Project Dispatch to Database</span>
              </button>
            </div>
          </form>

          {/* Right: Dynamic Blueprint Preview */}
          <div className="lg:col-span-5 sly-card p-8 md:p-10 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-[#f2a98c]" />
              <h3 className="text-lg font-bold font-mono uppercase text-white tracking-widest">
                Generated Blueprint
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">ARCHITECTURE DOMAIN</div>
                <div className="text-xl font-black text-white">{domain}</div>
              </div>

              <div>
                <div className="text-[10px] font-mono text-white/40 uppercase">SPECIFICATION SUMMARY</div>
                <p className="text-sm text-white/70 leading-relaxed font-mono mt-1">
                  {domainDescriptions[domain] || 'Tailored engineering blueprint.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 text-xs font-mono text-white/60">
                <div>TIMELINE ESTIMATE: {timeline}</div>
                <div>COMPUTE PIPELINE: {hardware}</div>
                <div className="text-[#10b981]">PERSISTENCE: MONGODB DATABASE PIPELINE</div>
              </div>
            </div>

            {sent && (
              <div className="p-4 rounded-xl bg-[#10b981]/15 border border-[#10b981]/40 flex items-center gap-3 text-sm text-[#10b981] font-mono">
                <CheckCircle2 size={18} />
                <span>Saved to MongoDB pipeline & transmitted successfully!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
