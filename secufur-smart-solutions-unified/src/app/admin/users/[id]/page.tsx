'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { mockUsers } from '@/lib/admin/mockData';
import { ChevronLeft, Mail, Phone, Calendar } from 'lucide-react';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  const user = mockUsers.find((u) => u.id === params.id) || mockUsers[0];

  return (
    <AdminLayout title={`User: ${user.name}`}>
      <div className="space-y-6">
        <Link href="/admin/users">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Users
          </AdminButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg"></div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-600 mt-1">{user.email}</p>
                  <div className="flex gap-4 mt-4">
                    <AdminBadge variant="success">{user.status}</AdminBadge>
                    <AdminBadge variant="info">{user.role}</AdminBadge>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Details</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Member Since</p>
                    <p className="text-gray-900 font-medium">{user.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-400"></div>
                  <div>
                    <p className="text-sm text-gray-600">Last Active</p>
                    <p className="text-gray-900 font-medium">{user.lastActive}</p>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Summary</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{user.ordersCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-900">${user.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <AdminButton variant="secondary" className="w-full" disabled>
                  Send Message
                </AdminButton>
                <AdminButton variant="danger" className="w-full" disabled>
                  Block User
                </AdminButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
