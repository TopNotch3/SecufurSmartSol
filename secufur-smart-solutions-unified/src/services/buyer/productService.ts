import { api } from './api';
import { PaginatedResponse } from '@/types/buyer/common';
import {
  Product,
  ProductCategory,
  ProductListParams,
  ProductFilters,
  ProductReview,
  ProductFAQ,
  CategoryInfo,
  FilterOptions,
  CustomizationCombination,
} from '@/types/buyer/product';

interface ProductListResponse {
  products: Product[];
  filters: FilterOptions;
  totalCount: number;
  page: number;
  totalPages: number;
}

interface ReviewsResponse {
  reviews: ProductReview[];
  totalCount: number;
  page: number;
  totalPages: number;
  averageRating: number;
}

interface CustomizationValidation {
  valid: boolean;
  errors?: string[];
  price?: number;
  manufacturingTime?: number;
}

export const productService = {
  // Get products with filters and pagination
  getProducts: async (params: ProductListParams): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>('/products', params as Record<string, unknown>);
    return response.data;
  },

  // Get single product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get product by slug
  getProductBySlug: async (slug: string): Promise<Product> => {
    const response = await api.get<Product>(`/products/slug/${slug}`);
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: ProductCategory,
    params?: Omit<ProductListParams, 'filters'> & { subcategory?: string }
  ): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>(`/products/category/${category}`, params as Record<string, unknown>);
    return response.data;
  },

  // Search products
  searchProducts: async (
    query: string,
    params?: ProductListParams
  ): Promise<ProductListResponse> => {
    const response = await api.get<ProductListResponse>('/products/search', {
      query,
      ...params,
    } as Record<string, unknown>);
    return response.data;
  },

  // Get search suggestions
  getSearchSuggestions: async (query: string): Promise<{ suggestions: string[]; products: Product[] }> => {
    const response = await api.get<{ suggestions: string[]; products: Product[] }>('/products/search/suggestions', { query });
    return response.data;
  },

  // Get popular searches
  getPopularSearches: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/products/search/popular');
    return response.data;
  },

  // Get all categories
  getCategories: async (): Promise<CategoryInfo[]> => {
    const response = await api.get<CategoryInfo[]>('/products/categories');
    return response.data;
  },

  // Get category info
  getCategoryInfo: async (category: ProductCategory): Promise<CategoryInfo> => {
    const response = await api.get<CategoryInfo>(`/products/categories/${category}`);
    return response.data;
  },

  // Get filter options for category
  getFilterOptions: async (category?: ProductCategory): Promise<FilterOptions> => {
    const response = await api.get<FilterOptions>('/products/filters', category ? { category } : {});
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/featured', { limit });
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/new-arrivals', { limit });
    return response.data;
  },

  // Get best sellers
  getBestSellers: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/best-sellers', { limit });
    return response.data;
  },

  // Get deals
  getDeals: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/deals', { limit });
    return response.data;
  },

  // Get personalized recommendations (requires auth)
  getRecommendations: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/recommendations', { limit });
    return response.data;
  },

  // Get related products
  getRelatedProducts: async (productId: string, limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>(`/products/${productId}/related`, { limit });
    return response.data;
  },

  // Get product reviews
  getProductReviews: async (
    productId: string,
    params?: { page?: number; limit?: number; rating?: number; hasImages?: boolean }
  ): Promise<ReviewsResponse> => {
    const response = await api.get<ReviewsResponse>(`/products/${productId}/reviews`, params as Record<string, unknown>);
    return response.data;
  },

  // Add product review
  addProductReview: async (
    productId: string,
    review: { rating: number; title: string; content: string; images?: string[] }
  ): Promise<ProductReview> => {
    const response = await api.post<ProductReview>(`/products/${productId}/reviews`, review);
    return response.data;
  },

  // Mark review as helpful
  markReviewHelpful: async (productId: string, reviewId: string): Promise<{ helpful: number }> => {
    const response = await api.post<{ helpful: number }>(`/products/${productId}/reviews/${reviewId}/helpful`);
    return response.data;
  },

  // Get product FAQs
  getProductFAQs: async (productId: string): Promise<ProductFAQ[]> => {
    const response = await api.get<ProductFAQ[]>(`/products/${productId}/faqs`);
    return response.data;
  },

  // Submit product question
  submitProductQuestion: async (productId: string, question: string): Promise<ProductFAQ> => {
    const response = await api.post<ProductFAQ>(`/products/${productId}/faqs`, { question });
    return response.data;
  },

  // Validate customization combination
  validateCustomization: async (
    productId: string,
    combination: CustomizationCombination
  ): Promise<CustomizationValidation> => {
    const response = await api.post<CustomizationValidation>(`/products/${productId}/validate-customization`, combination);
    return response.data;
  },

  // Calculate customization price
  calculateCustomizationPrice: async (
    productId: string,
    combination: CustomizationCombination,
    quantity: number
  ): Promise<{ unitPrice: number; totalPrice: number; manufacturingTime: number }> => {
    const response = await api.post<{ unitPrice: number; totalPrice: number; manufacturingTime: number }>(
      `/products/${productId}/calculate-price`,
      { ...combination, quantity }
    );
    return response.data;
  },

  // Check product availability
  checkAvailability: async (productId: string, pincode: string): Promise<{
    available: boolean;
    deliveryOptions: { standard: string; express?: string };
    reason?: string;
  }> => {
    const response = await api.get<{
      available: boolean;
      deliveryOptions: { standard: string; express?: string };
      reason?: string;
    }>(`/products/${productId}/availability`, { pincode });
    return response.data;
  },

  // Get recently viewed products (requires auth)
  getRecentlyViewed: async (limit?: number): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products/recently-viewed', { limit });
    return response.data;
  },

  // Track product view
  trackProductView: async (productId: string): Promise<void> => {
    await api.post(`/products/${productId}/view`);
  },
};

export default productService;
