import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jack -- 3D Creator',
  description:
    'A 3D creator driven by crafting striking and unforgettable projects. Specialized in 3D Modeling, Rendering, Motion Design, Branding, and Web Design.',
  keywords: [
    '3D Creator',
    'Jack',
    '3D Modeling',
    'Rendering',
    'Motion Design',
    'Branding',
    'Web Design',
    'Creative Portfolio',
  ],
  authors: [{ name: 'Jack' }],
  openGraph: {
    title: 'Jack -- 3D Creator',
    description: 'A 3D creator driven by crafting striking and unforgettable projects.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0C0C0C',
  width: 'device-width',
  initialScale: 1,
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
          href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#0C0C0C] text-[#D7E2EA] font-sans antialiased overflow-x-clip min-h-screen">
        <main className="main-wrapper overflow-x-clip bg-[#0C0C0C]">
          {children}
        </main>
      </body>
    </html>
  );
}
