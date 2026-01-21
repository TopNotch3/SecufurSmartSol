// Cart Types

import { Product, SelectedCustomization } from './product';

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  customization?: SelectedCustomization;
  unitPrice: number;
  totalPrice: number;
  addedAt: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  customizationCost: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  currency: string;
  appliedCoupon?: AppliedCoupon;
  deliveryPincode?: string;
  deliveryAvailable?: boolean;
  deliveryOptions?: DeliveryOption[];
  savedForLater: SavedItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  minOrderValue?: number;
  maxDiscount?: number;
  description: string;
}

export interface DeliveryOption {
  id: string;
  name: string;
  type: 'standard' | 'express' | 'custom';
  days: number;
  cost: number;
  estimatedDate: string;
  available: boolean;
  unavailableReason?: string;
}

export interface SavedItem {
  id: string;
  productId: string;
  product: Product;
  customization?: SelectedCustomization;
  savedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
  customization?: SelectedCustomization;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface RemoveCartItemRequest {
  itemId: string;
}

export interface ApplyCouponRequest {
  code: string;
}

export interface PincodeCheckRequest {
  pincode: string;
}

export interface PincodeCheckResponse {
  pincode: string;
  serviceable: boolean;
  city?: string;
  state?: string;
  deliveryOptions?: DeliveryOption[];
  estimatedDelivery?: {
    standard: string;
    express?: string;
  };
  reason?: string;
}

export interface CartSummary {
  subtotal: number;
  customizationCost: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  currency: string;
  breakdown: CartBreakdownItem[];
}

export interface CartBreakdownItem {
  label: string;
  amount: number;
  type: 'addition' | 'deduction' | 'total';
}

export interface CartValidation {
  isValid: boolean;
  errors: CartValidationError[];
  warnings: CartValidationWarning[];
}

export interface CartValidationError {
  type: 'out_of_stock' | 'price_changed' | 'invalid_customization' | 'delivery_unavailable' | 'min_order' | 'max_quantity';
  itemId?: string;
  message: string;
  productName?: string;
  oldPrice?: number;
  newPrice?: number;
}

export interface CartValidationWarning {
  type: 'low_stock' | 'price_drop' | 'delivery_delay';
  itemId?: string;
  message: string;
}

export interface MoveToCartRequest {
  savedItemId: string;
}

export interface SaveForLaterRequest {
  itemId: string;
}
