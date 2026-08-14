'use client';

import React, { useEffect, useState } from 'react';

const statusMessages = [
  'INITIALIZING NEXT.JS KERNEL...',
  'SYNCHRONIZING ROS 2 HARDWARE NODES...',
  'CALIBRATING 3D THREE.JS WEBGL RENDERER...',
  'MOUNTING SAYAN-OS TELEMETRY BUS...',
  'SAYAN KAKKAR // READY',
];

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(statusMessages[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.floor(Math.random() * 8) + 6;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 150);
          setTimeout(() => setIsHidden(true), 800);
          return 100;
        }

        const msgIdx = Math.min(
          Math.floor((next / 100) * statusMessages.length),
          statusMessages.length - 1
        );
        setStatus(statusMessages[msgIdx]);
        return next;
      });
    }, 28);

    return () => clearInterval(interval);
  }, []);

  if (isHidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[10000] bg-[#000000] flex flex-col items-center justify-center transition-all duration-700 ${
        isLoaded ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="w-full max-w-md px-6 text-center space-y-6">
        <div className="text-7xl font-bold font-mono tracking-tighter text-white">
          {String(progress).padStart(3, '0')}%
        </div>

        {/* Progress Track */}
        <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#f2a98c] transition-all duration-75 shadow-[0_0_15px_#f2a98c]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="text-xs font-mono tracking-widest text-white/50 uppercase">
          {status}
        </div>
      </div>
    </div>
  );
}
