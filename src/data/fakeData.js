// Realistic fake data for office equipment dealer customer portal (demo only)

export const dealer = {
  name: 'Summit Office Solutions',
  logoText: 'Summit',
  tagline: 'Office Equipment & Solutions',
  billingEmail: 'billing@summitoffice.com',
  billingPhone: '(555) 555-0184',
};

export const customer = {
  name: 'Sarah Chen',
  company: 'Brightstone Law Group',
  accountId: 'BSG-2847',
  billingEmail: 'billing@brightstonelaw.com',
  email: 'sarah.chen@brightstonelaw.com',
  phone: '(555) 555-0123',
};

export const notifications = [
  {
    id: '1',
    type: 'invoice',
    title: 'Invoice #84219 Due in 3 Days',
    message: 'Canon ImageRunner Copier Lease – $487.00 due Mar 12',
    time: '2 hours ago',
    read: true,
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment of $2,840.12 Successfully Processed',
    message: 'Paid via ACH •••• 1187',
    time: 'Yesterday',
    read: true,
  },
  {
    id: '3',
    type: 'invoice',
    title: 'New Invoice Available',
    message: 'Service Invoice – Copier Maintenance #84222',
    time: 'Mar 7',
    read: true,
  },
  {
    id: '4',
    type: 'service',
    title: 'Service Ticket Updated',
    message: 'Ticket #ST-9012 – Technician scheduled for Mar 10',
    time: 'Mar 6',
    read: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'AutoPay Payment Processed',
    message: '$1,240.00 for Invoice #84215',
    time: 'Mar 5',
    read: true,
  },
];

export const invoices = [
  {
    id: 'inv-84219',
    number: '84219',
    description: 'Canon ImageRunner Copier Lease',
    dueDate: '2025-03-12',
    amount: 487.0,
    status: 'due_soon',
    lineItems: [
      { description: 'Canon ImageRunner C3525i – Monthly lease', quantity: 1, unitPrice: 387.0, amount: 387.0 },
      { description: 'Maintenance bundle', quantity: 1, unitPrice: 100.0, amount: 100.0 },
    ],
    date: '2025-03-01',
  },
  {
    id: 'inv-84220',
    number: '84220',
    description: 'Service Invoice – Copier Maintenance',
    dueDate: '2025-03-08',
    amount: 325.5,
    status: 'overdue',
    lineItems: [
      { description: 'Preventive maintenance – 3 devices', quantity: 1, unitPrice: 275.0, amount: 275.0 },
      { description: 'Parts & labor', quantity: 1, unitPrice: 50.5, amount: 50.5 },
    ],
    date: '2025-02-28',
  },
  {
    id: 'inv-84221',
    number: '84221',
    description: 'Toner Supply Order',
    dueDate: '2025-03-15',
    amount: 892.0,
    status: 'due_soon',
    lineItems: [
      { description: 'Canon Genuine Toner – Black (x4)', quantity: 4, unitPrice: 148.0, amount: 592.0 },
      { description: 'Canon Genuine Toner – Cyan (x2)', quantity: 2, unitPrice: 150.0, amount: 300.0 },
    ],
    date: '2025-03-05',
  },
  {
    id: 'inv-84222',
    number: '84222',
    description: 'Monthly Maintenance Contract',
    dueDate: '2025-03-20',
    amount: 1240.0,
    status: 'current',
    lineItems: [
      { description: 'Full-service maintenance agreement – Mar 2025', quantity: 1, unitPrice: 1240.0, amount: 1240.0 },
    ],
    date: '2025-03-01',
  },
];

export const recentPayments = [
  { id: 'pmt-1', date: '2025-03-08', description: 'Invoice #84220 – Service Invoice', amount: 325.5, method: 'ACH •••• 1187' },
  { id: 'pmt-2', date: '2025-03-05', description: 'Invoice #84215 – Monthly Maintenance', amount: 1240.0, method: 'AutoPay • ACH •••• 1187' },
  { id: 'pmt-3', date: '2025-02-28', description: 'Invoice #84218 – Toner Supply', amount: 892.0, method: 'Visa •••• 4242' },
  { id: 'pmt-4', date: '2025-02-15', description: 'Invoice #84217 – Copier Lease', amount: 487.0, method: 'ACH •••• 1187' },
  { id: 'pmt-5', date: '2025-02-01', description: 'Invoice #84216 – Service Invoice', amount: 275.0, method: 'AutoPay • ACH •••• 1187' },
];

export const paymentMethods = [
  {
    id: 'ach-1',
    type: 'ach',
    label: 'ACH Bank Account',
    last4: '1187',
    isRecommended: true,
    recommendationNote: 'Recommended: lower processing fees',
  },
  {
    id: 'card-1',
    type: 'card',
    label: 'Visa',
    last4: '4242',
    isRecommended: false,
  },
];

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(amount);

