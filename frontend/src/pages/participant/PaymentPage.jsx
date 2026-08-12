import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Copy, CheckCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import toast from 'react-hot-toast';
import api from '../../services/api';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [existingPayment, setExistingPayment] = useState(null);
  const [copied, setCopied] = useState(false);
  
  const paymentAmount = '1600';
  const upiId = 'jbalajinadar8@okaxis';
  const accountName = 'BALAJI NADAR';
  const qrUrl = '/assets/payment-qr.png';

  const [formData, setFormData] = useState({
    utr: '',
    screenshot: null
  });
  
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        if(api?.payments?.getMine) {
          const res = await api.payments.getMine();
          if (res.data) setExistingPayment(res.data);
        }
      } catch (e) {
        // Normal if not paid yet
      }
    };
    fetchPayment();
  }, []);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      setFormData({ ...formData, screenshot: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.utr.trim()) return toast.error('Please enter UTR/Reference number');
    if (!formData.screenshot) return toast.error('Please upload payment screenshot');

    try {
      setLoading(true);
      const data = new FormData();
      data.append('utr', formData.utr);
      data.append('screenshot', formData.screenshot);

      if(api?.payments?.submit) {
        await api.payments.submit(data);
      }
      
      toast.success('Payment details submitted successfully!');
      navigate('/participant/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit payment details');
    } finally {
      setLoading(false);
    }
  };

  if (existingPayment && existingPayment.status !== 'REJECTED') {
    return (
      <div className="min-h-screen bg-dark font-body text-gray-200 py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
        <div className="bg-dark-card border border-gray-800 rounded-xl p-8 max-w-md w-full text-center shadow-xl">
          {existingPayment.status === 'PAID' ? (
            <div className="text-emerald-500 mb-4"><ShieldCheck className="w-20 h-20 mx-auto" /></div>
          ) : (
            <div className="text-blue-500 mb-4"><Clock className="w-20 h-20 mx-auto" /></div>
          )}
          <h2 className="text-2xl font-heading font-bold text-white mb-2">Payment Submitted</h2>
          <p className="text-gray-400 mb-6">
            {existingPayment.status === 'PAID' 
              ? 'Your payment has been successfully verified! Your registration is now confirmed.' 
              : 'Your payment details are currently under review. This usually takes 24-48 hours.'}
          </p>
          <div className="bg-gray-900 rounded-lg p-4 text-left space-y-2 mb-6 text-sm">
            <div className="flex justify-between border-b border-gray-800 pb-2">
              <span className="text-gray-500">Amount Paid</span>
              <span className="text-white font-medium">₹{existingPayment.amount || paymentAmount}</span>
            </div>
            <div className="flex justify-between border-b border-gray-800 pb-2 pt-1">
              <span className="text-gray-500">UTR / Ref No</span>
              <span className="text-white font-medium">{existingPayment.utr}</span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-gray-500">Status</span>
              <span className={`font-medium ${existingPayment.status === 'PAID' ? 'text-emerald-400' : 'text-blue-400'}`}>
                {existingPayment.status.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={() => navigate('/participant/dashboard')} className="w-full bg-cyan-600 hover:bg-cyan-500 text-white py-2.5 rounded-lg transition-colors font-medium">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark font-body text-gray-200 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/participant/dashboard" label="Back to Dashboard" />
        
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 tracking-wide">
            Registration Fee
          </h1>
          <p className="text-gray-400">Complete your payment to confirm your team's participation</p>
        </div>

        {existingPayment?.status === 'REJECTED' && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-8 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-red-400 font-medium">Payment Rejected</h3>
              <p className="text-sm text-red-300 mt-1">Reason: {existingPayment.rejectReason || 'The provided UTR or screenshot was invalid.'}</p>
              <p className="text-sm text-gray-400 mt-2">Please verify the details and submit a new payment reference.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Instructions & QR */}
          <div className="bg-dark-card border border-gray-800 rounded-xl p-6 sm:p-8 shadow-xl">
            <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Payment Details</h2>
            
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-xl">
                <img src={qrUrl} alt="UPI QR Code" className="w-48 h-48" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-800">
                <span className="text-gray-500 text-sm">Amount to Pay</span>
                <span className="text-xl font-bold text-cyan-400">₹{paymentAmount}</span>
              </div>
              
              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-sm mb-1">UPI ID</p>
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium font-mono tracking-wide">{upiId}</span>
                  <button onClick={handleCopyUPI} className="text-cyan-500 hover:text-cyan-400 p-1.5 bg-cyan-500/10 rounded-md transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                <p className="text-gray-500 text-sm mb-1">Account Name</p>
                <p className="text-white font-medium">{accountName}</p>
              </div>
            </div>
            
            <div className="mt-6 text-sm text-gray-400 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
              <span className="text-blue-400 font-medium block mb-1">Instructions:</span>
              <ol className="list-decimal pl-4 space-y-1">
                <li>Scan the QR code or use the UPI ID to make the payment.</li>
                <li>Take a clear screenshot of the successful transaction.</li>
                <li>Note down the 12-digit UTR / Reference number.</li>
                <li>Fill the form on the right to submit your payment details.</li>
              </ol>
            </div>
          </div>

          {/* Submission Form */}
          <div className="bg-dark-card border border-gray-800 rounded-xl p-6 sm:p-8 shadow-xl h-fit">
            <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Submit Reference</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  UTR / Reference Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.utr}
                  onChange={(e) => setFormData({...formData, utr: e.target.value})}
                  placeholder="e.g. 123456789012"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Enter the 12-digit transaction reference number.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Payment Screenshot <span className="text-red-500">*</span>
                </label>
                
                <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors relative overflow-hidden group">
                  {preview ? (
                    <div className="absolute inset-0 w-full h-full">
                      <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="bg-gray-800 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-lg">Change Image</span>
                      </div>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleFileChange} />
                    </div>
                  ) : (
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-500" />
                      <div className="flex text-sm text-gray-400 justify-center">
                        <label className="relative cursor-pointer rounded-md font-medium text-cyan-500 hover:text-cyan-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-cyan-500 focus-within:ring-offset-gray-900">
                          <span>Upload a file</span>
                          <input type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-cyan-600 hover:bg-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 focus:ring-offset-gray-900 transition-colors disabled:opacity-70"
                >
                  {loading ? 'Submitting...' : 'Submit Payment Details'}
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
