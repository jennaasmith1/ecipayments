import { useMemo, useState, useEffect } from 'react';
import {
  globalServiceCalls,
  AI_SERVICE_INSIGHTS,
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
import AdminInsightsRail from '../../components/AdminInsightsRail';
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

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

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
  const [selectedId, setSelectedId] = useState(globalServiceCalls[0]?.id ?? null);
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
  const [summaryPreset, setSummaryPreset] = useState(null);
  const [sortKey, setSortKey] = useState('newest');
  const [detailTab, setDetailTab] = useState('overview');
  const [filtersExpanded, setFiltersExpanded] = useState(false);

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

  const selected = useMemo(
    () => globalServiceCalls.find((c) => c.id === selectedId) ?? null,
    [selectedId]
  );

  useEffect(() => {
    if (selectedId && filtered.some((c) => c.id === selectedId)) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- keep selection valid when filter results change
    setSelectedId(filtered[0]?.id ?? null);
  }, [filtered, selectedId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset detail tab when switching rows
    setDetailTab('overview');
  }, [selectedId]);

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
          <p className="admin-page-subtitle">Track service activity across your customer accounts.</p>
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

      <AdminInsightsRail items={AI_SERVICE_INSIGHTS} />

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
          className={`admin-kpi-card admin-global-service-kpi ${summaryPreset === 'overdue_aging' ? 'admin-global-service-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'overdue_aging' ? null : 'overdue_aging'))}
        >
          <p className="admin-kpi-label">Overdue / aging</p>
          <p className="admin-kpi-value">{summary.overdue_aging}</p>
          <p className="admin-kpi-meta">SLA risk or aging open calls</p>
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

      <div className="admin-global-service-split">
        <div className="admin-global-service-list-panel">
          <div className="admin-table-wrap admin-global-service-table-wrap">
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
                    className={`${selectedId === row.id ? 'admin-global-service-row--selected' : ''} ${row.isOverdue ? 'admin-row-warn' : ''}`}
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

        <aside className="admin-global-service-detail" aria-label="Service call detail">
          {selected ? (
            <>
              <div className="admin-global-service-detail-head">
                <div>
                  <p className="admin-global-service-detail-eyebrow">Service call</p>
                  <h2 className="admin-global-service-detail-title">{selected.callNumber}</h2>
                  <p className="admin-global-service-detail-customer">{selected.customerName}</p>
                </div>
                <div className="admin-global-service-detail-badges">
                  <span className={`admin-svc-chip ${statusChipClass(selected.statusKey)}`}>{selected.statusLabel}</span>
                  <span className={`admin-svc-priority ${priorityClass(selected.priority)}`}>{priorityLabel(selected.priority)}</span>
                </div>
              </div>

              <div className="admin-tab-row admin-global-service-detail-tabs" role="tablist">
                {['overview', 'activity', 'equipment', 'customer', 'notes'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    role="tab"
                    aria-selected={detailTab === tab}
                    className={`admin-tab ${detailTab === tab ? 'admin-tab-active' : ''}`}
                    onClick={() => setDetailTab(tab)}
                  >
                    {tab === 'overview' && 'Overview'}
                    {tab === 'activity' && 'Activity'}
                    {tab === 'equipment' && 'Equipment'}
                    {tab === 'customer' && 'Customer'}
                    {tab === 'notes' && 'Notes & updates'}
                  </button>
                ))}
              </div>

              <div className="admin-global-service-detail-body">
                {detailTab === 'overview' && (
                  <div className="admin-global-service-detail-section">
                    <h3 className="admin-section-title">Call overview</h3>
                    <dl className="admin-global-service-dl">
                      <div>
                        <dt>Opened</dt>
                        <dd>{formatDateTime(selected.openedAt)}</dd>
                      </div>
                      <div>
                        <dt>Last updated</dt>
                        <dd>{formatDateTime(selected.lastUpdated)}</dd>
                      </div>
                      <div>
                        <dt>Assigned tech</dt>
                        <dd>{selected.assignedTech}</dd>
                      </div>
                      <div>
                        <dt>Call type</dt>
                        <dd>{selected.callType}</dd>
                      </div>
                      <div>
                        <dt>Branch</dt>
                        <dd>{selected.branch}</dd>
                      </div>
                      <div>
                        <dt>Billing</dt>
                        <dd className="admin-global-service-cap">{selected.contractBilling.replace(/_/g, ' ')}</dd>
                      </div>
                    </dl>
                    <h3 className="admin-section-title">Problem</h3>
                    <p className="admin-global-service-prose">{selected.problemDescription}</p>
                    <p className="admin-global-service-muted">
                      <strong>Original request:</strong> {selected.issueSummary}
                    </p>
                  </div>
                )}

                {detailTab === 'activity' && (
                  <div className="admin-global-service-detail-section">
                    <h3 className="admin-section-title">Timeline</h3>
                    <ul className="admin-global-service-timeline">
                      {selected.timeline.map((ev, i) => (
                        <li key={i}>
                          <span className="admin-global-service-tl-dot" aria-hidden />
                          <div>
                            <strong>{ev.label}</strong>
                            <span className="admin-global-service-tl-time">{formatDateTime(ev.at)}</span>
                            {ev.detail && <p className="admin-global-service-tl-detail">{ev.detail}</p>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailTab === 'equipment' && (
                  <div className="admin-global-service-detail-section">
                    <h3 className="admin-section-title">Equipment</h3>
                    <dl className="admin-global-service-dl">
                      <div>
                        <dt>Device</dt>
                        <dd>{selected.equipmentName}</dd>
                      </div>
                      <div>
                        <dt>Equipment #</dt>
                        <dd>{selected.equipmentNumber}</dd>
                      </div>
                      <div>
                        <dt>Serial</dt>
                        <dd>{selected.serialNumber}</dd>
                      </div>
                      <div>
                        <dt>Location</dt>
                        <dd>{selected.location}</dd>
                      </div>
                      <div>
                        <dt>Type</dt>
                        <dd>{selected.equipmentType}</dd>
                      </div>
                      <div>
                        <dt>Contract on call</dt>
                        <dd>{selected.contractBilling.replace(/_/g, ' ')}</dd>
                      </div>
                    </dl>
                  </div>
                )}

                {detailTab === 'customer' && (
                  <div className="admin-global-service-detail-section">
                    <h3 className="admin-section-title">Account context</h3>
                    <p className="admin-global-service-stat">
                      Open calls for this customer: <strong>{selected.accountOpenCalls}</strong>
                    </p>
                    <h4 className="admin-global-service-subh">Recent service history</h4>
                    <ul className="admin-global-service-history">
                      {selected.recentHistory.length === 0 && <li className="admin-global-service-muted">No additional history in demo.</li>}
                      {selected.recentHistory.map((h) => (
                        <li key={h.id}>
                          <span className="admin-global-service-hist-id">{h.id}</span>
                          <span className="admin-global-service-hist-date">{formatDateShort(h.date)}</span>
                          <span>{h.summary}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="admin-global-service-muted admin-global-service-future">
                      Trends and renewal signals could appear here for account reviews (prototype).
                    </p>
                  </div>
                )}

                {detailTab === 'notes' && (
                  <div className="admin-global-service-detail-section">
                    <h3 className="admin-section-title">Internal notes</h3>
                    <ul className="admin-global-service-notes">
                      {selected.internalNotes.length === 0 && <li className="admin-global-service-muted">No internal notes yet (demo).</li>}
                      {selected.internalNotes.map((n) => (
                        <li key={n.id}>
                          <span className="admin-global-service-note-meta">
                            {formatDateTime(n.at)} · {n.author}
                          </span>
                          <p>{n.body}</p>
                        </li>
                      ))}
                    </ul>
                    <h3 className="admin-section-title">Customer-facing updates</h3>
                    <p className="admin-global-service-muted admin-global-service-future">
                      Lightweight visibility — not a live chat. Future: portal messages, SMS/email log, and optional AI summaries.
                    </p>
                    <ul className="admin-global-service-comm">
                      {selected.customerUpdates.length === 0 && <li className="admin-global-service-muted">No customer-visible updates in demo.</li>}
                      {selected.customerUpdates.map((u) => (
                        <li key={u.id}>
                          <span className="admin-global-service-comm-channel">{u.channel}</span>
                          <span className="admin-global-service-note-meta">{formatDateTime(u.at)}</span>
                          <p>{u.body}</p>
                        </li>
                      ))}
                    </ul>
                    <div className="admin-global-service-compose">
                      <label htmlFor="admin-svc-note-placeholder">Add internal note (demo)</label>
                      <textarea
                        id="admin-svc-note-placeholder"
                        className="admin-textarea"
                        placeholder="Notes saved only in a full build — this is a static prototype."
                        rows={3}
                        readOnly
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="admin-global-service-detail-empty">
              <p>Select a service call to view details.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
