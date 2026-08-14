import { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus, Download, Clock, TrendingUp, X, ChevronDown, ChevronUp, IndianRupee } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import StatsCard from '../../components/admin/StatsCard';
import { useAuth } from '../../contexts/AuthContext';
import * as XLSX from 'xlsx';

const AdminDashboard = () => {
  const { getAllParticipants } = useAuth();
  const [loading, setLoading] = useState(true);
  const [participants, setParticipants] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [viewingScreenshot, setViewingScreenshot] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadParticipants = useCallback(() => {
    try {
      setLoading(true);
      const data = getAllParticipants();
      // Also get registrations (payment is now embedded in registration)
      const registrations = JSON.parse(localStorage.getItem('trifusion_registrations') || '[]');
      
      // Merge all data
      const merged = data.map(p => {
        const reg = registrations.find(r => r.userId === p.id || (r.leader?.email && r.leader.email === p.email));
        return { ...p, registration: reg || null, payment: reg?.payment || null };
      });
      setParticipants(merged);
    } catch (error) {
      console.error('Failed to load participants:', error);
    } finally {
      setLoading(false);
    }
  }, [getAllParticipants]);

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
      
      // Base row with leader info
      const baseRow = {
        'S.No': index + 1,
        'Team Name': reg?.teamName || 'N/A',
        'Track': reg?.track || 'N/A',
        'College': reg?.college || 'N/A',
        'Leader Name': reg?.leader?.name || p.fullName || 'N/A',
        'Leader Email': reg?.leader?.email || p.email || 'N/A',
        'Leader Mobile': reg?.leader?.mobile || 'N/A',
        'Leader Department': reg?.leader?.department || 'N/A',
        'Leader Year': reg?.leader?.year || 'N/A',
        'Leader Roll No': reg?.leader?.rollNo || 'N/A',
        'Leader Gender': reg?.leader?.gender || 'N/A',
      };

      // Add member columns
      for (let i = 0; i < 3; i++) {
        const m = reg?.members?.[i];
        baseRow[`Member ${i+1} Name`] = m?.name || '';
        baseRow[`Member ${i+1} Email`] = m?.email || '';
        baseRow[`Member ${i+1} Mobile`] = m?.mobile || '';
        baseRow[`Member ${i+1} College`] = m?.college || '';
        baseRow[`Member ${i+1} Department`] = m?.department || '';
        baseRow[`Member ${i+1} Year`] = m?.year || '';
        baseRow[`Member ${i+1} Roll No`] = m?.rollNo || '';
        baseRow[`Member ${i+1} Gender`] = m?.gender || '';
      }

      // Payment info (payment is now embedded in registration)
      baseRow['Payment Status'] = reg?.status === 'PAID' ? 'PAID' : 'PENDING';
      baseRow['Transaction/UTR ID'] = reg?.payment?.utr || 'N/A';
      baseRow['Payment Amount'] = reg?.payment?.amount ? `₹${reg.payment.amount}` : 'N/A';
      baseRow['Payment File'] = reg?.payment?.screenshotName || 'N/A';
      baseRow['Paid At'] = reg?.payment?.paidAt ? new Date(reg.payment.paidAt).toLocaleString() : 'N/A';
      baseRow['Registration Date'] = reg?.submittedAt ? new Date(reg.submittedAt).toLocaleString() : 'N/A';
      baseRow['Google Sign-In Date'] = p.registeredAt ? new Date(p.registeredAt).toLocaleString() : 'N/A';

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
  const paidCount = participants.filter(p => p.registration?.status === 'PAID' && p.registration?.payment?.utr).length;
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
                              <div><span className="text-xs text-gray-500 block">Name</span><span className="text-sm font-medium text-gray-900">{reg.leader?.name}</span></div>
                              <div><span className="text-xs text-gray-500 block">Email</span><span className="text-sm font-medium text-gray-900 break-all">{reg.leader?.email}</span></div>
                              <div><span className="text-xs text-gray-500 block">Mobile</span><span className="text-sm font-medium text-gray-900">{reg.leader?.mobile}</span></div>
                              <div><span className="text-xs text-gray-500 block">Gender</span><span className="text-sm font-medium text-gray-900">{reg.leader?.gender}</span></div>
                              <div><span className="text-xs text-gray-500 block">Department</span><span className="text-sm font-medium text-gray-900">{reg.leader?.department}</span></div>
                              <div><span className="text-xs text-gray-500 block">Year</span><span className="text-sm font-medium text-gray-900">{reg.leader?.year}</span></div>
                              <div><span className="text-xs text-gray-500 block">Roll No</span><span className="text-sm font-medium text-gray-900">{reg.leader?.rollNo}</span></div>
                            </div>
                          </div>

                          {/* Members Details */}
                          <div>
                            <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Team Members ({reg.members?.length || 0})</h4>
                            <div className="space-y-3">
                              {reg.members?.map((m, i) => (
                                <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border border-gray-200">
                                  <div><span className="text-xs text-gray-500 block">Member {i+1} Name</span><span className="text-sm font-medium text-gray-900">{m.name}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Email</span><span className="text-sm font-medium text-gray-900 break-all">{m.email}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Mobile</span><span className="text-sm font-medium text-gray-900">{m.mobile}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Gender</span><span className="text-sm font-medium text-gray-900">{m.gender}</span></div>
                                  <div><span className="text-xs text-gray-500 block">College</span><span className="text-sm font-medium text-gray-900">{m.college}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Department</span><span className="text-sm font-medium text-gray-900">{m.department}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Year</span><span className="text-sm font-medium text-gray-900">{m.year}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Roll No</span><span className="text-sm font-medium text-gray-900">{m.rollNo}</span></div>
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
                                  <div><span className="text-xs text-gray-500 block">Amount</span><span className="text-sm font-bold text-emerald-600">₹1,600</span></div>
                                  <div><span className="text-xs text-gray-500 block">Transaction/UTR ID</span><span className="text-sm font-medium text-gray-900">{pay.utr || 'N/A'}</span></div>
                                  <div><span className="text-xs text-gray-500 block">Paid At</span><span className="text-sm font-medium text-gray-900">{pay.paidAt ? new Date(pay.paidAt).toLocaleString() : 'N/A'}</span></div>
                                </div>
                                {pay.screenshotData && (
                                  <div>
                                    <span className="text-xs text-gray-500 block mb-2">Payment Screenshot</span>
                                    <img 
                                      src={pay.screenshotData} 
                                      alt="Payment proof" 
                                      className="max-w-[200px] rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                                      onClick={() => setViewingScreenshot(pay.screenshotData)}
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
