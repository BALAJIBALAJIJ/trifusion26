import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const rules = [
  {
    title: "Team Size & Eligibility",
    content: "Each team must consist of exactly 3-4 members. All participants must be currently enrolled in an undergraduate program. Inter-college teams are permitted."
  },
  {
    title: "Originality & Plagiarism",
    content: "All code, design, and hardware must be built during the 24-hour hackathon period. Use of third-party libraries and APIs is allowed if openly accessible. Plagiarism will result in immediate disqualification."
  },
  {
    title: "Hardware & Equipment",
    content: "Participants must bring their own laptops, chargers, and any specialized hardware components required for their projects. Basic power and internet will be provided."
  },
  {
    title: "Code of Conduct",
    content: "We expect a professional and respectful environment. Harassment of any form will not be tolerated and will lead to immediate expulsion from the event."
  }
];

const Rules = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="rules" className="py-24 bg-dark-card relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">Rules & Guidelines</h2>
          <p className="text-gray-400">Please read carefully before registering.</p>
        </div>

        <div className="space-y-4">
          {rules.map((rule, idx) => (
            <div key={idx} className="border border-gray-800 bg-dark-surface rounded-xl overflow-hidden">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
              >
                <span className="text-lg font-bold text-white">{rule.title}</span>
                <ChevronDown className={`text-gray-400 transition-transform ${openIndex === idx ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6 text-gray-400"
                  >
                    {rule.content}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Rules;
