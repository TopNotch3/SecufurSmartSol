'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { mockOrders } from '@/lib/admin/mockData';
import { Eye } from 'lucide-react';

export default function OrdersPage() {
  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'seller', label: 'Seller' },
    { key: 'amount', label: 'Amount', render: (value: number) => `$${value.toFixed(2)}` },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Paid' ? 'success' : 'warning'}>
          {value}
        </AdminBadge>
      )
    },
    {
      key: 'orderStatus',
      label: 'Order Status',
      render: (value: string) => (
        <AdminBadge
          variant={
            value === 'Delivered'
              ? 'success'
              : value === 'Processing'
              ? 'info'
              : value === 'Shipped'
              ? 'info'
              : 'warning'
          }
        >
          {value}
        </AdminBadge>
      )
    },
    { key: 'createdAt', label: 'Created' },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string) => (
        <Link href={`/admin/orders/${value}`}>
          <AdminButton variant="ghost" size="sm">
            <Eye size={16} />
          </AdminButton>
        </Link>
      )
    }
  ];

  return (
    <AdminLayout title="Orders Management">
      <div className="space-y-6">
        <AdminPageHeader title="Orders" description="Manage orders and fulfillment" />

        <AdminCard>
          <AdminTable columns={columns} data={mockOrders} />
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
