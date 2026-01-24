import { useRouter } from 'next/navigation';
import React from 'react';
import { useApp } from '@/context/seller/AppContext';
import {
  ShieldCheck,
  Clock,
  IndianRupee,
  Package,
  AlertCircle,
  Lock,
  Server,
  Activity,
  PlusCircle,
  FileBarChart,
  UserCheck,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Truck,
  Users
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { orders, products, notifications, financials, seller, performance, returns } = useApp();
  const router = useRouter();

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const lowStockProducts = products.filter(p => p.availableStock < 10).length;
  const pendingReturns = returns.filter(r => r.status === 'Requested').length;

  const slaViolations = orders.filter(o => {
    if (o.status === 'Pending') {
      return new Date(o.slaDeadlines.acceptBy) < new Date();
    }
    if (['Accepted', 'Processing', 'Packed'].includes(o.status)) {
      return new Date(o.slaDeadlines.dispatchBy) < new Date();
    }
    return false;
  }).length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-jakarta font-extrabold text-slate-800">
            Welcome, {seller?.contactPerson || 'Merchant'}!
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Managing <span className="font-bold text-[#002366]">{seller?.businessName || 'Your Business'}</span>
            {seller?.gstNumber && <span className="hidden sm:inline"> • GST: {seller.gstNumber}</span>}
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Action buttons can go here */}
        </div>
      </div>

      {seller?.status && seller.status !== 'Live' && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3 ${seller.status === 'Applied' ? 'bg-yellow-50 border-yellow-100' :
          seller.status === 'UnderReview' ? 'bg-blue-50 border-blue-100' :
            seller.status === 'Suspended' ? 'bg-red-50 border-red-100' :
              'bg-gray-50 border-gray-100'
          }`}>
          <AlertTriangle size={18} className={
            seller.status === 'Applied' ? 'text-yellow-500' :
              seller.status === 'UnderReview' ? 'text-blue-500' :
                seller.status === 'Suspended' ? 'text-red-500' : 'text-gray-500'
          } />
          <div>
            <p className="text-sm font-bold text-slate-800">Account Status: {seller.status}</p>
            <p className="text-xs text-slate-500 mt-1">
              {seller.status === 'Applied' && 'Your application is submitted. Complete verification to start selling.'}
              {seller.status === 'UnderReview' && 'Your documents are under review. This usually takes 2-3 business days.'}
              {seller.status === 'Suspended' && 'Your account is suspended. Contact support for assistance.'}
            </p>
            {seller.status === 'Applied' && (
              <button
                onClick={() => router.push('/seller/compliance')}
                className="mt-3 text-[10px] font-bold text-[#002366] uppercase tracking-wider hover:underline"
              >
                Complete Verification →
              </button>
            )}
          </div>
        </div>
      )}



      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Pending Orders"
          value={pendingOrders}
          icon={<Clock className="text-orange-500" />}
          trend={pendingOrders > 0 ? "Requires Action" : "All Clear"}
          color="border-orange-100"
          onClick={() => router.push('/orders')}
        />
        <StatCard
          title="Net Earnings"
          value={`₹${financials.netEarnings.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="text-green-500" />}
          trend={`Next Payout: ${financials.payoutFrequency}`}
          color="border-green-100"
          onClick={() => router.push('/financials')}
        />
        <StatCard
          title="Low Stock Alert"
          value={lowStockProducts}
          icon={<AlertCircle className="text-red-500" />}
          trend="Needs Restocking"
          color="border-red-100"
          onClick={() => router.push('/products')}
        />
        <StatCard
          title="Active Products"
          value={products.filter(p => p.status === 'Live').length}
          icon={<Package className="text-blue-500" />}
          trend={`${products.length} Total SKUs`}
          color="border-blue-100"
          onClick={() => router.push('/products')}
        />
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <PerformanceCard
          label="Order Acceptance"
          value={`${performance.ordersReceived > 0 ? Math.round((performance.ordersAccepted / performance.ordersReceived) * 100) : 100}%`}
          status={performance.cancellationRate < 5 ? 'good' : performance.cancellationRate < 10 ? 'warning' : 'bad'}
        />
        <PerformanceCard
          label="On-Time Dispatch"
          value={`${100 - performance.lateDispatchRate}%`}
          status={performance.lateDispatchRate < 5 ? 'good' : performance.lateDispatchRate < 15 ? 'warning' : 'bad'}
        />
        <PerformanceCard
          label="Return Rate"
          value={`${performance.returnRate.toFixed(1)}%`}
          status={performance.returnRate < 3 ? 'good' : performance.returnRate < 8 ? 'warning' : 'bad'}
        />
        <PerformanceCard
          label="Account Health"
          value={performance.accountHealth}
          status={performance.accountHealth === 'Excellent' || performance.accountHealth === 'Good' ? 'good' :
            performance.accountHealth === 'Fair' ? 'warning' : 'bad'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-jakarta font-bold text-lg mb-4 sm:mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <QuickAction icon={<PlusCircle size={20} />} label="Add Product" onClick={() => router.push('/products')} color="bg-blue-50 text-blue-600" />
              <QuickAction icon={<Truck size={20} />} label="Ship Orders" onClick={() => router.push('/orders')} color="bg-orange-50 text-orange-600" />
              <QuickAction icon={<FileBarChart size={20} />} label="Financials" onClick={() => router.push('/financials')} color="bg-green-50 text-green-600" />
              <QuickAction icon={<Users size={20} />} label="Team Access" onClick={() => router.push('/settings')} color="bg-purple-50 text-purple-600" />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="font-jakarta font-bold text-lg">Recent Orders</h3>
              <button onClick={() => router.push('/orders')} className="text-[10px] font-bold text-[#002366] uppercase tracking-wider hover:underline">
                View All →
              </button>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {orders.slice(0, 5).map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex gap-3 sm:gap-4 items-center min-w-0">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#002366]/5 flex items-center justify-center text-[#002366] font-bold text-[10px] sm:text-xs shrink-0">
                      #{o.id.slice(-4)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-800 truncate">{o.customerName}</p>
                      <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase truncate">
                        {o.items.length} item{o.items.length > 1 ? 's' : ''} • {o.paymentMethod}
                      </p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-2">
                    <p className="text-xs sm:text-sm font-extrabold text-[#002366]">₹{o.totalAmount.toLocaleString('en-IN')}</p>
                    <p className={`text-[9px] sm:text-[10px] font-bold uppercase ${o.status === 'Pending' ? 'text-orange-500' :
                      o.status === 'Delivered' ? 'text-green-500' :
                        o.status === 'Shipped' ? 'text-blue-500' : 'text-slate-400'
                      }`}>{o.status}</p>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="py-8 sm:py-12 text-center">
                  <p className="text-slate-400 text-sm mb-4">No orders yet.</p>
                  <button onClick={() => router.push('/products')} className="text-[#002366] text-xs font-bold underline">
                    ADD YOUR FIRST PRODUCT
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-jakarta font-bold text-lg mb-4 sm:mb-6">Alerts & Actions</h3>
            <div className="space-y-4 sm:space-y-6">
              {pendingOrders > 0 && (
                <AlertItem
                  icon={<Clock size={14} />}
                  title={`${pendingOrders} Pending Order${pendingOrders > 1 ? 's' : ''}`}
                  message="Accept within SLA deadline"
                  type="warning"
                  action={() => router.push('/orders')}
                />
              )}
              {pendingReturns > 0 && (
                <AlertItem
                  icon={<RotateCcw size={14} />}
                  title={`${pendingReturns} Return Request${pendingReturns > 1 ? 's' : ''}`}
                  message="Review and respond"
                  type="warning"
                  action={() => router.push('/returns')}
                />
              )}
              {lowStockProducts > 0 && (
                <AlertItem
                  icon={<AlertCircle size={14} />}
                  title={`${lowStockProducts} Low Stock Item${lowStockProducts > 1 ? 's' : ''}`}
                  message="Restock to avoid stockouts"
                  type="error"
                  action={() => router.push('/products')}
                />
              )}
              {slaViolations > 0 && (
                <AlertItem
                  icon={<XCircle size={14} />}
                  title={`${slaViolations} SLA Violation${slaViolations > 1 ? 's' : ''}`}
                  message="Immediate action required"
                  type="error"
                  action={() => router.push('/orders')}
                />
              )}
              {pendingOrders === 0 && pendingReturns === 0 && lowStockProducts === 0 && slaViolations === 0 && (
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle size={18} className="text-green-500" />
                  <div>
                    <p className="text-sm font-bold text-green-800">All Clear!</p>
                    <p className="text-xs text-green-600">No pending actions required</p>
                  </div>
                </div>
              )}
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

const QuickAction: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void; color: string }> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl transition-all hover:shadow-lg active:scale-95 ${color}`}
  >
    <div className="mb-2">{icon}</div>
    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-center">{label}</span>
  </button>
);

const ComplianceItem: React.FC<{ icon: React.ReactNode; label: string; status: string }> = ({ icon, label, status }) => (
  <div className="flex items-center gap-2 shrink-0">
    <div className="p-1.5 bg-gray-50 rounded-lg shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-[8px] sm:text-[9px] text-gray-400 font-bold uppercase tracking-wider truncate">{label}</p>
      <p className="text-[9px] sm:text-[10px] text-slate-700 font-extrabold">{status}</p>
    </div>
  </div>
);

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; trend: string; color: string; onClick?: () => void }> = ({ title, value, icon, trend, color, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-white p-4 sm:p-6 rounded-2xl shadow-sm border-l-4 ${color} transition-all hover:shadow-md group ${onClick ? 'cursor-pointer' : ''}`}
  >
    <div className="flex justify-between items-start mb-3 sm:mb-4">
      <div className="p-2 sm:p-3 bg-gray-50 rounded-xl group-hover:bg-[#002366] group-hover:text-white transition-colors">{icon}</div>
    </div>
    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{title}</p>
    <h4 className="text-xl sm:text-2xl font-jakarta font-extrabold text-slate-800">{value}</h4>
    <p className="text-[9px] sm:text-xs text-slate-500 mt-1 font-medium truncate">{trend}</p>
  </div>
);

