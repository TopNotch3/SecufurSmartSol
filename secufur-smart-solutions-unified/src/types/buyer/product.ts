// Product Types

import { Image, PriceRange } from './common';

export type ProductCategory =
  | 'batteries'
  | 'electronics'
  | 'customized-batteries'
  | 'customized-electronics';

export type BatterySubcategory =
  | 'li-ion'
  | 'lead-acid'
  | 'custom-battery-packs';

export type ElectronicsSubcategory =
  | 'chargers'
  | 'power-supplies'
  | 'control-boards';

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  subcategory?: string;
  brand: string;
  images: Image[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  currency: string;
  taxInfo: TaxInfo;
  stockStatus: StockStatus;
  stockQuantity: number;
  isCustomizable: boolean;
  customizationOptions?: CustomizationOptions;
  specifications: ProductSpecification[];
  features: string[];
  deliveryEstimate: DeliveryEstimate;
  rating: ProductRating;
  reviewCount: number;
  faqs: ProductFAQ[];
  relatedProducts?: string[];
  tags: string[];
  material?: string;
  color?: string;
  dimensions?: ProductDimensions;
  weight?: number;
  warranty?: WarrantyInfo;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecification {
  label: string;
  value: string;
  unit?: string;
}

export interface TaxInfo {
  taxRate: number;
  taxAmount: number;
  inclusiveOfTax: boolean;
  taxLabel: string;
}

export type StockStatus =
  | 'in_stock'
  | 'out_of_stock'
  | 'low_stock'
  | 'pre_order'
  | 'discontinued';

export interface CustomizationOptions {
  voltageOptions: CustomizationOption[];
  capacityOptions: CustomizationOption[];
  dimensionOptions?: DimensionOption[];
  connectorOptions?: CustomizationOption[];
  usageTypeOptions?: CustomizationOption[];
  basePrice: number;
  manufacturingTime: number;
  validCombinations?: CustomizationCombination[];
  invalidCombinations?: CustomizationCombination[];
}

export interface CustomizationOption {
  id: string;
  label: string;
  value: string;
  unit?: string;
  priceModifier: number;
  available: boolean;
  manufacturingTimeModifier?: number;
}

export interface DimensionOption {
  id: string;
  label: string;
  length: number;
  width: number;
  height: number;
  unit: string;
  priceModifier: number;
  available: boolean;
}

export interface CustomizationCombination {
  voltage?: string;
  capacity?: string;
  dimensions?: string;
  connector?: string;
  usageType?: string;
}

export interface SelectedCustomization {
  voltage?: CustomizationOption;
  capacity?: CustomizationOption;
  dimensions?: DimensionOption;
  connector?: CustomizationOption;
  usageType?: CustomizationOption;
  quantity: number;
  totalPrice: number;
  manufacturingTime: number;
}

export interface DeliveryEstimate {
  standardDays: number;
  expressDays: number;
  standardAvailable: boolean;
  expressAvailable: boolean;
  customDeliveryDays?: number;
}

export interface ProductRating {
  average: number;
  distribution: RatingDistribution;
}

export interface RatingDistribution {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  images?: Image[];
  isVerifiedBuyer: boolean;
  helpful: number;
  createdAt: string;
  manufacturerResponse?: ManufacturerResponse;
}

export interface ManufacturerResponse {
  content: string;
  respondedAt: string;
}

export interface ProductFAQ {
  id: string;
  question: string;
  answer: string;
  askedBy?: string;
  askedAt: string;
  manufacturerResponse?: boolean;
}

export interface ProductDimensions {
  length: number;
  width: number;
  height: number;
  unit: string;
}

export interface WarrantyInfo {
  duration: number;
  unit: 'months' | 'years';
  description: string;
  terms?: string;
}

export interface ProductFilters {
  categories?: ProductCategory[];
  subcategories?: string[];
  priceRange?: PriceRange;
  brands?: string[];
  voltages?: string[];
  capacities?: string[];
  powerRatings?: string[];
  compatibility?: string[];
  isCustomizable?: boolean;
  stockStatus?: StockStatus[];
  deliverySpeed?: ('3-day' | '7-day')[];
  rating?: number;
}

export interface ProductSort {
  field: 'price' | 'createdAt' | 'rating' | 'popularity' | 'name';
  order: 'asc' | 'desc';
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  filters?: ProductFilters;
  sort?: ProductSort;
  search?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: Image;
  productCount: number;
  subcategories?: SubcategoryInfo[];
}

export interface SubcategoryInfo {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export interface FilterOptions {
  brands: FilterOptionItem[];
  voltages: FilterOptionItem[];
  capacities: FilterOptionItem[];
  powerRatings: FilterOptionItem[];
  compatibility: FilterOptionItem[];
  priceRange: PriceRange;
}

export interface FilterOptionItem {
  value: string;
  label: string;
  count: number;
}
