'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

const companyLinks = [
  { href: '/buyer/about', label: 'About Us' },
];

const catalogLinks = [
  { href: '/buyer/batteries', label: 'Batteries' },
  { href: '/buyer/electronics', label: 'Electronics' },
];

const legalLinks = [
  { href: '/buyer/terms', label: 'Terms of Service' },
  { href: '/buyer/privacy', label: 'Privacy Policy' },
  { href: '/buyer/cookie-policy', label: 'Cookie Policy' },
  { href: '/buyer/return-policy', label: 'Return Policy' },
  { href: '/buyer/warranty', label: 'Warranty Policy' },
  { href: '/buyer/battery-safety', label: 'Battery Safety' },
];

const socialLinks = [
  {
    href: 'https://facebook.com',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
      </svg>
    ),
  },
  {
    href: 'https://instagram.com',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="0" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="18" cy="6" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    href: 'https://twitter.com',
    label: 'Twitter',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
      </svg>
    ),
  },
  {
    href: 'https://linkedin.com',
    label: 'LinkedIn',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Top Section with Logo */}
      <div className={styles.topSection}>
        <Link href="/buyer" className={styles.logo}>
          SECUFUR SMART SOLUTIONS
        </Link>
      </div>

      {/* Main Content - 4 Column Grid */}
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* Column 1 - Company */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Company</h3>
            <ul className={styles.linkList}>
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Catalog */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Catalog</h3>
            <ul className={styles.linkList}>
              {catalogLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Legal</h3>
            <ul className={styles.linkList}>
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contact</h3>
            <ul className={styles.contactList}>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a href="mailto:support@secufur.com" className={styles.link}>
                  support@secufur.com
                </a>
              </li>
              <li className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+919876543210" className={styles.link}>
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section - Copyright */}
      <div className={styles.bottomSection}>
        <div className={styles.container}>
          <p className={styles.copyright}>
            &copy; {currentYear} SECUFUR SMART SOLUTIONS. All rights reserved.
          </p>
          <div className={styles.paymentMethods}>
            <span className={styles.paymentLabel}>We Accept:</span>
            <div className={styles.paymentIcons}>
              <span className={styles.paymentIcon}>Visa</span>
              <span className={styles.paymentIcon}>MasterCard</span>
              <span className={styles.paymentIcon}>UPI</span>
              <span className={styles.paymentIcon}>NetBanking</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
