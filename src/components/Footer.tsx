'use client';

import React, { useState, useEffect } from 'react';

export default function Footer() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="py-12 border-t border-white/10 relative z-10 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
          <span className="text-xs font-mono text-white/60">
            SYSTEM TELEMETRY: ALL NODES OPERATIONAL
          </span>
        </div>

        <div className="text-xs font-mono text-white/40">
          DELHI, INDIA // {time || '18:50:00 IST'}
        </div>

        <div className="text-xs font-mono text-white/50">
          © {new Date().getFullYear()} Sayan Kakkar. Next.js 14 WebGL Edition.
        </div>
      </div>
    </footer>
  );
}
