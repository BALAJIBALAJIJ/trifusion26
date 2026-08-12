import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { motion } from 'framer-motion';
import BackButton from '../components/ui/BackButton';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setLoading(true);
    try {
      await adminLogin(email, password);
      toast.success("Login successful!");
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4 z-10"
      >
        <BackButton to="/login" label="Back to Role Selection" />
        <Card variant="glass-dark" className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-heading font-bold text-white mb-2">Admin Portal</h1>
            <p className="text-gray-400">Sign in to access the command center.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Admin Email" 
              type="email" 
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input 
              label="Password" 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div className="pt-4">
              <Button 
                type="submit" 
                variant="secondary" 
                className="w-full"
                isLoading={loading}
              >
                Access Command Center
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
