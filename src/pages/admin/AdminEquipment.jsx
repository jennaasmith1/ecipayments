import { useMemo, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  globalEquipment,
  EQUIPMENT_CUSTOMER_OPTIONS,
  EQUIPMENT_STATUS_OPTIONS,
  EQUIPMENT_TONER_OPTIONS,
  computeEquipmentSummary,
  sortEquipment,
} from '../../data/adminEquipmentData';
import EquipmentDeviceThumb from '../../components/EquipmentDeviceThumb';
import './adminPages.css';
import './AdminEquipment.css';

const SORT_OPTIONS = [
  { key: 'displayName', label: 'Device name' },
  { key: 'customer', label: 'Customer' },
  { key: 'equipmentNo', label: 'Equipment #' },
  { key: 'location', label: 'Location' },
  { key: 'status', label: 'Status' },
  { key: 'toner', label: 'Toner' },
  { key: 'lastMeter', label: 'Last meter' },
];

function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function formatDateTime(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

function formatNumber(n) {
  if (n == null) return '—';
  return n.toLocaleString();
}

function tonerLabel(health) {
  if (health === 'good') return 'OK';
  if (health === 'low') return 'Low';
  if (health === 'critical') return 'Critical';
  return health;
}

function TonerBar({ label, value, tone }) {
  if (value == null) return null;
  const low = value <= 25;
  return (
    <div className="admin-equipment-toner-row">
      <span className="admin-equipment-toner-label">{label}</span>
      <div
        className="admin-equipment-toner-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`admin-equipment-toner-fill admin-equipment-toner-fill--${tone} ${low ? 'admin-equipment-toner-fill--low' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`admin-equipment-toner-pct ${low ? 'admin-equipment-toner-pct--low' : ''}`}>
        {value}%
      </span>
    </div>
  );
}

function WarningIcon({ className = '' }) {
  return (
    <svg
      className={`admin-equipment-warn-icon ${className}`}
      viewBox="0 0 20 20"
      width="14"
      height="14"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.169 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function AdminEquipment() {
  const [searchQuery, setSearchQuery] = useState('');
  const [customerFilter, setCustomerFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tonerFilter, setTonerFilter] = useState('');
  const [meterDueOnly, setMeterDueOnly] = useState(false);
  const [summaryPreset, setSummaryPreset] = useState(null);
  const [sortKey, setSortKey] = useState('displayName');
  const [sortDir, setSortDir] = useState('asc');
  const [detailTab, setDetailTab] = useState('overview');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeBtnRef = useRef(null);

  const summary = useMemo(() => computeEquipmentSummary(globalEquipment), []);

  const filtered = useMemo(() => {
    let list = [...globalEquipment];
    const q = searchQuery.trim().toLowerCase();

    if (summaryPreset === 'offline') list = list.filter((d) => d.reportingStatus === 'offline');
    else if (summaryPreset === 'tonerIssue')
      list = list.filter((d) => d.tonerHealth === 'low' || d.tonerHealth === 'critical');
    else if (summaryPreset === 'meterDue') list = list.filter((d) => d.meterDue);

    if (q) {
      list = list.filter((d) => {
        const blob = [
          d.displayName,
          d.equipmentNo,
          d.serialNumber,
          d.customerName,
          d.label,
          d.siteName,
          d.manufacturer,
          d.model,
        ]
          .join(' ')
          .toLowerCase();
        return blob.includes(q);
      });
    }

    if (customerFilter) list = list.filter((d) => d.customerId === customerFilter);
    if (statusFilter) list = list.filter((d) => d.reportingStatus === statusFilter);
    if (tonerFilter) list = list.filter((d) => d.tonerHealth === tonerFilter);
    if (meterDueOnly) list = list.filter((d) => d.meterDue);

    return sortEquipment(list, sortKey, sortDir);
  }, [searchQuery, customerFilter, statusFilter, tonerFilter, meterDueOnly, summaryPreset, sortKey, sortDir]);

  const openDrawer = (device) => {
    setSelected(device);
    setDetailTab('overview');
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drawerOpen]);

  function clearAllFilters() {
    setSearchQuery('');
    setCustomerFilter('');
    setStatusFilter('');
    setTonerFilter('');
    setMeterDueOnly(false);
    setSummaryPreset(null);
    setSortKey('displayName');
    setSortDir('asc');
  }

  const hasActiveFilters =
    searchQuery.trim() ||
    customerFilter ||
    statusFilter ||
    tonerFilter ||
    meterDueOnly ||
    summaryPreset;

  const chips = [];
  if (summaryPreset) {
    const labels = {
      offline: 'Offline devices',
      tonerIssue: 'Toner issue',
      meterDue: 'Meter due',
    };
    chips.push({
      key: 'preset',
      label: labels[summaryPreset] ?? summaryPreset,
      clear: () => setSummaryPreset(null),
    });
  }
  if (customerFilter) {
    const opt = EQUIPMENT_CUSTOMER_OPTIONS.find((o) => o.value === customerFilter);
    chips.push({ key: 'cust', label: `Customer: ${opt?.label ?? customerFilter}`, clear: () => setCustomerFilter('') });
  }
  if (statusFilter) {
    chips.push({
      key: 'status',
      label: `Status: ${statusFilter === 'online' ? 'Online' : 'Offline'}`,
      clear: () => setStatusFilter(''),
    });
  }
  if (tonerFilter) {
    chips.push({ key: 'toner', label: `Toner: ${tonerLabel(tonerFilter)}`, clear: () => setTonerFilter('') });
  }
  if (meterDueOnly) {
    chips.push({ key: 'meter', label: 'Meter due', clear: () => setMeterDueOnly(false) });
  }
  if (searchQuery.trim()) {
    chips.push({ key: 'q', label: `Search: "${searchQuery.trim()}"`, clear: () => setSearchQuery('') });
  }

  return (
    <div className="admin-page admin-equipment">
      <header className="admin-page-header admin-equipment-header">
        <div>
          <h1>Equipment</h1>
          <p className="admin-page-subtitle">View equipment across all customer accounts.</p>
        </div>
        <div className="admin-equipment-header-actions">
          <button type="button" className="admin-btn admin-btn-ghost" disabled title="Demo only">
            Saved views
          </button>
          <button type="button" className="admin-btn" disabled title="Demo only">
            Export
          </button>
        </div>
      </header>

      <div className="admin-kpi-grid admin-equipment-kpis">
        <button
          type="button"
          className={`admin-kpi-card admin-equipment-kpi ${summaryPreset === null && !hasActiveFilters ? 'admin-equipment-kpi--on' : ''}`}
          onClick={() => {
            clearAllFilters();
          }}
        >
          <p className="admin-kpi-label">Total devices</p>
          <p className="admin-kpi-value">{summary.total}</p>
          <p className="admin-kpi-meta">Across all accounts</p>
        </button>
        <div className="admin-kpi-card admin-equipment-kpi admin-equipment-kpi--static">
          <p className="admin-kpi-label">Online</p>
          <p className="admin-kpi-value admin-equipment-kpi-online">{summary.online}</p>
          <p className="admin-kpi-meta">Reporting normally</p>
        </div>
        <button
          type="button"
          className={`admin-kpi-card admin-equipment-kpi ${summaryPreset === 'offline' ? 'admin-equipment-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'offline' ? null : 'offline'))}
        >
          <p className="admin-kpi-label">Offline</p>
          <p className="admin-kpi-value admin-equipment-kpi-offline">{summary.offline}</p>
          <p className="admin-kpi-meta">Not reporting</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-equipment-kpi ${summaryPreset === 'tonerIssue' ? 'admin-equipment-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'tonerIssue' ? null : 'tonerIssue'))}
        >
          <p className="admin-kpi-label">Toner issue</p>
          <p className="admin-kpi-value admin-equipment-kpi-toner">{summary.tonerIssue}</p>
          <p className="admin-kpi-meta">Low or critical</p>
        </button>
        <button
          type="button"
          className={`admin-kpi-card admin-equipment-kpi ${summaryPreset === 'meterDue' ? 'admin-equipment-kpi--on' : ''}`}
          onClick={() => setSummaryPreset((p) => (p === 'meterDue' ? null : 'meterDue'))}
        >
          <p className="admin-kpi-label">Meter due</p>
          <p className="admin-kpi-value admin-equipment-kpi-meter">{summary.meterDue}</p>
          <p className="admin-kpi-meta">Needs meter read</p>
        </button>
      </div>

      <section className="admin-toolbar" aria-label="Search and filters">
        <div className="admin-toolbar-search-row">
          <label className="admin-toolbar-search">
            <span className="sr-only">Search equipment</span>
            <svg
              className="admin-toolbar-search-icon"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              className="admin-toolbar-search-input"
              placeholder="Search device, serial, equipment #, customer, location…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </label>
          <div className="admin-toolbar-inline-filters">
            <select
              className="admin-toolbar-inline-select"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              aria-label="Filter by customer"
            >
              {EQUIPMENT_CUSTOMER_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              className="admin-toolbar-inline-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              {EQUIPMENT_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <select
            className="admin-toolbar-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            aria-label="Sort equipment"
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
              <label htmlFor="f-toner">Toner level</label>
              <select
                id="f-toner"
                className="admin-select"
                value={tonerFilter}
                onChange={(e) => setTonerFilter(e.target.value)}
              >
                {EQUIPMENT_TONER_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-toolbar-toggles">
            <label className="admin-toolbar-toggle">
              <input
                type="checkbox"
                checked={meterDueOnly}
                onChange={(e) => setMeterDueOnly(e.target.checked)}
              />
              Meter due only
            </label>
          </div>
        </div>

        {chips.length > 0 && (
          <div className="admin-toolbar-chips">
            <span className="admin-toolbar-chips-label">Active filters</span>
            <div className="admin-audit-filters">
              {chips.map((ch) => (
                <button
                  key={ch.key + ch.label}
                  type="button"
                  className="admin-chip admin-filter-chip admin-filter-chip-on"
                  onClick={ch.clear}
                >
                  {ch.label}
                  <span className="admin-toolbar-chip-x" aria-hidden>
                    ×
                  </span>
                </button>
              ))}
            </div>
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-toolbar-clear"
              onClick={clearAllFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {!hasActiveFilters && (
          <p className="admin-toolbar-filter-hint">
            Showing {filtered.length} of {globalEquipment.length} devices (demo data).
          </p>
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

      <div className="admin-equipment-table-wrap">
        <div className="admin-equipment-table-scroll">
          <table className="admin-table admin-equipment-table">
            <thead>
              <tr>
                <th className="admin-equipment-th-thumb"> </th>
                <th>Device</th>
                <th>Equipment #</th>
                <th>Serial #</th>
                <th>Customer</th>
                <th>Location</th>
                <th>Status</th>
                <th>Toner</th>
                <th>Last meter</th>
              </tr>
            </thead>
          <tbody>
            {filtered.map((row) => {
              const online = row.reportingStatus === 'online';
              const tonerWarn = row.tonerHealth === 'low' || row.tonerHealth === 'critical';
              return (
                <tr
                  key={row.id}
                  className="admin-equipment-row"
                  onClick={() => openDrawer(row)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openDrawer(row);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${row.displayName}, ${row.customerName}. Click to view details.`}
                >
                  <td className="admin-equipment-td-thumb">
                    <EquipmentDeviceThumb device={row} />
                  </td>
                  <td>
                    <span className="admin-equipment-device-name">{row.displayName}</span>
                    <span className="admin-table-sub">{row.manufacturer}</span>
                  </td>
                  <td>{row.equipmentNo}</td>
                  <td>{row.serialNumber}</td>
                  <td>
                    <Link
                      to={`/admin/customers/${row.customerId}`}
                      className="admin-table-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {row.customerName}
                    </Link>
                  </td>
                  <td className="admin-equipment-loc">{row.label}</td>
                  <td>
                    <span
                      className={`admin-equipment-status ${online ? 'admin-equipment-status--online' : 'admin-equipment-status--offline'}`}
                    >
                      {online ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`admin-equipment-toner-cell admin-equipment-toner-cell--${row.tonerHealth}`}
                    >
                      {tonerWarn && <WarningIcon />}
                      {tonerLabel(row.tonerHealth)}
                    </span>
                  </td>
                  <td>
                    <span className="admin-equipment-meter">
                      {formatDate(row.lastMeterRead)}
                      {row.meterDue && <span className="admin-equipment-meter-due"> (Due)</span>}
                    </span>
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="admin-equipment-empty">No devices match these filters. Try clearing a filter or search.</p>
        )}
      </div>

      {/* Drawer backdrop */}
      <div
        className={`admin-equipment-drawer-backdrop ${drawerOpen ? 'admin-equipment-drawer-backdrop--open' : ''}`}
        aria-hidden={!drawerOpen}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <aside
        className={`admin-equipment-drawer ${drawerOpen ? 'admin-equipment-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-equipment-drawer-title"
        hidden={!drawerOpen}
      >
        {selected && (
          <>
            <div className="admin-equipment-drawer-header">
              <div>
                <p className="admin-equipment-drawer-kicker">{selected.equipmentNo}</p>
                <h2 id="admin-equipment-drawer-title" className="admin-equipment-drawer-title">
                  {selected.displayName}
                </h2>
                <p className="admin-equipment-drawer-customer">
                  <Link to={`/admin/customers/${selected.customerId}`} onClick={closeDrawer}>
                    {selected.customerName}
                  </Link>
                </p>
              </div>
              <div className="admin-equipment-drawer-header-right">
                <div className="admin-equipment-drawer-badges">
                  <span
                    className={`admin-equipment-status ${selected.reportingStatus === 'online' ? 'admin-equipment-status--online' : 'admin-equipment-status--offline'}`}
                  >
                    {selected.reportingStatus === 'online' ? 'Online' : 'Offline'}
                  </span>
                  {(selected.tonerHealth === 'low' || selected.tonerHealth === 'critical') && (
                    <span
                      className={`admin-equipment-toner-badge admin-equipment-toner-badge--${selected.tonerHealth}`}
                    >
                      Toner {tonerLabel(selected.tonerHealth)}
                    </span>
                  )}
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="admin-equipment-drawer-close"
                  onClick={closeDrawer}
                  aria-label="Close details"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="admin-tab-row admin-equipment-drawer-tabs" role="tablist">
              {['overview', 'service', 'activity'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={detailTab === tab}
                  className={`admin-tab ${detailTab === tab ? 'admin-tab-active' : ''}`}
                  onClick={() => setDetailTab(tab)}
                >
                  {tab === 'overview' && 'Overview'}
                  {tab === 'service' && 'Service'}
                  {tab === 'activity' && 'Activity'}
                </button>
              ))}
            </div>

            <div className="admin-equipment-drawer-body">
              <EquipmentDeviceThumb device={selected} className="admin-equipment-drawer-thumb" />

              {detailTab === 'overview' && (
                <div className="admin-equipment-detail-section">
                  <h3 className="admin-section-title">Device info</h3>
                  <dl className="admin-equipment-dl">
                    <div>
                      <dt>Equipment #</dt>
                      <dd>{selected.equipmentNo}</dd>
                    </div>
                    <div>
                      <dt>Serial #</dt>
                      <dd>{selected.serialNumber}</dd>
                    </div>
                    <div>
                      <dt>Manufacturer</dt>
                      <dd>{selected.manufacturer}</dd>
                    </div>
                    <div>
                      <dt>Model</dt>
                      <dd>{selected.model}</dd>
                    </div>
                    <div>
                      <dt>Color</dt>
                      <dd>{selected.isColor ? 'Yes' : 'No (B&W)'}</dd>
                    </div>
                    <div>
                      <dt>Ownership</dt>
                      <dd className="admin-equipment-cap">{selected.ownership}</dd>
                    </div>
                    <div>
                      <dt>Contract</dt>
                      <dd className="admin-equipment-cap">{selected.contractStatus?.replace(/_/g, ' ') ?? '—'}</dd>
                    </div>
                  </dl>

                  <h3 className="admin-section-title">Location</h3>
                  <dl className="admin-equipment-dl">
                    <div>
                      <dt>Site</dt>
                      <dd>{selected.siteName}</dd>
                    </div>
                    <div>
                      <dt>Placement</dt>
                      <dd>{selected.label}</dd>
                    </div>
                    <div>
                      <dt>Floor / room</dt>
                      <dd>{selected.floorRoom ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Address</dt>
                      <dd>{selected.address ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Department</dt>
                      <dd>{selected.department ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Primary contact</dt>
                      <dd>{selected.primaryContact ?? '—'}</dd>
                    </div>
                  </dl>

                  <h3 className="admin-section-title">Toner levels</h3>
                  <div className="admin-equipment-toner-block">
                    <TonerBar label="Black" value={selected.tonerLevels?.black} tone="black" />
                    <TonerBar label="Cyan" value={selected.tonerLevels?.cyan} tone="cyan" />
                    <TonerBar label="Magenta" value={selected.tonerLevels?.magenta} tone="magenta" />
                    <TonerBar label="Yellow" value={selected.tonerLevels?.yellow} tone="yellow" />
                  </div>

                  <h3 className="admin-section-title">Meter info</h3>
                  <dl className="admin-equipment-dl">
                    <div>
                      <dt>Last meter read</dt>
                      <dd>
                        {formatDate(selected.lastMeterRead)}
                        {selected.meterDue && (
                          <span className="admin-equipment-meter-due-badge">Due</span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt>Meter value</dt>
                      <dd>{formatNumber(selected.lastMeterValue)}</dd>
                    </div>
                    <div>
                      <dt>Meter type</dt>
                      <dd>{selected.meterType ?? '—'}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {detailTab === 'service' && (
                <div className="admin-equipment-detail-section">
                  <h3 className="admin-section-title">Open service</h3>
                  {selected.openService ? (
                    <div className="admin-equipment-open-service">
                      <span className="admin-equipment-service-id">{selected.openService.id}</span>
                      <span>{selected.openService.summary}</span>
                    </div>
                  ) : (
                    <p className="admin-equipment-muted">No open service tickets for this device.</p>
                  )}

                  <h3 className="admin-section-title">Service history</h3>
                  {selected.serviceHistory?.length > 0 ? (
                    <ul className="admin-equipment-service-list">
                      {selected.serviceHistory.map((h, i) => (
                        <li key={i}>
                          <span className="admin-equipment-service-date">{formatDate(h.date)}</span>
                          <span>{h.summary}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="admin-equipment-muted">No service history available.</p>
                  )}

                  <h3 className="admin-section-title">Maintenance</h3>
                  <dl className="admin-equipment-dl">
                    <div>
                      <dt>Last service</dt>
                      <dd>{formatDate(selected.lastServiceDate)}</dd>
                    </div>
                    <div>
                      <dt>Next PM due</dt>
                      <dd>{formatDate(selected.nextMaintenanceDate)}</dd>
                    </div>
                    <div>
                      <dt>Install date</dt>
                      <dd>{formatDate(selected.installDate)}</dd>
                    </div>
                    <div>
                      <dt>Warranty expires</dt>
                      <dd>{formatDate(selected.warrantyDate)}</dd>
                    </div>
                  </dl>
                </div>
              )}

              {detailTab === 'activity' && (
                <div className="admin-equipment-detail-section">
                  <h3 className="admin-section-title">Recent activity</h3>
                  {selected.activityTimeline?.length > 0 ? (
                    <ul className="admin-equipment-timeline">
                      {selected.activityTimeline.map((ev, i) => (
                        <li key={i}>
                          <span
                            className={`admin-equipment-tl-dot admin-equipment-tl-dot--${ev.type}`}
                            aria-hidden
                          />
                          <div>
                            <strong>{ev.label}</strong>
                            <span className="admin-equipment-tl-time">{formatDateTime(ev.date)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="admin-equipment-muted">No recent activity recorded.</p>
                  )}

                  <h3 className="admin-section-title">Reporting status</h3>
                  <dl className="admin-equipment-dl">
                    <div>
                      <dt>Status</dt>
                      <dd>{selected.reportingStatus === 'online' ? 'Online' : 'Offline'}</dd>
                    </div>
                    <div>
                      <dt>Last reported</dt>
                      <dd>{formatDate(selected.lastReportedDate)}</dd>
                    </div>
                    <div>
                      <dt>IP address</dt>
                      <dd>{selected.ipAddress ?? '—'}</dd>
                    </div>
                    <div>
                      <dt>Hostname</dt>
                      <dd>{selected.hostname ?? '—'}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
