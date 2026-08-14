import { motion } from 'framer-motion';
import { Cpu, Zap, HeartPulse, BatteryCharging, Stethoscope } from 'lucide-react';
import { DataStreamLine } from '../animations/ECEAnimations';

const DepartmentCards = () => {
  return (
    <section className="py-24 bg-dark-card relative z-10 overflow-hidden">
      {/* Circuit board background */}
      <div className="absolute inset-0 circuit-bg opacity-20"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            Collaborating <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Departments</span>
          </h2>
          <p className="text-gray-400">The powerhouse trio behind TRIFUSION&apos;26</p>
          
          {/* Signal divider */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="signal-divider"></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ECE Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group relative bg-dark-surface rounded-2xl p-8 border border-gray-800 hover:border-primary/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(6,182,212,0.2)]"
          >
            {/* Animated circuit pattern overlay */}
            <div className="absolute inset-0 opacity-5 group-hover:opacity-15 transition-opacity duration-500" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #06b6d4 1px, transparent 0)',
              backgroundSize: '24px 24px'
            }}></div>

            {/* Scan line effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
            </div>

            {/* Floating electron animation */}
            <div className="absolute top-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <motion.div
                className="w-2 h-2 rounded-full bg-primary absolute"
                animate={{ 
                  x: [0, 15, 30, 15, 0],
                  y: [15, 0, 15, 30, 15],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <div className="absolute inset-0 border border-primary/20 rounded-full" />
            </div>

            <motion.div 
              whileHover={{ rotate: [0, -10, 10, 0], transition: { duration: 0.5 } }}
              className="inline-block"
            >
              <Cpu className="text-primary w-12 h-12 mb-6" />
            </motion.div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">ECE</h3>
            <p className="text-sm text-primary mb-4 font-semibold uppercase tracking-wider">Electronics & Communication</p>
            <p className="text-gray-400 font-body mb-6">Pioneering advancements in intelligent communication, embedded systems, and automation.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                IoT & Automation
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                Embedded Systems
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                Signal Processing
              </li>
            </ul>
            
            {/* Bottom data stream */}
            <div className="absolute bottom-0 left-0 right-0">
              <DataStreamLine color="primary" />
            </div>
          </motion.div>

          {/* EEE Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group relative bg-dark-surface rounded-2xl p-8 border border-gray-800 hover:border-secondary/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(139,92,246,0.2)]"
          >
            {/* Lightning bolt pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-[linear-gradient(45deg,transparent_25%,rgba(139,92,246,0.5)_50%,transparent_75%)] bg-[length:250%_250%] animate-[gradient_3s_linear_infinite]"></div>
            
            {/* Scan line */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/30 to-transparent animate-scan-line" />
            </div>

            {/* Power surge animation */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <motion.div
                animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <BatteryCharging className="w-6 h-6 text-secondary/40" />
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ rotate: [0, -15, 15, 0], scale: [1, 1.1, 1], transition: { duration: 0.4 } }}
              className="inline-block"
            >
              <Zap className="text-secondary w-12 h-12 mb-6" />
            </motion.div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">EEE</h3>
            <p className="text-sm text-secondary mb-4 font-semibold uppercase tracking-wider">Electrical & Electronics</p>
            <p className="text-gray-400 font-body mb-6">Driving the future with smart energy grids, electric mobility, and intelligent power management.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-secondary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Smart Energy
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-secondary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                Electric Mobility
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-secondary"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                Power Electronics
              </li>
            </ul>
            
            <div className="absolute bottom-0 left-0 right-0">
              <DataStreamLine color="secondary" />
            </div>
          </motion.div>

          {/* BME Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -10, transition: { duration: 0.3 } }}
            className="group relative bg-dark-surface rounded-2xl p-8 border border-gray-800 hover:border-accent/50 transition-all duration-500 overflow-hidden hover:shadow-[0_0_40px_rgba(16,185,129,0.2)]"
          >
            {/* Heartbeat SVG animation */}
            <svg className="absolute bottom-0 left-0 w-full h-24 opacity-10 group-hover:opacity-25 transition-opacity duration-500 text-accent" viewBox="0 0 200 50" preserveAspectRatio="none">
              <motion.path
                d="M0,25 L40,25 L50,10 L60,40 L70,25 L200,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </svg>
            
            {/* Scan line */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent animate-scan-line" />
            </div>

            {/* Pulse animation */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Stethoscope className="w-6 h-6 text-accent/40" />
              </motion.div>
            </div>

            <motion.div 
              whileHover={{ scale: [1, 1.2, 1], transition: { duration: 0.6 } }}
              className="inline-block"
            >
              <HeartPulse className="text-accent w-12 h-12 mb-6" />
            </motion.div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">BME</h3>
            <p className="text-sm text-accent mb-4 font-semibold uppercase tracking-wider">Biomedical Engineering</p>
            <p className="text-gray-400 font-body mb-6">Innovating healthcare through digital solutions, assistive technologies, and patient safety.</p>
            <ul className="text-sm text-gray-500 space-y-2">
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                Digital Healthcare
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
                Assistive Technology
              </li>
              <li className="flex items-center gap-2">
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-accent"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                />
                Medical Devices
              </li>
            </ul>
            
            <div className="absolute bottom-0 left-0 right-0">
              <DataStreamLine color="accent" />
            </div>
          </motion.div>
        </div>
      </div>
      
      <style>{`
        @keyframes gradient {
          0% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
};

export default DepartmentCards;
