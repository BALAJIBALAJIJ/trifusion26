import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color = 'cyan', delay = 0 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const controls = useAnimation();
  
  // Use colors based on props
  const colorMap = {
    cyan: 'from-cyan-500 to-cyan-700',
    violet: 'from-violet-500 to-violet-700',
    emerald: 'from-emerald-500 to-emerald-700',
    amber: 'from-amber-500 to-amber-700',
    red: 'from-red-500 to-red-700',
    blue: 'from-blue-500 to-blue-700',
  };

  const bgGradient = colorMap[color] || colorMap.cyan;

  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: delay * 0.1 }
    });
    
    // Simple counter animation
    let startTimestamp = null;
    const duration = 1500; // ms
    const targetValue = parseInt(value, 10) || 0;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setDisplayValue(Math.floor(progress * targetValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, controls, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={controls}
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="p-5 flex items-center">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${bgGradient} text-white mr-4 shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{displayValue}</h3>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
