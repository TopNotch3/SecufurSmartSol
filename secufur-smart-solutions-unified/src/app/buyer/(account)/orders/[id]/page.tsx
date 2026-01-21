'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Modal } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import styles from '../../account.module.css';
import orderStyles from './order-detail.module.css';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  customization?: {
    voltage?: string;
    capacity?: string;
    connector?: string;
  };
}

interface TrackingEvent {
  status: string;
  date: string;
  time: string;
  description: string;
  location?: string;
  completed: boolean;
}

interface OrderDetail {
  id: string;
  date: string;
  status: 'delivered' | 'shipped' | 'processing' | 'cancelled' | 'out_for_delivery';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  tracking: TrackingEvent[];
  estimatedDelivery?: string;
  deliveredOn?: string;
}

const mockOrder: OrderDetail = {
  id: 'ORD-ABC123',
  date: '2024-01-15',
  status: 'shipped',
  items: [
    {
      id: 'item-1',
      name: 'Lithium Ion Battery 12V 100Ah',
      quantity: 2,
      price: 5999,
      customization: {
        voltage: '12V',
        capacity: '100Ah',
        connector: 'Anderson',
      },
    },
    {
      id: 'item-2',
      name: 'Smart Inverter 1000W',
      quantity: 1,
      price: 8999,
    },
  ],
  subtotal: 20997,
  shipping: 0,
  discount: 500,
  total: 20497,
  paymentMethod: 'Credit Card ending in 4242',
  shippingAddress: {
    name: 'John Doe',
    phone: '+91 9876543210',
    address: '123 MG Road, Sector 12',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
  },
  tracking: [
    {
      status: 'Order Placed',
      date: '15 Jan 2024',
      time: '10:30 AM',
      description: 'Your order has been placed successfully',
      completed: true,
    },
    {
      status: 'Order Confirmed',
      date: '15 Jan 2024',
      time: '11:00 AM',
      description: 'Your order has been confirmed and is being processed',
      completed: true,
    },
    {
      status: 'Shipped',
      date: '16 Jan 2024',
      time: '02:30 PM',
      description: 'Your order has been shipped',
      location: 'Mumbai Warehouse',
      completed: true,
    },
    {
      status: 'In Transit',
      date: '17 Jan 2024',
      time: '09:00 AM',
      description: 'Your package is on the way',
      location: 'Delhi Hub',
      completed: false,
    },
    {
      status: 'Out for Delivery',
      date: '',
      time: '',
      description: 'Your package will be delivered today',
      completed: false,
    },
    {
      status: 'Delivered',
      date: '',
      time: '',
      description: 'Package delivered successfully',
      completed: false,
    },
  ],
  estimatedDelivery: '18 Jan 2024',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [order] = useState<OrderDetail>(mockOrder);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);

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

  const handleCancelOrder = async () => {
    if (!cancelReason) {
      toast.error('Please select a reason for cancellation');
      return;
    }

    setIsCancelling(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsCancelling(false);
    setShowCancelModal(false);
    toast.success('Order cancellation requested');
    router.push('/buyer/orders');
  };

  const handleDownloadInvoice = () => {
    toast.success('Invoice download started');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return orderStyles.statusDelivered;
      case 'shipped':
      case 'out_for_delivery':
        return orderStyles.statusShipped;
      case 'processing':
        return orderStyles.statusProcessing;
      case 'cancelled':
        return orderStyles.statusCancelled;
      default:
        return '';
    }
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
            <div className={orderStyles.header}>
              <button className={orderStyles.backButton} onClick={() => router.push('/buyer/orders')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Back to Orders
              </button>
            </div>

            <div className={orderStyles.orderHeader}>
              <div className={orderStyles.orderInfo}>
                <h1 className={orderStyles.orderId}>{order.id}</h1>
                <p className={orderStyles.orderDate}>
                  Placed on {new Date(order.date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span className={`${orderStyles.orderStatus} ${getStatusColor(order.status)}`}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            {/* Tracking Section */}
            {order.status !== 'cancelled' && (
              <div className={orderStyles.card}>
                <h2 className={orderStyles.cardTitle}>Order Tracking</h2>
                {order.estimatedDelivery && order.status !== 'delivered' && (
                  <div className={orderStyles.estimatedDelivery}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
                  </div>
                )}
                <div className={orderStyles.timeline}>
                  {order.tracking.map((event, index) => (
                    <div
                      key={index}
                      className={`${orderStyles.timelineItem} ${event.completed ? orderStyles.completed : ''}`}
                    >
                      <div className={orderStyles.timelineMarker}>
                        {event.completed && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </div>
                      <div className={orderStyles.timelineContent}>
                        <h4 className={orderStyles.timelineStatus}>{event.status}</h4>
                        <p className={orderStyles.timelineDescription}>{event.description}</p>
                        {event.location && (
                          <p className={orderStyles.timelineLocation}>{event.location}</p>
                        )}
                        {event.date && (
                          <p className={orderStyles.timelineDate}>
                            {event.date} at {event.time}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className={orderStyles.card}>
              <h2 className={orderStyles.cardTitle}>Order Items</h2>
              <div className={orderStyles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={orderStyles.item}>
                    <div className={orderStyles.itemImage}>
                      {item.name.charAt(0)}
                    </div>
                    <div className={orderStyles.itemDetails}>
                      <h3 className={orderStyles.itemName}>{item.name}</h3>
                      {item.customization && (
                        <div className={orderStyles.itemCustomization}>
                          {item.customization.voltage && (
                            <span>Voltage: {item.customization.voltage}</span>
                          )}
                          {item.customization.capacity && (
                            <span>Capacity: {item.customization.capacity}</span>
                          )}
                          {item.customization.connector && (
                            <span>Connector: {item.customization.connector}</span>
                          )}
                        </div>
                      )}
                      <p className={orderStyles.itemQuantity}>Qty: {item.quantity}</p>
                    </div>
                    <div className={orderStyles.itemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary and Shipping */}
            <div className={orderStyles.twoColumns}>
              {/* Shipping Address */}
              <div className={orderStyles.card}>
                <h2 className={orderStyles.cardTitle}>Shipping Address</h2>
                <div className={orderStyles.address}>
                  <p className={orderStyles.addressName}>{order.shippingAddress.name}</p>
                  <p className={orderStyles.addressPhone}>{order.shippingAddress.phone}</p>
                  <p className={orderStyles.addressLine}>{order.shippingAddress.address}</p>
                  <p className={orderStyles.addressLine}>
                    {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                </div>
              </div>

              {/* Payment Summary */}
              <div className={orderStyles.card}>
                <h2 className={orderStyles.cardTitle}>Payment Summary</h2>
                <div className={orderStyles.summary}>
                  <div className={orderStyles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className={orderStyles.summaryRow}>
                    <span>Shipping</span>
                    <span className={order.shipping === 0 ? orderStyles.free : ''}>
                      {order.shipping === 0 ? 'FREE' : formatPrice(order.shipping)}
                    </span>
                  </div>
                  {order.discount > 0 && (
                    <div className={orderStyles.summaryRow}>
                      <span>Discount</span>
                      <span className={orderStyles.discount}>-{formatPrice(order.discount)}</span>
                    </div>
                  )}
                  <div className={`${orderStyles.summaryRow} ${orderStyles.total}`}>
                    <span>Total</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <div className={orderStyles.paymentMethod}>
                    <span>Paid via</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={orderStyles.actions}>
              <Button variant="outline" onClick={handleDownloadInvoice}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Invoice
              </Button>
              {order.status !== 'delivered' && order.status !== 'cancelled' && (
                <Button variant="outline" onClick={() => setShowCancelModal(true)}>
                  Cancel Order
                </Button>
              )}
              {order.status === 'delivered' && (
                <>
                  <Button variant="outline">
                    Return / Replace
                  </Button>
                  <Button>
                    Reorder
                  </Button>
                </>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Cancel Order Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Order"
      >
        <div className={orderStyles.cancelModal}>
          <p className={orderStyles.cancelWarning}>
            Are you sure you want to cancel this order? This action cannot be undone.
          </p>
          <div className={orderStyles.cancelReasons}>
            <label className={orderStyles.cancelReason}>
              <input
                type="radio"
                name="cancelReason"
                value="changed_mind"
                checked={cancelReason === 'changed_mind'}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <span>I changed my mind</span>
            </label>
            <label className={orderStyles.cancelReason}>
              <input
                type="radio"
                name="cancelReason"
                value="found_cheaper"
                checked={cancelReason === 'found_cheaper'}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <span>Found a better price elsewhere</span>
            </label>
            <label className={orderStyles.cancelReason}>
              <input
                type="radio"
                name="cancelReason"
                value="delivery_time"
                checked={cancelReason === 'delivery_time'}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <span>Delivery time is too long</span>
            </label>
            <label className={orderStyles.cancelReason}>
              <input
                type="radio"
                name="cancelReason"
                value="other"
                checked={cancelReason === 'other'}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <span>Other reason</span>
            </label>
          </div>
          <div className={orderStyles.cancelActions}>
            <Button variant="outline" onClick={() => setShowCancelModal(false)}>
              Keep Order
            </Button>
            <Button onClick={handleCancelOrder} isLoading={isCancelling}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
