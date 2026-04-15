import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { globalServiceCalls } from '../../data/adminGlobalServiceData';
import { ADMIN_CUSTOMER_ROUTE_IDS } from '../../data/adminOrdersData';
import './adminPages.css';
import './AdminServiceDetail.css';

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

export default function AdminServiceDetail() {
  const { callId } = useParams();
  const [detailTab, setDetailTab] = useState('overview');

  const call = useMemo(() => globalServiceCalls.find((c) => c.id === callId) ?? null, [callId]);

  if (!call) {
    return (
      <div className="admin-page">
        <p>Service call not found.</p>
        <Link to="/admin/service">Back to service</Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-service-detail-page">
      <p className="admin-breadcrumb">
        <Link to="/admin/service">Service</Link>
        <span aria-hidden> / </span>
        <span>{call.callNumber}</span>
      </p>

      <header className="admin-service-detail-header">
        <div>
          <h1>{call.callNumber}</h1>
          <p className="admin-page-subtitle">
            {ADMIN_CUSTOMER_ROUTE_IDS.has(call.customerId) ? (
              <Link to={`/admin/customers/${call.customerId}?tab=service`} className="admin-btn admin-btn-customer">
                {call.customerName}
              </Link>
            ) : (
              <span>{call.customerName}</span>
            )}
          </p>
        </div>
        <div className="admin-service-detail-header-right">
          <span className={`admin-svc-chip ${statusChipClass(call.statusKey)}`}>{call.statusLabel}</span>
          <span className={`admin-svc-priority ${priorityClass(call.priority)}`}>{priorityLabel(call.priority)}</span>
        </div>
      </header>

      <div className="admin-tab-row admin-service-detail-tabs" role="tablist">
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

      <div className="admin-service-detail-content">
        {detailTab === 'overview' && (
          <div className="admin-service-detail-grid">
            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Call overview</h2>
              <dl className="admin-service-detail-dl">
                <div>
                  <dt>Opened</dt>
                  <dd>{formatDateTime(call.openedAt)}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatDateTime(call.lastUpdated)}</dd>
                </div>
                <div>
                  <dt>Assigned tech</dt>
                  <dd>{call.assignedTech}</dd>
                </div>
                <div>
                  <dt>Call type</dt>
                  <dd>{call.callType}</dd>
                </div>
                <div>
                  <dt>Branch</dt>
                  <dd>{call.branch}</dd>
                </div>
                <div>
                  <dt>Billing</dt>
                  <dd className="admin-service-cap">{call.contractBilling.replace(/_/g, ' ')}</dd>
                </div>
              </dl>
            </section>

            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Problem</h2>
              <p className="admin-service-prose">{call.problemDescription}</p>
              <p className="admin-service-muted">
                <strong>Original request:</strong> {call.issueSummary}
              </p>
            </section>

            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Equipment on call</h2>
              <dl className="admin-service-detail-dl">
                <div>
                  <dt>Device</dt>
                  <dd>{call.equipmentName}</dd>
                </div>
                <div>
                  <dt>Equipment #</dt>
                  <dd>{call.equipmentNumber}</dd>
                </div>
                <div>
                  <dt>Serial</dt>
                  <dd>{call.serialNumber}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{call.location}</dd>
                </div>
              </dl>
            </section>

            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Account context</h2>
              <p className="admin-service-stat">
                Open calls for this customer: <strong>{call.accountOpenCalls}</strong>
              </p>
            </section>
          </div>
        )}

        {detailTab === 'activity' && (
          <div className="admin-service-detail-grid">
            <section className="admin-service-detail-section admin-service-detail-section--wide admin-card">
              <h2 className="admin-section-title">Timeline</h2>
              <ul className="admin-service-timeline">
                {call.timeline.map((ev, i) => (
                  <li key={i}>
                    <span className="admin-service-tl-dot" aria-hidden />
                    <div>
                      <strong>{ev.label}</strong>
                      <span className="admin-service-tl-time">{formatDateTime(ev.at)}</span>
                      {ev.detail && <p className="admin-service-tl-detail">{ev.detail}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {detailTab === 'equipment' && (
          <div className="admin-service-detail-grid">
            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Equipment details</h2>
              <dl className="admin-service-detail-dl">
                <div>
                  <dt>Device</dt>
                  <dd>{call.equipmentName}</dd>
                </div>
                <div>
                  <dt>Equipment #</dt>
                  <dd>{call.equipmentNumber}</dd>
                </div>
                <div>
                  <dt>Serial</dt>
                  <dd>{call.serialNumber}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{call.location}</dd>
                </div>
                <div>
                  <dt>Type</dt>
                  <dd>{call.equipmentType}</dd>
                </div>
                <div>
                  <dt>Contract on call</dt>
                  <dd>{call.contractBilling.replace(/_/g, ' ')}</dd>
                </div>
              </dl>
            </section>
          </div>
        )}

        {detailTab === 'customer' && (
          <div className="admin-service-detail-grid">
            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Account context</h2>
              <p className="admin-service-stat">
                Open calls for this customer: <strong>{call.accountOpenCalls}</strong>
              </p>
            </section>

            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Recent service history</h2>
              <ul className="admin-service-history">
                {call.recentHistory.length === 0 && <li className="admin-service-muted">No additional history.</li>}
                {call.recentHistory.map((h) => (
                  <li key={h.id}>
                    <span className="admin-service-hist-id">{h.id}</span>
                    <span className="admin-service-hist-date">{formatDateShort(h.date)}</span>
                    <span>{h.summary}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {detailTab === 'notes' && (
          <div className="admin-service-detail-grid">
            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Internal notes</h2>
              <ul className="admin-service-notes">
                {call.internalNotes.length === 0 && <li className="admin-service-muted">No internal notes yet.</li>}
                {call.internalNotes.map((n) => (
                  <li key={n.id}>
                    <span className="admin-service-note-meta">
                      {formatDateTime(n.at)} · {n.author}
                    </span>
                    <p>{n.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-service-detail-section admin-card">
              <h2 className="admin-section-title">Customer-facing updates</h2>
              <ul className="admin-service-comm">
                {call.customerUpdates.length === 0 && <li className="admin-service-muted">No customer-visible updates.</li>}
                {call.customerUpdates.map((u) => (
                  <li key={u.id}>
                    <span className="admin-service-comm-channel">{u.channel}</span>
                    <span className="admin-service-note-meta">{formatDateTime(u.at)}</span>
                    <p>{u.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-service-detail-section admin-service-detail-section--wide admin-card">
              <h2 className="admin-section-title">Add note</h2>
              <div className="admin-service-compose">
                <textarea
                  className="admin-textarea"
                  placeholder="Notes saved only in a full build — this is a static prototype."
                  rows={3}
                  readOnly
                />
              </div>
            </section>
          </div>
        )}
      </div>

      <p className="admin-service-detail-footer">
        Service data syncs from e-automate. For dispatching and time entry, use e-automate or your service management system.
      </p>
    </div>
  );
}
