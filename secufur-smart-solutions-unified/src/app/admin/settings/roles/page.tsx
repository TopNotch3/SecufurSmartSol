'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { mockRoles } from '@/lib/admin/mockData';
import { ChevronLeft } from 'lucide-react';

export default function RolesSettingsPage() {
  const roleColumns = [
    { key: 'name', label: 'Role Name' },
    { key: 'description', label: 'Description' },
    { key: 'usersCount', label: 'Users' },
    {
      key: 'permissions',
      label: 'Permissions',
      render: (perms: string[]) => <span className="text-sm">{perms.length} permissions</span>
    }
  ];

  const allPermissions = [
    { id: 'read', label: 'Read Data' },
    { id: 'write', label: 'Write Data' },
    { id: 'delete', label: 'Delete Data' },
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_sellers', label: 'Manage Sellers' },
    { id: 'manage_products', label: 'Manage Products' },
    { id: 'manage_orders', label: 'Manage Orders' },
    { id: 'manage_payments', label: 'Manage Payments' },
    { id: 'manage_settings', label: 'Manage Settings' }
  ];

  return (
    <AdminLayout title="Roles & Permissions">
      <div className="space-y-6">
        <Link href="/admin/settings">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Settings
          </AdminButton>
        </Link>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Roles</h3>
          <AdminTable columns={roleColumns} data={mockRoles} />
        </AdminCard>

        <AdminCard>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Permissions Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-3 font-semibold text-gray-700">Permission</th>
                  {mockRoles.map((role) => (
                    <th
                      key={role.id}
                      className="text-center px-4 py-3 font-semibold text-gray-700"
                    >
                      {role.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allPermissions.map((perm) => (
                  <tr key={perm.id} className="border-b border-gray-200">
                    <td className="px-6 py-4 text-gray-900 font-medium">{perm.label}</td>
                    {mockRoles.map((role) => (
                      <td key={role.id} className="text-center px-4 py-4">
                        {role.permissions.includes(perm.id) ? (
                          <span className="text-green-600 font-bold">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
