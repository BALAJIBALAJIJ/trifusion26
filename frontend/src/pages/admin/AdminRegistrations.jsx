import { useState, useEffect } from 'react';
import { Download, Search, RefreshCw, Users, Image, FileText } from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import DataTable from '../../components/admin/DataTable';
import StatusBadge from '../../components/admin/StatusBadge';
import * as XLSX from 'xlsx';

// Helper to get registrations that have completed payment
const getPaidRegistrations = () => {
  try {
    const registrations = JSON.parse(localStorage.getItem('trifusion_registrations') || '[]');
    return registrations.filter(r => r.status === 'PAID' && r.payment?.utr);
  } catch {
    return [];
  }
};

const AdminRegistrations = () => {
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = () => {
    try {
      setLoading(true);
      const paidRegs = getPaidRegistrations();
      setRegistrations(paidRegs);
    } catch (error) {
      console.error('Failed to load registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = registrations.filter(r => {
    const teamName = (r.teamName || '').toLowerCase();
    const leaderName = (r.leader?.name || '').toLowerCase();
    const leaderEmail = (r.leader?.email || '').toLowerCase();
    const college = (r.college || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    const matchesSearch = teamName.includes(search) || leaderName.includes(search) || leaderEmail.includes(search) || college.includes(search);
    return matchesSearch;
  });

  // XLSX export with A-to-Z data
  const handleExportXlsx = () => {
    if (filteredData.length === 0) {
      alert('No data to export.');
      return;
    }

    const excelData = [];
    filteredData.forEach((reg, index) => {
      // Create a row for each team
      const row = {
        'S.No': index + 1,
        'Team Name': reg.teamName || '',
        'Track': reg.track || '',
        'College': reg.college || '',
        // Leader details
        'Leader Name': reg.leader?.name || '',
        'Leader Email': reg.leader?.email || '',
        'Leader Mobile': reg.leader?.mobile || '',
        'Leader Gender': reg.leader?.gender || '',
        'Leader Department': reg.leader?.department || '',
        'Leader Year': reg.leader?.year || '',
        'Leader Roll No': reg.leader?.rollNo || '',
      };

      // Add each member's details (up to 3 members)
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

      // Payment details
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

    // Auto-size columns
    const colWidths = Object.keys(excelData[0] || {}).map(key => ({
      wch: Math.max(key.length, ...excelData.map(row => String(row[key] || '').length)) + 2
    }));
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `TRIFUSION26_PaidRegistrations_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Download a single payment screenshot
  const downloadScreenshot = (reg) => {
    if (!reg.payment?.screenshotData) {
      alert('No payment screenshot available for this registration.');
      return;
    }

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

  // Download ALL payment screenshots as individual files
  const downloadAllScreenshots = () => {
    const regsWithScreenshots = filteredData.filter(r => r.payment?.screenshotData);
    if (regsWithScreenshots.length === 0) {
      alert('No payment screenshots to download.');
      return;
    }

    regsWithScreenshots.forEach((reg, index) => {
      setTimeout(() => {
        downloadScreenshot(reg);
      }, index * 500); // stagger downloads to avoid browser blocking
    });
  };

  const columns = [
    { key: 'teamName', label: 'Team Name' },
    { 
      key: 'leader', 
      label: 'Leader',
      render: (val) => (
        <div>
          <span className="font-medium text-gray-800">{val?.name || 'N/A'}</span>
          <span className="block text-xs text-gray-500">{val?.email || ''}</span>
        </div>
      )
    },
    { key: 'college', label: 'College' },
    { 
      key: 'members', 
      label: 'Members',
      render: (val) => <span className="text-sm">{(val || []).length} member(s)</span>
    },
    {
      key: 'payment',
      label: 'Payment',
      render: (val) => (
        <div className="text-sm">
          <span className="text-emerald-600 font-medium">₹{val?.amount || '1600'}</span>
          <span className="block text-xs text-gray-500">UTR: {val?.utr || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => <StatusBadge status={val || 'PAID'} />
    },
    {
      key: 'payment',
      label: 'Screenshot',
      render: (val, row) => (
        val?.screenshotData ? (
          <button
            onClick={() => downloadScreenshot(row)}
            className="flex items-center gap-1 text-xs text-cyan-600 hover:text-cyan-500 bg-cyan-50 px-2 py-1 rounded-md transition-colors cursor-pointer"
          >
            {val.screenshotType === 'application/pdf' ? <FileText className="w-3 h-3" /> : <Image className="w-3 h-3" />}
            Download
          </button>
        ) : (
          <span className="text-xs text-gray-400">None</span>
        )
      )
    },
    { 
      key: 'submittedAt', 
      label: 'Submitted', 
      render: (val) => val ? new Date(val).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'
    },
  ];

  return (
    <AdminLayout title="Paid Registrations">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by team, leader, email, college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border-gray-300 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm py-2 px-3 border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={fetchData}
            className="flex items-center gap-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors border border-gray-200 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>

          <div className="flex items-center gap-2 border-l pl-3 ml-2 border-gray-200">
            <button 
              onClick={handleExportXlsx} 
              className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors border border-emerald-200 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Excel (All Data)
            </button>
            <button 
              onClick={downloadAllScreenshots} 
              className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors border border-purple-200 cursor-pointer"
            >
              <Image className="w-4 h-4" /> All Screenshots
            </button>
          </div>
        </div>

      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {registrations.length === 0 ? 'No paid registrations yet' : 'No matching results'}
          </h3>
          <p className="text-sm text-gray-400">
            {registrations.length === 0 
              ? 'Only teams that complete payment will appear here.' 
              : 'Try adjusting your search criteria.'}
          </p>
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm text-gray-500">
            Showing {filteredData.length} of {registrations.length} paid registrations
          </div>
          <DataTable 
            columns={columns} 
            data={filteredData} 
          />
        </>
      )}
    </AdminLayout>
  );
};

export default AdminRegistrations;
