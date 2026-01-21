'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { ChevronLeft } from 'lucide-react';

export default function GeneralSettingsPage() {
  return (
    <AdminLayout title="General Settings">
      <div className="space-y-6">
        <Link href="/admin/settings">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Settings
          </AdminButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Name</label>
                <input
                  type="text"
                  defaultValue="Secufur IP Solutions"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platform Domain</label>
                <input
                  type="text"
                  defaultValue="secufur.com"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
                <input
                  type="email"
                  defaultValue="support@secufur.com"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Support Phone</label>
                <input
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency & Region</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <input
                  type="text"
                  defaultValue="USD"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <input
                  type="text"
                  defaultValue="UTC-5 (EST)"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Business Type</label>
                <input
                  type="text"
                  defaultValue="E-commerce Platform"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID</label>
                <input
                  type="text"
                  defaultValue="12-3456789"
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-900"
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminLayout>
  );
}
