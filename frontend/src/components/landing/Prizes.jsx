import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Sparkles } from 'lucide-react';
import { DataStreamLine } from '../animations/ECEAnimations';

const Prizes = () => {
  return (
    <section id="prizes" className="py-24 bg-dark relative z-10 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 circuit-bg opacity-10"></div>
      
      <div className="container mx-auto px-4 max-w-6xl relative">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-primary to-secondary">Prizes</span>
          </h2>
          <div className="mt-4 max-w-xs mx-auto">
            <div className="signal-divider"></div>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-center items-end gap-8 mb-16">
          {/* Runner Up */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="w-full md:w-1/3 bg-dark-surface border border-gray-700 hover:border-gray-500 rounded-t-2xl p-8 text-center relative md:order-1 order-2 group transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-gray-400/20 to-transparent animate-scan-line" />
            </div>
            <motion.div 
              className="w-16 h-16 mx-auto bg-gray-300/10 rounded-full flex items-center justify-center mb-4"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
            >
              <Medal className="text-gray-300 w-8 h-8" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Runner Up</h3>
            <p className="text-3xl font-black text-gray-300">TBA</p>
          </motion.div>

          {/* Winner */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ y: -8 }}
            className="w-full md:w-1/3 bg-gradient-to-b from-primary/20 to-dark-surface border border-primary/50 rounded-t-3xl p-10 text-center relative md:order-2 order-1 z-10 group transition-all duration-300 overflow-hidden"
            animate={{
              boxShadow: [
                '0 -10px 30px rgba(6,182,212,0.1)',
                '0 -10px 50px rgba(6,182,212,0.25)',
                '0 -10px 30px rgba(6,182,212,0.1)',
              ]
            }}
            // @ts-ignore
            transition2={{ boxShadow: { duration: 3, repeat: Infinity } }}
          >
            {/* Scan line */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-scan-line" />
            </div>
            
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-6 bg-primary/20 rounded-t-full blur-md"></div>
            
            {/* Floating sparkles */}
            <motion.div
              className="absolute top-6 right-6"
              animate={{ rotate: [0, 360], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-primary/40" />
            </motion.div>
            <motion.div
              className="absolute top-12 left-6"
              animate={{ rotate: [360, 0], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 5, repeat: Infinity }}
            >
              <Sparkles className="w-3 h-3 text-secondary/30" />
            </motion.div>

            <motion.div 
              className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4 border border-primary/50"
              animate={{ 
                boxShadow: [
                  '0 0 10px rgba(6,182,212,0.2)',
                  '0 0 25px rgba(6,182,212,0.4)',
                  '0 0 10px rgba(6,182,212,0.2)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            >
              <Trophy className="text-primary w-10 h-10" />
            </motion.div>
            <h3 className="text-3xl font-bold text-white mb-2">Winner</h3>
            <motion.p 
              className="text-4xl font-black text-primary"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              TBA
            </motion.p>
            
            <div className="absolute bottom-0 left-0 right-0">
              <DataStreamLine color="primary" />
            </div>
          </motion.div>

          {/* 2nd Runner Up */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -5 }}
            className="w-full md:w-1/3 bg-dark-surface border border-gray-800 hover:border-amber-700/30 rounded-t-2xl p-6 text-center relative md:order-3 order-3 group transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
              <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-amber-600/20 to-transparent animate-scan-line" />
            </div>
            <motion.div 
              className="w-14 h-14 mx-auto bg-amber-700/10 rounded-full flex items-center justify-center mb-4"
              whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
            >
              <Award className="text-amber-600 w-7 h-7" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-2">2nd Runner Up</h3>
            <p className="text-2xl font-black text-amber-600">TBA</p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-8 bg-dark-surface/50 border border-gray-800 rounded-2xl max-w-2xl mx-auto animate-shimmer hover:border-primary/20 transition-colors duration-500"
        >
          <h3 className="text-2xl font-bold text-white mb-2">Special Awards</h3>
          <p className="text-gray-400">Exciting special track prizes, sponsor API awards, and goodies for all participants.</p>
        </motion.div>
      </div>
    </section>
  );
};

export default Prizes;
