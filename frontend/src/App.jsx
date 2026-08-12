import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './components/ui/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ScrollToTop from './components/ui/ScrollToTop';

// Lazy loading pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const ParticipantAuth = lazy(() => import('./pages/ParticipantAuth'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));

// Participant pages
const ParticipantDashboard = lazy(() => import('./pages/participant/ParticipantDashboard'));
const RegistrationForm = lazy(() => import('./pages/participant/RegistrationForm'));
const PaymentPage = lazy(() => import('./pages/participant/PaymentPage'));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminRegistrations = lazy(() => import('./pages/admin/AdminRegistrations'));
const AdminRegistrationDetail = lazy(() => import('./pages/admin/AdminRegistrationDetail'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminExport = lazy(() => import('./pages/admin/AdminExport'));

// Google OAuth Client ID - Replace with your own from Google Cloud Console
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastProvider />
        <ScrollToTop />
        <div className="min-h-screen flex flex-col font-body bg-dark text-white">
          <Navbar />
          <main className="flex-grow">
            <Suspense fallback={<div className="h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<RoleSelection />} />
                
                {/* Participant Routes */}
                <Route path="/participant/register" element={<ParticipantAuth />} />
                <Route path="/participant/dashboard" element={<ProtectedRoute><ParticipantDashboard /></ProtectedRoute>} />
                <Route path="/participant/registration" element={<ProtectedRoute><RegistrationForm /></ProtectedRoute>} />
                <Route path="/participant/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/registrations" element={<ProtectedRoute requireAdmin><AdminRegistrations /></ProtectedRoute>} />
                <Route path="/admin/registrations/:id" element={<ProtectedRoute requireAdmin><AdminRegistrationDetail /></ProtectedRoute>} />
                <Route path="/admin/settings" element={<ProtectedRoute requireAdmin><AdminSettings /></ProtectedRoute>} />
                <Route path="/admin/export" element={<ProtectedRoute requireAdmin><AdminExport /></ProtectedRoute>} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
