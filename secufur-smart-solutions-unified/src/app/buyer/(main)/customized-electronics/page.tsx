'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Skeleton, SkeletonProductCard, Loader } from '@/components/buyer/common';
import { Product } from '@/types/buyer/product';
import styles from '../category.module.css';

// Mock data for customized electronics
const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `custom-electronics-${i + 1}`,
  sku: `CELEC-${1000 + i}`,
  name: ['Custom Control System', 'Bespoke Inverter', 'Custom BMS', 'Tailored Monitor'][i % 4] + ` ${i + 1}`,
  slug: `custom-electronics-${i + 1}`,
  description: 'Fully customizable electronic control system tailored to your specific needs',
  shortDescription: 'Custom electronics solution',
  category: 'customized-electronics',
  subcategory: i % 3 === 0 ? 'control-systems' : i % 3 === 1 ? 'inverters' : 'monitoring',
  brand: 'LUVARTE',
  images: [{ id: '1', url: '/images/placeholder.jpg', alt: 'Product' }],
  price: 14999 + i * 3000,
  originalPrice: undefined,
  discountPercentage: undefined,
  currency: 'INR',
  taxInfo: { taxRate: 18, taxAmount: 1500, inclusiveOfTax: true, taxLabel: 'GST' },
  stockStatus: 'in_stock',
  stockQuantity: 999,
  isCustomizable: true,
  customizationOptions: {
    voltageOptions: [
      { id: 'v12', label: '12V Input', value: '12', unit: 'V', priceModifier: 0, available: true },
      { id: 'v24', label: '24V Input', value: '24', unit: 'V', priceModifier: 2000, available: true },
      { id: 'v48', label: '48V Input', value: '48', unit: 'V', priceModifier: 4000, available: true },
    ],
    capacityOptions: [
      { id: 'p1kw', label: '1kW', value: '1000', unit: 'W', priceModifier: 0, available: true },
      { id: 'p2kw', label: '2kW', value: '2000', unit: 'W', priceModifier: 5000, available: true },
      { id: 'p5kw', label: '5kW', value: '5000', unit: 'W', priceModifier: 15000, available: true },
    ],
    usageTypeOptions: [
      { id: 'solar', label: 'Solar System', value: 'solar', priceModifier: 0, available: true },
      { id: 'ev', label: 'EV Charging', value: 'ev', priceModifier: 3000, available: true },
      { id: 'industrial', label: 'Industrial', value: 'industrial', priceModifier: 5000, available: true },
    ],
    basePrice: 14999 + i * 3000,
    manufacturingTime: 21,
  },
  specifications: [
    { label: 'Power Range', value: '1-5', unit: 'kW' },
    { label: 'Efficiency', value: '95+', unit: '%' },
    { label: 'Protection', value: 'Configurable', unit: '' },
  ],
  features: ['Fully customizable', 'Remote monitoring', '3-year warranty', 'Installation support'],
  deliveryEstimate: { standardDays: 21, expressDays: 14, standardAvailable: true, expressAvailable: true },
  rating: { average: 4.9, distribution: { five: 92, four: 6, three: 1, two: 0.5, one: 0.5 } },
  reviewCount: 25 + i * 4,
  faqs: [],
  tags: ['customizable', 'electronics', 'custom'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

const subcategories = [
  { value: '', label: 'All Custom Electronics' },
  { value: 'control-systems', label: 'Control Systems' },
  { value: 'inverters', label: 'Custom Inverters' },
  { value: 'monitoring', label: 'Monitoring Systems' },
];

const sortOptions = [
  { value: 'popularity-desc', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Rating' },
];

const applicationOptions = ['Solar Systems', 'Industrial Automation', 'EV Charging', 'Smart Home'];
const powerOptions = ['1kW', '2kW', '5kW', '10kW+'];

function CustomizedElectronicsContent() {
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
  const [selectedPowers, setSelectedPowers] = useState<string[]>(
    searchParams.get('powers')?.split(',').filter(Boolean) || []
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
  }, [subcategory, sortBy, priceMin, priceMax, selectedApplications, selectedPowers]);

  const handleApplicationChange = (app: string) => {
    setSelectedApplications((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const handlePowerChange = (power: string) => {
    setSelectedPowers((prev) =>
      prev.includes(power) ? prev.filter((p) => p !== power) : [...prev, power]
    );
  };

  const clearFilters = () => {
    setSubcategory('');
    setPriceMin('');
    setPriceMax('');
    setSelectedApplications([]);
    setSelectedPowers([]);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const hasActiveFilters = subcategory || priceMin || priceMax || selectedApplications.length > 0 ||
    selectedPowers.length > 0;

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/buyer">Home</Link>
          <span>/</span>
          <span>Customized Electronics</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Customized Electronics</h1>
          <p className={styles.description}>
            Build your perfect electronic control system. Configure power, interface, and protection features to match your exact requirements.
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

            {/* Power Rating */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Power Rating</h4>
              <div className={styles.filterOptions}>
                {powerOptions.map((power) => (
                  <label key={power} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={selectedPowers.includes(power)}
                      onChange={() => handlePowerChange(power)}
                    />
                    <span>{power}</span>
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

export default function CustomizedElectronicsPage() {
  return (
    <Suspense fallback={<div className={styles.categoryPage}><Loader size="lg" /></div>}>
      <CustomizedElectronicsContent />
    </Suspense>
  );
}
