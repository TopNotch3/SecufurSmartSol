export type UserRole = 'Owner' | 'CatalogManager' | 'OrderManager' | 'Finance' | 'Support';

export interface SellerUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface DeliveryPartner {
  id: string;
  name: string;
  isEnabled: boolean;
  rating: number;
  baseRate: number;
  codSupported: boolean;
  expressSupported: boolean;
}

export type SellerStatus = 'Applied' | 'UnderReview' | 'Approved' | 'Live' | 'Suspended' | 'Rejected';

export interface SellerVerification {
  gstVerified: boolean;
  panVerified: boolean;
  bankVerified: boolean;
  addressVerified: boolean;
  documentsSubmitted: boolean;
  agreementAccepted: boolean;
  verificationDate?: string;
  rejectionReason?: string;
}

export interface SellerProfile {
  id: string;
  businessName: string;
  tradeName?: string; // New: Trade Name if different
  brandName: string;
  legalEntity: 'Individual' | 'Proprietorship' | 'Partnership' | 'Pvt Ltd' | 'LLP';
  constitutionDoc?: string; // New: Upload URL for Certificate of Info/Partnership Deed
  gstNumber: string;
  panNumber: string;
  cinNumber?: string;
  fssaiLicense?: string; // New: Industry specific
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  contactPerson: string;
  email: string;
  phone: string;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    ifsc: string;
    bankName: string;
    branchName?: string;
  };
  deliveryPreferences: DeliveryPartner[];
  status: SellerStatus;
  verification: SellerVerification;
  complianceAgreed: boolean;
  authenticityUndertaking: boolean; // New: Mandatory undertaking
  commissionRate: number;
  settlementCycle: 'Weekly' | 'Biweekly' | 'Monthly';
  users: SellerUser[];
  createdAt: string;
  approvedAt?: string;
}

export type ProductStatus = 'Draft' | 'Submitted' | 'UnderReview' | 'Approved' | 'Live' | 'Rejected' | 'Archived';

export interface ProductCompliance {
  hsnCode: string;
  taxSlab: number;
  certifications?: string[];
  complianceDocuments?: string[];
}

export interface ProductVariant {
  id: string;
  sku: string;
  attributes: Record<string, string>;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: 'Ceiling Fan' | 'Lithium Ion Battery';
  price: number;
  discountPrice?: number;
  stock: number;
  reservedStock: number;
  availableStock: number;
  status: ProductStatus;
  images: string[];
  description: string;
  tags: string[];
  compliance: ProductCompliance;
  variants?: ProductVariant[];

  // Legal Metrology & Compliance Fields
  manufacturerDetails?: {
    name: string;
    address: string;
    contact?: string;
  };
  countryOfOrigin?: string;
  manufacturingDate?: string;
  expiryDate?: string;

  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  minOrderQty: number;
  maxOrderQty: number;
  createdAt: string;
  submittedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
  isLocked: boolean;
  soldCount: number;
}

export type OrderStatus = 'Pending' | 'Accepted' | 'Processing' | 'Packed' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled' | 'RTO' | 'Returned';

export interface OrderItem {
  productId: string;
  sku: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
}

