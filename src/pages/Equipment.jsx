import { useMemo, useState, useCallback } from 'react';
import { formatDate } from '../data/fakeData';
import { fleetEquipment } from '../data/equipmentFleetData';
import EquipmentDeviceThumb from '../components/EquipmentDeviceThumb';
import EquipmentDetailPanel from './EquipmentDetailPanel';
import './Equipment.css';

const PAGE_SIZE = 10;

const TONER_SORT_ORDER = { good: 0, low: 1, critical: 2 };

function deviceSearchHaystack(d) {
  return [
    d.equipmentNo,
    d.serialNumber,
    d.model,
    d.displayName,
    d.manufacturer,
    d.modelFamily,
    d.label,
    d.siteName,
    d.nickname,
    d.floorRoom,
    d.department,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

function sortDevices(list, sortKey, dir) {
  const mult = dir === 'asc' ? 1 : -1;
  const next = [...list];
  next.sort((a, b) => {
    if (sortKey === 'equipmentNo') return mult * a.equipmentNo.localeCompare(b.equipmentNo);
    if (sortKey === 'location') return mult * a.label.localeCompare(b.label);
    if (sortKey === 'reporting') return mult * a.reportingStatus.localeCompare(b.reportingStatus);
    if (sortKey === 'toner') {
      return mult * (TONER_SORT_ORDER[a.tonerHealth] - TONER_SORT_ORDER[b.tonerHealth]);
    }
    if (sortKey === 'lastMeter') return mult * (a.lastMeterRead < b.lastMeterRead ? -1 : a.lastMeterRead > b.lastMeterRead ? 1 : 0);
    return mult * a.displayName.localeCompare(b.displayName);
  });
  return next;
}

function deviceSubtitle(d) {
  if (d.nickname) return d.nickname;
  return `${d.manufacturer} · ${d.model}`;
}

function isInGoodStanding(d) {
  return d.reportingStatus === 'online' && !d.meterDue && d.tonerHealth === 'good';
}

function EquipmentWarningIcon({ className = '' }) {
  return (
    <svg
      className={`equipment-cell-warn-icon ${className}`.trim()}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  );
}

export default function Equipment() {
  const [search, setSearch] = useState('');
  const [site, setSite] = useState('');
  const [location, setLocation] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [modelFamily, setModelFamily] = useState('');
  const [contract, setContract] = useState('');
  const [reporting, setReporting] = useState('');
  const [operationalStatus, setOperationalStatus] = useState('');
  const [meterDueOnly, setMeterDueOnly] = useState(false);
  const [tonerIssueOnly, setTonerIssueOnly] = useState(false);
  const [sortKey, setSortKey] = useState('equipmentNo');
  const [sortDir, setSortDir] = useState('asc');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selected, setSelected] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const sites = useMemo(() => [...new Set(fleetEquipment.map((d) => d.siteName))].sort(), []);
  const locations = useMemo(() => [...new Set(fleetEquipment.map((d) => d.label))].sort(), []);
  const manufacturers = useMemo(() => [...new Set(fleetEquipment.map((d) => d.manufacturer))].sort(), []);
  const families = useMemo(() => [...new Set(fleetEquipment.map((d) => d.modelFamily))].sort(), []);

  const equipmentQuickCounts = useMemo(
    () => ({
      all: fleetEquipment.length,
      offline: fleetEquipment.filter((d) => d.reportingStatus === 'offline').length,
      meter: fleetEquipment.filter((d) => d.meterDue).length,
      toner: fleetEquipment.filter((d) => d.tonerHealth !== 'good').length,
    }),
    [],
  );

  const quickFilterBaseline = useMemo(
    () =>
      !search.trim() &&
      site === '' &&
      location === '' &&
      manufacturer === '' &&
      modelFamily === '' &&
      contract === '' &&
      operationalStatus === '',
    [search, site, location, manufacturer, modelFamily, contract, operationalStatus],
  );

  const quickAllActive = quickFilterBaseline && reporting === '' && !meterDueOnly && !tonerIssueOnly;
  const quickOfflineActive = quickFilterBaseline && reporting === 'offline' && !meterDueOnly && !tonerIssueOnly;
  const quickMeterActive = quickFilterBaseline && reporting === '' && meterDueOnly && !tonerIssueOnly;
  const quickTonerActive = quickFilterBaseline && reporting === '' && !meterDueOnly && tonerIssueOnly;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = fleetEquipment.filter((d) => {
      if (q && !deviceSearchHaystack(d).includes(q)) return false;
      if (operationalStatus === 'good' && !isInGoodStanding(d)) return false;
      if (operationalStatus === 'offline' && d.reportingStatus !== 'offline') return false;
      if (site && d.siteName !== site) return false;
      if (location && d.label !== location) return false;
      if (manufacturer && d.manufacturer !== manufacturer) return false;
      if (modelFamily && d.modelFamily !== modelFamily) return false;
      if (contract && d.contractStatus !== contract) return false;
      if (reporting && d.reportingStatus !== reporting) return false;
      if (meterDueOnly && !d.meterDue) return false;
      if (tonerIssueOnly && d.tonerHealth === 'good') return false;
      return true;
    });
    list = sortDevices(list, sortKey, sortDir);
    return list;
  }, [
    search,
    site,
    location,
    manufacturer,
    modelFamily,
    contract,
    reporting,
    meterDueOnly,
    tonerIssueOnly,
    sortKey,
    sortDir,
    operationalStatus,
  ]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const clearFilters = useCallback(() => {
    setSearch('');
    setSite('');
    setLocation('');
    setManufacturer('');
    setModelFamily('');
    setContract('');
    setReporting('');
    setOperationalStatus('');
    setMeterDueOnly(false);
    setTonerIssueOnly(false);
  }, []);

  const applyQuick = useCallback((key) => {
    clearFilters();
    if (key === 'offline') setReporting('offline');
    if (key === 'meter') setMeterDueOnly(true);
    if (key === 'toner') setTonerIssueOnly(true);
  }, [clearFilters]);

  const openDrawer = (device) => {
    setSelected(device);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  return (
    <div className="equipment-page">
      <header className="equipment-header">
        <h1>Equipment</h1>
        <p className="equipment-subtitle">
          Fleet overview for {fleetEquipment.length} devices — submit meter reads, order supplies, and request service by machine.
        </p>
      </header>

      <div id="meter" className="equipment-anchor" aria-hidden tabIndex={-1} />

      <section className="equipment-toolbar" aria-label="Search and filters">
        <div className="equipment-search-row">
          <label className="equipment-search">
            <span className="sr-only">Search equipment</span>
            <svg className="equipment-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="search"
              className="equipment-search-input"
              placeholder="Search by equipment no., serial, model, manufacturer, location, or nickname…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setVisibleCount(PAGE_SIZE);
              }}
            />
          </label>
          <button
            type="button"
            className={`equipment-filter-toggle ${filtersExpanded ? 'equipment-filter-toggle--open' : ''}`}
            onClick={() => setFiltersExpanded((v) => !v)}
            aria-expanded={filtersExpanded}
          >
            Filters
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        <div className="equipment-quick-filters" role="group" aria-label="Quick filters">
          <span className="equipment-quick-label">Quick views</span>
          <button
            type="button"
            className={`equipment-quick-chip ${quickAllActive ? 'equipment-quick-chip--active' : ''}`}
            aria-pressed={quickAllActive}
            aria-label={`All equipment, ${equipmentQuickCounts.all} devices`}
            onClick={() => {
              clearFilters();
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <span className="equipment-quick-chip-text">All equipment</span>
            <span className="equipment-quick-chip-count">{equipmentQuickCounts.all}</span>
          </button>
          <button
            type="button"
            className={`equipment-quick-chip ${quickOfflineActive ? 'equipment-quick-chip--active' : ''}`}
            aria-pressed={quickOfflineActive}
            aria-label={`Offline, ${equipmentQuickCounts.offline} devices`}
            onClick={() => {
              applyQuick('offline');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <span className="equipment-quick-chip-text">Offline</span>
            <span className="equipment-quick-chip-count">{equipmentQuickCounts.offline}</span>
          </button>
          <button
            type="button"
            className={`equipment-quick-chip ${quickMeterActive ? 'equipment-quick-chip--active' : ''}`}
            aria-pressed={quickMeterActive}
            aria-label={`Meter due, ${equipmentQuickCounts.meter} devices`}
            onClick={() => {
              applyQuick('meter');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <span className="equipment-quick-chip-text">Meter due</span>
            <span className="equipment-quick-chip-count">{equipmentQuickCounts.meter}</span>
          </button>
          <button
            type="button"
            className={`equipment-quick-chip ${quickTonerActive ? 'equipment-quick-chip--active' : ''}`}
            aria-pressed={quickTonerActive}
            aria-label={`Toner issue, ${equipmentQuickCounts.toner} devices`}
            onClick={() => {
              applyQuick('toner');
              setVisibleCount(PAGE_SIZE);
            }}
          >
            <span className="equipment-quick-chip-text">Toner issue</span>
            <span className="equipment-quick-chip-count">{equipmentQuickCounts.toner}</span>
          </button>
        </div>

        <div className={`equipment-filter-panel ${filtersExpanded ? 'equipment-filter-panel--open' : ''}`}>
          <div className="equipment-filter-grid">
            <label className="equipment-filter-field">
              <span>Status</span>
              <select
                className="equipment-select"
                value={operationalStatus}
                onChange={(e) => {
                  setOperationalStatus(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">Any status</option>
                <option value="good">In good standing</option>
                <option value="offline">Offline / not reporting</option>
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Site / office</span>
              <select
                className="equipment-select"
                value={site}
                onChange={(e) => {
                  setSite(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">All sites</option>
                {sites.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Location / area</span>
              <select
                className="equipment-select"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">All areas</option>
                {locations.map((locItem) => (
                  <option key={locItem} value={locItem}>
                    {locItem}
                  </option>
                ))}
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Manufacturer</span>
              <select
                className="equipment-select"
                value={manufacturer}
                onChange={(e) => {
                  setManufacturer(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">All manufacturers</option>
                {manufacturers.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Model family</span>
              <select
                className="equipment-select"
                value={modelFamily}
                onChange={(e) => {
                  setModelFamily(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">All families</option>
                {families.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Contract status</span>
              <select
                className="equipment-select"
                value={contract}
                onChange={(e) => {
                  setContract(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">Any</option>
                <option value="active">Active</option>
                <option value="expiring">Expiring</option>
                <option value="month_to_month">Month-to-month</option>
                <option value="none">No maintenance contract</option>
              </select>
            </label>
            <label className="equipment-filter-field">
              <span>Reporting status</span>
              <select
                className="equipment-select"
                value={reporting}
                onChange={(e) => {
                  setReporting(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              >
                <option value="">Any</option>
                <option value="online">Online</option>
                <option value="offline">Offline / not reporting</option>
              </select>
            </label>
          </div>
          <div className="equipment-filter-toggles">
            <label className="equipment-toggle">
              <input
                type="checkbox"
                checked={meterDueOnly}
                onChange={(e) => {
                  setMeterDueOnly(e.target.checked);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
              <span>Meter due</span>
            </label>
            <label className="equipment-toggle">
              <input
                type="checkbox"
                checked={tonerIssueOnly}
                onChange={(e) => {
                  setTonerIssueOnly(e.target.checked);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
              <span>Toner issue</span>
            </label>
            <button type="button" className="equipment-clear-filters" onClick={() => { clearFilters(); setVisibleCount(PAGE_SIZE); }}>
              Clear all filters
            </button>
          </div>
        </div>

        <div className="equipment-sort-row">
          <p className="equipment-result-count">
            Showing <strong>{visible.length}</strong> of <strong>{filtered.length}</strong> equipment
            {filtered.length !== fleetEquipment.length && (
              <span className="equipment-result-count-muted"> (filtered from {fleetEquipment.length})</span>
            )}
          </p>
          <div className="equipment-sort-controls">
            <label className="equipment-sort">
              <span className="sr-only">Sort by</span>
              <span aria-hidden>Sort</span>
              <select
                className="equipment-select equipment-select--compact"
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
              >
                <option value="equipmentNo">Equipment No.</option>
                <option value="displayName">Device name</option>
                <option value="location">Location</option>
                <option value="reporting">Online / Offline</option>
                <option value="toner">Toner</option>
                <option value="lastMeter">Last meter read</option>
              </select>
            </label>
            <label className="equipment-sort">
              <span className="sr-only">Sort direction</span>
              <select
                className="equipment-select equipment-select--compact"
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
              >
                <option value="asc">A–Z / Oldest first</option>
                <option value="desc">Z–A / Newest first</option>
              </select>
            </label>
          </div>
        </div>
      </section>

      <div className="equipment-table-wrap">
        {filtered.length === 0 ? (
          <div className="equipment-empty">
            <p className="equipment-empty-title">No equipment matches your filters</p>
            <p className="equipment-empty-text">Try clearing search or filters to see your full fleet.</p>
            <button type="button" className="equipment-btn equipment-btn-primary" onClick={() => { clearFilters(); setVisibleCount(PAGE_SIZE); }}>
              Reset filters
            </button>
          </div>
        ) : (
          <>
            <div className="equipment-table-scroll">
              <table className="equipment-table">
                <caption className="sr-only">
                  Your equipment list. Select a row to open details and actions for that device.
                </caption>
                <thead>
                  <tr>
                    <th className="equipment-th-thumb" scope="col">
                      {' '}
                    </th>
                    <th scope="col">Device</th>
                    <th scope="col">Equipment No.</th>
                    <th scope="col">Serial</th>
                    <th scope="col">Location</th>
                    <th scope="col">Status</th>
                    <th scope="col">Toner</th>
                    <th scope="col">Last meter read</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((device) => {
                    const online = device.reportingStatus === 'online';
                    const tonerLabel =
                      device.tonerHealth === 'good' ? 'OK' : device.tonerHealth === 'low' ? 'Low' : 'Critical';
                    const tonerWarn = device.tonerHealth === 'low' || device.tonerHealth === 'critical';
                    return (
                      <tr
                        key={device.id}
                        className="equipment-data-row"
                        onClick={() => openDrawer(device)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            openDrawer(device);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label={`${device.displayName}, ${online ? 'online' : 'offline'}, toner ${tonerLabel}${device.meterDue ? ', meter due' : ''}. Open for details.`}
                      >
                        <td className="equipment-td-thumb">
                          <EquipmentDeviceThumb device={device} />
                        </td>
                        <td>
                          <div className="equipment-device-cell">
                            <div className="equipment-device-name">{device.displayName}</div>
                            <div className="equipment-device-nickname">{deviceSubtitle(device)}</div>
                          </div>
                        </td>
                        <td>
                          <code className="equipment-serial">{device.equipmentNo}</code>
                        </td>
                        <td>
                          <code className="equipment-serial">{device.serialNumber}</code>
                        </td>
                        <td>
                          <div className="equipment-loc-cell">
                            <span>{device.label}</span>
                            <span className="equipment-loc-site">{device.siteName}</span>
                          </div>
                        </td>
                        <td>
                          <span
                            className={`equipment-connectivity equipment-connectivity--${online ? 'online' : 'offline'}`}
                          >
                            <span className="equipment-connectivity-dot" aria-hidden />
                            {online ? 'Online' : 'Offline'}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`equipment-toner-cell equipment-toner-cell--${device.tonerHealth}`}
                          >
                            {tonerWarn && <EquipmentWarningIcon />}
                            {tonerLabel}
                          </span>
                        </td>
                        <td>
                          <div className="equipment-meter-cell">
                            <div className="equipment-meter-date">{formatDate(device.lastMeterRead)}</div>
                            <div className="equipment-meter-detail">
                              {device.lastMeterValue.toLocaleString()} {device.meterType}
                            </div>
                            {device.meterDue && (
                              <span className="equipment-meter-due">
                                <EquipmentWarningIcon />
                                Meter due
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {hasMore && (
              <div className="equipment-show-more-wrap">
                <button type="button" className="equipment-show-more" onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}>
                  Show more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <EquipmentDetailPanel device={selected} open={drawerOpen} onClose={closeDrawer} formatDate={formatDate} />
    </div>
  );
}
