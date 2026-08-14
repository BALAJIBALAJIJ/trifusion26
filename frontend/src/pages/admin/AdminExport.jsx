import { useState, useEffect } from 'react';
import { Download, Image, FileText, Users, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import * as XLSX from 'xlsx';

// Helper to get paid registrations
const getPaidRegistrations = () => {
  try {
    const registrations = JSON.parse(localStorage.getItem('trifusion_registrations') || '[]');
    return registrations.filter(r => r.status === 'PAID' && r.payment?.utr);
  } catch {
    return [];
  }
};

const AdminExport = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedTeams, setExpandedTeams] = useState({});

  const fetchData = () => {
    setLoading(true);
    const data = getPaidRegistrations();
    setRegistrations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleTeam = (index) => {
    setExpandedTeams(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const expandAll = () => {
    const all = {};
    registrations.forEach((_, i) => { all[i] = true; });
    setExpandedTeams(all);
  };

  const collapseAll = () => {
    setExpandedTeams({});
  };

  // Download a single screenshot
  const downloadScreenshot = (reg) => {
    if (!reg.payment?.screenshotData) return;
    const link = document.createElement('a');
    link.href = reg.payment.screenshotData;
    const ext = reg.payment.screenshotType === 'application/pdf' ? '.pdf' : '.png';
    const teamName = (reg.teamName || 'team').replace(/[^a-zA-Z0-9]/g, '_');
    const leaderName = (reg.leader?.name || '').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `${teamName}_${leaderName}_payment${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download ALL screenshots
  const downloadAllScreenshots = () => {
    const regsWithScreenshots = registrations.filter(r => r.payment?.screenshotData);
    if (regsWithScreenshots.length === 0) {
      alert('No payment screenshots to download.');
      return;
    }
    regsWithScreenshots.forEach((reg, index) => {
      setTimeout(() => downloadScreenshot(reg), index * 500);
    });
  };

  // Export full A-to-Z XLSX
  const handleExportXlsx = () => {
    if (registrations.length === 0) {
      alert('No data to export.');
      return;
    }

    const excelData = [];
    registrations.forEach((reg, index) => {
      const row = {
        'S.No': index + 1,
        'Team Name': reg.teamName || '',
        'Track': reg.track || '',
        'College': reg.college || '',
        'Leader Name': reg.leader?.name || '',
        'Leader Email': reg.leader?.email || '',
        'Leader Mobile': reg.leader?.mobile || '',
        'Leader Gender': reg.leader?.gender || '',
        'Leader Department': reg.leader?.department || '',
        'Leader Year': reg.leader?.year || '',
        'Leader Roll No': reg.leader?.rollNo || '',
      };

      (reg.members || []).forEach((m, mi) => {
        const num = mi + 1;
        row[`Member ${num} Name`] = m.name || '';
        row[`Member ${num} Email`] = m.email || '';
        row[`Member ${num} Mobile`] = m.mobile || '';
        row[`Member ${num} Gender`] = m.gender || '';
        row[`Member ${num} College`] = m.college || '';
        row[`Member ${num} Department`] = m.department || '';
        row[`Member ${num} Year`] = m.year || '';
        row[`Member ${num} Roll No`] = m.rollNo || '';
      });

      row['Payment Amount'] = reg.payment?.amount || '';
      row['UTR / Ref No'] = reg.payment?.utr || '';
      row['Payment File Name'] = reg.payment?.screenshotName || '';
      row['Payment File Type'] = reg.payment?.screenshotType || '';
      row['Paid At'] = reg.payment?.paidAt ? new Date(reg.payment.paidAt).toLocaleString('en-IN') : '';
      row['Submitted At'] = reg.submittedAt ? new Date(reg.submittedAt).toLocaleString('en-IN') : '';
      row['Status'] = reg.status || '';

      excelData.push(row);
    });

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Paid Registrations');

    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...excelData.map(row => String(row[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `TRIFUSION26_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export everything — Excel + all screenshots
  const handleExportAll = () => {
    handleExportXlsx();
    setTimeout(() => downloadAllScreenshots(), 1000);
  };

  if (loading) {
    return (
      <AdminLayout title="Export Data">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Export Data">
      {/* Action Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">{registrations.length} Paid Registration{registrations.length !== 1 ? 's' : ''}</h2>
              <p className="text-sm text-gray-500">Complete A-to-Z data of all teams who completed payment</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button onClick={fetchData} className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border border-gray-200 cursor-pointer">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={handleExportXlsx} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 border border-emerald-200 cursor-pointer">
              <Download className="w-4 h-4" /> Excel (All Data)
            </button>
            <button onClick={downloadAllScreenshots} className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 border border-purple-200 cursor-pointer">
              <Image className="w-4 h-4" /> All Screenshots
            </button>
            <button onClick={handleExportAll} className="flex items-center gap-2 bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-cyan-500 shadow-sm cursor-pointer">
              <Download className="w-4 h-4" /> Export Everything
            </button>
          </div>
        </div>
      </div>

      {/* View controls */}
      {registrations.length > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <button onClick={expandAll} className="text-xs text-cyan-600 hover:text-cyan-500 font-medium cursor-pointer">Expand All</button>
          <span className="text-gray-300">|</span>
          <button onClick={collapseAll} className="text-xs text-gray-500 hover:text-gray-700 font-medium cursor-pointer">Collapse All</button>
        </div>
      )}

      {/* Team Cards */}
      {registrations.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No paid registrations yet</h3>
          <p className="text-sm text-gray-400">Only teams that complete payment will appear here for export.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {registrations.map((reg, index) => (
            <div key={reg.id || index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Team Header (always visible) */}
              <button
                onClick={() => toggleTeam(index)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="text-base font-bold text-gray-800">{reg.teamName}</h3>
                    <p className="text-xs text-gray-500">{reg.leader?.name} • {reg.college}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">₹{reg.payment?.amount || '1600'} Paid</span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{(reg.members || []).length + 1} members</span>
                  {expandedTeams[index] ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedTeams[index] && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4">
                    
                    {/* Team Info */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">Team Information</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500 block text-xs">Team Name</span><span className="text-gray-800 font-medium">{reg.teamName}</span></div>
                        <div><span className="text-gray-500 block text-xs">Track</span><span className="text-gray-800 font-medium">{reg.track}</span></div>
                        <div className="col-span-2"><span className="text-gray-500 block text-xs">College</span><span className="text-gray-800 font-medium">{reg.college}</span></div>
                      </div>

                      {/* Leader */}
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1 mt-4">Team Leader</h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="text-gray-500 block text-xs">Name</span><span className="text-gray-800 font-medium">{reg.leader?.name}</span></div>
                        <div><span className="text-gray-500 block text-xs">Email</span><span className="text-gray-800 font-medium text-xs break-all">{reg.leader?.email}</span></div>
                        <div><span className="text-gray-500 block text-xs">Mobile</span><span className="text-gray-800 font-medium">{reg.leader?.mobile}</span></div>
                        <div><span className="text-gray-500 block text-xs">Gender</span><span className="text-gray-800 font-medium">{reg.leader?.gender}</span></div>
                        <div><span className="text-gray-500 block text-xs">Department</span><span className="text-gray-800 font-medium">{reg.leader?.department}</span></div>
                        <div><span className="text-gray-500 block text-xs">Year</span><span className="text-gray-800 font-medium">{reg.leader?.year}</span></div>
                        <div><span className="text-gray-500 block text-xs">Roll No</span><span className="text-gray-800 font-medium">{reg.leader?.rollNo}</span></div>
                      </div>
                    </div>

                    {/* Members + Payment */}
                    <div className="space-y-4">
                      {/* Members */}
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1">Team Members ({(reg.members || []).length})</h4>
                      {(reg.members || []).map((m, mi) => (
                        <div key={mi} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-cyan-600">Member {mi + 1}</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div><span className="text-gray-500 block">Name</span><span className="text-gray-800 font-medium">{m.name}</span></div>
                            <div><span className="text-gray-500 block">Email</span><span className="text-gray-800 font-medium break-all">{m.email}</span></div>
                            <div><span className="text-gray-500 block">Mobile</span><span className="text-gray-800 font-medium">{m.mobile}</span></div>
                            <div><span className="text-gray-500 block">Gender</span><span className="text-gray-800 font-medium">{m.gender}</span></div>
                            <div><span className="text-gray-500 block">College</span><span className="text-gray-800 font-medium">{m.college}</span></div>
                            <div><span className="text-gray-500 block">Dept</span><span className="text-gray-800 font-medium">{m.department}</span></div>
                            <div><span className="text-gray-500 block">Year</span><span className="text-gray-800 font-medium">{m.year}</span></div>
                            <div><span className="text-gray-500 block">Roll No</span><span className="text-gray-800 font-medium">{m.rollNo}</span></div>
                          </div>
                        </div>
                      ))}

                      {/* Payment */}
                      <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1 mt-4">Payment Details</h4>
                      <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div><span className="text-gray-500 block text-xs">Amount</span><span className="text-emerald-700 font-bold">₹{reg.payment?.amount || '1600'}</span></div>
                          <div><span className="text-gray-500 block text-xs">UTR / Ref No</span><span className="text-gray-800 font-mono font-medium text-xs">{reg.payment?.utr}</span></div>
                          <div><span className="text-gray-500 block text-xs">File</span><span className="text-gray-800 font-medium text-xs">{reg.payment?.screenshotName || 'N/A'}</span></div>
                          <div><span className="text-gray-500 block text-xs">Paid At</span><span className="text-gray-800 font-medium text-xs">{reg.payment?.paidAt ? new Date(reg.payment.paidAt).toLocaleString('en-IN') : 'N/A'}</span></div>
                        </div>
                        {reg.payment?.screenshotData && (
                          <button
                            onClick={() => downloadScreenshot(reg)}
                            className="mt-3 flex items-center gap-2 text-xs bg-white text-cyan-700 border border-cyan-200 px-3 py-1.5 rounded-md hover:bg-cyan-50 cursor-pointer font-medium"
                          >
                            {reg.payment.screenshotType === 'application/pdf' ? <FileText className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                            Download {reg.payment.screenshotType === 'application/pdf' ? 'PDF' : 'Image'} — {(reg.teamName || 'team').replace(/[^a-zA-Z0-9 ]/g, '')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminExport;
