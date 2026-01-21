'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminTable } from '@/components/admin/ui/AdminTable';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { mockSellers, mockProducts } from '@/lib/admin/mockData';
import { ChevronLeft, Mail, Phone, MapPin, TrendingUp } from 'lucide-react';

export default function SellerDetailPage({ params }: { params: { id: string } }) {
  const seller = mockSellers.find((s) => s.id === params.id) || mockSellers[0];
  const sellerProducts = mockProducts.filter((p) => p.sellerId === seller.id);

  const productColumns = [
    { key: 'id', label: 'Product ID' },
    { key: 'name', label: 'Product Name' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price', render: (value: number) => `$${value.toFixed(2)}` },
    { key: 'stock', label: 'Stock' },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => (
        <AdminBadge variant={value === 'Active' ? 'success' : 'error'}>
          {value}
        </AdminBadge>
      )
    }
  ];

  return (
    <AdminLayout title={`Seller: ${seller.name}`}>
      <div className="space-y-6">
        <Link href="/admin/sellers">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Sellers
          </AdminButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-lg"></div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{seller.name}</h2>
                  <p className="text-gray-600 mt-1">{seller.email}</p>
                  <div className="flex gap-4 mt-4">
                    <AdminBadge variant="success">{seller.accountStatus}</AdminBadge>
                    <AdminBadge variant={seller.verificationStatus === 'Verified' ? 'success' : 'warning'}>
                      {seller.verificationStatus}
                    </AdminBadge>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-gray-900 font-medium">{seller.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-gray-900 font-medium">{seller.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900 font-medium">{seller.address}</p>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Products</h3>
              <AdminTable columns={productColumns} data={sellerProducts} />
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Total Products</p>
                  <p className="text-2xl font-bold text-gray-900">{seller.productsCount}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Sales</p>
                  <p className="text-2xl font-bold text-gray-900">${seller.totalSales.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Joined Date</p>
                  <p className="text-gray-900 font-medium">{seller.joinedDate}</p>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <AdminButton variant="secondary" className="w-full" disabled>
                  Send Message
                </AdminButton>
                <AdminButton variant="secondary" className="w-full" disabled>
                  Approve Account
                </AdminButton>
                <AdminButton variant="danger" className="w-full" disabled>
                  Suspend Account
                </AdminButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
