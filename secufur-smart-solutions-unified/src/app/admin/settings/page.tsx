'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { ChevronRight, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const sections = [
    {
      href: '/admin/settings/general',
      title: 'General Settings',
      description: 'Platform name, currency, and contact information',
      icon: SettingsIcon
    },
    {
      href: '/admin/settings/roles',
      title: 'Roles & Permissions',
      description: 'Manage user roles and their permissions',
      icon: SettingsIcon
    },
    {
      href: '/admin/settings/system',
      title: 'System',
      description: 'System maintenance and configuration',
      icon: SettingsIcon
    }
  ];

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <AdminPageHeader title="Settings" description="Manage platform configuration" />

        <div className="grid grid-cols-1 gap-4">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Link key={section.href} href={section.href}>
                <AdminCard className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon size={24} className="text-gray-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                      </div>
                    </div>
                    <ChevronRight size={24} className="text-gray-400" />
                  </div>
                </AdminCard>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
