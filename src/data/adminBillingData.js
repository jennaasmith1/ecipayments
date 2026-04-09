/**
 * Ubeo admin — billing — demo invoices only (no APIs).
 * Reference "today" aligns with other admin demo data.
 */
export const BILLING_REFERENCE = new Date('2026-03-30T12:00:00');

export const BILLING_CUSTOMER_OPTIONS = [
  { id: 'tesla', name: 'Tesla' },
  { id: 'hartwell', name: 'Hartwell Medical Group' },
  { id: 'meridian', name: 'Meridian Legal Services' },
  { id: 'kessler', name: 'Kessler Engineering LLC' },
  { id: 'redwood', name: 'Redwood Medical Center' },
  { id: 'northwind', name: 'Northwind Logistics' },
  { id: 'blue-peak', name: 'Blue Peak Manufacturing' },
];

export const BILLING_LOCATIONS = [
  'Main Office — 200 Park Ave',
  'Downtown HQ — 12th Floor',
  'North Campus — Imaging',
  'South Campus — ER Admin',
  'HQ — Industrial Way',
  'West Distribution — Bay 4',
  'Plant 2 — Receiving',
  'Regional HQ — Conference wing',
  'Tesla Palo Alto – Engineering, Floor 3',
  'Tesla Palo Alto – Finance & AP, Floor 2',
  'Tesla Fremont – Legal & Compliance, Bldg D',
  'Tesla Reno Parts Distribution – Shipping office',
  'Tesla Las Vegas Service & Delivery – Front desk',
  'Tesla Palo Alto – IT / Network Services',
];

export const INVOICE_STATUS_OPTIONS = [
  { key: 'paid', label: 'Paid' },
  { key: 'open', label: 'Open' },
  { key: 'overdue', label: 'Overdue' },
  { key: 'partial', label: 'Partially paid' },
];

function line(desc, qty, unit) {
  return { description: desc, qty, unitPrice: unit, lineTotal: Math.round(qty * unit * 100) / 100 };
}

function pay(date, amount, method) {
  return { date, amount, method };
}

