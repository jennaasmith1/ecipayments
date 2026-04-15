import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  globalServiceCalls,
  GLOBAL_CUSTOMERS,
  GLOBAL_SERVICE_BRANCHES,
  GLOBAL_STATUS_OPTIONS,
  GLOBAL_PRIORITY_OPTIONS,
  GLOBAL_SERVICE_TECHS,
  computeSummaryCounts,
  topCustomersByOpenCalls,
  isOpenGlobalCall,
  resolvedThisWeek,
} from '../../data/adminGlobalServiceData';
import './adminPages.css';
import './AdminGlobalService.css';

const EQUIPMENT_TYPES = [...new Set(globalServiceCalls.map((c) => c.equipmentType))].sort();

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'oldest', label: 'Oldest first' },
  { key: 'overdue', label: 'Overdue first' },
  { key: 'priority', label: 'Priority' },
  { key: 'customer', label: 'Customer name' },
];

const priorityRank = { urgent: 0, high: 1, medium: 2, low: 3 };

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function statusChipClass(statusKey) {
  if (statusKey === 'resolved') return 'admin-svc-chip--resolved';
  if (statusKey === 'pending_dispatch') return 'admin-svc-chip--pending';
  if (statusKey === 'in_progress') return 'admin-svc-chip--progress';
  if (statusKey === 'waiting_parts') return 'admin-svc-chip--parts';
  if (statusKey === 'scheduled') return 'admin-svc-chip--scheduled';
  return 'admin-svc-chip--neutral';
}

function priorityLabel(p) {
  return p.charAt(0).toUpperCase() + p.slice(1);
}

function priorityClass(p) {
  if (p === 'urgent' || p === 'high') return 'admin-svc-priority--high';
  if (p === 'medium') return 'admin-svc-priority--med';
  return 'admin-svc-priority--low';
}

