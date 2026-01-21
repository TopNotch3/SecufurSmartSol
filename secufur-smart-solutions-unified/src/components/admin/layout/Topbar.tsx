'use client';

import { LogOut, User } from 'lucide-react';

interface TopbarProps {
  title: string;
}

export function Topbar({ title }: TopbarProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

      <div className="flex items-center gap-6">
        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
          <User size={20} />
          <span className="text-sm font-medium">Profile</span>
        </button>
        <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </header>
  );
}
