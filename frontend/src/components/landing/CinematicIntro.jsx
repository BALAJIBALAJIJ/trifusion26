import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CinematicIntro = ({ onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2
      });
    }
    
    let animationFrameId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.5)';
      
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 1,
          onComplete
        });
      }
    });

    tl.fromTo('.intro-logo', 
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' }
    )
    .fromTo('.intro-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.5'
    )
    .fromTo('.intro-subtitle',
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      '-=0.3'
    )
    .fromTo('.intro-depts',
      { opacity: 0, letterSpacing: '0px' },
      { opacity: 1, letterSpacing: '4px', duration: 1.5 },
      '-=0.5'
    )
    .to({}, { duration: 1.5 });

    return () => {
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 bg-dark flex flex-col items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-50" />
      
      <div className="z-10 flex flex-col items-center text-center px-4">
        <div className="intro-logo mb-6 w-72 h-72 md:w-96 md:h-96 flex items-center justify-center overflow-hidden drop-shadow-[0_0_40px_rgba(6,182,212,0.6)]">
           <img src="/assets/trifusion-logo.png" alt="TRIFUSION'26 Logo" className="w-full h-full object-contain" />
        </div>
        
        <h1 className="intro-title text-4xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent mb-4 tracking-wider">
          TRIFUSION&apos;26
        </h1>
        
        <p className="intro-subtitle text-base md:text-2xl text-gray-300 font-body mb-6 max-w-2xl">
          24-HOUR INTER-COLLEGIATE HACKATHON
        </p>
        
        <div className="intro-depts text-primary font-heading font-semibold text-lg md:text-xl tracking-widest">
          ECE &times; EEE &times; BME
        </div>
      </div>
      
      <button 
        onClick={onComplete}
        className="absolute bottom-8 right-8 z-20 text-gray-400 hover:text-white border border-gray-600 hover:border-white px-4 py-2 rounded-full text-sm font-body transition-colors cursor-pointer"
      >
        Skip Intro
      </button>
    </div>
  );
};

export default CinematicIntro;
