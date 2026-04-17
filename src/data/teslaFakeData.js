// Tesla enterprise customer portal demo (Ubeo platform)

import { legacyEquipmentList } from './teslaEquipmentFleetData';
export {
  formatCurrency,
  formatDate,
  formatDateTime,
  getStatusLabel,
  getStatusVariant,
} from './formatters';

export const dealer = {
  name: 'Tesla',
  logoText: 'Tesla',
  tagline: 'Fleet & workplace services',
  billingEmail: 'fleet-services@tesla.com',
  billingPhone: '(555) 555-0184',
};

export const customer = {
  name: 'Sarah Chen',
  company: 'Tesla',
  accountId: 'TSLA-2847',
  billingEmail: 'billing@tesla.com',
  email: 'sarah.chen@tesla.com',
  phone: '(555) 555-0123',
};

export const user = {
  firstName: 'Sarah',
  lastName: 'Chen',
  email: 'sarah.chen@tesla.com',
  phone: '(555) 555-0123',
  jobTitle: 'Fleet Operations Manager',
  role: 'Account Administrator',
  avatarUrl: null,
  twoFactorEnabled: false,
  emailVerified: true,
  lastLogin: '2026-04-17T09:32:00Z',
  memberSince: '2024-06-15',
  timezone: 'America/Los_Angeles',
  language: 'English (US)',
};

export const inboxEmails = [
  {
    id: 'tesla-payment',
    from: { name: 'Tesla', email: 'fleet-services@tesla.com' },
    subject: 'Payment reminder: 4 invoices due',
    date: '2026-03-10',
    time: '9:42 AM',
    snippet: 'You have $2,944.50 in outstanding invoices. Pay now, no login required.',
    read: false,
    bodyType: 'tesla-payment',
  },
  {
    id: 'gftx-facilities',
    from: { name: 'Gigafactory Texas Facilities', email: 'facilities.aus@tesla.com' },
    subject: 'Dock 2 freight window change – week of Mar 10',
    date: '2026-03-09',
    time: '2:15 PM',
    snippet: 'Inbound carriers: updated check-in procedure. Post at shipping office and HR suite.',
    read: false,
    bodyType: 'generic',
  },
  {
    id: 'reno-dc-supplies',
    from: { name: 'Reno Parts DC – Receiving', email: 'reno.receiving@tesla.com' },
    subject: 'Pallet label stock delivery – Dock 4',
    date: '2026-03-09',
    time: '11:30 AM',
    snippet: 'Thermal labels arriving Mar 11. Receiving 6–9 AM. Coordinate with label station lead.',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'michael-torres',
    from: { name: 'Michael Torres', email: 'm.torres@tesla.com' },
    subject: 'RE: Q1 fleet meter review — Las Vegas + Reno',
    date: '2026-03-08',
    time: '4:22 PM',
    snippet: 'Sarah, can you pull March reads for LV front desk and Reno shipping MFPs by EOD Tuesday?',
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
    from: { name: 'Jennifer Park', email: 'j.park@tesla.com' },
    subject: 'SLC regional office — printer access Thursday',
    date: '2026-03-07',
    time: '5:45 PM',
    snippet: 'I’m at training in Denver Thu. Can someone cover Floor 6 copier questions 1–4 PM?',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'deer-creek-facilities',
    from: { name: 'Deer Creek Facilities', email: 'facilities.pa@tesla.com' },
    subject: 'Palo Alto campus — IDF work Mar 14',
    date: '2026-03-06',
    time: '3:00 PM',
    snippet: 'Network closet maintenance 7–10 AM. Brief printer offline windows possible on Floors 2–4.',
    read: true,
    bodyType: 'generic',
  },
  {
    id: 'fleet-compliance',
    from: { name: 'Document Retention', email: 'records@tesla.com' },
    subject: 'Annual shred day — Palo Alto mailroom',
    date: '2026-03-05',
    time: '10:00 AM',
    snippet: 'Bins arrive Mar 31. Mailroom & reprographics — confirm high-volume MFP cleared for vendor.',
    read: true,
    bodyType: 'generic',
  },
];

export const notifications = [
  {
    id: '1',
    type: 'invoice',
    title: 'Invoice #84219 Due in 3 Days',
    message: 'Managed print services — Palo Alto fleet segment – $487.00 due Mar 12, 2026',
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
    message: 'Service invoice — multi-site PM visit #84222',
    time: 'Mar 7, 2026',
    read: true,
  },
  {
    id: '4',
    type: 'service',
    title: 'Service Ticket Updated',
    message: 'Ticket #ST-9012 — Palo Alto Engineering MFP — technician scheduled Mar 10',
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
    description: 'Managed print — Palo Alto & regional fleet',
    dueDate: '2026-03-11',
    amount: 487.0,
    status: 'due_soon',
    lineItems: [
      { description: 'Canon imageRUNNER ADVANCE segment — monthly lease', quantity: 1, unitPrice: 387.0, amount: 387.0 },
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

export { serviceTickets, isOpenServiceTicket } from './teslaServiceTicketsData';

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
  {
    id: 'act-3',
    type: 'service',
    title: 'Service update',
    detail: 'Ticket #ST-9012 — Palo Alto Engineering — technician scheduled Mar 10',
    time: 'Mar 6, 2026',
    link: '/service',
  },
  { id: 'act-4', type: 'supplies', title: 'Supply order shipped', detail: 'Order #ord-1 delivered', time: 'Mar 7, 2026', link: '/supplies' },
  { id: 'act-5', type: 'payment', title: 'AutoPay processed', detail: '$1,240.00 – Invoice #84215', time: 'Mar 5, 2026', link: '/payments' },
];

export const portalThemeClass = 'portal-theme-tesla';
export const portalLogoSrc = '/branding/tesla-logo.png';
export const portalDocumentTitle = 'Tesla — Service portal';
