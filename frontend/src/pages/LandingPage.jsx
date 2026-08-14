import { useState, useEffect } from 'react';
import CinematicIntro from '../components/landing/CinematicIntro';
import Hero from '../components/landing/Hero';
import About from '../components/landing/About';
import DepartmentCards from '../components/landing/DepartmentCards';
import Themes from '../components/landing/Themes';
import EventStructure from '../components/landing/EventStructure';

import Rules from '../components/landing/Rules';
import Prizes from '../components/landing/Prizes';
import FAQ from '../components/landing/FAQ';
import Contact from '../components/landing/Contact';

const LandingPage = () => {
  const [introFinished, setIntroFinished] = useState(false);

  const handleIntroComplete = () => {
    // Clear any hash in URL so it doesn't auto-scroll
    if (window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    // Scroll to the very top
    window.scrollTo(0, 0);
    setIntroFinished(true);
  };

  useEffect(() => {
    if (introFinished) {
      // Ensure we're at the top after state update and render
      window.scrollTo(0, 0);
    }
  }, [introFinished]);

  return (
    <div className="bg-dark text-white min-h-screen font-body selection:bg-primary/30">
      {!introFinished && <CinematicIntro onComplete={handleIntroComplete} />}
      
      <div className={`transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <Hero />
        <About />
        <DepartmentCards />
        <Themes />
        <EventStructure />

        <Rules />
        <Prizes />
        <FAQ />
        <Contact />
      </div>
    </div>
  );
};

export default LandingPage;
