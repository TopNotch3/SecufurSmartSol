'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { mockProducts } from '@/lib/admin/mockData';
import { Eye, Trash2 } from 'lucide-react';

export default function ProductsPage() {
  const columns = [
    { key: 'id', label: 'Product ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'seller', label: 'Seller' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (value: number) => `$${value.toFixed(2)}` },
    {
      key: 'stock',
      label: 'Stock',
      render: (value: number) => (
        <span className={value > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Active' ? 'success' : value === 'Out of Stock' ? 'warning' : 'error'}>
          {value}
        </AdminBadge>
      )
    },
    {
      key: 'id',
      label: 'Actions',
      render: (value: string) => (
        <div className="flex gap-2">
          <Link href={`/admin/products/${value}`}>
            <AdminButton variant="ghost" size="sm">
              <Eye size={16} />
            </AdminButton>
          </Link>
          <AdminButton variant="danger" size="sm">
            <Trash2 size={16} />
          </AdminButton>
        </div>
      )
    }
  ];

  return (
    <AdminLayout title="Products Management">
      <div className="space-y-6">
        <AdminPageHeader title="Products" description="Manage products and inventory" />

        <AdminCard>
          <AdminTable columns={columns} data={mockProducts} />
        </AdminCard>
      </div>
    </AdminLayout>
  );
}
