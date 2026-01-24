'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Skeleton, SkeletonProductCard, Loader } from '@/components/buyer/common';
import { Product } from '@/types/buyer/product';
import styles from '../category.module.css';

// Mock data for electronics
const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `electronics-${i + 1}`,
  sku: `ELEC-${1000 + i}`,
  name: ['Smart Inverter', 'Solar Controller', 'Power Monitor', 'UPS System'][i % 4] + ` ${i + 1}`,
  slug: `electronics-${i + 1}`,
  description: 'High-quality electronic equipment for power management',
  shortDescription: 'Premium electronics',
  category: 'electronics',
  subcategory: i % 4 === 0 ? 'inverters' : i % 4 === 1 ? 'controllers' : i % 4 === 2 ? 'monitors' : 'ups',
  brand: ['LUVARTE', 'PowerTech', 'SmartEnergy'][i % 3],
  images: [{ id: '1', url: '/images/placeholder.jpg', alt: 'Product' }],
  price: 4999 + i * 1000,
  originalPrice: i % 2 === 0 ? 5999 + i * 1000 : undefined,
  discountPercentage: i % 2 === 0 ? 20 : undefined,
  currency: 'INR',
  taxInfo: { taxRate: 18, taxAmount: 500, inclusiveOfTax: true, taxLabel: 'GST' },
  stockStatus: i % 5 === 0 ? 'out_of_stock' : 'in_stock',
  stockQuantity: 50,
  isCustomizable: false,
  specifications: [
    { label: 'Power Rating', value: `${500 + i * 100}`, unit: 'W' },
    { label: 'Efficiency', value: `${90 + (i % 5)}`, unit: '%' },
  ],
  features: [],
  deliveryEstimate: { standardDays: 7, expressDays: 3, standardAvailable: true, expressAvailable: true },
  rating: { average: 4 + (i % 2) * 0.5, distribution: { five: 80, four: 15, three: 3, two: 1, one: 1 } },
  reviewCount: 50 + i * 10,
  faqs: [],
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const subcategories = [
  { value: '', label: 'All Electronics' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'controllers', label: 'Controllers' },
  { value: 'monitors', label: 'Power Monitors' },
  { value: 'ups', label: 'UPS Systems' },
];

const sortOptions = [
  { value: 'popularity-desc', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Rating' },
];

const powerRatingOptions = ['500W', '1000W', '1500W', '2000W'];
const brandOptions = ['LUVARTE', 'PowerTech', 'SmartEnergy'];

function ElectronicsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [subcategory, setSubcategory] = useState(searchParams.get('subcategory') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity-desc');
  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brands')?.split(',').filter(Boolean) || []
  );
  const [selectedPowerRatings, setSelectedPowerRatings] = useState<string[]>(
    searchParams.get('powerRatings')?.split(',').filter(Boolean) || []
  );
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filtered = [...mockProducts];

      // Apply search filter
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(lowerQuery) ||
            p.description.toLowerCase().includes(lowerQuery) ||
            p.brand.toLowerCase().includes(lowerQuery)
        );
      }

      // Apply filters
      if (subcategory) {
        filtered = filtered.filter((p) => p.subcategory === subcategory);
      }
      if (selectedBrands.length > 0) {
        filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
      }
      if (inStockOnly) {
        filtered = filtered.filter((p) => p.stockStatus === 'in_stock');
      }
      if (priceMin) {
        filtered = filtered.filter((p) => p.price >= Number(priceMin));
      }
      if (priceMax) {
        filtered = filtered.filter((p) => p.price <= Number(priceMax));
      }

      // Apply sorting
      const [field, order] = sortBy.split('-');
      filtered.sort((a, b) => {
        let comparison = 0;
        if (field === 'price') comparison = a.price - b.price;
        else if (field === 'rating') comparison = a.rating.average - b.rating.average;
        else if (field === 'createdAt') comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        else comparison = a.reviewCount - b.reviewCount;
        return order === 'desc' ? -comparison : comparison;
      });

      setProducts(filtered);
      setTotalCount(filtered.length);
      setIsLoading(false);
    };

    fetchProducts();
  }, [subcategory, sortBy, priceMin, priceMax, selectedBrands, inStockOnly, selectedPowerRatings, searchQuery]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handlePowerRatingChange = (rating: string) => {
    setSelectedPowerRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const clearFilters = () => {
    setSubcategory('');
    setPriceMin('');
    setPriceMax('');
    setSelectedBrands([]);
    setSelectedPowerRatings([]);
    setInStockOnly(false);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = subcategory || priceMin || priceMax || selectedBrands.length > 0 ||
    selectedPowerRatings.length > 0 || inStockOnly;

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/buyer">Home</Link>
          <span>/</span>
          <span>Electronics</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Electronics</h1>
          <p className={styles.description}>
            Smart power management solutions. Inverters, controllers, monitors, and UPS systems for reliable energy control.
          </p>
        </div>

        {/* Search Bar */}
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search electronics..."
              className={styles.searchInput}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchButton}
                onClick={() => setSearchQuery('')}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <span className={styles.resultCount}>{totalCount} Products</span>
            <Select
              options={sortOptions}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              size="sm"
            />
          </div>
        </div>

        <div className={styles.content}>
          {/* Filters Sidebar */}
          <aside className={`${styles.filters} ${showFilters ? styles.showFilters : ''}`}>
            <div className={styles.filtersHeader}>
              <h3>Filters</h3>
              {hasActiveFilters && (
                <button className={styles.clearFilters} onClick={clearFilters}>
                  Clear All
                </button>
              )}
            </div>

            {/* Price Range */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Price Range</h4>
              <div className={styles.priceInputs}>
                <Input
                  placeholder="Min"
                  type="number"
                  value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  size="sm"
                />
                <span>to</span>
                <Input
                  placeholder="Max"
                  type="number"
                  value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  size="sm"
                />
              </div>
            </div>

            {/* Brand */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Brand</h4>
              <div className={styles.filterOptions}>
                {brandOptions.map((brand) => (
                  <label key={brand} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In Stock */}
            <div className={styles.filterGroup}>
              <label className={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <button
              className={styles.closeFilters}
              onClick={() => setShowFilters(false)}
            >
              Apply Filters
            </button>
          </aside>

          {/* Products Grid */}
          <main className={styles.productsSection}>
            {isLoading ? (
              <div className={styles.productsGrid}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonProductCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className={styles.noResults}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <h3>No products found</h3>
                <p>Try adjusting your filters to find what you&apos;re looking for.</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <div className={styles.productsGrid}>
                {products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/buyer/product/${product.slug}`}
                    className={styles.productCard}
                  >
                    <div className={styles.productImageWrapper}>
                      <div className={styles.productImagePlaceholder}>
                        <span>{product.name.charAt(0)}</span>
                      </div>
                      {product.discountPercentage && (
                        <span className={styles.discountBadge}>-{product.discountPercentage}%</span>
                      )}
                      {product.stockStatus === 'out_of_stock' && (
                        <span className={styles.outOfStockBadge}>Out of Stock</span>
                      )}
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productBrand}>{product.brand}</span>
                      <h3 className={styles.productName}>{product.name}</h3>
                      <div className={styles.productRating}>
                        <span className={styles.ratingStars}>
                          {'★'.repeat(Math.round(product.rating.average))}
                        </span>
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
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function ElectronicsPage() {
  return (
    <Suspense fallback={<div className={styles.categoryPage}><Loader size="lg" /></div>}>
      <ElectronicsContent />
    </Suspense>
  );
}
