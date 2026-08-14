import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ChevronRight, ChevronLeft, Upload, Copy, CheckCircle, CreditCard } from 'lucide-react';
import BackButton from '../../components/ui/BackButton';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../components/ui/Toast';

const STEPS = ['Team Details', 'Team Leader', 'Team Members', 'Declaration', 'Review', 'Accommodation', 'Payment'];

const InputField = ({ label, value, onChange, type = "text", required = true, placeholder = "", disabled = false }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} disabled={disabled}
      className={`w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition-colors ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`} />
  </div>
);

const SelectField = ({ label, value, onChange, options, required = true }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-300 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
    <select value={value} onChange={onChange} required={required}
      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:ring-cyan-500 focus:border-cyan-500 transition-colors">
      <option value="">Select option</option>
      {options.map(o => <option key={o.value || o} value={o.value || o}>{o.label || o}</option>)}
    </select>
  </div>
);

// LocalStorage helpers for registrations
import services from '../../services/api';

// Payment config
const BASE_PAYMENT = 1600;
const ACCOMMODATION_FEE = 250;
const UPI_ID = 'jbalajinadar8@okaxis';
const ACCOUNT_NAME = 'BALAJI NADAR';
const QR_URL = '/assets/payment-qr.png';
const REGISTRATION_DEADLINE = '2026-09-05T23:59:59';

const RegistrationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    teamName: '',
    track: '',
    college: '',
    leader: {
      name: user?.fullName || user?.name || '',
      email: user?.email || '',
      mobile: '',
      department: '',
      year: '',
      rollNo: '',
      gender: '',
      needsAccommodation: false
    },
    members: [
      { name: '', email: '', mobile: '', college: '', department: '', year: '', rollNo: '', gender: '', needsAccommodation: false }
    ],
    declaration: false,
    rulesAgreed: false,
    accommodationNeeded: null,
    payment: {
      utr: '',
      screenshotData: null,
      screenshotName: '',
      screenshotType: '',
      screenshotFile: null,
      paidAt: ''
    }
  });

  const [screenshotPreview, setScreenshotPreview] = useState(null);

  // Check if registration deadline has passed
  const isDeadlinePassed = new Date() > new Date(REGISTRATION_DEADLINE);

  useEffect(() => {
    if (isDeadlinePassed) {
      return; // Don't fetch anything, show closed message
    }
    if (user?.id) {
      const fetchRegistration = async () => {
        try {
          const res = await services.registrations.getMine();
          const responseData = res.data?.data;
          const existing = responseData?.registration;
          if (existing) {
            toast.error('Your registration has already been submitted. Editing is not allowed.');
            navigate('/participant/dashboard');
            return;
          }
        } catch (err) {
          console.log("No existing registration found — proceeding with new registration");
        }
      };
      fetchRegistration();
    }
  }, [user, navigate, isDeadlinePassed]);

  // If deadline passed, show closed message
  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-dark font-body text-gray-200 flex items-center justify-center p-6">
        <div className="bg-dark-card border border-red-500/30 rounded-xl p-10 max-w-lg text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-3xl font-heading font-bold text-red-400 mb-4">Registration Closed</h1>
          <p className="text-gray-400 mb-6">
            The registration period for TRIFUSION'26 has ended. Thank you for your interest!
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-3 rounded-lg font-medium transition-colors cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (section, field, value, index = null) => {
    if (section === 'root') {
      setFormData({ ...formData, [field]: value });
    } else if (section === 'leader') {
      setFormData({ ...formData, leader: { ...formData.leader, [field]: value } });
    } else if (section === 'members') {
      const newMembers = [...formData.members];
      newMembers[index][field] = value;
      setFormData({ ...formData, members: newMembers });
    } else if (section === 'payment') {
      setFormData({ ...formData, payment: { ...formData.payment, [field]: value } });
    }
  };

  const getPaymentAmount = () => {
    if (!formData) return BASE_PAYMENT;
    let amount = BASE_PAYMENT;
    if (formData.accommodationNeeded) {
      let count = 0;
      if (formData.leader.needsAccommodation) count++;
      formData.members.forEach(m => {
        if (m.needsAccommodation) count++;
      });
      amount += (count * ACCOMMODATION_FEE);
    }
    return amount;
  };

  const addMember = () => {
    if (formData.members.length < 3) {
      setFormData({
        ...formData,
        members: [...formData.members, { name: '', email: '', mobile: '', college: formData.college || '', department: '', year: '', rollNo: '', gender: '', needsAccommodation: false }]
      });
    }
  };

  const removeMember = (index) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index);
      setFormData({ ...formData, members: newMembers });
    }
  };

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopied(true);
    toast.success('UPI ID copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        return;
      }
      // Accept images and PDFs
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        toast.error('Please upload an image (PNG, JPG) or PDF file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setFormData(prev => ({
          ...prev,
          payment: {
            ...prev.payment,
            screenshotData: base64Data,
            screenshotName: file.name,
            screenshotType: file.type,
            screenshotFile: file
          }
        }));
        setScreenshotPreview(base64Data);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!formData.teamName.trim() || !formData.college.trim() || !formData.track.trim()) {
        toast.error('Please fill all required fields (including Theme) in this step');
        return false;
      }
    } else if (currentStep === 1) {
      const { name, email, mobile, department, year, rollNo, gender } = formData.leader;
      if (!name || !email || !mobile || !department || !year || !rollNo || !gender) {
        toast.error('Please fill all leader details');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Leader email format is invalid');
        return false;
      }
      const leaderDigits = mobile.replace(/\D/g, '');
      if (leaderDigits.length !== 10) {
        toast.error('Leader mobile number must be exactly 10 digits');
        return false;
      }
    } else if (currentStep === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (let i = 0; i < formData.members.length; i++) {
        const m = formData.members[i];
        if (!m.name || !m.email || !m.mobile || !m.college || !m.department || !m.year || !m.rollNo || !m.gender) {
          toast.error(`Please fill all details for Member ${i + 1}`);
          return false;
        }
        if (!emailRegex.test(m.email)) {
          toast.error(`Member ${i + 1} email format is invalid`);
          return false;
        }
        const memberDigits = m.mobile.replace(/\D/g, '');
        if (memberDigits.length !== 10) {
          toast.error(`Member ${i + 1} mobile number must be exactly 10 digits`);
          return false;
        }
      }
      // Check duplicate emails
      const emails = [formData.leader.email, ...formData.members.map(m => m.email)].map(e => e.toLowerCase());
      if(new Set(emails).size !== emails.length) {
        toast.error('Each team member must have a unique email address');
        return false;
      }
    } else if (currentStep === 3) {
      if (!formData.declaration || !formData.rulesAgreed) {
        toast.error('You must agree to the terms and rules to proceed');
        return false;
      }
    } else if (currentStep === 4) {
      // Review step doesn't need validation to pass
    } else if (currentStep === 5) {
      // Accommodation validation
      if (formData.accommodationNeeded === null) {
        toast.error('Please select whether you need accommodation');
        return false;
      }
      if (formData.accommodationNeeded) {
        const anySelected = formData.leader.needsAccommodation || formData.members.some(m => m.needsAccommodation);
        if (!anySelected) {
          toast.error('Please select at least one member for accommodation, or select No');
          return false;
        }
      }
    } else if (currentStep === 6) {
      // Payment validation
      if (!formData.payment.utr.trim()) {
        toast.error('Please enter the UTR / Reference number');
        return false;
      }
      if (!formData.payment.screenshotData) {
        toast.error('Please upload payment screenshot');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0,0);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo(0,0);
  };

  const handleFinalSubmit = async () => {
    if (!validateStep()) return;
    try {
      setLoading(true);
      
      // 1. Submit Registration
      const regPayload = {
        teamName: formData.teamName,
        track: formData.track,
        collegeName: formData.college,
        leader: {
          fullName: formData.leader.name,
          email: formData.leader.email,
          phone: formData.leader.mobile,
          collegeName: formData.college,
          department: formData.leader.department,
          yearOfStudy: formData.leader.year,
          rollNumber: formData.leader.rollNo,
          gender: formData.leader.gender,
          needsAccommodation: formData.accommodationNeeded ? formData.leader.needsAccommodation : false
        },
        members: formData.members.map(m => ({
          fullName: m.name,
          email: m.email,
          phone: m.mobile,
          collegeName: m.college || formData.college,
          department: m.department,
          yearOfStudy: m.year,
          rollNumber: m.rollNo,
          gender: m.gender,
          needsAccommodation: formData.accommodationNeeded ? m.needsAccommodation : false
        })),
        declarationAccepted: formData.declaration,
        termsAccepted: formData.rulesAgreed
      };
      await services.registrations.create(regPayload);

      // 2. Submit Payment
      if (formData.payment.screenshotFile) {
        const paymentFormData = new FormData();
        paymentFormData.append('utrNumber', formData.payment.utr);
        paymentFormData.append('amount', getPaymentAmount());
        paymentFormData.append('screenshot', formData.payment.screenshotFile);
        
        await services.payments.submit(paymentFormData);
      } else if (!isEditing) {
        throw new Error('Screenshot is required for new registrations');
      }

      toast.success('Registration & Payment submitted successfully! 🎉');
      navigate('/participant/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to submit. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark font-body text-gray-200 py-12 px-4 sm:px-6 pt-24">
      <div className="max-w-4xl mx-auto">
        <BackButton to="/participant/dashboard" label="Back to Dashboard" />
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white mb-2 tracking-wide">
            {isEditing ? 'Edit Registration' : 'Team Registration'}
          </h1>
          <p className="text-gray-400">Join TRIFUSION&apos;26 and build the future</p>
        </div>

        {/* Stepper */}
        <div className="mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-800 -z-10"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-cyan-500 -z-10 transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
            
            {STEPS.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  currentStep > index ? 'bg-cyan-500 border-cyan-500 text-white' : 
                  currentStep === index ? 'bg-dark border-cyan-500 text-cyan-500' : 'bg-dark border-gray-700 text-gray-500'
                }`}>
                  {currentStep > index ? <Check className="w-4 h-4" /> : index + 1}
                </div>
                <span className={`text-xs mt-2 hidden sm:block ${currentStep === index ? 'text-cyan-400 font-medium' : 'text-gray-500'}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-dark-card border border-gray-800 rounded-xl p-6 sm:p-8 shadow-xl">
          
          {/* STEP 1: Team Details */}
          {currentStep === 0 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Team Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField label="Team Name" value={formData.teamName} onChange={e => handleChange('root', 'teamName', e.target.value)} placeholder="Enter your team name" />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">Theme (Problem Statement) <span className="text-red-500">*</span></label>
                  <select
                    value={formData.track}
                    onChange={e => handleChange('root', 'track', e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    required
                  >
                    <option value="" disabled>Select your theme...</option>
                    <optgroup label="ECE">
                      <option value="ECE: Intelligent Communication & Embedded Systems">📡 Intelligent Communication & Embedded Systems</option>
                      <option value="ECE: IoT, Automation & Edge Intelligence">🌐 IoT, Automation & Edge Intelligence</option>
                    </optgroup>
                    <optgroup label="EEE">
                      <option value="EEE: Smart Energy & Power Systems">⚡ Smart Energy & Power Systems</option>
                      <option value="EEE: Electric Mobility & Intelligent Power Management">🚗 Electric Mobility & Intelligent Power Management</option>
                    </optgroup>
                    <optgroup label="BME">
                      <option value="BME: Digital Healthcare & Biomedical Innovation">🫀 Digital Healthcare & Biomedical Innovation</option>
                      <option value="BME: Assistive Technology & Patient Safety">🦾 Assistive Technology & Patient Safety</option>
                    </optgroup>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <InputField label="College/Institution Name" value={formData.college} onChange={e => handleChange('root', 'college', e.target.value)} placeholder="Enter your college name" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Team Leader */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Team Leader Details</h2>
              <div className="p-3 mb-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                <p className="text-xs text-cyan-300">📧 Your Google account details are pre-filled. You can update other fields.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <InputField label="Full Name" value={formData.leader.name} onChange={e => handleChange('leader', 'name', e.target.value)} />
                <InputField label="Email Address" type="email" value={formData.leader.email} onChange={e => handleChange('leader', 'email', e.target.value)} disabled={true} />
                <InputField label="Mobile / WhatsApp Number (10 digits)" value={formData.leader.mobile} onChange={e => handleChange('leader', 'mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="e.g. 9876543210" />
                <SelectField label="Gender" value={formData.leader.gender} onChange={e => handleChange('leader', 'gender', e.target.value)} options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                <InputField label="Department" value={formData.leader.department} onChange={e => handleChange('leader', 'department', e.target.value)} placeholder="e.g. ECE, EEE, BME" />
                <InputField label="Year of Study" value={formData.leader.year} onChange={e => handleChange('leader', 'year', e.target.value)} placeholder="e.g. 2nd Year" />
                <InputField label="Roll / Register Number" value={formData.leader.rollNo} onChange={e => handleChange('leader', 'rollNo', e.target.value)} />
              </div>
            </div>
          )}

          {/* STEP 3: Team Members */}
          {currentStep === 2 && (
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-gray-800 pb-2">
                <div>
                  <h2 className="text-xl font-heading text-white">Team Members</h2>
                  <p className="text-gray-500 text-sm mt-1">Add 1 to 3 members (Total team: 2 to 4 including leader)</p>
                </div>
                {formData.members.length < 3 && (
                  <button onClick={addMember} className="text-sm bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 px-3 py-1.5 rounded transition-colors cursor-pointer">
                    + Add Member
                  </button>
                )}
              </div>
              
              <div className="space-y-8">
                {formData.members.map((member, index) => (
                  <div key={index} className="p-4 bg-gray-900/50 rounded-lg border border-gray-800 relative">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium text-cyan-400">Member {index + 1}</h3>
                      {formData.members.length > 1 && (
                        <button onClick={() => removeMember(index)} className="text-xs text-red-400 hover:text-red-300 cursor-pointer">✕ Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                      <InputField label="Full Name" value={member.name} onChange={e => handleChange('members', 'name', e.target.value, index)} />
                      <InputField label="Email Address" type="email" value={member.email} onChange={e => handleChange('members', 'email', e.target.value, index)} />
                      <InputField label="Mobile Number (10 digits)" value={member.mobile} onChange={e => handleChange('members', 'mobile', e.target.value.replace(/\D/g, '').slice(0, 10), index)} placeholder="e.g. 9876543210" />
                      <SelectField label="Gender" value={member.gender} onChange={e => handleChange('members', 'gender', e.target.value, index)} options={['Male', 'Female', 'Other', 'Prefer not to say']} />
                      <div className="md:col-span-2">
                        <InputField label="College" value={member.college} onChange={e => handleChange('members', 'college', e.target.value, index)} />
                      </div>
                      <InputField label="Department" value={member.department} onChange={e => handleChange('members', 'department', e.target.value, index)} placeholder="e.g. ECE, EEE, BME" />
                      <div className="grid grid-cols-2 gap-2">
                        <InputField label="Year" value={member.year} onChange={e => handleChange('members', 'year', e.target.value, index)} placeholder="e.g. 2nd Year" />
                        <InputField label="Roll No" value={member.rollNo} onChange={e => handleChange('members', 'rollNo', e.target.value, index)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Declaration */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Declaration</h2>
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 text-sm text-gray-400 space-y-4">
                  <h3 className="text-white font-medium mb-2">Terms and Conditions</h3>
                  <p>1. All team members must be enrolled in a recognized educational institution.</p>
                  <p>2. The code developed during the hackathon must be original and created during the event timeline.</p>
                  <p>3. Teams must consist of 2 to 4 members (1 team leader + 1 to 3 members).</p>
                  <p>4. The registration fee is non-refundable once the team is shortlisted/confirmed.</p>
                  <p>5. The decision of the judges and organizing committee will be final and binding.</p>
                </div>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="flex-shrink-0 mt-1">
                    <input type="checkbox" checked={formData.declaration} onChange={(e) => handleChange('root', 'declaration', e.target.checked)} className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">I hereby declare that all information provided is complete and accurate to the best of my knowledge. I understand that any false information may lead to disqualification.</span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                  <div className="flex-shrink-0 mt-1">
                    <input type="checkbox" checked={formData.rulesAgreed} onChange={(e) => handleChange('root', 'rulesAgreed', e.target.checked)} className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900" />
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">I have read and agree to abide by the TRIFUSION&apos;26 Hackathon Rules, Terms, and Conditions.</span>
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Review Application</h2>
              
              <div className="space-y-6">
                {/* Team Info */}
                <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 relative">
                  <button onClick={() => setCurrentStep(0)} className="absolute top-4 right-4 text-xs text-cyan-500 hover:text-cyan-400 cursor-pointer">Edit</button>
                  <h3 className="text-white font-medium mb-3">Team Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Team Name</span><span className="text-gray-200">{formData.teamName}</span></div>
                    <div><span className="text-gray-500 block">Track</span><span className="text-gray-200">{formData.track}</span></div>
                    <div className="col-span-2"><span className="text-gray-500 block">College</span><span className="text-gray-200">{formData.college}</span></div>
                  </div>
                </div>

                {/* Leader Info */}
                <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 relative">
                  <button onClick={() => setCurrentStep(1)} className="absolute top-4 right-4 text-xs text-cyan-500 hover:text-cyan-400 cursor-pointer">Edit</button>
                  <h3 className="text-white font-medium mb-3">Leader Information</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div><span className="text-gray-500 block">Name</span><span className="text-gray-200">{formData.leader.name}</span></div>
                    <div className="col-span-2 sm:col-span-1"><span className="text-gray-500 block">Email</span><span className="text-gray-200 truncate block">{formData.leader.email}</span></div>
                    <div><span className="text-gray-500 block">Mobile</span><span className="text-gray-200">{formData.leader.mobile}</span></div>
                    <div><span className="text-gray-500 block">Department</span><span className="text-gray-200">{formData.leader.department}</span></div>
                  </div>
                </div>

                {/* Members Info */}
                <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 relative">
                  <button onClick={() => setCurrentStep(2)} className="absolute top-4 right-4 text-xs text-cyan-500 hover:text-cyan-400 cursor-pointer">Edit</button>
                  <h3 className="text-white font-medium mb-3">Team Members ({formData.members.length})</h3>
                  <div className="space-y-3">
                    {formData.members.map((m, i) => (
                      <div key={i} className="flex flex-col sm:flex-row justify-between text-sm py-2 border-t border-gray-800 first:border-0">
                        <span className="text-gray-200 font-medium">{m.name}</span>
                        <span className="text-gray-500">{m.email}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Accommodation Details */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2">Accommodation Details</h2>
              <div className="space-y-6">
                <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
                  <p className="text-gray-300 font-medium mb-4">Do you need accommodation for the event? (₹250 per person)</p>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, accommodationNeeded: true })}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium border transition-colors ${
                        formData.accommodationNeeded === true 
                        ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' 
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      Yes, we need accommodation
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({ 
                          ...formData, 
                          accommodationNeeded: false,
                          leader: { ...formData.leader, needsAccommodation: false },
                          members: formData.members.map(m => ({ ...m, needsAccommodation: false }))
                        });
                      }}
                      className={`flex-1 py-3 px-4 rounded-lg font-medium border transition-colors ${
                        formData.accommodationNeeded === false 
                        ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400' 
                        : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
                      }`}
                    >
                      No, we don't need it
                    </button>
                  </div>
                </div>

                {formData.accommodationNeeded && (
                  <div className="bg-gray-900/50 p-6 rounded-lg border border-gray-800">
                    <h3 className="text-white font-medium mb-4">Select members who need accommodation:</h3>
                    <div className="space-y-3">
                      <label className="flex items-center p-3 rounded-lg border border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors">
                        <input 
                          type="checkbox" 
                          checked={formData.leader.needsAccommodation} 
                          onChange={(e) => handleChange('leader', 'needsAccommodation', e.target.checked)}
                          className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                        />
                        <span className="ml-3 text-gray-200">{formData.leader.name} <span className="text-gray-500 text-sm">(Team Leader - {formData.leader.gender || 'Unknown'})</span></span>
                      </label>
                      {formData.members.map((member, idx) => (
                        <label key={idx} className="flex items-center p-3 rounded-lg border border-gray-800 hover:bg-gray-800/50 cursor-pointer transition-colors">
                          <input 
                            type="checkbox" 
                            checked={member.needsAccommodation} 
                            onChange={(e) => handleChange('members', 'needsAccommodation', e.target.checked, idx)}
                            className="w-5 h-5 rounded border-gray-700 bg-gray-900 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-gray-900"
                          />
                          <span className="ml-3 text-gray-200">{member.name || `Member ${idx + 1}`} <span className="text-gray-500 text-sm">({member.gender || 'Unknown'})</span></span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-800">
                      <h4 className="text-gray-400 text-sm mb-2">Accommodation Summary:</h4>
                      <div className="flex gap-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded px-4 py-2 text-blue-400">
                          Boys: {
                            (formData.leader.needsAccommodation && formData.leader.gender === 'Male' ? 1 : 0) +
                            formData.members.filter(m => m.needsAccommodation && m.gender === 'Male').length
                          }
                        </div>
                        <div className="bg-pink-500/10 border border-pink-500/20 rounded px-4 py-2 text-pink-400">
                          Girls: {
                            (formData.leader.needsAccommodation && formData.leader.gender === 'Female' ? 1 : 0) +
                            formData.members.filter(m => m.needsAccommodation && m.gender === 'Female').length
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 7: Payment */}
          {currentStep === 6 && (
            <div>
              <h2 className="text-xl font-heading text-white mb-6 border-b border-gray-800 pb-2 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-cyan-400" /> Registration Fee Payment
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Payment Details & QR */}
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-xl">
                      <img src={QR_URL} alt="UPI QR Code" className="w-44 h-44" />
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-900 p-3 rounded-lg border border-gray-800">
                    <span className="text-gray-500 text-sm">Amount to Pay</span>
                    <span className="text-xl font-bold text-cyan-400">₹{getPaymentAmount()}</span>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <p className="text-gray-500 text-sm mb-1">UPI ID</p>
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium font-mono tracking-wide">{UPI_ID}</span>
                      <button onClick={handleCopyUPI} className="text-cyan-500 hover:text-cyan-400 p-1.5 bg-cyan-500/10 rounded-md transition-colors cursor-pointer">
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                    <p className="text-gray-500 text-sm mb-1">Account Name</p>
                    <p className="text-white font-medium">{ACCOUNT_NAME}</p>
                  </div>

                  <div className="text-sm text-gray-400 p-4 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                    <span className="text-blue-400 font-medium block mb-1">Instructions:</span>
                    <ol className="list-decimal pl-4 space-y-1">
                      <li>Scan the QR code or use the UPI ID to make the payment.</li>
                      <li>Take a clear screenshot of the successful transaction.</li>
                      <li>Note down the 12-digit UTR / Reference number.</li>
                      <li>Fill the form on the right to complete registration.</li>
                    </ol>
                  </div>
                </div>

                {/* UTR & Screenshot Upload */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      UTR / Reference Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.payment.utr}
                      onChange={(e) => handleChange('payment', 'utr', e.target.value)}
                      placeholder="e.g. 123456789012"
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2.5 text-white font-mono focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter the 12-digit transaction reference number.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Payment Screenshot <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-500 mb-2">Upload an image (PNG, JPG) or PDF file — max 5MB</p>
                    
                    <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors relative overflow-hidden group min-h-[160px]">
                      {screenshotPreview ? (
                        <div className="w-full text-center">
                          {formData.payment.screenshotType === 'application/pdf' ? (
                            <div className="flex flex-col items-center gap-2 py-4">
                              <div className="w-16 h-16 bg-red-500/20 rounded-lg flex items-center justify-center">
                                <span className="text-red-400 text-2xl font-bold">PDF</span>
                              </div>
                              <span className="text-gray-300 text-sm font-medium">{formData.payment.screenshotName}</span>
                              <span className="text-green-400 text-xs">✓ File uploaded</span>
                            </div>
                          ) : (
                            <img src={screenshotPreview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
                          )}
                          <label className="mt-3 inline-block text-xs text-cyan-400 hover:text-cyan-300 cursor-pointer bg-cyan-500/10 px-3 py-1.5 rounded-md">
                            Change File
                            <input type="file" className="sr-only" accept="image/*,.pdf" onChange={handleScreenshotChange} />
                          </label>
                        </div>
                      ) : (
                        <div className="space-y-2 text-center">
                          <Upload className="mx-auto h-10 w-10 text-gray-500" />
                          <div className="flex text-sm text-gray-400 justify-center">
                            <label className="relative cursor-pointer rounded-md font-medium text-cyan-500 hover:text-cyan-400">
                              <span>Upload a file</span>
                              <input type="file" className="sr-only" accept="image/*,.pdf" onChange={handleScreenshotChange} />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG, or PDF up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-sm text-emerald-300">
                    <p className="font-medium mb-1">⚠️ Important</p>
                    <p className="text-emerald-400/80 text-xs">Your registration will only be saved and visible to the organizers after you submit payment details. Please ensure all details are correct.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="mt-10 pt-6 border-t border-gray-800 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer ${
                currentStep === 0 ? 'opacity-0 cursor-default' : 'text-gray-400 hover:text-white bg-gray-900 hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" /> Back
            </button>
            
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center px-6 py-2.5 rounded-lg font-medium bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
              >
              Next Step <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleFinalSubmit}
                disabled={loading}
                className="flex items-center px-8 py-2.5 rounded-lg font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-500/20 disabled:opacity-70 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit Registration'} <Check className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
