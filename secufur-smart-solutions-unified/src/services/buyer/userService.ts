import { api, uploadFile } from './api';
import {
  UserProfile,
  UpdateProfileRequest,
  Address,
  CreateAddressRequest,
  UpdateAddressRequest,
  AddressValidation,
  SavedPaymentMethod,
  AddPaymentMethodRequest,
  UserPreferences,
  UpdatePreferencesRequest,
  WishlistItem,
  AddToWishlistRequest,
  Notification,
} from '@/types/buyer/user';

export const userService = {
  // Profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get<UserProfile>('/user/profile');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const response = await api.put<UserProfile>('/user/profile', data);
    return response.data;
  },

  uploadProfileImage: async (file: File): Promise<{ url: string }> => {
    const response = await uploadFile('/user/profile/image', file, 'image');
    return response.data.data;
  },

  deleteProfileImage: async (): Promise<void> => {
    await api.delete('/user/profile/image');
  },

  // Addresses
  getAddresses: async (): Promise<Address[]> => {
    const response = await api.get<Address[]>('/user/addresses');
    return response.data;
  },

  getAddressById: async (addressId: string): Promise<Address> => {
    const response = await api.get<Address>(`/user/addresses/${addressId}`);
    return response.data;
  },

  createAddress: async (data: CreateAddressRequest): Promise<Address> => {
    const response = await api.post<Address>('/user/addresses', data);
    return response.data;
  },

  updateAddress: async (data: UpdateAddressRequest): Promise<Address> => {
    const response = await api.put<Address>(`/user/addresses/${data.id}`, data);
    return response.data;
  },

  deleteAddress: async (addressId: string): Promise<void> => {
    await api.delete(`/user/addresses/${addressId}`);
  },

  setDefaultAddress: async (addressId: string): Promise<Address> => {
    const response = await api.post<Address>(`/user/addresses/${addressId}/set-default`);
    return response.data;
  },

  validateAddress: async (data: CreateAddressRequest): Promise<AddressValidation> => {
    const response = await api.post<AddressValidation>('/user/addresses/validate', data);
    return response.data;
  },

  // Saved Payment Methods
  getPaymentMethods: async (): Promise<SavedPaymentMethod[]> => {
    const response = await api.get<SavedPaymentMethod[]>('/user/payment-methods');
    return response.data;
  },

  addPaymentMethod: async (data: AddPaymentMethodRequest): Promise<SavedPaymentMethod> => {
    const response = await api.post<SavedPaymentMethod>('/user/payment-methods', data);
    return response.data;
  },

  deletePaymentMethod: async (paymentMethodId: string): Promise<void> => {
    await api.delete(`/user/payment-methods/${paymentMethodId}`);
  },

  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<SavedPaymentMethod> => {
    const response = await api.post<SavedPaymentMethod>(`/user/payment-methods/${paymentMethodId}/set-default`);
    return response.data;
  },

  // Preferences
  getPreferences: async (): Promise<UserPreferences> => {
    const response = await api.get<UserPreferences>('/user/preferences');
    return response.data;
  },

  updatePreferences: async (data: UpdatePreferencesRequest): Promise<UserPreferences> => {
    const response = await api.put<UserPreferences>('/user/preferences', data);
    return response.data;
  },

  // Wishlist
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await api.get<WishlistItem[]>('/user/wishlist');
    return response.data;
  },

  addToWishlist: async (data: AddToWishlistRequest): Promise<WishlistItem> => {
    const response = await api.post<WishlistItem>('/user/wishlist', data);
    return response.data;
  },

  removeFromWishlist: async (productId: string): Promise<void> => {
    await api.delete(`/user/wishlist/${productId}`);
  },

  updateWishlistItem: async (
    productId: string,
    data: { notifyOnPriceDrop?: boolean; notifyOnBackInStock?: boolean }
  ): Promise<WishlistItem> => {
    const response = await api.put<WishlistItem>(`/user/wishlist/${productId}`, data);
    return response.data;
  },

  clearWishlist: async (): Promise<void> => {
    await api.delete('/user/wishlist');
  },

  // Notifications
  getNotifications: async (params?: { page?: number; limit?: number; unreadOnly?: boolean }): Promise<{
    notifications: Notification[];
    totalCount: number;
    unreadCount: number;
  }> => {
    const response = await api.get<{
      notifications: Notification[];
      totalCount: number;
      unreadCount: number;
    }>('/user/notifications', params as Record<string, unknown>);
    return response.data;
  },

  markNotificationRead: async (notificationId: string): Promise<void> => {
    await api.post(`/user/notifications/${notificationId}/read`);
  },

  markAllNotificationsRead: async (): Promise<void> => {
    await api.post('/user/notifications/read-all');
  },

  deleteNotification: async (notificationId: string): Promise<void> => {
    await api.delete(`/user/notifications/${notificationId}`);
  },

  getUnreadNotificationCount: async (): Promise<{ count: number }> => {
    const response = await api.get<{ count: number }>('/user/notifications/unread-count');
    return response.data;
  },

  // Recent searches
  getRecentSearches: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/user/recent-searches');
    return response.data;
  },

  clearRecentSearches: async (): Promise<void> => {
    await api.delete('/user/recent-searches');
  },

  // Account deletion
  requestAccountDeletion: async (reason?: string): Promise<{ requestId: string; expiresAt: string }> => {
    const response = await api.post<{ requestId: string; expiresAt: string }>('/user/delete-account', { reason });
    return response.data;
  },

  cancelAccountDeletion: async (requestId: string): Promise<void> => {
    await api.delete(`/user/delete-account/${requestId}`);
  },
};

export default userService;
