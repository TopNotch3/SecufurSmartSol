'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Skeleton, SkeletonProductCard, Loader } from '@/components/buyer/common';
import { Product } from '@/types/buyer/product';
import styles from '../category.module.css';

// Mock data for customized batteries
const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `custom-battery-${i + 1}`,
  sku: `CBAT-${1000 + i}`,
  name: ['Custom Battery Pack', 'Modular Power System', 'Bespoke Energy Solution', 'Custom Li-ion Pack'][i % 4] + ` ${i + 1}`,
  slug: `custom-battery-${i + 1}`,
  description: 'Fully customizable battery solution tailored to your specific needs',
  shortDescription: 'Custom battery solution',
  category: 'customized-batteries',
  subcategory: i % 3 === 0 ? 'industrial' : i % 3 === 1 ? 'commercial' : 'residential',
  brand: 'LUVARTE',
  images: [{ id: '1', url: '/images/placeholder.jpg', alt: 'Product' }],
  price: 9999 + i * 2000,
  originalPrice: undefined,
  discountPercentage: undefined,
  currency: 'INR',
  taxInfo: { taxRate: 18, taxAmount: 1000, inclusiveOfTax: true, taxLabel: 'GST' },
  stockStatus: 'in_stock',
  stockQuantity: 999,
  isCustomizable: true,
  customizationOptions: {
    voltageOptions: [
      { id: 'v12', label: '12V', value: '12', unit: 'V', priceModifier: 0, available: true },
      { id: 'v24', label: '24V', value: '24', unit: 'V', priceModifier: 2000, available: true },
      { id: 'v48', label: '48V', value: '48', unit: 'V', priceModifier: 5000, available: true },
    ],
    capacityOptions: [
      { id: 'c50', label: '50Ah', value: '50', unit: 'Ah', priceModifier: 0, available: true },
      { id: 'c100', label: '100Ah', value: '100', unit: 'Ah', priceModifier: 4000, available: true },
      { id: 'c200', label: '200Ah', value: '200', unit: 'Ah', priceModifier: 10000, available: true },
    ],
    connectorOptions: [
      { id: 'anderson', label: 'Anderson', value: 'anderson', priceModifier: 0, available: true },
      { id: 'xt60', label: 'XT60', value: 'xt60', priceModifier: 500, available: true },
      { id: 'custom', label: 'Custom', value: 'custom', priceModifier: 1500, available: true },
    ],
    basePrice: 9999 + i * 2000,
    manufacturingTime: 14,
  },
  specifications: [
    { label: 'Base Voltage', value: '12-48', unit: 'V' },
    { label: 'Base Capacity', value: '50-200', unit: 'Ah' },
    { label: 'Chemistry', value: 'Lithium Ion', unit: '' },
  ],
  features: ['Fully customizable', 'BMS included', '2-year warranty', 'Free consultation'],
  deliveryEstimate: { standardDays: 14, expressDays: 7, standardAvailable: true, expressAvailable: true },
  rating: { average: 4.8, distribution: { five: 90, four: 8, three: 1, two: 0.5, one: 0.5 } },
  reviewCount: 30 + i * 5,
  faqs: [],
  tags: ['customizable', 'battery', 'custom'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const subcategories = [
  { value: '', label: 'All Custom Batteries' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
];

const sortOptions = [
  { value: 'popularity-desc', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Rating' },
];

const applicationOptions = ['Solar Storage', 'EV/Mobility', 'Backup Power', 'Industrial'];
const voltageOptions = ['12V', '24V', '48V', 'Custom'];

function CustomizedBatteriesContent() {
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
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    searchParams.get('applications')?.split(',').filter(Boolean) || []
  );
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>(
    searchParams.get('voltages')?.split(',').filter(Boolean) || []
  );
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      let filtered = [...mockProducts];

      // Apply filters
      if (subcategory) {
        filtered = filtered.filter((p) => p.subcategory === subcategory);
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
  }, [subcategory, sortBy, priceMin, priceMax, selectedApplications, selectedVoltages]);

  const handleApplicationChange = (app: string) => {
    setSelectedApplications((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handleVoltageChange = (voltage: string) => {
    setSelectedVoltages((prev) =>
      prev.includes(voltage) ? prev.filter((v) => v !== voltage) : [...prev, voltage]
    );
  };

  const clearFilters = () => {
    setSubcategory('');
    setPriceMin('');
    setPriceMax('');
    setSelectedApplications([]);
    setSelectedVoltages([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = subcategory || priceMin || priceMax || selectedApplications.length > 0 ||
    selectedVoltages.length > 0;

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/buyer">Home</Link>
          <span>/</span>
          <span>Customized Batteries</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Customized Batteries</h1>
          <p className={styles.description}>
            Build your perfect battery solution. Configure voltage, capacity, chemistry, and more to match your exact requirements.
          </p>
        </div>

        {/* Subcategories */}
        <div className={styles.subcategories}>
          {subcategories.map((sub) => (
            <button
              key={sub.value}
              className={`${styles.subcategoryButton} ${subcategory === sub.value ? styles.active : ''}`}
              onClick={() => setSubcategory(sub.value)}
            >
              {sub.label}
            </button>
          ))}
        </div>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button
              className={styles.filterToggle}
              onClick={() => setShowFilters(!showFilters)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              Filters
              {hasActiveFilters && <span className={styles.filterBadge} />}
            </button>
            <span className={styles.resultCount}>{totalCount} Products</span>
          </div>
          <div className={styles.toolbarRight}>
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
              <h4 className={styles.filterTitle}>Base Price Range</h4>
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

            {/* Application */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Application</h4>
              <div className={styles.filterOptions}>
                {applicationOptions.map((app) => (
                  <label key={app} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedApplications.includes(app)}
                      onChange={() => handleApplicationChange(app)}
                    />
                    <span>{app}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Voltage */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Voltage Options</h4>
              <div className={styles.filterOptions}>
                {voltageOptions.map((voltage) => (
                  <label key={voltage} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedVoltages.includes(voltage)}
                      onChange={() => handleVoltageChange(voltage)}
                    />
                    <span>{voltage}</span>
                  </label>
                ))}
              </div>
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
                      <span className={styles.customizableBadge}>Customizable</span>
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
                        <span className={styles.currentPrice}>From {formatPrice(product.price)}</span>
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

export default function CustomizedBatteriesPage() {
  return (
    <Suspense fallback={<div className={styles.categoryPage}><Loader size="lg" /></div>}>
      <CustomizedBatteriesContent />
    </Suspense>
  );
}
