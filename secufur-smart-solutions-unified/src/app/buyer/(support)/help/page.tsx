'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@/components/buyer/common';
import styles from './help.module.css';

interface HelpCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  articles: HelpArticle[];
}

interface HelpArticle {
  id: string;
  title: string;
  excerpt: string;
}

const helpCategories: HelpCategory[] = [
  {
    id: 'orders',
    title: 'Orders & Shipping',
    description: 'Track orders, delivery information, and shipping policies',
    icon: 'package',
    articles: [
      { id: '1', title: 'How to track my order?', excerpt: 'Learn how to track your order status and delivery updates.' },
      { id: '2', title: 'Shipping options and delivery times', excerpt: 'Understand our shipping methods and estimated delivery times.' },
      { id: '3', title: 'Order cancellation process', excerpt: 'Steps to cancel an order before it ships.' },
      { id: '4', title: 'What if my order is delayed?', excerpt: 'Actions to take when your delivery is taking longer than expected.' },
    ],
  },
  {
    id: 'returns',
    title: 'Returns & Refunds',
    description: 'Return policies, refund process, and exchange information',
    icon: 'refresh',
    articles: [
      { id: '5', title: 'Return policy overview', excerpt: 'Our 30-day return policy and eligibility criteria.' },
      { id: '6', title: 'How to initiate a return?', excerpt: 'Step-by-step guide to returning a product.' },
      { id: '7', title: 'Refund processing time', excerpt: 'When to expect your refund after return approval.' },
      { id: '8', title: 'Exchange vs Return', excerpt: 'Understanding the difference and when to use each.' },
    ],
  },
  {
    id: 'payments',
    title: 'Payments & Pricing',
    description: 'Payment methods, pricing questions, and billing issues',
    icon: 'credit-card',
    articles: [
      { id: '9', title: 'Accepted payment methods', excerpt: 'All payment options available on our platform.' },
      { id: '10', title: 'EMI options explained', excerpt: 'Understanding no-cost and low-cost EMI plans.' },
      { id: '11', title: 'Payment failed - what to do?', excerpt: 'Troubleshooting payment issues.' },
      { id: '12', title: 'Price match guarantee', excerpt: 'How our price match policy works.' },
    ],
  },
  {
    id: 'products',
    title: 'Product Information',
    description: 'Product specifications, customization, and technical details',
    icon: 'battery',
    articles: [
      { id: '13', title: 'Battery specifications guide', excerpt: 'Understanding voltage, capacity, and ratings.' },
      { id: '14', title: 'Customization options', excerpt: 'How to customize your battery or electronics.' },
      { id: '15', title: 'Warranty coverage', excerpt: 'What&apos;s covered under our product warranty.' },
      { id: '16', title: 'Product compatibility', excerpt: 'Checking if products work with your devices.' },
    ],
  },
  {
    id: 'account',
    title: 'Account & Security',
    description: 'Account settings, security, and privacy concerns',
    icon: 'user',
    articles: [
      { id: '17', title: 'How to reset password?', excerpt: 'Steps to recover your account access.' },
      { id: '18', title: 'Update account information', excerpt: 'Changing email, phone, or personal details.' },
      { id: '19', title: 'Delete my account', excerpt: 'Process for account deletion and data removal.' },
      { id: '20', title: 'Two-factor authentication', excerpt: 'Setting up extra security for your account.' },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Support',
    description: 'Installation, setup, and troubleshooting guides',
    icon: 'tool',
    articles: [
      { id: '21', title: 'Battery installation guide', excerpt: 'Safe installation procedures for batteries.' },
      { id: '22', title: 'Inverter setup instructions', excerpt: 'Getting started with your new inverter.' },
      { id: '23', title: 'Troubleshooting common issues', excerpt: 'Quick fixes for common problems.' },
      { id: '24', title: 'Safety guidelines', excerpt: 'Important safety information for all products.' },
    ],
  },
];

const popularArticles = [
  { id: '1', title: 'How to track my order?', category: 'Orders & Shipping' },
  { id: '5', title: 'Return policy overview', category: 'Returns & Refunds' },
  { id: '13', title: 'Battery specifications guide', category: 'Product Information' },
  { id: '15', title: 'Warranty coverage', category: 'Product Information' },
  { id: '21', title: 'Battery installation guide', category: 'Technical Support' },
];

export default function HelpPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'package':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case 'refresh':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
          </svg>
        );
      case 'battery':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
            <line x1="23" y1="13" x2="23" y2="11" />
          </svg>
        );
      case 'user':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        );
      case 'tool':
        return (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would search through articles
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className={styles.helpPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>How can we help you?</h1>
          <p className={styles.subtitle}>
            Search our knowledge base or browse categories below
          </p>
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <div className={styles.searchWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search for help articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Popular Articles */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Popular Articles</h2>
          <div className={styles.popularArticles}>
            {popularArticles.map((article) => (
              <Link href={`/buyer/help/article/${article.id}`} key={article.id} className={styles.popularArticle}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                <div>
                  <h4>{article.title}</h4>
                  <span>{article.category}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Browse by Category</h2>
          <div className={styles.categories}>
            {helpCategories.map((category) => (
              <button
                key={category.id}
                className={styles.categoryCard}
                onClick={() => setSelectedCategory(category)}
              >
                <div className={styles.categoryIcon}>
                  {getIcon(category.icon)}
                </div>
                <h3 className={styles.categoryTitle}>{category.title}</h3>
                <p className={styles.categoryDescription}>{category.description}</p>
                <span className={styles.articleCount}>
                  {category.articles.length} articles
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Selected Category Articles */}
        {selectedCategory && (
          <section className={styles.section}>
            <div className={styles.categoryHeader}>
              <h2 className={styles.sectionTitle}>{selectedCategory.title}</h2>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedCategory(null)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.articlesList}>
              {selectedCategory.articles.map((article) => (
                <Link
                  href={`/buyer/help/article/${article.id}`}
                  key={article.id}
                  className={styles.articleItem}
                >
                  <div>
                    <h4 className={styles.articleTitle}>{article.title}</h4>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                  </div>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Contact Section */}
        <section className={styles.contactSection}>
          <div className={styles.contactCard}>
            <div className={styles.contactIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h3>Still need help?</h3>
            <p>Our support team is here to assist you</p>
            <div className={styles.contactActions}>
              <Button onClick={() => router.push('/buyer/contact')}>Contact Us</Button>
              <Button variant="outline" onClick={() => router.push('/buyer/tickets')}>
                Submit a Ticket
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
