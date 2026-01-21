import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { 
  Shield, Bell, Building, CreditCard, Save, Check, Loader2, Key, Smartphone, Truck, Star,
  User, Users, Plus, Trash2, Edit2, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, Mail, Phone, X
} from 'lucide-react';
import { UserRole, SellerUser } from '@/types/seller';

type SettingsTabType = 'Business' | 'Bank' | 'Team' | 'Shipping' | 'Notifications' | 'Security';

const Settings: React.FC = () => {
  const { 
    seller, updateSellerProfile, updateBankDetails, 
    notificationPrefs, updateNotificationPrefs,
    securitySettings, updateSecuritySettings,
    addSellerUser, updateSellerUser, removeSellerUser,
    addLog
  } = useApp();
  const navigate = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTabType>('Business');
  const [isSaved, setIsSaved] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isAddUserModal, setIsAddUserModal] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    brandName: '',
    gstNumber: '',
    panNumber: '',
    email: '',
    phone: '',
    contactPerson: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [bankData, setBankData] = useState({
    accountName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    bankName: ''
  });

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'CatalogManager' as UserRole
  });

  const [localNotifPrefs, setLocalNotifPrefs] = useState(notificationPrefs);
  const [localSecuritySettings, setLocalSecuritySettings] = useState(securitySettings);
  const [deliveryPrefs, setDeliveryPrefs] = useState(seller?.deliveryPreferences || []);

  useEffect(() => {
    if (seller) {
      setFormData({
        businessName: seller.businessName || '',
        brandName: seller.brandName || '',
        gstNumber: seller.gstNumber || '',
        panNumber: seller.panNumber || '',
        email: seller.email || '',
        phone: seller.phone || '',
        contactPerson: seller.contactPerson || '',
        addressLine1: seller.address?.line1 || '',
        city: seller.address?.city || '',
        state: seller.address?.state || '',
        pincode: seller.address?.pincode || ''
      });
      setBankData({
        accountName: seller.bankDetails?.accountName || '',
        accountNumber: seller.bankDetails?.accountNumber || '',
        confirmAccountNumber: seller.bankDetails?.accountNumber || '',
        ifsc: seller.bankDetails?.ifsc || '',
        bankName: seller.bankDetails?.bankName || ''
      });
      setDeliveryPrefs(seller.deliveryPreferences || []);
      setIsInitializing(false);
    } else {
      const timeout = setTimeout(() => {
        if (!seller) router.push('/auth');
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [seller, navigate]);

  useEffect(() => {
    setLocalNotifPrefs(notificationPrefs);
  }, [notificationPrefs]);

  useEffect(() => {
    setLocalSecuritySettings(securitySettings);
  }, [securitySettings]);

  const handleSaveProfile = () => {
    updateSellerProfile({
      businessName: formData.businessName,
      brandName: formData.brandName,
      gstNumber: formData.gstNumber,
      panNumber: formData.panNumber,
      email: formData.email,
      phone: formData.phone,
      contactPerson: formData.contactPerson,
      address: {
        line1: formData.addressLine1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    });
    showSaveSuccess();
  };

  const handleSaveBankDetails = () => {
    if (bankData.accountNumber !== bankData.confirmAccountNumber) {
      alert('Account numbers do not match');
      return;
    }
    updateBankDetails({
      accountName: bankData.accountName,
      accountNumber: bankData.accountNumber,
      ifsc: bankData.ifsc,
      bankName: bankData.bankName
    });
    showSaveSuccess();
  };

  const handleSaveNotifications = () => {
    updateNotificationPrefs(localNotifPrefs);
    showSaveSuccess();
  };

  const handleSaveSecurity = () => {
    updateSecuritySettings(localSecuritySettings);
    showSaveSuccess();
  };

  const handleSaveShipping = () => {
    updateSellerProfile({ deliveryPreferences: deliveryPrefs });
    showSaveSuccess();
  };

  const showSaveSuccess = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const togglePartner = (id: string) => {
    setDeliveryPrefs(prev => prev.map(p => p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
  };

  const handleAddUser = () => {
    if (newUser.name && newUser.email) {
      addSellerUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        isActive: true
      });
      setNewUser({ name: '', email: '', role: 'CatalogManager' });
      setIsAddUserModal(false);
      showSaveSuccess();
    }
  };

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 animate-pulse">
        <Loader2 className="animate-spin text-[#002366]" size={40} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">Settings & Preferences</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Manage your business profile, team, and integrations.</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-4 py-2 rounded-lg border border-green-100 animate-in slide-in-from-top-2">
            <Check size={16} /> CHANGES SAVED
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
        <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0">
          <SettingsTab icon={<Building size={18} />} label="Business Profile" active={activeTab === 'Business'} onClick={() => setActiveTab('Business')} />
          <SettingsTab icon={<CreditCard size={18} />} label="Bank Details" active={activeTab === 'Bank'} onClick={() => setActiveTab('Bank')} />
          <SettingsTab icon={<Users size={18} />} label="Team Access" active={activeTab === 'Team'} onClick={() => setActiveTab('Team')} />
          <SettingsTab icon={<Truck size={18} />} label="Shipping" active={activeTab === 'Shipping'} onClick={() => setActiveTab('Shipping')} />
          <SettingsTab icon={<Bell size={18} />} label="Notifications" active={activeTab === 'Notifications'} onClick={() => setActiveTab('Notifications')} />
          <SettingsTab icon={<Shield size={18} />} label="Security" active={activeTab === 'Security'} onClick={() => setActiveTab('Security')} />
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10 space-y-8">
          
          {activeTab === 'Business' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Business Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Registered Business Name" value={formData.businessName} onChange={(val) => setFormData({...formData, businessName: val})} />
                  <InputGroup label="Brand Display Name" value={formData.brandName} onChange={(val) => setFormData({...formData, brandName: val})} />
                  <InputGroup label="GSTIN" value={formData.gstNumber} onChange={(val) => setFormData({...formData, gstNumber: val})} isMono />
                  <InputGroup label="PAN Number" value={formData.panNumber} onChange={(val) => setFormData({...formData, panNumber: val})} isMono />
                </div>
              </section>
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Contact Person" value={formData.contactPerson} onChange={(val) => setFormData({...formData, contactPerson: val})} />
                  <InputGroup label="Email Address" value={formData.email} onChange={(val) => setFormData({...formData, email: val})} type="email" />
                  <InputGroup label="Phone Number" value={formData.phone} onChange={(val) => setFormData({...formData, phone: val})} type="tel" />
                </div>
              </section>
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Business Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputGroup label="Address Line 1" value={formData.addressLine1} onChange={(val) => setFormData({...formData, addressLine1: val})} />
                  </div>
                  <InputGroup label="City" value={formData.city} onChange={(val) => setFormData({...formData, city: val})} />
                  <InputGroup label="State" value={formData.state} onChange={(val) => setFormData({...formData, state: val})} />
                  <InputGroup label="Pincode" value={formData.pincode} onChange={(val) => setFormData({...formData, pincode: val})} isMono />
                </div>
              </section>
              <div className="pt-6 flex justify-end">
                <button onClick={handleSaveProfile} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
                  <Save size={18} /> SAVE PROFILE
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Bank' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                  <h3 className="font-jakarta font-bold text-lg">Settlement Account</h3>
                  {seller?.verification?.bankVerified ? (
                    <span className="flex items-center gap-2 text-green-600 text-[10px] font-bold uppercase bg-green-50 px-3 py-1 rounded-full">
                      <CheckCircle size={12} /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-yellow-600 text-[10px] font-bold uppercase bg-yellow-50 px-3 py-1 rounded-full">
                      <AlertTriangle size={12} /> Pending
                    </span>
                  )}
                </div>
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-6">
                  <div className="flex items-start gap-3">
                    <CreditCard size={18} className="text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-blue-800">Important</p>
                      <p className="text-[10px] text-blue-600 mt-1">All payouts will be settled to this bank account.</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputGroup label="Account Holder Name" value={bankData.accountName} onChange={(val) => setBankData({...bankData, accountName: val})} placeholder="As per bank records" />
                  </div>
                  <InputGroup label="Account Number" value={bankData.accountNumber} onChange={(val) => setBankData({...bankData, accountNumber: val})} type="password" isMono />
                  <InputGroup label="Confirm Account Number" value={bankData.confirmAccountNumber} onChange={(val) => setBankData({...bankData, confirmAccountNumber: val})} isMono />
                  <InputGroup label="IFSC Code" value={bankData.ifsc} onChange={(val) => setBankData({...bankData, ifsc: val})} isMono placeholder="e.g., HDFC0001234" />
                  <InputGroup label="Bank Name" value={bankData.bankName} onChange={(val) => setBankData({...bankData, bankName: val})} placeholder="e.g., HDFC Bank" />
                </div>
                {bankData.accountNumber !== bankData.confirmAccountNumber && bankData.confirmAccountNumber && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2 text-red-600 text-xs font-bold">
                    <AlertTriangle size={14} /> Account numbers do not match
                  </div>
                )}
              </section>
              <div className="pt-6 flex justify-end">
                <button onClick={handleSaveBankDetails} disabled={bankData.accountNumber !== bankData.confirmAccountNumber} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20 disabled:opacity-50">
                  <Save size={18} /> SAVE BANK DETAILS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Team' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
                  <h3 className="font-jakarta font-bold text-lg">Team Members</h3>
                  <button onClick={() => setIsAddUserModal(true)} className="flex items-center gap-2 px-4 py-2 bg-[#002366] text-white rounded-lg text-xs font-bold">
                    <Plus size={14} /> Add Member
                  </button>
                </div>
                <div className="space-y-4">
                  {seller?.users?.map(user => (
                    <div key={user.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#002366] text-white rounded-xl flex items-center justify-center font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{user.name}</p>
                          <p className="text-[10px] text-slate-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          user.role === 'Owner' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'CatalogManager' ? 'bg-blue-100 text-blue-700' :
                          user.role === 'OrderManager' ? 'bg-orange-100 text-orange-700' :
                          user.role === 'Finance' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>{user.role}</span>
                        {user.role !== 'Owner' && (
                          <button onClick={() => removeSellerUser(user.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'Shipping' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <div className="flex justify-between items-center mb-6 border-b border-gray-50 pb-4">
                  <h3 className="font-jakarta font-bold text-lg">Logistics Partners</h3>
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold uppercase">API Sync</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {deliveryPrefs.map(partner => (
                    <div key={partner.id} className="p-5 border border-gray-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-blue-100 transition-all bg-gray-50/30">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-xs ${partner.isEnabled ? 'bg-[#002366] text-white shadow-lg' : 'bg-gray-200 text-gray-400'}`}>
                          {partner.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{partner.name}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500"><Star size={10} fill="currentColor" /> {partner.rating}</span>
                            <span className="text-[10px] font-bold text-slate-400">From ₹{partner.baseRate}/kg</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => togglePartner(partner.id)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${partner.isEnabled ? 'bg-red-50 text-red-500' : 'bg-[#002366] text-white'}`}>
                        {partner.isEnabled ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  ))}
                </div>
              </section>
              <div className="pt-6 flex justify-end">
                <button onClick={handleSaveShipping} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
                  <Save size={18} /> SAVE SHIPPING
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Alert Preferences</h3>
                <div className="space-y-4">
                  <ToggleOption label="Order Alerts" description="New orders, status changes" checked={localNotifPrefs.orderAlerts} onChange={() => setLocalNotifPrefs({...localNotifPrefs, orderAlerts: !localNotifPrefs.orderAlerts})} />
                  <ToggleOption label="Inventory Alerts" description="Low stock warnings" checked={localNotifPrefs.inventoryAlerts} onChange={() => setLocalNotifPrefs({...localNotifPrefs, inventoryAlerts: !localNotifPrefs.inventoryAlerts})} />
                  <ToggleOption label="Payment Alerts" description="Settlement notifications" checked={localNotifPrefs.paymentAlerts} onChange={() => setLocalNotifPrefs({...localNotifPrefs, paymentAlerts: !localNotifPrefs.paymentAlerts})} />
                  <ToggleOption label="Performance Alerts" description="Account health updates" checked={localNotifPrefs.performanceAlerts} onChange={() => setLocalNotifPrefs({...localNotifPrefs, performanceAlerts: !localNotifPrefs.performanceAlerts})} />
                </div>
              </section>
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Delivery Channels</h3>
                <div className="space-y-4">
                  <ToggleOption label="Email Notifications" description={`Send to ${seller?.email}`} checked={localNotifPrefs.emailNotifications} onChange={() => setLocalNotifPrefs({...localNotifPrefs, emailNotifications: !localNotifPrefs.emailNotifications})} icon={<Mail size={16} />} />
                  <ToggleOption label="SMS Notifications" description={`Send to ${seller?.phone}`} checked={localNotifPrefs.smsNotifications} onChange={() => setLocalNotifPrefs({...localNotifPrefs, smsNotifications: !localNotifPrefs.smsNotifications})} icon={<Phone size={16} />} />
                  <ToggleOption label="Push Notifications" description="Browser push alerts" checked={localNotifPrefs.pushNotifications} onChange={() => setLocalNotifPrefs({...localNotifPrefs, pushNotifications: !localNotifPrefs.pushNotifications})} icon={<Bell size={16} />} />
                </div>
              </section>
              <div className="pt-6 flex justify-end">
                <button onClick={handleSaveNotifications} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
                  <Save size={18} /> SAVE NOTIFICATIONS
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Two-Factor Authentication</h3>
                <div className="p-5 border border-gray-100 rounded-2xl bg-gray-50/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${localSecuritySettings.twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">2FA Protection</p>
                        <p className="text-[10px] text-slate-500">Extra security layer</p>
                      </div>
                    </div>
                    <button onClick={() => setLocalSecuritySettings({...localSecuritySettings, twoFactorEnabled: !localSecuritySettings.twoFactorEnabled})} className={`w-12 h-6 rounded-full transition-all relative ${localSecuritySettings.twoFactorEnabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${localSecuritySettings.twoFactorEnabled ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {localSecuritySettings.twoFactorEnabled && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Method</label>
                      <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" value={localSecuritySettings.twoFactorMethod || 'SMS'} onChange={(e) => setLocalSecuritySettings({...localSecuritySettings, twoFactorMethod: e.target.value as any})}>
                        <option value="SMS">SMS OTP</option>
                        <option value="Email">Email OTP</option>
                        <option value="Authenticator">Authenticator App</option>
                      </select>
                    </div>
                  )}
                </div>
              </section>
              <section>
                <h3 className="font-jakarta font-bold text-lg mb-6 border-b border-gray-50 pb-4">Login Security</h3>
                <div className="space-y-4">
                  <ToggleOption label="Login Alerts" description="Get notified of new logins" checked={localSecuritySettings.loginAlerts} onChange={() => setLocalSecuritySettings({...localSecuritySettings, loginAlerts: !localSecuritySettings.loginAlerts})} icon={<Key size={16} />} />
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Session Timeout</label>
                    <select className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm" value={localSecuritySettings.sessionTimeout} onChange={(e) => setLocalSecuritySettings({...localSecuritySettings, sessionTimeout: parseInt(e.target.value)})}>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </section>
              <div className="pt-6 flex justify-end">
                <button onClick={handleSaveSecurity} className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20">
                  <Save size={18} /> SAVE SECURITY
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {isAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-[#002366] px-6 py-5 flex items-center justify-between text-white">
              <h3 className="text-lg font-jakarta font-bold">Add Team Member</h3>
              <button onClick={() => setIsAddUserModal(false)} className="hover:bg-white/10 p-1 rounded-lg"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" value={newUser.name} onChange={(e) => setNewUser({...newUser, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" value={newUser.email} onChange={(e) => setNewUser({...newUser, email: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Role</label>
                <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]" value={newUser.role} onChange={(e) => setNewUser({...newUser, role: e.target.value as UserRole})}>
                  <option value="CatalogManager">Catalog Manager</option>
                  <option value="OrderManager">Order Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setIsAddUserModal(false)} className="flex-1 py-3 bg-gray-100 text-slate-600 rounded-xl font-bold text-sm">Cancel</button>
                <button onClick={handleAddUser} className="flex-1 py-3 bg-[#002366] text-white rounded-xl font-bold text-sm">Add Member</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SettingsTab: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${active ? 'bg-[#002366] text-white shadow-lg shadow-blue-900/10' : 'text-slate-400 hover:bg-gray-100 hover:text-slate-600'}`}>
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const InputGroup: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; isMono?: boolean; placeholder?: string }> = ({ label, value, onChange, type = 'text', isMono, placeholder }) => (
  <div>
    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    <input type={type} className={`w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366] transition-all ${isMono ? 'font-mono' : ''}`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
  </div>
);

const ToggleOption: React.FC<{ label: string; description: string; checked: boolean; onChange: () => void; icon?: React.ReactNode }> = ({ label, description, checked, onChange, icon }) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
    <div className="flex items-center gap-3">
      {icon && <div className="text-slate-400">{icon}</div>}
      <div>
        <p className="text-sm font-bold text-slate-800">{label}</p>
        <p className="text-[10px] text-slate-500">{description}</p>
      </div>
    </div>
    <button onClick={onChange} className={`w-12 h-6 rounded-full transition-all relative ${checked ? 'bg-[#002366]' : 'bg-gray-300'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${checked ? 'left-6' : 'left-0.5'}`} />
    </button>
  </div>
);

export default Settings;
