import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  Product, Order, SellerProfile, Notification,
  AuditLog, FinancialSummary, OrderStatus, DeliveryPartner,
  ReturnRequest, Settlement, SellerPerformance, SupportTicket,
  ChatConversation, ChatMessage, NotificationPreferences, SecuritySettings,
  PayoutSettings, SellerStatus, ProductStatus, UserRole, SellerUser
} from '../../types/seller';

interface AppContextType {
  // Auth & Seller
  seller: SellerProfile | null;
  currentUser: SellerUser | null;
  isAuthenticated: boolean;

  // Core Data
  products: Product[];
  orders: Order[];
  notifications: Notification[];
  logs: AuditLog[];
  financials: FinancialSummary;

  // Extended Data
  returns: ReturnRequest[];
  settlements: Settlement[];
  performance: SellerPerformance;
  supportTickets: SupportTicket[];
  conversations: ChatConversation[];

  // Settings
  notificationPrefs: NotificationPreferences;
  securitySettings: SecuritySettings;
  payoutSettings: PayoutSettings;

  // Auth Actions
  registerSeller: (profile: Partial<SellerProfile>, password: string) => void;
  loginSeller: (email: string, password: string) => { success: boolean; error?: string };
  logoutSeller: () => void;

  // Seller Actions
  updateSellerProfile: (profile: Partial<SellerProfile>) => void;
  updateSellerStatus: (status: SellerStatus) => void;
  addSellerUser: (user: Omit<SellerUser, 'id' | 'createdAt'>) => void;
  updateSellerUser: (userId: string, updates: Partial<SellerUser>) => void;
  removeSellerUser: (userId: string) => void;

  // Product Actions
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Omit<Product, 'id' | 'status' | 'images' | 'tags' | 'createdAt' | 'reservedStock' | 'availableStock' | 'isLocked' | 'soldCount'>) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  submitProductForApproval: (productId: string) => void;
  approveProduct: (productId: string) => void;
  rejectProduct: (productId: string, reason: string) => void;
  adjustInventory: (productId: string, adjustment: number, reason: string) => void;

  // Order Actions
  simulateOrder: () => void;
  acceptOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  shipOrder: (orderId: string, provider: string, trackingNumber: string) => void;

  // Return Actions
  handleReturnRequest: (returnId: string, action: 'approve' | 'reject', response?: string, evidence?: string[]) => void;

  // Support Actions
  activeConversation: string | null;
  setActiveConversation: (id: string | null) => void;
  sendMessage: (conversationId: string, message: string) => void;
  createSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>) => void;

  // Settings Actions
  updateNotificationPrefs: (prefs: Partial<NotificationPreferences>) => void;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => void;
  updatePayoutSettings: (settings: Partial<PayoutSettings>) => void;
  updateBankDetails: (bankDetails: SellerProfile['bankDetails']) => void;

  // Utility Actions
  addLog: (action: string, category: AuditLog['category'], details: string, severity?: AuditLog['severity']) => void;
  markNotificationRead: (notificationId: string) => void;

  // Verification
  submitVerificationDocuments: (documents: any) => void;
  acceptAgreement: () => void;
}

const DEFAULT_PARTNERS: DeliveryPartner[] = [
  { id: 'DP-DEL', name: 'Delhivery', isEnabled: true, rating: 4.8, baseRate: 45, codSupported: true, expressSupported: true },
  { id: 'DP-BD', name: 'Blue Dart', isEnabled: true, rating: 4.9, baseRate: 65, codSupported: true, expressSupported: true },
  { id: 'DP-EC', name: 'Ecom Express', isEnabled: false, rating: 4.2, baseRate: 40, codSupported: true, expressSupported: false },
  { id: 'DP-XB', name: 'XpressBees', isEnabled: false, rating: 4.5, baseRate: 38, codSupported: true, expressSupported: true },
];

const DEFAULT_NOTIFICATION_PREFS: NotificationPreferences = {
  orderAlerts: true,
  inventoryAlerts: true,
  paymentAlerts: true,
  performanceAlerts: true,
  policyUpdates: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true
};

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  twoFactorEnabled: false,
  loginAlerts: true,
  trustedDevices: [],
  passwordLastChanged: new Date().toISOString(),
  sessionTimeout: 30
};

