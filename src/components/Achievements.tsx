'use client';

import React from 'react';
import { Trophy, Target, Award, Cpu } from 'lucide-react';

export default function Achievements() {
  return (
    <section id="achievements" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="hud-pill mb-4">
            <span className="hud-dot" />
            <span>PROVEN TRACK RECORD</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
            The Numbers That <br />
            <span className="text-[#f2a98c]">Define The Standard</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main 0.3% IIIT Delhi Card */}
          <div className="md:col-span-12 sly-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Target size={240} className="text-white" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              <div>
                <div className="text-5xl lg:text-6xl font-black font-mono text-[#00f0ff]">33,000+</div>
                <div className="text-xs font-mono text-white/50 uppercase mt-2">
                  Applicants Appeared for State Examination
                </div>
              </div>

              <div>
                <div className="text-5xl lg:text-6xl font-black font-mono text-[#10b981]">100</div>
                <div className="text-xs font-mono text-white/50 uppercase mt-2">
                  Elite Students Selected Nationwide (0.3%)
                </div>
              </div>

              <div>
                <div className="text-5xl lg:text-6xl font-black font-mono text-white">21 <span className="text-2xl">DAYS</span></div>
                <div className="text-xs font-mono text-white/50 uppercase mt-2">
                  Intensive Robotics Immersion at IIIT Delhi
                </div>
              </div>

              <div className="lg:border-l lg:border-white/10 lg:pl-8 flex flex-col justify-center">
                <div className="text-sm font-mono font-bold uppercase text-[#f2a98c]">DELHI GOVT ACCREDITED</div>
                <p className="text-sm text-white/70 mt-2 leading-relaxed">
                  Rigorous physical testing in autonomous localization, obstacle mapping, and embedded motor loops.
                </p>
              </div>
            </div>
          </div>

          {/* Hackathon Award 1: Takumi */}
          <div className="md:col-span-6 sly-card p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#facc15]/10 border border-[#facc15]/30 flex items-center justify-center text-[#facc15]">
                <Trophy size={24} />
              </div>
              <span className="text-xs font-mono text-[#facc15] px-3 py-1 rounded-full bg-[#facc15]/10 border border-[#facc15]/20">
                5TH POSITION
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-black uppercase text-white tracking-tight">Takumi Hackathon</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                National level engineering competition. Engineered an end-to-end autonomous navigation prototype under extreme sprint conditions.
              </p>
            </div>
          </div>

          {/* Hackathon Award 2: Aaroh */}
          <div className="md:col-span-6 sly-card p-8 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff]">
                <Award size={24} />
              </div>
              <span className="text-xs font-mono text-[#00f0ff] px-3 py-1 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/20">
                3RD POSITION
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-3xl font-black uppercase text-white tracking-tight">Aaroh India Hackathon</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Secured 3rd position in real-time Physics Simulation & Interactive Game Development category.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