export default function AdminGlobalService() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [customerId, setCustomerId] = useState('all');
  const [statusKey, setStatusKey] = useState('all');
  const [priority, setPriority] = useState('all');
  const [tech, setTech] = useState('all');
  const [contract, setContract] = useState('all');
  const [branch, setBranch] = useState('all');
  const [equipmentType, setEquipmentType] = useState('all');
  const [needsFollowUp, setNeedsFollowUp] = useState(false);
  const [agingOnly, setAgingOnly] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [summaryPreset, setSummaryPreset] = useState('open');
  const [sortKey, setSortKey] = useState('newest');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [kpisExpanded, setKpisExpanded] = useState(false);

  const summary = useMemo(() => computeSummaryCounts(globalServiceCalls), []);
  const topCustomers = useMemo(() => topCustomersByOpenCalls(globalServiceCalls), []);
  const topCustomerNames = useMemo(() => new Set(topCustomers.map((t) => t.name)), [topCustomers]);

  const filtered = useMemo(() => {
    let list = [...globalServiceCalls];
    const q = searchQuery.trim().toLowerCase();

    if (summaryPreset === 'open') list = list.filter(isOpenGlobalCall);
    else if (summaryPreset === 'pending_dispatch') list = list.filter((c) => c.statusKey === 'pending_dispatch');
    else if (summaryPreset === 'in_progress') list = list.filter((c) => c.statusKey === 'in_progress');
    else if (summaryPreset === 'waiting_parts') list = list.filter((c) => c.statusKey === 'waiting_parts');
    else if (summaryPreset === 'overdue_aging')
      list = list.filter((c) => c.isOverdue || (c.isAging && isOpenGlobalCall(c)));
    else if (summaryPreset === 'resolved_week')
      list = list.filter((c) => c.statusKey === 'resolved' && resolvedThisWeek(c.resolvedAt));
    else if (summaryPreset === 'top_accounts') list = list.filter((c) => topCustomerNames.has(c.customerName));

    if (q) {
      list = list.filter((c) => {
        const blob = [
          c.callNumber,
          c.customerName,
          c.equipmentName,
          c.equipmentNumber,
          c.serialNumber,
          c.location,
          c.issueSummary,
          c.problemDescription,
        ]
          .join(' ')
          .toLowerCase();
        return blob.includes(q);
      });
    }

    if (customerId !== 'all') list = list.filter((c) => c.customerId === customerId);
    if (statusKey !== 'all') list = list.filter((c) => c.statusKey === statusKey);
    if (priority !== 'all') list = list.filter((c) => c.priority === priority);
    if (tech !== 'all') {
      list = list.filter((c) => (tech === 'Unassigned' ? c.assignedTech === '—' : c.assignedTech === tech));
    }
    if (contract !== 'all') list = list.filter((c) => c.contractBilling === contract);
    if (branch !== 'all') list = list.filter((c) => c.branch === branch);
    if (equipmentType !== 'all') list = list.filter((c) => c.equipmentType === equipmentType);
    if (needsFollowUp) list = list.filter((c) => c.needsFollowUp);
    if (agingOnly) list = list.filter((c) => c.isAging);

    if (dateFrom) {
      const from = new Date(dateFrom);
      list = list.filter((c) => new Date(c.openedAt) >= from);
    }
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      list = list.filter((c) => new Date(c.openedAt) <= to);
    }

    list.sort((a, b) => {
      if (sortKey === 'newest') return new Date(b.openedAt) - new Date(a.openedAt);
      if (sortKey === 'oldest') return new Date(a.openedAt) - new Date(b.openedAt);
      if (sortKey === 'overdue') {
        const od = (b.isOverdue ? 1 : 0) - (a.isOverdue ? 1 : 0);
        if (od !== 0) return od;
        return new Date(a.openedAt) - new Date(b.openedAt);
      }
      if (sortKey === 'priority') {
        const pr = (priorityRank[a.priority] ?? 9) - (priorityRank[b.priority] ?? 9);
        if (pr !== 0) return pr;
        return new Date(b.openedAt) - new Date(a.openedAt);
      }
      if (sortKey === 'customer') return a.customerName.localeCompare(b.customerName);
      return 0;
    });

    return list;
  }, [
    searchQuery,
    customerId,
    statusKey,
    priority,
    tech,
    contract,
    branch,
    equipmentType,
    needsFollowUp,
    agingOnly,
    dateFrom,
    dateTo,
    summaryPreset,
    sortKey,
    topCustomerNames,
  ]);

  function clearAllFilters() {
    setSearchQuery('');
    setCustomerId('all');
    setStatusKey('all');
    setPriority('all');
    setTech('all');
    setContract('all');
    setBranch('all');
    setEquipmentType('all');
    setNeedsFollowUp(false);
    setAgingOnly(false);
    setDateFrom('');
    setDateTo('');
    setSummaryPreset(null);
    setSortKey('newest');
  }

  const hasActiveFilters =
    searchQuery.trim() ||
    customerId !== 'all' ||
    statusKey !== 'all' ||
    priority !== 'all' ||
    tech !== 'all' ||
    contract !== 'all' ||
    branch !== 'all' ||
    equipmentType !== 'all' ||
    needsFollowUp ||
    agingOnly ||
    dateFrom ||
    dateTo ||
    summaryPreset;

  const chips = [];
  if (summaryPreset) {
    const labels = {
      open: 'Open calls',
      pending_dispatch: 'Pending dispatch',
      in_progress: 'In progress',
      waiting_parts: 'Waiting on parts',
      overdue_aging: 'Overdue / aging',
      resolved_week: 'Resolved this week',
      top_accounts: 'Top accounts (open volume)',
    };
    chips.push({ key: 'preset', label: labels[summaryPreset] ?? summaryPreset, clear: () => setSummaryPreset(null) });
  }
  if (customerId !== 'all') {
    const name = globalServiceCalls.find((c) => c.customerId === customerId)?.customerName;
    chips.push({ key: 'cust', label: `Customer: ${name}`, clear: () => setCustomerId('all') });
  }
  if (statusKey !== 'all') {
    chips.push({
      key: 'st',
      label: `Status: ${GLOBAL_STATUS_OPTIONS.find((s) => s.key === statusKey)?.label ?? statusKey}`,
      clear: () => setStatusKey('all'),
    });
  }
  if (priority !== 'all') chips.push({ key: 'pr', label: `Priority: ${priority}`, clear: () => setPriority('all') });
  if (tech !== 'all') chips.push({ key: 'tech', label: `Tech: ${tech}`, clear: () => setTech('all') });
  if (contract !== 'all') chips.push({ key: 'co', label: `Billing: ${contract}`, clear: () => setContract('all') });
  if (branch !== 'all') chips.push({ key: 'br', label: `Branch: ${branch}`, clear: () => setBranch('all') });
  if (equipmentType !== 'all') chips.push({ key: 'eq', label: `Equipment: ${equipmentType}`, clear: () => setEquipmentType('all') });
  if (needsFollowUp) chips.push({ key: 'fu', label: 'Needs follow-up', clear: () => setNeedsFollowUp(false) });
  if (agingOnly) chips.push({ key: 'ag', label: 'Aging', clear: () => setAgingOnly(false) });
  if (dateFrom) chips.push({ key: 'df', label: `From ${dateFrom}`, clear: () => setDateFrom('') });
  if (dateTo) chips.push({ key: 'dt', label: `To ${dateTo}`, clear: () => setDateTo('') });
  if (searchQuery.trim()) chips.push({ key: 'q', label: `Search: “${searchQuery.trim()}”`, clear: () => setSearchQuery('') });

  return (
    <div className="admin-page admin-global-service">
      <header className="admin-page-header admin-global-service-header">
        <div>
          <h1>Service</h1>
          <p className="admin-page-subtitle">
            {summaryPreset === 'open'
              ? 'Showing open service calls — click a metric or clear filters for all activity.'
              : 'Track service activity across your customer accounts.'}
          </p>
        </div>
        <div className="admin-global-service-header-actions">
          <button type="button" className="admin-btn admin-btn-ghost" disabled title="Demo only">
            Saved views
          </button>
          <button type="button" className="admin-btn" disabled title="Demo only">
            Export
          </button>
        </div>
      </header>

      <div className="admin-kpi-section">
        <div className="admin-kpi-grid admin-global-service-kpis">
          <button
            type="button"
            className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'open' ? 'admin-global-service-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'open' ? null : 'open'))}
          >
            <p className="admin-kpi-label">Open calls</p>
            <p className="admin-kpi-value">{summary.open}</p>
            <p className="admin-kpi-meta">Across all accounts</p>
          </button>
          <button
            type="button"
            className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'pending_dispatch' ? 'admin-global-service-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'pending_dispatch' ? null : 'pending_dispatch'))}
          >
            <p className="admin-kpi-label">Pending dispatch</p>
            <p className="admin-kpi-value">{summary.pending_dispatch}</p>
            <p className="admin-kpi-meta">Awaiting assignment</p>
          </button>
          <button
            type="button"
            className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'overdue_aging' ? 'admin-global-service-kpi--on' : ''}`}
            onClick={() => setSummaryPreset((p) => (p === 'overdue_aging' ? null : 'overdue_aging'))}
          >
            <p className="admin-kpi-label">Overdue / aging</p>
            <p className="admin-kpi-value">{summary.overdue_aging}</p>
            <p className="admin-kpi-meta">SLA risk or aging open calls</p>
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
          <div className="admin-kpi-grid admin-global-service-kpis admin-kpi-grid--secondary">
            <button
              type="button"
              className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'in_progress' ? 'admin-global-service-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'in_progress' ? null : 'in_progress'))}
            >
              <p className="admin-kpi-label">In progress</p>
              <p className="admin-kpi-value">{summary.in_progress}</p>
              <p className="admin-kpi-meta">Active work</p>
            </button>
            <button
              type="button"
              className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'waiting_parts' ? 'admin-global-service-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'waiting_parts' ? null : 'waiting_parts'))}
            >
              <p className="admin-kpi-label">Waiting on parts</p>
              <p className="admin-kpi-value">{summary.waiting_parts}</p>
              <p className="admin-kpi-meta">Supply chain</p>
            </button>
            <button
              type="button"
              className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'resolved_week' ? 'admin-global-service-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'resolved_week' ? null : 'resolved_week'))}
            >
              <p className="admin-kpi-label">Resolved this week</p>
              <p className="admin-kpi-value">{summary.resolved_week}</p>
              <p className="admin-kpi-meta">Recently completed</p>
            </button>
            <button
              type="button"
              className={`admin-kpi-card admin-global-service-kpi admin-global-service-kpi--wide ${summaryPreset === 'top_accounts' ? 'admin-global-service-kpi--on' : ''}`}
              onClick={() => setSummaryPreset((p) => (p === 'top_accounts' ? null : 'top_accounts'))}
            >
              <p className="admin-kpi-label">Accounts with most open calls</p>
              <p className="admin-global-service-top-customers">
                {topCustomers.map((t) => (
                  <span key={t.name}>
                    {t.name} <strong>({t.count})</strong>
                  </span>
                ))}
              </p>
              <p className="admin-kpi-meta">Click to filter to those accounts</p>
            </button>
          </div>
        )}
      </div>

      <section className="admin-toolbar" aria-label="Search and filters">
        <div className="admin-toolbar-search-row">
          <label className="admin-toolbar-search">
            <span className="sr-only">Search service activity</span>
            <svg className="admin-toolbar-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="admin-global-svc-search"
              type="search"
              className="admin-toolbar-search-input"
              placeholder="Search customer, call #, equipment, serial, address, keyword…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <select
            id="admin-global-svc-sort"
            className="admin-toolbar-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort service calls"
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
              <label htmlFor="f-cust">Customer</label>
              <select id="f-cust" className="admin-select" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
                <option value="all">All customers</option>
                {GLOBAL_CUSTOMERS.map((name) => {
                  const id = globalServiceCalls.find((c) => c.customerName === name)?.customerId;
                  return (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-st">Status</label>
              <select id="f-st" className="admin-select" value={statusKey} onChange={(e) => setStatusKey(e.target.value)}>
                <option value="all">All statuses</option>
                {GLOBAL_STATUS_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-pr">Priority</label>
              <select id="f-pr" className="admin-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="all">All priorities</option>
                {GLOBAL_PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {priorityLabel(p)}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-tech">Technician</label>
              <select id="f-tech" className="admin-select" value={tech} onChange={(e) => setTech(e.target.value)}>
                <option value="all">All</option>
                {GLOBAL_SERVICE_TECHS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-contract">Contract / billing</label>
              <select id="f-contract" className="admin-select" value={contract} onChange={(e) => setContract(e.target.value)}>
                <option value="all">All</option>
                <option value="contract">Contract</option>
                <option value="time_materials">Time &amp; materials</option>
                <option value="warranty">Warranty</option>
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-branch">Location / branch</label>
              <select id="f-branch" className="admin-select" value={branch} onChange={(e) => setBranch(e.target.value)}>
                <option value="all">All branches</option>
                {GLOBAL_SERVICE_BRANCHES.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="f-eq">Equipment type</label>
              <select id="f-eq" className="admin-select" value={equipmentType} onChange={(e) => setEquipmentType(e.target.value)}>
                <option value="all">All types</option>
                {EQUIPMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field admin-toolbar-field--dates">
              <label htmlFor="f-df">Date opened</label>
              <div className="admin-toolbar-date-range">
                <input id="f-df" type="date" className="admin-input admin-toolbar-date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <span className="admin-toolbar-date-sep">to</span>
                <input type="date" className="admin-input admin-toolbar-date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} aria-label="Date opened to" />
              </div>
            </div>
          </div>

          <div className="admin-toolbar-toggles">
            <label className="admin-toolbar-toggle">
              <input type="checkbox" checked={needsFollowUp} onChange={(e) => setNeedsFollowUp(e.target.checked)} />
              Needs follow-up
            </label>
            <label className="admin-toolbar-toggle">
              <input type="checkbox" checked={agingOnly} onChange={(e) => setAgingOnly(e.target.checked)} />
              Aging
            </label>
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
          <p className="admin-toolbar-filter-hint">Showing {filtered.length} of {globalServiceCalls.length} calls (demo data).</p>
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

      <div className="admin-global-service-table-wrap">
        <table className="admin-table admin-global-service-table">
          <thead>
            <tr>
              <th>Call #</th>
              <th>Customer</th>
              <th>Equipment</th>
              <th>Issue</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Opened</th>
              <th>Updated</th>
              <th>Tech</th>
              <th>Location</th>
              <th>Billing</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr
                key={row.id}
                className={`admin-global-service-row ${row.isOverdue ? 'admin-row-warn' : ''}`}
                onClick={() => navigate(`/admin/service/${row.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/admin/service/${row.id}`);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View service call ${row.callNumber}`}
              >
                <td>
                  <span className="admin-global-service-call-num">{row.callNumber}</span>
                </td>
                <td>
                  <span className="admin-global-service-customer">{row.customerName}</span>
                </td>
                <td>
                  <span className="admin-table-sub admin-global-service-equip">{row.equipmentName}</span>
                  <span className="admin-table-sub">{row.equipmentNumber}</span>
                </td>
                <td className="admin-global-service-issue">{row.issueSummary}</td>
                <td>
                  <span className={`admin-svc-chip ${statusChipClass(row.statusKey)}`}>{row.statusLabel}</span>
                </td>
                <td>
                  <span className={`admin-svc-priority ${priorityClass(row.priority)}`}>{priorityLabel(row.priority)}</span>
                </td>
                <td>{formatDateShort(row.openedAt)}</td>
                <td>{formatDateShort(row.lastUpdated)}</td>
                <td>{row.assignedTech}</td>
                <td className="admin-global-service-loc">{row.location}</td>
                <td>
                  <span className="admin-chip admin-chip-neutral admin-global-service-bill">{row.contractBilling.replace(/_/g, ' ')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p className="admin-global-service-empty">No calls match these filters. Try clearing a filter or search.</p>
      )}
    </div>
  );
}
