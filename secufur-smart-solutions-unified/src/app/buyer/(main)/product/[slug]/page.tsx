'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Loader } from '@/components/buyer/common';
import { useCartStore, useWishlistStore, toast } from '@/store/buyer';
import { Product, CustomizationOption, SelectedCustomization } from '@/types/buyer/product';
import styles from '../product.module.css';

// Mock product data generator
const generateMockProduct = (slug: string): Product => {
  const isCustomizable = slug.includes('custom');
  const category = slug.includes('electronics')
    ? (isCustomizable ? 'customized-electronics' : 'electronics')
    : (isCustomizable ? 'customized-batteries' : 'batteries');

  return {
    id: slug,
    sku: `SKU-${slug.toUpperCase()}`,
    name: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    slug,
    description: 'This is a premium product designed for maximum performance and reliability. Built with high-quality materials and backed by our comprehensive warranty program. Perfect for both commercial and residential applications.',
    shortDescription: 'Premium quality product with excellent performance',
    category,
    subcategory: 'general',
    brand: 'Secufur Smart Solutions',
    images: [
      { id: '1', url: '/images/product-1.jpg', alt: 'Product main view' },
      { id: '2', url: '/images/product-2.jpg', alt: 'Product side view' },
      { id: '3', url: '/images/product-3.jpg', alt: 'Product detail view' },
      { id: '4', url: '/images/product-4.jpg', alt: 'Product in use' },
    ],
    price: 9999,
    originalPrice: 12999,
    discountPercentage: 23,
    currency: 'INR',
    taxInfo: { taxRate: 18, taxAmount: 1800, inclusiveOfTax: true, taxLabel: 'GST' },
    stockStatus: 'in_stock',
    stockQuantity: 50,
    isCustomizable,
    customizationOptions: isCustomizable ? {
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
      basePrice: 9999,
      manufacturingTime: 14,
    } : undefined,
    detailedDescription: [
      'This is a premium product designed for maximum performance and reliability.',
      'Built with high-quality materials and backed by our comprehensive warranty program.',
      'Perfect for both commercial and residential applications.',
      'Features advanced technology for optimal efficiency and longevity.',
    ],
    sellerInfo: {
      name: 'Secufur Smart Solutions',
      rating: 4.8,
      totalProducts: 150,
      responseTime: '2 hours',
      shipOnTime: 98,
      location: 'Mumbai, Maharashtra, India',
      email: 'support@secufur.com',
      phone: '+91 98765 43210',
    },
    specifications: [
      { label: 'Voltage', value: '12', unit: 'V' },
      { label: 'Capacity', value: '50', unit: 'Ah' },
      { label: 'Chemistry', value: 'Lithium Iron Phosphate', unit: '' },
      { label: 'Cycle Life', value: '3000+', unit: 'cycles' },
      { label: 'Operating Temp', value: '-20 to 60', unit: '°C' },
      { label: 'Weight', value: '15', unit: 'kg' },
      { label: 'Warranty', value: '2', unit: 'years' },
      { label: 'Certifications', value: 'CE, UL, BIS', unit: '' },
    ],
    features: [
      'Built-in Battery Management System (BMS)',
      'Over-voltage and under-voltage protection',
      'Short circuit protection',
      'Temperature monitoring and control',
      'Low self-discharge rate',
      'Maintenance-free operation',
    ],
    deliveryEstimate: {
      standardDays: 7,
      expressDays: 3,
      standardAvailable: true,
      expressAvailable: true,
    },
    rating: {
      average: 4.6,
      distribution: { five: 75, four: 15, three: 5, two: 3, one: 2 },
    },
    reviewCount: 128,
    faqs: [
      { id: '1', question: 'What is the warranty period?', answer: 'This product comes with a 2-year manufacturer warranty covering defects in materials and workmanship.', askedAt: new Date().toISOString() },
      { id: '2', question: 'Can this be used for solar storage?', answer: 'Yes, this product is ideal for solar energy storage applications. It is compatible with most solar charge controllers.', askedAt: new Date().toISOString() },
      { id: '3', question: 'What charger should I use?', answer: 'We recommend using a lithium-compatible charger with the appropriate voltage rating. Contact our support team for specific recommendations.', askedAt: new Date().toISOString() },
    ],
    tags: ['battery', 'lithium', 'solar', 'energy-storage'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Mock reviews
const mockReviews = [
  {
    id: '1',
    userName: 'Rajesh Kumar',
    rating: 5,
    title: 'Excellent quality battery',
    content: 'I have been using this battery for 3 months now and it has exceeded my expectations. The build quality is top-notch and the performance is consistent.',
    isVerifiedBuyer: true,
    helpful: 24,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    userName: 'Priya Sharma',
    rating: 4,
    title: 'Good product, fast delivery',
    content: 'The battery works well for my solar setup. Delivery was quick and the packaging was secure. Would recommend.',
    isVerifiedBuyer: true,
    helpful: 18,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    userName: 'Amit Patel',
    rating: 5,
    title: 'Perfect for my RV',
    content: 'Using this in my RV and it handles all my power needs. Great capacity and reliable performance even in hot weather.',
    isVerifiedBuyer: false,
    helpful: 12,
    createdAt: '2024-01-05',
  },
];

type TabType = 'description' | 'seller' | 'reviews' | 'faqs';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { addItem: addToCart } = useCartStore();
  const { addToWishlist, isInWishlist, removeFromWishlist, wishlistItems } = useWishlistStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('description');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });

  // Customization state
  const [selectedVoltage, setSelectedVoltage] = useState<CustomizationOption | null>(null);
  const [selectedCapacity, setSelectedCapacity] = useState<CustomizationOption | null>(null);
  const [selectedConnector, setSelectedConnector] = useState<CustomizationOption | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockProduct = generateMockProduct(resolvedParams.slug);
      setProduct(mockProduct);

      // Set default customization options
      if (mockProduct.customizationOptions) {
        setSelectedVoltage(mockProduct.customizationOptions.voltageOptions[0]);
        setSelectedCapacity(mockProduct.customizationOptions.capacityOptions[0]);
        if (mockProduct.customizationOptions.connectorOptions) {
          setSelectedConnector(mockProduct.customizationOptions.connectorOptions[0]);
        }
      }

      setIsLoading(false);
    };

    fetchProduct();
  }, [resolvedParams.slug]);

  const calculateCustomizationPrice = (): number => {
    if (!product?.customizationOptions) return product?.price ?? 0;

    let total = product.customizationOptions.basePrice;
    if (selectedVoltage) total += selectedVoltage.priceModifier;
    if (selectedCapacity) total += selectedCapacity.priceModifier;
    if (selectedConnector) total += selectedConnector.priceModifier;
    return total;
  };

  const getManufacturingTime = (): number => {
    if (!product?.customizationOptions) return 0;
    let time = product.customizationOptions.manufacturingTime;
    if (selectedVoltage?.manufacturingTimeModifier) time += selectedVoltage.manufacturingTimeModifier;
    if (selectedCapacity?.manufacturingTimeModifier) time += selectedCapacity.manufacturingTimeModifier;
    return time;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const customization: SelectedCustomization | undefined = product.isCustomizable && selectedVoltage && selectedCapacity
      ? {
        voltage: selectedVoltage,
        capacity: selectedCapacity,
        connector: selectedConnector || undefined,
        quantity,
        totalPrice: calculateCustomizationPrice(),
        manufacturingTime: getManufacturingTime(),
      }
      : undefined;

    addToCart({
      productId: product.id,
      product,
      quantity,
      customization,
      unitPrice: customization?.totalPrice ?? product.price,
      totalPrice: (customization?.totalPrice ?? product.price) * quantity,
    });

    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/buyer/cart');
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist!');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.productPage}>
        <div className={styles.container}>
          <div className={styles.loadingPage}>
            <Loader size="lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.productPage}>
        <div className={styles.container}>
          <div className={styles.errorPage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <h2>Product Not Found</h2>
            <p>The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Button onClick={() => router.push('/buyer')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = product.isCustomizable ? calculateCustomizationPrice() : product.price;

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb}>
          <Link href="/buyer">Home</Link>
          <span>/</span>
          <Link href={`/buyer/${product.category}`}>{product.category.replace(/-/g, ' ')}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        {/* Main Content - 50/50 Split */}
        <div className={styles.mainContent}>
          {/* Gallery Section */}
          <div className={styles.gallerySection}>
            <div className={styles.mainImage}>
              <span className={styles.mainImagePlaceholder}>
                {product.name.charAt(0)}
              </span>
            </div>
            <div className={styles.thumbnails}>
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.thumbnail} ${index === selectedImageIndex ? styles.active : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                />
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            <span className={styles.brand}>{product.brand}</span>
            <h1 className={styles.productName}>{product.name}</h1>

            {/* Rating */}
            <div className={styles.ratingRow}>
              <span className={styles.stars}>
                {'★'.repeat(Math.round(product.rating.average))}
                {'☆'.repeat(5 - Math.round(product.rating.average))}
              </span>
              <span className={styles.ratingText}>
                {product.rating.average.toFixed(1)} ({product.reviewCount} reviews)
              </span>
              <button
                className={styles.reviewLink}
                onClick={() => {
                  setActiveTab('reviews');
                  setTimeout(() => {
                    document.querySelector(`.${styles.tabsSection}`)?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                Write a Review
              </button>
            </div>

            {/* Price */}
            <div className={styles.priceSection}>
              <div className={styles.priceRow}>
                <span className={styles.currentPrice}>{formatPrice(finalPrice)}</span>
                {!product.isCustomizable && product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className={styles.originalPrice}>{formatPrice(product.originalPrice)}</span>
                    <span className={styles.discountBadge}>-{product.discountPercentage}%</span>
                  </>
                )}
              </div>
              <span className={styles.taxInfo}>
                {product.taxInfo.inclusiveOfTax ? 'Inclusive' : 'Exclusive'} of {product.taxInfo.taxLabel}
              </span>
            </div>

            {/* Stock Status */}
            <div className={styles.stockStatus}>
              <span className={`${styles.stockDot} ${styles[product.stockStatus === 'in_stock' ? 'inStock' : product.stockStatus === 'low_stock' ? 'lowStock' : 'outOfStock']}`} />
              <span className={`${styles.stockText} ${styles[product.stockStatus === 'in_stock' ? 'inStock' : product.stockStatus === 'low_stock' ? 'lowStock' : 'outOfStock']}`}>
                {product.stockStatus === 'in_stock' ? 'In Stock' : product.stockStatus === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
              </span>
            </div>

            {/* Description */}
            <p className={styles.description}>{product.shortDescription}</p>

            {/* Customization Options */}
            {product.isCustomizable && product.customizationOptions && (
              <div className={styles.customizationSection}>
                <h3 className={styles.customizationTitle}>Customize Your Product</h3>

                {/* Voltage Options */}
                <div className={styles.customizationGroup}>
                  <span className={styles.customizationLabel}>Voltage</span>
                  <div className={styles.customizationOptions}>
                    {product.customizationOptions.voltageOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`${styles.customizationOption} ${selectedVoltage?.id === option.id ? styles.selected : ''} ${!option.available ? styles.disabled : ''}`}
                        onClick={() => option.available && setSelectedVoltage(option)}
                        disabled={!option.available}
                      >
                        {option.label}
                        {option.priceModifier > 0 && (
                          <span className={styles.optionPrice}>+{formatPrice(option.priceModifier)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Capacity Options */}
                <div className={styles.customizationGroup}>
                  <span className={styles.customizationLabel}>Capacity</span>
                  <div className={styles.customizationOptions}>
                    {product.customizationOptions.capacityOptions.map((option) => (
                      <button
                        key={option.id}
                        className={`${styles.customizationOption} ${selectedCapacity?.id === option.id ? styles.selected : ''} ${!option.available ? styles.disabled : ''}`}
                        onClick={() => option.available && setSelectedCapacity(option)}
                        disabled={!option.available}
                      >
                        {option.label}
                        {option.priceModifier > 0 && (
                          <span className={styles.optionPrice}>+{formatPrice(option.priceModifier)}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Connector Options */}
                {product.customizationOptions.connectorOptions && (
                  <div className={styles.customizationGroup}>
                    <span className={styles.customizationLabel}>Connector Type</span>
                    <div className={styles.customizationOptions}>
                      {product.customizationOptions.connectorOptions.map((option) => (
                        <button
                          key={option.id}
                          className={`${styles.customizationOption} ${selectedConnector?.id === option.id ? styles.selected : ''} ${!option.available ? styles.disabled : ''}`}
                          onClick={() => option.available && setSelectedConnector(option)}
                          disabled={!option.available}
                        >
                          {option.label}
                          {option.priceModifier > 0 && (
                            <span className={styles.optionPrice}>+{formatPrice(option.priceModifier)}</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                <div className={styles.customizationSummary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryLabel}>Base Price</span>
                    <span className={styles.summaryValue}>{formatPrice(product.customizationOptions.basePrice)}</span>
                  </div>
                  {selectedVoltage && selectedVoltage.priceModifier > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>{selectedVoltage.label}</span>
                      <span className={styles.summaryValue}>+{formatPrice(selectedVoltage.priceModifier)}</span>
                    </div>
                  )}
                  {selectedCapacity && selectedCapacity.priceModifier > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>{selectedCapacity.label}</span>
                      <span className={styles.summaryValue}>+{formatPrice(selectedCapacity.priceModifier)}</span>
                    </div>
                  )}
                  {selectedConnector && selectedConnector.priceModifier > 0 && (
                    <div className={styles.summaryRow}>
                      <span className={styles.summaryLabel}>{selectedConnector.label}</span>
                      <span className={styles.summaryValue}>+{formatPrice(selectedConnector.priceModifier)}</span>
                    </div>
                  )}
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>{formatPrice(calculateCustomizationPrice())}</span>
                  </div>
                  <p className={styles.manufacturingTime}>
                    Estimated manufacturing time: {getManufacturingTime()} days
                  </p>
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.quantitySection}>
              <span className={styles.quantityLabel}>Quantity</span>
              <div className={styles.quantityControls}>
                <button
                  className={styles.quantityButton}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  disabled={quantity >= 10}
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <div className={styles.primaryActions}>
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stockStatus === 'out_of_stock'}
                  fullWidth
                >
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBuyNow}
                  disabled={product.stockStatus === 'out_of_stock'}
                  fullWidth
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className={styles.tabsSection}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'description' ? styles.active : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'seller' ? styles.active : ''}`}
              onClick={() => setActiveTab('seller')}
            >
              Seller Details
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'reviews' ? styles.active : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.reviewCount})
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'faqs' ? styles.active : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              FAQs ({product.faqs.length})
            </button>
          </div>

          <div className={styles.tabContent}>
            {/* Description Tab */}
            {activeTab === 'description' && (
              <div className={styles.description}>
                {product.detailedDescription?.map((paragraph: string, index: number) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            )}

            {/* Seller Details Tab */}
            {activeTab === 'seller' && product.sellerInfo && (
              <div className={styles.sellerDetails}>
                <h3>Shop Info</h3>
                <div className={styles.sellerCard}>
                  <div className={styles.sellerHeader}>
                    <div className={styles.sellerAvatar}>
                      {product.sellerInfo.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className={styles.sellerName}>{product.sellerInfo.name}</h4>
                      <div className={styles.sellerRating}>
                        <span className={styles.stars}>{'★'.repeat(Math.round(product.sellerInfo.rating))}</span>
                        <span>{product.sellerInfo.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.sellerStats}>
                    <div className={styles.sellerStat}>
                      <span className={styles.statLabel}>Total Products</span>
                      <span className={styles.statValue}>{product.sellerInfo.totalProducts}</span>
                    </div>
                    <div className={styles.sellerStat}>
                      <span className={styles.statLabel}>Response Time</span>
                      <span className={styles.statValue}>{product.sellerInfo.responseTime}</span>
                    </div>
                    <div className={styles.sellerStat}>
                      <span className={styles.statLabel}>Ship on Time</span>
                      <span className={styles.statValue}>{product.sellerInfo.shipOnTime}%</span>
                    </div>
                  </div>
                  <div className={styles.sellerContact}>
                    <h4>Contact Details</h4>
                    <div className={styles.contactItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      <span>{product.sellerInfo.location}</span>
                    </div>
                    <div className={styles.contactItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${product.sellerInfo.email}`}>{product.sellerInfo.email}</a>
                    </div>
                    <div className={styles.contactItem}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <a href={`tel:${product.sellerInfo.phone}`}>{product.sellerInfo.phone}</a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews Tab */}
            {activeTab === 'reviews' && (
              <div>
                <div className={styles.reviewsHeader}>
                  <div className={styles.reviewsSummary}>
                    <div className={styles.averageRating}>
                      <div className={styles.averageScore}>{product.rating.average.toFixed(1)}</div>
                      <div className={styles.averageStars}>
                        {'★'.repeat(Math.round(product.rating.average))}
                      </div>
                      <div className={styles.reviewCount}>{product.reviewCount} reviews</div>
                    </div>
                    <div className={styles.ratingBars}>
                      {[5, 4, 3, 2, 1].map((star) => (
                        <div key={star} className={styles.ratingBar}>
                          <span className={styles.ratingBarLabel}>{star} stars</span>
                          <div className={styles.ratingBarTrack}>
                            <div
                              className={styles.ratingBarFill}
                              style={{
                                width: `${product.rating.distribution[star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one']}%`,
                              }}
                            />
                          </div>
                          <span className={styles.ratingBarPercent}>
                            {product.rating.distribution[star === 5 ? 'five' : star === 4 ? 'four' : star === 3 ? 'three' : star === 2 ? 'two' : 'one']}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Button onClick={() => setShowReviewModal(true)}>Write a Review</Button>
                </div>

                <div className={styles.reviewsList}>
                  {mockReviews.map((review) => (
                    <div key={review.id} className={styles.reviewCard}>
                      <div className={styles.reviewHeader}>
                        <div className={styles.reviewerInfo}>
                          <div className={styles.reviewerAvatar}>
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <h4 className={styles.reviewerName}>{review.userName}</h4>
                            {review.isVerifiedBuyer && (
                              <span className={styles.reviewerBadge}>Verified Buyer</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.reviewDate}>{review.createdAt}</div>
                      </div>
                      <div className={styles.reviewRating}>
                        {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                      </div>
                      <h5 className={styles.reviewTitle}>{review.title}</h5>
                      <p className={styles.reviewContent}>{review.content}</p>
                      <div className={styles.reviewFooter}>
                        <button className={styles.helpfulButton}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          </svg>
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQs Tab */}
            {activeTab === 'faqs' && (
              <div className={styles.faqList}>
                {product.faqs.map((faq) => (
                  <div key={faq.id} className={styles.faqItem}>
                    <button
                      className={`${styles.faqQuestion} ${expandedFaq === faq.id ? styles.open : ''}`}
                      onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    >
                      {faq.question}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </button>
                    {expandedFaq === faq.id && (
                      <div className={styles.faqAnswer}>{faq.answer}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Review Modal */}
        {showReviewModal && (
          <div className={styles.modalOverlay} onClick={() => setShowReviewModal(false)}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <h3>Write a Review</h3>
                <button className={styles.modalClose} onClick={() => setShowReviewModal(false)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label>Rating</label>
                  <div className={styles.starRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`${styles.starButton} ${star <= reviewForm.rating ? styles.active : ''}`}
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Review Title</label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    placeholder="Summarize your experience"
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Review</label>
                  <textarea
                    value={reviewForm.content}
                    onChange={(e) => setReviewForm({ ...reviewForm, content: e.target.value })}
                    placeholder="Share your thoughts about this product"
                    className={styles.formTextarea}
                    rows={5}
                  />
                </div>
              </div>
              <div className={styles.modalFooter}>
                <Button variant="outline" onClick={() => setShowReviewModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  toast.success('Review submitted successfully!');
                  setShowReviewModal(false);
                  setReviewForm({ rating: 5, title: '', content: '' });
                }}>
                  Submit Review
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
