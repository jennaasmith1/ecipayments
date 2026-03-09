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
