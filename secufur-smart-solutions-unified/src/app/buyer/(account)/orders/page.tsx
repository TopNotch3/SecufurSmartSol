'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import styles from '../account.module.css';

interface Order {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
}

const mockOrders: Order[] = [
  {
    id: 'ORD-ABC123',
    date: '2024-01-15',
    status: 'delivered',
    items: [
      { name: 'Lithium Ion Battery 12V', quantity: 2, price: 5999 },
      { name: 'Smart Inverter 1000W', quantity: 1, price: 8999 },
    ],
    total: 20997,
  },
  {
    id: 'ORD-DEF456',
    date: '2024-01-10',
    status: 'shipped',
    items: [
      { name: 'Custom Battery Pack 48V', quantity: 1, price: 24999 },
    ],
    total: 24999,
  },
  {
    id: 'ORD-GHI789',
    date: '2024-01-05',
    status: 'processing',
    items: [
      { name: 'Solar Controller', quantity: 1, price: 3999 },
    ],
    total: 3999,
  },
];

export default function OrdersPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [orders] = useState<Order[]>(mockOrders);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/buyer');
  };

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                {user?.firstName?.charAt(0) || 'J'}
              </div>
              <h3 className={styles.userName}>{user?.firstName || 'John'} {user?.lastName || 'Doe'}</h3>
              <p className={styles.userEmail}>{user?.email || 'john.doe@example.com'}</p>
            </div>

            <nav className={styles.navMenu}>
              <Link href="/buyer/profile" className={styles.navItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                My Profile
              </Link>
              <Link href="/buyer/orders" className={`${styles.navItem} ${styles.active}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                My Orders
              </Link>
              <Link href="/buyer/addresses" className={styles.navItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                Addresses
              </Link>
              <Link href="/buyer/wishlist" className={styles.navItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                Wishlist
              </Link>
            </nav>

            <button className={styles.logoutButton} onClick={handleLogout}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </aside>

          {/* Main Content */}
          <main className={styles.mainContent}>
            <div className={styles.pageHeader}>
              <h1 className={styles.pageTitle}>My Orders</h1>
              <p className={styles.pageSubtitle}>Track and manage your orders</p>
            </div>

            {orders.length === 0 ? (
              <div className={styles.emptyState}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                <h3>No Orders Yet</h3>
                <p>You haven&apos;t placed any orders yet. Start shopping!</p>
                <Button onClick={() => router.push('/buyer')}>Start Shopping</Button>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div className={styles.orderInfo}>
                        <span className={styles.orderId}>{order.id}</span>
                        <span className={styles.orderDate}>
                          Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className={styles.orderItems}>
                      {order.items.slice(0, 2).map((item, index) => (
                        <div key={index} className={styles.orderItemImage}>
                          {item.name.charAt(0)}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className={styles.orderItemImage}>
                          +{order.items.length - 2}
                        </div>
                      )}
                      <div className={styles.orderItemDetails}>
                        <p className={styles.orderItemName}>
                          {order.items[0].name}
                          {order.items.length > 1 && ` and ${order.items.length - 1} more`}
                        </p>
                        <p className={styles.orderItemQuantity}>
                          {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)
                        </p>
                      </div>
                    </div>

                    <div className={styles.orderFooter}>
                      <span className={styles.orderTotal}>
                        Total: {formatPrice(order.total)}
                      </span>
                      <div className={styles.orderActions}>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/buyer/orders/${order.id}`)}
                        >
                          View Details
                        </Button>
                        {order.status === 'delivered' && (
                          <Button size="sm">
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
