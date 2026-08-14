import { motion } from 'framer-motion';

/**
 * SignalWaveVisualizer - ECE-themed animated signal wave display
 * Looks like an oscilloscope or signal analyzer readout
 */
const SignalWaveVisualizer = ({ color = '#06b6d4', barCount = 24, className = '' }) => {
  return (
    <div className={`flex items-end gap-[2px] h-8 ${className}`}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-[3px] rounded-full"
          style={{ backgroundColor: color, opacity: 0.6 }}
          animate={{
            height: ['10%', `${30 + Math.random() * 70}%`, '10%'],
          }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            repeat: Infinity,
            delay: i * 0.05,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
};

/**
 * ECEFloatingElements - Floating ECE-themed icons/symbols
 */
const ECEFloatingElements = () => {
  const symbols = ['⚡', '📡', '🔌', '💡', '🔋', '📶', '⚙️', '🖥️', '📟', '🔬'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {symbols.map((symbol, i) => (
        <motion.div
          key={i}
          className="absolute text-2xl opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: 'easeInOut',
          }}
        >
          {symbol}
        </motion.div>
      ))}
    </div>
  );
};

/**
 * DataStreamLine - Animated horizontal data stream line
 */
const DataStreamLine = ({ color = 'primary', delay = 0 }) => {
  const colorMap = {
    primary: 'from-primary/0 via-primary to-primary/0',
    secondary: 'from-secondary/0 via-secondary to-secondary/0',
    accent: 'from-accent/0 via-accent to-accent/0',
  };

  return (
    <div className="w-full h-[1px] relative overflow-hidden">
      <motion.div
        className={`absolute inset-y-0 w-1/3 bg-gradient-to-r ${colorMap[color] || colorMap.primary}`}
        animate={{ x: ['-100%', '400%'] }}
        transition={{
          duration: 3,
          repeat: Infinity,
          delay,
          ease: 'linear',
        }}
      />
    </div>
  );
};

/**
 * PulseRing - Expanding ring animation (like signal broadcast)
 */
const PulseRing = ({ size = 100, color = '#06b6d4', className = '' }) => {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
          animate={{
            scale: [0.8, 2.5],
            opacity: [0.8, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
      <div
        className="absolute inset-0 m-auto w-3 h-3 rounded-full"
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

/**
 * BinaryRain - Subtle falling binary digits
 */
const BinaryRain = ({ columnCount = 15, className = '' }) => {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {Array.from({ length: columnCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-[10px] font-mono text-primary/10 leading-tight whitespace-nowrap"
          style={{ left: `${(i / columnCount) * 100}%` }}
          animate={{
            y: ['-20%', '120%'],
          }}
          transition={{
            duration: 8 + Math.random() * 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear',
          }}
        >
          {Array.from({ length: 20 }).map(() => Math.round(Math.random())).join('\n')}
        </motion.div>
      ))}
    </div>
  );
};

export { SignalWaveVisualizer, ECEFloatingElements, DataStreamLine, PulseRing, BinaryRain };
