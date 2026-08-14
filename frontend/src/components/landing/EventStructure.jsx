import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Coffee, Utensils } from 'lucide-react';

const EventStructure = () => {
  return (
    <section id="schedule" className="py-24 bg-dark-card relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Event Structure</h2>
          <p className="text-gray-400">24 Hours. 2 Phases. 100 Marks Each. September 8–9, 2026</p>
        </div>

        {/* Event Details Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 p-6 bg-dark-surface/50 rounded-2xl border border-primary/20 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          {[
            { label: 'Format', value: 'Offline' },
            { label: 'Duration', value: '24 Hours' },
            { label: 'Team Size', value: '2–4 Members' },
            { label: 'Registration', value: '₹1,600/team' },
          ].map((item, i) => (
            <div key={i}>
              <p className="text-gray-500 text-xs uppercase tracking-wider">{item.label}</p>
              <p className="text-white font-bold text-lg mt-1">{item.value}</p>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Phase 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-surface rounded-2xl p-8 border border-gray-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl font-black text-gray-800">100 pts</span>
            </div>
            <h3 className="text-3xl font-heading font-bold text-primary mb-2">Phase 1</h3>
            <p className="text-gray-400 mb-2 font-semibold">First 12 Hours — September 8</p>
            <p className="text-gray-500 text-sm mb-6">9:00 AM – 10:30 PM</p>
            
            <div className="space-y-4">
              {[
                { icon: <Clock className="w-4 h-4" />, time: '9:00 – 9:30 AM', title: 'Reporting & Registration Verification' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '9:30 – 10:00 AM', title: 'Inauguration Ceremony' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '10:00 – 10:30 AM', title: 'Team/Lab Allocation & Problem Statement Lottery' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '10:30 AM – 12:30 PM', title: 'Round 1 — Ideation & Initial Development', highlight: true },
                { icon: <Utensils className="w-4 h-4" />, time: '12:30 – 1:30 PM', title: 'Lunch Break', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '1:30 – 3:30 PM', title: 'Round 2 — Solution Design & PPT', highlight: true },
                { icon: <Coffee className="w-4 h-4" />, time: '3:30 – 4:00 PM', title: 'Snacks Break', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '4:00 – 8:00 PM', title: 'Round 3 — Advanced Development & Prototype', highlight: true },
                { icon: <Utensils className="w-4 h-4" />, time: '8:00 – 9:00 PM', title: 'Dinner Break', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '9:00 – 9:30 PM', title: 'Final Touches & Demo Prep' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '9:30 – 10:30 PM', title: 'Phase 1 Final Evaluation', highlight: true },
              ].map((step, i) => (
                <div key={i} className={`flex gap-3 items-start ${step.isBreak ? 'opacity-60' : ''}`}>
                  <span className={`flex-shrink-0 mt-0.5 ${step.highlight ? 'text-primary' : step.isBreak ? 'text-yellow-500/70' : 'text-gray-500'}`}>
                    {step.icon}
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-500 text-xs font-mono">{step.time}</span>
                    <h4 className={`text-sm font-bold ${step.highlight ? 'text-white' : step.isBreak ? 'text-gray-500' : 'text-gray-300'}`}>{step.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Phase 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-surface rounded-2xl p-8 border border-gray-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl font-black text-gray-800">100 pts</span>
            </div>
            <h3 className="text-3xl font-heading font-bold text-secondary mb-2">Phase 2</h3>
            <p className="text-gray-400 mb-2 font-semibold">Final 12 Hours — September 8–9</p>
            <p className="text-gray-500 text-sm mb-6">10:30 PM – 10:30 AM</p>
            
            <div className="space-y-4">
              {[
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '10:30 – 10:45 PM', title: 'New Problem Statement Lottery' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '10:45 PM – 12:45 AM', title: 'Round 1 — Ideation & Initial Development', highlight: true },
                { icon: <Coffee className="w-4 h-4" />, time: '12:45 – 1:15 AM', title: 'Midnight Snacks', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '1:15 – 3:45 AM', title: 'Round 2 — Development & Implementation', highlight: true },
                { icon: <Coffee className="w-4 h-4" />, time: '3:45 – 4:15 AM', title: 'Snacks Break', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '4:15 – 6:00 AM', title: 'Round 3 — Advanced Development', highlight: true },
                { icon: <Coffee className="w-4 h-4" />, time: '6:00 – 7:00 AM', title: 'Early Morning Refreshment', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '7:00 – 8:00 AM', title: 'Final Development & Optimization' },
                { icon: <Utensils className="w-4 h-4" />, time: '8:00 – 8:30 AM', title: 'Morning Breakfast', isBreak: true },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '8:30 – 9:00 AM', title: 'Final Touches & Demo Prep' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '9:00 – 9:30 AM', title: 'Phase 2 Final Demo' },
                { icon: <CheckCircle2 className="w-4 h-4" />, time: '9:30 – 10:30 AM', title: 'Phase 2 Final Evaluation', highlight: true },
              ].map((step, i) => (
                <div key={i} className={`flex gap-3 items-start ${step.isBreak ? 'opacity-60' : ''}`}>
                  <span className={`flex-shrink-0 mt-0.5 ${step.highlight ? 'text-secondary' : step.isBreak ? 'text-yellow-500/70' : 'text-gray-500'}`}>
                    {step.icon}
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-500 text-xs font-mono">{step.time}</span>
                    <h4 className={`text-sm font-bold ${step.highlight ? 'text-white' : step.isBreak ? 'text-gray-500' : 'text-gray-300'}`}>{step.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Judging Criteria */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 p-8 bg-dark-surface rounded-2xl border border-gray-700"
        >
          <h3 className="text-2xl font-heading font-bold text-white mb-6 text-center">Judging Criteria (Per Phase)</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { criteria: 'Innovation & Originality', marks: 20 },
              { criteria: 'Technical Implementation', marks: 25 },
              { criteria: 'Problem Understanding', marks: 15 },
              { criteria: 'Working Prototype/Simulation', marks: 20 },
              { criteria: 'Practical Impact & Feasibility', marks: 10 },
              { criteria: 'Presentation & Demo', marks: 10 },
            ].map((item, i) => (
              <div key={i} className="p-4 bg-dark-card rounded-xl border border-gray-800 text-center">
                <span className="text-2xl font-black text-primary">{item.marks}</span>
                <p className="text-gray-400 text-sm mt-1">{item.criteria}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-gray-500 text-sm mt-6">
            Final Score = (Phase 1 Score + Phase 2 Score) ÷ 2 — Top 3 scores win!
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EventStructure;
