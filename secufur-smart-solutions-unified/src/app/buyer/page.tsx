'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button, Skeleton, SkeletonProductCard } from '@/components/buyer/common';
import { useAuthStore } from '@/store/buyer';
import { Product, CategoryInfo } from '@/types/buyer/product';
import styles from './page.module.css';

// Mock data - Replace with API calls
const mockProducts: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `product-${i + 1}`,
  sku: `SKU-${1000 + i}`,
  name: `Battery Pack ${i + 1}`,
  slug: `battery-pack-${i + 1}`,
  description: 'High-quality lithium-ion battery pack for various applications',
  shortDescription: 'Premium Li-ion battery pack',
  category: 'batteries',
  brand: 'Secufur Smart Solutions',
  images: [{ id: '1', url: '/images/placeholder.jpg', alt: 'Product' }],
  price: 2999 + i * 500,
  originalPrice: 3499 + i * 500,
  discountPercentage: 15,
  currency: 'INR',
  taxInfo: { taxRate: 18, taxAmount: 500, inclusiveOfTax: true, taxLabel: 'GST' },
  stockStatus: 'in_stock',
  stockQuantity: 50,
  isCustomizable: i % 2 === 0,
  specifications: [],
  features: [],
  deliveryEstimate: { standardDays: 7, expressDays: 3, standardAvailable: true, expressAvailable: true },
  rating: { average: 4.5, distribution: { five: 80, four: 15, three: 3, two: 1, one: 1 } },
  reviewCount: 128,
  faqs: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const mockCategories: CategoryInfo[] = [
  { id: '1', name: 'Batteries', slug: 'batteries', description: 'All types of batteries', image: { id: '1', url: '/images/batteries.jpg', alt: 'Batteries' }, productCount: 156 },
  { id: '2', name: 'Electronics', slug: 'electronics', description: 'Electronic components', image: { id: '2', url: '/images/electronics.jpg', alt: 'Electronics' }, productCount: 89 },
];

export default function HomePage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setProducts(mockProducts);
      setIsLoading(false);
    };
    fetchData();
  }, [isAuthenticated]);

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>POWER YOUR WORLD</h1>
          <p className={styles.heroSubtitle}>
            Premium batteries and electronics for all your power needs.
            Custom solutions designed for you.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/buyer/batteries">
              <Button size="lg">Shop Batteries</Button>
            </Link>
            <Link href="/buyer/electronics">
              <Button size="lg">Shop Electronics</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Products Section */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Products</h2>
            <Link href="/buyer/search" className={styles.viewAll}>
              View All
            </Link>
          </div>
          {isLoading ? (
            <div className={styles.productsGrid}>
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonProductCard key={i} />
              ))}
            </div>
          ) : (
            <div className={styles.productsGrid}>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} showDiscount={Boolean(product.discountPercentage && product.discountPercentage > 0)} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Banner */}
      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
              <h3>Free Shipping</h3>
              <p>On orders over Rs. 5,000</p>
            </div>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <h3>Warranty</h3>
              <p>1 Year manufacturer warranty</p>
            </div>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 4 23 10 17 10" />
                <polyline points="1 20 1 14 7 14" />
                <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
              </svg>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className={styles.featureCard}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
              <h3>24/7 Support</h3>
              <p>Dedicated customer service</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  product: Product;
  showDiscount?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, showDiscount }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link href={`/buyer/product/${product.slug}`} className={styles.productCard}>
      <div className={styles.productImageWrapper}>
        <div className={styles.productImagePlaceholder}>
          <span>{product.name.charAt(0)}</span>
        </div>
        {showDiscount && product.discountPercentage && (
          <span className={styles.discountBadge}>-{product.discountPercentage}%</span>
        )}
        {product.isCustomizable && (
          <span className={styles.customizableBadge}>Customizable</span>
        )}
      </div>
      <div className={styles.productInfo}>
        <span className={styles.productBrand}>{product.brand}</span>
        <h3 className={styles.productName}>{product.name}</h3>
        <div className={styles.productRating}>
          <span className={styles.ratingStars}>{'★'.repeat(Math.round(product.rating.average))}</span>
          <span className={styles.ratingCount}>({product.reviewCount})</span>
        </div>
        <div className={styles.productPrice}>
          <span className={styles.currentPrice}>{formatPrice(product.price)}</span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};
