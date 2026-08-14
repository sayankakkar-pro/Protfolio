'use client';

import React, { useState } from 'react';
import { soundFX } from '@/lib/audio';
import { BookOpen, Compass, Cpu, Wrench } from 'lucide-react';

const tabs = [
  { id: 'story', label: 'The Story', icon: BookOpen },
  { id: 'philosophy', label: 'Philosophy', icon: Compass },
  { id: 'track', label: 'Academic & Boot Camp Track', icon: Cpu },
  { id: 'arsenal', label: 'Daily Arsenal', icon: Wrench },
];

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState('story');

  return (
    <section id="about" className="py-24 relative border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="hud-pill mb-4">
              <span className="hud-dot" />
              <span>WHO AM I</span>
            </span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
              Architecting Systems <br />
              <span className="text-white/40">From Silicon to Software</span>
            </h2>
          </div>

          {/* Tab Selection */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-full bg-white/[0.04] border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    soundFX?.playClick();
                  }}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-mono tracking-wider uppercase transition-all ${
                    isActive
                      ? 'bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Cards */}
        <div className="sly-card p-8 md:p-12">
          {activeTab === 'story' && (
            <div className="space-y-6 max-w-4xl">
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Turning high-complexity ideas into deployed physical machines.
              </h3>
              <p className="text-white/70 text-lg leading-relaxed">
                I&apos;m Sayan Kakkar, a Class 10 student at SOSE Shalimar Bagh. My obsession began with software, but quickly outgrew screens. I realized that the real frontier is where autonomous algorithms touch physical reality—controlling motors, processing real-time LiDAR point clouds, and navigating dynamic industrial environments.
              </p>
              <p className="text-white/70 text-lg leading-relaxed">
                Over the past 2 years, I have architected 360° LiDAR autonomous AGVs, qualified in the top 0.3% tier for the Delhi Govt IIIT Delhi Robotics Boot Camp, and placed nationally in competitive engineering hackathons.
              </p>
            </div>
          )}

          {activeTab === 'philosophy' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-xs font-mono text-[#f2a98c]">01 // FIRST PRINCIPLES</span>
                <h4 className="text-xl font-bold text-white">Build First, Perfect Later</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  A broken physical prototype teaches more in 2 hours than 30 days of unexecuted theory.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-xs font-mono text-[#00f0ff]">02 // HARDWARE FUSION</span>
                <h4 className="text-xl font-bold text-white">Silicon Needs Software</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Great code is meaningless without deterministic real-time hardware execution and safety loops.
                </p>
              </div>
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-xs font-mono text-[#8b5cf6]">03 // VELOCITY</span>
                <h4 className="text-xl font-bold text-white">Pressure Builds Precision</h4>
                <p className="text-sm text-white/60 leading-relaxed">
                  Competitive hackathons and real client deployments forge unshakeable engineering resilience.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'track' && (
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-[#f2a98c]/10 border border-[#f2a98c]/30 flex items-center justify-center font-mono font-bold text-[#f2a98c]">
                  IIIT
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Delhi Govt IIIT Delhi Robotics Boot Camp</h4>
                  <p className="text-xs font-mono text-[#f2a98c]">TOP 100 SELECTED OUT OF 33,000+ APPLICANTS (TOP 0.3%)</p>
                  <p className="text-sm text-white/60 mt-2">
                    21-day intensive residential immersion covering advanced kinematics, ROS 2 nodes, SLAM navigation, and sensor fusion.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-white">
                  SOSE
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">School of Specialized Excellence (SOSE), Shalimar Bagh</h4>
                  <p className="text-xs font-mono text-white/50">CLASS 10 // STEM & ADVANCED COMPUTING</p>
                  <p className="text-sm text-white/60 mt-2">
                    Specialized curriculum in high-performance computing, mathematical modeling, and engineering fundamentals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'arsenal' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'ROS 2 Humble', cat: 'Robotics OS' },
                { name: 'Python / C++', cat: 'Core Languages' },
                { name: 'Next.js 14 / React', cat: 'Web Framework' },
                { name: 'Three.js / WebGL', cat: '3D Simulation' },
                { name: 'RPLiDAR S2 SLAM', cat: 'Sensor Fusion' },
                { name: 'NVIDIA Jetson AI', cat: 'Edge Compute' },
                { name: 'Tailwind CSS', cat: 'Design Systems' },
                { name: 'TypeScript', cat: 'Type-Safe Architecture' },
              ].map((tech) => (
                <div key={tech.name} className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="text-sm font-bold text-white">{tech.name}</div>
                  <div className="text-[11px] font-mono text-white/40 uppercase mt-1">{tech.cat}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
