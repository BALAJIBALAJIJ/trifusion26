import { motion } from 'framer-motion';
import { Clock, Layers, Zap, Cpu, Radio, Activity } from 'lucide-react';
import { SignalWaveVisualizer, DataStreamLine } from '../animations/ECEAnimations';

const About = () => {
  return (
    <section id="about" className="py-24 bg-dark relative z-10 overflow-hidden">
      {/* Circuit background pattern */}
      <div className="absolute inset-0 circuit-bg opacity-30"></div>
      
      {/* Animated signal dividers */}
      <div className="absolute top-0 left-0 right-0">
        <DataStreamLine color="primary" delay={0} />
      </div>
      <div className="absolute bottom-0 left-0 right-0">
        <DataStreamLine color="secondary" delay={1.5} />
      </div>

      <div className="container mx-auto px-4 max-w-6xl relative">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Signal wave accent */}
          <div className="flex justify-center mb-6">
            <SignalWaveVisualizer color="#06b6d4" barCount={20} className="opacity-40" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 text-white">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">TRIFUSION</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-400 font-body max-w-4xl mx-auto leading-relaxed">
            TRIFUSION&apos;26 is a 24-hour offline inter-collegiate hackathon jointly organized by the Departments of ECE, EEE, and BME. The event challenges engineering students to transform real-world problem statements into innovative, practical and technology-driven solutions across intelligent communication, embedded systems, IoT, smart energy, digital healthcare, and assistive technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: <Clock size={40} className="text-primary mb-4" />, 
              title: "24 Hours", 
              desc: "Non-stop innovation, coding, and hardware building.",
              border: "border-primary/30",
              hoverBorder: "hover:border-primary/60",
              glowColor: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
              accentIcon: <Radio className="w-5 h-5 text-primary/30" />,
            },
            { 
              icon: <Layers size={40} className="text-secondary mb-4" />, 
              title: "3 Departments", 
              desc: "ECE, EEE, and BME joining forces for a multidisciplinary approach.",
              border: "border-secondary/30",
              hoverBorder: "hover:border-secondary/60",
              glowColor: "hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]",
              accentIcon: <Cpu className="w-5 h-5 text-secondary/30" />,
            },
            { 
              icon: <Zap size={40} className="text-accent mb-4" />, 
              title: "6 Themes", 
              desc: "Tackling diverse challenges from IoT to Digital Healthcare.",
              border: "border-accent/30",
              hoverBorder: "hover:border-accent/60",
              glowColor: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
              accentIcon: <Activity className="w-5 h-5 text-accent/30" />,
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`relative bg-dark-surface/50 backdrop-blur-sm p-8 rounded-2xl border ${item.border} ${item.hoverBorder} ${item.glowColor} transition-all duration-300 group overflow-hidden`}
            >
              {/* Scan line effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute w-full h-[2px] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-scan-line" />
              </div>
              
              {/* Corner accent */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {item.accentIcon}
              </div>

              <div className="transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-2">{item.title}</h3>
              <p className="text-gray-400 font-body">{item.desc}</p>
              
              {/* Bottom data stream */}
              <div className="absolute bottom-0 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <DataStreamLine color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'accent'} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
