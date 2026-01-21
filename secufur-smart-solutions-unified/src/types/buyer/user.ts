// User Types

export interface UserProfile {
  id: string;
  email: string;
  mobile?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

export interface Address {
  id: string;
  userId: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  alternatePhone?: string;
  houseFlat: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
  isValidated: boolean;
  validationMessage?: string;
  latitude?: number;
  longitude?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressRequest {
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  alternatePhone?: string;
  houseFlat: string;
  street: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault?: boolean;
}

export interface UpdateAddressRequest extends Partial<CreateAddressRequest> {
  id: string;
}

export interface AddressValidation {
  isValid: boolean;
  serviceable: boolean;
  errors: AddressValidationError[];
  suggestions?: AddressSuggestion[];
}

export interface AddressValidationError {
  field: string;
  message: string;
  code: 'invalid' | 'non_serviceable' | 'incomplete';
}

export interface AddressSuggestion {
  pincode: string;
  city: string;
  state: string;
}

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  isDefault: boolean;
  cardDetails?: SavedCard;
  upiDetails?: SavedUPI;
  walletDetails?: SavedWallet;
  createdAt: string;
}

export interface SavedCard {
  last4: string;
  brand: 'visa' | 'mastercard' | 'amex' | 'rupay' | 'other';
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  isExpired: boolean;
}

export interface SavedUPI {
  vpa: string;
  provider?: string;
}

export interface SavedWallet {
  walletName: string;
  linkedMobile?: string;
}

export interface AddPaymentMethodRequest {
  type: 'card' | 'upi';
  cardToken?: string;
  upiVpa?: string;
  isDefault?: boolean;
}

export interface UserPreferences {
  userId: string;
  notifications: NotificationPreferences;
  language: string;
  currency: string;
  theme?: 'light' | 'dark' | 'system';
  marketing: MarketingPreferences;
}

export interface NotificationPreferences {
  orderUpdates: NotificationChannel;
  deliveryUpdates: NotificationChannel;
  promotions: NotificationChannel;
  priceDrops: NotificationChannel;
  backInStock: NotificationChannel;
  recommendations: NotificationChannel;
}

export interface NotificationChannel {
  email: boolean;
  sms: boolean;
  push: boolean;
  whatsapp?: boolean;
}

export interface MarketingPreferences {
  emailNewsletter: boolean;
  smsOffers: boolean;
  personalizedAds: boolean;
}

export interface UpdatePreferencesRequest {
  notifications?: Partial<NotificationPreferences>;
  language?: string;
  currency?: string;
  marketing?: Partial<MarketingPreferences>;
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: import('./product').Product;
  addedAt: string;
  priceAtAdd: number;
  currentPrice: number;
  priceDropped: boolean;
  isInStock: boolean;
  notifyOnPriceDrop: boolean;
  notifyOnBackInStock: boolean;
}

export interface AddToWishlistRequest {
  productId: string;
  notifyOnPriceDrop?: boolean;
  notifyOnBackInStock?: boolean;
}

export interface CompareItem {
  productId: string;
  product: import('./product').Product;
  addedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
}

export type NotificationType =
  | 'order_update'
  | 'delivery_update'
  | 'payment_update'
  | 'refund_update'
  | 'promotion'
  | 'price_drop'
  | 'back_in_stock'
  | 'recommendation'
  | 'system';
