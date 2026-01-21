'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { ChevronLeft, Database, Server, Shield } from 'lucide-react';

export default function SystemSettingsPage() {
  return (
    <AdminLayout title="System Settings">
      <div className="space-y-6">
        <Link href="/admin/settings">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Settings
          </AdminButton>
        </Link>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Mode</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-700 font-medium">Enable Maintenance Mode</p>
              <p className="text-gray-600 text-sm mt-1">Put the platform in maintenance mode</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled
                className="w-5 h-5 rounded border-gray-300"
              />
            </div>
          </div>
        </AdminCard>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <AdminCard>
            <div className="flex items-center gap-3 mb-4">
              <Database size={24} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Database</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-gray-900 font-medium mt-1">Connected</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Database Size</p>
                <p className="text-gray-900 font-medium mt-1">2.4 GB</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Backup</p>
                <p className="text-gray-900 font-medium mt-1">2 hours ago</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-3 mb-4">
              <Server size={24} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Server</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-gray-900 font-medium mt-1">Healthy</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className="text-gray-900 font-medium mt-1">23%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-gray-900 font-medium mt-1">45%</p>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex items-center gap-3 mb-4">
              <Shield size={24} className="text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">SSL Certificate</p>
                <p className="text-gray-900 font-medium mt-1">Active</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Firewall</p>
                <p className="text-gray-900 font-medium mt-1">Enabled</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Scan</p>
                <p className="text-gray-900 font-medium mt-1">1 day ago</p>
              </div>
            </div>
          </AdminCard>
        </div>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System Logs</h3>
          <div className="bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg max-h-64 overflow-y-auto">
            <div className="text-green-400">[2024-01-20 10:30:45] System initialized</div>
            <div className="text-green-400">[2024-01-20 10:30:50] Database connected</div>
            <div className="text-green-400">[2024-01-20 10:31:00] Cache layer activated</div>
            <div className="text-blue-400">[2024-01-20 10:35:22] Backup started</div>
            <div className="text-blue-400">[2024-01-20 10:45:22] Backup completed</div>
            <div className="text-green-400">[2024-01-20 11:00:00] Scheduled task executed</div>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
