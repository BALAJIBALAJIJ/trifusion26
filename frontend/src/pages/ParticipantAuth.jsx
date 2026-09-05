import { Link } from 'react-router-dom';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';

const ParticipantAuth = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-4 z-10"
      >
        <BackButton to="/" label="Back to Home" />
        <Card variant="glass-dark" className="p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                <span className="text-4xl">🚫</span>
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-heading font-bold text-red-400 mb-2"
            >
              Registration Closed
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-400"
            >
              Participant registration for TRIFUSION&apos;26 has ended. Thank you for your interest!
            </motion.p>
          </div>

          {/* Info Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
              <p className="text-gray-400 text-sm">
                The registration deadline has passed. No new registrations are being accepted.
              </p>
            </div>

            <Link 
              to="/"
              className="block w-full text-center px-6 py-3 bg-primary/20 border border-primary/30 text-primary rounded-xl hover:bg-primary/30 transition-colors font-medium"
            >
              ← Back to Home
            </Link>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticipantAuth;
