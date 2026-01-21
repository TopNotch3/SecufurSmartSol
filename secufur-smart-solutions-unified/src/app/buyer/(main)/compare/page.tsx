'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buyer/common';
import { useWishlistStore, useCartStore, toast } from '@/store/buyer';
import styles from './compare.module.css';

export default function ComparePage() {
  const router = useRouter();
  const { compareItems, removeFromCompare, clearCompare, addToWishlist, isInWishlist } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: typeof compareItems[0]) => {
    addToCart({
      productId: item.productId,
      product: item.product,
      quantity: 1,
      unitPrice: item.product.price,
      totalPrice: item.product.price,
    });
    toast.success('Added to cart!');
  };

  const handleAddToWishlist = (item: typeof compareItems[0]) => {
    if (isInWishlist(item.productId)) {
      toast.info('Already in wishlist');
      return;
    }
    addToWishlist(item.product);
    toast.success('Added to wishlist!');
  };

  // Get all unique specification labels across all products
  const getAllSpecLabels = () => {
    const labels = new Set<string>();
    compareItems.forEach((item) => {
      item.product.specifications.forEach((spec) => {
        labels.add(spec.label);
      });
    });
    return Array.from(labels);
  };

  const getSpecValue = (item: typeof compareItems[0], label: string) => {
    const spec = item.product.specifications.find((s) => s.label === label);
    return spec ? `${spec.value}${spec.unit ? ' ' + spec.unit : ''}` : '-';
  };

  if (compareItems.length === 0) {
    return (
      <div className={styles.comparePage}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M16 3h5v5" />
              <path d="M21 3l-7 7" />
              <path d="M8 21H3v-5" />
              <path d="M3 21l7-7" />
            </svg>
            <h2>Nothing to Compare</h2>
            <p>Add products to compare their features, specifications, and prices side by side.</p>
            <Button onClick={() => router.push('/buyer')}>Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  const specLabels = getAllSpecLabels();

  return (
    <div className={styles.comparePage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <h1 className={styles.title}>Compare Products</h1>
            <p className={styles.subtitle}>
              Comparing {compareItems.length} {compareItems.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          {compareItems.length > 0 && (
            <Button variant="outline" onClick={clearCompare}>
              Clear All
            </Button>
          )}
        </div>

        {/* Compare Table */}
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.labelCell}>Product</th>
                {compareItems.map((item) => (
                  <th key={item.productId} className={styles.productCell}>
                    <div className={styles.productHeader}>
                      <button
                        className={styles.removeButton}
                        onClick={() => removeFromCompare(item.productId)}
                        aria-label="Remove from comparison"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                      <Link href={`/buyer/product/${item.product.slug}`} className={styles.productImage}>
                        <div className={styles.imagePlaceholder}>
                          {item.product.name.charAt(0)}
                        </div>
                      </Link>
                      <span className={styles.productBrand}>{item.product.brand}</span>
                      <Link href={`/buyer/product/${item.product.slug}`} className={styles.productName}>
                        {item.product.name}
                      </Link>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Price Row */}
              <tr>
                <td className={styles.labelCell}>Price</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.valueCell}>
                    <div className={styles.priceValue}>
                      <span className={styles.price}>{formatPrice(item.product.price)}</span>
                      {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className={styles.originalPrice}>
                          {formatPrice(item.product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Rating Row */}
              <tr>
                <td className={styles.labelCell}>Rating</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.valueCell}>
                    <div className={styles.ratingValue}>
                      <span className={styles.stars}>
                        {'★'.repeat(Math.round(item.product.rating.average))}
                      </span>
                      <span className={styles.ratingText}>
                        {item.product.rating.average.toFixed(1)} ({item.product.reviewCount})
                      </span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Availability Row */}
              <tr>
                <td className={styles.labelCell}>Availability</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.valueCell}>
                    <span
                      className={`${styles.stockStatus} ${
                        item.product.stockStatus === 'in_stock'
                          ? styles.inStock
                          : item.product.stockStatus === 'low_stock'
                          ? styles.lowStock
                          : styles.outOfStock
                      }`}
                    >
                      {item.product.stockStatus === 'in_stock'
                        ? 'In Stock'
                        : item.product.stockStatus === 'low_stock'
                        ? 'Low Stock'
                        : 'Out of Stock'}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Customizable Row */}
              <tr>
                <td className={styles.labelCell}>Customizable</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.valueCell}>
                    {item.product.isCustomizable ? (
                      <span className={styles.yesValue}>Yes</span>
                    ) : (
                      <span className={styles.noValue}>No</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Delivery Row */}
              <tr>
                <td className={styles.labelCell}>Delivery</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.valueCell}>
                    {item.product.deliveryEstimate.standardDays} days
                  </td>
                ))}
              </tr>

              {/* Specification Rows */}
              {specLabels.map((label) => (
                <tr key={label}>
                  <td className={styles.labelCell}>{label}</td>
                  {compareItems.map((item) => (
                    <td key={item.productId} className={styles.valueCell}>
                      {getSpecValue(item, label)}
                    </td>
                  ))}
                </tr>
              ))}

              {/* Actions Row */}
              <tr>
                <td className={styles.labelCell}>Actions</td>
                {compareItems.map((item) => (
                  <td key={item.productId} className={styles.actionCell}>
                    <Button
                      onClick={() => handleAddToCart(item)}
                      disabled={item.product.stockStatus === 'out_of_stock'}
                      fullWidth
                    >
                      Add to Cart
                    </Button>
                    <button
                      className={styles.wishlistButton}
                      onClick={() => handleAddToWishlist(item)}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill={isInWishlist(item.productId) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      {isInWishlist(item.productId) ? 'In Wishlist' : 'Add to Wishlist'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