const PerformanceCard: React.FC<{ label: string; value: string; status: 'good' | 'warning' | 'bad' }> = ({ label, value, status }) => (
  <div className={`p-4 rounded-xl border ${status === 'good' ? 'bg-green-50 border-green-100' :
    status === 'warning' ? 'bg-yellow-50 border-yellow-100' :
      'bg-red-50 border-red-100'
    }`}>
    <p className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-lg sm:text-xl font-extrabold ${status === 'good' ? 'text-green-600' :
      status === 'warning' ? 'text-yellow-600' :
        'text-red-600'
      }`}>{value}</p>
  </div>
);

const AlertItem: React.FC<{ icon: React.ReactNode; title: string; message: string; type: 'warning' | 'error' | 'info'; action?: () => void }> = ({ icon, title, message, type, action }) => (
  <div
    onClick={action}
    className={`flex gap-3 p-3 sm:p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${type === 'error' ? 'bg-red-50 border-red-100' :
      type === 'warning' ? 'bg-yellow-50 border-yellow-100' :
        'bg-blue-50 border-blue-100'
      }`}
  >
    <div className={`mt-0.5 ${type === 'error' ? 'text-red-500' :
      type === 'warning' ? 'text-yellow-600' :
        'text-blue-500'
      }`}>{icon}</div>
    <div>
      <p className={`text-xs sm:text-sm font-bold ${type === 'error' ? 'text-red-800' :
        type === 'warning' ? 'text-yellow-800' :
          'text-blue-800'
        }`}>{title}</p>
      <p className={`text-[10px] sm:text-xs ${type === 'error' ? 'text-red-600' :
        type === 'warning' ? 'text-yellow-600' :
          'text-blue-600'
        }`}>{message}</p>
    </div>
  </div>
);

export default Dashboard;
