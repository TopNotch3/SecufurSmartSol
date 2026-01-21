'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/buyer/common';
import { useCartStore, useAuthStore, toast } from '@/store/buyer';
import styles from './cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    savedForLater,
    itemCount,
    subtotal,
    customizationCost,
    taxAmount,
    shippingCost,
    discountAmount,
    total,
    appliedCoupon,
    deliveryPincode,
    deliveryAvailable,
    updateItemQuantity,
    removeItem,
    saveForLater,
    moveToCart,
    removeSavedItem,
    applyCoupon,
    removeCoupon,
    setDeliveryPincode,
    setDeliveryAvailable,
  } = useCartStore();

  const [couponCode, setCouponCode] = useState('');
  const [pincode, setPincode] = useState(deliveryPincode || '');
  const [isCheckingPincode, setIsCheckingPincode] = useState(false);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    setIsApplyingCoupon(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock coupon validation
    if (couponCode.toUpperCase() === 'SAVE10') {
      const discountAmt = Math.min((subtotal + customizationCost) * 0.1, 500);
      applyCoupon({
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        discountAmount: discountAmt,
        maxDiscount: 500,
        minOrderValue: 0,
        description: '10% off up to Rs.500',
      });
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } else if (couponCode.toUpperCase() === 'FLAT500') {
      applyCoupon({
        code: 'FLAT500',
        discountType: 'fixed',
        discountValue: 500,
        discountAmount: 500,
        minOrderValue: 2000,
        description: 'Flat Rs.500 off on orders above Rs.2000',
      });
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } else {
      toast.error('Invalid coupon code');
    }

    setIsApplyingCoupon(false);
  };

  const handleCheckPincode = async () => {
    if (!pincode.trim() || pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setIsCheckingPincode(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock pincode check - assume most pincodes are serviceable
    const isAvailable = !pincode.startsWith('9'); // Mock: codes starting with 9 are not serviceable
    setDeliveryPincode(pincode);
    setDeliveryAvailable(isAvailable);

    if (isAvailable) {
      toast.success('Delivery available to your location!');
    } else {
      toast.error('Sorry, delivery is not available to this location');
    }

    setIsCheckingPincode(false);
  };

  const handleCheckout = () => {
    if (!user) {
      toast.info('Please sign in to continue with checkout');
      router.push('/buyer/sign-in?redirect=/checkout');
      return;
    }

    if (items.some((item) => item.product.stockStatus === 'out_of_stock')) {
      toast.error('Please remove out of stock items before checkout');
      return;
    }

    router.push('/buyer/checkout');
  };

  if (items.length === 0 && savedForLater.length === 0) {
    return (
      <div className={styles.cartPage}>
        <div className={styles.container}>
          <div className={styles.emptyCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven&apos;t added any items to your cart yet.</p>
            <Button onClick={() => router.push('/buyer')}>Start Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Shopping Cart</h1>
          <p className={styles.subtitle}>{itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        {items.length > 0 ? (
          <div className={styles.content}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              {items.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {item.product.name.charAt(0)}
                  </div>

                  <div className={styles.itemDetails}>
                    <span className={styles.itemBrand}>{item.product.brand}</span>
                    <Link href={`/buyer/product/${item.product.slug}`} className={styles.itemName}>
                      {item.product.name}
                    </Link>

                    {item.customization && (
                      <div className={styles.itemCustomization}>
                        {item.customization.voltage && (
                          <span className={styles.customizationTag}>
                            {item.customization.voltage.label}
                          </span>
                        )}
                        {item.customization.capacity && (
                          <span className={styles.customizationTag}>
                            {item.customization.capacity.label}
                          </span>
                        )}
                        {item.customization.connector && (
                          <span className={styles.customizationTag}>
                            {item.customization.connector.label}
                          </span>
                        )}
                      </div>
                    )}

                    <div className={styles.itemMeta}>
                      <span className={`${styles.stockBadge} ${item.product.stockStatus === 'in_stock' ? styles.inStock : styles.outOfStock}`}>
                        {item.product.stockStatus === 'in_stock' ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span className={styles.deliveryInfo}>
                        Delivery in {item.product.deliveryEstimate.standardDays} days
                      </span>
                    </div>
                  </div>

                  <div className={styles.itemActions}>
                    <div className={styles.itemPrice}>
                      <div className={styles.unitPrice}>
                        {formatPrice(item.unitPrice)} x {item.quantity}
                      </div>
                      <div className={styles.totalPrice}>
                        {formatPrice(item.totalPrice)}
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <span className={styles.originalPrice}>
                            {formatPrice(item.product.originalPrice * item.quantity)}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={styles.quantityControls}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= 10}
                      >
                        +
                      </button>
                    </div>

                    <div className={styles.actionButtons}>
                      <button
                        className={styles.actionButton}
                        onClick={() => saveForLater(item.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                        </svg>
                        Save for Later
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.removeButton}`}
                        onClick={() => removeItem(item.id)}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Section */}
            <div className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <h2 className={styles.summaryTitle}>Order Summary</h2>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Subtotal ({itemCount} items)</span>
                  <span className={styles.summaryValue}>{formatPrice(subtotal)}</span>
                </div>

                {customizationCost > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Customization</span>
                    <span className={styles.summaryValue}>{formatPrice(customizationCost)}</span>
                  </div>
                )}

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>GST (18%)</span>
                  <span className={styles.summaryValue}>{formatPrice(taxAmount)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Shipping</span>
                  <span className={styles.summaryValue}>
                    {shippingCost > 0 ? formatPrice(shippingCost) : 'Free'}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Discount</span>
                    <span className={`${styles.summaryValue} ${styles.summaryDiscount}`}>
                      -{formatPrice(discountAmount)}
                    </span>
                  </div>
                )}

                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>{formatPrice(total)}</span>
                </div>
                <p className={styles.taxNote}>Inclusive of all taxes</p>

                {/* Coupon Section */}
                <div className={styles.couponSection}>
                  <h4 className={styles.couponTitle}>Apply Coupon</h4>
                  {appliedCoupon ? (
                    <div className={styles.appliedCoupon}>
                      <div>
                        <span className={styles.couponCode}>{appliedCoupon.code}</span>
                        <span className={styles.couponDiscount}>
                          {appliedCoupon.discountType === 'percentage'
                            ? ` - ${appliedCoupon.discountValue}% off`
                            : ` - ${formatPrice(appliedCoupon.discountValue)} off`}
                        </span>
                      </div>
                      <button className={styles.removeCoupon} onClick={removeCoupon}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.couponForm}>
                      <Input
                        className={styles.couponInput}
                        placeholder="Enter coupon code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        size="sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleApplyCoupon}
                        isLoading={isApplyingCoupon}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pincode Section */}
                <div className={styles.pincodeSection}>
                  <h4 className={styles.pincodeTitle}>Check Delivery</h4>
                  <div className={styles.pincodeForm}>
                    <Input
                      className={styles.pincodeInput}
                      placeholder="Enter pincode"
                      value={pincode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPincode(value);
                      }}
                      size="sm"
                      maxLength={6}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCheckPincode}
                      isLoading={isCheckingPincode}
                    >
                      Check
                    </Button>
                  </div>

                  {deliveryPincode && deliveryAvailable !== null && (
                    <div className={`${styles.deliveryResult} ${deliveryAvailable ? styles.available : styles.unavailable}`}>
                      <div className={`${styles.deliveryStatus} ${deliveryAvailable ? styles.available : styles.unavailable}`}>
                        {deliveryAvailable ? (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Delivery Available
                          </>
                        ) : (
                          <>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="6" x2="6" y2="18" />
                              <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Delivery Not Available
                          </>
                        )}
                      </div>
                      {deliveryAvailable && (
                        <div className={styles.deliveryOptions}>
                          <div className={styles.deliveryOption}>
                            <span>Standard Delivery</span>
                            <span>5-7 days</span>
                          </div>
                          <div className={styles.deliveryOption}>
                            <span>Express Delivery</span>
                            <span>2-3 days</span>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Checkout Button */}
                <div className={styles.checkoutSection}>
                  <Button
                    className={styles.checkoutButton}
                    onClick={handleCheckout}
                    disabled={items.every((item) => item.product.stockStatus === 'out_of_stock')}
                    fullWidth
                  >
                    Proceed to Checkout
                  </Button>
                  <p className={styles.securityNote}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Secure Checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven&apos;t added any items to your cart yet.</p>
            <Button onClick={() => router.push('/buyer')}>Start Shopping</Button>
          </div>
        )}

        {/* Saved For Later Section */}
        {savedForLater.length > 0 && (
          <div className={styles.savedSection}>
            <h2 className={styles.savedTitle}>Saved For Later ({savedForLater.length})</h2>
            <div className={styles.savedItems}>
              {savedForLater.map((item) => (
                <div key={item.id} className={styles.savedItem}>
                  <div className={styles.savedItemImage}>
                    {item.product.name.charAt(0)}
                  </div>
                  <h3 className={styles.savedItemName}>{item.product.name}</h3>
                  <div className={styles.savedItemPrice}>{formatPrice(item.product.price)}</div>
                  <div className={styles.savedItemActions}>
                    <Button size="sm" onClick={() => moveToCart(item.id)}>
                      Move to Cart
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => removeSavedItem(item.id)}>
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
