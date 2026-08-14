import Header from '@/components/Header';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import Achievements from '@/components/Achievements';
import AGVShowcase from '@/components/AGVShowcase';
import RoboticsLab from '@/components/RoboticsLab';
import BriefStudio from '@/components/BriefStudio';
import Terminal from '@/components/Terminal';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      <AboutSection />
      <Achievements />
      <AGVShowcase />
      <RoboticsLab />
      <BriefStudio />
      <Terminal />
      <ContactSection />
      <Footer />
    </main>
  );
}
