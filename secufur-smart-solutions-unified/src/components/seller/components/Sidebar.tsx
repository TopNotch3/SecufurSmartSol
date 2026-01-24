import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  IndianRupee,
  MessageSquare,
  Settings,
  History,
  LogOut,
  Shield,
  TrendingUp,
  RotateCcw
} from 'lucide-react';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const pathname = usePathname();
  const navItems = [
    { name: 'Dashboard', path: '/seller', icon: LayoutDashboard },
    { name: 'Products', path: '/seller/products', icon: Package },
    { name: 'Orders', path: '/seller/orders', icon: ShoppingCart },
    { name: 'Financials', path: '/seller/financials', icon: IndianRupee },
    { name: 'Audit Logs', path: '/seller/audit-logs', icon: History },
    { name: 'Settings', path: '/seller/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex w-64 bg-[#002366] text-white flex-col h-screen shrink-0 border-r border-white/5 relative z-30">
      <div className="p-8 pb-10">
        <h2 className="text-2xl font-jakarta font-black tracking-wide">Secufur Smart Solutions</h2>
        <p className="text-[9px] uppercase tracking-[0.3em] text-blue-300/60 font-black mt-1">Seller Central</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || (item.path !== '/seller' && pathname.startsWith(item.path));
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isActive
                  ? 'bg-white text-[#002366] font-black shadow-2xl shadow-black/20'
                  : 'text-blue-100/50 hover:bg-white/5 hover:text-white'
                }
              `}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#002366]' : 'text-blue-300/40 group-hover:text-white'} />
              <span className="text-xs uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-400 hover:bg-red-500/10 rounded-2xl transition-all text-xs font-black uppercase tracking-widest"
        >
          <LogOut size={20} strokeWidth={2.5} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
