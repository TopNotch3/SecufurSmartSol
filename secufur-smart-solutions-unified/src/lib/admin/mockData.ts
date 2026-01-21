export const mockUsers = [
  {
    id: 'USR001',
    name: 'John Anderson',
    email: 'john.anderson@email.com',
    role: 'Customer',
    status: 'Active',
    createdAt: '2024-01-15',
    ordersCount: 12,
    totalSpent: 4560.00,
    lastActive: '2024-01-18'
  },
  {
    id: 'USR002',
    name: 'Sarah Mitchell',
    email: 'sarah.mitchell@email.com',
    role: 'Customer',
    status: 'Active',
    createdAt: '2024-01-10',
    ordersCount: 8,
    totalSpent: 2340.00,
    lastActive: '2024-01-19'
  },
  {
    id: 'USR003',
    name: 'Michael Brown',
    email: 'michael.brown@email.com',
    role: 'Customer',
    status: 'Blocked',
    createdAt: '2023-12-05',
    ordersCount: 3,
    totalSpent: 890.00,
    lastActive: '2024-01-10'
  },
  {
    id: 'USR004',
    name: 'Emily Davis',
    email: 'emily.davis@email.com',
    role: 'Customer',
    status: 'Active',
    createdAt: '2024-01-20',
    ordersCount: 15,
    totalSpent: 6780.00,
    lastActive: '2024-01-20'
  },
  {
    id: 'USR005',
    name: 'David Wilson',
    email: 'david.wilson@email.com',
    role: 'Customer',
    status: 'Active',
    createdAt: '2023-11-18',
    ordersCount: 22,
    totalSpent: 9870.00,
    lastActive: '2024-01-19'
  }
];

export const mockSellers = [
  {
    id: 'SEL001',
    name: 'TechGear Solutions',
    email: 'contact@techgear.com',
    productsCount: 145,
    verificationStatus: 'Verified',
    accountStatus: 'Active',
    totalSales: 125600.00,
    joinedDate: '2023-06-15',
    phone: '+1 234 567 8900',
    address: '123 Tech Street, Silicon Valley, CA 94025'
  },
  {
    id: 'SEL002',
    name: 'Fashion Forward Inc',
    email: 'hello@fashionforward.com',
    productsCount: 289,
    verificationStatus: 'Verified',
    accountStatus: 'Active',
    totalSales: 234500.00,
    joinedDate: '2023-05-22',
    phone: '+1 234 567 8901',
    address: '456 Fashion Ave, New York, NY 10001'
  },
  {
    id: 'SEL003',
    name: 'Home Essentials Co',
    email: 'support@homeessentials.com',
    productsCount: 67,
    verificationStatus: 'Pending',
    accountStatus: 'Active',
    totalSales: 45200.00,
    joinedDate: '2024-01-05',
    phone: '+1 234 567 8902',
    address: '789 Home Blvd, Chicago, IL 60601'
  },
  {
    id: 'SEL004',
    name: 'Sports Pro Store',
    email: 'info@sportspro.com',
    productsCount: 198,
    verificationStatus: 'Verified',
    accountStatus: 'Suspended',
    totalSales: 89400.00,
    joinedDate: '2023-08-10',
    phone: '+1 234 567 8903',
    address: '321 Sports Way, Miami, FL 33101'
  },
  {
    id: 'SEL005',
    name: 'Books & Beyond',
    email: 'contact@booksandbeyond.com',
    productsCount: 512,
    verificationStatus: 'Verified',
    accountStatus: 'Active',
    totalSales: 156700.00,
    joinedDate: '2023-04-18',
    phone: '+1 234 567 8904',
    address: '654 Library Lane, Boston, MA 02101'
  }
];