const DEFAULT_PAYOUT_SETTINGS: PayoutSettings = {
  minPayoutAmount: 1000,
  autoPayoutEnabled: true,
  payoutFrequency: 'Weekly',
  preferredPayoutDay: 'Wednesday',
  holdPayouts: false
};

const DEFAULT_PERFORMANCE: SellerPerformance = {
  ordersReceived: 0,
  ordersAccepted: 0,
  ordersDelivered: 0,
  ordersCancelled: 0,
  cancellationRate: 0,
  lateDispatchCount: 0,
  lateDispatchRate: 0,
  returnCount: 0,
  returnRate: 0,
  customerComplaints: 0,
  slaViolations: 0,
  rating: 4.5,
  reviewCount: 0,
  performanceScore: 100,
  warnings: 0,
  accountHealth: 'Excellent'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('luvarte_auth') === 'true';
  });

  const [seller, setSeller] = useState<SellerProfile | null>(() => {
    const saved = sessionStorage.getItem('luvarte_seller');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.deliveryPreferences) parsed.deliveryPreferences = DEFAULT_PARTNERS;
      if (!parsed.verification) parsed.verification = {
        gstVerified: false,
        panVerified: false,
        bankVerified: false,
        addressVerified: false,
        documentsSubmitted: false,
        agreementAccepted: false
      };
      return parsed;
    }
    return null;
  });

  const [currentUser, setCurrentUser] = useState<SellerUser | null>(() => {
    const saved = sessionStorage.getItem('luvarte_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Products with new categories
  const [products, setProducts] = useState<Product[]>([
    {
      id: 'SKU-8821',
      name: 'Industrial Ceiling Fan - 56 inch',
      sku: 'CF-IND-56',
      category: 'Ceiling Fan',
      price: 4999,
      stock: 25,
      reservedStock: 2,
      availableStock: 23,
      status: 'Live',
      images: ['https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=400&q=80'],
      description: 'High-performance industrial ceiling fan with copper winding motor.',
      tags: ['Industrial', 'Ceiling Fan', 'Heavy Duty'],
      compliance: {
        hsnCode: '84145110',
        taxSlab: 18,
        certifications: ['BIS', 'ISI']
      },
      weight: 8.5,
      dimensions: { length: 145, width: 145, height: 40 },
      minOrderQty: 1,
      maxOrderQty: 50,
      createdAt: '2024-01-15',
      approvedAt: '2024-01-16',
      isLocked: false,
      soldCount: 45
    },
    {
      id: 'SKU-1022',
      name: 'Lithium Ion Battery Pack - 48V 20Ah',
      sku: 'LIB-48V-20',
      category: 'Lithium Ion Battery',
      price: 18999,
      stock: 15,
      reservedStock: 1,
      availableStock: 14,
      status: 'Live',
      images: ['https://images.unsplash.com/photo-1619641805634-8c029da8b699?auto=format&fit=crop&w=400&q=80'],
      description: 'High-capacity lithium ion battery pack for e-vehicles.',
      tags: ['Battery', 'EV', 'Lithium'],
      compliance: {
        hsnCode: '85076000',
        taxSlab: 18,
        certifications: ['BIS', 'AIS-156']
      },
      weight: 12,
      dimensions: { length: 35, width: 20, height: 15 },
      minOrderQty: 1,
      maxOrderQty: 10,
      createdAt: '2024-02-01',
      approvedAt: '2024-02-03',
      isLocked: false,
      soldCount: 28
    }
  ]);

  // Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'LUV-928172',
      date: new Date().toLocaleDateString('en-IN'),
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh@email.com',
      customerPhone: '+91-98765-43210',
      shippingAddress: {
        line1: '123, Industrial Area',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411001'
      },
      items: [{
        productId: 'SKU-8821',
        sku: 'CF-IND-56',
        name: 'Industrial Ceiling Fan - 56 inch',
        quantity: 2,
        price: 4999,
        gstRate: 18,
        gstAmount: 1800,
        totalAmount: 11798
      }],
      subtotal: 9998,
      gstTotal: 1800,
      shippingCharge: 150,
      totalAmount: 11948,
      status: 'Pending',
      paymentToken: 'PG_LUV_X72B9',
      paymentMethod: 'Prepaid',
      timeline: [
        { status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed by customer' }
      ],
      slaDeadlines: {
        acceptBy: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        dispatchBy: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      },
      isDelayed: false,
      penaltyApplied: 0
    }
  ]);

  // Returns
  const [returns, setReturns] = useState<ReturnRequest[]>([
    {
      id: 'RET-001',
      orderId: 'LUV-928172',
      orderItemId: 'SKU-8821',
      productName: 'Industrial Ceiling Fan - 56 inch',
      quantity: 1,
      reason: 'Product received damaged - blade bent',
      reasonCode: 'Damaged',
      status: 'Requested',
      refundAmount: 4999,
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'Requested', timestamp: new Date().toISOString() }]
    }
  ]);

  // Settlements
  const [settlements, setSettlements] = useState<Settlement[]>([
    {
      id: 'SET-001',
      period: { from: '2024-01-01', to: '2024-01-07' },
      grossAmount: 45000,
      platformFee: 4500,
      gstOnFee: 810,
      penalties: 0,
      adjustments: 0,
      netAmount: 39690,
      status: 'Completed',
      scheduledDate: '2024-01-10',
      processedDate: '2024-01-10',
      transactionId: 'TXN-SET-001',
      orders: ['LUV-928172']
    }
  ]);

  // Performance
  const [performance, setPerformance] = useState<SellerPerformance>(DEFAULT_PERFORMANCE);

  // Support Tickets
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      subject: 'Settlement query for January',
      category: 'Payment',
      priority: 'Medium',
      status: 'Open',
      messages: [
        {
          id: 'MSG-001',
          sender: 'Seller',
          message: 'I have a query regarding the platform fee calculation for January settlement.',
          timestamp: new Date().toISOString()
        }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);

  // Chat Conversations
  const [conversations, setConversations] = useState<ChatConversation[]>([
    {
      id: 'CONV-001',
      customerId: 'CUST-001',
      customerName: 'Rajesh Kumar',
      orderId: 'LUV-928172',
      subject: 'Order Inquiry',
      messages: [
        { id: 'CM-001', sender: 'Buyer', text: 'Hello, I recently ordered ceiling fans (ORD-928172). I wanted to check if it has been dispatched yet?', time: '10:30 AM', read: true }
      ],
      status: 'Active',
      lastMessageTime: '10:30 AM',
      unreadCount: 1
    },
    {
      id: 'CONV-002',
      customerId: 'CUST-002',
      customerName: 'Sneha Patil',
      orderId: 'LUV-928180',
      subject: 'Product Query',
      messages: [
        { id: 'CM-002', sender: 'Buyer', text: 'Hi, I want to know the warranty period for the lithium battery pack.', time: '9:15 AM', read: false },
        { id: 'CM-003', sender: 'Seller', text: 'Hello! The warranty period is 2 years from the date of purchase.', time: '9:30 AM', read: true },
        { id: 'CM-004', sender: 'Buyer', text: 'Great, thanks! Does it cover any manufacturing defects?', time: 'Yesterday', read: false }
      ],
      status: 'Active',
      lastMessageTime: 'Yesterday',
      unreadCount: 1
    },
    {
      id: 'CONV-003',
      customerId: 'CUST-003',
      customerName: 'Amit Sharma',
      orderId: 'LUV-928195',
      subject: 'Delivery Issue',
      messages: [
        { id: 'CM-005', sender: 'Buyer', text: 'My order shows delivered but I haven\'t received it yet.', time: '2 days ago', read: true },
        { id: 'CM-006', sender: 'Seller', text: 'I apologize for the inconvenience. Let me check with our logistics partner.', time: '2 days ago', read: true }
      ],
      status: 'Active',
      lastMessageTime: '2 days ago',
      unreadCount: 0
    }
  ]);

  const [activeConversation, setActiveConversation] = useState<string | null>('CONV-001');

  // Logs
  const [logs, setLogs] = useState<AuditLog[]>([]);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N-SECURE',
      title: 'Protocol Active',
      message: 'SSL/TLS and PII masking protocols are active for this session.',
      type: 'System',
      timestamp: 'Just now',
      read: false
    },
    {
      id: 'N-ORDER',
      title: 'New Order Received',
      message: 'Order #LUV-928172 received. Accept within 4 hours to avoid SLA violation.',
      type: 'Order',
      timestamp: '5 mins ago',
      read: false
    }
  ]);

  // Settings
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(DEFAULT_NOTIFICATION_PREFS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS);
  const [payoutSettings, setPayoutSettings] = useState<PayoutSettings>(DEFAULT_PAYOUT_SETTINGS);

  // Add Log Function
  const addLog = useCallback((action: string, category: AuditLog['category'], details: string, severity: AuditLog['severity'] = 'Info') => {
    const maskedDetails = details
      .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '***@***.com')
      .replace(/(\+91[\-\s]?)?[0-9]{10}/g, '+91-XXXXX-XXXXX')
      .replace(/[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/g, 'XX-GSTIN-XX');

    const newLog: AuditLog = {
      id: `LOG-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      action,
      category,
      details: maskedDetails,
      userId: currentUser?.id,
      userName: currentUser?.name,
      ipAddress: '103.22.201.1',
      severity
    };
    setLogs(prev => [newLog, ...prev]);
  }, [currentUser]);

  // Auth Actions
  const registerSeller = useCallback((profile: Partial<SellerProfile>, password: string) => {
    const ownerUser: SellerUser = {
      id: `USER-${Date.now()}`,
      name: profile.contactPerson || 'Owner',
      email: profile.email || '',
      role: 'Owner',
      isActive: true,
      createdAt: new Date().toISOString()
    };

    const enrichedProfile: SellerProfile = {
      id: `SELLER-${Date.now()}`,
      businessName: profile.businessName || '',
      brandName: profile.brandName || profile.businessName || '',
      legalEntity: profile.legalEntity || 'Pvt Ltd',
      gstNumber: profile.gstNumber || '',
      panNumber: profile.panNumber || '',
      address: profile.address || { line1: '', city: '', state: '', pincode: '' },
      contactPerson: profile.contactPerson || '',
      email: profile.email || '',
      phone: profile.phone || '',
      bankDetails: profile.bankDetails || { accountName: '', accountNumber: '', ifsc: '', bankName: '' },
      deliveryPreferences: DEFAULT_PARTNERS,
      status: 'Applied',
      verification: {
        gstVerified: false,
        panVerified: false,
        bankVerified: false,
        addressVerified: false,
        documentsSubmitted: false,
        agreementAccepted: false
      },
      complianceAgreed: false,
      commissionRate: 10,
      settlementCycle: 'Weekly',
      users: [ownerUser],
      createdAt: new Date().toISOString()
    };

    setSeller(enrichedProfile);
    setCurrentUser(ownerUser);
    sessionStorage.setItem('luvarte_seller', JSON.stringify(enrichedProfile));
    sessionStorage.setItem('luvarte_current_user', JSON.stringify(ownerUser));
    sessionStorage.setItem('luvarte_password', password);
    setIsAuthenticated(true);
    sessionStorage.setItem('luvarte_auth', 'true');
    addLog('Account Registration', 'Auth', `New merchant ${enrichedProfile.businessName} registered.`);
  }, [addLog]);

  const loginSeller = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const savedSeller = sessionStorage.getItem('luvarte_seller');
    const savedPassword = sessionStorage.getItem('luvarte_password');

    if (savedSeller) {
      const parsed = JSON.parse(savedSeller);
      if (parsed.email === email && savedPassword === password) {
        setSeller(parsed);
        const user = parsed.users?.[0] || { id: 'default', name: parsed.contactPerson, email: parsed.email, role: 'Owner', isActive: true };
        setCurrentUser(user);
        sessionStorage.setItem('luvarte_current_user', JSON.stringify(user));
        setIsAuthenticated(true);
        sessionStorage.setItem('luvarte_auth', 'true');
        addLog('Login Success', 'Auth', `User ${email} logged in successfully.`);
        return { success: true };
      }
    }

    // Demo login
    if (email === 'admin@luvarte.in' && password === 'admin123') {
      const demoSeller: SellerProfile = {
        id: 'SELLER-DEMO',
        businessName: 'Luvarte Electronics Pvt Ltd',
        brandName: 'Luvarte',
        legalEntity: 'Pvt Ltd',
        gstNumber: '27AABCL1234F1Z5',
        panNumber: 'AABCL1234F',
        address: { line1: '123 Industrial Area', city: 'Pune', state: 'Maharashtra', pincode: '411001' },
        contactPerson: 'Admin User',
        email: 'admin@luvarte.in',
        phone: '+91-98765-43210',
        bankDetails: { accountName: 'Luvarte Electronics Pvt Ltd', accountNumber: '1234567890', ifsc: 'HDFC0001234', bankName: 'HDFC Bank' },
        deliveryPreferences: DEFAULT_PARTNERS,
        status: 'Live',
        verification: {
          gstVerified: true,
          panVerified: true,
          bankVerified: true,
          addressVerified: true,
          documentsSubmitted: true,
          agreementAccepted: true,
          verificationDate: '2024-01-01'
        },
        complianceAgreed: true,
        commissionRate: 10,
        settlementCycle: 'Weekly',
        users: [{ id: 'USER-DEMO', name: 'Admin User', email: 'admin@luvarte.in', role: 'Owner', isActive: true, createdAt: '2024-01-01' }],
        createdAt: '2024-01-01',
        approvedAt: '2024-01-01'
      };

      setSeller(demoSeller);
      setCurrentUser(demoSeller.users[0]);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(demoSeller));
      sessionStorage.setItem('luvarte_current_user', JSON.stringify(demoSeller.users[0]));
      sessionStorage.setItem('luvarte_password', password);
      setIsAuthenticated(true);
      sessionStorage.setItem('luvarte_auth', 'true');
      addLog('Login Success', 'Auth', `Demo user logged in.`);
      return { success: true };
    }

    return { success: false, error: 'Invalid email or password.' };
  }, [addLog]);

  const logoutSeller = useCallback(() => {
    addLog('Logout', 'Auth', 'User logged out.');
    setIsAuthenticated(false);
    sessionStorage.removeItem('luvarte_auth');
  }, [addLog]);

  // Seller Actions
  const updateSellerProfile = useCallback((updates: Partial<SellerProfile>) => {
    if (seller) {
      const updated = { ...seller, ...updates };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('Profile Updated', 'Settings', 'Seller profile information updated.');
    }
  }, [seller, addLog]);

  const updateSellerStatus = useCallback((status: SellerStatus) => {
    if (seller) {
      const updated = { ...seller, status };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('Status Change', 'Compliance', `Seller status changed to ${status}.`, status === 'Suspended' ? 'Critical' : 'Info');
    }
  }, [seller, addLog]);

  const addSellerUser = useCallback((user: Omit<SellerUser, 'id' | 'createdAt'>) => {
    if (seller) {
      const newUser: SellerUser = {
        ...user,
        id: `USER-${Date.now()}`,
        createdAt: new Date().toISOString()
      };
      const updated = { ...seller, users: [...seller.users, newUser] };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('User Added', 'Settings', `New team member ${user.name} added with role ${user.role}.`);
    }
  }, [seller, addLog]);

  const updateSellerUser = useCallback((userId: string, updates: Partial<SellerUser>) => {
    if (seller) {
      const updated = {
        ...seller,
        users: seller.users.map((u: SellerUser) => u.id === userId ? { ...u, ...updates } : u)
      };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('User Updated', 'Settings', `Team member information updated.`);
    }
  }, [seller, addLog]);

  const removeSellerUser = useCallback((userId: string) => {
    if (seller) {
      const updated = {
        ...seller,
        users: seller.users.filter((u: SellerUser) => u.id !== userId)
      };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('User Removed', 'Settings', `Team member removed.`);
    }
  }, [seller, addLog]);

  // Product Actions
  const addProduct = useCallback((p: any) => {
    const newProduct: Product = {
      ...p,
      id: `SKU-${Math.floor(Math.random() * 90000) + 10000}`,
      status: 'Draft',
      images: [`https://picsum.photos/400/500?random=${Math.random()}`],
      tags: [p.category],
      reservedStock: 0,
      availableStock: p.stock,
      createdAt: new Date().toISOString(),
      isLocked: false,
      soldCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    addLog('Product Created', 'Product', `New product ${p.name} (${newProduct.id}) created as draft.`);
  }, [addLog]);

  const updateProduct = useCallback((productId: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        if (p.isLocked && updates.sku) {
          return p; // Prevent SKU change on locked products
        }
        return { ...p, ...updates };
      }
      return p;
    }));
    addLog('Product Updated', 'Product', `Product ${productId} updated.`);
  }, [addLog]);

  const submitProductForApproval = useCallback((productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, status: 'Submitted' as ProductStatus, submittedAt: new Date().toISOString() } : p
    ));
    addLog('Product Submitted', 'Product', `Product ${productId} submitted for approval.`);
  }, [addLog]);

  const approveProduct = useCallback((productId: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, status: 'Live' as ProductStatus, approvedAt: new Date().toISOString() } : p
    ));
    addLog('Product Approved', 'Product', `Product ${productId} approved and now live.`);
  }, [addLog]);

  const rejectProduct = useCallback((productId: string, reason: string) => {
    setProducts(prev => prev.map(p =>
      p.id === productId ? { ...p, status: 'Rejected' as ProductStatus, rejectionReason: reason } : p
    ));
    addLog('Product Rejected', 'Product', `Product ${productId} rejected: ${reason}.`, 'Warning');
  }, [addLog]);

  const adjustInventory = useCallback((productId: string, adjustment: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newStock = Math.max(0, p.stock + adjustment);
        return { ...p, stock: newStock, availableStock: newStock - p.reservedStock };
      }
      return p;
    }));
    addLog('Inventory Adjusted', 'Product', `Product ${productId} stock adjusted by ${adjustment}. Reason: ${reason}`);
  }, [addLog]);

  // Order Actions
  const simulateOrder = useCallback(() => {
    const names = ['Vikram Seth', 'Ananya Iyer', 'Rohan Mehta', 'Zoya Khan', 'Amit Shah'];
    const idx = Math.floor(Math.random() * names.length);
    const product = products[Math.floor(Math.random() * products.length)];
    const qty = Math.floor(Math.random() * 3) + 1;
    const gstAmount = Math.round(product.price * qty * (product.compliance.taxSlab / 100));

    const newOrder: Order = {
      id: `LUV-${Math.floor(Math.random() * 900000) + 100000}`,
      date: new Date().toLocaleDateString('en-IN'),
      customerName: names[idx],
      customerEmail: `${names[idx].toLowerCase().replace(' ', '.')}@email.com`,
      customerPhone: `+91-${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      shippingAddress: {
        line1: `${Math.floor(Math.random() * 500)}, Sample Street`,
        city: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'][Math.floor(Math.random() * 5)],
        state: 'Maharashtra',
        pincode: `${Math.floor(Math.random() * 90000) + 100000}`
      },
      items: [{
        productId: product.id,
        sku: product.sku,
        name: product.name,
        quantity: qty,
        price: product.price,
        gstRate: product.compliance.taxSlab,
        gstAmount: gstAmount,
        totalAmount: product.price * qty + gstAmount
      }],
      subtotal: product.price * qty,
      gstTotal: gstAmount,
      shippingCharge: 150,
      totalAmount: product.price * qty + gstAmount + 150,
      status: 'Pending',
      paymentToken: `PG_LUV_${Math.random().toString(36).substring(7).toUpperCase()}`,
      paymentMethod: Math.random() > 0.5 ? 'Prepaid' : 'COD',
      timeline: [{ status: 'Pending', timestamp: new Date().toISOString(), note: 'Order placed by customer' }],
      slaDeadlines: {
        acceptBy: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
        dispatchBy: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      },
      isDelayed: false,
      penaltyApplied: 0
    };

    setOrders(prev => [newOrder, ...prev]);
    setNotifications(prev => [{
      id: `N-ORD-${Date.now()}`,
      title: 'New Order Received',
      message: `Order #${newOrder.id} received from ${names[idx]}. Accept within 4 hours.`,
      type: 'Order',
      timestamp: 'Just now',
      read: false
    }, ...prev]);

    // Reserve stock
    setProducts(prev => prev.map(p => {
      if (p.id === product.id) {
        return { ...p, reservedStock: p.reservedStock + qty, availableStock: p.availableStock - qty };
      }
      return p;
    }));

    addLog('Order Received', 'Order', `New order ${newOrder.id} received.`);
  }, [products, addLog]);

  const acceptOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Accepted' as OrderStatus,
          timeline: [...o.timeline, { status: 'Accepted' as OrderStatus, timestamp: new Date().toISOString(), note: 'Order accepted by seller' }]
        };
      }
      return o;
    }));
    addLog('Order Accepted', 'Order', `Order ${orderId} accepted.`);
  }, [addLog]);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updated = {
          ...o,
          status,
          timeline: [...o.timeline, { status, timestamp: new Date().toISOString(), note }]
        };

        if (status === 'Delivered') {
          o.items.forEach((item: any) => {
            setProducts(p => p.map(prod => {
              if (prod.id === item.productId) {
                return {
                  ...prod,
                  isLocked: true,
                  soldCount: prod.soldCount + item.quantity,
                  reservedStock: prod.reservedStock - item.quantity,
                  stock: prod.stock - item.quantity
                };
              }
              return prod;
            }));
          });
        }

        return updated;
      }
      return o;
    }));
    addLog('Order Status Updated', 'Order', `Order ${orderId} status changed to ${status}.`);
  }, [addLog]);

  const shipOrder = useCallback((orderId: string, provider: string, trackingNumber: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'Shipped' as OrderStatus,
          shipping: {
            provider,
            trackingNumber,
            estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          timeline: [...o.timeline, { status: 'Shipped' as OrderStatus, timestamp: new Date().toISOString(), note: `Shipped via ${provider}` }]
        };
      }
      return o;
    }));
    addLog('Order Shipped', 'Order', `Order ${orderId} shipped via ${provider}. Tracking: ${trackingNumber}`);
  }, [addLog]);

  // Return Actions
  const handleReturnRequest = useCallback((returnId: string, action: 'approve' | 'reject', response?: string, evidence?: string[]) => {
    setReturns(prev => prev.map(r => {
      if (r.id === returnId) {
        const newStatus = action === 'approve' ? 'Approved' : 'Rejected';
        return {
          ...r,
          status: newStatus as any,
          sellerResponse: response,
          sellerEvidence: evidence,
          timeline: [...r.timeline, { status: newStatus as any, timestamp: new Date().toISOString(), note: response }]
        };
      }
      return r;
    }));
    addLog('Return Handled', 'Order', `Return ${returnId} ${action}ed.`);
  }, [addLog]);

  // Support Actions
  const sendMessage = useCallback((conversationId: string, message: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const newMsg: ChatMessage = {
          id: `CM-${Date.now()}`,
          sender: 'Seller',
          text: message,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
          read: true
        };
        return {
          ...c,
          messages: [...c.messages, newMsg],
          lastMessageTime: newMsg.time
        };
      }
      return c;
    }));
    addLog('Message Sent', 'System', `Message sent in conversation ${conversationId}.`);

    // Simulate reply after 2 seconds
    setTimeout(() => {
      setConversations(prev => prev.map(c => {
        if (c.id === conversationId) {
          const replyMsg: ChatMessage = {
            id: `CM-${Date.now()}`,
            sender: 'Buyer',
            text: "Thanks for the quick response! I appreciate your help.",
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            read: false
          };
          return {
            ...c,
            messages: [...c.messages, replyMsg],
            lastMessageTime: replyMsg.time,
            unreadCount: c.unreadCount + 1
          };
        }
        return c;
      }));
    }, 2000);
  }, [addLog]);

  const createSupportTicket = useCallback((ticket: Omit<SupportTicket, 'id' | 'status' | 'messages' | 'createdAt' | 'updatedAt'>) => {
    const newTicket: SupportTicket = {
      ...ticket,
      id: `TKT-${Date.now()}`,
      status: 'Open',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setSupportTickets(prev => [newTicket, ...prev]);
    addLog('Ticket Created', 'System', `Support ticket ${newTicket.id} created.`);
  }, [addLog]);

  // Settings Actions
  const updateNotificationPrefs = useCallback((prefs: Partial<NotificationPreferences>) => {
    setNotificationPrefs((prev: NotificationPreferences) => ({ ...prev, ...prefs }));
    addLog('Settings Updated', 'Settings', 'Notification preferences updated.');
  }, [addLog]);

  const updateSecuritySettings = useCallback((settings: Partial<SecuritySettings>) => {
    setSecuritySettings((prev: SecuritySettings) => ({ ...prev, ...settings }));
    addLog('Security Settings Updated', 'Settings', 'Security settings updated.', settings.twoFactorEnabled ? 'Info' : 'Warning');
  }, [addLog]);

  const updatePayoutSettings = useCallback((settings: Partial<PayoutSettings>) => {
    setPayoutSettings((prev: PayoutSettings) => ({ ...prev, ...settings }));
    addLog('Payout Settings Updated', 'Financial', 'Payout settings updated.');
  }, [addLog]);

  const updateBankDetails = useCallback((bankDetails: SellerProfile['bankDetails']) => {
    if (seller) {
      const updated = {
        ...seller,
        bankDetails,
        verification: { ...seller.verification, bankVerified: false }
      };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('Bank Details Updated', 'Financial', 'Bank account details updated. Re-verification required.', 'Warning');
    }
  }, [seller, addLog]);

  // Verification Actions
  const submitVerificationDocuments = useCallback((documents: any) => {
    if (seller) {
      const updated = {
        ...seller,
        status: 'UnderReview' as SellerStatus,
        verification: { ...seller.verification, documentsSubmitted: true }
      };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('Documents Submitted', 'Compliance', 'Verification documents submitted for review.');
    }
  }, [seller, addLog]);

  const acceptAgreement = useCallback(() => {
    if (seller) {
      const updated = {
        ...seller,
        complianceAgreed: true,
        verification: { ...seller.verification, agreementAccepted: true }
      };
      setSeller(updated);
      sessionStorage.setItem('luvarte_seller', JSON.stringify(updated));
      addLog('Agreement Accepted', 'Compliance', 'Seller agreement accepted.');
    }
  }, [seller, addLog]);

  // Utility Actions
  const markNotificationRead = useCallback((notificationId: string) => {
    setNotifications((prev: Notification[]) => prev.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  // Calculate financials
  const grossSales = orders.filter(o => o.status === 'Delivered').reduce((acc, o) => acc + o.totalAmount, 0);
  const financials: FinancialSummary = {
    grossSales,
    commission: grossSales * (seller?.commissionRate || 10) / 100,
    netEarnings: grossSales * (1 - (seller?.commissionRate || 10) / 100),
    pendingPayout: grossSales * (1 - (seller?.commissionRate || 10) / 100),
    lastPayout: 39690,
    lastPayoutDate: '2024-01-10',
    payoutFrequency: payoutSettings.payoutFrequency,
    totalPenalties: orders.reduce((acc, o) => acc + o.penaltyApplied, 0),
    totalAdjustments: 0,
    upcomingSettlement: settlements[0]
  };

  // Update performance metrics
  useEffect(() => {
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const cancelled = orders.filter(o => o.status === 'Cancelled').length;
    const total = orders.length;

    setPerformance((prev: SellerPerformance) => ({
      ...prev,
      ordersReceived: total,
      ordersDelivered: delivered,
      ordersCancelled: cancelled,
      cancellationRate: total > 0 ? (cancelled / total) * 100 : 0,
      returnCount: returns.length,
      returnRate: delivered > 0 ? (returns.length / delivered) * 100 : 0
    }));
  }, [orders, returns]);

  return (
    <AppContext.Provider value={{
      seller,
      currentUser,
      isAuthenticated,
      products,
      orders,
      notifications,
      logs,
      financials,
      returns,
      settlements,
      performance,
      supportTickets,
      conversations,
      notificationPrefs,
      securitySettings,
      payoutSettings,
      registerSeller,
      loginSeller,
      logoutSeller,
      updateSellerProfile,
      updateSellerStatus,
      addSellerUser,
      updateSellerUser,
      removeSellerUser,
      setProducts,
      addProduct,
      updateProduct,
      submitProductForApproval,
      approveProduct,
      rejectProduct,
      adjustInventory,
      simulateOrder,
      acceptOrder,
      updateOrderStatus,
      shipOrder,
      handleReturnRequest,
      activeConversation,
      setActiveConversation,
      sendMessage,
      createSupportTicket,
      updateNotificationPrefs,
      updateSecuritySettings,
      updatePayoutSettings,
      updateBankDetails,
      addLog,
      markNotificationRead,
      submitVerificationDocuments,
      acceptAgreement
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
