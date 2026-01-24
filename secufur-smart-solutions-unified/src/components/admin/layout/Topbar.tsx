'use client';

import { LogOut, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { Button } from '@/components/admin/ui/button';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    router.push('/admin/login');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <User size={20} />
            <span className="text-sm font-medium">Profile</span>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </header>

      <AdminModal
        isOpen={isProfileOpen}
        title="Admin Profile"
        onClose={() => setIsProfileOpen(false)}
        actions={
          <Button onClick={() => setIsProfileOpen(false)} className="bg-slate-200 text-slate-800 hover:bg-slate-300">
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
              <User size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Admin User</h3>
              <p className="text-sm text-gray-500">Super Administrator</p>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-500">Email</span>
              <span className="text-sm text-gray-900 col-span-2 font-mono">admin@luvarte.in</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-500">Role</span>
              <span className="text-sm text-gray-900 col-span-2">Owner</span>
            </div>
            <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-md">
              <span className="text-sm font-medium text-gray-500">Last Login</span>
              <span className="text-sm text-gray-900 col-span-2">Just Now</span>
            </div>
          </div>
        </div>
      </AdminModal>
    </>
  );
}
