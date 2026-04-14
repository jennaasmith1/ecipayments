import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import EquipmentDeviceThumb from '../components/EquipmentDeviceThumb';
import { contractOnTicketIsCovered } from '../data/serviceTicketsData';
import { usePortalProfile } from '../context/PortalProfileContext';

const contractTicketLabels = {
  active: 'Active maintenance contract',
  month_to_month: 'Month-to-month contract',
  expiring: 'Contract expiring soon',
  none: 'No maintenance contract',
};

const timelineIcon = (type) => {
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };
  switch (type) {
    case 'created':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" strokeLinecap="round" />
        </svg>
      );
    case 'dealer':
    case 'dispatch':
      return (
        <svg {...common}>
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'scheduled':
    case 'enroute':
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 2v4M16 2v4" strokeLinecap="round" />
        </svg>
      );
    case 'parts':
      return (
        <svg {...common}>
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        </svg>
      );
    case 'progress':
      return (
        <svg {...common}>
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      );
    case 'customer':
      return (
        <svg {...common}>
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      );
    case 'payment':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M2 10h20" />
        </svg>
      );
    case 'notify':
    case 'closed':
      return (
        <svg {...common}>
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
};

function TonerBar({ label, value, tone }) {
  if (value == null) return null;
  const low = value <= 25;
  return (
    <div className="service-detail-toner-row">
      <span className="service-detail-toner-label">{label}</span>
      <div className="service-detail-toner-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`service-detail-toner-fill service-detail-toner-fill--${tone} ${low ? 'service-detail-toner-fill--low' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`service-detail-toner-pct ${low ? 'service-detail-toner-pct--low' : ''}`}>{value}%</span>
    </div>
  );
}

