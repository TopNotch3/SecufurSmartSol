import React, { useState } from 'react';
import { useApp } from '@/context/seller/AppContext';
import { 
  IndianRupee, Download, ArrowUpRight, ArrowDownRight, CreditCard, Wallet, Calendar, 
  CheckCircle, X, AlertTriangle, Clock, Building, Percent, TrendingUp
} from 'lucide-react';

const Financials: React.FC = () => {
  const { financials, seller, settlements, payoutSettings, updatePayoutSettings } = useApp();
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [localPayoutSettings, setLocalPayoutSettings] = useState(payoutSettings);

  const handleSavePayoutSettings = () => {
    updatePayoutSettings(localPayoutSettings);
    setIsPayoutModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-16">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">Payments & Payouts</h2>
          <p className="text-slate-500 text-xs sm:text-sm">Monitor your earnings and upcoming bank transfers.</p>
        </div>
        <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-gray-200 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-700 hover:bg-gray-50 shadow-sm transition-all">
          <Download size={18} />
          DOWNLOAD STATEMENT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <FinanceCard 
            title="Gross Sales" 
            amount={financials.grossSales} 
            icon={<ArrowUpRight className="text-green-500" />} 
            subtitle="Total order value"
          />
          <FinanceCard 
            title="Net Earnings" 
            amount={financials.netEarnings} 
            icon={<Wallet className="text-blue-500" />} 
            subtitle={`After ${seller?.commissionRate || 10}% platform fee`}
          />
          <FinanceCard 
            title="Platform Commission" 
            amount={financials.commission} 
            icon={<Percent className="text-orange-500" />} 
            subtitle="Service charges"
          />
          <FinanceCard 
            title="Pending Payout" 
            amount={financials.pendingPayout} 
            icon={<Calendar className="text-purple-500" />} 
            subtitle={`Next: ${payoutSettings.preferredPayoutDay}`}
            isHighlight
          />
        </div>

        <div className="bg-[#002366] rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 text-white shadow-2xl shadow-blue-900/30 flex flex-col h-full border border-white/5">
          <div className="mb-6 sm:mb-10 flex justify-between items-start">
            <div>
              <h3 className="font-jakarta font-bold text-lg sm:text-xl mb-1">Settlement Account</h3>
              <p className="text-blue-300 text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-2">
                {seller?.verification?.bankVerified ? (
                  <>
                    <CheckCircle size={12} className="text-green-400" /> Verified
                  </>
                ) : (
                  <>
                    <AlertTriangle size={12} className="text-yellow-400" /> Verification Pending
                  </>
                )}
              </p>
            </div>
            <div className="p-2 sm:p-3 bg-white/10 rounded-xl sm:rounded-2xl">
              <CreditCard size={20} className="text-blue-200" />
            </div>
          </div>
          
          <div className="space-y-4 sm:space-y-6 flex-1">
            <div className="bg-white/5 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/10">
              <p className="text-[9px] sm:text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-2 sm:mb-3 opacity-60">Bank Account</p>
              <p className="font-extrabold text-base sm:text-lg tracking-tight">
                {seller?.bankDetails?.bankName || 'HDFC BANK'} •••• {seller?.bankDetails?.accountNumber?.slice(-4) || '9087'}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-200/50 mt-1 font-mono">
                IFSC: {seller?.bankDetails?.ifsc || 'HDFC0001234'}
              </p>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-wider opacity-60">Frequency</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] bg-white/10 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full">
                {payoutSettings.payoutFrequency}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-wider opacity-60">Auto-Payout</span>
              <span className={`text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] ${
                payoutSettings.autoPayoutEnabled ? 'text-green-400' : 'text-yellow-400'
              }`}>
                {payoutSettings.autoPayoutEnabled ? 'ENABLED' : 'DISABLED'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-white/5">
              <span className="text-[10px] sm:text-xs text-blue-100 font-bold uppercase tracking-wider opacity-60">Min Payout</span>
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em]">
                ₹{payoutSettings.minPayoutAmount}
              </span>
            </div>
          </div>
          
          <button 
            onClick={() => setIsPayoutModalOpen(true)}
            className="mt-6 sm:mt-10 w-full py-4 sm:py-5 bg-white text-[#002366] rounded-xl sm:rounded-2xl font-bold text-[10px] sm:text-xs uppercase tracking-[0.1em] hover:bg-blue-50 transition-all shadow-xl shadow-black/20"
          >
            MANAGE PAYOUT SETTINGS
          </button>
        </div>
      </div>

      {/* Settlements History */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-jakarta font-bold text-lg text-slate-800">Settlement History</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last 10 settlements</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                <th className="px-4 sm:px-8 py-4 sm:py-5">Settlement ID</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5">Period</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5">Gross</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5">Fees</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5">Net Amount</th>
                <th className="px-4 sm:px-6 py-4 sm:py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {settlements.map((settlement) => (
                <tr key={settlement.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-4 sm:px-8 py-4 sm:py-6 font-mono text-[10px] sm:text-[11px] font-bold text-slate-600 group-hover:text-[#002366]">
                    {settlement.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 text-[10px] sm:text-xs font-semibold text-slate-500">
                    {settlement.period.from} - {settlement.period.to}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-jakarta font-bold text-slate-800 text-xs sm:text-sm">
                    ₹{settlement.grossAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 text-[10px] sm:text-xs text-red-500 font-bold">
                    -₹{(settlement.platformFee + settlement.gstOnFee + settlement.penalties).toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6 font-jakarta font-black text-green-600 text-xs sm:text-sm">
                    ₹{settlement.netAmount.toLocaleString('en-IN')}
                  </td>
                  <td className="px-4 sm:px-6 py-4 sm:py-6">
                    <span className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest border ${
                      settlement.status === 'Completed' 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : settlement.status === 'Processing'
                        ? 'bg-blue-50 text-blue-600 border-blue-100'
                        : 'bg-yellow-50 text-yellow-600 border-yellow-100'
                    }`}>
                      {settlement.status}
                    </span>
                  </td>
                </tr>
              ))}
              {settlements.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center">
                    <Clock className="mx-auto mb-4 text-gray-300" size={32} />
                    <p className="text-sm text-slate-400">No settlements yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Settings Modal */}
      {isPayoutModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="bg-[#002366] px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between text-white sticky top-0">
              <h3 className="text-lg sm:text-xl font-jakarta font-bold">Payout Settings</h3>
              <button onClick={() => setIsPayoutModalOpen(false)} className="hover:bg-white/10 p-1 rounded-lg transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 sm:p-8 space-y-6">
              {/* Auto Payout Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <p className="text-sm font-bold text-slate-800">Auto Payout</p>
                  <p className="text-[10px] text-slate-500">Automatically transfer funds to your bank</p>
                </div>
                <button 
                  onClick={() => setLocalPayoutSettings({
                    ...localPayoutSettings, 
                    autoPayoutEnabled: !localPayoutSettings.autoPayoutEnabled
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    localPayoutSettings.autoPayoutEnabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    localPayoutSettings.autoPayoutEnabled ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Payout Frequency */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Payout Frequency
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]"
                  value={localPayoutSettings.payoutFrequency}
                  onChange={(e) => setLocalPayoutSettings({
                    ...localPayoutSettings, 
                    payoutFrequency: e.target.value as any
                  })}
                >
                  <option value="Weekly">Weekly</option>
                  <option value="Biweekly">Bi-weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              {/* Preferred Payout Day */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Preferred Payout Day
                </label>
                <select 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#002366]"
                  value={localPayoutSettings.preferredPayoutDay}
                  onChange={(e) => setLocalPayoutSettings({
                    ...localPayoutSettings, 
                    preferredPayoutDay: e.target.value
                  })}
                >
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </div>

              {/* Minimum Payout Amount */}
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Minimum Payout Amount (₹)
                </label>
                <input 
                  type="number"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-[#002366]"
                  value={localPayoutSettings.minPayoutAmount}
                  onChange={(e) => setLocalPayoutSettings({
                    ...localPayoutSettings, 
                    minPayoutAmount: parseInt(e.target.value) || 0
                  })}
                />
                <p className="text-[10px] text-slate-400 mt-2">
                  Payouts will only be processed when balance exceeds this amount
                </p>
              </div>

              {/* Hold Payouts */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                <div>
                  <p className="text-sm font-bold text-yellow-800">Hold Payouts</p>
                  <p className="text-[10px] text-yellow-600">Temporarily pause all payouts</p>
                </div>
                <button 
                  onClick={() => setLocalPayoutSettings({
                    ...localPayoutSettings, 
                    holdPayouts: !localPayoutSettings.holdPayouts
                  })}
                  className={`w-12 h-6 rounded-full transition-all relative ${
                    localPayoutSettings.holdPayouts ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    localPayoutSettings.holdPayouts ? 'left-6' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {localPayoutSettings.holdPayouts && (
                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-800">Payouts are on hold</p>
                      <p className="text-[10px] text-red-600 mt-1">
                        No settlements will be processed until you disable this setting.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => {
                    setLocalPayoutSettings(payoutSettings);
                    setIsPayoutModalOpen(false);
                  }} 
                  className="flex-1 py-4 bg-gray-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                >
                  CANCEL
                </button>
                <button 
                  onClick={handleSavePayoutSettings}
                  className="flex-1 py-4 bg-[#002366] text-white rounded-xl font-bold text-sm hover:bg-blue-900 transition-all shadow-xl shadow-blue-900/20"
                >
                  SAVE CHANGES
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FinanceCard: React.FC<{ title: string; amount: number; icon: React.ReactNode; subtitle: string; isHighlight?: boolean }> = ({ title, amount, icon, subtitle, isHighlight }) => (
  <div className={`p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-sm border transition-all hover:shadow-md ${
    isHighlight ? 'bg-[#002366]/5 border-blue-100' : 'bg-white border-gray-100'
  }`}>
    <div className="flex justify-between items-center mb-6 sm:mb-8">
      <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">{title}</p>
      <div className={`p-2 sm:p-3 rounded-xl sm:rounded-2xl ${isHighlight ? 'bg-[#002366] text-white' : 'bg-gray-50 text-[#002366]'}`}>
        {icon}
      </div>
    </div>
    <div className="flex items-baseline gap-1 mb-2">
      <span className="text-lg sm:text-xl font-bold text-slate-300">₹</span>
      <h4 className={`text-2xl sm:text-3xl font-jakarta font-black ${isHighlight ? 'text-[#002366]' : 'text-slate-800'}`}>
        {amount.toLocaleString('en-IN')}
      </h4>
    </div>
    <p className="text-[8px] sm:text-[9px] text-slate-400 font-extrabold uppercase tracking-widest">{subtitle}</p>
  </div>
);

export default Financials;
