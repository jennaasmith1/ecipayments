/**
 * Ubeo admin — global orders — demo data only (no APIs).
 */

export const ORDER_STATUS_OPTIONS = [
  { key: 'processing', label: 'Processing' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' },
  { key: 'backordered', label: 'Backordered' },
  { key: 'delayed', label: 'Delayed' },
];

export const ORDER_TYPE_OPTIONS = [
  { key: 'supplies', label: 'Supplies' },
  { key: 'parts', label: 'Parts' },
  { key: 'equipment', label: 'Equipment' },
];

/** Customers with orders — ids match admin customers where possible */
export const ORDER_CUSTOMER_OPTIONS = [
  { id: 'tesla', name: 'Tesla' },
  { id: 'hartwell', name: 'Hartwell Medical Group' },
  { id: 'meridian', name: 'Meridian Legal Services' },
  { id: 'kessler', name: 'Kessler Engineering LLC' },
  { id: 'redwood', name: 'Redwood Medical Center' },
  { id: 'northwind', name: 'Northwind Logistics' },
  { id: 'blue-peak', name: 'Blue Peak Manufacturing' },
];

export const ORDER_LOCATIONS = [
  'Main Office — 200 Park Ave',
  'Downtown HQ — 12th Floor',
  'North Campus — Imaging',
  'South Campus — ER Admin',
  'HQ — Industrial Way',
  'West Distribution — Bay 4',
  'Plant 2 — Receiving',
  'Regional HQ — Conference wing',
];

export const AI_ORDER_INSIGHTS = [
  {
    id: 'aoi-1',
    text: 'Tesla has 3 orders with delays or backorders — worth a quick check-in before your Thursday review.',
    tone: 'warn',
    actions: [
      { id: 'aoi-1a', label: 'Open Tesla', to: '/admin/customers/tesla', variant: 'secondary' },
      { id: 'aoi-1b', label: 'View orders', to: '/admin/orders', variant: 'tertiary' },
    ],
  },
  {
    id: 'aoi-2',
    text: 'Redwood Medical Center placed frequent toner orders this quarter — may indicate higher-than-expected usage on the C5840 fleet.',
    tone: 'info',
    actions: [
      { id: 'aoi-2a', label: 'Open Redwood', to: '/admin/customers/redwood', variant: 'secondary' },
      { id: 'aoi-2b', label: 'Catalog (EvolutionX)', to: 'https://www.ecisolutions.com', external: true, variant: 'tertiary' },
    ],
  },
  {
    id: 'aoi-3',
    text: '2 orders for Blue Peak Manufacturing are backordered on fuser parts — production timelines could be affected.',
    tone: 'warn',
    actions: [
      { id: 'aoi-3a', label: 'Open Blue Peak', to: '/admin/customers/blue-peak', variant: 'secondary' },
      { id: 'aoi-3b', label: 'Notify customer', disabled: true, variant: 'tertiary' },
    ],
  },
  {
    id: 'aoi-4',
    text: 'Northwind Logistics shows steady supplies volume with no open issues — good account health signal for renewal prep.',
    tone: 'neutral',
    actions: [
      { id: 'aoi-4a', label: 'Open Northwind', to: '/admin/customers/northwind', variant: 'secondary' },
      { id: 'aoi-4b', label: 'Start renewal task', disabled: true, variant: 'tertiary' },
    ],
  },
];

const now = new Date('2026-03-30T12:00:00');

export function orderInLastWeek(orderDateIso) {
  const d = new Date(orderDateIso);
  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  return d >= weekAgo && d <= now;
}

export function isOpenOrder(o) {
  return o.statusKey !== 'delivered';
}

function itemLine(name, qty, lineStatus, equipmentNumber) {
  return { name, qty, lineStatus, equipmentNumber: equipmentNumber ?? null };
}

export const globalOrders = [
  {
    id: 'ord-24001',
    orderNumber: 'ORD-2026-18420',
    customerId: 'tesla',
    customerName: 'Tesla',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black, Cyan), Waste toner box',
    items: [
      itemLine('Toner Cartridge — Black', 2, 'ok', 'EQ-45821'),
      itemLine('Toner Cartridge — Cyan', 1, 'backordered', 'EQ-45821'),
      itemLine('Waste toner container', 1, 'ok', 'EQ-45821'),
    ],
    statusKey: 'backordered',
    orderDate: '2026-03-26',
    expectedDelivery: '2026-04-03',
    total: 1240.5,
    location: 'Tesla Palo Alto – Finance & AP, Floor 2',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: 'Partial ship when black toner releases.',
  },
  {
    id: 'ord-24002',
    orderNumber: 'ORD-2026-18302',
    customerId: 'tesla',
    customerName: 'Tesla',
    orderType: 'parts',
    itemsSummary: 'Drum unit, Developer (Magenta)',
    items: [
      itemLine('Drum Unit — Magenta', 1, 'ok', 'EQ-45821'),
      itemLine('Developer — Magenta', 1, 'ok', 'EQ-45821'),
    ],
    statusKey: 'shipped',
    orderDate: '2026-03-22',
    expectedDelivery: '2026-03-28',
    total: 892.0,
    location: 'Tesla Fremont – Legal production, Bldg D',
    contractBilling: 'contract',
    trackingNumber: '1Z999AA10123456784',
    carrier: 'UPS Ground',
    shipNote: 'Signature required.',
  },
  {
    id: 'ord-24003',
    orderNumber: 'ORD-2026-18011',
    customerId: 'tesla',
    customerName: 'Tesla',
    orderType: 'supplies',
    itemsSummary: 'Staple cartridge, Paper (Letter)',
    items: [
      itemLine('Staple cartridge (3K)', 4, 'ok', null),
      itemLine('Paper — 24 lb letter (case)', 10, 'ok', null),
    ],
    statusKey: 'delivered',
    orderDate: '2026-03-10',
    expectedDelivery: '2026-03-14',
    total: 428.9,
    location: 'Tesla Palo Alto – Mailroom & reprographics',
    contractBilling: 'contract',
    trackingNumber: '94055118995600000001',
    carrier: 'FedEx',
    shipNote: 'Delivered to mailroom.',
  },
  {
    id: 'ord-24004',
    orderNumber: 'ORD-2026-18488',
    customerId: 'tesla',
    customerName: 'Tesla',
    orderType: 'equipment',
    itemsSummary: 'Canon imageRUNNER ADVANCE C5840i',
    items: [itemLine('Canon imageRUNNER ADVANCE C5840i', 1, 'ok', 'EQ-NEW-9021')],
    statusKey: 'processing',
    orderDate: '2026-03-29',
    expectedDelivery: '2026-04-18',
    total: 12850.0,
    location: 'Tesla Las Vegas Service & Delivery – Front desk',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: 'Freight — scheduled',
    shipNote: 'Install window TBD with field PM.',
  },
  {
    id: 'ord-24005',
    orderNumber: 'ORD-2026-18455',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    orderType: 'supplies',
    itemsSummary: 'Toner (all colors), ADF maintenance kit',
    items: [
      itemLine('Toner — Black', 6, 'ok', 'EQ-77210'),
      itemLine('Toner — Color set', 2, 'ok', 'EQ-77210'),
      itemLine('ADF maintenance kit', 1, 'ok', 'EQ-77210'),
    ],
    statusKey: 'processing',
    orderDate: '2026-03-28',
    expectedDelivery: '2026-04-01',
    total: 2156.4,
    location: 'North Campus — Imaging',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: null,
  },
  {
    id: 'ord-24006',
    orderNumber: 'ORD-2026-18290',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    orderType: 'parts',
    itemsSummary: 'Fuser unit, Pickup roller assembly',
    items: [
      itemLine('Fuser unit — 220V', 1, 'delayed', 'EQ-77210'),
      itemLine('Pickup roller assembly', 2, 'ok', 'EQ-77210'),
    ],
    statusKey: 'delayed',
    orderDate: '2026-03-18',
    expectedDelivery: '2026-04-08',
    total: 1642.0,
    location: 'South Campus — ER Admin',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: 'Supplier slip — new ETA Apr 8.',
  },
  {
    id: 'ord-24007',
    orderNumber: 'ORD-2026-18144',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    orderType: 'supplies',
    itemsSummary: 'Labels, Film for badges',
    items: [
      itemLine('Label roll — 4×6', 8, 'ok', null),
      itemLine('Film cartridge', 3, 'ok', null),
    ],
    statusKey: 'delivered',
    orderDate: '2026-03-05',
    expectedDelivery: '2026-03-11',
    total: 312.5,
    location: 'South Campus — ER Admin',
    contractBilling: 'non_contract',
    trackingNumber: '1Z888AA11223344556',
    carrier: 'UPS',
    shipNote: null,
  },
  {
    id: 'ord-24008',
    orderNumber: 'ORD-2026-18470',
    customerId: 'meridian',
    customerName: 'Meridian Legal Services',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black), Staples',
    items: [
      itemLine('Toner — Black', 3, 'ok', 'EQ-33001'),
      itemLine('Staple cartridge', 6, 'ok', 'EQ-33001'),
    ],
    statusKey: 'shipped',
    orderDate: '2026-03-27',
    expectedDelivery: '2026-03-30',
    total: 589.2,
    location: 'Regional HQ — Conference wing',
    contractBilling: 'contract',
    trackingNumber: 'JD0002123456789',
    carrier: 'FedEx Express',
    shipNote: null,
  },
  {
    id: 'ord-24009',
    orderNumber: 'ORD-2026-17920',
    customerId: 'meridian',
    customerName: 'Meridian Legal Services',
    orderType: 'parts',
    itemsSummary: 'Transfer belt, Cleaning blade',
    items: [
      itemLine('Transfer belt assembly', 1, 'ok', 'EQ-33001'),
      itemLine('Cleaning blade', 1, 'ok', 'EQ-33001'),
    ],
    statusKey: 'delivered',
    orderDate: '2026-02-26',
    expectedDelivery: '2026-03-04',
    total: 734.0,
    location: 'Regional HQ — Conference wing',
    contractBilling: 'contract',
    trackingNumber: '94001234567899999999',
    carrier: 'UPS',
    shipNote: null,
  },
  {
    id: 'ord-24010',
    orderNumber: 'ORD-2026-18491',
    customerId: 'kessler',
    customerName: 'Kessler Engineering LLC',
    orderType: 'supplies',
    itemsSummary: 'Paper (11×17), Toner (Black)',
    items: [
      itemLine('Paper — 11×17 (case)', 5, 'ok', 'EQ-22108'),
      itemLine('Toner — Black', 2, 'ok', 'EQ-22108'),
    ],
    statusKey: 'processing',
    orderDate: '2026-03-29',
    expectedDelivery: '2026-04-02',
    total: 412.8,
    location: 'HQ — Industrial Way',
    contractBilling: 'non_contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: null,
  },
  {
    id: 'ord-24011',
    orderNumber: 'ORD-2026-17501',
    customerId: 'kessler',
    customerName: 'Kessler Engineering LLC',
    orderType: 'equipment',
    itemsSummary: 'Desktop MFP — lease renewal',
    items: [itemLine('Workforce MFP — demo sku', 1, 'ok', 'EQ-LEASE-440')],
    statusKey: 'delivered',
    orderDate: '2026-01-15',
    expectedDelivery: '2026-02-01',
    total: 0,
    location: 'HQ — Industrial Way',
    contractBilling: 'contract',
    trackingNumber: '—',
    carrier: 'Dealer install',
    shipNote: 'Lease paperwork on file.',
  },
  {
    id: 'ord-24012',
    orderNumber: 'ORD-2026-18460',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black, Yellow), Drum maintenance',
    items: [
      itemLine('Toner — Black', 4, 'ok', 'EQ-44102'),
      itemLine('Toner — Yellow', 2, 'ok', 'EQ-44102'),
      itemLine('Drum maintenance kit', 1, 'ok', 'EQ-44102'),
    ],
    statusKey: 'shipped',
    orderDate: '2026-03-27',
    expectedDelivery: '2026-03-29',
    total: 1388.0,
    location: 'North Campus — Imaging',
    contractBilling: 'contract',
    trackingNumber: '1Z41412108123456789',
    carrier: 'UPS',
    shipNote: null,
  },
  {
    id: 'ord-24013',
    orderNumber: 'ORD-2026-18412',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    orderType: 'supplies',
    itemsSummary: 'Toner (Cyan, Magenta), Waste box',
    items: [
      itemLine('Toner — Cyan', 2, 'ok', 'EQ-44102'),
      itemLine('Toner — Magenta', 2, 'ok', 'EQ-44102'),
      itemLine('Waste toner box', 1, 'ok', 'EQ-44102'),
    ],
    statusKey: 'delivered',
    orderDate: '2026-03-20',
    expectedDelivery: '2026-03-24',
    total: 956.4,
    location: 'North Campus — Imaging',
    contractBilling: 'contract',
    trackingNumber: 'JD0098765432100',
    carrier: 'FedEx',
    shipNote: null,
  },
  {
    id: 'ord-24014',
    orderNumber: 'ORD-2026-18388',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    orderType: 'parts',
    itemsSummary: 'Fuser rebuild kit, Rollers',
    items: [
      itemLine('Fuser rebuild kit', 1, 'backordered', 'EQ-44102'),
      itemLine('Feed roller kit', 1, 'ok', 'EQ-44102'),
    ],
    statusKey: 'backordered',
    orderDate: '2026-03-24',
    expectedDelivery: '2026-04-12',
    total: 1420.0,
    location: 'South Campus — ER Admin',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: 'Fuser on allocation — customer notified.',
  },
  {
    id: 'ord-24015',
    orderNumber: 'ORD-2026-18495',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    orderType: 'supplies',
    itemsSummary: 'Paper (Letter, Legal), Toner (Black)',
    items: [
      itemLine('Paper — letter (case)', 20, 'ok', null),
      itemLine('Paper — legal (case)', 8, 'ok', null),
      itemLine('Toner — Black', 5, 'ok', 'EQ-55100'),
    ],
    statusKey: 'processing',
    orderDate: '2026-03-29',
    expectedDelivery: '2026-04-03',
    total: 2890.0,
    location: 'West Distribution — Bay 4',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: null,
  },
  {
    id: 'ord-24016',
    orderNumber: 'ORD-2026-18421',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    orderType: 'equipment',
    itemsSummary: 'Wide-format printer — PlotWave',
    items: [itemLine('PlotWave 3000 system', 1, 'ok', 'EQ-WF-900')],
    statusKey: 'delayed',
    orderDate: '2026-03-12',
    expectedDelivery: '2026-04-15',
    total: 18900.0,
    location: 'West Distribution — Bay 4',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: 'Freight',
    shipNote: 'Factory delay — revised ETA communicated.',
  },
  {
    id: 'ord-24017',
    orderNumber: 'ORD-2026-18200',
    customerId: 'northwind',
    customerName: 'Northwind Logistics',
    orderType: 'parts',
    itemsSummary: 'Finisher unit, Booklet maker',
    items: [
      itemLine('Finisher — inner tray', 1, 'ok', 'EQ-55100'),
      itemLine('Booklet maker trimmer', 1, 'ok', 'EQ-55100'),
    ],
    statusKey: 'delivered',
    orderDate: '2026-03-01',
    expectedDelivery: '2026-03-10',
    total: 4520.0,
    location: 'West Distribution — Bay 4',
    contractBilling: 'contract',
    trackingNumber: 'FRTL-882211',
    carrier: 'Freight — liftgate',
    shipNote: null,
  },
  {
    id: 'ord-24018',
    orderNumber: 'ORD-2026-18480',
    customerId: 'blue-peak',
    customerName: 'Blue Peak Manufacturing',
    orderType: 'parts',
    itemsSummary: 'Fuser 110V, Ozone filter',
    items: [
      itemLine('Fuser assembly — 110V', 1, 'backordered', 'EQ-66200'),
      itemLine('Ozone filter', 2, 'ok', 'EQ-66200'),
    ],
    statusKey: 'backordered',
    orderDate: '2026-03-25',
    expectedDelivery: '2026-04-10',
    total: 980.5,
    location: 'Plant 2 — Receiving',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: null,
  },
  {
    id: 'ord-24019',
    orderNumber: 'ORD-2026-18472',
    customerId: 'blue-peak',
    customerName: 'Blue Peak Manufacturing',
    orderType: 'parts',
    itemsSummary: 'Second fuser (line 3), Sensors',
    items: [
      itemLine('Fuser assembly — 110V', 1, 'backordered', 'EQ-77112'),
      itemLine('Exit sensor kit', 1, 'ok', 'EQ-77112'),
    ],
    statusKey: 'backordered',
    orderDate: '2026-03-25',
    expectedDelivery: '2026-04-10',
    total: 1102.0,
    location: 'Plant 2 — Receiving',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: 'Same SKU shortage as ord-24018.',
  },
  {
    id: 'ord-24020',
    orderNumber: 'ORD-2026-18350',
    customerId: 'blue-peak',
    customerName: 'Blue Peak Manufacturing',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black), Developer',
    items: [
      itemLine('Toner — Black (high cap)', 8, 'ok', 'EQ-66200'),
      itemLine('Developer', 2, 'ok', 'EQ-66200'),
    ],
    statusKey: 'shipped',
    orderDate: '2026-03-21',
    expectedDelivery: '2026-03-27',
    total: 2240.0,
    location: 'Plant 2 — Receiving',
    contractBilling: 'contract',
    trackingNumber: '1Z20494999123456789',
    carrier: 'UPS Freight',
    shipNote: null,
  },
  {
    id: 'ord-24021',
    orderNumber: 'ORD-2026-18499',
    customerId: 'tesla',
    customerName: 'Tesla',
    orderType: 'supplies',
    itemsSummary: 'Paper (Letter), Binder covers',
    items: [
      itemLine('Paper — letter (case)', 15, 'ok', null),
      itemLine('Binder covers — letter', 2, 'ok', null),
    ],
    statusKey: 'delayed',
    orderDate: '2026-03-20',
    expectedDelivery: '2026-04-05',
    total: 356.0,
    location: 'Tesla Palo Alto – Engineering, Floor 3',
    contractBilling: 'non_contract',
    trackingNumber: null,
    carrier: '—',
    shipNote: 'Carrier capacity — rescheduled pickup.',
  },
  {
    id: 'ord-24022',
    orderNumber: 'ORD-2026-18498',
    customerId: 'hartwell',
    customerName: 'Hartwell Medical Group',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black), Drum (Cyan)',
    items: [
      itemLine('Toner — Black', 4, 'ok', 'EQ-90234'),
      itemLine('Drum — Cyan', 1, 'ok', 'EQ-90234'),
    ],
    statusKey: 'shipped',
    orderDate: '2026-03-28',
    expectedDelivery: '2026-03-30',
    total: 1210.0,
    location: 'Downtown HQ — 12th Floor',
    contractBilling: 'contract',
    trackingNumber: 'JD8844221100998',
    carrier: 'FedEx',
    shipNote: null,
  },
  {
    id: 'ord-24023',
    orderNumber: 'ORD-2026-18450',
    customerId: 'meridian',
    customerName: 'Meridian Legal Services',
    orderType: 'equipment',
    itemsSummary: 'Color MFP — floor stand',
    items: [
      itemLine('MFP — floor model', 1, 'ok', 'EQ-NEW-771'),
      itemLine('Cabinet stand', 1, 'ok', 'EQ-NEW-771'),
    ],
    statusKey: 'processing',
    orderDate: '2026-03-26',
    expectedDelivery: '2026-04-12',
    total: 8750.0,
    location: 'Regional HQ — Conference wing',
    contractBilling: 'contract',
    trackingNumber: null,
    carrier: 'Scheduled delivery',
    shipNote: 'PM to coordinate install.',
  },
  {
    id: 'ord-24024',
    orderNumber: 'ORD-2026-18310',
    customerId: 'redwood',
    customerName: 'Redwood Medical Center',
    orderType: 'supplies',
    itemsSummary: 'Toner (Black), Imaging unit',
    items: [
      itemLine('Toner — Black', 3, 'ok', 'EQ-55880'),
      itemLine('Imaging unit', 1, 'ok', 'EQ-55880'),
    ],
    statusKey: 'delivered',
    orderDate: '2026-03-12',
    expectedDelivery: '2026-03-16',
    total: 678.9,
    location: 'South Campus — ER Admin',
    contractBilling: 'contract',
    trackingNumber: '1Z99199123456789012',
    carrier: 'UPS',
    shipNote: null,
  },
];

