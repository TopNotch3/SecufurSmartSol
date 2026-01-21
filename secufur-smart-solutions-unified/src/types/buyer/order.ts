// Order Types

import { Product, SelectedCustomization } from './product';
import { Address } from './user';

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'payment_confirmed'
  | 'order_accepted'
  | 'manufacturing_started'
  | 'manufacturing_completed'
  | 'packed'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'return_requested'
  | 'return_approved'
  | 'return_picked'
  | 'refund_initiated'
  | 'refunded'
  | 'delayed';

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'success'
  | 'failed'
  | 'cancelled'
  | 'refunded'
  | 'partially_refunded';

export type PaymentMethod =
  | 'upi'
  | 'credit_card'
  | 'debit_card'
  | 'net_banking'
  | 'wallet'
  | 'cod'
  | 'emi';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  customizationCost: number;
  taxAmount: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  currency: string;
  status: OrderStatus;
  statusHistory: OrderStatusHistory[];
  shippingAddress: Address;
  billingAddress?: Address;
  deliveryOption: OrderDeliveryOption;
  payment: OrderPayment;
  couponApplied?: OrderCoupon;
  deliveryInstructions?: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  tracking?: OrderTracking;
  invoice?: OrderInvoice;
  cancellation?: OrderCancellation;
  return?: OrderReturn;
  refund?: OrderRefund;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  customization?: SelectedCustomization;
  unitPrice: number;
  totalPrice: number;
  status: OrderItemStatus;
}

export type OrderItemStatus =
  | 'pending'
  | 'processing'
  | 'manufacturing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface OrderStatusHistory {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
  updatedBy?: string;
}

export interface OrderDeliveryOption {
  type: 'standard' | 'express' | 'custom';
  name: string;
  cost: number;
  estimatedDays: number;
}

export interface OrderPayment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: string;
  transactionId?: string;
  gatewayResponse?: string;
  paidAt?: string;
  cardLast4?: string;
  cardBrand?: string;
  upiId?: string;
  walletName?: string;
  bankName?: string;
  emiTenure?: number;
  emiMonthlyAmount?: number;
}

export interface OrderCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
}

export interface OrderTracking {
  trackingNumber: string;
  courierName: string;
  courierCode: string;
  trackingUrl: string;
  currentLocation?: string;
  lastUpdate: string;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  timestamp: string;
  status: string;
  description: string;
  location?: string;
}

export interface OrderInvoice {
  id: string;
  number: string;
  url: string;
  generatedAt: string;
}

export interface OrderCancellation {
  requestedAt: string;
  reason: string;
  reasonCategory: CancellationReason;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  refundInitiated: boolean;
}

export type CancellationReason =
  | 'changed_mind'
  | 'found_better_price'
  | 'ordered_by_mistake'
  | 'delivery_too_long'
  | 'payment_issue'
  | 'other';

export interface OrderReturn {
  id: string;
  requestedAt: string;
  reason: string;
  reasonCategory: ReturnReason;
  status: ReturnStatus;
  items: ReturnItem[];
  pickupScheduled?: PickupSchedule;
  pickupCompleted?: string;
  inspectionStatus?: 'pending' | 'approved' | 'rejected';
  inspectionNotes?: string;
  refundInitiated: boolean;
}

export type ReturnReason =
  | 'defective'
  | 'damaged_in_transit'
  | 'wrong_item'
  | 'not_as_described'
  | 'size_fit_issue'
  | 'quality_issue'
  | 'changed_mind'
  | 'other';

export type ReturnStatus =
  | 'requested'
  | 'approved'
  | 'rejected'
  | 'pickup_scheduled'
  | 'pickup_completed'
  | 'inspection_pending'
  | 'inspection_passed'
  | 'inspection_failed'
  | 'refund_processed';

export interface ReturnItem {
  orderItemId: string;
  quantity: number;
  reason: string;
  images?: string[];
}

export interface PickupSchedule {
  date: string;
  timeSlot: string;
  address: Address;
}

export interface OrderRefund {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
  method: 'original_payment' | 'bank_transfer' | 'store_credit';
  status: RefundStatus;
  initiatedAt: string;
  processedAt?: string;
  expectedBy: string;
  transactionId?: string;
  bankDetails?: BankDetails;
}

export type RefundStatus =
  | 'initiated'
  | 'processing'
  | 'completed'
  | 'failed';

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  deliveryOptionId: string;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  deliveryInstructions?: string;
  saveCard?: boolean;
}

export interface OrderListParams {
  page?: number;
  limit?: number;
  status?: OrderStatus[];
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface CancelOrderRequest {
  orderId: string;
  reason: CancellationReason;
  reasonDetails?: string;
}

export interface ReturnOrderRequest {
  orderId: string;
  items: ReturnItem[];
  reason: ReturnReason;
  reasonDetails?: string;
}

export interface SchedulePickupRequest {
  returnId: string;
  date: string;
  timeSlotId: string;
  addressId?: string;
}

// Eligibility checks
export interface CancellationEligibility {
  eligible: boolean;
  reason?: string;
  deadline?: string;
  refundAmount?: number;
  customProductRestriction?: boolean;
}

export interface ReturnEligibility {
  eligible: boolean;
  reason?: string;
  returnWindow: number;
  expiresAt?: string;
  eligibleItems: string[];
  ineligibleItems: { itemId: string; reason: string }[];
}
