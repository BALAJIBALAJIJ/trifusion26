import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Admin credentials (hardcoded fallback)
const ADMIN_EMAIL = 'svhectrifusion2026@gmail.com';
const ADMIN_PASSWORD = 'svhec@7325';

// Helper to get participants from localStorage (fallback)
const getStoredParticipants = () => {
  try {
    return JSON.parse(localStorage.getItem('trifusion_participants') || '[]');
  } catch {
    return [];
  }
};

// Helper to store a participant (fallback)
const storeParticipant = (participant) => {
  const participants = getStoredParticipants();
  const existingIndex = participants.findIndex(p => p.email === participant.email);
  if (existingIndex >= 0) {
    participants[existingIndex] = { ...participants[existingIndex], ...participant, lastLogin: new Date().toISOString() };
  } else {
    participants.push({
      ...participant,
      id: `participant-${Date.now()}`,
      registeredAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      status: 'REGISTERED'
    });
  }
  localStorage.setItem('trifusion_participants', JSON.stringify(participants));
  return participants;
};

// Decode Google JWT (no library needed)
const decodeGoogleJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c =>
        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
      ).join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode Google JWT:', error);
    throw new Error('Invalid Google credential');
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [backendAvailable, setBackendAvailable] = useState(null); // null = unknown, true/false

  useEffect(() => {
    // Immediately restore from localStorage (instant)
    const savedUser = localStorage.getItem('trifusion_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('trifusion_user');
      }
    }
    setLoading(false);

    // Background: check if backend is available (non-blocking)
    checkBackendAvailability();
  }, []);

  const checkBackendAvailability = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const res = await api.get('/auth/me', { timeout: 1500 });
        const userData = res.data?.data;
        if (userData) {
          const u = {
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            profilePicture: userData.profilePicture,
            role: userData.role,
          };
          setUser(u);
          localStorage.setItem('trifusion_user', JSON.stringify(u));
          setBackendAvailable(true);
          return;
        }
      } catch {
        // Ignore - will try ping below
      }
    }

    try {
      await api.get('/health', { timeout: 1500 });
      setBackendAvailable(true);
    } catch (err) {
      setBackendAvailable(err.response ? true : false);
    }
  };

  // Admin login - tries API first, falls back to local
  const adminLogin = async (email, password) => {
    // Try backend API first
    if (backendAvailable !== false) {
      try {
        const res = await api.post('/auth/admin-login', { email, password });
        const data = res.data?.data;
        if (data?.token) {
          localStorage.setItem('token', data.token);
          const userData = {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            profilePicture: data.profilePicture,
            role: data.role,
          };
          setUser(userData);
          localStorage.setItem('trifusion_user', JSON.stringify(userData));
          setBackendAvailable(true);
          return userData;
        }
      } catch (err) {
        if (err.response) {
          // Backend responded with error (wrong credentials)
          throw err;
        }
        // Network error - backend not available, fall through to local
        console.log('Backend not available, using local auth');
        setBackendAvailable(false);
      }
    }

    // Fallback: local admin login
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const userData = {
        id: 'admin-1',
        email: ADMIN_EMAIL,
        fullName: 'TRIFUSION Admin',
        role: 'ADMIN',
        profilePicture: null
      };
      setUser(userData);
      localStorage.setItem('trifusion_user', JSON.stringify(userData));
      return userData;
    } else {
      throw { response: { data: { message: 'Invalid admin credentials. Access denied.' } } };
    }
  };

  // Google Sign-In - tries API first, falls back to local
  const googleLogin = async (credentialResponse) => {
    // Try backend API first
    if (backendAvailable !== false) {
      try {
        const res = await api.post('/auth/google', {
          credential: credentialResponse.credential,
        });
        const data = res.data?.data;
        if (data?.token) {
          localStorage.setItem('token', data.token);
          const userData = {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            profilePicture: data.profilePicture,
            role: data.role,
          };
          setUser(userData);
          localStorage.setItem('trifusion_user', JSON.stringify(userData));
          setBackendAvailable(true);
          return userData;
        }
      } catch (err) {
        if (err.response) {
          throw err;
        }
        console.log('Backend not available, using local auth');
        setBackendAvailable(false);
      }
    }

    // Fallback: local Google login
    const decoded = decodeGoogleJwt(credentialResponse.credential);
    const userData = {
      id: `google-${decoded.sub}`,
      email: decoded.email,
      fullName: decoded.name,
      profilePicture: decoded.picture,
      role: 'PARTICIPANT',
      googleId: decoded.sub
    };
    storeParticipant(userData);
    setUser(userData);
    localStorage.setItem('trifusion_user', JSON.stringify(userData));
    return userData;
  };

  // Legacy login (kept for compatibility)
  const login = async (email, password) => {
    throw { response: { data: { message: 'Please use "Continue with Google" to sign in.' } } };
  };

  // Legacy register (kept for compatibility)
  const register = async (formData) => {
    throw { response: { data: { message: 'Please use "Continue with Google" to register.' } } };
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('trifusion_user');
    setUser(null);
  };

  // Get all participants (for admin) - tries API first, falls back to localStorage
  const getAllParticipants = () => {
    // This is sync for localStorage fallback; API version would be async
    const participants = getStoredParticipants();
    try {
      const registrations = JSON.parse(localStorage.getItem('trifusion_registrations') || '[]');
      return participants.map(p => {
        const reg = registrations.find(r => r.userId === p.id || (r.leader?.email && r.leader.email === p.email));
        return { ...p, registration: reg || null };
      });
    } catch {
      return participants;
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    backendAvailable,
    login,
    adminLogin,
    googleLogin,
    register,
    logout,
    getAllParticipants,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
