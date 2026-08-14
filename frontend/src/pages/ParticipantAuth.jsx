import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import { motion } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import BackButton from '../components/ui/BackButton';

const ParticipantAuth = () => {
  const [loading, setLoading] = useState(false);
  const { googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      await googleLogin(credentialResponse);
      toast.success("Welcome to TRIFUSION'26! 🚀");
      navigate('/participant/dashboard');
    } catch (error) {
      console.error('Google login error:', error);
      toast.error("Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google Sign-In was cancelled or failed. Please try again.");
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md px-4 z-10"
      >
        <BackButton to="/login" label="Back to Role Selection" />
        <Card variant="glass-dark" className="p-8 overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <img 
                src="/assets/trifusion-logo.png" 
                alt="TRIFUSION'26 Logo" 
                className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-heading font-bold text-white mb-2"
            >
              Join TRIFUSION&apos;26
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-gray-400"
            >
              Sign in with your Google account to register for the hackathon
            </motion.p>
          </div>

          {/* Google Sign-In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            {/* Custom Google Button wrapper */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-full flex justify-center bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="filled_black"
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width="300"
                  logo_alignment="center"
                />
              </div>
              
              {loading && (
                <div className="flex items-center gap-2 text-primary">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Signing you in...</span>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Secure Sign-In</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            {/* Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/10 rounded-lg">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-gray-400">
                  Your Google account info (name, email, profile picture) will be used for hackathon registration.
                </p>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-secondary/5 border border-secondary/10 rounded-lg">
                <svg className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-xs text-gray-400">
                  We use industry-standard OAuth 2.0 for secure authentication. We never see your password.
                </p>
              </div>
            </div>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ParticipantAuth;
