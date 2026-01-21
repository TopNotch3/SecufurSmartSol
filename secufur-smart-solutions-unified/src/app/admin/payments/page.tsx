'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { mockPayments } from '@/lib/admin/mockData';

export default function PaymentsPage() {
  const columns = [
    { key: 'id', label: 'Payment ID' },
    { key: 'orderId', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount', render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'paymentMethod', label: 'Payment Method' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Completed' ? 'success' : 'warning'}>
          {value}
        </AdminBadge>
      )
    },
    { key: 'createdAt', label: 'Created' }
  ];

  return (
    <AdminLayout title="Payments Management">
      <div className="space-y-6">
        <AdminPageHeader title="Payments" description="View and manage payment transactions" />

        <AdminCard>
          <AdminTable columns={columns} data={mockPayments} />
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
