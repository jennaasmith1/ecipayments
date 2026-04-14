// Summit / Brightstone customer portal demo (restored from pre-Tesla snapshot)

import { legacyEquipmentList } from './summitEquipmentFleetData';
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusLabel,
  getStatusVariant,
} from './formatters';

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

export const inboxEmails = [
  {
    id: 'summit-payment',
    from: { name: 'Summit Office Solutions', email: 'billing@summitoffice.com' },
    subject: 'Payment reminder: 4 invoices due',
    date: '2026-03-10',
    time: '9:42 AM',
    snippet: 'You have $2,944.50 in outstanding invoices. Pay now, no login required.',
    read: false,
    bodyType: 'summit-payment',
  },
  {
    id: 'court-calendar',
    from: { name: 'County Clerk', email: 'calendar@countycourt.gov' },
    subject: 'Hearing reminder: Smith v. Davis – Mar 12, 9:00 AM',
    date: '2026-03-09',
    time: '2:15 PM',
    snippet: 'Case #CV-2024-8821. Courtroom 4B. Please confirm attendance.',
    read: false,
    bodyType: 'generic',
  },
  {
    id: 'courier-delivery',
    from: { name: 'Express Legal Courier', email: 'tracking@expresslegal.com' },
    subject: 'Delivery scheduled for tomorrow – 3 packages',
    date: '2026-03-09',
    time: '11:30 AM',
    snippet: 'Your documents will arrive between 10 AM–12 PM. Tracking #EL-44782.',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'michael-torres',
    from: { name: 'Michael Torres', email: 'm.torres@brightstonelaw.com' },
    subject: 'RE: Client intake forms for Park matter',
    date: '2026-03-08',
    time: '4:22 PM',
    snippet: 'Sarah, can you have these scanned and in the shared drive by EOD Tuesday?',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'office-supplies',
    from: { name: 'Staples Business', email: 'orders@staples.com' },
    subject: 'Your order #89234 has shipped',
    date: '2026-03-08',
    time: '8:00 AM',
    snippet: 'Estimated delivery Mar 11. 2 boxes of letterhead, 5 reams of copy paper.',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'jennifer-park',
    from: { name: 'Jennifer Park', email: 'j.park@brightstonelaw.com' },
    subject: 'Front desk coverage – Thursday afternoon',
    date: '2026-03-07',
    time: '5:45 PM',
    snippet: "I have a deposition. Can you hold down the fort 1–4 PM? I'll have my cell.",
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'building-mgmt',
    from: { name: 'Riverside Property Mgmt', email: 'frontdesk@riversideproperties.com' },
    subject: 'Lobby HVAC maintenance – Mar 14',
    date: '2026-03-06',
    time: '3:00 PM',
    snippet: 'Contractors will be in the building 7–10 AM. Elevator 2 may be briefly offline.',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'cle-cle',
    from: { name: 'State Bar CLE', email: 'cle@statebar.org' },
    subject: 'Upcoming ethics credit deadline – 6 credits due by 3/31',
    date: '2026-03-05',
    time: '10:00 AM',
    snippet: 'Reminder: complete your required CLE hours before the reporting period ends.',
    read: true,
    bodyType: 'generic',
  },
];

export const notifications = [
  {
    id: '1',
    type: 'invoice',
    title: 'Invoice #84219 Due in 3 Days',
    message: 'Canon ImageRunner Copier Lease – $487.00 due Mar 12, 2026',
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
    time: 'Mar 7, 2026',
    read: true,
  },
  {
    id: '4',
    type: 'service',
    title: 'Service Ticket Updated',
    message: 'Ticket #ST-9012 – Technician scheduled for Mar 10',
    time: 'Mar 6, 2026',
    read: true,
  },
  {
    id: '5',
    type: 'payment',
    title: 'AutoPay Payment Processed',
    message: '$1,240.00 for Invoice #84215',
    time: 'Mar 5, 2026',
    read: true,
  },
];

