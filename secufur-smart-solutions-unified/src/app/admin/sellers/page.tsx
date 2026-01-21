'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { mockSellers } from '@/lib/admin/mockData';
import { Eye, Check, XCircle } from 'lucide-react';

export default function SellersPage() {
  const columns = [
    { key: 'id', label: 'Seller ID' },
    { key: 'name', label: 'Seller Name' },
    { key: 'email', label: 'Email' },
    { key: 'productsCount', label: 'Products' },
    {
      key: 'verificationStatus',
      label: 'Verification',
      render: (value: string) => (
        <AdminBadge variant={value === 'Verified' ? 'success' : 'warning'}>
          {value}
        </AdminBadge>
      )
    },
    {
      key: 'accountStatus',
      label: 'Account Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Active' ? 'success' : 'error'}>
          {value}
        </AdminBadge>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/admin/sellers/${value}`}>
            <AdminButton variant="ghost" size="sm">
              <Eye size={16} />
            </AdminButton>
          </Link>
          <AdminButton variant="secondary" size="sm">
            <Check size={16} />
          </AdminButton>
          <AdminButton variant="danger" size="sm">
            <XCircle size={16} />
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Sellers Management">
      <div className="space-y-6">
        <AdminPageHeader title="Sellers" description="Manage sellers and verify accounts" />

        <AdminCard>
          <AdminTable columns={columns} data={mockSellers} />
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
