import { api } from './api';
import { PaginatedResponse } from '@/types/buyer/common';
import {
  Order,
  OrderStatus,
  OrderListParams,
  CreateOrderRequest,
  CancelOrderRequest,
  ReturnOrderRequest,
  SchedulePickupRequest,
  CancellationEligibility,
  ReturnEligibility,
  OrderTracking,
  PaymentMethod,
} from '@/types/buyer/order';
import { TimeSlot } from '@/types/buyer/common';

interface OrderListResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  totalPages: number;
}

interface PaymentInitResponse {
  orderId: string;
  paymentUrl?: string;
  paymentData?: Record<string, unknown>;
  transactionId: string;
  method: PaymentMethod;
}

export const orderService = {
  // Get orders list
  getOrders: async (params?: OrderListParams): Promise<OrderListResponse> => {
    const response = await api.get<OrderListResponse>('/orders', params as Record<string, unknown>);
    return response.data;
  },

  // Get single order
  getOrderById: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getOrderByNumber: async (orderNumber: string): Promise<Order> => {
    const response = await api.get<Order>(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Create order
  createOrder: async (request: CreateOrderRequest): Promise<Order> => {
    const response = await api.post<Order>('/orders', request);
    return response.data;
  },

  // Initialize payment
  initializePayment: async (orderId: string, paymentMethod: PaymentMethod): Promise<PaymentInitResponse> => {
    const response = await api.post<PaymentInitResponse>(`/orders/${orderId}/payment/init`, {
      method: paymentMethod,
    });
    return response.data;
  },

  // Verify payment (callback from payment gateway)
  verifyPayment: async (
    orderId: string,
    paymentData: Record<string, unknown>
  ): Promise<{ success: boolean; order: Order; message?: string }> => {
    const response = await api.post<{ success: boolean; order: Order; message?: string }>(
      `/orders/${orderId}/payment/verify`,
      paymentData
    );
    return response.data;
  },

  // Retry payment
  retryPayment: async (orderId: string, paymentMethod?: PaymentMethod): Promise<PaymentInitResponse> => {
    const response = await api.post<PaymentInitResponse>(`/orders/${orderId}/payment/retry`, {
      method: paymentMethod,
    });
    return response.data;
  },

  // Get order tracking
  getOrderTracking: async (orderId: string): Promise<OrderTracking> => {
    const response = await api.get<OrderTracking>(`/orders/${orderId}/tracking`);
    return response.data;
  },

  // Get order invoice
  getOrderInvoice: async (orderId: string): Promise<{ url: string }> => {
    const response = await api.get<{ url: string }>(`/orders/${orderId}/invoice`);
    return response.data;
  },

  // Download invoice
  downloadInvoice: async (orderId: string): Promise<Blob> => {
    const response = await api.get<Blob>(`/orders/${orderId}/invoice/download`);
    return response.data;
  },

  // Check cancellation eligibility
  checkCancellationEligibility: async (orderId: string): Promise<CancellationEligibility> => {
    const response = await api.get<CancellationEligibility>(`/orders/${orderId}/cancellation-eligibility`);
    return response.data;
  },

  // Cancel order
  cancelOrder: async (request: CancelOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${request.orderId}/cancel`, {
      reason: request.reason,
      reasonDetails: request.reasonDetails,
    });
    return response.data;
  },

  // Check return eligibility
  checkReturnEligibility: async (orderId: string): Promise<ReturnEligibility> => {
    const response = await api.get<ReturnEligibility>(`/orders/${orderId}/return-eligibility`);
    return response.data;
  },

  // Request return
  requestReturn: async (request: ReturnOrderRequest): Promise<Order> => {
    const response = await api.post<Order>(`/orders/${request.orderId}/return`, {
      items: request.items,
      reason: request.reason,
      reasonDetails: request.reasonDetails,
    });
    return response.data;
  },

  // Get available pickup slots
  getPickupSlots: async (returnId: string, pincode: string): Promise<TimeSlot[]> => {
    const response = await api.get<TimeSlot[]>(`/orders/returns/${returnId}/pickup-slots`, { pincode });
    return response.data;
  },

  // Schedule pickup
  schedulePickup: async (request: SchedulePickupRequest): Promise<Order> => {
    const response = await api.post<Order>(`/orders/returns/${request.returnId}/schedule-pickup`, {
      date: request.date,
      timeSlotId: request.timeSlotId,
      addressId: request.addressId,
    });
    return response.data;
  },

  // Get refund status
  getRefundStatus: async (orderId: string): Promise<{
    status: string;
    amount: number;
    method: string;
    expectedBy: string;
    transactionId?: string;
  }> => {
    const response = await api.get<{
      status: string;
      amount: number;
      method: string;
      expectedBy: string;
      transactionId?: string;
    }>(`/orders/${orderId}/refund-status`);
    return response.data;
  },

  // Reorder (add all items from order to cart)
  reorder: async (orderId: string): Promise<{ success: boolean; cartItemsAdded: number; unavailableItems: string[] }> => {
    const response = await api.post<{ success: boolean; cartItemsAdded: number; unavailableItems: string[] }>(
      `/orders/${orderId}/reorder`
    );
    return response.data;
  },

  // Get order count by status
  getOrderCountByStatus: async (): Promise<Record<OrderStatus, number>> => {
    const response = await api.get<Record<OrderStatus, number>>('/orders/count-by-status');
    return response.data;
  },

  // Track order by number (guest tracking)
  trackOrderByNumber: async (orderNumber: string, email: string): Promise<{
    order: Order;
    tracking: OrderTracking;
  }> => {
    const response = await api.post<{ order: Order; tracking: OrderTracking }>('/orders/track', {
      orderNumber,
      email,
    });
    return response.data;
  },
};

export default orderService;
