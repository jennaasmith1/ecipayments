import { useMemo, useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  getAdminCustomer,
  ADMIN_PREVIEW_STORAGE_KEY,
  formatCurrency,
  formatDate,
  flattenLocationsForCustomer,
  locationNameById,
} from '../../data/adminMockData';
import { invoices, serviceTickets, equipment, customer } from '../../data/fakeData';
import './adminPages.css';
import './CustomerDetail.css';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Contacts' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'service', label: 'Service' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'locations', label: 'Locations' },
];

const mockInvoicesOther = [
  { id: 'x1', number: '90101', description: 'Lease & maintenance', date: '2026-03-01', dueDate: '2026-03-15', amount: 4200, status: 'current' },
  { id: 'x2', number: '90102', description: 'Toner replenishment', date: '2026-02-20', dueDate: '2026-03-01', amount: 890, status: 'overdue' },
];

const mockTicketsOther = [
  { id: 'HW-204', subject: 'Finisher alignment', statusLabel: 'Open', createdAt: '2026-03-08' },
  { id: 'HW-198', subject: 'Firmware update', statusLabel: 'Scheduled', createdAt: '2026-03-05' },
];

export default function CustomerDetail() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const c = getAdminCustomer(customerId);

  const [tab, setTab] = useState('overview');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeLocationId, setActiveLocationId] = useState('');
  const [highlightInvoiceId, setHighlightInvoiceId] = useState(null);
  const [confirmPortal, setConfirmPortal] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const invList = useMemo(() => {
    if (!c) return [];
    if (c.useSharedFakeData) return invoices;
    if (c.id === 'hartwell') return mockInvoicesOther;
    if (c.id === 'meridian') return mockInvoicesOther.map((i) => ({ ...i, status: 'overdue' }));
    return [];
  }, [c]);

  const ticketList = useMemo(() => {
    if (!c) return [];
    if (c.useSharedFakeData) return serviceTickets;
    if (c.id === 'hartwell' || c.id === 'meridian') return mockTicketsOther;
    return [];
  }, [c]);

  const equipList = useMemo(() => {
    if (!c) return [];
    if (c.useSharedFakeData) return equipment;
    return [
      { id: 'm1', name: 'Canon imageRUNNER ADVANCE', model: '4525', serialNumber: 'CN-MOCK-1', location: 'HQ', status: 'active' },
    ];
  }, [c]);

  const latestInvoiceId = useMemo(() => {
    if (!invList.length) return null;
    const sorted = [...invList].sort((a, b) => new Date(b.date) - new Date(a.date));
    return sorted[0]?.id ?? null;
  }, [invList]);

  if (!c) {
    return (
      <div className="admin-page">
        <p>Customer not found.</p>
        <Link to="/admin/customers">Back to list</Link>
      </div>
    );
  }

  const flatLocs = flattenLocationsForCustomer(c);
  const locationSelectValue = activeLocationId || flatLocs[0]?.id || '';

  const openFullPortal = () => {
    try {
      sessionStorage.setItem(
        ADMIN_PREVIEW_STORAGE_KEY,
        JSON.stringify({ label: c.company, accountId: c.accountId })
      );
    } catch {
      /* ignore */
    }
    setConfirmPortal(false);
    navigate('/');
  };

  const showToast = (msg) => setToast(msg);

  return (
    <div key={customerId} className="admin-page admin-customer-detail">
      <p className="admin-breadcrumb">
        <Link to="/admin/customers">Customers</Link>
        <span aria-hidden> / </span>
        <span>{c.company}</span>
      </p>

      <header className="admin-customer-header">
        <div>
          <h1>{c.company}</h1>
          <p className="admin-page-subtitle">
            {c.accountId}
            {c.parentCompany && (
              <>
                {' '}
                · Parent: {c.parentCompany}
              </>
            )}
          </p>
        </div>
        <div className="admin-customer-actions">
          <button type="button" className="admin-btn admin-btn-primary" onClick={() => setPreviewOpen(true)}>
            View as customer
          </button>
          <button type="button" className="admin-btn" onClick={() => showToast('Password reset sent (demo)')}>
            Reset password
          </button>
          <button type="button" className="admin-btn" onClick={() => showToast('Invite sent (demo)')}>
            Resend invite
          </button>
          <button
            type="button"
            className="admin-btn"
            onClick={() => {
              setTab('invoices');
              setHighlightInvoiceId(latestInvoiceId);
            }}
            disabled={!latestInvoiceId}
          >
            Open latest invoice
          </button>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setConfirmPortal(true)}>
            Open full customer portal
          </button>
        </div>
      </header>

      {tab === 'overview' && (
        <div className="admin-card admin-location-context">
          <label htmlFor="admin-loc-switch" className="admin-section-title" style={{ display: 'block' }}>
            Active location (customer view)
          </label>
          <select
            id="admin-loc-switch"
            className="admin-select admin-loc-select"
            value={locationSelectValue}
            onChange={(e) => setActiveLocationId(e.target.value)}
          >
            {flatLocs.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {'—'.repeat(loc.depth)} {loc.name}
              </option>
            ))}
          </select>
          <p className="admin-field-hint">Mirrors the location switcher in the customer portal header (prototype).</p>
        </div>
      )}

      <div className="admin-tab-row">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab ${tab === t.id ? 'admin-tab-active' : ''}`}
            onClick={() => {
              setTab(t.id);
              if (t.id !== 'invoices') setHighlightInvoiceId(null);
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="admin-overview-grid">
          <section className="admin-card">
            <h2 className="admin-section-title">Support snapshot</h2>
            <dl className="admin-dl">
              <dt>Last portal login</dt>
              <dd>{c.lastPortalLogin}</dd>
              <dt>Open tickets</dt>
              <dd>
                {c.openTickets}
                {c.openTickets > 0 && (
                  <button type="button" className="admin-inline-link" onClick={() => setTab('service')}>
                    View
                  </button>
                )}
              </dd>
              <dt>Unpaid / overdue</dt>
              <dd>
                {c.unpaidTotal > 0 ? (
                  <span className={c.flags.overdueAr ? 'admin-ar-hot' : ''}>
                    {formatCurrency(c.unpaidTotal)} · {c.overdueInvoiceCount} overdue line{c.overdueInvoiceCount !== 1 ? 's' : ''}
                  </span>
                ) : (
                  '—'
                )}
                {c.unpaidTotal > 0 && (
                  <button type="button" className="admin-inline-link" onClick={() => setTab('invoices')}>
                    Invoices
                  </button>
                )}
              </dd>
            </dl>
          </section>
          <section className="admin-card">
            <h2 className="admin-section-title">Recent activity</h2>
            <ul className="admin-mini-activity">
              {c.recentActivityAdmin.map((a) => (
                <li key={a.id}>
                  <strong>{a.title}</strong>
                  <span>{a.detail}</span>
                  <time>{a.time}</time>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}

      {tab === 'users' && (
        <div className="admin-card">
          {c.portalUsers.length === 0 ? (
            <div className="admin-empty-state">
              <p>No portal users yet</p>
              <p className="admin-empty-hint">Invites can be resent from the toolbar above.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Locations</th>
                    <th>Last login</th>
                  </tr>
                </thead>
                <tbody>
                  {c.portalUsers.map((u) => (
                    <tr key={u.id} className={u.duplicateEmail ? 'admin-row-warn' : ''}>
                      <td>{u.name}</td>
                      <td>
                        {u.email}
                        {u.duplicateEmail && <span className="admin-dup-flag" title="Duplicate email" />}
                      </td>
                      <td>{u.role}</td>
                      <td>
                        <span className="admin-loc-badges">
                          {u.locationIds?.slice(0, 3).map((lid) => (
                            <span key={lid} className="admin-chip admin-chip-muted">
                              {locationNameById(c, lid)}
                            </span>
                          ))}
                          {(u.locationIds?.length ?? 0) > 3 && (
                            <span className="admin-chip admin-chip-muted">+{u.locationIds.length - 3}</span>
                          )}
                        </span>
                      </td>
                      <td>{u.lastLogin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {tab === 'invoices' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Description</th>
                <th>Date</th>
                <th>Due</th>
                <th>Status</th>
                <th className="admin-col-num">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invList.map((inv) => (
                <tr key={inv.id} className={highlightInvoiceId === inv.id ? 'admin-row-highlight' : ''}>
                  <td>#{inv.number}</td>
                  <td>{inv.description}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td>
                    <span
                      className={`admin-chip ${
                        inv.status === 'overdue' ? 'admin-chip-danger' : inv.status === 'due_soon' ? 'admin-chip-warn' : 'admin-chip-neutral'
                      }`}
                    >
                      {inv.status === 'overdue' ? 'Overdue' : inv.status === 'due_soon' ? 'Due soon' : inv.status === 'current' ? 'Current' : inv.status}
                    </span>
                  </td>
                  <td className="admin-col-num">{formatCurrency(inv.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'service' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {ticketList.map((t) => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.subject}</td>
                  <td>{t.statusLabel}</td>
                  <td>{formatDate(t.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'equipment' && (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Device</th>
                <th>Model</th>
                <th>Serial</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {equipList.map((e) => (
                <tr key={e.id}>
                  <td>{e.name}</td>
                  <td>{e.model}</td>
                  <td>{e.serialNumber}</td>
                  <td>{e.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'locations' && (
        <div className="admin-card">
          <h2 className="admin-section-title">Hierarchy & access</h2>
          <div className="admin-loc-layout">
            <div>
              <p className="admin-loc-intro">Locations</p>
              <ul className="admin-loc-tree">
                {flatLocs.map((loc) => (
                  <li key={loc.id} style={{ '--indent': `${loc.depth * 16}px` }}>
                    {loc.name}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="admin-loc-intro">Users → locations</p>
              <div className="admin-access-matrix">
                {c.portalUsers.map((u) => (
                  <div key={u.id} className="admin-access-row">
                    <strong>{u.name}</strong>
                    <div className="admin-loc-badges">
                      {u.locationIds?.map((lid) => (
                        <span key={lid} className="admin-chip admin-chip-neutral">
                          {locationNameById(c, lid)}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {previewOpen && (
        <>
          <button type="button" className="admin-drawer-backdrop" aria-label="Close preview" onClick={() => setPreviewOpen(false)} />
          <div className="admin-drawer" role="dialog" aria-labelledby="admin-preview-title">
            <div className="admin-drawer-header">
              <h2 id="admin-preview-title">Customer preview</h2>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setPreviewOpen(false)}>
                Close
              </button>
            </div>
            <div className="admin-drawer-body">
              <div className="admin-preview-frame">
                <div className="admin-preview-chrome">
                  <span className="admin-preview-dot" />
                  <span className="admin-preview-dot" />
                  <span className="admin-preview-dot" />
                  <span className="admin-preview-url">
                    {c.id === 'tesla' ? 'fleet.tesla.com' : 'portal.example.com'}
                  </span>
                </div>
                <div className="admin-preview-inner">
                  <p className="admin-preview-welcome">Welcome back, {c.useSharedFakeData ? customer.name.split(' ')[0] : c.primaryContact.split(' ')[0]}</p>
                  <p className="admin-preview-sub">{c.company}</p>
                  <div className="admin-preview-cards">
                    <div className="admin-preview-card">
                      <span>Account balance</span>
                      <strong>{formatCurrency(c.unpaidTotal || 0)}</strong>
                    </div>
                    <div className="admin-preview-card">
                      <span>Open tickets</span>
                      <strong>{c.openTickets}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div className="admin-preview-actions">
                <button type="button" className="admin-btn admin-btn-primary" onClick={() => setConfirmPortal(true)}>
                  Open full customer portal
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {confirmPortal && (
        <>
          <button type="button" className="admin-drawer-backdrop" onClick={() => setConfirmPortal(false)} aria-label="Close" />
          <div className="admin-modal" role="dialog">
            <h3>Open customer portal?</h3>
            <p>You’ll navigate to the customer experience with a preview banner.</p>
            <div className="admin-modal-actions">
              <button type="button" className="admin-btn" onClick={() => setConfirmPortal(false)}>
                Cancel
              </button>
              <button type="button" className="admin-btn admin-btn-primary" onClick={openFullPortal}>
                Continue
              </button>
            </div>
          </div>
        </>
      )}

      {toast && <div className="admin-toast" role="status">{toast}</div>}
    </div>
  );
}
