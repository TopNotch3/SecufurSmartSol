import { api } from './api';
import {
  Cart,
  CartItem,
  AddToCartRequest,
  UpdateCartItemRequest,
  ApplyCouponRequest,
  AppliedCoupon,
  PincodeCheckRequest,
  PincodeCheckResponse,
  DeliveryOption,
  CartValidation,
  SavedItem,
} from '@/types/buyer/cart';

export const cartService = {
  // Get cart
  getCart: async (): Promise<Cart> => {
    const response = await api.get<Cart>('/cart');
    return response.data;
  },

  // Add item to cart
  addToCart: async (request: AddToCartRequest): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/items', request);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (request: UpdateCartItemRequest): Promise<Cart> => {
    const response = await api.put<Cart>(`/cart/items/${request.itemId}`, {
      quantity: request.quantity,
    });
    return response.data;
  },

  // Remove item from cart
  removeCartItem: async (itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart');
    return response.data;
  },

  // Save item for later
  saveForLater: async (itemId: string): Promise<{ cart: Cart; savedItem: SavedItem }> => {
    const response = await api.post<{ cart: Cart; savedItem: SavedItem }>(`/cart/items/${itemId}/save-for-later`);
    return response.data;
  },

  // Get saved for later items
  getSavedForLater: async (): Promise<SavedItem[]> => {
    const response = await api.get<SavedItem[]>('/cart/saved-for-later');
    return response.data;
  },

  // Move saved item to cart
  moveToCart: async (savedItemId: string): Promise<{ cart: Cart; savedItems: SavedItem[] }> => {
    const response = await api.post<{ cart: Cart; savedItems: SavedItem[] }>(`/cart/saved-for-later/${savedItemId}/move-to-cart`);
    return response.data;
  },

  // Remove saved item
  removeSavedItem: async (savedItemId: string): Promise<SavedItem[]> => {
    const response = await api.delete<SavedItem[]>(`/cart/saved-for-later/${savedItemId}`);
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (request: ApplyCouponRequest): Promise<{ cart: Cart; coupon: AppliedCoupon }> => {
    const response = await api.post<{ cart: Cart; coupon: AppliedCoupon }>('/cart/coupon', request);
    return response.data;
  },

  // Remove coupon
  removeCoupon: async (): Promise<Cart> => {
    const response = await api.delete<Cart>('/cart/coupon');
    return response.data;
  },

  // Validate coupon
  validateCoupon: async (code: string): Promise<{
    valid: boolean;
    coupon?: AppliedCoupon;
    message?: string;
    minOrderValue?: number;
  }> => {
    const response = await api.get<{
      valid: boolean;
      coupon?: AppliedCoupon;
      message?: string;
      minOrderValue?: number;
    }>('/cart/coupon/validate', { code });
    return response.data;
  },

  // Check pincode serviceability
  checkPincode: async (request: PincodeCheckRequest): Promise<PincodeCheckResponse> => {
    const response = await api.post<PincodeCheckResponse>('/cart/check-pincode', request);
    return response.data;
  },

  // Get delivery options for pincode
  getDeliveryOptions: async (pincode: string): Promise<DeliveryOption[]> => {
    const response = await api.get<DeliveryOption[]>('/cart/delivery-options', { pincode });
    return response.data;
  },

  // Set delivery option
  setDeliveryOption: async (deliveryOptionId: string): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/delivery-option', { deliveryOptionId });
    return response.data;
  },

  // Validate cart (check stock, prices, delivery)
  validateCart: async (): Promise<CartValidation> => {
    const response = await api.get<CartValidation>('/cart/validate');
    return response.data;
  },

  // Sync guest cart to user cart (after login)
  syncCart: async (guestCartItems: CartItem[]): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/sync', { items: guestCartItems });
    return response.data;
  },

  // Get cart count
  getCartCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/cart/count');
    return response.data;
  },

  // Merge carts (when guest logs in)
  mergeCarts: async (strategy: 'keep_user' | 'keep_guest' | 'merge'): Promise<Cart> => {
    const response = await api.post<Cart>('/cart/merge', { strategy });
    return response.data;
  },
};

export default cartService;
