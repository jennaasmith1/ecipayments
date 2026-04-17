// Admin console mock data — Ubeo internal tools (demo only — no backend)
import { formatCurrency, formatDate } from './formatters';
import { dealer } from './summitFakeData';

export const ADMIN_PREVIEW_STORAGE_KEY = 'ubeo_admin_portal_preview';

export const adminUser = {
  name: 'Jordan Kim',
  firstName: 'Jordan',
  lastName: 'Kim',
  role: 'Account manager',
  email: 'j.kim@ubeo.com',
  phone: '(555) 412-8800',
  timezone: 'America/Chicago',
  employerName: 'Ubeo',
  employerLogoSrc: '/branding/ubeo-wordmark.png',
  mfaEnabled: true,
  mfaMethod: 'Authenticator app',
  lastPasswordChange: 'Feb 12, 2026',
  defaultLandingPage: 'dashboard',
  tableDensity: 'comfortable',
};

export const adminUserSessions = [
  { id: 'ses-1', device: 'Chrome on macOS', location: 'Dallas, TX', lastActive: 'Active now', current: true },
  { id: 'ses-2', device: 'Safari on iPhone', location: 'Dallas, TX', lastActive: '2 hr ago', current: false },
  { id: 'ses-3', device: 'Firefox on Windows', location: 'Austin, TX', lastActive: 'Mar 28, 2026', current: false },
];

