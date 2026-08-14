'use client';

import React from 'react';
import { ArrowRight, Terminal as TerminalIcon, Sparkles } from 'lucide-react';
import Hero3DCanvas from './canvas/Hero3DCanvas';
import { soundFX } from '@/lib/audio';

export default function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column: Typography & Intent */}
        <div className="lg:col-span-6 space-y-8 text-left">
          <div className="inline-flex items-center gap-3 bg-white/[0.04] border border-white/10 px-4 py-1.5 rounded-full">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
            </span>
            <span className="text-xs font-mono tracking-wider text-white/80 uppercase">
              SOSE Shalimar Bagh // IIIT Delhi Boot Camp Tier
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-mono text-[#f2a98c] tracking-widest uppercase">
              Hi, I&apos;m Sayan Kakkar.
            </p>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] text-white">
              I BUILD <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white/80 to-white/30">
                THINGS.
              </span>
            </h1>
          </div>

          <p className="text-lg text-white/60 max-w-lg leading-relaxed">
            I don&apos;t want to only understand how technology works. I build autonomous robotics, ROS 2 hardware pipelines, and high-velocity AI platforms that ship to the physical world.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a
              href="#agv"
              onClick={() => soundFX?.playClick()}
              className="sly-btn-primary"
            >
              <span>Explore AGV Robot</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#brief-studio"
              onClick={() => soundFX?.playClick()}
              className="sly-btn-glass"
            >
              <Sparkles size={16} className="text-[#f2a98c]" />
              <span>Drop An Idea</span>
            </a>
            <a
              href="#terminal"
              onClick={() => soundFX?.playClick()}
              className="p-3.5 rounded-full bg-white/5 border border-white/10 hover:border-[#00f0ff] text-white/60 hover:text-[#00f0ff] transition-colors"
              title="Launch SAYAN-OS CLI"
            >
              <TerminalIcon size={18} />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div>
              <div className="text-2xl font-bold font-mono text-white">0.3%</div>
              <div className="text-[11px] font-mono text-white/40 uppercase">IIIT Delhi Tier</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#f2a98c]">150 kg</div>
              <div className="text-[11px] font-mono text-white/40 uppercase">AGV Payload</div>
            </div>
            <div>
              <div className="text-2xl font-bold font-mono text-[#00f0ff]">5th</div>
              <div className="text-[11px] font-mono text-white/40 uppercase">Takumi Hackathon</div>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Kinetic Three.js Sculpture */}
        <div className="lg:col-span-6 h-[480px] lg:h-[580px] relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
          <Hero3DCanvas />
        </div>
      </div>
    </section>
  );
}
