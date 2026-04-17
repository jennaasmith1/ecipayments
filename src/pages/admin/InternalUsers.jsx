import { useState, useMemo, useRef, useEffect } from 'react';
import { internalUsers, rolesCatalog } from '../../data/adminMockData';
import './adminPages.css';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z', key: 'name', dir: 1 },
  { value: 'name-desc', label: 'Name Z–A', key: 'name', dir: -1 },
  { value: 'lastActive-desc', label: 'Last active (recent)', key: 'lastActive', dir: -1 },
  { value: 'lastActive-asc', label: 'Last active (oldest)', key: 'lastActive', dir: 1 },
  { value: 'dateAdded-desc', label: 'Date added (newest)', key: 'dateAdded', dir: -1 },
  { value: 'dateAdded-asc', label: 'Date added (oldest)', key: 'dateAdded', dir: 1 },
];

const STATUS_OPTIONS = ['active', 'invited', 'deactivated'];
const TERRITORY_OPTIONS = [...new Set(internalUsers.map((u) => u.territory))].sort();
const ROLE_OPTIONS = [...new Set(internalUsers.map((u) => u.role))].sort();

const STATUS_META = {
  active: { label: 'Active', cls: 'admin-chip-success' },
  invited: { label: 'Invited', cls: 'admin-chip-warn' },
  deactivated: { label: 'Deactivated', cls: 'admin-chip-muted' },
};

function initials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2);
}

