import { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Download, Clock, TrendingUp, X, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';
import services from '../../services/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewingScreenshot, setViewingScreenshot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadParticipants = useCallback(async () => {
    try {
      setLoading(true);
      // Fetch registrations list from API
      const res = await services.admin.getRegistrations({ size: 1000 });
      const regs = res.data?.data?.content || [];
      
      // For each registration, fetch details (which includes payment)
      const mappedPromises = regs.map(async (r) => {
        let payment = null;
        try {
          // getRegistrationDetails returns RegistrationResponse { registration, payment }
          const detailRes = await services.admin.getRegistration(r.id);
          payment = detailRes.data?.data?.payment || null;
        } catch (e) {
          // Payment may not exist
        }
        
        return {
          id: r.id,
          fullName: r.leader?.fullName || 'Unknown',
          email: r.leader?.email || '',
          registeredAt: r.createdAt || new Date().toISOString(),
          registration: {
            teamName: r.teamName,
            track: r.track,
            college: r.collegeName,
            leader: r.leader,
            members: r.members,
            status: r.status,
            submittedAt: r.createdAt,
          },
          payment: payment
        };
      });
      
      const mapped = await Promise.all(mappedPromises);
      setParticipants(mapped);
    } catch (error) {
      console.error('Failed to load participants:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadParticipants();
  }, [loadParticipants]);

  const filteredParticipants = participants.filter(p => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.fullName?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.registration?.teamName?.toLowerCase().includes(q) ||
      p.registration?.college?.toLowerCase().includes(q) ||
      p.registration?.track?.toLowerCase().includes(q)
    );
  });

  const handleDownloadXlsx = () => {
    if (participants.length === 0) {
      alert('No participants registered yet.');
      return;
    }

    const excelData = [];
    participants.forEach((p, index) => {
      const reg = p.registration;
      const pay = p.payment;
      // Base row with leader info
      const baseRow = {
        'S.No': index + 1,
        'Team Name': reg?.teamName || 'N/A',
        'Track': reg?.track || 'N/A',
        'College': reg?.college || 'N/A',
        'Leader Name': reg?.leader?.fullName || p.fullName || 'N/A',
        'Leader Email': reg?.leader?.email || p.email || 'N/A',
        'Leader Mobile': reg?.leader?.phone || 'N/A',
        'Leader Department': reg?.leader?.department || 'N/A',
        'Leader Year': reg?.leader?.yearOfStudy || 'N/A',
        'Leader Roll No': reg?.leader?.rollNumber || 'N/A',
        'Leader Gender': reg?.leader?.gender || 'N/A',
        'Leader Accommodation': reg?.leader?.needsAccommodation ? 'Yes' : 'No',
      };

      // Add member columns
      for (let i = 0; i < 3; i++) {
        const m = reg?.members?.[i];
        baseRow[`Member ${i+1} Name`] = m?.fullName || '';
        baseRow[`Member ${i+1} Email`] = m?.email || '';
        baseRow[`Member ${i+1} Mobile`] = m?.phone || '';
        baseRow[`Member ${i+1} College`] = m?.collegeName || '';
        baseRow[`Member ${i+1} Department`] = m?.department || '';
        baseRow[`Member ${i+1} Year`] = m?.yearOfStudy || '';
        baseRow[`Member ${i+1} Roll No`] = m?.rollNumber || '';
        baseRow[`Member ${i+1} Gender`] = m?.gender || '';
        baseRow[`Member ${i+1} Accommodation`] = m ? (m.needsAccommodation ? 'Yes' : 'No') : '';
      }

      // Payment info (payment is now embedded in registration)
      baseRow['Payment Status'] = pay?.status || 'NO PAYMENT';
      baseRow['Transaction/UTR ID'] = pay?.utrNumber || 'N/A';
      baseRow['Payment Amount'] = pay?.amount ? `₹${pay.amount}` : 'N/A';
      baseRow['Payment Screenshot'] = pay?.screenshotUrl || 'N/A';
      baseRow['Submitted At'] = pay?.submittedAt ? new Date(pay.submittedAt).toLocaleString() : 'N/A';
      baseRow['Registration Date'] = reg?.submittedAt ? new Date(reg.submittedAt).toLocaleString() : 'N/A';
      baseRow['Google Sign-In Date'] = p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A';

      // Calculate Accommodation stats
      const accMembers = [reg?.leader, ...(reg?.members || [])].filter(m => m?.needsAccommodation);
      const accBoys = accMembers.filter(m => m.gender === 'Male').length;
      const accGirls = accMembers.filter(m => m.gender === 'Female').length;
      
      baseRow['Accommodation Boys'] = accBoys;
      baseRow['Accommodation Girls'] = accGirls;
      baseRow['Total Accommodation'] = accBoys + accGirls;

      excelData.push(baseRow);
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Registrations');

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...excelData.map(row => String(row[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `TRIFUSION26_Full_Data_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const registeredCount = participants.filter(p => p.registration).length;
  const paidCount = participants.filter(p => p.payment).length;
  const todayCount = participants.filter(p => {
    const reg = new Date(p.registeredAt);
    const now = new Date();
    return reg.toDateString() === now.toDateString();
  }).length;

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Admin Dashboard">
      {/* Stats */}
      <div className="mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Sign-Ins" value={participants.length} icon={Users} color="cyan" delay={1} />
          <StatsCard title="Teams Registered" value={registeredCount} icon={UserPlus} color="violet" delay={2} />
          <StatsCard title="Payments Submitted" value={paidCount} icon={IndianRupee} color="emerald" delay={3} />
          <StatsCard title="Today's Sign-Ins" value={todayCount} icon={TrendingUp} color="blue" delay={4} />
        </div>
      </div>

      {/* Download + Search */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex-1 w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, team, college, track..."
              className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadXlsx} 
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download XLSX (Full Data)
            </button>
            <button 
              onClick={loadParticipants}
              className="flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 cursor-pointer px-3 py-2.5"
            >
              <Clock className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div>
        <h2 className="text-lg font-medium text-gray-900 mb-4">All Participants ({filteredParticipants.length})</h2>
        
        {filteredParticipants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No participants found</h3>
            <p className="text-sm text-gray-400">Participants will appear here once they sign in with Google.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredParticipants.map((p, idx) => {
              const reg = p.registration;
              const pay = p.payment;
              const isExpanded = expandedRow === idx;

              return (
                <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  {/* Summary Row */}
                  <div 
                    onClick={() => setExpandedRow(isExpanded ? null : idx)}
                    className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-xs text-gray-400 w-6">{idx + 1}</span>
                    {p.profilePicture ? (
                      <img src={p.profilePicture} alt={p.fullName} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center text-sm font-bold">
                        {(p.fullName || '?')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">{p.fullName || 'Unknown'}</div>
                      <div className="text-xs text-gray-500 truncate">{p.email}</div>
                    </div>
                    <div className="hidden md:block text-sm text-gray-600 max-w-[150px] truncate">
                      {reg?.teamName || '—'}
                    </div>
                    <div className="flex items-center gap-2">
                      {reg ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">Registered</span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">Sign-in only</span>
                      )}
                      {pay ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">Paid</span>
                      ) : reg ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-50 text-amber-700 font-medium">Unpaid</span>
                      ) : null}
                    </div>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </div>

                  {/* Expanded Details */}
                  {isExpanded && (
                    <div className="border-t border-gray-200 p-6 bg-gray-50">
                      {!reg ? (
                        <p className="text-gray-500 text-sm">This user has only signed in with Google. No team registration submitted yet.</p>
                      ) : (
                        <div className="space-y-6">
                          {/* Team Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Team Details</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div><span className="text-xs text-gray-500 block">Team Name</span><span className="text-sm font-medium text-gray-900">{reg.teamName}</span></div>
                              <div><span className="text-xs text-gray-500 block">Track</span><span className="text-sm font-medium text-gray-900">{reg.track}</span></div>
                              <div className="col-span-2"><span className="text-xs text-gray-500 block">College</span><span className="text-sm font-medium text-gray-900">{reg.college}</span></div>
                            </div>
                          </div>

                          {/* Leader Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Team Leader</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
                              <div><span className="text-xs text-gray-500 block">Name</span><span className="text-sm font-medium text-gray-900">{reg.leader?.fullName}</span></div>
                              <div><span className="text-xs text-gray-500 block">Email</span><span className="text-sm font-medium text-gray-900 break-all">{reg.leader?.email}</span></div>
                              <div><span className="text-xs text-gray-500 block">Mobile</span><span className="text-sm font-medium text-gray-900">{reg.leader?.phone}</span></div>
                              <div><span className="text-xs text-gray-500 block">Gender</span><span className="text-sm font-medium text-gray-900">{reg.leader?.gender}</span></div>
                              <div><span className="text-xs text-gray-500 block">Department</span><span className="text-sm font-medium text-gray-900">{reg.leader?.department}</span></div>
                              <div><span className="text-xs text-gray-500 block">Year</span><span className="text-sm font-medium text-gray-900">{reg.leader?.yearOfStudy}</span></div>
                              <div><span className="text-xs text-gray-500 block">Roll No</span><span className="text-sm font-medium text-gray-900">{reg.leader?.rollNumber}</span></div>
                              <div><span className="text-xs text-gray-500 block">Accommodation</span><span className="text-sm font-medium text-gray-900">{reg.leader?.needsAccommodation ? 'Yes' : 'No'}</span></div>
                            </div>
                          </div>

                          {/* Members Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Team Members ({reg.members?.length || 0})</h4>
                            <div className="space-y-3">
                              {reg.members?.map((m, i) => (
                                <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
                                  <div><span className="text-xs text-gray-500 block">Member {i+1} Name</span><span className="text-sm font-medium text-gray-900">{m.fullName}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Email</span><span className="text-sm font-medium text-gray-900 break-all">{m.email}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Mobile</span><span className="text-sm font-medium text-gray-900">{m.phone}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Gender</span><span className="text-sm font-medium text-gray-900">{m.gender}</span></div>
                                  <div><span className="text-xs text-gray-500 block">College</span><span className="text-sm font-medium text-gray-900">{m.collegeName}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Department</span><span className="text-sm font-medium text-gray-900">{m.department}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Year</span><span className="text-sm font-medium text-gray-900">{m.yearOfStudy}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Roll No</span><span className="text-sm font-medium text-gray-900">{m.rollNumber}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Accommodation</span><span className="text-sm font-medium text-gray-900">{m.needsAccommodation ? 'Yes' : 'No'}</span></div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Payment</h4>
                            {pay ? (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div><span className="text-xs text-gray-500 block">Amount</span><span className="text-sm font-bold text-emerald-600">₹{pay.amount || '1,600'}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Transaction/UTR ID</span><span className="text-sm font-medium text-gray-900">{pay.utrNumber || 'N/A'}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Status</span><span className="text-sm font-medium text-gray-900">{pay.status || 'PENDING'}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Submitted At</span><span className="text-sm font-medium text-gray-900">{pay.submittedAt ? new Date(pay.submittedAt).toLocaleString() : 'N/A'}</span></div>
                                </div>
                                {pay.screenshotUrl && (
                                  <div>
                                    <span className="text-xs text-gray-500 block mb-2">Payment Screenshot</span>
                                    <img 
                                      src={pay.screenshotUrl} 
                                      alt="Payment proof" 
                                      className="max-w-[200px] rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => setViewingScreenshot(pay.screenshotUrl)}
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                <span className="text-amber-700 text-sm font-medium">⚠️ Payment not yet submitted</span>
                              </div>
                            )}
                          </div>

                          {/* Timestamps */}
                          <div className="text-xs text-gray-400 flex gap-6">
                            <span>Google Sign-In: {p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A'}</span>
                            <span>Registration: {reg.submittedAt ? new Date(reg.submittedAt).toLocaleString() : 'N/A'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Screenshot Modal */}
      {viewingScreenshot && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setViewingScreenshot(null)}>
          <div className="relative max-w-2xl max-h-[90vh]">
            <button 
              onClick={() => setViewingScreenshot(null)} 
              className="absolute -top-10 right-0 text-white hover:text-gray-300 cursor-pointer"
            >
              <X className="w-8 h-8" />
            </button>
            <img src={viewingScreenshot} alt="Payment screenshot" className="max-h-[85vh] rounded-lg" />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