export const formatDate = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const getStatusLabel = (status) => {
  switch (status) {
    case 'overdue':
      return 'Overdue';
    case 'due_soon':
      return 'Due Soon';
    case 'current':
      return 'Current';
    default:
      return status;
  }
};

export const getStatusVariant = (status) => {
  switch (status) {
    case 'overdue':
      return 'danger';
    case 'due_soon':
      return 'warning';
    case 'current':
      return 'neutral';
    default:
      return 'neutral';
  }
};

// Equipment (devices)
export const equipment = [
  {
    id: 'eq-1',
    name: 'Canon ImageRunner C3525i',
    model: 'C3525i',
    serialNumber: 'CN-2847-A1',
    location: 'Main Office – 2nd Floor',
    status: 'active',
    needsAttention: false,
    lastMeterRead: '2025-03-01',
    lastMeterValue: 12450,
    meterType: 'B&W / Color',
  },
  {
    id: 'eq-2',
    name: 'HP LaserJet MFP M428',
    model: 'M428',
    serialNumber: 'HP-8821-B2',
    location: 'Reception',
    status: 'active',
    needsAttention: true,
    lastMeterRead: '2025-02-15',
    lastMeterValue: 8920,
    meterType: 'B&W',
  },
  {
    id: 'eq-3',
    name: 'Canon imageCLASS MF445dw',
    model: 'MF445dw',
    serialNumber: 'CN-9102-C3',
    location: 'Legal – 3rd Floor',
    status: 'active',
    needsAttention: false,
    lastMeterRead: '2025-03-05',
    lastMeterValue: 3420,
    meterType: 'B&W',
  },
];

// Service tickets
export const serviceTickets = [
  {
    id: 'ST-9012',
    subject: 'Paper jam – C3525i',
    deviceName: 'Canon ImageRunner C3525i',
    status: 'scheduled',
    statusLabel: 'Technician scheduled',
    createdAt: '2025-03-06',
    scheduledDate: '2025-03-10',
    description: 'Frequent paper jams in tray 2.',
  },
  {
    id: 'ST-9010',
    subject: 'Toner low – M428',
    deviceName: 'HP LaserJet MFP M428',
    status: 'in_progress',
    statusLabel: 'In progress',
    createdAt: '2025-03-04',
    scheduledDate: null,
    description: 'Black toner replacement requested.',
  },
  {
    id: 'ST-9008',
    subject: 'Preventive maintenance – MF445dw',
    deviceName: 'Canon imageCLASS MF445dw',
    status: 'completed',
    statusLabel: 'Completed',
    createdAt: '2025-02-28',
    completedDate: '2025-03-02',
    description: 'Quarterly PM completed.',
  },
];

// Supplies (products / recommended)
export const supplies = [
  { id: 'sup-1', name: 'Canon Genuine Toner – Black', sku: '125', forDevice: 'Canon ImageRunner C3525i', lastOrdered: '2025-03-05', recommended: true },
  { id: 'sup-2', name: 'Canon Genuine Toner – Cyan', sku: '126', forDevice: 'Canon ImageRunner C3525i', lastOrdered: '2025-03-05', recommended: true },
  { id: 'sup-3', name: 'HP 414A Black Toner', sku: 'HP-414A', forDevice: 'HP LaserJet MFP M428', lastOrdered: '2025-02-10', recommended: true },
  { id: 'sup-4', name: 'Canon Drum Unit', sku: 'DR-3525', forDevice: 'Canon ImageRunner C3525i', lastOrdered: null, recommended: false },
];

// Supply orders history
export const supplyOrders = [
  { id: 'ord-1', date: '2025-03-05', items: ['Canon Genuine Toner – Black (x4)', 'Canon Genuine Toner – Cyan (x2)'], total: 892.0, status: 'delivered' },
  { id: 'ord-2', date: '2025-02-10', items: ['HP 414A Black Toner (x2)'], total: 296.0, status: 'delivered' },
  { id: 'ord-3', date: '2025-01-15', items: ['Canon Genuine Toner – Black (x2)'], total: 296.0, status: 'delivered' },
];

// Recent activity (for dashboard)
export const recentActivity = [
  { id: 'act-1', type: 'payment', title: 'Payment received', detail: '$325.50 – Invoice #84220', time: 'Mar 8', link: '/payments' },
  { id: 'act-2', type: 'invoice', title: 'New invoice', detail: 'Invoice #84221 – Toner Supply Order', time: 'Mar 5', link: '/billing' },
  { id: 'act-3', type: 'service', title: 'Service update', detail: 'Ticket #ST-9012 – Technician scheduled Mar 10', time: 'Mar 6', link: '/service' },
  { id: 'act-4', type: 'supplies', title: 'Supply order shipped', detail: 'Order #ord-1 delivered', time: 'Mar 7', link: '/supplies' },
  { id: 'act-5', type: 'payment', title: 'AutoPay processed', detail: '$1,240.00 – Invoice #84215', time: 'Mar 5', link: '/payments' },
];