export interface OrderTimeline {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface ShippingDetails {
  provider: string;
  trackingNumber: string;
  labelUrl?: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
  rtoInitiated?: boolean;
  rtoReason?: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  items: OrderItem[];
  subtotal: number;
  gstTotal: number;
  shippingCharge: number;
  totalAmount: number;
  status: OrderStatus;
  shipping?: ShippingDetails;
  invoiceUrl?: string;
  paymentToken?: string;
  paymentMethod: 'Prepaid' | 'COD';
  timeline: OrderTimeline[];
  slaDeadlines: {
    acceptBy: string;
    dispatchBy: string;
  };
  isDelayed: boolean;
  penaltyApplied: number;
}

export type ReturnStatus = 'Requested' | 'Approved' | 'Rejected' | 'PickupScheduled' | 'PickedUp' | 'Received' | 'RefundProcessed' | 'Closed';

export interface ReturnRequest {
  id: string;
  orderId: string;
  orderItemId: string;
  productName: string;
  quantity: number;
  reason: string;
  reasonCode: 'Damaged' | 'WrongItem' | 'QualityIssue' | 'NotAsDescribed' | 'SizeIssue' | 'Other';
  customerImages?: string[];
  sellerResponse?: string;
  sellerEvidence?: string[];
  status: ReturnStatus;
  refundAmount: number;
  createdAt: string;
  resolvedAt?: string;
  timeline: { status: ReturnStatus; timestamp: string; note?: string }[];
}

export interface Dispute {
  id: string;
  returnId?: string;
  orderId: string;
  type: 'Return' | 'Refund' | 'Quality' | 'Delivery' | 'Other';
  description: string;
  customerEvidence?: string[];
  sellerEvidence?: string[];
  status: 'Open' | 'UnderReview' | 'ResolvedForCustomer' | 'ResolvedForSeller' | 'Escalated';
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Settlement {
  id: string;
  period: { from: string; to: string };
  grossAmount: number;
  platformFee: number;
  gstOnFee: number;
  penalties: number;
  adjustments: number;
  netAmount: number;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  scheduledDate: string;
  processedDate?: string;
  transactionId?: string;
  orders: string[];
}

export interface SellerPerformance {
  ordersReceived: number;
  ordersAccepted: number;
  ordersDelivered: number;
  ordersCancelled: number;
  cancellationRate: number;
  lateDispatchCount: number;
  lateDispatchRate: number;
  returnCount: number;
  returnRate: number;
  customerComplaints: number;
  slaViolations: number;
  rating: number;
  reviewCount: number;
  performanceScore: number;
  warnings: number;
  accountHealth: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'Order' | 'Payment' | 'Product' | 'Account' | 'Technical' | 'Policy' | 'Other';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Open' | 'InProgress' | 'AwaitingResponse' | 'Resolved' | 'Closed';
  messages: {
    id: string;
    sender: 'Seller' | 'Support';
    message: string;
    attachments?: string[];
    timestamp: string;
  }[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  category: 'Product' | 'Order' | 'Auth' | 'System' | 'Financial' | 'Settings' | 'Compliance';
  details: string;
  userId?: string;
  userName?: string;
  ipAddress?: string;
  severity: 'Info' | 'Warning' | 'Critical';
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'Urgent' | 'Inventory' | 'System' | 'Payment' | 'Order' | 'Compliance' | 'Performance';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  orderAlerts: boolean;
  inventoryAlerts: boolean;
  paymentAlerts: boolean;
  performanceAlerts: boolean;
  policyUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  twoFactorMethod?: 'SMS' | 'Email' | 'Authenticator';
  loginAlerts: boolean;
  trustedDevices: { id: string; name: string; lastUsed: string }[];
  passwordLastChanged: string;
  sessionTimeout: number;
}

export interface FinancialSummary {
  grossSales: number;
  netEarnings: number;
  commission: number;
  pendingPayout: number;
  lastPayout: number;
  lastPayoutDate?: string;
  payoutFrequency: 'Weekly' | 'Biweekly' | 'Monthly';
  totalPenalties: number;
  totalAdjustments: number;
  upcomingSettlement?: Settlement;
}

export interface PayoutSettings {
  minPayoutAmount: number;
  autoPayoutEnabled: boolean;
  payoutFrequency: 'Weekly' | 'Biweekly' | 'Monthly';
  preferredPayoutDay: string;
  holdPayouts: boolean;
  holdReason?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'Seller' | 'Buyer' | 'System';
  text: string;
  attachments?: string[];
  time: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  orderId?: string;
  subject?: string;
  messages: ChatMessage[];
  status: 'Active' | 'Resolved' | 'Closed';
  lastMessageTime: string;
  unreadCount: number;
}

// Role permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Owner: ['all'],
  CatalogManager: ['products', 'inventory'],
  OrderManager: ['orders', 'shipping', 'returns'],
  Finance: ['financials', 'settlements', 'invoices'],
  Support: ['support', 'tickets']
};
