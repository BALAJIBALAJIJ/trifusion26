import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: "Who can participate?", a: "Engineering students from all years are eligible. Team members must belong to the same college/institution. Inter-college team formation is not permitted." },
  { q: "What is the registration fee?", a: "₹1,600 per team (irrespective of whether the team has 2, 3, or 4 members). Registration fees are non-refundable." },
  { q: "What is the team size?", a: "Each team must have a minimum of 2 members and a maximum of 4 members. Students from different departments may form a team, provided they belong to the same institution." },
  { q: "Do we need to come with an idea?", a: "No! Problem statements will be assigned on the spot through a transparent lottery-based allocation system. Teams select one preferred theme during registration and are assigned a problem statement from that theme." },
  { q: "Is hardware mandatory?", a: "No, hardware is NOT mandatory. A properly functioning simulation (Wokwi, Proteus, MATLAB/Simulink, Tinkercad), software prototype, or digital prototype is fully acceptable for participation and evaluation." },
  { q: "Can we use AI tools?", a: "Yes, AI tools (ChatGPT, Gemini, Claude, Copilot) are permitted for brainstorming, debugging, code suggestions, and documentation. However, agentic/autonomous AI development is NOT permitted. Mandatory AI disclosure is required." },
  { q: "Is food provided?", a: "Yes! Meals included with registration: Lunch, Evening Snacks, Dinner (Sep 8), Midnight Refreshments, Early Morning Refreshment, and Breakfast (Sep 9). Drinking water is available throughout." },
  { q: "Is accommodation available?", a: "Yes, accommodation is available at ₹220 per participant (separate from the ₹1,600 registration fee). It includes overnight accommodation, dinner, and next morning breakfast. Register separately on the website." },
  { q: "Can we use pre-existing code?", a: "You can use open-source libraries, frameworks, and APIs, but the core solution must be developed based on the assigned problem statement during TRIFUSION'26. Pre-built projects cannot be submitted." },
  { q: "How is the winner decided?", a: "Each phase is scored out of 100 marks independently. Final Score = (Phase 1 + Phase 2) ÷ 2. Top 3 teams win: 🥇 ₹10,000, 🥈 ₹8,000, 🥉 ₹6,000. The jury's decision is final and binding." },
  { q: "What should I bring?", a: "Mandatory: Laptop, charger, valid college ID, required development software/tools. Optional: Arduino/ESP32, sensors, modules, breadboards, wires, cables, and personal essentials for 24 hours." },
  { q: "What is the event date and venue?", a: "September 8–9, 2026 (reporting at 9:00 AM on Sep 8). Venue: ECE & EEE Laboratories at Shree Venkateshwara Hi-Tech Engineering College, Othakuthirai, Gobichettipalayam, Erode District, Tamil Nadu." }
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
                {openIndex === idx ? <Minus className="text-primary flex-shrink-0" /> : <Plus className="text-gray-500 group-hover:text-primary flex-shrink-0" />}
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
