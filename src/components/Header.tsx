'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Github, ArrowUpRight } from 'lucide-react';
import { soundFX } from '@/lib/audio';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [soundActive, setSoundActive] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleSound = () => {
    if (soundFX) {
      const state = soundFX.toggle();
      setSoundActive(state);
      if (state) soundFX.playClick();
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? 'py-4 bg-black/75 backdrop-blur-xl border-b border-white/10' : 'py-6 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            onClick={() => soundFX?.playClick()}
            className="flex items-center gap-3 group text-white no-underline"
          >
            <div className="w-8 h-8 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-sm text-[#f2a98c] group-hover:border-[#f2a98c] transition-colors">
              SK
            </div>
            <div className="flex flex-col">
              <span className="font-bold tracking-tight text-sm uppercase">Sayan Kakkar</span>
              <span className="text-[10px] font-mono text-white/50 tracking-wider">AI & ROBOTICS ARCHITECT</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 bg-white/[0.03] border border-white/10 px-6 py-2 rounded-full backdrop-blur-md">
            <a
              href="#about"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              About
            </a>
            <a
              href="#achievements"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              Achievements
            </a>
            <a
              href="#agv"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              3D AGV Robot
            </a>
            <a
              href="#lab"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              Robotics Lab
            </a>
            <a
              href="#brief-studio"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              Brief Studio
            </a>
            <a
              href="#terminal"
              onClick={() => soundFX?.playClick()}
              onMouseEnter={() => soundFX?.playHover()}
              className="text-xs font-mono tracking-widest text-white/70 hover:text-white uppercase transition-colors"
            >
              Terminal
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Audio Synth Toggle */}
            <button
              onClick={toggleSound}
              className={`p-2 rounded-full border transition-colors ${
                soundActive
                  ? 'bg-[#f2a98c]/10 border-[#f2a98c]/40 text-[#f2a98c]'
                  : 'bg-white/5 border-white/10 text-white/40'
              }`}
              title={soundActive ? 'Audio ON' : 'Audio Muted'}
            >
              {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>

            {/* GitHub Profile */}
            <a
              href="https://github.com/sayankakkar-pro"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => soundFX?.playClick()}
              className="hidden sm:inline-flex items-center gap-2 text-xs font-mono px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-colors"
            >
              <Github size={14} />
              <span>GitHub</span>
              <ArrowUpRight size={12} className="opacity-60" />
            </a>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-white bg-white/5 rounded-xl border border-white/10"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col justify-center items-center gap-8 md:hidden">
          <a
            href="#about"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            About
          </a>
          <a
            href="#achievements"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            Achievements
          </a>
          <a
            href="#agv"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            3D AGV Robot
          </a>
          <a
            href="#lab"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            Robotics Lab
          </a>
          <a
            href="#brief-studio"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            Brief Studio
          </a>
          <a
            href="#terminal"
            onClick={() => {
              setMobileOpen(false);
              soundFX?.playClick();
            }}
            className="text-2xl font-bold tracking-widest uppercase text-white hover:text-[#f2a98c]"
          >
            Terminal
          </a>
          <a
            href="https://github.com/sayankakkar-pro"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 flex items-center gap-2 text-sm font-mono bg-white text-black px-6 py-3 rounded-full font-bold uppercase"
          >
            <Github size={16} />
            <span>sayankakkar-pro</span>
          </a>
        </div>
      )}
    </>
  );
}
