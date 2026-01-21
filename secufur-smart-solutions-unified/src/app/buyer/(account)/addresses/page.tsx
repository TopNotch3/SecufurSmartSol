'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Select, Modal } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import styles from '../account.module.css';
import addressStyles from './addresses.module.css';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

const mockAddresses: Address[] = [
  {
    id: 'addr-1',
    type: 'home',
    name: 'John Doe',
    phone: '+91 9876543210',
    addressLine1: '123 MG Road, Sector 12',
    addressLine2: 'Near City Mall',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    landmark: 'Opposite Central Park',
    isDefault: true,
  },
  {
    id: 'addr-2',
    type: 'work',
    name: 'John Doe',
    phone: '+91 9876543210',
    addressLine1: '456 Business Park, Tower A',
    addressLine2: '5th Floor',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    isDefault: false,
  },
];

const emptyAddress: Omit<Address, 'id' | 'isDefault'> = {
  type: 'home',
  name: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  landmark: '',
};

export default function AddressesPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id' | 'isDefault'>>(emptyAddress);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    router.push('/buyer');
  };

  const handleAddNew = () => {
    setEditingAddress(null);
    setFormData(emptyAddress);
    setIsModalOpen(true);
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      landmark: address.landmark || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((addr) => addr.id !== id));
    toast.success('Address deleted successfully');
  };

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
    toast.success('Default address updated');
  };

  const handleSave = async () => {
    if (!formData.name || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (editingAddress) {
      setAddresses(
        addresses.map((addr) =>
          addr.id === editingAddress.id
            ? { ...addr, ...formData }
            : addr
        )
      );
      toast.success('Address updated successfully');
    } else {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        ...formData,
        isDefault: addresses.length === 0,
      };
      setAddresses([...addresses, newAddress]);
      toast.success('Address added successfully');
    }

    setIsSaving(false);
    setIsModalOpen(false);
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
              <Link href="/buyer/orders" className={styles.navItem}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                My Orders
              </Link>
              <Link href="/buyer/addresses" className={`${styles.navItem} ${styles.active}`}>
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
              <h1 className={styles.pageTitle}>My Addresses</h1>
              <p className={styles.pageSubtitle}>Manage your delivery addresses</p>
            </div>

            <div className={addressStyles.addressGrid}>
              {addresses.map((address) => (
                <div key={address.id} className={addressStyles.addressCard}>
                  {address.isDefault && (
                    <span className={addressStyles.defaultBadge}>Default</span>
                  )}
                  <span className={addressStyles.typeBadge}>{address.type}</span>

                  <h3 className={addressStyles.addressName}>{address.name}</h3>
                  <p className={addressStyles.addressPhone}>{address.phone}</p>
                  <p className={addressStyles.addressLine}>
                    {address.addressLine1}
                    {address.addressLine2 && `, ${address.addressLine2}`}
                  </p>
                  <p className={addressStyles.addressLine}>
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className={addressStyles.addressLandmark}>
                      Landmark: {address.landmark}
                    </p>
                  )}

                  <div className={addressStyles.addressActions}>
                    <button
                      className={addressStyles.actionButton}
                      onClick={() => handleEdit(address)}
                    >
                      Edit
                    </button>
                    {!address.isDefault && (
                      <>
                        <button
                          className={addressStyles.actionButton}
                          onClick={() => handleSetDefault(address.id)}
                        >
                          Set Default
                        </button>
                        <button
                          className={`${addressStyles.actionButton} ${addressStyles.deleteButton}`}
                          onClick={() => handleDelete(address.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <button className={addressStyles.addAddressCard} onClick={handleAddNew}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span>Add New Address</span>
              </button>
            </div>
          </main>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <div className={addressStyles.addressForm}>
          <Select
            label="Address Type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as 'home' | 'work' | 'other' })}
            options={[
              { value: 'home', label: 'Home' },
              { value: 'work', label: 'Work' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 9876543210"
            required
          />
          <div className={addressStyles.fullWidth}>
            <Input
              label="Address Line 1"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              placeholder="House/Flat No., Building Name, Street"
              required
            />
          </div>
          <div className={addressStyles.fullWidth}>
            <Input
              label="Address Line 2 (Optional)"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              placeholder="Area, Colony, Sector"
            />
          </div>
          <Input
            label="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Enter city"
            required
          />
          <Input
            label="State"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter state"
            required
          />
          <Input
            label="Pincode"
            value={formData.pincode}
            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            placeholder="Enter pincode"
            required
          />
          <Input
            label="Landmark (Optional)"
            value={formData.landmark}
            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
            placeholder="Near..."
          />
          <div className={addressStyles.modalActions}>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editingAddress ? 'Update Address' : 'Add Address'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