function ActionMenu({ user, onClose }) {
  const ref = useRef(null);
  const [openUp, setOpenUp] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 8) setOpenUp(true);
    }
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = [];
  if (user.status === 'active') {
    items.push({ label: 'Edit user', action: 'edit' });
    items.push({ label: 'Reset password', action: 'reset' });
    items.push({ label: 'Deactivate', action: 'deactivate', danger: true });
  } else if (user.status === 'invited') {
    items.push({ label: 'Resend invite', action: 'resend' });
    items.push({ label: 'Revoke invite', action: 'revoke', danger: true });
  } else {
    items.push({ label: 'Reactivate', action: 'reactivate' });
  }

  return (
    <ul className={`iu-action-menu${openUp ? ' iu-action-menu--up' : ''}`} ref={ref}>
      {items.map((it) => (
        <li key={it.action}>
          <button
            type="button"
            className={`iu-action-menu-item${it.danger ? ' iu-action-menu-danger' : ''}`}
            onClick={onClose}
          >
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

export default function InternalUsers() {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('name-asc');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterTerritory, setFilterTerritory] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [openAction, setOpenAction] = useState(null);
  const [toast, setToast] = useState(null);

  const activeFilterCount = [filterStatus, filterRole, filterTerritory].filter(Boolean).length;

  const filtered = useMemo(() => {
    let list = internalUsers;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }
    if (filterStatus) list = list.filter((u) => u.status === filterStatus);
    if (filterRole) list = list.filter((u) => u.role === filterRole);
    if (filterTerritory) list = list.filter((u) => u.territory === filterTerritory);

    const sort = SORT_OPTIONS.find((s) => s.value === sortKey) || SORT_OPTIONS[0];
    list = [...list].sort((a, b) => {
      const av = (a[sort.key] || '').toLowerCase();
      const bv = (b[sort.key] || '').toLowerCase();
      return av < bv ? -sort.dir : av > bv ? sort.dir : 0;
    });

    return list;
  }, [search, filterStatus, filterRole, filterTerritory, sortKey]);

  const allSelected = filtered.length > 0 && filtered.every((u) => selected.has(u.id));
  const someSelected = filtered.some((u) => selected.has(u.id));

  function toggleAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((u) => u.id)));
    }
  }

  function toggleOne(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function clearFilters() {
    setFilterStatus('');
    setFilterRole('');
    setFilterTerritory('');
  }

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  }

  function handleBulkAction(action) {
    showToast(`${action} ${selected.size} user${selected.size === 1 ? '' : 's'} (demo)`);
    setSelected(new Set());
  }

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Internal users</h1>
        <p className="admin-page-subtitle">Ubeo internal team directory (demo).</p>
      </header>

      {/* Top actions */}
      <div className="admin-actions-row" style={{ marginBottom: 16 }}>
        <button type="button" className="admin-btn admin-btn-primary">
          Invite user
        </button>
        {selected.size > 0 && (
          <div className="iu-bulk-bar">
            <span className="iu-bulk-count">{selected.size} selected</span>
            <button type="button" className="admin-btn" onClick={() => handleBulkAction('Deactivate')}>
              Deactivate
            </button>
            <button type="button" className="admin-btn" onClick={() => handleBulkAction('Change role for')}>
              Change role
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-ghost"
              onClick={() => setSelected(new Set())}
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Toolbar: search + sort + filter toggle */}
      <div className="admin-toolbar">
        <div className="admin-toolbar-search-row">
          <div className="admin-toolbar-search">
            <span className="admin-toolbar-search-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </span>
            <input
              type="text"
              className="admin-toolbar-search-input"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="admin-toolbar-sort"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            type="button"
            className={`admin-toolbar-filter-toggle ${filtersOpen ? 'admin-toolbar-filter-toggle--open' : ''}`}
            onClick={() => setFiltersOpen((o) => !o)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>

        {/* Filter panel */}
        <div className={`admin-toolbar-filter-panel ${filtersOpen ? 'admin-toolbar-filter-panel--open' : ''}`}>
          <div className="admin-toolbar-filters-grid">
            <div className="admin-toolbar-field">
              <label>Status</label>
              <select className="admin-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label>Role</label>
              <select className="admin-select" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">All roles</option>
                {ROLE_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="admin-toolbar-field">
              <label>Territory</label>
              <select className="admin-select" value={filterTerritory} onChange={(e) => setFilterTerritory(e.target.value)}>
                <option value="">All territories</option>
                {TERRITORY_OPTIONS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>
          {activeFilterCount > 0 && (
            <div className="admin-toolbar-toggles">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={clearFilters}>
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results count */}
      <p className="iu-result-count">
        {filtered.length} user{filtered.length !== 1 ? 's' : ''}
        {activeFilterCount > 0 || search ? ' matching' : ''}
      </p>

      {/* Table */}
      <div className="admin-table-wrap">
        <table className="admin-table iu-table">
          <thead>
            <tr>
              <th className="iu-col-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                  onChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Territory</th>
              <th>Status</th>
              <th>MFA</th>
              <th>Last active</th>
              <th>Added</th>
              <th className="iu-col-actions"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="10" className="iu-empty">No users match your filters.</td>
              </tr>
            )}
            {filtered.map((u) => {
              const sm = STATUS_META[u.status];
              return (
                <tr key={u.id} className={selected.has(u.id) ? 'admin-row-highlight' : ''}>
                  <td className="iu-col-check">
                    <input
                      type="checkbox"
                      checked={selected.has(u.id)}
                      onChange={() => toggleOne(u.id)}
                      aria-label={`Select ${u.name}`}
                    />
                  </td>
                  <td>
                    <div className="iu-name-cell">
                      <span className={`iu-avatar iu-avatar--${u.status}`}>{initials(u.name)}</span>
                      <span className="iu-name-text">{u.name}</span>
                    </div>
                  </td>
                  <td className="iu-email">{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.territory}</td>
                  <td><span className={`admin-chip ${sm.cls}`}>{sm.label}</span></td>
                  <td className="iu-mfa-cell">
                    {u.mfaEnabled ? (
                      <span className="iu-mfa-on" title="MFA enabled">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                      </span>
                    ) : (
                      <span className="iu-mfa-off" title="MFA not enabled">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      </span>
                    )}
                  </td>
                  <td className={u.status === 'deactivated' ? 'iu-text-muted' : ''}>{u.lastActive}</td>
                  <td className="iu-text-muted">{u.dateAdded}</td>
                  <td className="iu-col-actions">
                    <div className="iu-action-wrap">
                      <button
                        type="button"
                        className="iu-action-trigger"
                        aria-label={`Actions for ${u.name}`}
                        onClick={() => setOpenAction(openAction === u.id ? null : u.id)}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                      </button>
                      {openAction === u.id && (
                        <ActionMenu user={u} onClose={() => setOpenAction(null)} />
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