export const mockProducts = [
  {
    id: 'PRD001',
    name: 'Wireless Bluetooth Headphones',
    seller: 'TechGear Solutions',
    sellerId: 'SEL001',
    category: 'Electronics',
    price: 89.99,
    stock: 145,
    status: 'Active',
    description: 'High-quality wireless headphones with noise cancellation',
    sku: 'TG-WBH-001',
    weight: '0.5 kg',
    dimensions: '20 x 18 x 8 cm'
  },
  {
    id: 'PRD002',
    name: 'Leather Messenger Bag',
    seller: 'Fashion Forward Inc',
    sellerId: 'SEL002',
    category: 'Fashion',
    price: 129.99,
    stock: 67,
    status: 'Active',
    description: 'Premium leather messenger bag for professionals',
    sku: 'FF-LMB-002',
    weight: '1.2 kg',
    dimensions: '38 x 28 x 10 cm'
  },
  {
    id: 'PRD003',
    name: 'Smart Home Security Camera',
    seller: 'TechGear Solutions',
    sellerId: 'SEL001',
    category: 'Electronics',
    price: 199.99,
    stock: 89,
    status: 'Active',
    description: '1080p HD security camera with night vision',
    sku: 'TG-SHSC-003',
    weight: '0.3 kg',
    dimensions: '12 x 8 x 8 cm'
  },
  {
    id: 'PRD004',
    name: 'Ceramic Coffee Mug Set',
    seller: 'Home Essentials Co',
    sellerId: 'SEL003',
    category: 'Home & Kitchen',
    price: 34.99,
    stock: 234,
    status: 'Active',
    description: 'Set of 4 elegant ceramic coffee mugs',
    sku: 'HE-CCMS-004',
    weight: '1.5 kg',
    dimensions: '25 x 20 x 12 cm'
  },
  {
    id: 'PRD005',
    name: 'Running Shoes Pro',
    seller: 'Sports Pro Store',
    sellerId: 'SEL004',
    category: 'Sports',
    price: 159.99,
    stock: 0,
    status: 'Out of Stock',
    description: 'Professional running shoes with advanced cushioning',
    sku: 'SP-RSP-005',
    weight: '0.8 kg',
    dimensions: '32 x 20 x 12 cm'
  },
  {
    id: 'PRD006',
    name: 'Business Leadership Book',
    seller: 'Books & Beyond',
    sellerId: 'SEL005',
    category: 'Books',
    price: 24.99,
    stock: 456,
    status: 'Active',
    description: 'Bestselling book on modern business leadership',
    sku: 'BB-BLB-006',
    weight: '0.4 kg',
    dimensions: '23 x 15 x 3 cm'
  }
];

export const mockOrders = [
  {
    id: 'ORD001',
    customer: 'John Anderson',
    customerId: 'USR001',
    seller: 'TechGear Solutions',
    sellerId: 'SEL001',
    amount: 89.99,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2024-01-18',
    items: [
      { product: 'Wireless Bluetooth Headphones', quantity: 1, price: 89.99 }
    ]
  },
  {
    id: 'ORD002',
    customer: 'Sarah Mitchell',
    customerId: 'USR002',
    seller: 'Fashion Forward Inc',
    sellerId: 'SEL002',
    amount: 129.99,
    paymentStatus: 'Paid',
    orderStatus: 'Shipped',
    createdAt: '2024-01-19',
    items: [
      { product: 'Leather Messenger Bag', quantity: 1, price: 129.99 }
    ]
  },
  {
    id: 'ORD003',
    customer: 'Emily Davis',
    customerId: 'USR004',
    seller: 'TechGear Solutions',
    sellerId: 'SEL001',
    amount: 199.99,
    paymentStatus: 'Paid',
    orderStatus: 'Processing',
    createdAt: '2024-01-20',
    items: [
      { product: 'Smart Home Security Camera', quantity: 1, price: 199.99 }
    ]
  },
  {
    id: 'ORD004',
    customer: 'David Wilson',
    customerId: 'USR005',
    seller: 'Home Essentials Co',
    sellerId: 'SEL003',
    amount: 69.98,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2024-01-17',
    items: [
      { product: 'Ceramic Coffee Mug Set', quantity: 2, price: 34.99 }
    ]
  },
  {
    id: 'ORD005',
    customer: 'John Anderson',
    customerId: 'USR001',
    seller: 'Books & Beyond',
    sellerId: 'SEL005',
    amount: 74.97,
    paymentStatus: 'Paid',
    orderStatus: 'Delivered',
    createdAt: '2024-01-16',
    items: [
      { product: 'Business Leadership Book', quantity: 3, price: 24.99 }
    ]
  },
  {
    id: 'ORD006',
    customer: 'Sarah Mitchell',
    customerId: 'USR002',
    seller: 'Sports Pro Store',
    sellerId: 'SEL004',
    amount: 159.99,
    paymentStatus: 'Pending',
    orderStatus: 'Pending',
    createdAt: '2024-01-20',
    items: [
      { product: 'Running Shoes Pro', quantity: 1, price: 159.99 }
    ]
  }
];

