import type { Metadata } from 'next';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import Preloader from '@/components/Preloader';

export const metadata: Metadata = {
  title: 'Sayan Kakkar // Autonomous AI & Robotics Systems',
  description:
    'Sayan Kakkar is an autonomous robotics and AI developer at SOSE Shalimar Bagh. Delhi Govt Top 100/33,000 IIIT Boot Camp, Takumi Hackathon 5th, Aaroh GameDev 3rd, Autonomous Factory AGV Creator.',
  keywords: [
    'Sayan Kakkar',
    'Robotics',
    'ROS 2',
    'Autonomous AGV',
    'Next.js 14',
    'Three.js',
    'AI Engineer',
    'IIIT Delhi',
    'SOSE Shalimar Bagh',
  ],
  authors: [{ name: 'Sayan Kakkar' }],
  themeColor: '#000000',
  openGraph: {
    title: 'Sayan Kakkar // Autonomous AI & Robotics Systems',
    description: 'Ideas that ship in code, robotics, and hardware.',
    type: 'website',
    url: 'https://sayankakkar-pro.github.io/Protfolio/',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-black text-white antialiased min-h-screen relative overflow-x-hidden">
        {/* SLY Atmospheric Lighting & Grid */}
        <div className="ambient-glow-top" />
        <div className="ambient-glow-bottom" />
        <div className="fixed inset-0 bg-sly-grid pointer-events-none z-0" />
        <div className="scanline-bg" />

        {/* Interactive Custom Cursor */}
        <CustomCursor />

        {/* SLY Cinematic Preloader */}
        <Preloader />

        {/* Page Content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
