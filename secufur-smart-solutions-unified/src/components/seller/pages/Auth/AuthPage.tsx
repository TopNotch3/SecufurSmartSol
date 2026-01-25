import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { ShieldCheck, ArrowRight, Building2, CreditCard, User, Globe, Lock, AlertCircle, CheckCircle, FileText, Loader2, Upload, File } from 'lucide-react';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const AuthPage: React.FC = () => {
  const { registerSeller, loginSeller } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',

    // Business
    businessName: '',
    tradeName: '', // New: Trade Name
    legalEntity: 'Pvt Ltd' as any,
    panNumber: '',
    gstNumber: '',
    fssaiLicense: '', // New: FSSAI License
    panDoc: null as File | null,
    gstDoc: null as File | null,
    constitutionDoc: null as File | null, // New: Constitution Doc

    // Address
    address: { line1: '', city: '', state: '', pincode: '' },
    addressProofDoc: null as File | null,
    signatoryName: '',
    designation: '',
    identityProofDoc: null as File | null,

    // Banking
    bankDetails: {
      accountName: '', // Will default to business name if not specified or just not used in UI
      accountNumber: '',
      ifsc: '',
      bankName: ''
    },
    cancelledChequeDoc: null as File | null,
    trademarkDoc: null as File | null,
    authenticityUndertaking: false // New: Undertaking
  });

  const handleFileChange = (field: keyof typeof formData, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = loginSeller(loginData.email, loginData.password);
      if (result.success) {
        router.push('/seller');
      } else {
        setError(result.error || 'Login failed');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (step < 5) {
      // Validation for each step
      if (step === 1) {
        if (!formData.email || !formData.password) {
          setError('Please fill in all required fields');
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 8) {
          setError('Password must be at least 8 characters');
          return;
        }
      }
      if (step === 2) {
        if (!formData.businessName || !formData.gstNumber || !formData.panNumber) {
          setError('Please fill in all required fields');
          return;
        }
        if (!formData.panDoc) {
          setError('Please upload PAN Card PDF');
          return;
        }
        if (!formData.gstDoc) {
          setError('Please upload GST Certificate PDF');
          return;
        }
        if (!formData.constitutionDoc) {
          setError('Please upload Certificate of Incorporation / Partnership Deed');
          return;
        }
      }
      if (step === 3) {
        if (!formData.signatoryName || !formData.address.line1 || !formData.address.city || !formData.address.state || !formData.address.pincode) {
          setError('Please fill in all required fields');
          return;
        }
        if (!formData.addressProofDoc) {
          setError('Please upload Address Proof PDF');
          return;
        }
        if (!formData.identityProofDoc) {
          setError('Please upload Identity Proof PDF');
          return;
        }
      }
      if (step === 4) {
        if (!formData.bankDetails.accountNumber || !formData.bankDetails.ifsc) {
          setError('Please fill in all required fields');
          return;
        }
        if (!formData.cancelledChequeDoc) {
          setError('Please upload Cancelled Cheque / Bank Statement PDF');
          return;
        }
      }

      setError('');
      setStep(step + 1);
      return;
    }

    if (!formData.authenticityUndertaking) {
      setError('You must agree to the Product Authenticity Undertaking to proceed.');
      return;
    }

    // Final submission
    setLoading(true);
    setTimeout(() => {
      registerSeller({
        ...formData,
        contactPerson: `${formData.firstName} ${formData.lastName}`,
        status: 'Applied',
        complianceAgreed: false,
        constitutionDoc: formData.constitutionDoc?.name // Mocking file upload to URL
      }, formData.password);
      setSuccess('Registration successful! Redirecting to verification status...');
      setTimeout(() => router.push('/seller/under-review'), 1500);
    }, 1500);
  };

  const totalSteps = 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 font-jakarta">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        {/* Brand Side */}
        <div className="w-full lg:w-5/12 bg-[#002366] p-8 sm:p-12 text-white flex flex-col justify-center gap-16 relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />

          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-wide mb-2">Secufur Smart Solutions</h2>
          </div>

          <div className="relative z-10 space-y-4">
            <h3 className="text-xl sm:text-2xl font-bold leading-snug">Empowering Indian Sellers with Global Standards.</h3>
            <p className="text-blue-200/70 text-sm leading-relaxed">Secure, Transparent, and RBI Compliant seller platform for your growing business.</p>
          </div>

          <div className="relative z-10 space-y-3 sm:space-y-4">
            <FeatureItem icon={<ShieldCheck size={18} />} text="PCI-DSS v4.0 Compliant" />
            <FeatureItem icon={<Globe size={18} />} text="GST Ready Invoicing" />
            <FeatureItem icon={<Lock size={18} />} text="256-bit AES Encryption" />
            <FeatureItem icon={<FileText size={18} />} text="Automated Compliance" />
          </div>


        </div>

        {/* Form Side */}
        <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          {isLogin ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Seller Portal</h3>
              <p className="text-slate-400 text-sm mb-8 sm:mb-10 font-medium">Access your dashboard with secure credentials.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-bold animate-in shake duration-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Seller Email</label>
                  <input
                    required
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all focus:border-[#002366]"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all focus:border-[#002366]"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                  />
                </div>



                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#002366] text-white py-4 sm:py-5 rounded-2xl font-bold text-sm shadow-2xl shadow-blue-900/30 hover:bg-blue-900 hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      AUTHENTICATING...
                    </>
                  ) : 'SECURE LOGIN'}
                </button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800">Registration</h3>
                <div className="flex gap-1">
                  <div className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step >= 1 ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step >= 2 ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step >= 3 ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step >= 4 ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                  <div className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step >= 5 ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                </div>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6">
                <span className={step === 1 ? 'text-[#002366]' : ''}>Basic</span>
                <span className={step === 2 ? 'text-[#002366]' : ''}>Business</span>
                <span className={step === 3 ? 'text-[#002366]' : ''}>Address</span>
                <span className={step === 4 ? 'text-[#002366]' : ''}>Banking</span>
                <span className={step === 5 ? 'text-[#002366]' : ''}>Review</span>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-bold">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-start gap-3 text-green-600 text-xs font-bold">
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleRegisterSubmit} className="space-y-5 sm:space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                      <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} type="email" placeholder="you@example.com" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">First Name</label>
                        <input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} type="text" placeholder="John" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Last Name</label>
                        <input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} type="text" placeholder="Doe" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Mobile Number</label>
                      <input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} type="tel" placeholder="9876543210" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                      <input required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} type="password" placeholder="Minimum 6 characters" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password</label>
                      <input required value={formData.confirmPassword} onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })} type="password" placeholder="Re-enter password" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Name</label>
                      <input required value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })} type="text" placeholder="Your Business Name" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Trade Name (Optional)</label>
                      <input value={formData.tradeName} onChange={e => setFormData({ ...formData, tradeName: e.target.value })} type="text" placeholder="If different from Business Name" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Entity Type</label>
                      <select value={formData.legalEntity} onChange={e => setFormData({ ...formData, legalEntity: e.target.value as any })} className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm">
                        <option>Select Entity Type</option>
                        <option>Individual</option>
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Pvt Ltd</option>
                        <option>LLP</option>
                      </select>
                    </div>
                    <FileUpload label="UPLOAD CERTIFICATE OF INCORPORATION / PARTNERSHIP DEED" file={formData.constitutionDoc} onFileSelect={(f) => handleFileChange('constitutionDoc', f)} />

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">PAN Number</label>
                      <input required value={formData.panNumber} onChange={e => setFormData({ ...formData, panNumber: e.target.value })} type="text" placeholder="ABCDE1234F" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                    </div>
                    <FileUpload label="UPLOAD PAN CARD" file={formData.panDoc} onFileSelect={(f) => handleFileChange('panDoc', f)} />

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">GSTIN</label>
                      <input required value={formData.gstNumber} onChange={e => setFormData({ ...formData, gstNumber: e.target.value })} type="text" placeholder="22AAAAA0000A1Z5" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                    </div>
                    <FileUpload label="UPLOAD GSTIN CERTIFICATE (REG-06)" file={formData.gstDoc} onFileSelect={(f) => handleFileChange('gstDoc', f)} />

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">FSSAI License (Optional)</label>
                      <input value={formData.fssaiLicense} onChange={e => setFormData({ ...formData, fssaiLicense: e.target.value })} type="text" placeholder="If selling food products" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Address (Street)</label>
                      <input required value={formData.address.line1} onChange={e => setFormData({ ...formData, address: { ...formData.address, line1: e.target.value } })} type="text" placeholder="123 Main Street" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                        <input required value={formData.address.city} onChange={e => setFormData({ ...formData, address: { ...formData.address, city: e.target.value } })} type="text" placeholder="Mumbai" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                        <input required value={formData.address.pincode} onChange={e => setFormData({ ...formData, address: { ...formData.address, pincode: e.target.value } })} type="text" placeholder="400001" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                      <select value={formData.address.state} onChange={e => setFormData({ ...formData, address: { ...formData.address, state: e.target.value } })} className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm">
                        <option value="">Select State</option>
                        {indianStates.map(state => (
                          <option key={state} value={state}>{state}</option>
                        ))}
                      </select>
                    </div>
                    <FileUpload label="UPLOAD ADDRESS PROOF" file={formData.addressProofDoc} onFileSelect={(f) => handleFileChange('addressProofDoc', f)} />

                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Authorized Signatory Name</label>
                      <input required value={formData.signatoryName} onChange={e => setFormData({ ...formData, signatoryName: e.target.value })} type="text" placeholder="Full Name" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Designation (Optional)</label>
                      <input value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} type="text" placeholder="Director/Proprietor" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <FileUpload label="UPLOAD IDENTITY PROOF (AADHAAR/PASSPORT)" file={formData.identityProofDoc} onFileSelect={(f) => handleFileChange('identityProofDoc', f)} />
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bank Account Number</label>
                      <input value={formData.bankDetails.accountNumber} onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })} type="text" placeholder="1234567890" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
                      <input value={formData.bankDetails.ifsc} onChange={e => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, ifsc: e.target.value } })} type="text" placeholder="SBIN0001234" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                    </div>

                    <FileUpload label="UPLOAD CANCELLED CHEQUE / BANK STATEMENT" file={formData.cancelledChequeDoc} onFileSelect={(f) => handleFileChange('cancelledChequeDoc', f)} />
                    <FileUpload label="UPLOAD TRADEMARK/BRAND AUTHORIZATION (OPTIONAL)" file={formData.trademarkDoc} onFileSelect={(f) => handleFileChange('trademarkDoc', f)} />
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Review Your Information</h3>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Personal Information</h4>
                      <p className="text-sm"><strong>Name:</strong> {formData.firstName} {formData.lastName}</p>
                      <p className="text-sm"><strong>Email:</strong> {formData.email}</p>
                      <p className="text-sm"><strong>Phone:</strong> {formData.phone}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Details</h4>
                      <p className="text-sm"><strong>Business Name:</strong> {formData.businessName}</p>
                      {formData.tradeName && <p className="text-sm"><strong>Trade Name:</strong> {formData.tradeName}</p>}
                      <p className="text-sm"><strong>Entity Type:</strong> {formData.legalEntity}</p>
                      <p className="text-sm"><strong>PAN:</strong> {formData.panNumber}</p>
                      <p className="text-sm"><strong>GSTIN:</strong> {formData.gstNumber}</p>
                      {formData.fssaiLicense && <p className="text-sm"><strong>FSSAI:</strong> {formData.fssaiLicense}</p>}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Business Address</h4>
                      <p className="text-sm">{formData.address.line1}</p>
                      <p className="text-sm">{formData.address.city}, {formData.address.state} - {formData.address.pincode}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Banking Information</h4>
                      <p className="text-sm"><strong>Account Number:</strong> {formData.bankDetails.accountNumber}</p>
                      <p className="text-sm"><strong>IFSC Code:</strong> {formData.bankDetails.ifsc}</p>
                    </div>

                    <div className="pt-4 border-t">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${formData.authenticityUndertaking ? 'bg-[#002366] border-[#002366]' : 'border-gray-300 group-hover:border-[#002366]'}`}>
                          {formData.authenticityUndertaking && <CheckCircle size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={formData.authenticityUndertaking} onChange={e => setFormData({ ...formData, authenticityUndertaking: e.target.checked })} />
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">I undertake that all products listed by me are authentic and genuine.</p>
                          <p className="text-xs text-slate-500 mt-1">I declare that product descriptions and images are accurate and non-infringing. I understand that selling counterfeit goods is a punishable offense and will lead to immediate account suspension and legal action.</p>
                        </div>
                      </label>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-800">
                      Your seller account will be reviewed by our team. You will be notified once your account is verified and activated.
                    </div>
                  </div>
                )}

                <div className="flex gap-3 sm:gap-4 pt-2">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => { setStep(step - 1); setError(''); }}
                      className="flex-1 py-4 sm:py-5 bg-gray-100 text-slate-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                    >
                      BACK
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`${step > 1 ? 'flex-[2]' : 'w-full'} bg-[#002366] text-white py-4 sm:py-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-70`}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        PROCESSING...
                      </>
                    ) : (
                      <>
                        {step === totalSteps ? 'SUBMIT FOR VERIFICATION' : 'NEXT'}
                        {step < totalSteps && <ArrowRight size={16} />}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="mt-8 sm:mt-12 pt-8 sm:pt-10 border-t border-gray-50 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setStep(1); setError(''); setSuccess(''); }}
              className="text-xs font-bold text-[#002366] uppercase tracking-widest hover:underline decoration-2 underline-offset-8 transition-all"
            >
              {isLogin ? "Register as New Seller" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex gap-3 items-center">
    <div className="p-2 bg-white/10 rounded-xl text-blue-300">{icon}</div>
    <p className="text-xs font-semibold text-blue-100">{text}</p>
  </div>
);

const FileUpload: React.FC<{ label: string; file: File | null; onFileSelect: (file: File | null) => void }> = ({ label, file, onFileSelect }) => {
  return (
    <div className="space-y-1">
      <div
        className={`w-full border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${file ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50 hover:bg-gray-100'}`}
        onClick={() => document.getElementById(`file-${label}`)?.click()}
      >
        <input
          type="file"
          id={`file-${label}`}
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              onFileSelect(e.target.files[0]);
            }
          }}
        />
        {file ? (
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle size={20} />
            <span className="text-xs font-bold truncate max-w-[200px]">{file.name}</span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFileSelect(null); }}
              className="p-1 hover:bg-green-200 rounded-full"
            >
              <AlertCircle size={14} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-400">
            <Upload size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
