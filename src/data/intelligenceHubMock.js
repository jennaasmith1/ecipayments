// Mock data for dealer Intelligence Hub (demo only)

export const intelligenceHubNeedsReview = [
  {
    id: 'nr-1',
    title: 'Repeated equipment failure',
    body:
      'MFP cluster at Meridian Legal is failing 4× the fleet average. AI paused billing accrual on affected contracts until root cause is confirmed.',
    severity: 'critical',
    tags: ['Billing accuracy'],
  },
  {
    id: 'nr-2',
    title: 'Cold storage units approaching warranty expiry',
    body:
      '12 units across 4 accounts expire in 45 days. Pre-warranty inspections could avoid unplanned downtime claims.',
    severity: 'warning',
    tags: ['Warranty review'],
  },
  {
    id: 'nr-3',
    title: 'Unusual maintenance spend on single site',
    body:
      'Riverside Clinic east wing is 2.3× regional average this quarter. Possible candidate for equipment refresh vs continued service.',
    severity: 'warning',
    tags: ['Service'],
  },
];

export const intelligenceHubQuickCommands = [
  {
    id: 'qc-1',
    category: 'Operations',
    prompt: 'Create a new service call for Route 66 BBQ',
  },
  {
    id: 'qc-2',
    category: 'Analytics',
    prompt: 'Show me the top 10 most serviced kitchen equipment in Q3',
  },
  {
    id: 'qc-3',
    category: 'Procurement',
    prompt: 'Order replacement condenser coils for walk-in freezers',
  },
];

export const intelligenceHubKpis = [
  { id: 'k1', label: 'Monthly revenue', value: '$2.4M', trend: '12.5%', trendDir: 'up' },
  { id: 'k2', label: 'Service margin (gross)', value: '81.3%', trend: '3.1%', trendDir: 'down' },
  { id: 'k3', label: 'Unbilled revenue / overages', value: '$164K', trend: '12.5%', trendDir: 'up' },
  { id: 'k4', label: 'Avg resolution time', value: '2.7 hrs', trend: '8.2%', trendDir: 'up' },
  { id: 'k5', label: 'Customer satisfaction', value: '94.2%', trend: '2.1%', trendDir: 'up' },
  { id: 'k6', label: 'First-time fix rate', value: '76.5%', trend: '12.5%', trendDir: 'down' },
];

export const intelligenceHubServicePlan = {
  premiumPct: 62,
  premiumCount: 155,
  basicPct: 38,
  basicCount: 98,
  aiSuggestion:
    'AI suggests sending a cost-saving comparison to 29 Basic plan customers who exceeded included maintenance visits last quarter.',
};

/** Normalized 0–100 for chart height */
export const intelligenceHubMarginLaborTrend = [
  { month: 'Jan', margin: 72, labor: 28 },
  { month: 'Feb', margin: 70, labor: 30 },
  { month: 'Mar', margin: 68, labor: 32 },
  { month: 'Apr', margin: 65, labor: 35 },
  { month: 'May', margin: 62, labor: 37 },
  { month: 'Jun', margin: 60, labor: 39 },
  { month: 'Jul', margin: 58, labor: 41 },
];

export const intelligenceHubVanInventory = [
  { id: 'v1', name: 'Jake – Van #342', stale: 19500, total: 31450 },
  { id: 'v2', name: 'Maria – Truck #118', stale: 8200, total: 29400 },
  { id: 'v3', name: 'Devon – Van #207', stale: 12900, total: 25200 },
  { id: 'v4', name: 'Chris – Van #151', stale: 11800, total: 25200 },
];

export const intelligenceHubActivityInProgress = [
  { id: 'ip-1', title: 'Reviewing maintenance contract uptime', progress: 0.72, remaining: '3 min remaining' },
  { id: 'ip-2', title: 'Monitoring parts stock levels', progress: 0.35, remaining: '8 min remaining' },
  { id: 'ip-3', title: 'Analyzing post-service surveys', progress: 0.18, remaining: '32 min remaining' },
  { id: 'ip-4', title: 'Auto re-ordering parts', progress: 0.08, remaining: '18 min remaining' },
];

export const intelligenceHubActivityRecent = [
  { id: 'ra-1', title: 'Processed 324 invoices', time: '3 min ago', detail: 'Saved 8.5 hours' },
  { id: 'ra-2', title: 'Resolved 18 duplicate records', time: '15 min ago', detail: 'Data accuracy +2.1%' },
  { id: 'ra-3', title: 'Closed 17 service tickets', time: '32 min ago', detail: 'Saved 8.5 hours' },
];

export const intelligenceHubScheduled = [
  { id: 'sc-1', title: 'Technician route efficiency audit', when: 'Tomorrow 6:00 AM' },
  { id: 'sc-2', title: 'Parts reorder threshold audit', when: 'Friday 9:00 AM' },
  { id: 'sc-3', title: 'Performance report generation', when: 'Monday 8:00 AM' },
];
