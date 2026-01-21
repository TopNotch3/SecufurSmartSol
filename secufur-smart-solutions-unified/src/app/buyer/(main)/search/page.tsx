'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Loader, Skeleton } from '@/components/buyer/common';
import { useCartStore, useWishlistStore, toast } from '@/store/buyer';
import styles from './search.module.css';

// Simplified product type for search results
interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  badges?: string[];
  isCustomizable?: boolean;
  images: { url?: string }[];
}

// Mock products for search results
const allProducts: SearchProduct[] = [
  {
    id: 'bat-001',
    slug: 'lithium-ion-12v-100ah',
    name: 'Lithium Ion Battery 12V 100Ah',
    shortDescription: 'High-performance lithium ion battery',
    description: 'Premium quality lithium ion battery with BMS protection',
    category: 'batteries',
    price: 12999,
    originalPrice: 15999,
    images: [],
    rating: 4.5,
    reviewCount: 128,
    badges: ['bestseller'],
    isCustomizable: false,
  },
  {
    id: 'bat-002',
    slug: 'lithium-ion-24v-50ah',
    name: 'Lithium Ion Battery 24V 50Ah',
    shortDescription: '24V lithium battery for medium applications',
    description: 'Reliable 24V battery with advanced safety features',
    category: 'batteries',
    price: 15999,
    originalPrice: 18999,
    images: [],
    rating: 4.3,
    reviewCount: 89,
    badges: [],
    isCustomizable: false,
  },
  {
    id: 'bat-003',
    slug: 'lithium-ion-48v-100ah',
    name: 'Lithium Ion Battery 48V 100Ah',
    shortDescription: 'High capacity 48V battery system',
    description: 'Industrial grade 48V lithium battery pack',
    category: 'batteries',
    price: 34999,
    originalPrice: 39999,
    images: [],
    rating: 4.8,
    reviewCount: 56,
    badges: ['new'],
    isCustomizable: true,
  },
  {
    id: 'inv-001',
    slug: 'smart-inverter-1000w',
    name: 'Smart Inverter 1000W',
    shortDescription: 'Pure sine wave inverter for home use',
    description: 'High efficiency pure sine wave inverter',
    category: 'electronics',
    price: 8999,
    originalPrice: 10999,
    images: [],
    rating: 4.6,
    reviewCount: 203,
    badges: ['bestseller'],
    isCustomizable: false,
  },
  {
    id: 'inv-002',
    slug: 'smart-inverter-2000w',
    name: 'Smart Inverter 2000W',
    shortDescription: 'High power inverter for larger loads',
    description: 'Heavy duty pure sine wave inverter',
    category: 'electronics',
    price: 14999,
    originalPrice: 17999,
    images: [],
    rating: 4.4,
    reviewCount: 145,
    badges: [],
    isCustomizable: false,
  },
  {
    id: 'sol-001',
    slug: 'solar-controller-30a',
    name: 'Solar Charge Controller 30A',
    shortDescription: 'MPPT solar charge controller',
    description: 'Advanced MPPT technology for maximum efficiency',
    category: 'electronics',
    price: 3999,
    originalPrice: 4999,
    images: [],
    rating: 4.2,
    reviewCount: 78,
    badges: [],
    isCustomizable: false,
  },
  {
    id: 'cus-001',
    slug: 'custom-battery-pack-ev',
    name: 'Custom EV Battery Pack',
    shortDescription: 'Customizable battery for electric vehicles',
    description: 'Build your own EV battery pack with our configurator',
    category: 'customized-batteries',
    price: 24999,
    originalPrice: 29999,
    images: [],
    rating: 4.9,
    reviewCount: 34,
    badges: ['customizable'],
    isCustomizable: true,
  },
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || 'all';
  const sortBy = searchParams.get('sort') || 'relevance';

  const { addItem } = useCartStore();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlistStore();

  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    // Perform search
    setIsLoading(true);
    const timer = setTimeout(() => {
      let filtered = allProducts;

      // Filter by search query
      if (query) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.category.toLowerCase().includes(lowerQuery) ||
            p.shortDescription.toLowerCase().includes(lowerQuery)
        );
      }

      // Filter by category
      if (categoryFilter !== 'all') {
        filtered = filtered.filter((p) => p.category === categoryFilter);
      }

      // Sort results
      switch (sortBy) {
        case 'price-low':
          filtered = [...filtered].sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered = [...filtered].sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered = [...filtered].sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          // For mock data, just keep original order
          break;
        default:
          // relevance - keep original order
          break;
      }

      setResults(filtered);
      setIsLoading(false);

      // Save to recent searches
      if (query && !recentSearches.includes(query)) {
        const updated = [query, ...recentSearches.slice(0, 4)];
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, categoryFilter, sortBy]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/buyer/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/buyer/search?${params.toString()}`);
  };

  const handleAddToCart = (product: SearchProduct) => {
    // Create a minimal product object for cart
    const cartProduct = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      price: product.price,
      originalPrice: product.originalPrice,
      images: product.images,
      category: product.category,
    } as never;

    addItem({
      productId: product.id,
      product: cartProduct,
      quantity: 1,
      unitPrice: product.price,
      totalPrice: product.price,
    });
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = (product: SearchProduct) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      // Create a compatible product object for wishlist
      const wishlistProduct = {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        images: product.images as never[],
        category: product.category as 'batteries' | 'electronics' | 'customized-batteries' | 'customized-electronics',
      };
      addToWishlist(wishlistProduct as never);
      toast.success('Added to wishlist!');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.container}>
        {/* Search Header */}
        <div className={styles.searchHeader}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInputWrapper}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for batteries, inverters, electronics..."
                className={styles.searchInput}
              />
              {searchQuery && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => setSearchQuery('')}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {/* Recent Searches */}
        {!query && recentSearches.length > 0 && (
          <div className={styles.recentSearches}>
            <div className={styles.recentHeader}>
              <h3>Recent Searches</h3>
              <button onClick={clearRecentSearches}>Clear All</button>
            </div>
            <div className={styles.recentList}>
              {recentSearches.map((search, index) => (
                <Link
                  key={index}
                  href={`/buyer/search?q=${encodeURIComponent(search)}`}
                  className={styles.recentItem}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  {search}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <>
            <div className={styles.resultsHeader}>
              <h1 className={styles.resultsTitle}>
                {isLoading ? (
                  'Searching...'
                ) : (
                  <>
                    {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
                  </>
                )}
              </h1>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label>Category:</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="all">All Categories</option>
                  <option value="batteries">Batteries</option>
                  <option value="electronics">Electronics</option>
                  <option value="customized-batteries">Customized Batteries</option>
                </select>
              </div>
              <div className={styles.filterGroup}>
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {isLoading ? (
              <div className={styles.resultsGrid}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={styles.productCard}>
                    <Skeleton className={styles.productImageSkeleton} />
                    <div className={styles.productContent}>
                      <Skeleton className={styles.productTitleSkeleton} />
                      <Skeleton className={styles.productPriceSkeleton} />
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className={styles.noResults}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="8" y1="8" x2="14" y2="14" />
                  <line x1="14" y1="8" x2="8" y2="14" />
                </svg>
                <h3>No results found</h3>
                <p>Try different keywords or browse our categories</p>
                <div className={styles.noResultsActions}>
                  <Button onClick={() => router.push('/buyer/batteries')}>Browse Batteries</Button>
                  <Button variant="outline" onClick={() => router.push('/buyer/electronics')}>
                    Browse Electronics
                  </Button>
                </div>
              </div>
            ) : (
              <div className={styles.resultsGrid}>
                {results.map((product) => (
                  <div key={product.id} className={styles.productCard}>
                    <Link href={`/buyer/product/${product.slug}`} className={styles.productImageLink}>
                      <div className={styles.productImage}>
                        {product.name.charAt(0)}
                      </div>
                      {product.badges && product.badges.length > 0 && (
                        <span className={styles.productBadge}>{product.badges[0]}</span>
                      )}
                    </Link>
                    <button
                      className={`${styles.wishlistButton} ${
                        isInWishlist(product.id) ? styles.active : ''
                      }`}
                      onClick={() => handleWishlistToggle(product)}
                    >
                      <svg viewBox="0 0 24 24" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                    </button>
                    <div className={styles.productContent}>
                      <span className={styles.productCategory}>{product.category}</span>
                      <Link href={`/buyer/product/${product.slug}`}>
                        <h3 className={styles.productName}>{product.name}</h3>
                      </Link>
                      <p className={styles.productDescription}>{product.shortDescription}</p>
                      <div className={styles.productRating}>
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span>{product.rating}</span>
                        <span className={styles.ratingCount}>({product.reviewCount})</span>
                      </div>
                      <div className={styles.productPricing}>
                        <span className={styles.productPrice}>{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className={styles.originalPrice}>
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        fullWidth
                        onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Browse Categories - shown when no query */}
        {!query && (
          <div className={styles.browseSection}>
            <h2 className={styles.browseTitle}>Browse Categories</h2>
            <div className={styles.categoryGrid}>
              <Link href="/buyer/batteries" className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="1" y="6" width="18" height="12" rx="2" ry="2" />
                    <line x1="23" y1="13" x2="23" y2="11" />
                  </svg>
                </div>
                <h3>Batteries</h3>
                <p>Lithium Ion & Lead Acid</p>
              </Link>
              <Link href="/buyer/electronics" className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
                    <rect x="9" y="9" width="6" height="6" />
                    <line x1="9" y1="1" x2="9" y2="4" />
                    <line x1="15" y1="1" x2="15" y2="4" />
                    <line x1="9" y1="20" x2="9" y2="23" />
                    <line x1="15" y1="20" x2="15" y2="23" />
                  </svg>
                </div>
                <h3>Electronics</h3>
                <p>Inverters & Controllers</p>
              </Link>
              <Link href="/buyer/customized-batteries" className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </div>
                <h3>Custom Batteries</h3>
                <p>Build Your Own</p>
              </Link>
              <Link href="/buyer/customized-electronics" className={styles.categoryCard}>
                <div className={styles.categoryIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
                  </svg>
                </div>
                <h3>Custom Electronics</h3>
                <p>Tailored Solutions</p>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className={styles.searchPage}><Loader size="lg" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
