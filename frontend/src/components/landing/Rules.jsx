import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const rules = [
  {
    title: "Team Size & Eligibility",
    content: "Each team must consist of 2–4 members. All participants must be engineering students (all years eligible). Team members must belong to the same college/institution. Inter-college team formation is not permitted. The registration fee is ₹1,600 per team, irrespective of team size."
  },
  {
    title: "Problem Statement Allocation",
    content: "Teams select one preferred theme during registration. Problem statements will be assigned on the spot through a transparent lottery-based allocation system. Teams must work only on the assigned problem statement and cannot replace it with their own idea. A new problem statement is assigned for Phase 2 via the same lottery process."
  },
  {
    title: "Originality & Pre-built Policy",
    content: "Pre-existing projects cannot be submitted as the hackathon solution. The core solution must be developed based on the problem statement assigned during TRIFUSION'26. Standard libraries, frameworks, development environments and permitted open-source dependencies may be used. All third-party resources must be acknowledged."
  },
  {
    title: "AI Usage Policy",
    content: "AI tools (ChatGPT, Gemini, Claude, Copilot, etc.) are permitted for brainstorming, debugging, code suggestions, UI styling, and documentation. However, agentic/autonomous AI development is NOT permitted. Teams must maintain meaningful human involvement and fully understand their submitted work. Mandatory AI disclosure is required — failure to disclose may result in penalty or disqualification."
  },
  {
    title: "Hardware & Simulation",
    content: "Hardware is NOT mandatory. A functional simulation/prototype and PPT are sufficient for evaluation. Participants may bring Arduino, ESP32, sensors, microcontrollers, modules and other components. Suitable simulation platforms include Wokwi, Proteus, MATLAB/Simulink, and Tinkercad. Participants are fully responsible for their own hardware."
  },
  {
    title: "Submission Requirements",
    content: "Each team must submit: (1) Final PPT/PDF presentation, (2) Working prototype or simulation, (3) Project source code, (4) Brief project documentation, and (5) AI Usage Disclosure if applicable. The prototype must clearly demonstrate the proposed functionality."
  },
  {
    title: "What to Bring",
    content: "Mandatory: Laptop, charger, valid college ID, required development software/tools. Optional: Arduino/ESP32, sensors, modules, breadboards, wires, cables, microcontrollers, electronic components, adapters and accessories. All personal belongings and hardware are the participant's responsibility."
  },
  {
    title: "Facilities Provided",
    content: "Wi-Fi/Internet, power supply, tables and chairs, designated laboratory workspace, drinking water, washroom facilities, basic medical support, power backup, technical mentoring, and food & refreshments as per schedule. Project-specific hardware/components will NOT be provided."
  },
  {
    title: "Accommodation",
    content: "Available at ₹220 per participant (separate from ₹1,600 registration fee). Includes overnight accommodation, dinner, and next morning breakfast. A separate accommodation registration is available on the website. Subject to availability."
  },
  {
    title: "Code of Conduct & Disqualification",
    content: "Participants must maintain Respect, Integrity, Professionalism, and Fair Competition. Strictly prohibited: Plagiarism, pre-built projects, false information, unauthorized access, hacking, malicious software, deliberate disruption, cheating, unauthorized external assistance, and AI misuse. Serious violations may result in disqualification."
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
