import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { ShieldCheck, ArrowRight, Building2, CreditCard, User, Globe, Lock, AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { registerSeller, loginSeller } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useRouter();

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    brandName: '',
    gstNumber: '',
    panNumber: '',
    legalEntity: 'Pvt Ltd' as any,
    address: { line1: '', city: '', state: '', pincode: '' },
    contactPerson: '',
    phone: '',
    bankDetails: {
      accountName: '',
      accountNumber: '',
      ifsc: '',
      bankName: ''
    }
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const result = loginSeller(loginData.email, loginData.password);
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Login failed');
      }
      setLoading(false);
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 4) {
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
      }
      if (step === 3) {
        if (!formData.contactPerson || !formData.phone || !formData.address.city) {
          setError('Please fill in all required fields');
          return;
        }
      }
      
      setError('');
      setStep(step + 1);
      return;
    }
    
    // Final submission
    setLoading(true);
    setTimeout(() => {
      registerSeller({
        ...formData,
        status: 'Applied',
        complianceAgreed: false
      }, formData.password);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => router.push('/'), 1500);
    }, 1500);
  };

  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 font-jakarta">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col lg:flex-row min-h-[700px]">
        {/* Brand Side */}
        <div className="w-full lg:w-5/12 bg-[#002366] p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-400/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tighter mb-2 italic">LUVARTE</h2>
            <p className="text-blue-300 text-[10px] font-bold uppercase tracking-[0.2em]">Seller Central v2.5</p>
          </div>
          
          <div className="relative z-10 space-y-6 sm:space-y-8 my-8">
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold leading-snug">Empowering Indian Merchants with Global Standards.</h3>
              <p className="text-blue-200/70 text-sm leading-relaxed">Secure, Transparent, and RBI Compliant seller platform for your growing business.</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <FeatureItem icon={<ShieldCheck size={18} />} text="PCI-DSS v4.0 Compliant" />
              <FeatureItem icon={<Globe size={18} />} text="GST Ready Invoicing" />
              <FeatureItem icon={<Lock size={18} />} text="256-bit AES Encryption" />
              <FeatureItem icon={<FileText size={18} />} text="Automated Compliance" />
            </div>
          </div>
          
          <div className="relative z-10 pt-6 sm:pt-8 border-t border-white/10">
            <p className="text-[10px] text-blue-200/50 uppercase tracking-widest font-bold">Trusted by 12,400+ Sellers</p>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-7/12 p-6 sm:p-10 lg:p-16 flex flex-col justify-center bg-white overflow-y-auto">
          {isLogin ? (
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 mb-2">Merchant Portal</h3>
              <p className="text-slate-400 text-sm mb-8 sm:mb-10 font-medium">Access your dashboard with secure credentials.</p>
              
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-600 text-xs font-bold animate-in shake duration-300">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Merchant Email</label>
                  <input 
                    required 
                    type="email" 
                    placeholder="admin@luvarte.in" 
                    className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm transition-all focus:border-[#002366]" 
                    value={loginData.email}
                    onChange={e => setLoginData({...loginData, email: e.target.value})}
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
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                  />
                </div>
                
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Demo Credentials</p>
                  <p className="text-xs text-blue-800 font-mono">admin@luvarte.in / admin123</p>
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
                  {Array.from({ length: totalSteps }).map((_, i) => (
                    <div key={i} className={`h-1.5 w-4 sm:w-6 rounded-full transition-all ${step > i ? 'bg-[#002366]' : 'bg-gray-100'}`} />
                  ))}
                </div>
              </div>
              <p className="text-slate-400 text-sm mb-8 sm:mb-10 font-medium">
                {step === 1 && 'Create your account credentials'}
                {step === 2 && 'Verify your business identity'}
                {step === 3 && 'Contact & address information'}
                {step === 4 && 'Bank account for settlements'}
              </p>

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
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Work Email *</label>
                      <input required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} type="email" placeholder="e.g. hello@business.com" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Create Password *</label>
                      <input required value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} type="password" placeholder="Min. 8 characters" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm Password *</label>
                      <input required value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} type="password" placeholder="Re-enter password" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Legal Business Name *</label>
                      <input required value={formData.businessName} onChange={e => setFormData({...formData, businessName: e.target.value})} type="text" placeholder="As per PAN/GST" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">GSTIN *</label>
                        <input required value={formData.gstNumber} onChange={e => setFormData({...formData, gstNumber: e.target.value})} type="text" placeholder="27AABCL1234F1Z5" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">PAN *</label>
                        <input required value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value})} type="text" placeholder="AABCL1234F" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Legal Entity Type</label>
                      <select value={formData.legalEntity} onChange={e => setFormData({...formData, legalEntity: e.target.value as any})} className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm">
                        <option>Individual</option>
                        <option>Proprietorship</option>
                        <option>Partnership</option>
                        <option>Pvt Ltd</option>
                        <option>LLP</option>
                      </select>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Contact Person *</label>
                        <input required value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} type="text" placeholder="Full Name" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone *</label>
                        <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" placeholder="+91-98765-43210" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Address *</label>
                      <input required value={formData.address.line1} onChange={e => setFormData({...formData, address: {...formData.address, line1: e.target.value}})} type="text" placeholder="Street Address" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">City *</label>
                        <input required value={formData.address.city} onChange={e => setFormData({...formData, address: {...formData.address, city: e.target.value}})} type="text" placeholder="City" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                        <input value={formData.address.state} onChange={e => setFormData({...formData, address: {...formData.address, state: e.target.value}})} type="text" placeholder="State" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                      <div className="space-y-1 col-span-2 sm:col-span-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                        <input value={formData.address.pincode} onChange={e => setFormData({...formData, address: {...formData.address, pincode: e.target.value}})} type="text" placeholder="411001" className="w-full px-4 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                      <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Settlement Account</p>
                      <p className="text-xs text-amber-600 mt-1">This account will receive all your payouts. Ensure details are accurate.</p>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                      <input value={formData.bankDetails.accountName} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, accountName: e.target.value}})} type="text" placeholder="As per bank records" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Account Number</label>
                        <input value={formData.bankDetails.accountNumber} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, accountNumber: e.target.value}})} type="text" placeholder="Account Number" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">IFSC Code</label>
                        <input value={formData.bankDetails.ifsc} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, ifsc: e.target.value}})} type="text" placeholder="HDFC0001234" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm font-mono" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Bank Name</label>
                      <input value={formData.bankDetails.bankName} onChange={e => setFormData({...formData, bankDetails: {...formData.bankDetails, bankName: e.target.value}})} type="text" placeholder="Bank Name" className="w-full px-5 sm:px-6 py-3.5 sm:py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 outline-none text-sm" />
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
                        {step === totalSteps ? 'COMPLETE REGISTRATION' : 'CONTINUE'}
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
              {isLogin ? "Register as New Merchant" : "Already have an account? Login"}
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

export default AuthPage;
