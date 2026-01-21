'use client';

import Link from 'next/link';
import { AdminLayout } from '@/components/admin/layout/AdminLayout';
import { AdminCard } from '@/components/admin/ui/AdminCard';
import { AdminBadge } from '@/components/admin/ui/AdminBadge';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { mockProducts } from '@/lib/admin/mockData';
import { ChevronLeft, Tag, Truck, Weight, Ruler } from 'lucide-react';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = mockProducts.find((p) => p.id === params.id) || mockProducts[0];

  return (
    <AdminLayout title={`Product: ${product.name}`}>
      <div className="space-y-6">
        <Link href="/admin/products">
          <AdminButton variant="ghost" size="sm" className="flex items-center gap-2">
            <ChevronLeft size={16} />
            Back to Products
          </AdminButton>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <AdminCard>
              <div className="flex items-start gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg"></div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                  <p className="text-gray-600 mt-2">{product.description}</p>
                  <div className="flex gap-4 mt-4">
                    <AdminBadge variant={product.status === 'Active' ? 'success' : product.status === 'Out of Stock' ? 'warning' : 'error'}>
                      {product.status}
                    </AdminBadge>
                    <AdminBadge variant="info">{product.category}</AdminBadge>
                  </div>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600">SKU</p>
                  <p className="text-gray-900 font-medium mt-1">{product.sku}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="text-gray-900 font-medium mt-1 text-xl">${product.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="text-gray-900 font-medium mt-1">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Stock Level</p>
                  <p className={`font-medium mt-1 text-lg ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock} units
                  </p>
                </div>
              </div>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Weight size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-gray-900 font-medium">{product.weight}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Ruler size={18} className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Dimensions</p>
                    <p className="text-gray-900 font-medium">{product.dimensions}</p>
                  </div>
                </div>
              </div>
            </AdminCard>
          </div>

          <div className="space-y-6">
            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div>
                <p className="text-sm text-gray-600">Seller</p>
                <p className="text-gray-900 font-medium mt-1">{product.seller}</p>
              </div>
              <Link href={`/admin/sellers/${product.sellerId}`}>
                <AdminButton variant="secondary" className="w-full mt-4" size="sm">
                  View Seller Profile
                </AdminButton>
              </Link>
            </AdminCard>

            <AdminCard>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                <AdminButton variant="secondary" className="w-full" disabled>
                  Edit Product
                </AdminButton>
                <AdminButton variant="danger" className="w-full" disabled>
                  Disable Product
                </AdminButton>
              </div>
            </AdminCard>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
