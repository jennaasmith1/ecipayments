import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminCustomers, formatCurrency } from '../../data/adminMockData';
import './adminPages.css';
import './CustomerList.css';

const ACCOUNT_TYPE_OPTIONS = [
  { key: 'all', label: 'All account types' },
  { key: 'standalone', label: 'Standalone' },
  { key: 'parent', label: 'Parent' },
  { key: 'child', label: 'Child' },
];

const PORTAL_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'has_users', label: 'Has portal users' },
  { key: 'no_users', label: 'No portal users' },
];

const AR_OPTIONS = [
  { key: 'all', label: 'All' },
  { key: 'unpaid', label: 'Unpaid balance' },
  { key: 'overdue', label: 'Overdue AR' },
  { key: 'current', label: 'No open AR' },
];

function FilterIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );
}

export default function CustomerList() {
  const [q, setQ] = useState('');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [accountType, setAccountType] = useState('all');
  const [portalFilter, setPortalFilter] = useState('all');
  const [arFilter, setArFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = [...adminCustomers];
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (c) =>
          c.company.toLowerCase().includes(s) ||
          c.accountId.toLowerCase().includes(s) ||
          c.primaryContact.toLowerCase().includes(s)
      );
    }
    if (accountType !== 'all') {
      list = list.filter((c) => c.type === accountType);
    }
    if (portalFilter === 'has_users') {
      list = list.filter((c) => c.portalUserCount > 0);
    } else if (portalFilter === 'no_users') {
      list = list.filter((c) => c.flags.noPortalUsers || c.portalUserCount === 0);
    }
    if (arFilter === 'unpaid') {
      list = list.filter((c) => c.unpaidTotal > 0);
    } else if (arFilter === 'overdue') {
      list = list.filter((c) => c.flags.overdueAr);
    } else if (arFilter === 'current') {
      list = list.filter((c) => c.unpaidTotal <= 0 && !c.flags.overdueAr);
    }
    return list;
  }, [q, accountType, portalFilter, arFilter]);

  const hasExtraFilters = accountType !== 'all' || portalFilter !== 'all' || arFilter !== 'all';
  const hasActiveFilters = q.trim() || hasExtraFilters;

  function clearAllFilters() {
    setQ('');
    setAccountType('all');
    setPortalFilter('all');
    setArFilter('all');
  }

  const chips = [];
  if (accountType !== 'all') {
    chips.push({
      key: 'type',
      label: `Type: ${ACCOUNT_TYPE_OPTIONS.find((o) => o.key === accountType)?.label ?? accountType}`,
      clear: () => setAccountType('all'),
    });
  }
  if (portalFilter !== 'all') {
    chips.push({
      key: 'portal',
      label: `Portal: ${PORTAL_OPTIONS.find((o) => o.key === portalFilter)?.label ?? portalFilter}`,
      clear: () => setPortalFilter('all'),
    });
  }
  if (arFilter !== 'all') {
    chips.push({
      key: 'ar',
      label: `AR: ${AR_OPTIONS.find((o) => o.key === arFilter)?.label ?? arFilter}`,
      clear: () => setArFilter('all'),
    });
  }
  if (q.trim()) {
    chips.push({
      key: 'q',
      label: `Search: “${q.trim()}”`,
      clear: () => setQ(''),
    });
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Customers</h1>
        <p className="admin-page-subtitle">Accounts, portal access, and AR signals (demo data).</p>
      </header>

      <section className="admin-toolbar" aria-label="Search and filters">
        <div className="admin-toolbar-search-row">
          <label className="admin-toolbar-search">
            <span className="sr-only">Search customers</span>
            <svg className="admin-toolbar-search-icon" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              id="admin-customer-search"
              type="search"
              className="admin-toolbar-search-input"
              placeholder="Search by name, account ID, or contact…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </label>
          <button
            type="button"
            className={`admin-customer-filter-toggle ${filtersExpanded ? 'admin-customer-filter-toggle--open' : ''} ${hasExtraFilters ? 'admin-customer-filter-toggle--active' : ''}`}
            onClick={() => setFiltersExpanded((v) => !v)}
            aria-expanded={filtersExpanded}
            aria-label={filtersExpanded ? 'Close filters' : 'Open filters'}
            title="Filters"
          >
            <FilterIcon />
          </button>
        </div>

        <div className={`admin-toolbar-filter-panel ${filtersExpanded ? 'admin-toolbar-filter-panel--open' : ''}`}>
          <div className="admin-toolbar-filters-grid">
            <div className="admin-toolbar-field">
              <label htmlFor="cust-f-type">Account type</label>
              <select id="cust-f-type" className="admin-select" value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                {ACCOUNT_TYPE_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="cust-f-portal">Portal users</label>
              <select id="cust-f-portal" className="admin-select" value={portalFilter} onChange={(e) => setPortalFilter(e.target.value)}>
                {PORTAL_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label htmlFor="cust-f-ar">AR</label>
              <select id="cust-f-ar" className="admin-select" value={arFilter} onChange={(e) => setArFilter(e.target.value)}>
                {AR_OPTIONS.map((o) => (
                  <option key={o.key} value={o.key}>
                    {o.label}
                  </option>
                ))}
              </select>
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
          <p className="admin-toolbar-filter-hint">
            Showing {filtered.length} of {adminCustomers.length} customers (demo data).
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

      <div className="admin-table-wrap admin-list-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Portal</th>
              <th>Primary contact</th>
              <th>AR</th>
              <th>Signals</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <Link to={`/admin/customers/${c.id}`} className="admin-table-link">
                    <strong>{c.company}</strong>
                    <span className="admin-table-sub">{c.accountId}</span>
                  </Link>
                </td>
                <td>
                  <span className="admin-chip admin-chip-neutral">{c.type}</span>
                </td>
                <td>
                  <span className={`admin-chip ${c.flags.noPortalUsers ? 'admin-chip-warn' : 'admin-chip-neutral'}`}>
                    {c.flags.noPortalUsers ? 'No users' : `${c.portalUserCount} users`}
                  </span>
                </td>
                <td>{c.primaryContact}</td>
                <td>
                  {c.unpaidTotal > 0 ? (
                    <span className={c.flags.overdueAr ? 'admin-ar-hot' : ''}>{formatCurrency(c.unpaidTotal)}</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <div className="admin-signal-cell">
                    {c.flags.overdueAr && <span className="admin-signal-dot admin-signal-ar" title="Overdue" />}
                    {c.flags.duplicateEmail && <span className="admin-signal-dot admin-signal-dup" title="Duplicate email" />}
                    {c.flags.messyLocationStructure && <span className="admin-signal-dot admin-signal-loc" title="Locations" />}
                    {c.flags.noPortalUsers && <span className="admin-signal-dot admin-signal-user" title="No portal users" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
