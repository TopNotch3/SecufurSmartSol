import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import { useApp } from '@/context/seller/AppContext';
import { Menu, X, LogOut, LayoutDashboard, Package, ShoppingCart, IndianRupee, MessageSquare, History, Settings, Bell } from 'lucide-react';

interface LayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ onLogout, children }) => {
  const { seller, notifications } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const navItems = [
    { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
    { name: 'Financials', path: '/seller/financials', icon: IndianRupee },
    { name: 'Support', path: '/seller/support', icon: MessageSquare },
    { name: 'Audit Logs', path: '/seller/audit-logs', icon: History },
    { name: 'Settings', path: '/seller/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFD]">
      {/* Desktop Sidebar */}
      <Sidebar onLogout={onLogout} />

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#002366] text-white flex flex-col animate-in slide-in-from-left duration-300 shadow-2xl">
            <div className="p-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-jakarta font-black tracking-tighter italic">LUVARTE</h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-blue-300/60 font-black mt-1">Seller Central</p>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.path || (item.path !== '/seller' && pathname.startsWith(item.path));
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300
                      ${isActive ? 'bg-white text-[#002366] font-black' : 'text-blue-100/50 hover:bg-white/5'}
                    `}
                  >
                    <item.icon size={20} />
                    <span className="text-xs uppercase tracking-widest">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-6 border-t border-white/5">
              <button onClick={onLogout} className="w-full flex items-center gap-4 px-5 py-4 text-red-400 bg-red-500/10 rounded-2xl text-xs font-black uppercase tracking-widest">
                <LogOut size={20} /> Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-14 sm:h-16 border-b border-gray-100 flex items-center justify-between px-4 sm:px-8 bg-white shrink-0 z-40">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-xl transition-all text-[#002366]"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-base sm:text-xl font-bold font-jakarta text-[#002366] truncate">
              Seller Central
              <span className="hidden sm:inline-block text-[9px] sm:text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full ml-2 border border-blue-100 font-bold uppercase">
                {seller?.status || 'Pro'}
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="relative p-2 hover:bg-gray-50 rounded-xl transition-all">
              <Bell size={20} className="text-slate-400" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{seller?.contactPerson || 'Merchant'}</p>
              <p className="text-[9px] sm:text-[10px] text-green-600 font-extrabold uppercase tracking-widest">
                {seller?.verification?.agreementAccepted ? 'Verified' : 'Pending'}
              </p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-[#002366] text-white flex items-center justify-center font-bold shadow-lg shadow-blue-900/20 text-sm">
              {(seller?.contactPerson || 'M').charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-8 relative pb-20 sm:pb-24">
          {children}

          <footer className="absolute bottom-0 left-0 right-0 h-12 sm:h-14 bg-gray-50 border-t border-gray-100 px-4 sm:px-8 flex items-center justify-between text-[8px] sm:text-[10px] font-bold text-slate-400">
            <div className="hidden sm:flex gap-4 sm:gap-6 uppercase tracking-widest">
              <a href="#" className="hover:text-[#002366]">Privacy</a>
              <a href="#" className="hover:text-[#002366]">Terms</a>
              <a href="#" className="hover:text-[#002366]">GST Compliance</a>
            </div>
            <p className="mx-auto sm:mx-0">© 2024 {seller?.businessName?.toUpperCase() || 'LUVARTE'}</p>
          </footer>
        </div>
      </main>
    </div>
  );
};

export default Layout;
