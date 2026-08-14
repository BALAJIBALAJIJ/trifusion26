import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ParticleField from '../three/ParticleField';
import { SignalWaveVisualizer } from '../animations/ECEAnimations';

const useCountdown = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
        return true;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
      return false;
    };

    const expired = calculateTime();
    if (expired) return;

    const interval = setInterval(() => {
      const expired = calculateTime();
      if (expired) clearInterval(interval);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isExpired };
};

const Hero = () => {
  const { timeLeft, isExpired } = useCountdown('2026-09-05T23:59:59');
  const navigate = useNavigate();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <ParticleField />
      </div>
      
      {/* Subtle circuit board pattern overlay */}
      <div className="absolute inset-0 z-[1] circuit-bg opacity-10 pointer-events-none"></div>
      
      {/* Floating signal waves on sides */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-[2] hidden lg:block">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="rotate-90"
        >
          <SignalWaveVisualizer color="#06b6d4" barCount={12} />
        </motion.div>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[2] hidden lg:block">
        <motion.div
          animate={{ opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
          className="rotate-90"
        >
          <SignalWaveVisualizer color="#8b5cf6" barCount={12} />
        </motion.div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          {/* College Header - Logo LEFT + Name RIGHT */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4 px-3 sm:px-4 md:px-6 py-4 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-sm max-w-3xl mx-auto animate-pcb-glow w-full"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 md:gap-6">
              {/* College Logo */}
              <motion.img
                src="/assets/college-logo.png"
                alt="Shree Venkateshwara Hi-Tech Engineering College Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 object-contain flex-shrink-0"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                whileHover={{ scale: 1.05, rotate: 3 }}
              />

              {/* College Details */}
              <div className="text-center sm:text-left">
                <h2 className="text-[12px] leading-tight sm:text-base md:text-xl lg:text-2xl font-heading font-bold text-white tracking-wide">SHREE VENKATESHWARA HI-TECH ENGINEERING COLLEGE</h2>
                <p className="text-primary font-heading font-semibold text-[10px] sm:text-xs md:text-sm mt-1 tracking-widest">AUTONOMOUS</p>
                <p className="text-gray-400 text-[8px] sm:text-[10px] md:text-xs mt-1.5 leading-relaxed">Approved by AICTE, New Delhi & Affiliated to Anna University, Chennai</p>
                <p className="text-gray-400 text-[8px] sm:text-[10px] md:text-xs leading-relaxed">Accredited by NAAC with &apos;A&apos; Grade & NBA</p>
                <p className="text-gray-500 text-[8px] sm:text-[10px] md:text-xs mt-1">Gobichettipalayam, Erode District, Tamilnadu, India</p>
              </div>
            </div>
          </motion.div>

          {/* Accreditation & Partner Logos Row */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mb-6 flex items-center justify-center gap-2 sm:gap-3 md:gap-6 flex-wrap"
          >
            {[
              { src: '/assets/iic-logo.png', alt: "Institution's Innovation Council", delay: 0 },
              { src: '/assets/aicte-logo.png', alt: 'AICTE - All India Council for Technical Education', delay: 0.1 },
              { src: '/assets/anna-university-logo.png', alt: 'Anna University, Chennai', delay: 0.2 },
              { src: '/assets/tuv-sud-logo.png', alt: 'TUV SUD ISO 9001', delay: 0.3 },
            ].map((logo, index) => (
              <motion.img
                key={index}
                src={logo.src}
                alt={logo.alt}
                className="h-7 sm:h-10 md:h-14 object-contain rounded-lg bg-white/90 px-1.5 py-1"
                initial={{ opacity: 0, scale: 0.6, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 + logo.delay, ease: 'easeOut' }}
                whileHover={{ scale: 1.12, y: -3 }}
              />
            ))}
          </motion.div>
          
          {/* TRIFUSION Logo with enhanced glow */}
          <motion.div
            animate={{ 
              filter: ['drop-shadow(0 0 15px rgba(6,182,212,0.3))', 'drop-shadow(0 0 30px rgba(139,92,246,0.4))', 'drop-shadow(0 0 15px rgba(6,182,212,0.3))']
            }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <img src="/assets/trifusion-logo.png" alt="TRIFUSION'26 Logo" className="w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 object-contain mx-auto mb-4" />
          </motion.div>
          
          {/* Title with neon effect */}
          <motion.h1 
            className="text-4xl sm:text-6xl md:text-8xl font-heading font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            style={{ backgroundSize: '200% 200%' }}
          >
            TRIFUSION&apos;26
          </motion.h1>
          
          {/* Tagline with typewriter feel */}
          <div className="text-lg sm:text-xl md:text-3xl font-body text-gray-300 max-w-3xl mx-auto mt-2 md:mt-4 font-light h-8 md:h-10 overflow-hidden">
            <motion.span 
              className="inline-block"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Innovate. Integrate. Inspire.
            </motion.span>
          </div>
        </motion.div>

        {/* Department badges with pulse */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-2 sm:gap-4 mb-8 md:mb-12 justify-center flex-wrap"
        >
          {[
            { label: 'ECE', color: 'primary', shadow: 'rgba(6,182,212,0.3)' },
            { label: 'EEE', color: 'secondary', shadow: 'rgba(139,92,246,0.3)' },
            { label: 'BME', color: 'accent', shadow: 'rgba(16,185,129,0.3)' },
          ].map((dept, i) => (
            <motion.span
              key={dept.label}
              className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-dark-card/80 border border-${dept.color}/40 rounded-lg text-${dept.color} text-sm sm:text-base font-heading font-bold`}
              whileHover={{ scale: 1.1, y: -3 }}
              animate={{
                boxShadow: [
                  `0 0 10px ${dept.shadow}`,
                  `0 0 25px ${dept.shadow}`,
                  `0 0 10px ${dept.shadow}`,
                ]
              }}
              transition={{
                boxShadow: { duration: 2, repeat: Infinity, delay: i * 0.4 },
              }}
            >
              {dept.label}
            </motion.span>
          ))}
        </motion.div>

        {/* Countdown */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mb-12 max-w-2xl mx-auto"
        >
          {isExpired ? (
            <div className="text-center p-6 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-md">
              <span className="text-2xl md:text-4xl font-heading font-bold text-red-400">Registration Closed</span>
            </div>
          ) : (
            <>
              <div className="mb-4 px-5 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/40 backdrop-blur-sm flex items-center justify-center gap-3 animate-pulse">
                <span className="text-yellow-400 text-lg">⚠️</span>
                <span className="text-yellow-300 font-heading font-bold text-sm md:text-base tracking-wide">
                  REGISTRATION CLOSES ON 05/09/2026
                </span>
                <span className="text-yellow-400 text-lg">⚠️</span>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-6">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <motion.div 
                  key={unit} 
                  className="flex flex-col items-center p-2 sm:p-3 md:p-4 bg-dark-surface/60 backdrop-blur-md rounded-xl border border-gray-700 group hover:border-primary/40 transition-colors"
                  whileHover={{ scale: 1.05, y: -3 }}
                >
                  <motion.span 
                    className="text-2xl sm:text-3xl md:text-5xl font-heading font-bold text-white"
                    key={value}
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {value.toString().padStart(2, '0')}
                  </motion.span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-400 uppercase tracking-widest mt-1">{unit}</span>
                </motion.div>
              ))}
            </div>
            </>
          )}
        </motion.div>

        {/* CTA Button with glow pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg transition-all transform cursor-pointer relative overflow-hidden group"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            animate={{
              boxShadow: [
                '0 0 15px rgba(6,182,212,0.3)',
                '0 0 30px rgba(139,92,246,0.4)',
                '0 0 15px rgba(6,182,212,0.3)',
              ]
            }}
            transition={{
              boxShadow: { duration: 3, repeat: Infinity },
            }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative z-10">Register Now</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
