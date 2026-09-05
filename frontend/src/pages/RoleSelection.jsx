import { Link } from 'react-router-dom';
import BackButton from '../components/ui/BackButton';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';

const RoleSelection = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      
      <div className="container mx-auto px-4 z-10">
        <BackButton to="/" label="Back to Home" />
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-heading font-bold mb-4 neon-text"
          >
            Admin Portal
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Sign in to access the TRIFUSION&apos;26 command center.
          </motion.p>
        </div>

        {/* Registration Closed Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="max-w-xl mx-auto mb-8"
        >
          <div className="text-center p-5 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-md">
            <span className="text-xl md:text-2xl font-heading font-bold text-red-400">🚫 Registration Closed</span>
            <p className="text-gray-400 text-sm mt-2">Participant registration for TRIFUSION&apos;26 has ended. Thank you for your interest!</p>
          </div>
        </motion.div>

        <div className="flex justify-center max-w-md mx-auto">
          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.4 }}
             className="w-full"
          >
            <Link to="/admin/login" className="block h-full">
              <Card variant="glow" className="h-full p-8 flex flex-col items-center justify-center text-center group min-h-[300px] hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-heading font-bold mb-3 group-hover:text-secondary transition-colors">Administrator</h2>
                <p className="text-gray-400">Manage registrations, verify payments, and oversee the entire event.</p>
              </Card>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;
