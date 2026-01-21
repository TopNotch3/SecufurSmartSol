'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { mockOrders } from '@/lib/admin/mockData';
import { ChevronLeft, Check, Clock, Truck, Package } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = mockOrders.find((o) => o.id === params.id) || mockOrders[0];

  const timelineSteps = [
    { status: 'Order Placed', icon: Package, completed: true },
    { status: 'Processing', icon: Clock, completed: order.orderStatus !== 'Pending' },
    { status: 'Shipped', icon: Truck, completed: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' },
    { status: 'Delivered', icon: Check, completed: order.orderStatus === 'Delivered' }
  ];

  return (
    <AdminLayout title={`Order: ${order.id}`}>
      <div className="space-y-6">
        <Link href="/admin/orders">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Orders
          </AdminButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{order.id}</h2>
                  <p className="text-gray-600 mt-1">Placed on {order.createdAt}</p>
                  <div className="flex gap-4 mt-4">
                    <AdminBadge variant={order.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                      {order.paymentStatus}
                    </AdminBadge>
                    <AdminBadge
                      variant={
                        order.orderStatus === 'Delivered'
                          ? 'success'
                          : order.orderStatus === 'Processing'
                          ? 'info'
                          : 'warning'
                      }
                    >
                      {order.orderStatus}
                    </AdminBadge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="text-3xl font-bold text-gray-900">${order.amount.toFixed(2)}</p>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-6">
                {timelineSteps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? 'bg-green-100 text-green-600'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          <Icon size={20} />
                        </div>
                        {idx < timelineSteps.length - 1 && (
                          <div
                            className={`w-0.5 h-12 my-2 ${
                              step.completed ? 'bg-green-200' : 'bg-gray-200'
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="font-medium text-gray-900">{step.status}</p>
                        {step.completed && (
                          <p className="text-sm text-gray-600">Completed</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Items</h3>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between border-b border-gray-200 pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.product}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer</h3>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium mt-1">{order.customer}</p>
              </div>
              <Link href={`/admin/users/${order.customerId}`}>
                <AdminButton variant="secondary" className="w-full mt-4" size="sm">
                  View Customer Profile
                </AdminButton>
              </Link>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller</h3>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="text-gray-900 font-medium mt-1">{order.seller}</p>
              </div>
              <Link href={`/admin/sellers/${order.sellerId}`}>
                <AdminButton variant="secondary" className="w-full mt-4" size="sm">
                  View Seller Profile
                </AdminButton>
              </Link>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Info</h3>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-gray-900 font-medium mt-1">{order.paymentStatus}</p>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-600">Amount</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">${order.amount.toFixed(2)}</p>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
