'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore, useUIStore, useAuthStore } from '@/store/buyer';
import { CountBadge } from '@/components/buyer/common';
import styles from './Navbar.module.css';

export interface NavbarProps {
  position?: 'sticky' | 'static';
}

const navLinks = [
  { href: '/batteries', label: 'Batteries' },
  { href: '/electronics', label: 'Electronics' },
  { href: '/customized-batteries', label: 'Customized Batteries' },
  { href: '/customized-electronics', label: 'Customized Electronics' },
];

export const Navbar: React.FC<NavbarProps> = ({ position = 'sticky' }) => {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // Store selectors
  const cartItemCount = useCartStore((state) => state.itemCount);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const toggleSearch = useUIStore((state) => state.toggleSearch);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navbarClasses = [
    styles.navbar,
    position === 'sticky' ? styles.sticky : styles.static,
  ].join(' ');

  return (
    <header className={navbarClasses}>
      <div className={styles.container}>
        {/* Left - Navigation Links */}
        <nav className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname === link.href ? styles.active : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Center - Brand Logo */}
        <Link href="/buyer" className={styles.logo}>
          LUVARTE
        </Link>

        {/* Right - Actions */}
        <div className={styles.actions}>
          {/* Search Button */}
          <button
            type="button"
            className={styles.actionButton}
            onClick={toggleSearch}
            aria-label="Search"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          {/* Account Button (Desktop) */}
          <Link
            href={isAuthenticated ? '/profile' : '/sign-in'}
            className={`${styles.actionButton} ${styles.hideOnMobile}`}
            aria-label={isAuthenticated ? 'Account' : 'Sign In'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </Link>

          {/* Shopping Bag Button */}
          <Link href="/buyer/cart" className={styles.actionButton} aria-label="Shopping bag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {mounted && cartItemCount > 0 && (
              <CountBadge count={cartItemCount} className={styles.cartBadge} />
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`${styles.actionButton} ${styles.menuButton}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMobileMenuOpen} pathname={pathname} isAuthenticated={isAuthenticated} />
    </header>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  pathname: string;
  isAuthenticated: boolean;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, pathname, isAuthenticated }) => {
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  if (!isOpen) return null;

  return (
    <div className={styles.mobileMenu}>
      <nav className={styles.mobileNav}>
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`${styles.mobileNavLink} ${pathname === link.href ? styles.active : ''}`}
            onClick={closeMobileMenu}
          >
            {link.label}
          </Link>
        ))}
        <div className={styles.mobileDivider} />
        <Link
          href={isAuthenticated ? '/profile' : '/sign-in'}
          className={styles.mobileNavLink}
          onClick={closeMobileMenu}
        >
          {isAuthenticated ? 'My Account' : 'Sign In'}
        </Link>
        {isAuthenticated && (
          <>
            <Link href="/buyer/orders" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              My Orders
            </Link>
            <Link href="/buyer/wishlist" className={styles.mobileNavLink} onClick={closeMobileMenu}>
              Wishlist
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
