'use client';

import React from 'react';
import HeroSection from '@/components/sections/HeroSection';
import MarqueeSection from '@/components/sections/MarqueeSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactButton from '@/components/ui/ContactButton';
import FadeIn from '@/components/ui/FadeIn';

export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] overflow-x-clip font-sans">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. MARQUEE SECTION */}
      <MarqueeSection />

      {/* 3. ABOUT SECTION */}
      <AboutSection />

      {/* 4. SERVICES SECTION */}
      <ServicesSection />

      {/* 5. PROJECTS SECTION */}
      <ProjectsSection />

      {/* FOOTER / CONTACT SECTION */}
      <footer id="contact" className="py-20 px-6 text-center border-t border-[#D7E2EA]/10 bg-[#0C0C0C]">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-8">
          <FadeIn delay={0.1} y={20}>
            <h3
              className="hero-heading font-black uppercase tracking-tight text-center leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              Let&apos;s Create
            </h3>
          </FadeIn>
          <FadeIn delay={0.2} y={20}>
            <p className="text-[#D7E2EA]/70 font-light uppercase tracking-widest text-sm sm:text-base max-w-md">
              Ready to craft striking and unforgettable 3D experiences? Get in touch today.
            </p>
          </FadeIn>
          <FadeIn delay={0.3} y={20}>
            <ContactButton href="mailto:sayankakkar@gmail.com" />
          </FadeIn>
          <div className="pt-12 text-xs font-light text-[#D7E2EA]/40 uppercase tracking-widest">
            © {new Date().getFullYear()} Sayan — 3D Creator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
