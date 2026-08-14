'use client';

import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [circlePos, setCirclePos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animFrame: number;
    const updateTrailing = () => {
      setCirclePos((prev) => ({
        x: prev.x + (pos.x - prev.x) * 0.18,
        y: prev.y + (pos.y - prev.y) * 0.18,
      }));
      animFrame = requestAnimationFrame(updateTrailing);
    };
    animFrame = requestAnimationFrame(updateTrailing);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.interactive') ||
        target.closest('.sly-card') ||
        target.closest('input')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animFrame);
    };
  }, [pos.x, pos.y]);

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999]">
      {/* Precision Dot */}
      <div
        className="fixed w-2 h-2 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-difference transition-transform duration-75"
        style={{ left: `${pos.x}px`, top: `${pos.y}px` }}
      />
      {/* Trailing Ring */}
      <div
        className={`fixed border rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200 ${
          isHovered
            ? 'w-14 h-14 border-[#f2a98c] bg-[#f2a98c]/10 scale-125'
            : 'w-8 h-8 border-white/30 scale-100'
        }`}
        style={{ left: `${circlePos.x}px`, top: `${circlePos.y}px` }}
      />
    </div>
  );
}