export default function ServiceTicketDetailPanel({ ticket, equipment, onClose }) {
  const { formatDate, formatDateTime } = usePortalProfile();
  const titleRef = useRef(null);
  const [showExtraEquipment, setShowExtraEquipment] = useState(false);
  const [chatDraft, setChatDraft] = useState('');
  const [extraMessages, setExtraMessages] = useState([]);

  useEffect(() => {
    const t = window.setTimeout(() => titleRef.current?.focus(), 80);
    return () => window.clearTimeout(t);
  }, [ticket?.id]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const allMessages = useMemo(() => {
    if (!ticket) return [];
    const base = [...ticket.messages, ...extraMessages];
    return base.sort((a, b) => new Date(a.at) - new Date(b.at));
  }, [ticket, extraMessages]);

  if (!ticket) return null;

  const covered = contractOnTicketIsCovered(ticket.contractStatusOnTicket);
  const unreadInThread = ticket.messages.some((m) => m.role === 'dealer' && m.readByCustomer === false);

  const sendChat = (e) => {
    e.preventDefault();
    const text = chatDraft.trim();
    if (!text) return;
    setExtraMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        role: 'customer',
        body: text,
        at: new Date().toISOString(),
        readByCustomer: true,
      },
    ]);
    setChatDraft('');
  };

  const mockPreview = (name) => {
    window.alert(`Preview (demo): ${name}\nNo file is stored in this prototype.`);
  };

  const visitSummary =
    ticket.scheduledVisitStart &&
    `${formatDateTime(ticket.scheduledVisitStart)}${ticket.scheduledVisitEnd ? ` – ${formatDateTime(ticket.scheduledVisitEnd)}` : ''}`;

  return (
    <div className="service-detail-pane" role="region" aria-labelledby="service-detail-title">
      <div className="service-detail-pane-top">
        <div className="service-detail-pane-toolbar">
          <button type="button" className="service-detail-back" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            All tickets
          </button>
          <button type="button" className="service-detail-clear-desktop" onClick={onClose} aria-label="Clear selection and return to list">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="service-detail-sticky-meta">
          <p className="service-detail-kicker">Service ticket</p>
          <h2
            ref={titleRef}
            tabIndex={-1}
            id="service-detail-title"
            className="service-detail-title"
          >
            {ticket.id}
          </h2>
          <p className="service-detail-subject-line">{ticket.subject}</p>
          <div className="service-detail-meta-row">
            <span className={`service-status-pill service-status-pill--${ticket.status}`}>{ticket.statusLabel}</span>
            <span className="service-detail-meta-muted">Updated {formatDateTime(ticket.updatedAt)}</span>
            {visitSummary && <span className="service-detail-meta-muted">Visit {visitSummary}</span>}
          </div>
        </div>
      </div>

      <div className="service-detail-pane-body">
        <div className="service-detail-doc">
          {ticket.activityCue && (
            <div className="service-detail-cue service-detail-cue--doc" role="status">
              <span className="service-detail-cue-dot" aria-hidden />
              {ticket.activityCue}
            </div>
          )}

          <div className="service-detail-doc-row">
            <section className="service-detail-doc-section" aria-labelledby="svc-overview-h">
              <h3 id="svc-overview-h" className="service-detail-doc-heading">
                Summary
              </h3>
              <dl className="service-detail-dl">
                <div>
                  <dt>Status</dt>
                  <dd>
                    <span className={`service-status-pill service-status-pill--${ticket.status}`}>{ticket.statusLabel}</span>
                  </dd>
                </div>
                <div>
                  <dt>Created</dt>
                  <dd>{formatDate(ticket.createdAt)}</dd>
                </div>
                <div>
                  <dt>Last updated</dt>
                  <dd>{formatDateTime(ticket.updatedAt)}</dd>
                </div>
                <div>
                  <dt>Requested by</dt>
                  <dd>{ticket.requestedBy}</dd>
                </div>
                {ticket.poNumber && (
                  <div>
                    <dt>PO number</dt>
                    <dd>{ticket.poNumber}</dd>
                  </div>
                )}
                <div>
                  <dt>Preferred availability</dt>
                  <dd>{ticket.preferredAvailability || '—'}</dd>
                </div>
                <div>
                  <dt>Contract status</dt>
                  <dd>{contractTicketLabels[ticket.contractStatusOnTicket] || ticket.contractStatusOnTicket}</dd>
                </div>
                <div>
                  <dt>Payment authorization</dt>
                  <dd>
                    {ticket.paymentAuthorizationRequired
                      ? ticket.paymentMethodSummary
                        ? `Required — ${ticket.paymentMethodSummary}`
                        : 'Required — method on file with your service provider'
                      : 'Not required for this request'}
                  </dd>
                </div>
              </dl>
              {unreadInThread && (
                <p className="service-detail-unread-banner">You have unread messages from your service team in this ticket.</p>
              )}
            </section>

            <section className="service-detail-doc-section service-detail-doc-section--timeline" aria-labelledby="svc-timeline-h">
              <h3 id="svc-timeline-h" className="service-detail-doc-heading">
                Timeline
              </h3>
              <ol className="service-timeline service-timeline--split">
                {ticket.timeline.map((step, i) => (
                  <li key={`${step.type}-${step.at}-${i}`} className="service-timeline-item">
                    <div className="service-timeline-icon" aria-hidden>
                      {timelineIcon(step.type)}
                    </div>
                    <div className="service-timeline-body">
                      <div className="service-timeline-label">{step.label}</div>
                      <div className="service-timeline-time">{formatDateTime(step.at)}</div>
                      {step.detail && <div className="service-timeline-detail">{step.detail}</div>}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {equipment && (
            <section className="service-detail-doc-section" aria-labelledby="svc-equip-h">
              <div className="service-detail-doc-section-head">
                <h3 id="svc-equip-h" className="service-detail-doc-heading">
                  Equipment
                </h3>
                <label className="service-detail-toggle">
                  <input type="checkbox" checked={showExtraEquipment} onChange={(e) => setShowExtraEquipment(e.target.checked)} />
                  <span>Network &amp; supplies</span>
                </label>
              </div>
              <p className="service-detail-hint service-detail-hint--compact">
                Context your service team and technician see for this machine.
              </p>
              <EquipmentDeviceThumb device={equipment} className="service-detail-equip-thumb" />
              <dl className="service-detail-dl">
                <div>
                  <dt>Equipment</dt>
                  <dd>{equipment.displayName}</dd>
                </div>
                <div>
                  <dt>Equipment number</dt>
                  <dd>{equipment.equipmentNo}</dd>
                </div>
                <div>
                  <dt>Serial number</dt>
                  <dd>{equipment.serialNumber}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{equipment.label}</dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>{equipment.address}</dd>
                </div>
                <div>
                  <dt>Install date</dt>
                  <dd>{formatDate(equipment.installDate)}</dd>
                </div>
                <div>
                  <dt>Warranty</dt>
                  <dd>{equipment.warrantyDate ? formatDate(equipment.warrantyDate) : '—'}</dd>
                </div>
                <div>
                  <dt>Contract (current)</dt>
                  <dd>{covered ? 'Covered' : 'Not under maintenance contract'}</dd>
                </div>
              </dl>
              {showExtraEquipment && (
                <>
                  <dl className="service-detail-dl service-detail-dl-tight">
                    <div>
                      <dt>IP address</dt>
                      <dd>{equipment.ipAddress || '—'}</dd>
                    </div>
                    <div>
                      <dt>MAC address</dt>
                      <dd>{equipment.macAddress || '—'}</dd>
                    </div>
                    <div>
                      <dt>Last reported</dt>
                      <dd>{equipment.lastReportedDate ? formatDate(equipment.lastReportedDate) : '—'}</dd>
                    </div>
                  </dl>
                  {equipment.isColor && (
                    <div className="service-detail-toner-block">
                      <h4 className="service-detail-subheading">Toner / ink levels</h4>
                      <TonerBar label="Black" value={equipment.tonerLevels?.black} tone="black" />
                      <TonerBar label="Cyan" value={equipment.tonerLevels?.cyan} tone="cyan" />
                      <TonerBar label="Magenta" value={equipment.tonerLevels?.magenta} tone="magenta" />
                      <TonerBar label="Yellow" value={equipment.tonerLevels?.yellow} tone="yellow" />
                    </div>
                  )}
                  {!equipment.isColor && equipment.tonerLevels?.black != null && (
                    <div className="service-detail-toner-block">
                      <h4 className="service-detail-subheading">Toner level</h4>
                      <TonerBar label="Black" value={equipment.tonerLevels.black} tone="black" />
                    </div>
                  )}
                </>
              )}
              {ticket.priorRelatedTickets?.length > 0 && (
                <div className="service-detail-prior">
                  <h4 className="service-detail-subheading">Recent service on this equipment</h4>
                  <ul className="service-detail-prior-list">
                    {ticket.priorRelatedTickets.map((p) => (
                      <li key={p.id}>
                        <span className="service-detail-prior-id">{p.id}</span>
                        <span className="service-detail-prior-meta">
                          {formatDate(p.date)} — {p.summary}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Link to={`/equipment`} className="service-detail-link-equip">
                View equipment in fleet list
              </Link>
            </section>
          )}

          <section className="service-detail-doc-section" aria-labelledby="svc-attach-h">
            <h3 id="svc-attach-h" className="service-detail-doc-heading">
              Files
            </h3>
            {ticket.attachments?.length ? (
              <ul className="service-attach-list">
                {ticket.attachments.map((f) => (
                  <li key={f.id} className="service-attach-row">
                    <span className="service-attach-name">{f.name}</span>
                    <span className="service-attach-meta">
                      {f.kind === 'image' ? 'Image' : 'PDF'} · {f.size}
                    </span>
                    <div className="service-attach-actions">
                      <button type="button" className="service-btn service-btn-ghost" onClick={() => mockPreview(f.name)}>
                        Preview
                      </button>
                      <button type="button" className="service-btn service-btn-ghost" onClick={() => mockPreview(f.name)}>
                        Download
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="service-detail-muted">No attachments on this ticket.</p>
            )}
            <p className="service-detail-hint service-detail-hint--compact">
              Photos of error codes or jams help technicians prepare.
            </p>
          </section>

          <section className="service-detail-doc-section service-detail-doc-section--messages" aria-labelledby="svc-chat-h">
            <h3 id="svc-chat-h" className="service-detail-doc-heading">
              Messages
            </h3>
            <p className="service-detail-hint service-detail-hint--compact">
              Reply here so updates stay in one thread with your service team.
            </p>
            <div className="service-chat-thread service-chat-thread--doc">
              {allMessages.length === 0 && <p className="service-detail-muted">No messages yet.</p>}
              {allMessages.map((m) => (
                <div key={m.id} className={`service-chat-bubble service-chat-bubble--${m.role}`}>
                  <div className="service-chat-meta">
                    {m.role === 'dealer' ? 'Service team' : 'You'}
                    <span className="service-chat-time">{formatDateTime(m.at)}</span>
                  </div>
                  <p className="service-chat-body">{m.body}</p>
                  {m.attachments?.length > 0 && (
                    <div className="service-chat-files">
                      {m.attachments.map((a) => (
                        <button key={a.id} type="button" className="service-chat-file-chip" onClick={() => mockPreview(a.name)}>
                          {a.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <form className="service-chat-form" onSubmit={sendChat}>
              <label className="service-sr-only" htmlFor="service-chat-input">
                Message service team
              </label>
              <textarea
                id="service-chat-input"
                className="service-chat-input"
                rows={2}
                placeholder="Write a reply…"
                value={chatDraft}
                onChange={(e) => setChatDraft(e.target.value)}
              />
              <button type="submit" className="service-btn service-btn-primary service-chat-send" disabled={!chatDraft.trim()}>
                Send
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
