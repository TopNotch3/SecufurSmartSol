'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/buyer/common';
import { useWishlistStore, useCartStore, toast } from '@/store/buyer';
import styles from './wishlist.module.css';

export default function WishlistPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist, addToCompare, isInCompare, canAddToCompare } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: typeof wishlistItems[0]) => {
    addToCart({
      productId: item.productId,
      product: item.product,
      quantity: 1,
      unitPrice: item.product.price,
      totalPrice: item.product.price,
    });
    toast.success('Added to cart!');
  };

  const handleAddToCompare = (item: typeof wishlistItems[0]) => {
    if (!canAddToCompare()) {
      toast.error('Maximum 4 items can be compared');
      return;
    }

    if (addToCompare(item.product)) {
      toast.success('Added to compare!');
    }
  };

  const handleRemove = (productId: string) => {
    removeFromWishlist(productId);
    toast.success('Removed from wishlist');
  };

  if (wishlistItems.length === 0) {
    return (
      <div className={styles.wishlistPage}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            <h2>Your Wishlist is Empty</h2>
            <p>Save items you love to your wishlist and shop them later.</p>
            <Button onClick={() => router.push('/buyer')}>Start Shopping</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>My Wishlist</h1>
          <p className={styles.subtitle}>{wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved</p>
        </div>

        {/* Wishlist Grid */}
        <div className={styles.grid}>
          {wishlistItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <Link href={`/buyer/product/${item.product.slug}`} className={styles.imageWrapper}>
                <div className={styles.imagePlaceholder}>
                  {item.product.name.charAt(0)}
                </div>
                {item.product.discountPercentage && (
                  <span className={styles.discountBadge}>-{item.product.discountPercentage}%</span>
                )}
                {item.product.stockStatus === 'out_of_stock' && (
                  <span className={styles.stockBadge}>Out of Stock</span>
                )}
                {item.priceDropped && (
                  <span className={styles.priceDropBadge}>Price Dropped!</span>
                )}
              </Link>

              <div className={styles.cardContent}>
                <span className={styles.brand}>{item.product.brand}</span>
                <Link href={`/buyer/product/${item.product.slug}`} className={styles.name}>
                  {item.product.name}
                </Link>

                <div className={styles.rating}>
                  <span className={styles.stars}>
                    {'★'.repeat(Math.round(item.product.rating.average))}
                  </span>
                  <span className={styles.ratingCount}>({item.product.reviewCount})</span>
                </div>

                <div className={styles.priceRow}>
                  <span className={styles.price}>{formatPrice(item.currentPrice)}</span>
                  {item.product.originalPrice && item.product.originalPrice > item.currentPrice && (
                    <span className={styles.originalPrice}>{formatPrice(item.product.originalPrice)}</span>
                  )}
                </div>

                {item.priceAtAdd !== item.currentPrice && (
                  <div className={styles.priceChange}>
                    {item.currentPrice < item.priceAtAdd ? (
                      <span className={styles.priceDropText}>
                        Price dropped by {formatPrice(item.priceAtAdd - item.currentPrice)}!
                      </span>
                    ) : (
                      <span className={styles.priceIncreaseText}>
                        Price increased by {formatPrice(item.currentPrice - item.priceAtAdd)}
                      </span>
                    )}
                  </div>
                )}

                <div className={styles.addedDate}>
                  Added on {new Date(item.addedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className={styles.cardActions}>
                <Button
                  onClick={() => handleAddToCart(item)}
                  disabled={item.product.stockStatus === 'out_of_stock'}
                  fullWidth
                >
                  {item.product.stockStatus === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <div className={styles.secondaryActions}>
                  <button
                    className={styles.secondaryButton}
                    onClick={() => handleAddToCompare(item)}
                    disabled={isInCompare(item.productId)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16 3h5v5" />
                      <path d="M21 3l-7 7" />
                      <path d="M8 21H3v-5" />
                      <path d="M3 21l7-7" />
                    </svg>
                    {isInCompare(item.productId) ? 'In Compare' : 'Compare'}
                  </button>
                  <button
                    className={`${styles.secondaryButton} ${styles.removeButton}`}
                    onClick={() => handleRemove(item.productId)}
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
      </div>
    </div>
  );
}