export const invoices = [
  {
    id: 'inv-84219',
    number: '84219',
    description: 'Canon ImageRunner Copier Lease',
    dueDate: '2026-03-11',
    amount: 487.0,
    status: 'due_soon',
    lineItems: [
      { description: 'Canon ImageRunner C3525i – Monthly lease', quantity: 1, unitPrice: 387.0, amount: 387.0 },
      { description: 'Maintenance bundle', quantity: 1, unitPrice: 100.0, amount: 100.0 },
    ],
    date: '2026-03-01',
  },
  {
    id: 'inv-84220',
    number: '84220',
    description: 'Service Invoice – Copier Maintenance',
    dueDate: '2026-03-07',
    amount: 325.5,
    status: 'overdue',
    lineItems: [
      { description: 'Preventive maintenance – 3 devices', quantity: 1, unitPrice: 275.0, amount: 275.0 },
      { description: 'Parts & labor', quantity: 1, unitPrice: 50.5, amount: 50.5 },
    ],
    date: '2026-02-28',
  },
  {
    id: 'inv-84221',
    number: '84221',
    description: 'Toner Supply Order',
    dueDate: '2026-03-14',
    amount: 892.0,
    status: 'due_soon',
    lineItems: [
      { description: 'Canon Genuine Toner – Black (x4)', quantity: 4, unitPrice: 148.0, amount: 592.0 },
      { description: 'Canon Genuine Toner – Cyan (x2)', quantity: 2, unitPrice: 150.0, amount: 300.0 },
    ],
    date: '2026-03-05',
  },
  {
    id: 'inv-84222',
    number: '84222',
    description: 'Monthly Maintenance Contract',
    dueDate: '2026-03-19',
    amount: 1240.0,
    status: 'current',
    lineItems: [
      { description: 'Full-service maintenance agreement – Mar 2026', quantity: 1, unitPrice: 1240.0, amount: 1240.0 },
    ],
    date: '2026-03-01',
  },
];

export const recentPayments = [
  { id: 'pmt-1', date: '2026-03-08', description: 'Invoice #84220 – Service Invoice', amount: 325.5, method: 'ACH •••• 1187' },
  { id: 'pmt-2', date: '2026-03-05', description: 'Invoice #84215 – Monthly Maintenance', amount: 1240.0, method: 'AutoPay • ACH •••• 1187' },
  { id: 'pmt-3', date: '2026-02-28', description: 'Invoice #84218 – Toner Supply', amount: 892.0, method: 'Visa •••• 4242' },
  { id: 'pmt-4', date: '2026-02-15', description: 'Invoice #84217 – Copier Lease', amount: 487.0, method: 'ACH •••• 1187' },
  { id: 'pmt-5', date: '2026-02-01', description: 'Invoice #84216 – Service Invoice', amount: 275.0, method: 'AutoPay • ACH •••• 1187' },
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

export const equipment = legacyEquipmentList;

export { serviceTickets, isOpenServiceTicket } from './summitServiceTicketsData';

export const supplies = [
  { id: 'sup-1', name: 'Canon Genuine Toner – Black', sku: '125', forDevice: 'Canon ImageRunner C3525i', lastOrdered: '2026-03-05', recommended: true },
  { id: 'sup-2', name: 'Canon Genuine Toner – Cyan', sku: '126', forDevice: 'Canon ImageRunner C3525i', lastOrdered: '2026-03-05', recommended: true },
  { id: 'sup-3', name: 'HP 414A Black Toner', sku: 'HP-414A', forDevice: 'HP LaserJet MFP M428', lastOrdered: '2026-02-10', recommended: true },
  { id: 'sup-4', name: 'Canon Drum Unit', sku: 'DR-3525', forDevice: 'Canon ImageRunner C3525i', lastOrdered: null, recommended: false },
];

export const supplyOrders = [
  { id: 'ord-1', date: '2026-03-05', items: ['Canon Genuine Toner – Black (x4)', 'Canon Genuine Toner – Cyan (x2)'], total: 892.0, status: 'delivered' },
  { id: 'ord-2', date: '2026-02-10', items: ['HP 414A Black Toner (x2)'], total: 296.0, status: 'delivered' },
  { id: 'ord-3', date: '2026-01-15', items: ['Canon Genuine Toner – Black (x2)'], total: 296.0, status: 'delivered' },
];

export const recentActivity = [
  { id: 'act-1', type: 'payment', title: 'Payment received', detail: '$325.50 – Invoice #84220', time: 'Mar 8, 2026', link: '/payments' },
  { id: 'act-2', type: 'invoice', title: 'New invoice', detail: 'Invoice #84221 – Toner Supply Order', time: 'Mar 5, 2026', link: '/billing' },
  { id: 'act-3', type: 'service', title: 'Service update', detail: 'Ticket #ST-9012 – Technician scheduled Mar 10', time: 'Mar 6, 2026', link: '/service' },
  { id: 'act-4', type: 'supplies', title: 'Supply order shipped', detail: 'Order #ord-1 delivered', time: 'Mar 7, 2026', link: '/supplies' },
  { id: 'act-5', type: 'payment', title: 'AutoPay processed', detail: '$1,240.00 – Invoice #84215', time: 'Mar 5, 2026', link: '/payments' },
];

export const portalThemeClass = 'portal-theme-summit';
export const portalLogoSrc = '/summit-logo.png';
export const portalDocumentTitle = 'Brightstone Law — Service portal';
