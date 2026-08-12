import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: "Who can participate?", a: "Any undergraduate student from recognized engineering colleges can participate." },
  { q: "Is there a registration fee?", a: "The registration fee details will be announced soon." },
  { q: "Do we need to come with an idea?", a: "Yes, you should have a basic idea or problem statement aligned with the themes." },
  { q: "Is food and accommodation provided?", a: "Yes, meals and resting areas will be provided during the 24 hours." },
  { q: "Can we use pre-existing code?", a: "You can use open-source libraries, but the core logic and integration must be built during the hackathon." }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 bg-dark-card relative z-10">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">FAQ</h2>
          <p className="text-gray-400">Common questions answered.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-800">
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
              >
                <span className="text-lg font-medium text-gray-200 group-hover:text-primary transition-colors">{faq.q}</span>
                {openIndex === idx ? <Minus className="text-primary" /> : <Plus className="text-gray-500 group-hover:text-primary" />}
              </button>
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="pb-6 text-gray-400 overflow-hidden"
                  >
                    {faq.a}
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

export default FAQ;
