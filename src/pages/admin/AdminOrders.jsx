import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../data/adminMockData';
import { ADMIN_CUSTOMER_ROUTE_IDS } from '../../data/adminOrdersData';
import {
  AI_ORDER_INSIGHTS,
  ORDER_CUSTOMER_OPTIONS,
  ORDER_LOCATIONS,
  ORDER_STATUS_OPTIONS,
  ORDER_TYPE_OPTIONS,
  compareOrdersByStatus,
  computeOrderSummary,
  globalOrders,
  isOpenOrder,
  orderInLastWeek,
  orderTypeLabel,
  statusLabel,
  topCustomersByOrderCount,
} from '../../data/adminOrdersData';
import { globalServiceCalls, isOpenGlobalCall } from '../../data/adminGlobalServiceData';
import AdminInsightsRail from '../../components/AdminInsightsRail';
import './adminPages.css';
import './AdminOrders.css';

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'value', label: 'Largest order value' },
  { key: 'status', label: 'Status' },
];

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function orderSearchBlob(o) {
  const itemBits = o.items.map((i) => [i.name, i.equipmentNumber].filter(Boolean).join(' ')).join(' ');
  return [o.orderNumber, o.customerName, o.itemsSummary, itemBits].join(' ').toLowerCase();
}

function statusChipClass(key) {
  if (key === 'processing') return 'admin-orders-chip--processing';
  if (key === 'shipped') return 'admin-orders-chip--shipped';
  if (key === 'delivered') return 'admin-orders-chip--delivered';
  if (key === 'backordered') return 'admin-orders-chip--backordered';
  if (key === 'delayed') return 'admin-orders-chip--delayed';
  return 'admin-orders-chip--processing';
}

function lineStatusClass(ls) {
  if (ls === 'backordered') return 'admin-orders-line-warn';
  if (ls === 'delayed') return 'admin-orders-line-bad';
  return 'admin-orders-line-ok';
}

function lineStatusText(ls) {
  if (ls === 'backordered') return 'Backordered';
  if (ls === 'delayed') return 'Delayed';
  return 'OK';
}

function buildFulfillmentSteps(order) {
  const k = order.statusKey;
  const steps = [
    { key: 'sub', label: 'Order submitted', done: true, current: false },
    {
      key: 'proc',
      label: 'Processing',
      done: ['processing', 'shipped', 'delivered', 'backordered', 'delayed'].includes(k),
      current: false,
    },
    {
      key: 'ship',
      label: 'Shipped',
      done: ['shipped', 'delivered'].includes(k),
      current: false,
    },
    { key: 'del', label: 'Delivered', done: k === 'delivered', current: false },
  ];
  if (k === 'backordered' || k === 'delayed' || k === 'processing') steps[1].current = true;
  else if (k === 'shipped') steps[2].current = true;
  else if (k === 'delivered') steps[3].current = true;
  return steps;
}

