'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { mockUsers } from '@/lib/admin/mockData';
import { Eye, Ban } from 'lucide-react';

export default function UsersPage() {
  const columns = [
    { key: 'id', label: 'User ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Active' ? 'success' : 'error'}>
          {value}
        </AdminBadge>
      )
    },
    { key: 'createdAt', label: 'Created At' },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/admin/users/${value}`}>
            <AdminButton variant="ghost" size="sm">
              <Eye size={16} />
            </AdminButton>
          </Link>
          <AdminButton variant="danger" size="sm">
            <Ban size={16} />
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-6">
        <AdminPageHeader title="Users" description="Manage platform users and permissions" />

        <AdminCard>
          <AdminTable columns={columns} data={mockUsers} />
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
