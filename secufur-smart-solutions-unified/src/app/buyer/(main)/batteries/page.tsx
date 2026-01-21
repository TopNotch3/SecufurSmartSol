'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Select, Skeleton, SkeletonProductCard, Loader } from '@/components/buyer/common';
import { Product, ProductFilters, ProductSort, FilterOptions } from '@/types/buyer/product';
import styles from '../category.module.css';

// Mock data
const mockProducts: Product[] = Array.from({ length: 12 }, (_, i) => ({
  id: `battery-${i + 1}`,
  sku: `BAT-${1000 + i}`,
  name: `Lithium Ion Battery ${i + 1}`,
  slug: `lithium-ion-battery-${i + 1}`,
  description: 'High-quality lithium-ion battery for various applications',
  shortDescription: 'Premium Li-ion battery',
  category: 'batteries',
  subcategory: i % 3 === 0 ? 'li-ion' : i % 3 === 1 ? 'lead-acid' : 'custom-battery-packs',
  brand: ['LUVARTE', 'PowerMax', 'EnergyCo'][i % 3],
  images: [{ id: '1', url: '/images/placeholder.jpg', alt: 'Product' }],
  price: 2999 + i * 500,
  originalPrice: i % 2 === 0 ? 3499 + i * 500 : undefined,
  discountPercentage: i % 2 === 0 ? 15 : undefined,
  currency: 'INR',
  taxInfo: { taxRate: 18, taxAmount: 500, inclusiveOfTax: true, taxLabel: 'GST' },
  stockStatus: i % 5 === 0 ? 'out_of_stock' : 'in_stock',
  stockQuantity: 50,
  isCustomizable: i % 3 === 0,
  specifications: [
    { label: 'Voltage', value: `${12 + (i % 4) * 12}`, unit: 'V' },
    { label: 'Capacity', value: `${2000 + i * 500}`, unit: 'mAh' },
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
  { value: '', label: 'All Batteries' },
  { value: 'li-ion', label: 'Lithium Ion' },
  { value: 'lead-acid', label: 'Lead Acid' },
  { value: 'custom-battery-packs', label: 'Custom Battery Packs' },
];

const sortOptions = [
  { value: 'popularity-desc', label: 'Popularity' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-desc', label: 'Newest First' },
  { value: 'rating-desc', label: 'Rating' },
];

const voltageOptions = ['12V', '24V', '36V', '48V'];
const capacityOptions = ['2000mAh', '3000mAh', '5000mAh', '10000mAh'];
const brandOptions = ['LUVARTE', 'PowerMax', 'EnergyCo'];

function BatteriesContent() {
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
  const [selectedVoltages, setSelectedVoltages] = useState<string[]>(
    searchParams.get('voltages')?.split(',').filter(Boolean) || []
  );
  const [selectedCapacities, setSelectedCapacities] = useState<string[]>(
    searchParams.get('capacities')?.split(',').filter(Boolean) || []
  );
  const [customizableOnly, setCustomizableOnly] = useState(searchParams.get('customizable') === 'true');
  const [inStockOnly, setInStockOnly] = useState(searchParams.get('inStock') === 'true');
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
      if (selectedBrands.length > 0) {
        filtered = filtered.filter((p) => selectedBrands.includes(p.brand));
      }
      if (customizableOnly) {
        filtered = filtered.filter((p) => p.isCustomizable);
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
  }, [subcategory, sortBy, priceMin, priceMax, selectedBrands, customizableOnly, inStockOnly, selectedVoltages, selectedCapacities]);

  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
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
    setSelectedBrands([]);
    setSelectedVoltages([]);
    setSelectedCapacities([]);
    setCustomizableOnly(false);
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
    selectedVoltages.length > 0 || selectedCapacities.length > 0 || customizableOnly || inStockOnly;

  return (
    <div className={styles.categoryPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/buyer">Home</Link>
          <span>/</span>
          <span>Batteries</span>
        </nav>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Batteries</h1>
          <p className={styles.description}>
            High-quality batteries for all your power needs. From Li-ion to Lead-acid, find the perfect solution.
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

            {/* Voltage */}
            <div className={styles.filterGroup}>
              <h4 className={styles.filterTitle}>Voltage</h4>
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

            {/* Customizable */}
            <div className={styles.filterGroup}>
              <label className={styles.filterOption}>
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={(e) => setCustomizableOnly(e.target.checked)}
                />
                <span>Customizable Only</span>
              </label>
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
                      {product.isCustomizable && (
                        <span className={styles.customizableBadge}>Customizable</span>
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

export default function BatteriesPage() {
  return (
    <Suspense fallback={<div className={styles.categoryPage}><Loader size="lg" /></div>}>
      <BatteriesContent />
    </Suspense>
  );
}
