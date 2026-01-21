'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/buyer/common';
import { useCartStore, useAuthStore, useCheckoutStore, toast } from '@/store/buyer';
import styles from './checkout.module.css';

type Step = 'address' | 'delivery' | 'payment' | 'success';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'John Doe',
    phone: '+91 9876543210',
    line1: '123, Green Valley Apartments',
    line2: 'MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001',
    isDefault: true,
  },
  {
    id: '2',
    type: 'work',
    name: 'John Doe',
    phone: '+91 9876543210',
    line1: 'Tech Park, Building 5, Floor 3',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560037',
    isDefault: false,
  },
];

const deliveryOptions = [
  { id: 'standard', name: 'Standard Delivery', days: '5-7 business days', price: 0 },
  { id: 'express', name: 'Express Delivery', days: '2-3 business days', price: 149 },
  { id: 'same-day', name: 'Same Day Delivery', days: 'Today by 9 PM', price: 299 },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI', description: 'Pay using Google Pay, PhonePe, or any UPI app', icon: 'upi' },
  { id: 'card', name: 'Credit/Debit Card', description: 'Visa, Mastercard, RuPay', icon: 'card' },
  { id: 'netbanking', name: 'Net Banking', description: 'All major banks supported', icon: 'bank' },
  { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: 'cash' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    items,
    subtotal,
    customizationCost,
    taxAmount,
    shippingCost,
    discountAmount,
    total,
    clearCart,
  } = useCartStore();

  const [currentStep, setCurrentStep] = useState<Step>('address');
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(mockAddresses.find(a => a.isDefault) || null);
  const [selectedDelivery, setSelectedDelivery] = useState(deliveryOptions[0]);
  const [selectedPayment, setSelectedPayment] = useState<typeof paymentMethods[0] | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // New address form state
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({
    type: 'home',
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user) {
      router.push('/buyer/sign-in?redirect=/checkout');
      return;
    }

    if (items.length === 0 && currentStep !== 'success') {
      router.push('/buyer/cart');
    }
  }, [user, items, currentStep, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getTotalWithDelivery = () => {
    return total + selectedDelivery.price;
  };

  const handleAddAddress = () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.line1 || !newAddress.city || !newAddress.state || !newAddress.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    const address: Address = {
      id: Date.now().toString(),
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    setAddresses([...addresses, address]);
    setSelectedAddress(address);
    setShowAddressForm(false);
    setNewAddress({
      type: 'home',
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    });
    toast.success('Address added successfully');
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      toast.error('Please complete all steps');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate order ID
    const newOrderId = `ORD-${Date.now().toString(36).toUpperCase()}`;
    setOrderId(newOrderId);

    // Clear cart and show success
    clearCart();
    setCurrentStep('success');
    setIsProcessing(false);

    toast.success('Order placed successfully!');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'address':
        return selectedAddress !== null;
      case 'delivery':
        return selectedDelivery !== null;
      case 'payment':
        return selectedPayment !== null;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'address' && canProceed()) {
      setCurrentStep('delivery');
    } else if (currentStep === 'delivery' && canProceed()) {
      setCurrentStep('payment');
    } else if (currentStep === 'payment' && canProceed()) {
      handlePlaceOrder();
    }
  };

  const handleBack = () => {
    if (currentStep === 'delivery') {
      setCurrentStep('address');
    } else if (currentStep === 'payment') {
      setCurrentStep('delivery');
    }
  };

  // Success state
  if (currentStep === 'success') {
    return (
      <div className={styles.checkoutPage}>
        <div className={styles.container}>
          <div className={styles.successPage}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h1 className={styles.successTitle}>Order Confirmed!</h1>
            <p className={styles.successSubtitle}>
              Thank you for your purchase. We&apos;ll send you a confirmation email shortly.
            </p>
            <div className={styles.orderNumber}>
              <span className={styles.orderNumberLabel}>Order Number</span>
              <span className={styles.orderNumberValue}>{orderId}</span>
            </div>
            <div className={styles.successActions}>
              <Button onClick={() => router.push(`/buyer/orders/${orderId}`)}>
                Track Order
              </Button>
              <Button variant="outline" onClick={() => router.push('/buyer')}>
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Checkout</h1>
        </div>

        {/* Steps */}
        <div className={styles.steps}>
          <div className={`${styles.step} ${currentStep === 'address' ? styles.active : ''} ${['delivery', 'payment'].includes(currentStep) ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>1</span>
            <span className={styles.stepLabel}>Address</span>
          </div>
          <div className={`${styles.stepConnector} ${['delivery', 'payment'].includes(currentStep) ? styles.completed : ''}`} />
          <div className={`${styles.step} ${currentStep === 'delivery' ? styles.active : ''} ${currentStep === 'payment' ? styles.completed : ''}`}>
            <span className={styles.stepNumber}>2</span>
            <span className={styles.stepLabel}>Delivery</span>
          </div>
          <div className={`${styles.stepConnector} ${currentStep === 'payment' ? styles.completed : ''}`} />
          <div className={`${styles.step} ${currentStep === 'payment' ? styles.active : ''}`}>
            <span className={styles.stepNumber}>3</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
        </div>

        <div className={styles.content}>
          {/* Main Section */}
          <div className={styles.mainSection}>
            {/* Address Step */}
            {currentStep === 'address' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Select Delivery Address</h2>

                {!showAddressForm ? (
                  <>
                    <div className={styles.addressList}>
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className={`${styles.addressCard} ${selectedAddress?.id === address.id ? styles.selected : ''}`}
                          onClick={() => setSelectedAddress(address)}
                        >
                          {address.isDefault && (
                            <span className={styles.addressBadge}>Default</span>
                          )}
                          <span className={styles.addressType}>{address.type}</span>
                          <p className={styles.addressName}>{address.name}</p>
                          <p className={styles.addressLine}>
                            {address.line1}
                            {address.line2 && `, ${address.line2}`}
                            <br />
                            {address.city}, {address.state} - {address.pincode}
                          </p>
                          <p className={styles.addressPhone}>{address.phone}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      className={styles.addAddressButton}
                      onClick={() => setShowAddressForm(true)}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add New Address
                    </button>
                  </>
                ) : (
                  <div className={styles.addressForm}>
                    <Select
                      label="Address Type"
                      options={[
                        { value: 'home', label: 'Home' },
                        { value: 'work', label: 'Work' },
                        { value: 'other', label: 'Other' },
                      ]}
                      value={newAddress.type}
                      onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value as Address['type'] })}
                    />
                    <Input
                      label="Full Name"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Phone Number"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      required
                    />
                    <div className={styles.fullWidth}>
                      <Input
                        label="Address Line 1"
                        value={newAddress.line1}
                        onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                        required
                        fullWidth
                      />
                    </div>
                    <div className={styles.fullWidth}>
                      <Input
                        label="Address Line 2 (Optional)"
                        value={newAddress.line2}
                        onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                        fullWidth
                      />
                    </div>
                    <Input
                      label="City"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      required
                    />
                    <Input
                      label="State"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      required
                    />
                    <Input
                      label="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                      required
                      maxLength={6}
                    />
                    <div className={styles.fullWidth}>
                      <div className={styles.actions}>
                        <Button variant="outline" onClick={() => setShowAddressForm(false)} className={styles.backButton}>
                          Cancel
                        </Button>
                        <Button onClick={handleAddAddress} className={styles.nextButton}>
                          Save Address
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Delivery Step */}
            {currentStep === 'delivery' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Select Delivery Option</h2>
                <div className={styles.deliveryOptions}>
                  {deliveryOptions.map((option) => (
                    <div
                      key={option.id}
                      className={`${styles.deliveryOption} ${selectedDelivery.id === option.id ? styles.selected : ''}`}
                      onClick={() => setSelectedDelivery(option)}
                    >
                      <div className={styles.deliveryRadio} />
                      <div className={styles.deliveryInfo}>
                        <p className={styles.deliveryName}>{option.name}</p>
                        <p className={styles.deliveryTime}>{option.days}</p>
                      </div>
                      <span className={`${styles.deliveryPrice} ${option.price === 0 ? styles.free : ''}`}>
                        {option.price === 0 ? 'Free' : formatPrice(option.price)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <div className={styles.card}>
                <h2 className={styles.cardTitle}>Select Payment Method</h2>
                <div className={styles.paymentMethods}>
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className={`${styles.paymentMethod} ${selectedPayment?.id === method.id ? styles.selected : ''}`}
                      onClick={() => setSelectedPayment(method)}
                    >
                      <div className={styles.paymentRadio} />
                      <div className={styles.paymentIcon}>
                        {method.icon === 'upi' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="5" width="20" height="14" rx="2" />
                            <line x1="2" y1="10" x2="22" y2="10" />
                          </svg>
                        )}
                        {method.icon === 'card' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                            <line x1="1" y1="10" x2="23" y2="10" />
                          </svg>
                        )}
                        {method.icon === 'bank' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 21h18" />
                            <path d="M3 10h18" />
                            <path d="M5 6l7-3 7 3" />
                            <path d="M4 10v11" />
                            <path d="M20 10v11" />
                            <path d="M8 14v3" />
                            <path d="M12 14v3" />
                            <path d="M16 14v3" />
                          </svg>
                        )}
                        {method.icon === 'cash' && (
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="6" width="20" height="12" rx="2" />
                            <circle cx="12" cy="12" r="2" />
                            <path d="M6 6v12" />
                            <path d="M18 6v12" />
                          </svg>
                        )}
                      </div>
                      <div className={styles.paymentInfo}>
                        <p className={styles.paymentName}>{method.name}</p>
                        <p className={styles.paymentDescription}>{method.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {!showAddressForm && (
              <div className={styles.actions}>
                {currentStep !== 'address' && (
                  <Button variant="outline" onClick={handleBack} className={styles.backButton}>
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  isLoading={isProcessing}
                  className={styles.nextButton}
                >
                  {currentStep === 'payment' ? 'Place Order' : 'Continue'}
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.summarySidebar}>
            <div className={styles.summaryCard}>
              <h2 className={styles.summaryTitle}>Order Summary</h2>

              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <div className={styles.summaryItemImage}>
                      {item.product.name.charAt(0)}
                    </div>
                    <div className={styles.summaryItemDetails}>
                      <p className={styles.summaryItemName}>{item.product.name}</p>
                      <p className={styles.summaryItemQuantity}>Qty: {item.quantity}</p>
                    </div>
                    <span className={styles.summaryItemPrice}>{formatPrice(item.totalPrice)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>{formatPrice(subtotal + customizationCost)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Tax (GST)</span>
                <span className={styles.summaryValue}>{formatPrice(taxAmount)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Delivery</span>
                <span className={`${styles.summaryValue} ${selectedDelivery.price === 0 ? styles.summaryDiscount : ''}`}>
                  {selectedDelivery.price === 0 ? 'Free' : formatPrice(selectedDelivery.price)}
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
                <span className={styles.totalValue}>{formatPrice(getTotalWithDelivery())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