/** Admin customer profile routes exist for these ids */
export const ADMIN_CUSTOMER_ROUTE_IDS = new Set(['tesla', 'hartwell', 'meridian', 'kessler']);

const HIGH_VALUE_MIN = 5000;

export function computeOrderSummary(orders) {
  const open = orders.filter(isOpenOrder).length;
  return {
    open,
    processing: orders.filter((o) => o.statusKey === 'processing').length,
    shipped: orders.filter((o) => o.statusKey === 'shipped').length,
    delivered: orders.filter((o) => o.statusKey === 'delivered').length,
    backordered: orders.filter((o) => o.statusKey === 'backordered').length,
    delayed: orders.filter((o) => o.statusKey === 'delayed').length,
    this_week: orders.filter((o) => orderInLastWeek(o.orderDate)).length,
    high_value: orders.filter((o) => o.total >= HIGH_VALUE_MIN).length,
  };
}

export function topCustomersByOrderCount(orders, n = 3) {
  const counts = {};
  for (const o of orders) {
    counts[o.customerName] = (counts[o.customerName] ?? 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, count]) => ({ name, count }));
}

export function statusLabel(key) {
  return ORDER_STATUS_OPTIONS.find((s) => s.key === key)?.label ?? key;
}

export function orderTypeLabel(key) {
  return ORDER_TYPE_OPTIONS.find((t) => t.key === key)?.label ?? key;
}

const STATUS_SORT_ORDER = {
  delayed: 0,
  backordered: 1,
  processing: 2,
  shipped: 3,
  delivered: 4,
};

export function compareOrdersByStatus(a, b) {
  const da = STATUS_SORT_ORDER[a.statusKey] ?? 9;
  const db = STATUS_SORT_ORDER[b.statusKey] ?? 9;
  if (da !== db) return da - db;
  return new Date(b.orderDate) - new Date(a.orderDate);
}
