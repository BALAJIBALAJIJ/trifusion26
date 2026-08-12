import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';

const EventStructure = () => {
  return (
    <section className="py-24 bg-dark-card relative z-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Event Structure</h2>
          <p className="text-gray-400">24 Hours. 2 Rounds. 100 Marks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Round 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-surface rounded-2xl p-8 border border-gray-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl font-black text-gray-800">50 pts</span>
            </div>
            <h3 className="text-3xl font-heading font-bold text-primary mb-2">Round 1</h3>
            <p className="text-gray-400 mb-8 font-semibold">First 12 Hours</p>
            
            <div className="space-y-6">
              {[
                { title: "Idea Pitch", desc: "Initial concept presentation and feasibility check." },
                { title: "Design & Mentor Review", desc: "Architecture design and guidance from industry experts." },
                { title: "R1 Final Evaluation", desc: "Progress check at the 12-hour mark." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold text-lg">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Round 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-dark-surface rounded-2xl p-8 border border-gray-700 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4">
              <span className="text-4xl font-black text-gray-800">50 pts</span>
            </div>
            <h3 className="text-3xl font-heading font-bold text-secondary mb-2">Round 2</h3>
            <p className="text-gray-400 mb-8 font-semibold">Final 12 Hours</p>
            
            <div className="space-y-6">
              {[
                { title: "Development Phase", desc: "Core implementation and feature building." },
                { title: "PPT & Demo Review", desc: "Preparing the final presentation and working prototype." },
                { title: "R2 Final Evaluation", desc: "Final judging by the esteemed panel." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <CheckCircle2 className="text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold text-lg">{step.title}</h4>
                    <p className="text-gray-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventStructure;