export const globalInvoices = [
  {
    id: 'inv-bs-1',
    invoiceNumber: 'INV-2026-084220',
    customerId: 'tesla',
    customerName: 'Tesla',
    poNumber: 'PO-BLS-4410',
    location: 'Tesla Palo Alto – Engineering, Floor 3',
    invoiceDate: '2026-02-10',
    dueDate: '2026-03-12',
    total: 4280.0,
    amountPaid: 2140.0,
    balance: 2140.0,
    statusKey: 'partial',
    lineItems: [
      line('Managed print — February service', 1, 1850.0),
      line('Toner bundle (BK/C/M/Y)', 2, 890.0),
      line('On-site technician visit', 1, 540.0),
    ],
    payments: [pay('2026-03-01', 2140.0, 'ACH')],
    paymentHabitNote: 'late',
  },
  {
    id: 'inv-bs-2',
    invoiceNumber: 'INV-2026-089901',
    customerId: 'tesla',
    customerName: 'Tesla',
    poNumber: 'PO-BLS-4488',
    location: 'Tesla Palo Alto – Finance & AP, Floor 2',
    invoiceDate: '2026-03-01',
    dueDate: '2026-03-31',
    total: 3120.5,
    amountPaid: 0,
    balance: 3120.5,
    statusKey: 'open',
    lineItems: [line('Copier lease — March', 1, 2890.5), line('Document workflow add-on', 1, 230.0)],
    payments: [],
    paymentHabitNote: 'late',
  },
  {
    id: 'inv-bs-3',
    invoiceNumber: 'INV-2025-072200',
    customerId: 'tesla',
    customerName: 'Tesla',
    poNumber: null,
    location: 'Tesla Reno Parts Distribution – Shipping office',
    invoiceDate: '2025-12-18',
    dueDate: '2026-01-17',
    total: 2140.0,
    amountPaid: 0,
    balance: 2140.0,
    statusKey: 'overdue',
    lineItems: [line('Year-end supplies true-up', 1, 2140.0)],
    payments: [],
    paymentHabitNote: 'late',
  },
  {
    id: 'inv-sos-1',
    invoiceNumber: 'INV-2026-090112',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    poNumber: 'SOS-77821',
    location: 'Regional HQ — Conference wing',
    invoiceDate: '2026-03-18',
    dueDate: '2026-04-17',
    total: 1842.0,
    amountPaid: 0,
    balance: 1842.0,
    statusKey: 'open',
    lineItems: [line('Fleet monitoring — Q1', 1, 1200.0), line('Supplies — staples & labels', 1, 642.0)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-sos-2',
    invoiceNumber: 'INV-2026-087654',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    poNumber: 'SOS-77100',
    location: 'Regional HQ — Conference wing',
    invoiceDate: '2026-02-22',
    dueDate: '2026-03-24',
    total: 965.4,
    amountPaid: 965.4,
    balance: 0,
    statusKey: 'paid',
    lineItems: [line('Color toner — C5840', 4, 241.35)],
    payments: [pay('2026-03-22', 965.4, 'Credit card')],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-rw-1',
    invoiceNumber: 'INV-2026-088800',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    poNumber: 'RMC-99231',
    location: 'North Campus — Imaging',
    invoiceDate: '2026-03-05',
    dueDate: '2026-04-04',
    total: 12490.0,
    amountPaid: 8000.0,
    balance: 4490.0,
    statusKey: 'partial',
    lineItems: [
      line('Imaging device — extended coverage', 1, 8900.0),
      line('Parts & labor pool', 1, 3590.0),
    ],
    payments: [pay('2026-03-20', 8000.0, 'Wire')],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-rw-2',
    invoiceNumber: 'INV-2026-085500',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    poNumber: 'RMC-99001',
    location: 'South Campus — ER Admin',
    invoiceDate: '2026-01-28',
    dueDate: '2026-02-27',
    total: 3210.0,
    amountPaid: 3210.0,
    balance: 0,
    statusKey: 'paid',
    lineItems: [line('Service call — fuser replacement', 1, 3210.0)],
    payments: [pay('2026-02-25', 3210.0, 'ACH')],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-bp-1',
    invoiceNumber: 'INV-2026-091002',
    customerId: 'blue-peak',
    customerName: 'Blue Peak Manufacturing',
    poNumber: 'BPM-PLT2-440',
    location: 'Plant 2 — Receiving',
    invoiceDate: '2026-03-22',
    dueDate: '2026-04-21',
    total: 6780.0,
    amountPaid: 0,
    balance: 6780.0,
    statusKey: 'open',
    lineItems: [line('Industrial MFP — quarterly maintenance', 1, 4200.0), line('Consumables kit', 1, 2580.0)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-bp-2',
    invoiceNumber: 'INV-2026-082340',
    customerId: 'blue-peak',
    customerName: 'Blue Peak Manufacturing',
    poNumber: 'BPM-HQ-221',
    location: 'HQ — Industrial Way',
    invoiceDate: '2026-02-01',
    dueDate: '2026-03-03',
    total: 4520.75,
    amountPaid: 0,
    balance: 4520.75,
    statusKey: 'overdue',
    lineItems: [line('Lease true-up — January', 1, 4520.75)],
    payments: [],
    paymentHabitNote: 'mixed',
  },
  {
    id: 'inv-hw-1',
    invoiceNumber: 'INV-2026-089200',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    poNumber: 'HMG-66120',
    location: 'Downtown HQ — 12th Floor',
    invoiceDate: '2026-03-12',
    dueDate: '2026-04-11',
    total: 2288.0,
    amountPaid: 0,
    balance: 2288.0,
    statusKey: 'open',
    lineItems: [line('Supplies — secure shred bags', 1, 428.0), line('MFP service plan — March', 1, 1860.0)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-hw-2',
    invoiceNumber: 'INV-2026-075500',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    poNumber: null,
    location: 'Downtown HQ — 12th Floor',
    invoiceDate: '2025-11-20',
    dueDate: '2025-12-20',
    total: 1100.0,
    amountPaid: 1100.0,
    balance: 0,
    statusKey: 'paid',
    lineItems: [line('Archive box pickup', 1, 1100.0)],
    payments: [pay('2025-12-18', 1100.0, 'Check')],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-mer-1',
    invoiceNumber: 'INV-2026-088100',
    customerId: 'meridian',
    customerName: 'Meridian Legal Services',
    poNumber: 'MLS-9031',
    location: 'Main Office — 200 Park Ave',
    invoiceDate: '2026-03-08',
    dueDate: '2026-04-07',
    total: 1544.2,
    amountPaid: 1544.2,
    balance: 0,
    statusKey: 'paid',
    lineItems: [line('Legal-size paper — case stock', 1, 1544.2)],
    payments: [pay('2026-03-28', 1544.2, 'ACH')],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-mer-2',
    invoiceNumber: 'INV-2026-081900',
    customerId: 'meridian',
    customerName: 'Meridian Legal Services',
    poNumber: 'MLS-8890',
    location: 'Downtown HQ — 12th Floor',
    invoiceDate: '2026-02-01',
    dueDate: '2026-03-03',
    total: 890.0,
    amountPaid: 0,
    balance: 890.0,
    statusKey: 'overdue',
    lineItems: [line('Records scanning — batch 12', 1, 890.0)],
    payments: [],
    paymentHabitNote: 'mixed',
  },
  {
    id: 'inv-kes-1',
    invoiceNumber: 'INV-2026-090445',
    customerId: 'kessler',
    customerName: 'Kessler Engineering LLC',
    poNumber: 'KEL-2201',
    location: 'West Distribution — Bay 4',
    invoiceDate: '2026-03-20',
    dueDate: '2026-04-19',
    total: 892.5,
    amountPaid: 0,
    balance: 892.5,
    statusKey: 'open',
    lineItems: [line('Wide-format prints — project set', 1, 892.5)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-kes-2',
    invoiceNumber: 'INV-2026-083000',
    customerId: 'kessler',
    customerName: 'Kessler Engineering LLC',
    poNumber: 'KEL-2155',
    location: 'West Distribution — Bay 4',
    invoiceDate: '2026-02-14',
    dueDate: '2026-03-16',
    total: 2405.0,
    amountPaid: 1200.0,
    balance: 1205.0,
    statusKey: 'partial',
    lineItems: [line('Plotter maintenance + rollers', 1, 2405.0)],
    payments: [pay('2026-03-10', 1200.0, 'ACH')],
    paymentHabitNote: 'mixed',
  },
  {
    id: 'inv-bs-4',
    invoiceNumber: 'INV-2026-086700',
    customerId: 'tesla',
    customerName: 'Tesla',
    poNumber: 'PO-BLS-4300',
    location: 'Tesla Palo Alto – IT / Network Services',
    invoiceDate: '2026-02-28',
    dueDate: '2026-03-30',
    total: 560.0,
    amountPaid: 560.0,
    balance: 0,
    statusKey: 'paid',
    lineItems: [line('Mailbox migration — one-time', 1, 560.0)],
    payments: [pay('2026-03-28', 560.0, 'ACH')],
    paymentHabitNote: 'late',
  },
  {
    id: 'inv-sos-3',
    invoiceNumber: 'INV-2026-091200',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    poNumber: null,
    location: 'Regional HQ — Conference wing',
    invoiceDate: '2026-03-25',
    dueDate: '2026-04-09',
    total: 412.0,
    amountPaid: 0,
    balance: 412.0,
    statusKey: 'open',
    lineItems: [line('Rush delivery — supplies', 1, 412.0)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
  {
    id: 'inv-rw-3',
    invoiceNumber: 'INV-2026-091340',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    poNumber: 'RMC-99388',
    location: 'North Campus — Imaging',
    invoiceDate: '2026-03-26',
    dueDate: '2026-04-10',
    total: 1180.0,
    amountPaid: 0,
    balance: 1180.0,
    statusKey: 'open',
    lineItems: [line('Film & specialty media', 1, 1180.0)],
    payments: [],
    paymentHabitNote: 'ontime',
  },
];

export const AI_BILLING_INSIGHTS = [
  {
    id: 'abi-1',
    text: '3 customer accounts have overdue balances — Tesla has $2,140 past terms on INV-2025-072200.',
    tone: 'warn',
    actions: [
      { id: 'abi-1a', label: 'View overdue', to: '/admin/billing', variant: 'secondary' },
      { id: 'abi-1b', label: 'Open Tesla', to: '/admin/customers/tesla', variant: 'tertiary' },
    ],
  },
  {
    id: 'abi-2',
    text: 'Payments from Tesla are often a few days after the due date — helpful context if they ask about timing.',
    tone: 'info',
    actions: [
      { id: 'abi-2a', label: 'Account profile', to: '/admin/customers/tesla', variant: 'secondary' },
      { id: 'abi-2b', label: 'Add note', disabled: true, variant: 'tertiary' },
    ],
  },
  {
    id: 'abi-3',
    text: 'Blue Peak Manufacturing has two open invoices totaling $11,300 — worth confirming receipt on the Plant 2 bill before month-end.',
    tone: 'info',
    actions: [
      { id: 'abi-3a', label: 'Open Blue Peak', to: '/admin/customers/blue-peak', variant: 'secondary' },
      { id: 'abi-3b', label: 'View billing', to: '/admin/billing', variant: 'tertiary' },
    ],
  },
  {
    id: 'abi-4',
    text: 'Redwood Medical Center made a partial wire payment on INV-2026-088800 — remaining balance is $4,490.',
    tone: 'neutral',
    actions: [
      { id: 'abi-4a', label: 'Open Redwood', to: '/admin/customers/redwood', variant: 'secondary' },
      { id: 'abi-4b', label: 'Email AP contact', disabled: true, variant: 'tertiary' },
    ],
  },
];

export function statusLabel(key) {
  const m = { paid: 'Paid', open: 'Open', overdue: 'Overdue', partial: 'Partial' };
  return m[key] ?? key;
}

export function isPaidInPeriod(inv, start, end) {
  if (inv.statusKey !== 'paid' || !inv.payments?.length) return false;
  const last = [...inv.payments].sort((a, b) => new Date(b.date) - new Date(a.date))[0];
  const d = new Date(last.date);
  return d >= start && d <= end;
}

export function daysUntilDue(dueDateIso) {
  const due = new Date(dueDateIso);
  const today = new Date(BILLING_REFERENCE);
  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.round((due - today) / (24 * 60 * 60 * 1000));
}

export function isDueSoon(inv, days = 14) {
  if (inv.balance <= 0) return false;
  if (inv.statusKey === 'overdue') return false;
  const d = daysUntilDue(inv.dueDate);
  return d >= 0 && d <= days;
}

export function computeBillingSummary(invoices) {
  const ref = BILLING_REFERENCE;
  const weekStart = new Date(ref);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(ref);
  monthStart.setDate(monthStart.getDate() - 30);

  let totalOutstanding = 0;
  let overdueAmount = 0;
  let dueSoonCount = 0;
  let paidWeek = 0;
  let paidMonth = 0;

  for (const inv of invoices) {
    if (inv.balance > 0) totalOutstanding += inv.balance;
    if (inv.statusKey === 'overdue') overdueAmount += inv.balance;
    if (isDueSoon(inv, 14)) dueSoonCount += 1;
    if (isPaidInPeriod(inv, weekStart, ref)) paidWeek += inv.total;
    if (isPaidInPeriod(inv, monthStart, ref)) paidMonth += inv.total;
  }

  const customersWithOverdue = new Set(invoices.filter((i) => i.statusKey === 'overdue').map((i) => i.customerId));

  return {
    total_outstanding: totalOutstanding,
    overdue_amount: overdueAmount,
    due_soon_count: dueSoonCount,
    paid_this_week: paidWeek,
    paid_this_month: paidMonth,
    invoice_count: invoices.length,
    overdue_customer_count: customersWithOverdue.size,
  };
}

export function customerOutstanding(invoices, customerId) {
  return invoices.filter((i) => i.customerId === customerId && i.balance > 0).reduce((s, i) => s + i.balance, 0);
}

export function compareInvoiceStatus(a, b) {
  const order = { overdue: 0, partial: 1, open: 2, paid: 3 };
  return (order[a.statusKey] ?? 9) - (order[b.statusKey] ?? 9);
}