export default function AdminOrders() {
  const [selectedId, setSelectedId] = useState(globalOrders[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [customerId, setCustomerId] = useState('all');
  const [statusKey, setStatusKey] = useState('all');
  const [orderType, setOrderType] = useState('all');
  const [location, setLocation] = useState('all');
  const [contract, setContract] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [summaryPreset, setSummaryPreset] = useState(null);
  const [sortKey, setSortKey] = useState('newest');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const summary = useMemo(() => computeOrderSummary(globalOrders), []);
  const topByCustomer = useMemo(() => topCustomersByOrderCount(globalOrders), []);
  const topCustomerNames = useMemo(() => new Set(topByCustomer.map((t) => t.name)), [topByCustomer]);

  const filtered = useMemo(() => {
    let list = [...globalOrders];
    const q = searchQuery.trim().toLowerCase();

    if (summaryPreset === 'open') list = list.filter(isOpenOrder);
    else if (summaryPreset === 'processing') list = list.filter((o) => o.statusKey === 'processing');
    else if (summaryPreset === 'shipped') list = list.filter((o) => o.statusKey === 'shipped');
    else if (summaryPreset === 'delivered') list = list.filter((o) => o.statusKey === 'delivered');
    else if (summaryPreset === 'backordered') list = list.filter((o) => o.statusKey === 'backordered');
    else if (summaryPreset === 'delayed') list = list.filter((o) => o.statusKey === 'delayed');
    else if (summaryPreset === 'week') list = list.filter((o) => orderInLastWeek(o.orderDate));
    else if (summaryPreset === 'high_value') list = list.filter((o) => o.total >= 5000);
    else if (summaryPreset === 'top_accounts') list = list.filter((o) => topCustomerNames.has(o.customerName));

    if (q) {
      list = list.filter((o) => orderSearchBlob(o).includes(q));
    }
    if (customerId !== 'all') list = list.filter((o) => o.customerId === customerId);
    if (statusKey !== 'all') list = list.filter((o) => o.statusKey === statusKey);
    if (orderType !== 'all') list = list.filter((o) => o.orderType === orderType);
    if (location !== 'all') list = list.filter((o) => o.location === location);
    if (contract !== 'all') list = list.filter((o) => o.contractBilling === contract);

    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((o) => new Date(o.orderDate) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((o) => new Date(o.orderDate) <= to);
    }

    list.sort((a, b) => {
      if (sortKey === 'newest') return new Date(b.orderDate) - new Date(a.orderDate);
      if (sortKey === 'oldest') return new Date(a.orderDate) - new Date(b.orderDate);
      if (sortKey === 'value') return b.total - a.total;
      if (sortKey === 'status') return compareOrdersByStatus(a, b);
      return 0;
    });

    return list;
  }, [
    searchQuery,
    customerId,
    statusKey,
    orderType,
    location,
    contract,
    dateFrom,
    dateTo,
    summaryPreset,
    sortKey,
    topCustomerNames,
  ]);

  const selected = useMemo(() => globalOrders.find((o) => o.id === selectedId) ?? null, [selectedId]);

  const relatedOrders = useMemo(() => {
    if (!selected) return [];
    return globalOrders
      .filter((o) => o.customerId === selected.customerId && o.id !== selected.id)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);
  }, [selected]);

  const openCallsForCustomer = useMemo(() => {
    if (!selected) return [];
    return globalServiceCalls.filter((c) => c.customerName === selected.customerName && isOpenGlobalCall(c)).slice(0, 4);
  }, [selected]);

  useEffect(() => {
    if (selectedId && filtered.some((o) => o.id === selectedId)) return;
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId]);

  function clearAllFilters() {
    setSearchQuery('');
    setCustomerId('all');
    setStatusKey('all');
    setOrderType('all');
    setLocation('all');
    setContract('all');
    setDateFrom('');
    setDateTo('');
    setSummaryPreset(null);
    setSortKey('newest');
  }

  const hasActiveFilters =
    searchQuery.trim() ||
    customerId !== 'all' ||
    statusKey !== 'all' ||
    orderType !== 'all' ||
    location !== 'all' ||
    contract !== 'all' ||
    dateFrom ||
    dateTo ||
    summaryPreset;

  const chips = [];
  const presetLabels = {
    open: 'Open orders',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    backordered: 'Backordered',
    delayed: 'Delayed',
    week: 'Orders this week',
    high_value: 'High-value orders',
    top_accounts: 'Top customers by volume',
  };
  if (summaryPreset) {
    chips.push({ key: 'preset', label: presetLabels[summaryPreset] ?? summaryPreset, clear: () => setSummaryPreset(null) });
  }
  if (customerId !== 'all') {
    const name = ORDER_CUSTOMER_OPTIONS.find((c) => c.id === customerId)?.name;
    chips.push({ key: 'cust', label: `Customer: ${name}`, clear: () => setCustomerId('all') });
  }
  if (statusKey !== 'all') {
    chips.push({
      key: 'st',
      label: `Status: ${statusLabel(statusKey)}`,
      clear: () => setStatusKey('all'),
    });
  }
  if (orderType !== 'all') {
    chips.push({ key: 'ot', label: `Type: ${orderTypeLabel(orderType)}`, clear: () => setOrderType('all') });
  }
  if (location !== 'all') chips.push({ key: 'loc', label: `Location: ${location}`, clear: () => setLocation('all') });
  if (contract !== 'all') {
    chips.push({
      key: 'co',
      label: `Contract: ${contract === 'contract' ? 'Contract' : 'Non-contract'}`,
      clear: () => setContract('all'),
    });
  }
  if (dateFrom) chips.push({ key: 'df', label: `From ${dateFrom}`, clear: () => setDateFrom('') });
  if (dateTo) chips.push({ key: 'dt', label: `To ${dateTo}`, clear: () => setDateTo('') });
  if (searchQuery.trim()) chips.push({ key: 'q', label: `Search: “${searchQuery.trim()}”`, clear: () => setSearchQuery('') });

  return (
    <div className="admin-page admin-orders">
      <header className="admin-page-header admin-orders-header">
        <div>
          <h1>Orders</h1>
          <p className="admin-page-subtitle">View and track customer orders across all accounts.</p>
        </div>
        <div className="admin-orders-header-actions">
          <button type="button" className="admin-btn" disabled title="Demo only — not connected to ordering systems">
            Create order
          </button>
          <a
            className="admin-btn admin-btn-primary"
            href="https://www.ecisolutions.com"
            target="_blank"
            rel="noreferrer"
          >
            Open in EvolutionX
          </a>
        </div>
      </header>

      <AdminInsightsRail items={AI_ORDER_INSIGHTS} />

      <div className="admin-kpi-grid admin-orders-kpis">
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'open' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'open' ? null : 'open'))}
        >
          <p className="admin-kpi-label">Open orders</p>
          <p className="admin-kpi-value">{summary.open}</p>
          <p className="admin-kpi-meta">Not yet delivered</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'processing' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'processing' ? null : 'processing'))}
        >
          <p className="admin-kpi-label">Processing</p>
          <p className="admin-kpi-value">{summary.processing}</p>
          <p className="admin-kpi-meta">Preparing to ship</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'shipped' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'shipped' ? null : 'shipped'))}
        >
          <p className="admin-kpi-label">Shipped</p>
          <p className="admin-kpi-value">{summary.shipped}</p>
          <p className="admin-kpi-meta">In transit</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'delivered' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'delivered' ? null : 'delivered'))}
        >
          <p className="admin-kpi-label">Delivered</p>
          <p className="admin-kpi-value">{summary.delivered}</p>
          <p className="admin-kpi-meta">Completed</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'backordered' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'backordered' ? null : 'backordered'))}
        >
          <p className="admin-kpi-label">Backordered</p>
          <p className="admin-kpi-value">{summary.backordered}</p>
          <p className="admin-kpi-meta">Stock or allocation hold</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'delayed' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'delayed' ? null : 'delayed'))}
        >
          <p className="admin-kpi-label">Delayed</p>
          <p className="admin-kpi-value">{summary.delayed}</p>
          <p className="admin-kpi-meta">Later than expected</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'week' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'week' ? null : 'week'))}
        >
          <p className="admin-kpi-label">Orders this week</p>
          <p className="admin-kpi-value">{summary.this_week}</p>
          <p className="admin-kpi-meta">Last 7 days</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi ${summaryPreset === 'high_value' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'high_value' ? null : 'high_value'))}
        >
          <p className="admin-kpi-label">High-value orders</p>
          <p className="admin-kpi-value">{summary.high_value}</p>
          <p className="admin-kpi-meta">$5,000+ (demo rule)</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-orders-kpi admin-orders-kpi--wide ${summaryPreset === 'top_accounts' ? 'admin-orders-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'top_accounts' ? null : 'top_accounts'))}
        >
          <p className="admin-kpi-label">Customers with the most orders</p>
          <p className="admin-orders-top-customers">
            {topByCustomer.map((t) => (
              <span key={t.name}>
                {t.name} <strong>({t.count})</strong>
              </span>
            ))}
          </p>
          <p className="admin-kpi-meta">Click to filter to those accounts</p>
        </button>
      </div>

      <section className="admin-toolbar" aria-label="Search and filters">
        <div className="admin-toolbar-search-row">
          <label className="admin-toolbar-search">
            <span className="sr-only">Search orders</span>
            <svg className="admin-toolbar-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="admin-orders-search"
              type="search"
              className="admin-toolbar-search-input"
              placeholder="Order #, customer, item, equipment #…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <select
            id="admin-orders-sort"
            className="admin-toolbar-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort orders"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`admin-toolbar-filter-toggle ${filtersExpanded ? 'admin-toolbar-filter-toggle--open' : ''}`}
            onClick={() => setFiltersExpanded((v) => !v)}
            aria-expanded={filtersExpanded}
          >
            Filters
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className={`admin-toolbar-filter-panel ${filtersExpanded ? 'admin-toolbar-filter-panel--open' : ''}`}>
          <div className="admin-toolbar-filters-grid">
            <div className="admin-toolbar-field">
              <label htmlFor="fo-cust">Customer</label>
              <select id="fo-cust" className="admin-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="all">All customers</option>
                {ORDER_CUSTOMER_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fo-st">Order status</label>
              <select id="fo-st" className="admin-select" value={statusKey} onChange={(e) => setStatusKey(e.target.value)}>
                <option value="all">All statuses</option>
                {ORDER_STATUS_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fo-type">Order type</label>
              <select id="fo-type" className="admin-select" value={orderType} onChange={(e) => setOrderType(e.target.value)}>
                <option value="all">All types</option>
                {ORDER_TYPE_OPTIONS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fo-loc">Location</label>
              <select id="fo-loc" className="admin-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All locations</option>
                {ORDER_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fo-contract">Contract</label>
              <select id="fo-contract" className="admin-select" value={contract} onChange={(e) => setContract(e.target.value)}>
                <option value="all">All</option>
                <option value="contract">Contract</option>
                <option value="non_contract">Non-contract</option>
              </select>
            </div>
            <div className="admin-toolbar-field admin-toolbar-field--dates">
              <label htmlFor="fo-df">Order date</label>
              <div className="admin-toolbar-date-range">
                <input id="fo-df" type="date" className="admin-input admin-toolbar-date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <span className="admin-toolbar-date-sep">to</span>
                <input type="date" className="admin-input admin-toolbar-date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="Order date to" />
              </div>
            </div>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="admin-toolbar-chips">
            <span className="admin-toolbar-chips-label">Active filters</span>
            <div className="admin-audit-filters">
              {chips.map((ch) => (
                <button key={ch.key + ch.label} type="button" className="admin-chip admin-filter-chip admin-filter-chip-on" onClick={ch.clear}>
                  {ch.label}
                  <span className="admin-toolbar-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              ))}
            </div>
            <button type="button" className="admin-btn admin-btn-ghost admin-toolbar-clear" onClick={clearAllFilters}>
              Clear all
            </button>
          </div>
        )}

        {!hasActiveFilters && (
          <p className="admin-toolbar-filter-hint">Showing {filtered.length} of {globalOrders.length} orders (demo data).</p>
        )}
        {hasActiveFilters && (
          <p className="admin-toolbar-filter-hint">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} ·{' '}
            <button type="button" className="admin-toolbar-link-inline" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </p>
        )}
      </section>

      <div className="admin-orders-split">
        <div className="admin-orders-list-panel">
          <div className="admin-table-wrap admin-orders-table-wrap">
            <table className="admin-table admin-orders-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Type</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Order date</th>
                  <th>Expected delivery</th>
                  <th>Total</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className={`${selectedId === row.id ? 'admin-orders-row--selected' : ''} ${
                      row.statusKey === 'backordered' || row.statusKey === 'delayed' ? 'admin-orders-row--issue' : ''
                    }`}
                    onClick={() => setSelectedId(row.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedId(row.id);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-selected={selectedId === row.id}
                  >
                    <td>
                      <span className="admin-orders-num">{row.orderNumber}</span>
                    </td>
                    <td>
                      <span className="admin-orders-customer">{row.customerName}</span>
                    </td>
                    <td>
                      <span className="admin-chip admin-chip-neutral">{orderTypeLabel(row.orderType)}</span>
                    </td>
                    <td>
                      <span className="admin-orders-items-cell">{row.itemsSummary}</span>
                    </td>
                    <td>
                      <span className={`admin-orders-chip ${statusChipClass(row.statusKey)}`}>{statusLabel(row.statusKey)}</span>
                    </td>
                    <td>{formatDateShort(row.orderDate)}</td>
                    <td>{formatDateShort(row.expectedDelivery)}</td>
                    <td>{row.total > 0 ? formatCurrency(row.total) : '—'}</td>
                    <td>
                      <span className="admin-orders-loc">{row.location}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <p className="admin-orders-empty">No orders match these filters. Try clearing a filter or search.</p>}
        </div>

        <aside className="admin-orders-detail" aria-label="Order detail">
          {selected ? (
            <>
              <div className="admin-orders-detail-head">
                <div>
                  <p className="admin-orders-detail-eyebrow">Order</p>
                  <h2 className="admin-orders-detail-title">{selected.orderNumber}</h2>
                  <p className="admin-orders-detail-customer">
                    {ADMIN_CUSTOMER_ROUTE_IDS.has(selected.customerId) ? (
                      <Link to={`/admin/customers/${selected.customerId}`} className="admin-table-link">
                        {selected.customerName}
                      </Link>
                    ) : (
                      selected.customerName
                    )}
                  </p>
                </div>
                <div>
                  <span className={`admin-orders-chip ${statusChipClass(selected.statusKey)}`}>{statusLabel(selected.statusKey)}</span>
                </div>
              </div>

              <div className="admin-orders-detail-body">
                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Overview</h3>
                  <dl className="admin-orders-dl">
                    <div>
                      <dt>Order date</dt>
                      <dd>{formatDateShort(selected.orderDate)}</dd>
                    </div>
                    <div>
                      <dt>Expected delivery</dt>
                      <dd>{formatDateShort(selected.expectedDelivery)}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{selected.location}</dd>
                    </div>
                    <div>
                      <dt>Order type</dt>
                      <dd>{orderTypeLabel(selected.orderType)}</dd>
                    </div>
                    <div>
                      <dt>Billing</dt>
                      <dd>{selected.contractBilling === 'contract' ? 'Contract' : 'Non-contract'}</dd>
                    </div>
                    <div>
                      <dt>Total</dt>
                      <dd>{selected.total > 0 ? formatCurrency(selected.total) : '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Line items</h3>
                  <table className="admin-orders-items-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Equipment #</th>
                        <th>Line status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items.map((line, idx) => (
                        <tr key={`${line.name}-${idx}`}>
                          <td>{line.name}</td>
                          <td>{line.qty}</td>
                          <td>{line.equipmentNumber ?? '—'}</td>
                          <td className={lineStatusClass(line.lineStatus)}>{lineStatusText(line.lineStatus)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Fulfillment</h3>
                  <ul className="admin-orders-timeline">
                    {buildFulfillmentSteps(selected).map((step) => (
                      <li key={step.key}>
                        <span
                          className={`admin-orders-tl-dot ${step.done ? 'admin-orders-tl-dot--done' : ''} ${step.current ? 'admin-orders-tl-dot--current' : ''}`}
                          aria-hidden
                        />
                        <div>
                          <div className="admin-orders-tl-label">{step.label}</div>
                          {step.current && <div className="admin-orders-tl-meta">Current stage (demo)</div>}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Shipping</h3>
                  <dl className="admin-orders-dl">
                    <div>
                      <dt>Carrier</dt>
                      <dd>{selected.carrier}</dd>
                    </div>
                    <div>
                      <dt>Tracking</dt>
                      <dd>{selected.trackingNumber && selected.trackingNumber !== '—' ? selected.trackingNumber : '— (prototype)'}</dd>
                    </div>
                    <div>
                      <dt>Notes</dt>
                      <dd>{selected.shipNote ?? '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Other recent orders</h3>
                  {relatedOrders.length === 0 ? (
                    <p className="admin-orders-muted">No other orders for this customer in the demo set.</p>
                  ) : (
                    <ul className="admin-orders-related-list">
                      {relatedOrders.map((o) => (
                        <li key={o.id}>
                          <button type="button" onClick={() => setSelectedId(o.id)}>
                            {o.orderNumber}
                          </button>
                          <span className="admin-orders-muted">{formatDateShort(o.orderDate)}</span>
                          <span className={`admin-orders-chip ${statusChipClass(o.statusKey)}`}>{statusLabel(o.statusKey)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="admin-orders-detail-section">
                  <h3 className="admin-section-title">Open service calls</h3>
                  {openCallsForCustomer.length === 0 ? (
                    <p className="admin-orders-muted">No open calls for this customer in demo service data.</p>
                  ) : (
                    <ul className="admin-orders-related-list">
                      {openCallsForCustomer.map((c) => (
                        <li key={c.id}>
                          <Link to="/admin/service" className="admin-table-link">
                            {c.callNumber}
                          </Link>
                          <span>{c.statusLabel}</span>
                          <span className="admin-orders-muted">{c.issueSummary}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="admin-orders-muted" style={{ marginTop: 8 }}>
                    <Link to="/admin/service">Open Service</Link> for full ticket detail (prototype).
                  </p>
                </div>

                <div className="admin-orders-detail-section">
                  <p className="admin-orders-muted">
                    Ordering and inventory changes belong in{' '}
                    <a href="https://www.ecisolutions.com" target="_blank" rel="noreferrer">
                      EvolutionX
                    </a>
                    . This view is read-only visibility for account teams.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="admin-orders-detail-empty">
              <p>Select an order to view details.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
