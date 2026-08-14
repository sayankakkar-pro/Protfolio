'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, CornerDownLeft } from 'lucide-react';
import { soundFX } from '@/lib/audio';

const commands: Record<string, string> = {
  help: 'AVAILABLE COMMANDS: achievements, agv, about, skills, contact, clear',
  achievements: 'DELHI GOVT IIIT: Top 100/33,000 (Top 0.3%)\nTAKUMI HACKATHON: 5th Place\nAAROH INDIA: 3rd Place\nSTARTUP CONTRACTS: 2 shipped projects under NDA',
  agv: 'AUTONOMOUS FACTORY AGV:\n- 360 RPLiDAR S2 (12k samples/sec)\n- NVIDIA Jetson Orin Nano AI Core\n- 150 kg payload capacity\n- ROS 2 Humble Nav2 Stack',
  about: 'SAYAN KAKKAR\n- Class 10 Student at SOSE Shalimar Bagh\n- Focus: Autonomous Robotics, Computer Vision, Real-Time Hardware Fusion\n- Location: Delhi, India',
  skills: 'TECH ARSENAL:\n- ROS 2, Python, C++, Next.js 14, React, Three.js WebGL, TypeScript, TailwindCSS',
  contact: 'CONNECT WITH SAYAN:\n- Email: sayankakkar@gmail.com\n- Phone: 7042368060\n- GitHub: https://github.com/sayankakkar-pro',
};

export default function Terminal() {
  const [history, setHistory] = useState<Array<{ cmd: string; out: string }>>([
    {
      cmd: 'boot',
      out: 'SAYAN-OS v2.4.0 (x86_64-antigravity-linux-gnu)\nType "help" to list available telemetry commands.',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    soundFX?.playClick();

    if (trimmed === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    const output = commands[trimmed] || `Command not found: "${trimmed}". Type "help" for a list of commands.`;
    setHistory((prev) => [...prev, { cmd: cmdStr, out: output }]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(input);
    }
  };

  return (
    <section id="terminal" className="py-24 relative border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="hud-pill mb-4">
            <span className="hud-dot" />
            <span>SAYAN-OS // CYBER SHELL</span>
          </span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-white mt-2">
            Interactive Terminal <br />
            <span className="text-[#00f0ff]">Direct Telemetry Access</span>
          </h2>
        </div>

        {/* Terminal Box */}
        <div className="sly-card p-6 md:p-8 font-mono text-sm space-y-6">
          {/* Terminal Window Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="text-xs text-white/50 ml-2">sayan@robotics-node:~</span>
            </div>
            <TerminalIcon size={16} className="text-white/40" />
          </div>

          {/* Terminal Output Area */}
          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {history.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center gap-2 text-[#f2a98c]">
                  <span>&gt; sayan@os:~$</span>
                  <span className="text-white">{item.cmd}</span>
                </div>
                <div className="text-white/70 whitespace-pre-line pl-4 text-xs leading-relaxed">
                  {item.out}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick Command Chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {['achievements', 'agv', 'skills', 'about', 'contact', 'clear'].map((cmd) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
                className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
              >
                {cmd}
              </button>
            ))}
          </div>

          {/* Input Prompt */}
          <div className="flex items-center gap-2 pt-2">
            <span className="text-[#f2a98c]">&gt;</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type command (e.g. achievements, agv, help)..."
              className="flex-1 bg-transparent text-white focus:outline-none text-xs"
            />
            <CornerDownLeft size={14} className="text-white/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