export const mockPayments = [
  {
    id: 'PAY001',
    orderId: 'ORD001',
    customer: 'John Anderson',
    amount: 89.99,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    createdAt: '2024-01-18',
    transactionId: 'TXN8901234567'
  },
  {
    id: 'PAY002',
    orderId: 'ORD002',
    customer: 'Sarah Mitchell',
    amount: 129.99,
    paymentMethod: 'PayPal',
    status: 'Completed',
    createdAt: '2024-01-19',
    transactionId: 'TXN8901234568'
  },
  {
    id: 'PAY003',
    orderId: 'ORD003',
    customer: 'Emily Davis',
    amount: 199.99,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    createdAt: '2024-01-20',
    transactionId: 'TXN8901234569'
  },
  {
    id: 'PAY004',
    orderId: 'ORD004',
    customer: 'David Wilson',
    amount: 69.98,
    paymentMethod: 'Debit Card',
    status: 'Completed',
    createdAt: '2024-01-17',
    transactionId: 'TXN8901234570'
  },
  {
    id: 'PAY005',
    orderId: 'ORD005',
    customer: 'John Anderson',
    amount: 74.97,
    paymentMethod: 'Credit Card',
    status: 'Completed',
    createdAt: '2024-01-16',
    transactionId: 'TXN8901234571'
  },
  {
    id: 'PAY006',
    orderId: 'ORD006',
    customer: 'Sarah Mitchell',
    amount: 159.99,
    paymentMethod: 'Bank Transfer',
    status: 'Pending',
    createdAt: '2024-01-20',
    transactionId: 'TXN8901234572'
  }
];

export const mockActivities = [
  {
    id: 'ACT001',
    type: 'order',
    message: 'New order placed by John Anderson',
    timestamp: '2024-01-20 10:30:00'
  },
  {
    id: 'ACT002',
    type: 'user',
    message: 'New user registration: Emily Davis',
    timestamp: '2024-01-20 09:15:00'
  },
  {
    id: 'ACT003',
    type: 'seller',
    message: 'Seller verification approved: Home Essentials Co',
    timestamp: '2024-01-20 08:45:00'
  },
  {
    id: 'ACT004',
    type: 'product',
    message: 'Product added: Wireless Bluetooth Headphones',
    timestamp: '2024-01-19 16:20:00'
  },
  {
    id: 'ACT005',
    type: 'payment',
    message: 'Payment received for order ORD003',
    timestamp: '2024-01-19 14:10:00'
  }
];

export const mockRoles = [
  {
    id: 'ROLE001',
    name: 'Admin',
    description: 'Full system access',
    usersCount: 3,
    permissions: ['read', 'write', 'delete', 'manage_users', 'manage_sellers', 'manage_products', 'manage_orders', 'manage_payments', 'manage_settings']
  },
  {
    id: 'ROLE002',
    name: 'Seller',
    description: 'Manage own products and orders',
    usersCount: 45,
    permissions: ['read', 'write', 'manage_own_products', 'manage_own_orders']
  },
  {
    id: 'ROLE003',
    name: 'Customer',
    description: 'Browse and purchase products',
    usersCount: 1284,
    permissions: ['read', 'place_orders', 'manage_profile']
  }
];
