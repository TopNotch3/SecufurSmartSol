'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/buyer/common';
import { useAuthStore, toast } from '@/store/buyer';
import styles from '../account.module.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: user?.firstName || 'John',
    lastName: user?.lastName || 'Doe',
    email: user?.email || 'john.doe@example.com',
    mobile: user?.mobile || '+91 9876543210',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
    toast.success('Profile updated successfully');
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
                {formData.firstName.charAt(0)}
              </div>
              <h3 className={styles.userName}>{formData.firstName} {formData.lastName}</h3>
              <p className={styles.userEmail}>{formData.email}</p>
            </div>

            <nav className={styles.navMenu}>
              <Link href="/buyer/profile" className={`${styles.navItem} ${styles.active}`}>
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
              <h1 className={styles.pageTitle}>My Profile</h1>
              <p className={styles.pageSubtitle}>Manage your personal information</p>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Personal Information</h2>
              <div className={styles.form}>
                <Input
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!isEditing}
                />
                <Input
                  label="Phone Number"
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  disabled={!isEditing}
                />
                <div className={styles.formActions}>
                  {isEditing ? (
                    <>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSave} isLoading={isSaving}>
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Security</h2>
              <div className={styles.form}>
                <div className={styles.fullWidth}>
                  <Button variant="outline" onClick={() => router.push('/buyer/forgot-password')}>
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
