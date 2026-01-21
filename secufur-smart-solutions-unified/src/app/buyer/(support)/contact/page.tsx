'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Select } from '@/components/buyer/common';
import { toast } from '@/store/buyer';
import styles from './contact.module.css';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

const initialForm: ContactForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  category: '',
  message: '',
};

const categories = [
  { value: '', label: 'Select a category' },
  { value: 'orders', label: 'Orders & Shipping' },
  { value: 'returns', label: 'Returns & Refunds' },
  { value: 'payments', label: 'Payments & Billing' },
  { value: 'products', label: 'Product Information' },
  { value: 'technical', label: 'Technical Support' },
  { value: 'account', label: 'Account Issues' },
  { value: 'feedback', label: 'Feedback & Suggestions' },
  { value: 'other', label: 'Other' },
];

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ContactForm>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.category || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    toast.success('Message sent successfully! We\'ll get back to you soon.');
    setFormData(initialForm);
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className={styles.content}>
          {/* Contact Form */}
          <div className={styles.formSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Send us a Message</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <Input
                    label="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your name"
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className={styles.formRow}>
                  <Input
                    label="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 9876543210"
                  />
                  <Select
                    label="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    options={categories}
                    required
                  />
                </div>
                <div className={styles.fullWidth}>
                  <Input
                    label="Subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of your inquiry"
                  />
                </div>
                <div className={styles.fullWidth}>
                  <label className={styles.textareaLabel}>
                    Message <span>*</span>
                  </label>
                  <textarea
                    className={styles.textarea}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please describe your inquiry in detail..."
                    rows={6}
                    required
                  />
                </div>
                <div className={styles.formActions}>
                  <Button type="submit" isLoading={isSubmitting} fullWidth>
                    Send Message
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.infoSection}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Contact Information</h2>
              <div className={styles.contactInfo}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <h4>Email</h4>
                    <p>support@luvarte.com</p>
                    <p>sales@luvarte.com</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h4>Phone</h4>
                    <p>+91 1800 123 4567 (Toll Free)</p>
                    <p>Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h4>Address</h4>
                    <p>LUVARTE Energy Solutions</p>
                    <p>123 Industrial Area, Sector 5</p>
                    <p>Mumbai, Maharashtra 400001</p>
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h4>Business Hours</h4>
                    <p>Monday - Saturday</p>
                    <p>9:00 AM - 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Quick Links</h2>
              <div className={styles.quickLinks}>
                <button onClick={() => router.push('/buyer/help')} className={styles.quickLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Help Center
                </button>
                <button onClick={() => router.push('/buyer/tickets')} className={styles.quickLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Submit a Ticket
                </button>
                <button onClick={() => router.push('/buyer/orders')} className={styles.quickLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  </svg>
                  Track Order
                </button>
                <button onClick={() => router.push('/buyer/return-policy')} className={styles.quickLink}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 4 23 10 17 10" />
                    <polyline points="1 20 1 14 7 14" />
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                  </svg>
                  Return Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
