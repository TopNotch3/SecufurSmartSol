'use client';

import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { mockOrders, mockActivities } from '@/lib/admin/mockData';
import { TrendingUp, Users, Store, Package, ShoppingCart, DollarSign } from 'lucide-react';

export default function DashboardPage() {
  const metrics = [
    { label: 'Total Users', value: '1,284', icon: Users, color: 'bg-blue-50' },
    { label: 'Total Sellers', value: '47', icon: Store, color: 'bg-green-50' },
    { label: 'Total Products', value: '1,256', icon: Package, color: 'bg-purple-50' },
    { label: 'Total Orders', value: '8,942', icon: ShoppingCart, color: 'bg-yellow-50' },
    { label: 'Total Revenue', value: '$287,450', icon: DollarSign, color: 'bg-red-50' }
  ];

  const orderColumns = [
    { key: 'id', label: 'Order ID' },
    { key: 'customer', label: 'Customer' },
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
              : 'warning'
          }
        >
          {value}
        </AdminBadge>
      )
    },
    { key: 'createdAt', label: 'Created' }
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <AdminCard key={metric.label} className={metric.color}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{metric.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  </div>
                  <Icon size={24} className="text-gray-400" />
                </div>
              </AdminCard>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
              <AdminTable columns={orderColumns} data={mockOrders.slice(0, 5)} />
            </AdminCard>
          </div>

          <div>
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {mockActivities.map((activity) => (
                  <div key={activity.id} className="text-sm border-b border-gray-200 pb-3 last:border-0">
                    <p className="text-gray-700 font-medium">{activity.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{activity.timestamp}</p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
