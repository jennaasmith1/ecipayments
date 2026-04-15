import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../../data/adminMockData';
import {
  BILLING_CUSTOMER_OPTIONS,
  BILLING_LOCATIONS,
  BILLING_REFERENCE,
  compareInvoiceStatus,
  computeBillingSummary,
  globalInvoices,
  INVOICE_STATUS_OPTIONS,
  isDueSoon,
  isPaidInPeriod,
  statusLabel,
  daysUntilDue,
} from '../../data/adminBillingData';
import './adminPages.css';
import './AdminBilling.css';

const SORT_OPTIONS = [
  { key: 'due_date', label: 'Due date' },
  { key: 'invoice_date', label: 'Invoice date' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
];

const DUE_PRESET_OPTIONS = [
  { key: 'any', label: 'Any due date' },
  { key: 'overdue', label: 'Overdue (past due)' },
  { key: 'next7', label: 'Due in the next 7 days' },
  { key: 'next30', label: 'Due in the next 30 days' },
];

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function invoiceSearchBlob(inv) {
  return [inv.invoiceNumber, inv.customerName, inv.poNumber || ''].join(' ').toLowerCase();
}

function statusClass(key) {
  if (key === 'paid') return 'admin-billing-status--paid';
  if (key === 'open') return 'admin-billing-status--open';
  if (key === 'overdue') return 'admin-billing-status--overdue';
  if (key === 'partial') return 'admin-billing-status--partial';
  return 'admin-billing-status--open';
}

function matchesDuePreset(inv, duePreset) {
  if (duePreset === 'any') return true;
  const d = daysUntilDue(inv.dueDate);
  if (inv.balance <= 0) return duePreset === 'any';
  if (duePreset === 'overdue') return d < 0;
  if (duePreset === 'next7') return d >= 0 && d <= 7;
  if (duePreset === 'next30') return d >= 0 && d <= 30;
  return true;
}

export default function AdminBilling() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerId, setCustomerId] = useState('all');
  const [statusKey, setStatusKey] = useState('all');
  const [location, setLocation] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [duePreset, setDuePreset] = useState('any');
  const [summaryPreset, setSummaryPreset] = useState('outstanding');
  const [sortKey, setSortKey] = useState('due_date');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [kpisExpanded, setKpisExpanded] = useState(false);

  const summary = useMemo(() => computeBillingSummary(globalInvoices), []);
  const ref = BILLING_REFERENCE;
  const weekStart = useMemo(() => {
    const d = new Date(ref);
    d.setDate(d.getDate() - 7);
    return d;
  }, [ref]);
  const monthStart = useMemo(() => {
    const d = new Date(ref);
    d.setDate(d.getDate() - 30);
    return d;
  }, [ref]);

  const filtered = useMemo(() => {
    let list = [...globalInvoices];
    const q = searchQuery.trim().toLowerCase();

    if (summaryPreset === 'outstanding') list = list.filter((i) => i.balance > 0);
    else if (summaryPreset === 'overdue') list = list.filter((i) => i.statusKey === 'overdue');
    else if (summaryPreset === 'due_soon') list = list.filter((i) => isDueSoon(i, 14));
    else if (summaryPreset === 'paid_week') {
      list = list.filter((i) => i.statusKey === 'paid' && isPaidInPeriod(i, weekStart, ref));
    } else if (summaryPreset === 'paid_month') {
      list = list.filter((i) => i.statusKey === 'paid' && isPaidInPeriod(i, monthStart, ref));
    } else if (summaryPreset === 'total_count') {
      /* show all */
    }

    if (q) list = list.filter((i) => invoiceSearchBlob(i).includes(q));
    if (customerId !== 'all') list = list.filter((i) => i.customerId === customerId);
    if (statusKey !== 'all') list = list.filter((i) => i.statusKey === statusKey);
    if (location !== 'all') list = list.filter((i) => i.location === location);
    if (duePreset !== 'any') list = list.filter((i) => matchesDuePreset(i, duePreset));

    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((i) => new Date(i.invoiceDate) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((i) => new Date(i.invoiceDate) <= to);
    }

    list.sort((a, b) => {
      if (sortKey === 'due_date') return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortKey === 'invoice_date') return new Date(b.invoiceDate) - new Date(a.invoiceDate);
      if (sortKey === 'amount') return b.total - a.total;
      if (sortKey === 'status') return compareInvoiceStatus(a, b);
      return 0;
    });

    return list;
  }, [
    searchQuery,
    customerId,
    statusKey,
    location,
    dateFrom,
    dateTo,
    duePreset,
    summaryPreset,
    sortKey,
    weekStart,
    monthStart,
    ref,
  ]);

  function clearAllFilters() {
    setSearchQuery('');
    setCustomerId('all');
    setStatusKey('all');
    setLocation('all');
    setDateFrom('');
    setDateTo('');
    setDuePreset('any');
    setSummaryPreset(null);
    setSortKey('due_date');
  }

  const hasActiveFilters =
    searchQuery.trim() ||
    customerId !== 'all' ||
    statusKey !== 'all' ||
    location !== 'all' ||
    dateFrom ||
    dateTo ||
    duePreset !== 'any' ||
    summaryPreset;

  const chips = [];
  const presetLabels = {
    outstanding: 'Unpaid balances',
    overdue: 'Overdue invoices',
    due_soon: 'Due in the next 14 days',
    paid_week: 'Paid this week',
    paid_month: 'Paid this month',
    total_count: 'All invoices',
  };
  if (summaryPreset) {
    chips.push({ key: 'preset', label: presetLabels[summaryPreset] ?? summaryPreset, clear: () => setSummaryPreset(null) });
  }
  if (customerId !== 'all') {
    const name = BILLING_CUSTOMER_OPTIONS.find((c) => c.id === customerId)?.name;
    chips.push({ key: 'cust', label: `Customer: ${name}`, clear: () => setCustomerId('all') });
  }
  if (statusKey !== 'all') {
    chips.push({
      key: 'st',
      label: `Status: ${statusLabel(statusKey)}`,
      clear: () => setStatusKey('all'),
    });
  }
  if (location !== 'all') chips.push({ key: 'loc', label: `Location: ${location}`, clear: () => setLocation('all') });
  if (duePreset !== 'any') {
    chips.push({
      key: 'due',
      label: `Due: ${DUE_PRESET_OPTIONS.find((d) => d.key === duePreset)?.label ?? duePreset}`,
      clear: () => setDuePreset('any'),
    });
  }
  if (dateFrom) chips.push({ key: 'df', label: `Invoiced from ${dateFrom}`, clear: () => setDateFrom('') });
  if (dateTo) chips.push({ key: 'dt', label: `Invoiced to ${dateTo}`, clear: () => setDateTo('') });
  if (searchQuery.trim()) chips.push({ key: 'q', label: `Search: “${searchQuery.trim()}”`, clear: () => setSearchQuery('') });

  return (
    <div className="admin-page admin-billing">
      <header className="admin-page-header admin-billing-header">
        <div>
          <h1>Billing</h1>
          <p className="admin-page-subtitle">
            {summaryPreset === 'outstanding'
              ? 'Showing outstanding balances — click a metric or clear filters for all invoices.'
              : 'View invoices and payments across all customer accounts.'}
          </p>
        </div>
        <div className="admin-billing-header-actions">
          <button type="button" className="admin-btn" disabled title="Demo only — not connected to billing systems">
            Create invoice
          </button>
        </div>
      </header>

      <div className="admin-kpi-section">
        <div className="admin-kpi-grid admin-billing-kpis">
          <button
            type="button"
            className={`admin-kpi-card admin-billing-kpi ${summaryPreset === 'outstanding' ? 'admin-billing-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'outstanding' ? null : 'outstanding'))}
          >
            <p className="admin-kpi-label">Total outstanding</p>
            <p className="admin-kpi-value">{formatCurrency(summary.total_outstanding)}</p>
            <p className="admin-kpi-meta">Unpaid balances</p>
          </button>
          <button
            type="button"
            className={`admin-kpi-card admin-billing-kpi admin-billing-kpi--risk ${summaryPreset === 'overdue' ? 'admin-billing-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'overdue' ? null : 'overdue'))}
          >
            <p className="admin-kpi-label">Overdue amount</p>
            <p className="admin-kpi-value">{formatCurrency(summary.overdue_amount)}</p>
            <p className="admin-kpi-meta">Past due date</p>
          </button>
          <button
            type="button"
            className={`admin-kpi-card admin-billing-kpi ${summaryPreset === 'due_soon' ? 'admin-billing-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'due_soon' ? null : 'due_soon'))}
          >
            <p className="admin-kpi-label">Due soon</p>
            <p className="admin-kpi-value">{summary.due_soon_count}</p>
            <p className="admin-kpi-meta">Next 14 days · unpaid</p>
          </button>
          <button
            type="button"
            className="admin-kpi-expand-toggle"
            onClick={() => setKpisExpanded((v) => !v)}
            aria-expanded={kpisExpanded}
          >
            {kpisExpanded ? 'Fewer metrics' : 'More metrics'}
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d={kpisExpanded ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} />
            </svg>
          </button>
        </div>
        {kpisExpanded && (
          <div className="admin-kpi-grid admin-billing-kpis admin-kpi-grid--secondary">
            <button
              type="button"
              className={`admin-kpi-card admin-billing-kpi ${summaryPreset === 'paid_week' ? 'admin-billing-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'paid_week' ? null : 'paid_week'))}
            >
              <p className="admin-kpi-label">Paid this week</p>
              <p className="admin-kpi-value">{formatCurrency(summary.paid_this_week)}</p>
              <p className="admin-kpi-meta">Cash in (last 7 days)</p>
            </button>
            <button
              type="button"
              className={`admin-kpi-card admin-billing-kpi ${summaryPreset === 'paid_month' ? 'admin-billing-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'paid_month' ? null : 'paid_month'))}
            >
              <p className="admin-kpi-label">Paid this month</p>
              <p className="admin-kpi-value">{formatCurrency(summary.paid_this_month)}</p>
              <p className="admin-kpi-meta">Last 30 days</p>
            </button>
            <button
              type="button"
              className={`admin-kpi-card admin-billing-kpi ${summaryPreset === 'total_count' ? 'admin-billing-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'total_count' ? null : 'total_count'))}
            >
              <p className="admin-kpi-label">Total invoices</p>
              <p className="admin-kpi-value">{summary.invoice_count}</p>
              <p className="admin-kpi-meta">All accounts (demo)</p>
            </button>
          </div>
        )}
      </div>

      <section className="admin-toolbar" aria-label="Search and filters">
        <div className="admin-toolbar-search-row">
          <label className="admin-toolbar-search">
            <span className="sr-only">Search invoices</span>
            <svg className="admin-toolbar-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="admin-billing-search"
              type="search"
              className="admin-toolbar-search-input"
              placeholder="Invoice #, customer, PO number…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <select
            id="admin-billing-sort"
            className="admin-toolbar-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort invoices"
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
              <label htmlFor="fb-cust">Customer</label>
              <select id="fb-cust" className="admin-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="all">All customers</option>
                {BILLING_CUSTOMER_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fb-st">Status</label>
              <select id="fb-st" className="admin-select" value={statusKey} onChange={(e) => setStatusKey(e.target.value)}>
                <option value="all">All statuses</option>
                {INVOICE_STATUS_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fb-due">Due date</label>
              <select id="fb-due" className="admin-select" value={duePreset} onChange={(e) => setDuePreset(e.target.value)}>
                {DUE_PRESET_OPTIONS.map((d) => (
                  <option key={d.key} value={d.key}>
                    {d.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="fb-loc">Location</label>
              <select id="fb-loc" className="admin-select" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="all">All locations</option>
                {BILLING_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field admin-toolbar-field--dates">
              <label htmlFor="fb-df">Invoice date</label>
              <div className="admin-toolbar-date-range">
                <input id="fb-df" type="date" className="admin-input admin-toolbar-date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <span className="admin-toolbar-date-sep">to</span>
                <input type="date" className="admin-input admin-toolbar-date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="Invoice date to" />
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

        {!hasActiveFilters && <p className="admin-toolbar-filter-hint">Showing {filtered.length} of {globalInvoices.length} invoices (demo data).</p>}
        {hasActiveFilters && (
          <p className="admin-toolbar-filter-hint">
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} ·{' '}
            <button type="button" className="admin-toolbar-link-inline" onClick={clearAllFilters}>
              Clear all filters
            </button>
          </p>
        )}
      </section>

      <div className="admin-billing-table-wrap">
        <table className="admin-table admin-billing-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Invoice date</th>
              <th>Due date</th>
              <th>Amount</th>
              <th>Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => {
              const isOverdueRow = row.statusKey === 'overdue';
              const isLarge = row.balance >= 4000;
              return (
                <tr
                  key={row.id}
                  className={`admin-billing-row ${isOverdueRow ? 'admin-billing-row--overdue' : ''} ${
                    isLarge && row.balance > 0 ? 'admin-billing-row--large-balance' : ''
                  }`}
                  onClick={() => navigate(`/admin/billing/${row.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/admin/billing/${row.id}`);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`View invoice ${row.invoiceNumber}`}
                >
                  <td>
                    <span className="admin-billing-inv-num">{row.invoiceNumber}</span>
                  </td>
                  <td>
                    <span className="admin-billing-customer">{row.customerName}</span>
                    <span className="admin-billing-loc">{row.location}</span>
                  </td>
                  <td>{formatDateShort(row.invoiceDate)}</td>
                  <td>{formatDateShort(row.dueDate)}</td>
                  <td>{formatCurrency(row.total)}</td>
                  <td className={`admin-billing-balance-cell ${row.balance <= 0 ? 'admin-billing-balance-cell--zero' : ''}`}>
                    {row.balance <= 0 ? 'Paid' : formatCurrency(row.balance)}
                  </td>
                  <td>
                    <span className={`admin-billing-status ${statusClass(row.statusKey)}`}>{statusLabel(row.statusKey)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && <p className="admin-billing-empty">No invoices match these filters. Try clearing a filter or search.</p>}
    </div>
  );
}
