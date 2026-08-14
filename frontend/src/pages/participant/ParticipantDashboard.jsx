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
          // Backend returns ApiResponse<RegistrationResponse> where RegistrationResponse has { registration, payment }
          if (res.data?.data?.registration) {
            setRegistration(res.data.data.registration);
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
          {!registration && (
            <button 
              onClick={() => navigate('/participant/registration')}
              className="mt-4 md:mt-0 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Start Registration
            </button>
          )}
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
                  {new Date(registration.createdAt || registration.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                      <span className="text-white font-medium text-sm">{registration.leader?.fullName || registration.leader?.name}</span>
                    </div>
                    <span className="text-gray-500 text-xs">{registration.leader?.email} · {registration.leader?.department}</span>
                  </div>
                  {registration.members?.map((m, i) => (
                    <div key={i} className="p-3 bg-gray-900/50 rounded-lg border border-gray-800">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs bg-violet-500/20 text-violet-400 px-2 py-0.5 rounded font-medium">Member {i + 1}</span>
                        <span className="text-white font-medium text-sm">{m.fullName || m.name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{m.email} · {m.department}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* WhatsApp Groups */}
            <div className="bg-dark-card border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <h2 className="text-xl font-heading font-semibold text-white">Join WhatsApp Groups</h2>
              </div>
              <div className="space-y-4">
                {/* Hackathon Group - Team Leaders Only */}
                <a 
                  href="https://chat.whatsapp.com/Gqc5KlgQLJFFkjIlqmKS7w?s=qt&p=a&ilr=0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors group"
                >
                  <div>
                    <span className="text-white font-medium block">TRIFUSION'26 HACKATHON</span>
                    <span className="text-emerald-400 text-xs">⚠️ Team Leaders Only</span>
                  </div>
                  <span className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-emerald-400 transition-colors">
                    Join Group →
                  </span>
                </a>

                {/* Accommodation Group */}
                <a 
                  href="https://chat.whatsapp.com/JXidvjtldYQ1AbCTI77uoQ?s=qt&p=a&ilr=4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg hover:bg-blue-500/20 transition-colors group"
                >
                  <div>
                    <span className="text-white font-medium block">TRIFUSION'26 ACCOMMODATION</span>
                    <span className="text-blue-400 text-xs">🏨 For members who need accommodation</span>
                  </div>
                  <span className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium group-hover:bg-blue-400 transition-colors">
                    Join Group →
                  </span>
                </a>
              </div>
            </div>

          </>
        )}

      </div>
    </div>
  );
};

export default ParticipantDashboard;
