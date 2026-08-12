import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Clock, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/admin/AdminLayout';
import StatusBadge from '../../components/admin/StatusBadge';
import api from '../../services/api';

const AdminRegistrationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // Mock 
        const mockDetail = {
          id,
          teamName: 'CyberKnights',
          track: 'Cybersecurity',
          college: 'MIT Institute of Technology',
          registrationStatus: 'DRAFT',
          createdAt: new Date().toISOString(),
          leader: { name: 'John Doe', email: 'john@example.com', mobile: '1234567890', department: 'CSE', year: '3', rollNo: 'CS123', gender: 'Male' },
          members: [
            { name: 'Alice Smith', email: 'alice@example.com', mobile: '0987654321', college: 'MIT', department: 'CSE', year: '3', rollNo: 'CS124', gender: 'Female' }
          ],
          payment: {
            amount: 500,
            utr: 'UTR123456789',
            status: 'UNDER_REVIEW',
            screenshotUrl: 'https://via.placeholder.com/400x800?text=Payment+Screenshot',
            submittedAt: new Date().toISOString()
          }
        };

        if(api?.admin?.getRegistration) {
          const res = await api.admin.getRegistration(id);
          setDetail(res.data || mockDetail);
          setNewStatus((res.data || mockDetail).registrationStatus);
        } else {
          setDetail(mockDetail);
          setNewStatus(mockDetail.registrationStatus);
        }
      } catch (err) {
        toast.error('Failed to load details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleVerify = async () => {
    try {
      if(api?.admin?.verifyPayment) await api.admin.verifyPayment(id);
      toast.success('Payment verified successfully');
      setDetail(prev => ({...prev, payment: {...prev.payment, status: 'PAID'}}));
    } catch (e) {
      toast.error('Failed to verify payment');
    }
  };

  const handleReject = async () => {
    if(!rejectReason.trim()) return toast.error('Please provide a reason');
    try {
      if(api?.admin?.rejectPayment) await api.admin.rejectPayment(id, { reason: rejectReason });
      toast.success('Payment rejected');
      setShowRejectModal(false);
      setDetail(prev => ({...prev, payment: {...prev.payment, status: 'REJECTED'}}));
    } catch (e) {
      toast.error('Failed to reject payment');
    }
  };

  const handleUpdateStatus = async () => {
    try {
      if(api?.admin?.updateStatus) await api.admin.updateStatus(id, { status: newStatus });
      toast.success('Status updated');
      setDetail(prev => ({...prev, registrationStatus: newStatus}));
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  if (loading || !detail) return <AdminLayout><div className="p-8 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title={`Team: ${detail.teamName}`}>
      <div className="mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center text-sm text-gray-500 hover:text-gray-900">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Registrations
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Team Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Team Name</p><p className="font-medium">{detail.teamName}</p></div>
              <div><p className="text-sm text-gray-500">Track</p><p className="font-medium">{detail.track}</p></div>
              <div className="col-span-2"><p className="text-sm text-gray-500">College</p><p className="font-medium">{detail.college}</p></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Team Leader</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div><p className="text-gray-500">Name</p><p className="font-medium">{detail.leader.name}</p></div>
              <div><p className="text-gray-500">Email</p><p className="font-medium">{detail.leader.email}</p></div>
              <div><p className="text-gray-500">Mobile</p><p className="font-medium">{detail.leader.mobile}</p></div>
              <div><p className="text-gray-500">Department</p><p>{detail.leader.department}</p></div>
              <div><p className="text-gray-500">Year</p><p>{detail.leader.year}</p></div>
              <div><p className="text-gray-500">Roll No</p><p>{detail.leader.rollNo}</p></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Members ({detail.members?.length || 0})</h3>
            <div className="space-y-4">
              {detail.members?.map((m, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                  <div><p className="text-gray-500 text-xs">Name</p><p className="font-medium">{m.name}</p></div>
                  <div><p className="text-gray-500 text-xs">Email</p><p className="truncate">{m.email}</p></div>
                  <div><p className="text-gray-500 text-xs">Mobile</p><p>{m.mobile}</p></div>
                  <div><p className="text-gray-500 text-xs">Roll No</p><p>{m.rollNo}</p></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Actions & Payment */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Registration Status</h3>
            <div className="flex items-center gap-3 mb-4">
              <StatusBadge status={detail.registrationStatus} />
            </div>
            <div className="flex gap-2">
              <select 
                value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="flex-1 border-gray-300 rounded-md text-sm p-2 border"
              >
                <option value="DRAFT">DRAFT</option>
                <option value="SUBMITTED">SUBMITTED</option>
                <option value="CONFIRMED">CONFIRMED</option>
              </select>
              <button onClick={handleUpdateStatus} className="bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-700">
                <Save className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium border-b pb-2 mb-4">Payment Info</h3>
            {detail.payment ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Status</span>
                  <StatusBadge status={detail.payment.status} />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><p className="text-gray-500">Amount</p><p className="font-medium">₹{detail.payment.amount}</p></div>
                  <div><p className="text-gray-500">UTR</p><p className="font-medium">{detail.payment.utr}</p></div>
                </div>
                {detail.payment.screenshotUrl && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Screenshot</p>
                    <a href={detail.payment.screenshotUrl} target="_blank" rel="noopener noreferrer">
                      <img src={detail.payment.screenshotUrl} alt="Payment" className="w-full h-48 object-cover rounded-md border" />
                    </a>
                  </div>
                )}

                {detail.payment.status === 'UNDER_REVIEW' && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <button onClick={handleVerify} className="flex-1 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 flex justify-center items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Verify
                    </button>
                    <button onClick={() => setShowRejectModal(true)} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700 flex justify-center items-center gap-2">
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-20" />
                No payment submitted yet.
              </div>
            )}
          </div>
        </div>
      </div>

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Reject Payment</h3>
            <textarea
              className="w-full border-gray-300 rounded-md p-3 border focus:ring-cyan-500 focus:border-cyan-500"
              rows="3"
              placeholder="Reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            ></textarea>
            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
              <button onClick={handleReject} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Submit Rejection</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminRegistrationDetail;
