import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const BackButton = ({ to, label = 'Back', variant = 'dark' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const isDark = variant === 'dark';

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={`
        group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium
        transition-all duration-300 cursor-pointer mb-6
        ${isDark 
          ? 'text-gray-400 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30' 
          : 'text-gray-500 hover:text-cyan-600 bg-gray-100 hover:bg-cyan-50 border border-gray-200 hover:border-cyan-300'
        }
      `}
    >
      <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
      {label}
    </motion.button>
  );
};

export default BackButton;
