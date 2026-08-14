import { motion } from 'framer-motion';
import { Wifi, Cpu, BatteryCharging, Car, Activity, ShieldCheck } from 'lucide-react';
import { DataStreamLine } from '../animations/ECEAnimations';

const themes = [
  {
    id: 1,
    dept: 'ECE',
    title: 'Intelligent Communication & Embedded Systems',
    desc: 'Intelligent communication systems, embedded technologies, real-time systems and smart connected devices.',
    icon: <Wifi size={32} />,
    color: 'text-primary',
    bgColor: 'bg-primary',
    border: 'hover:border-primary/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    gradientFrom: 'from-primary/10',
  },
  {
    id: 2,
    dept: 'ECE',
    title: 'IoT, Automation & Edge Intelligence',
    desc: 'IoT systems, industrial automation, edge computing, intelligent monitoring and autonomous systems.',
    icon: <Cpu size={32} />,
    color: 'text-primary',
    bgColor: 'bg-primary',
    border: 'hover:border-primary/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(6,182,212,0.2)]',
    gradientFrom: 'from-primary/10',
  },
  {
    id: 3,
    dept: 'EEE',
    title: 'Smart Energy & Power Systems',
    desc: 'Energy monitoring, optimization, smart grids, renewable energy integration and intelligent power systems.',
    icon: <BatteryCharging size={32} />,
    color: 'text-secondary',
    bgColor: 'bg-secondary',
    border: 'hover:border-secondary/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]',
    gradientFrom: 'from-secondary/10',
  },
  {
    id: 4,
    dept: 'EEE',
    title: 'Electric Mobility & Intelligent Power',
    desc: 'Electric vehicles, battery management, charging systems, intelligent mobility and power optimization.',
    icon: <Car size={32} />,
    color: 'text-secondary',
    bgColor: 'bg-secondary',
    border: 'hover:border-secondary/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(139,92,246,0.2)]',
    gradientFrom: 'from-secondary/10',
  },
  {
    id: 5,
    dept: 'BME',
    title: 'Digital Healthcare & Biomedical Innovation',
    desc: 'Digital healthcare, biomedical systems, patient monitoring, healthcare automation and medical technology.',
    icon: <Activity size={32} />,
    color: 'text-accent',
    bgColor: 'bg-accent',
    border: 'hover:border-accent/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
    gradientFrom: 'from-accent/10',
  },
  {
    id: 6,
    dept: 'BME',
    title: 'Assistive Technology & Patient Safety',
    desc: 'Assistive devices, accessibility, patient safety, elderly care, emergency monitoring and human-centric innovation.',
    icon: <ShieldCheck size={32} />,
    color: 'text-accent',
    bgColor: 'bg-accent',
    border: 'hover:border-accent/60',
    shadow: 'hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
    gradientFrom: 'from-accent/10',
  }
];

const Themes = () => {
  return (
    <section id="themes" className="py-24 bg-dark relative z-10 overflow-hidden">
      {/* Background circuit pattern */}
      <div className="absolute inset-0 circuit-bg opacity-15"></div>
      
      <div className="container mx-auto px-4 max-w-7xl relative">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-4"
          >
            Hackathon <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">Themes</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400"
          >
            Select one preferred theme during registration. Problem statements will be assigned on the spot through lottery.
          </motion.p>
          
          {/* Signal divider */}
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-6 max-w-xs mx-auto overflow-hidden"
          >
            <div className="signal-divider"></div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme, idx) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative bg-dark-surface p-6 rounded-xl border border-gray-800 transition-all duration-300 ${theme.border} ${theme.shadow} flex flex-col h-full group overflow-hidden`}
            >
              {/* Gradient overlay on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradientFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              {/* Scan line */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
                <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan-line" />
              </div>
              
              <div className="relative z-10 flex justify-between items-start mb-4">
                <motion.div 
                  className={`p-3 rounded-lg bg-dark-card ${theme.color}`}
                  whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                >
                  {theme.icon}
                </motion.div>
                <motion.span 
                  className={`text-xs font-bold px-3 py-1 rounded-full bg-dark-card border border-gray-700 ${theme.color}`}
                  whileHover={{ scale: 1.05 }}
                >
                  {theme.dept}
                </motion.span>
              </div>
              <h3 className="relative z-10 text-xl font-heading font-bold text-white mb-3 leading-tight group-hover:text-white/95">{theme.title}</h3>
              <p className="relative z-10 text-gray-400 font-body text-sm flex-grow">{theme.desc}</p>
              
              {/* Bottom data stream on hover */}
              <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DataStreamLine color={theme.dept === 'ECE' ? 'primary' : theme.dept === 'EEE' ? 'secondary' : 'accent'} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Themes;
