import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import {
  isOpenServiceTicket,
  contractOnTicketIsCovered,
  resolveTicketEquipment,
} from '../data/serviceTicketsData';
import { useServiceTickets } from '../context/ServiceTicketsContext';
import ServiceRequestForm from './ServiceRequestForm';
import ServiceTicketDetailPanel from './ServiceTicketDetailPanel';
import { buildDraftTicket, nextTicketId } from './serviceFormShared';
import './Equipment.css';
import './Service.css';

const STATUS_FILTER_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'new', label: 'New' },
  { value: 'pending_dispatch', label: 'Pending dispatch' },
  { value: 'technician_scheduled', label: 'Technician scheduled' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'waiting_on_parts', label: 'Waiting on parts' },
  { value: 'waiting_on_customer', label: 'Waiting on customer' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'completed', label: 'Completed' },
  { value: 'closed', label: 'Closed' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'updated', label: 'Recently updated' },
  { value: 'scheduled', label: 'Scheduled soonest' },
];

const QUICK_FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'scheduled', label: 'Scheduled' },
  { id: 'completed', label: 'Completed' },
  { id: 'mine', label: 'My open tickets' },
];

function formatScheduleWindow(start, end) {
  if (!start) return null;
  const s = new Date(start);
  const e = end ? new Date(end) : null;
  const d = s.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const t1 = s.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!e) return `${d}, ${t1}`;
  const t2 = e.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${d}, ${t1}–${t2}`;
}

function ticketSearchHaystack(ticket, equipment) {
  return [
    ticket.id,
    ticket.subject,
    ticket.summary,
    equipment?.equipmentNo,
    equipment?.serialNumber,
    equipment?.displayName,
    ticket.locationLabel,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

export default function Service() {
  const { customer, formatDate, fleetEquipment } = usePortalProfile();
  const servicePath = usePortalPath('/service');
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { tickets, setTickets } = useServiceTickets();
  const fleetById = useMemo(() => Object.fromEntries(fleetEquipment.map((e) => [e.id, e])), [fleetEquipment]);

  const [filtersDropdownOpen, setFiltersDropdownOpen] = useState(false);
  const filterTriggerRef = useRef(null);
  const filterPanelRef = useRef(null);
  const [filterPanelBox, setFilterPanelBox] = useState(null);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [contractFilter, setContractFilter] = useState('');
  const [sortKey, setSortKey] = useState('newest');
  const [quickFilter, setQuickFilter] = useState('all');

  const createdId = searchParams.get('created');

  const dismissCreatedBanner = () => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.delete('created');
      return p;
    });
  };

  const locations = useMemo(() => {
    const set = new Set(tickets.map((t) => t.locationLabel).filter(Boolean));
    return [...set].sort();
  }, [tickets]);

  const quickFilterCounts = useMemo(() => {
    const terminalStatuses = new Set(['completed', 'closed', 'resolved']);
    return {
      all: tickets.length,
      open: tickets.filter(isOpenServiceTicket).length,
      scheduled: tickets.filter((t) => t.status === 'technician_scheduled').length,
      completed: tickets.filter((t) => terminalStatuses.has(t.status)).length,
      mine: tickets.filter((t) => isOpenServiceTicket(t) && t.requestedBy === customer.name).length,
    };
  }, [tickets, customer.name]);

  const activeAdvancedFilterCount = useMemo(() => {
    let n = 0;
    if (statusFilter) n += 1;
    if (locationFilter) n += 1;
    if (dateFrom) n += 1;
    if (dateTo) n += 1;
    if (contractFilter) n += 1;
    if (sortKey !== 'newest') n += 1;
    return n;
  }, [statusFilter, locationFilter, dateFrom, dateTo, contractFilter, sortKey]);

  const updateFilterPanelPlacement = useCallback(() => {
    const btn = filterTriggerRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const margin = 12;
    const width = Math.min(380, window.innerWidth - margin * 2);
    let left = rect.right - width;
    left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));
    const gap = 6;
    const cap = Math.min(520, window.innerHeight * 0.7);
    const below = window.innerHeight - rect.bottom - gap - margin;
    let maxHeight = Math.min(cap, below);
    let top = rect.bottom + gap;
    const minComfort = 220;
    const above = rect.top - gap - margin;
    if (maxHeight < minComfort && above > maxHeight) {
      const aboveH = Math.min(cap, above);
      if (aboveH > maxHeight) {
        maxHeight = aboveH;
        top = rect.top - gap - maxHeight;
      }
    }
    maxHeight = Math.max(160, maxHeight);
    setFilterPanelBox({ top, left, width, maxHeight });
  }, []);

  useLayoutEffect(() => {
    if (!filtersDropdownOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset panel anchor when dropdown closes
      setFilterPanelBox(null);
      return undefined;
    }
    updateFilterPanelPlacement();
    window.addEventListener('resize', updateFilterPanelPlacement);
    window.addEventListener('scroll', updateFilterPanelPlacement, true);
    return () => {
      window.removeEventListener('resize', updateFilterPanelPlacement);
      window.removeEventListener('scroll', updateFilterPanelPlacement, true);
    };
  }, [filtersDropdownOpen, updateFilterPanelPlacement]);

  useEffect(() => {
    if (!filtersDropdownOpen) return undefined;
    const onDoc = (e) => {
      if (filterTriggerRef.current?.contains(e.target) || filterPanelRef.current?.contains(e.target)) return;
      setFiltersDropdownOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setFiltersDropdownOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [filtersDropdownOpen]);

  const clearAdvancedFilters = useCallback(() => {
    setStatusFilter('');
    setLocationFilter('');
    setDateFrom('');
    setDateTo('');
    setContractFilter('');
    setSortKey('newest');
  }, []);

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = tickets.filter((t) => !t.isDraft);

    if (q) {
      list = list.filter((t) => ticketSearchHaystack(t, fleetById[t.equipmentId]).includes(q));
    }
    if (statusFilter) list = list.filter((t) => t.status === statusFilter);
    if (locationFilter) list = list.filter((t) => t.locationLabel === locationFilter);
    if (dateFrom) list = list.filter((t) => new Date(t.createdAt) >= new Date(dateFrom));
    if (dateTo) list = list.filter((t) => new Date(t.createdAt) <= new Date(dateTo));
    if (contractFilter === 'under') {
      list = list.filter((t) => contractOnTicketIsCovered(t.contractStatusOnTicket));
    }
    if (contractFilter === 'not') {
      list = list.filter((t) => !contractOnTicketIsCovered(t.contractStatusOnTicket));
    }

    if (quickFilter === 'open') list = list.filter(isOpenServiceTicket);
    else if (quickFilter === 'scheduled') list = list.filter((t) => t.status === 'technician_scheduled');
    else if (quickFilter === 'completed') {
      list = list.filter((t) => ['completed', 'closed', 'resolved'].includes(t.status));
    } else if (quickFilter === 'mine') {
      list = list.filter((t) => isOpenServiceTicket(t) && t.requestedBy === customer.name);
    }

    const draftTickets = tickets.filter((t) => t.isDraft);
    const shownDrafts = draftTickets.filter((d) => {
      if (q && !ticketSearchHaystack(d, fleetById[d.equipmentId]).includes(q)) return false;
      if (quickFilter === 'scheduled' || quickFilter === 'completed') return false;
      if (quickFilter === 'mine' && d.requestedBy !== customer.name) return false;
      if (statusFilter && statusFilter !== 'draft') return false;
      if (locationFilter && d.locationLabel !== locationFilter) return false;
      if (dateFrom && new Date(d.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(d.createdAt) > new Date(dateTo)) return false;
      if (contractFilter === 'under' && !contractOnTicketIsCovered(d.contractStatusOnTicket)) return false;
      if (contractFilter === 'not' && contractOnTicketIsCovered(d.contractStatusOnTicket)) return false;
      return true;
    });

    list.sort((a, b) => {
      if (sortKey === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortKey === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortKey === 'updated') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortKey === 'scheduled') {
        const as = a.scheduledVisitStart ? new Date(a.scheduledVisitStart).getTime() : Infinity;
        const bs = b.scheduledVisitStart ? new Date(b.scheduledVisitStart).getTime() : Infinity;
        if (as !== bs) return as - bs;
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    shownDrafts.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    return [...shownDrafts, ...list];
  }, [
    tickets,
    search,
    statusFilter,
    locationFilter,
    dateFrom,
    dateTo,
    contractFilter,
    sortKey,
    quickFilter,
    fleetById,
    customer.name,
  ]);

  const selectedTicket = useMemo(
    () => (ticketId ? tickets.find((t) => t.id === ticketId) ?? null : null),
    [tickets, ticketId],
  );
  const selectedEquipment = selectedTicket ? resolveTicketEquipment(selectedTicket, fleetById) : null;

  const openDetail = useCallback(
    (id) => {
      navigate(`${servicePath}/${encodeURIComponent(id)}`);
    },
    [navigate, servicePath],
  );

  const closeDetail = useCallback(() => {
    navigate(servicePath);
  }, [navigate, servicePath]);

  const isCreateMode = searchParams.get('create') === '1';
  const equipmentCreateQuery = searchParams.get('equipment');

  useLayoutEffect(() => {
    if (!isCreateMode || ticketId) return;
    let newId = null;
    setTickets((prev) => {
      const id = nextTicketId(prev);
      const eqKey =
        equipmentCreateQuery && fleetById[equipmentCreateQuery] ? equipmentCreateQuery : fleetEquipment[0]?.id;
      const equip = eqKey ? fleetById[eqKey] : null;
      if (!equip) return prev;
      newId = id;
      return [buildDraftTicket(id, equip, customer.name), ...prev];
    });
    if (newId) {
      navigate(`${servicePath}/${encodeURIComponent(newId)}`, { replace: true });
    }
  }, [isCreateMode, ticketId, equipmentCreateQuery, fleetById, fleetEquipment, customer.name, navigate, servicePath, setTickets]);

  const onCreateSuccess = useCallback(
    (ticket) => {
      navigate(`${servicePath}/${encodeURIComponent(ticket.id)}?created=${encodeURIComponent(ticket.id)}`);
    },
    [navigate, servicePath],
  );

  const listSection = (
    <section className="service-list-section" aria-labelledby="service-heading">
      <div className="service-list-head">
        <h1 id="service-heading" className="service-list-title">
          Service
        </h1>
        <button
          type="button"
          className="service-btn service-btn-primary service-list-cta"
          id="service-create-link"
          onClick={() => navigate(`${servicePath}?create=1`)}
        >
          Request Service
        </button>
      </div>

      <div className="service-chips" role="tablist" aria-label="Quick filters">
        {QUICK_FILTERS.map((chip) => {
          const count = quickFilterCounts[chip.id];
          return (
            <button
              key={chip.id}
              type="button"
              role="tab"
              aria-selected={quickFilter === chip.id}
              aria-label={`${chip.label}, ${count} ticket${count !== 1 ? 's' : ''}`}
              className={`service-chip ${quickFilter === chip.id ? 'service-chip-active' : ''}`}
              onClick={() => setQuickFilter(chip.id)}
            >
              <span className="service-chip-text">{chip.label}</span>
              <span className="service-chip-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="service-search-filter-row">
        <label className="service-search-filter-input-wrap">
          <span className="service-sr-only">Search tickets</span>
          <div className="service-search-filter-field">
            <svg
              className="service-search-filter-icon"
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
              className="service-input service-search-filter-input"
              placeholder="Search — ticket #, equipment #, serial, subject…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoComplete="off"
            />
          </div>
        </label>
        <div className="service-filter-dropdown-anchor">
          <button
            ref={filterTriggerRef}
            type="button"
            className={`service-filter-icon-btn ${filtersDropdownOpen ? 'is-open' : ''} ${activeAdvancedFilterCount > 0 ? 'has-active-filters' : ''}`}
            aria-expanded={filtersDropdownOpen}
            aria-controls="service-filters-dropdown"
            aria-haspopup="dialog"
            aria-label={
              activeAdvancedFilterCount > 0
                ? `Filters, ${activeAdvancedFilterCount} active. Open filter menu.`
                : 'Open filter menu'
            }
            onClick={() => setFiltersDropdownOpen((o) => !o)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinejoin="round" />
            </svg>
            {activeAdvancedFilterCount > 0 && (
              <span className="service-filter-icon-badge">{activeAdvancedFilterCount}</span>
            )}
          </button>
        </div>
      </div>

      {filtersDropdownOpen &&
        filterPanelBox &&
        createPortal(
          <div
            id="service-filters-dropdown"
            ref={filterPanelRef}
            className="service-filters-dropdown service-filters-dropdown--portal"
            role="dialog"
            aria-label="Refine tickets"
            style={{
              top: filterPanelBox.top,
              left: filterPanelBox.left,
              width: filterPanelBox.width,
              maxHeight: filterPanelBox.maxHeight,
            }}
          >
            <div className="service-filters-dropdown-fields">
              <label className="service-filters-dropdown-field">
                <span className="service-filters-dropdown-label">Status</span>
                <select
                  className="service-input"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {STATUS_FILTER_OPTIONS.map((o) => (
                    <option key={o.value || 'all'} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="service-filters-dropdown-field">
                <span className="service-filters-dropdown-label">Location</span>
                <select
                  className="service-input"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>
              <div className="service-filters-dropdown-dates">
                <label className="service-filters-dropdown-field">
                  <span className="service-filters-dropdown-label">Created from</span>
                  <input type="date" className="service-input" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                </label>
                <label className="service-filters-dropdown-field">
                  <span className="service-filters-dropdown-label">Created to</span>
                  <input type="date" className="service-input" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                </label>
              </div>
              <label className="service-filters-dropdown-field">
                <span className="service-filters-dropdown-label">Contract</span>
                <select
                  className="service-input"
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="under">Under contract</option>
                  <option value="not">Not under contract</option>
                </select>
              </label>
              <label className="service-filters-dropdown-field">
                <span className="service-filters-dropdown-label">Sort</span>
                <select className="service-input" value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="service-filters-dropdown-footer">
              <button
                type="button"
                className="service-btn service-btn-ghost service-btn-small"
                disabled={activeAdvancedFilterCount === 0}
                onClick={() => {
                  clearAdvancedFilters();
                }}
              >
                Reset filters
              </button>
            </div>
          </div>,
          document.body,
        )}

      {filteredSorted.length === 0 ? (
        <div className="service-empty">
          <p>No tickets match your filters.</p>
          <button
            type="button"
            className="service-btn service-btn-ghost"
            onClick={() => {
              setSearch('');
              clearAdvancedFilters();
              setQuickFilter('all');
              setFiltersDropdownOpen(false);
            }}
          >
            Clear filters
          </button>
        </div>
      ) : (
        <ul className="service-ticket-list">
          {filteredSorted.map((t) => {
            const eq = fleetById[t.equipmentId];
            const schedule = formatScheduleWindow(t.scheduledVisitStart, t.scheduledVisitEnd);
            const isSel = ticketId === t.id;
            return (
              <li key={t.id} className="service-ticket-list-item">
                <button
                  type="button"
                  className={`service-ticket-row ${isSel ? 'service-ticket-row--selected' : ''}`}
                  onClick={() => openDetail(t.id)}
                  aria-current={isSel ? 'true' : undefined}
                >
                  <div className="service-ticket-row-head">
                    <h3 className="service-ticket-title service-ticket-title--list">{t.subject}</h3>
                    <span className={`service-status-pill service-status-pill--compact service-status-pill--${t.status}`}>
                      {t.statusLabel}
                    </span>
                  </div>
                  <p className="service-ticket-row-sub">
                    <span className="service-ticket-num">{t.id}</span>
                    {' · '}
                    {eq?.displayName ?? 'Equipment'}
                    {t.locationLabel ? ` · ${t.locationLabel}` : ''}
                  </p>
                  <div className="service-ticket-row-foot">
                    <div className="service-ticket-row-meta">
                      {schedule ? (
                        <span>Visit {schedule}</span>
                      ) : (
                        <span>Created {formatDate(t.createdAt)}</span>
                      )}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );

  const detailPane = (() => {
    if (ticketId) {
      if (!selectedTicket) {
        return (
          <div className="service-detail-placeholder service-detail-placeholder--error" role="alert">
            <div className="service-detail-placeholder-inner">
              <p className="service-detail-placeholder-title">Ticket not found</p>
              <p className="service-detail-placeholder-text">No ticket matches “{ticketId}”. It may have been removed or the link is wrong.</p>
              <button type="button" className="service-btn service-btn-primary" onClick={closeDetail}>
                Back to all tickets
              </button>
            </div>
          </div>
        );
      }
      if (selectedTicket.isDraft) {
        return (
          <ServiceRequestForm
            key={selectedTicket.id}
            draftTicket={selectedTicket}
            onSuccess={onCreateSuccess}
            onCancel={() => {
              setTickets((prev) => prev.filter((t) => t.id !== selectedTicket.id));
              closeDetail();
            }}
          />
        );
      }
      return (
        <ServiceTicketDetailPanel
          key={selectedTicket.id}
          ticket={selectedTicket}
          equipment={selectedEquipment}
          onClose={closeDetail}
        />
      );
    }
    return (
      <div className="service-detail-placeholder" role="region" aria-label="Ticket details">
        <div className="service-detail-placeholder-inner">
          <p className="service-detail-placeholder-title">Select a service ticket</p>
          <p className="service-detail-placeholder-text">
            Choose a ticket from the list to see status, equipment, timeline, and messages — switch tickets anytime without closing
            panels.
          </p>
        </div>
      </div>
    );
  })();

  return (
    <div className="service-page" data-mobile-detail={ticketId ? 'true' : 'false'}>
      {createdId && (
        <div className="service-banner service-banner-success" role="status">
          <div>
            <strong>Ticket {createdId} submitted.</strong> You’ll see it in your list below. This is a demo — no data was sent anywhere.
          </div>
          <button type="button" className="service-btn service-btn-ghost" onClick={dismissCreatedBanner}>
            Dismiss
          </button>
        </div>
      )}

      <div className="service-split">
        <div className="service-split-list">{listSection}</div>
        <div className="service-split-detail">{detailPane}</div>
      </div>
    </div>
  );
}
