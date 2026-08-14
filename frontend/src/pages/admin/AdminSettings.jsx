import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminSettings = () => {
  const [showPassword, setShowPassword] = useState(false);

  // These match the hardcoded credentials in AuthContext.jsx
  const adminEmail = 'svhectrifusion2026@gmail.com';
  const adminPassword = 'svhec@7325';

  return (
    <AdminLayout title="Settings">
      <div className="max-w-2xl">
        {/* Admin Credentials Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Admin Login Credentials</h2>
              <p className="text-sm text-gray-500">Your admin account details</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" /> Email Address
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-gray-800 font-mono text-sm flex-1 select-all">{adminEmail}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(adminEmail); }}
                  className="text-xs text-cyan-600 hover:text-cyan-500 font-medium ml-3 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5 flex items-center gap-2">
                <Lock className="w-4 h-4 text-gray-400" /> Password
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                <span className="text-gray-800 font-mono text-sm flex-1 select-all">
                  {showPassword ? adminPassword : '••••••••••'}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 ml-3 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => { navigator.clipboard.writeText(adminPassword); }}
                  className="text-xs text-cyan-600 hover:text-cyan-500 font-medium ml-3 cursor-pointer"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <p className="font-medium mb-1">⚠️ Security Notice</p>
              <p className="text-amber-600 text-xs">These are the admin credentials used to log in at <span className="font-mono">/admin/login</span>. Keep them secure and do not share with unauthorized persons.</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