export const adminNotificationCategories = [
  {
    id: 'service',
    label: 'Service',
    items: [
      { id: 'new_request', label: 'New service request', desc: 'When a customer submits a service request' },
      { id: 'escalation', label: 'Ticket escalation', desc: 'When a ticket is escalated to your queue' },
      { id: 'sla_breach', label: 'SLA breach approaching', desc: 'When an SLA deadline is within 2 hours' },
      { id: 'tech_assigned', label: 'Technician assigned', desc: 'When a tech is dispatched to your accounts' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing & AR',
    items: [
      { id: 'payment_received', label: 'Payment received', desc: 'When a customer payment is posted' },
      { id: 'invoice_overdue', label: 'Invoice past due', desc: 'When an invoice passes its due date' },
      { id: 'payment_failed', label: 'Failed payment', desc: 'When a payment attempt is declined' },
      { id: 'ar_threshold', label: 'AR threshold alert', desc: 'When an account exceeds AR limits' },
    ],
  },
  {
    id: 'portal',
    label: 'Portal Activity',
    items: [
      { id: 'new_signup', label: 'New customer signup', desc: 'When a new portal user is created' },
      { id: 'invite_accepted', label: 'Invitation accepted', desc: 'When a customer accepts a portal invite' },
      { id: 'unusual_login', label: 'Unusual login activity', desc: 'Logins from new devices or locations' },
    ],
  },
  {
    id: 'equipment',
    label: 'Equipment',
    items: [
      { id: 'meter_alert', label: 'Meter alert', desc: 'Abnormal meter readings or missed submissions' },
      { id: 'device_offline', label: 'Device offline', desc: 'When a connected device loses connectivity' },
      { id: 'contract_renewal', label: 'Contract renewal', desc: 'Upcoming lease or contract expirations' },
    ],
  },
  {
    id: 'orders',
    label: 'Orders & Supplies',
    items: [
      { id: 'order_placed', label: 'New order placed', desc: 'When a customer places a supply order' },
      { id: 'order_issue', label: 'Order issue', desc: 'Backorders, delays, or fulfillment problems' },
    ],
  },
  {
    id: 'internal',
    label: 'Internal',
    items: [
      { id: 'team_change', label: 'Team member change', desc: 'When employees are added or removed' },
      { id: 'role_change', label: 'Role change', desc: 'When roles or permissions are updated' },
      { id: 'approval_request', label: 'Approval requested', desc: 'When an action needs your sign-off' },
    ],
  },
];

export const adminNotifications = [
  { id: 'an-1', title: 'SLA Breach Warning', message: 'Ticket ST-9012 for Brightstone Law Group is within 2 hours of SLA breach.', time: '12 min ago', read: false },
  { id: 'an-2', title: 'Payment Received', message: 'Hartwell Medical Group posted $4,280.00 via ACH •••• 3392.', time: '1 hr ago', read: false },
  { id: 'an-3', title: 'New Service Request', message: 'Tesla submitted a new service request for Fremont – Legal & Compliance.', time: '2 hr ago', read: false },
  { id: 'an-4', title: 'Invoice Past Due', message: 'Meridian Legal Services — Invoice #INV-2026-088712 is 14 days overdue ($2,310.00).', time: 'Yesterday', read: true },
  { id: 'an-5', title: 'Portal Invitation Accepted', message: 'Taylor Nguyen accepted the portal invite and logged in for the first time.', time: 'Yesterday', read: true },
  { id: 'an-6', title: 'Device Offline', message: 'Canon C5540 at Blue Peak Manufacturing – Plant 2 has been offline for 24 hours.', time: 'Apr 15', read: true },
  { id: 'an-7', title: 'Contract Renewal Approaching', message: 'Northwind Logistics lease agreement expires in 30 days — requires review.', time: 'Apr 14', read: true },
  { id: 'an-8', title: 'Approval Requested', message: 'Morgan Patel requested sign-off on a $12,400 supply order for Redwood Medical.', time: 'Apr 13', read: true },
];

export const dashboardKpis = [
  { id: 'open-service', label: 'Open service calls', value: '24', meta: 'Across all accounts', variant: 'default' },
  { id: 'unpaid-ar', label: 'Unpaid AR', value: '$184,290', meta: '12 accounts past terms', variant: 'warning' },
  { id: 'active-customers', label: 'Active portal accounts', value: '186', meta: 'Logged in last 90 days', variant: 'default' },
  { id: 'portal-sessions', label: 'Portal sessions (7d)', value: '1,402', meta: '+8% vs prior week', variant: 'default' },
  {
    id: 'pending-approvals',
    label: 'Pending approvals',
    value: null,
    meta: null,
    variant: 'empty',
    empty: true,
  },
  { id: 'support-issues', label: 'Open support issues', value: '7', meta: 'Tier 2 queue', variant: 'default' },
];

export const dashboardAttentionQueue = [
  { id: 'att-1', customerId: 'brightstone', company: 'Brightstone Law Group', snippet: 'Overdue invoice #84220 · 2 open tickets', severity: 'high' },
  { id: 'att-2', customerId: 'tesla', company: 'Tesla', snippet: 'Enterprise fleet · 3 orders with delays or backorders', severity: 'high' },
  { id: 'att-3', customerId: 'hartwell', company: 'Hartwell Medical Group', snippet: 'Duplicate email on portal user · 6 locations', severity: 'medium' },
  { id: 'att-4', customerId: 'meridian', company: 'Meridian Legal Services', snippet: 'Ambiguous location naming · billing contact churn', severity: 'low' },
];

export const adminActivityFeed = [
  { id: 'af-1', type: 'impersonation', title: 'View as customer', detail: 'Brightstone Law Group · Jordan Kim', time: '32 min ago' },
  { id: 'af-2', type: 'settings', title: 'Portal branding updated', detail: 'Primary color · Morgan Patel', time: '2 hr ago' },
  { id: 'af-3', type: 'user', title: 'Portal invite resent', detail: 'hartwell@shared-mail.net · Alex Rivera', time: 'Yesterday' },
  { id: 'af-4', type: 'service', title: 'Ticket escalated', detail: 'ST-9012 → Field supervisor', time: 'Yesterday' },
  { id: 'af-5', type: 'billing', title: 'Payment plan noted', detail: 'Meridian Legal · Casey Wu', time: 'Mar 9, 2026' },
];

export const chartSeriesWeekly = [
  { label: 'Mon', tickets: 12, logins: 210 },
  { label: 'Tue', tickets: 18, logins: 242 },
  { label: 'Wed', tickets: 14, logins: 228 },
  { label: 'Thu', tickets: 22, logins: 256 },
  { label: 'Fri', tickets: 16, logins: 198 },
];

export const internalUsers = [
  { id: 'iu-1', name: 'Jordan Kim', email: 'jordan.kim@ubeo.com', role: 'Sales rep', territory: 'Metro North', status: 'active', lastActive: 'Active now', dateAdded: 'Sep 15, 2025', mfaEnabled: true },
  { id: 'iu-2', name: 'Alex Rivera', email: 'alex.rivera@ubeo.com', role: 'Billing', territory: 'National', status: 'active', lastActive: '12 min ago', dateAdded: 'Jun 3, 2025', mfaEnabled: true },
  { id: 'iu-3', name: 'Morgan Patel', email: 'morgan.patel@ubeo.com', role: 'Admin', territory: 'National', status: 'active', lastActive: '1 hr ago', dateAdded: 'Jan 10, 2025', mfaEnabled: true },
  { id: 'iu-4', name: 'Casey Wu', email: 'casey.wu@ubeo.com', role: 'Sales', territory: 'West', status: 'active', lastActive: 'Yesterday', dateAdded: 'Nov 22, 2025', mfaEnabled: false },
  { id: 'iu-5', name: 'Riley Brooks', email: 'riley.brooks@ubeo.com', role: 'Support', territory: 'South', status: 'active', lastActive: 'Mar 8, 2026', dateAdded: 'Aug 1, 2025', mfaEnabled: true },
  { id: 'iu-6', name: 'Taylor Nguyen', email: 'taylor.nguyen@ubeo.com', role: 'Service Manager', territory: 'Metro South', status: 'invited', lastActive: '—', dateAdded: 'Apr 14, 2026', mfaEnabled: false },
  { id: 'iu-7', name: 'Sam Okafor', email: 'sam.okafor@ubeo.com', role: 'Sales', territory: 'East', status: 'invited', lastActive: '—', dateAdded: 'Apr 10, 2026', mfaEnabled: false },
  { id: 'iu-8', name: 'Jamie Lawson', email: 'jamie.lawson@ubeo.com', role: 'Read-only', territory: 'National', status: 'deactivated', lastActive: 'Feb 2, 2026', dateAdded: 'Mar 18, 2025', mfaEnabled: false },
];

export const rolesCatalog = [
  { id: 'role-admin', name: 'Admin', description: 'Full portal configuration and user management' },
  { id: 'role-billing', name: 'Billing', description: 'Invoices, payments, and AR tools' },
  { id: 'role-support', name: 'Support', description: 'Tickets, impersonation, customer comms' },
  { id: 'role-service-mgr', name: 'Service Manager', description: 'Dispatch, SLA, equipment coverage' },
  { id: 'role-sales', name: 'Sales', description: 'Read-heavy + quotes' },
  { id: 'role-readonly', name: 'Read-only', description: 'View dashboards and reports only' },
];

export const permissionMatrix = [
  { key: 'customers.view', label: 'View customers' },
  { key: 'customers.edit', label: 'Edit customers' },
  { key: 'users.manage', label: 'Manage portal users' },
  { key: 'billing.view', label: 'View billing' },
  { key: 'billing.collect', label: 'Collect / adjust AR' },
  { key: 'service.dispatch', label: 'Dispatch service' },
  { key: 'portal.settings', label: 'Portal settings' },
  { key: 'impersonate', label: 'View as customer' },
  { key: 'audit.view', label: 'View audit log' },
];

export const rolePermissionsSeed = {
  'role-admin': permissionMatrix.map((p) => p.key),
  'role-billing': ['customers.view', 'billing.view', 'billing.collect', 'audit.view'],
  'role-support': ['customers.view', 'customers.edit', 'users.manage', 'service.dispatch', 'impersonate', 'audit.view'],
  'role-service-mgr': ['customers.view', 'service.dispatch', 'audit.view'],
  'role-sales': ['customers.view', 'billing.view'],
  'role-readonly': ['customers.view', 'billing.view', 'audit.view'],
};

export const auditEvents = [
  { id: 'ae-1', time: '2026-03-10 09:42', actor: 'Jordan Kim', type: 'Impersonation', detail: 'View as Brightstone Law Group', account: 'BSG-2847' },
  { id: 'ae-2', time: '2026-03-10 08:10', actor: 'Morgan Patel', type: 'Settings', detail: 'Communications · Banner text updated', account: '—' },
  { id: 'ae-3', time: '2026-03-09 16:22', actor: 'Alex Rivera', type: 'User', detail: 'Resent portal invite', account: 'HMW-9910' },
  { id: 'ae-4', time: '2026-03-09 14:05', actor: 'Jordan Kim', type: 'User', detail: 'Password reset initiated', account: 'TSLA-2847' },
  { id: 'ae-5', time: '2026-03-09 11:30', actor: 'Casey Wu', type: 'Settings', detail: 'Service requests · PO required toggled on', account: '—' },
  { id: 'ae-6', time: '2026-03-08 15:18', actor: 'Riley Brooks', type: 'Impersonation', detail: 'View as Hartwell Medical Group', account: 'HMW-9910' },
  { id: 'ae-7', time: '2026-03-08 10:00', actor: 'Morgan Patel', type: 'Settings', detail: 'Branding · Hero headline', account: '—' },
  { id: 'ae-8', time: '2026-03-07 09:12', actor: 'Alex Rivera', type: 'Billing', detail: 'Invoice PDF visibility · enabled', account: '—' },
  { id: 'ae-9', time: '2026-03-06 13:40', actor: 'Jordan Kim', type: 'User', detail: 'Added portal user', account: 'MLG-4402' },
  { id: 'ae-10', time: '2026-03-05 08:55', actor: 'Morgan Patel', type: 'Settings', detail: 'Payments · Saved methods policy', account: '—' },
];

export const defaultBranding = {
  heroTitle: 'Welcome to your service portal',
  heroSubtitle: 'Equipment, billing, and support in one place.',
  invoiceLabel: 'Invoice',
  serviceLabel: 'Service request',
};

/** Summit / Brightstone portal — admin white-label form defaults. */
export const summitPortalColors = {
  primaryHex: '#1c5490',
  accentHex: '#0d9488',
};

export const summitPortalLogoSrc = '/summit-logo-header.png';

/** Tesla enterprise demo portal — matches `/c/tesla` theme. */
export const teslaPortalColors = {
  primaryHex: '#171a20',
  accentHex: '#3e6ae1',
};

export const teslaPortalLogoSrc = '/branding/tesla-logo.png';

export const serviceRequestSettingsSeed = {
  poRequired: true,
  attachmentsAllowed: true,
  defaultType: 'Break / fix',
  showNonContractOption: false,
  customerVisibleFields: ['Device', 'Room / floor', 'Best callback window'],
};

export const paymentsSettingsSeed = {
  achEnabled: true,
  cardEnabled: true,
  showSavedMethods: true,
  pdfDownload: true,
  partialPay: true,
};

export const communicationsSettingsSeed = {
  bannerText: 'Meter reads due by the 5th. Submit readings in Equipment.',
  meterReminderDay: '5',
  serviceUpdatesEmail: true,
};

const hartwellLocations = [
  {
    id: 'loc-hq',
    name: 'Hartwell Medical Group · HQ',
    parentId: null,
    children: [
      { id: 'loc-north', name: 'North Clinic – Imaging', parentId: 'loc-hq' },
      { id: 'loc-north2', name: 'North Clinic – Lab', parentId: 'loc-hq' },
      { id: 'loc-south', name: 'South Campus', parentId: 'loc-hq' },
      { id: 'loc-south-er', name: 'South Campus · ER Copy Center', parentId: 'loc-south' },
      { id: 'loc-south-admin', name: 'South – Admin Annex', parentId: 'loc-south' },
      { id: 'loc-mobile', name: 'Mobile Unit (shared)', parentId: 'loc-hq' },
    ],
  },
];

const meridianLocationsFlat = [
  { id: 'ml-1', name: 'Meridian – Downtown (old signage: Apex Legal)', parentId: null },
  { id: 'ml-2', name: 'Meridian Copy / Satellite', parentId: null },
  { id: 'ml-3', name: 'Branch 3 – Billing address only?', parentId: null },
  { id: 'ml-4', name: 'Meridian West – same as Copy?', parentId: null },
];

export const adminCustomers = [
  {
    id: 'brightstone',
    company: 'Brightstone Law Group',
    accountId: 'BSG-2847',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Sarah Chen',
    billingEmail: 'billing@brightstonelaw.com',
    phone: '(555) 555-0123',
    portalUserCount: 4,
    lastPortalLogin: '2026-03-10 8:14 AM',
    openTickets: 2,
    overdueInvoiceCount: 1,
    unpaidTotal: 2944.5,
    portalStatus: 'Active',
    flags: { overdueAr: true, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [
      { id: 'bs-main', name: 'Main Office – 200 Park Ave', parentId: null },
      { id: 'bs-rec', name: 'Reception', parentId: 'bs-main' },
      { id: 'bs-leg', name: 'Legal – 3rd Floor', parentId: 'bs-main' },
    ],
    portalUsers: [
      { id: 'bsu-1', name: 'Sarah Chen', email: 'sarah.chen@brightstonelaw.com', role: 'Billing admin', locationIds: ['bs-main', 'bs-rec', 'bs-leg'], lastLogin: '2026-03-10' },
      { id: 'bsu-2', name: 'Michael Torres', email: 'm.torres@brightstonelaw.com', role: 'Office manager', locationIds: ['bs-main'], lastLogin: '2026-03-09' },
      { id: 'bsu-3', name: 'Jennifer Park', email: 'j.park@brightstonelaw.com', role: 'Read-only', locationIds: ['bs-rec'], lastLogin: '2026-03-02' },
    ],
    recentActivityAdmin: [
      { id: 'ra-b1', title: 'Payment posted', detail: '$325.50 · Invoice #84220', time: 'Mar 8, 2026' },
      { id: 'ra-b2', title: 'Ticket updated', detail: 'ST-9012 scheduled', time: 'Mar 6, 2026' },
      { id: 'ra-b3', title: 'Invoice issued', detail: '#84221 Toner supply', time: 'Mar 5, 2026' },
    ],
    useSharedFakeData: true,
    portalProfile: 'summit',
  },
  {
    id: 'tesla',
    company: 'Tesla',
    accountId: 'TSLA-2847',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Sarah Chen',
    billingEmail: 'billing@tesla.com',
    phone: '(555) 555-0123',
    portalUserCount: 4,
    lastPortalLogin: '2026-03-10 8:14 AM',
    openTickets: 2,
    overdueInvoiceCount: 1,
    unpaidTotal: 2944.5,
    portalStatus: 'Active',
    flags: { overdueAr: true, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [
      { id: 'tsla-pa-eng', name: 'Tesla Palo Alto – Engineering, Floor 3', parentId: null },
      { id: 'tsla-lv-front', name: 'Tesla Las Vegas Service & Delivery – Front desk', parentId: null },
      { id: 'tsla-fre-legal', name: 'Tesla Fremont – Legal & Compliance, Bldg D', parentId: null },
      { id: 'tsla-pa-fin', name: 'Tesla Palo Alto – Finance & AP, Floor 2', parentId: null },
      { id: 'tsla-gftx-hr', name: 'Tesla Austin Gigafactory – HR Office', parentId: null },
      { id: 'tsla-reno-ship', name: 'Tesla Reno Parts Distribution – Shipping office', parentId: null },
      { id: 'tsla-reno-lbl', name: 'Tesla Reno Parts Distribution – Label station, Dock 4', parentId: null },
      { id: 'tsla-slc-reg', name: 'Tesla Salt Lake City – Regional Operations', parentId: null },
      { id: 'tsla-bel-back', name: 'Tesla Bellevue Showroom – Back office', parentId: null },
      { id: 'tsla-sac-br', name: 'Tesla Sacramento Regional – Branch admin', parentId: null },
    ],
    portalUsers: [
      {
        id: 'tsu-1',
        name: 'Sarah Chen',
        email: 'sarah.chen@tesla.com',
        role: 'Fleet billing admin',
        locationIds: ['tsla-pa-eng', 'tsla-pa-fin', 'tsla-fre-legal'],
        lastLogin: '2026-03-10',
      },
      {
        id: 'tsu-2',
        name: 'Michael Torres',
        email: 'm.torres@tesla.com',
        role: 'Regional workplace services',
        locationIds: ['tsla-lv-front', 'tsla-reno-ship', 'tsla-reno-lbl'],
        lastLogin: '2026-03-09',
      },
      {
        id: 'tsu-3',
        name: 'Jennifer Park',
        email: 'j.park@tesla.com',
        role: 'Read-only',
        locationIds: ['tsla-slc-reg', 'tsla-bel-back'],
        lastLogin: '2026-03-02',
      },
    ],
    recentActivityAdmin: [
      { id: 'ra-t1', title: 'Payment posted', detail: '$325.50 · Invoice #84220', time: 'Mar 8, 2026' },
      { id: 'ra-t2', title: 'Ticket updated', detail: 'ST-9012 scheduled', time: 'Mar 6, 2026' },
      { id: 'ra-t3', title: 'Invoice issued', detail: '#84221 Toner supply', time: 'Mar 5, 2026' },
    ],
    useSharedFakeData: true,
    portalProfile: 'tesla',
  },
  {
    id: 'hartwell',
    company: 'Hartwell Medical Group',
    accountId: 'HMW-9910',
    type: 'parent',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Priya Nair',
    billingEmail: 'ap@hartwellmed.org',
    phone: '(555) 555-0201',
    portalUserCount: 8,
    lastPortalLogin: '2026-03-09 4:02 PM',
    openTickets: 5,
    overdueInvoiceCount: 0,
    unpaidTotal: 12840.0,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: true, messyLocationStructure: false },
    locationsTree: hartwellLocations,
    locations: [],
    portalUsers: [
      { id: 'hu-1', name: 'Priya Nair', email: 'hartwell@shared-mail.net', role: 'Portal admin', locationIds: ['loc-hq', 'loc-north', 'loc-north2', 'loc-south', 'loc-south-er', 'loc-south-admin', 'loc-mobile'], lastLogin: '2026-03-09', duplicateEmail: true },
      { id: 'hu-2', name: 'David Okonkwo', email: 'hartwell@shared-mail.net', role: 'Site lead', locationIds: ['loc-north', 'loc-north2'], lastLogin: '2026-03-08', duplicateEmail: true },
      { id: 'hu-3', name: 'Sam Lee', email: 's.lee@hartwellmed.org', role: 'Technician', locationIds: ['loc-south-er', 'loc-mobile'], lastLogin: '2026-03-07', duplicateEmail: false },
    ],
    recentActivityAdmin: [
      { id: 'ra-h1', title: 'User invite', detail: 'David Okonkwo · North', time: 'Mar 9, 2026' },
      { id: 'ra-h2', title: 'Meter read submitted', detail: 'South Campus · C5540', time: 'Mar 8, 2026' },
    ],
    useSharedFakeData: false,
  },
  {
    id: 'kessler',
    company: 'Kessler Engineering LLC',
    accountId: 'KSL-1182',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Noah Kessler',
    billingEmail: 'n.kessler@kesslereng.com',
    phone: '(555) 555-0330',
    portalUserCount: 0,
    lastPortalLogin: '—',
    openTickets: 0,
    overdueInvoiceCount: 0,
    unpaidTotal: 0,
    portalStatus: 'Invited',
    flags: { overdueAr: false, noPortalUsers: true, duplicateEmail: false, messyLocationStructure: false },
    locations: [{ id: 'ks-1', name: 'HQ – Industrial Way', parentId: null }],
    portalUsers: [],
    recentActivityAdmin: [{ id: 'ra-k1', title: 'Account created', detail: 'Portal invite sent · no acceptance', time: 'Mar 1, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'meridian',
    company: 'Meridian Legal Services',
    accountId: 'MLG-4402',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Elena Vasquez',
    billingEmail: 'billing@meridianlegal.com',
    phone: '(555) 555-0444',
    portalUserCount: 3,
    lastPortalLogin: '2026-02-26 11:20 AM',
    openTickets: 1,
    overdueInvoiceCount: 2,
    unpaidTotal: 4620.0,
    portalStatus: 'Active',
    flags: { overdueAr: true, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: true },
    locations: meridianLocationsFlat,
    portalUsers: [
      { id: 'mu-1', name: 'Elena Vasquez', email: 'e.vasquez@meridianlegal.com', role: 'Admin', locationIds: ['ml-1', 'ml-2', 'ml-3', 'ml-4'], lastLogin: '2026-02-26', duplicateEmail: false },
      { id: 'mu-2', name: 'Chris Avery', email: 'c.avery@meridianlegal.com', role: 'Billing', locationIds: ['ml-1'], lastLogin: '2026-02-20', duplicateEmail: false },
    ],
    recentActivityAdmin: [
      { id: 'ra-m1', title: 'Billing contact changed', detail: 'Primary AP email updated', time: 'Feb 28, 2026' },
      { id: 'ra-m2', title: 'Overdue notice', detail: '2 invoices > 30 days', time: 'Feb 22, 2026' },
    ],
    useSharedFakeData: false,
  },
  {
    id: 'redwood',
    company: 'Redwood Medical Center',
    accountId: 'RMC-7721',
    type: 'parent',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Dr. Anita Reese',
    billingEmail: 'ap@redwoodmed.org',
    phone: '(555) 555-0601',
    portalUserCount: 12,
    lastPortalLogin: '2026-03-12 7:45 AM',
    openTickets: 4,
    overdueInvoiceCount: 0,
    unpaidTotal: 4490.0,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [
      { id: 'rw-n', name: 'North Campus — Imaging', parentId: null },
      { id: 'rw-s', name: 'South Campus — ER Admin', parentId: null },
    ],
    portalUsers: [
      { id: 'rwu-1', name: 'Anita Reese', email: 'a.reese@redwoodmed.org', role: 'Admin', locationIds: ['rw-n', 'rw-s'], lastLogin: '2026-03-12' },
    ],
    recentActivityAdmin: [{ id: 'ra-rw1', title: 'Partial payment', detail: 'Wire posted · INV-2026-088800', time: 'Mar 20, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'northwind',
    company: 'Northwind Logistics',
    accountId: 'NWL-5500',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Marcus Webb',
    billingEmail: 'ap@northwindlogistics.com',
    phone: '(555) 555-0702',
    portalUserCount: 6,
    lastPortalLogin: '2026-03-11 2:18 PM',
    openTickets: 1,
    overdueInvoiceCount: 0,
    unpaidTotal: 2254.4,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [{ id: 'nw-1', name: 'Regional HQ — Distribution wing', parentId: null }],
    portalUsers: [{ id: 'nwu-1', name: 'Marcus Webb', email: 'm.webb@northwindlogistics.com', role: 'Admin', locationIds: ['nw-1'], lastLogin: '2026-03-11' }],
    recentActivityAdmin: [{ id: 'ra-nw1', title: 'Order shipped', detail: 'Supplies · ORD-2026-087654', time: 'Mar 22, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'blue-peak',
    company: 'Blue Peak Manufacturing',
    accountId: 'BPM-3391',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Linda Cho',
    billingEmail: 'ap@bluepeakmfg.com',
    phone: '(555) 555-0803',
    portalUserCount: 5,
    lastPortalLogin: '2026-03-08 9:00 AM',
    openTickets: 3,
    overdueInvoiceCount: 1,
    unpaidTotal: 11300.75,
    portalStatus: 'Active',
    flags: { overdueAr: true, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [
      { id: 'bp-hq', name: 'HQ — Industrial Way', parentId: null },
      { id: 'bp-p2', name: 'Plant 2 — Receiving', parentId: null },
    ],
    portalUsers: [{ id: 'bpu-1', name: 'Linda Cho', email: 'l.cho@bluepeakmfg.com', role: 'Billing', locationIds: ['bp-hq', 'bp-p2'], lastLogin: '2026-03-08' }],
    recentActivityAdmin: [{ id: 'ra-bp1', title: 'Lease true-up', detail: 'Past due · follow-up call', time: 'Mar 4, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'wasatch',
    company: 'Wasatch Property Group',
    accountId: 'WPG-2104',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Greg Halstrom',
    billingEmail: 'gh@wasatchproperty.com',
    phone: '(555) 555-0904',
    portalUserCount: 2,
    lastPortalLogin: '2026-03-05 11:00 AM',
    openTickets: 0,
    overdueInvoiceCount: 0,
    unpaidTotal: 0,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: true },
    locations: [{ id: 'wp-1', name: 'Salt Lake — Leasing office', parentId: null }],
    portalUsers: [{ id: 'wpu-1', name: 'Greg Halstrom', email: 'gh@wasatchproperty.com', role: 'Admin', locationIds: ['wp-1'], lastLogin: '2026-03-05' }],
    recentActivityAdmin: [{ id: 'ra-wp1', title: 'Meter read', detail: 'Submitted · all devices', time: 'Mar 4, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'cornerstone',
    company: 'Cornerstone Dental',
    accountId: 'CSD-8840',
    type: 'standalone',
    parentId: null,
    parentCompany: null,
    primaryContact: 'Dr. Emily Frost',
    billingEmail: 'office@cornerstonedental.com',
    phone: '(555) 555-1005',
    portalUserCount: 3,
    lastPortalLogin: '2026-03-14 3:30 PM',
    openTickets: 1,
    overdueInvoiceCount: 0,
    unpaidTotal: 412.0,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [{ id: 'cs-1', name: 'Main clinic — Front desk', parentId: null }],
    portalUsers: [{ id: 'csu-1', name: 'Emily Frost', email: 'e.frost@cornerstonedental.com', role: 'Admin', locationIds: ['cs-1'], lastLogin: '2026-03-14' }],
    recentActivityAdmin: [{ id: 'ra-cs1', title: 'Service completed', detail: 'Finisher · closed', time: 'Mar 12, 2026' }],
    useSharedFakeData: false,
  },
  {
    id: 'north-valley',
    company: 'North Valley Schools',
    accountId: 'NVS-1022',
    type: 'child',
    parentId: null,
    parentCompany: 'North Valley ISD (finance)',
    primaryContact: 'Teresa Molina',
    billingEmail: 'tmolina@northvalley.edu',
    phone: '(555) 555-1106',
    portalUserCount: 9,
    lastPortalLogin: '2026-03-13 8:05 AM',
    openTickets: 2,
    overdueInvoiceCount: 0,
    unpaidTotal: 1890.0,
    portalStatus: 'Active',
    flags: { overdueAr: false, noPortalUsers: false, duplicateEmail: false, messyLocationStructure: false },
    locations: [
      { id: 'nv-1', name: 'District office', parentId: null },
      { id: 'nv-2', name: 'High school — Library', parentId: null },
    ],
    portalUsers: [{ id: 'nvu-1', name: 'Teresa Molina', email: 'tmolina@northvalley.edu', role: 'Admin', locationIds: ['nv-1', 'nv-2'], lastLogin: '2026-03-13' }],
    recentActivityAdmin: [{ id: 'ra-nv1', title: 'Supplies order', detail: 'Delivered to district office', time: 'Mar 10, 2026' }],
    useSharedFakeData: false,
  },
];

export function getAdminCustomer(id) {
  return adminCustomers.find((c) => c.id === id) ?? null;
}

export function flattenLocationsForCustomer(customer) {
  if (customer.locationsTree?.length) {
    const out = [];
    const walk = (nodes, depth = 0) => {
      for (const n of nodes) {
        out.push({ ...n, depth, isTree: true });
        if (n.children?.length) walk(n.children, depth + 1);
      }
    };
    walk(customer.locationsTree);
    return out;
  }
  return (customer.locations || []).map((l) => ({ ...l, depth: 0, isTree: false }));
}

export function locationNameById(customer, id) {
  const flat = flattenLocationsForCustomer(customer);
  const row = flat.find((l) => l.id === id);
  return row?.name ?? id;
}

export { dealer, formatCurrency, formatDate };
