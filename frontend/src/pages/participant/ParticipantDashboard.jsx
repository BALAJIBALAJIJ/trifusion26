import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, AlertCircle } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import { useAuth } from '../../contexts/AuthContext';

import services from '../../services/api';



const ParticipantDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  useEffect(() => {
    if (user?.id) {
      const fetchRegistration = async () => {
        try {
          const res = await services.registrations.getMine();
          if (res.data?.data) {
            setRegistration(res.data.data);
          }
        } catch (err) {
          console.log("No registration found");
        }
      };
      fetchRegistration();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-dark font-body text-gray-200 p-6 md:p-12 lg:px-24 pt-24">
      <div className="max-w-6xl mx-auto space-y-8">
        
        <BackButton to="/" label="Back to Home" />
        
        {/* Header */}
        <div className="bg-dark-card border border-gray-800 rounded-xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center gap-4">
            {user?.profilePicture && (
              <img src={user.profilePicture} alt="Profile" className="w-14 h-14 rounded-full border-2 border-cyan-500/50" referrerPolicy="no-referrer" />
            )}
            <div>
              <h1 className="text-3xl font-heading font-bold text-white mb-1">Welcome, {user?.fullName || user?.name || 'Participant'}</h1>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/participant/registration')}
            className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            {registration ? 'Edit Registration' : 'Start Registration'}
          </button>
        </div>

        {/* Registration Status */}
        <div className="bg-dark-card border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-heading font-semibold text-white mb-6">Registration Status</h2>
          
          {!registration ? (
            <div className="text-center py-12">
              <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4 opacity-80" />
              <h3 className="text-xl font-heading text-white mb-2">No Registration Found</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                You haven&apos;t registered for TRIFUSION&apos;26 yet. Click the button below to start your team registration.
              </p>
              <button 
                onClick={() => navigate('/participant/registration')}
                className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
              >
                Register Now →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-emerald-400 font-medium">Registration Submitted</span>
                <span className="text-gray-500 text-sm ml-auto">
                  {new Date(registration.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
            </div>
          )}
        </div>

        {registration && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Team Info */}
              <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-violet-500/20 text-violet-400 rounded-lg"><Users className="w-6 h-6" /></div>
                  <h2 className="text-xl font-heading font-semibold text-white">Team Info</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Team Name</span>
                    <span className="font-medium text-white">{registration.teamName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Track</span>
                    <span className="font-medium text-cyan-400 text-right max-w-[220px]">{registration.track}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">College</span>
                    <span className="font-medium text-white text-right max-w-[200px]">{registration.collegeName}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-800 pb-3">
                    <span className="text-gray-400">Members</span>
                    <span className="font-medium text-white">{1 + (registration.members?.length || 0)}</span>
                  </div>
                  <div className="pt-2">
                    <button onClick={() => navigate('/participant/registration')} className="text-sm text-cyan-500 hover:text-cyan-400 flex items-center cursor-pointer">
                      Edit Details <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Team Members List */}
              <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg"><Users className="w-6 h-6" /></div>
                  <h2 className="text-xl font-heading font-semibold text-white">Team Members</h2>
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-medium">Leader</span>
                      <span className="text-white font-medium text-sm">{registration.leader?.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{registration.leader?.email} · {registration.leader?.department}</span>
                  </div>
                  {registration.members?.map((m, i) => (
                    <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-medium">Member {i + 1}</span>
                        <span className="text-white font-medium text-sm">{m.name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{m.email} · {m.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>


          </>
        )}

      </div>
    </div>
  );
};

export default ParticipantDashboard;
