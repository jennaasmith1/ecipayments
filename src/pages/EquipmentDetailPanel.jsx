import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import EquipmentDeviceThumb from '../components/EquipmentDeviceThumb';

const contractLabels = {
  active: 'Active contract',
  expiring: 'Contract expiring soon',
  month_to_month: 'Month-to-month',
  none: 'No maintenance contract',
};

const reportingLabels = {
  online: 'Online',
  offline: 'Offline / not reporting',
};

function TonerBar({ label, value, tone }) {
  if (value == null) return null;
  const low = value <= 25;
  return (
    <div className="equipment-detail-toner-row">
      <span className="equipment-detail-toner-label">{label}</span>
      <div className="equipment-detail-toner-track" role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100}>
        <div
          className={`equipment-detail-toner-fill equipment-detail-toner-fill--${tone} ${low ? 'equipment-detail-toner-fill--low' : ''}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`equipment-detail-toner-pct ${low ? 'equipment-detail-toner-pct--low' : ''}`}>{value}%</span>
    </div>
  );
}

function SectionTitle({ id, children }) {
  return (
    <h3 className="equipment-detail-section-title" id={id}>
      {children}
    </h3>
  );
}

export default function EquipmentDetailPanel({ device, open, onClose, formatDate }) {
  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!device) return null;

  const overviewOnline = device.reportingStatus === 'online';
  const overviewStatus = overviewOnline ? 'Online' : 'Offline';

  const supplyHistoryFromActivity = device.activityTimeline
    .filter((a) => a.type === 'supplies')
    .slice(0, 4);

  const scrollTo = (id) => {
    panelRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div
        className={`equipment-drawer-backdrop ${open ? 'equipment-drawer-backdrop--open' : ''}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <aside
        ref={panelRef}
        className={`equipment-drawer ${open ? 'equipment-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="equipment-drawer-title"
        hidden={!open}
      >
        <div className="equipment-drawer-header">
          <div>
            <p className="equipment-drawer-kicker">{device.equipmentNo}</p>
            <h2 id="equipment-drawer-title" className="equipment-drawer-title">
              {device.displayName}
            </h2>
            {device.nickname && <p className="equipment-drawer-nickname">{device.nickname}</p>}
          </div>
          <button ref={closeBtnRef} type="button" className="equipment-drawer-close" onClick={onClose} aria-label="Close details">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="equipment-drawer-body">
          <EquipmentDeviceThumb device={device} className="equipment-detail-hero-thumb" />

          <div className="equipment-detail-actions equipment-detail-actions--primary">
            <Link to="/equipment#meter" className="equipment-detail-action-btn equipment-detail-action-btn--solid">
              Submit meter read
            </Link>
            <Link
              to={`/service?create=1&equipment=${encodeURIComponent(device.id)}`}
              className="equipment-detail-action-btn equipment-detail-action-btn--solid"
            >
              Request service
            </Link>
            <Link to="/supplies" className="equipment-detail-action-btn equipment-detail-action-btn--solid">
              Order supplies
            </Link>
          </div>
          <div className="equipment-detail-actions equipment-detail-actions--secondary">
            <button type="button" className="equipment-detail-action-link" onClick={() => scrollTo('equipment-detail-service')}>
              View service history
            </button>
            <button type="button" className="equipment-detail-action-link" onClick={() => scrollTo('equipment-detail-supply-history')}>
              View supply history
            </button>
          </div>

          <section className="equipment-detail-section" aria-labelledby="eq-sec-overview">
            <SectionTitle id="eq-sec-overview">Overview</SectionTitle>
            <dl className="equipment-detail-dl">
              <div>
                <dt>Manufacturer</dt>
                <dd>{device.manufacturer}</dd>
              </div>
              <div>
                <dt>Model</dt>
                <dd>{device.model}</dd>
              </div>
              <div>
                <dt>Equipment No.</dt>
                <dd>
                  <code className="equipment-serial">{device.equipmentNo}</code>
                </dd>
              </div>
              <div>
                <dt>Serial number</dt>
                <dd>
                  <code className="equipment-serial">{device.serialNumber}</code>
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <span
                    className={`equipment-connectivity equipment-connectivity--${overviewOnline ? 'online' : 'offline'}`}
                  >
                    <span className="equipment-connectivity-dot" aria-hidden />
                    {overviewStatus}
                  </span>
                </dd>
              </div>
              <div>
                <dt>Contract status</dt>
                <dd>{contractLabels[device.contractStatus] || device.contractStatus}</dd>
              </div>
              <div>
                <dt>Ownership</dt>
                <dd style={{ textTransform: 'capitalize' }}>{device.ownership}</dd>
              </div>
            </dl>
          </section>

          <section className="equipment-detail-section" aria-labelledby="eq-sec-location">
            <SectionTitle id="eq-sec-location">Location</SectionTitle>
            <dl className="equipment-detail-dl">
              <div>
                <dt>Site / office</dt>
                <dd>{device.siteName}</dd>
              </div>
              <div>
                <dt>Floor / room / area</dt>
                <dd>{device.floorRoom}</dd>
              </div>
              <div>
                <dt>Area label</dt>
                <dd>{device.label}</dd>
              </div>
              <div className="equipment-detail-dl-wide">
                <dt>Address</dt>
                <dd>{device.address}</dd>
              </div>
              <div>
                <dt>Department</dt>
                <dd>{device.department}</dd>
              </div>
              <div>
                <dt>Primary contact</dt>
                <dd>{device.primaryContact}</dd>
              </div>
            </dl>
          </section>

          <section className="equipment-detail-section" aria-labelledby="eq-sec-network">
            <SectionTitle id="eq-sec-network">Network &amp; reporting</SectionTitle>
            <dl className="equipment-detail-dl">
              <div>
                <dt>IP address</dt>
                <dd>
                  <code className="equipment-serial">{device.ipAddress}</code>
                </dd>
              </div>
              <div>
                <dt>MAC address</dt>
                <dd>
                  <code className="equipment-serial">{device.macAddress}</code>
                </dd>
              </div>
              <div>
                <dt>Hostname</dt>
                <dd>
                  <code className="equipment-serial">{device.hostname}</code>
                </dd>
              </div>
              <div>
                <dt>Last reported</dt>
                <dd>{formatDate(device.lastReportedDate)}</dd>
              </div>
              <div>
                <dt>Reporting status</dt>
                <dd>{reportingLabels[device.reportingStatus] ?? reportingLabels.online}</dd>
              </div>
            </dl>
          </section>

          <section className="equipment-detail-section" aria-labelledby="eq-sec-supplies">
            <SectionTitle id="eq-sec-supplies">Supplies &amp; meters</SectionTitle>
            <p className="equipment-detail-muted">Toner levels for this machine</p>
            <div className="equipment-detail-toner-block">
              <TonerBar label="Black" value={device.tonerLevels.black} tone="black" />
              <TonerBar label="Cyan" value={device.tonerLevels.cyan} tone="cyan" />
              <TonerBar label="Magenta" value={device.tonerLevels.magenta} tone="magenta" />
              <TonerBar label="Yellow" value={device.tonerLevels.yellow} tone="yellow" />
            </div>
            <dl className="equipment-detail-dl equipment-detail-dl-tight">
              <div>
                <dt>Last meter read</dt>
                <dd>
                  {device.lastMeterValue.toLocaleString()} <span className="equipment-detail-muted">({device.meterType})</span>
                </dd>
              </div>
              <div>
                <dt>Last meter read date</dt>
                <dd>{formatDate(device.lastMeterRead)}</dd>
              </div>
              <div>
                <dt>Meter due</dt>
                <dd>
                  {device.meterDue ? (
                    <span className="equipment-chip equipment-chip--alert">Reading due</span>
                  ) : (
                    <span className="equipment-chip equipment-chip--ok">Up to date</span>
                  )}
                </dd>
              </div>
            </dl>
            <p className="equipment-detail-subhead">Compatible supplies</p>
            <ul className="equipment-detail-supply-list">
              {device.compatibleSupplies.map((s) => (
                <li key={s.sku}>
                  <span>{s.name}</span>
                  <code className="equipment-serial">{s.sku}</code>
                </li>
              ))}
            </ul>
            <h4 className="equipment-detail-subhead equipment-detail-subhead--section" id="equipment-detail-supply-history">
              Supply history
            </h4>
            {supplyHistoryFromActivity.length > 0 ? (
              <ul className="equipment-detail-mini-history">
                {supplyHistoryFromActivity.map((a, i) => (
                  <li key={i}>
                    <span>{a.label}</span>
                    <time dateTime={a.date}>{formatDate(a.date.slice(0, 10))}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="equipment-detail-muted">No recent supply orders recorded for this device in the portal.</p>
            )}
          </section>

          <section className="equipment-detail-section" aria-labelledby="eq-sec-dates">
            <SectionTitle id="eq-sec-dates">Dates &amp; lifecycle</SectionTitle>
            <dl className="equipment-detail-dl">
              <div>
                <dt>Install date</dt>
                <dd>{formatDate(device.installDate)}</dd>
              </div>
              <div>
                <dt>Warranty through</dt>
                <dd>{device.warrantyDate ? formatDate(device.warrantyDate) : '—'}</dd>
              </div>
              <div>
                <dt>Last service</dt>
                <dd>{device.lastServiceDate ? formatDate(device.lastServiceDate) : '—'}</dd>
              </div>
              <div>
                <dt>Next recommended maintenance</dt>
                <dd>{device.nextMaintenanceDate ? formatDate(device.nextMaintenanceDate) : '—'}</dd>
              </div>
            </dl>
          </section>

          <section className="equipment-detail-section" id="equipment-detail-service" aria-labelledby="eq-sec-service">
            <SectionTitle id="eq-sec-service">Service &amp; activity</SectionTitle>
            {device.openService ? (
              <div className="equipment-detail-open-service">
                <p className="equipment-detail-subhead">Open service</p>
                <p>
                  <strong>{device.openService.id}</strong> — {device.openService.summary}
                </p>
                <Link to="/service" className="equipment-detail-inline-link">
                  View ticket
                </Link>
              </div>
            ) : (
              <p className="equipment-detail-muted">No open service tickets for this device.</p>
            )}
            <p className="equipment-detail-subhead">Recent service history</p>
            {device.serviceHistory.length > 0 ? (
              <ul className="equipment-detail-mini-history">
                {device.serviceHistory.map((h, i) => (
                  <li key={i}>
                    <span>{h.summary}</span>
                    <time dateTime={h.date}>{formatDate(h.date)}</time>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="equipment-detail-muted">No completed visits on file in the last 12 months.</p>
            )}
            <p className="equipment-detail-subhead">Recent activity</p>
            <ul className="equipment-detail-timeline">
              {[...device.activityTimeline]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((a, i) => (
                  <li key={i} className={`equipment-detail-timeline-item equipment-detail-timeline-item--${a.type}`}>
                    <span className="equipment-detail-timeline-dot" aria-hidden />
                    <div>
                      <p className="equipment-detail-timeline-label">{a.label}</p>
                      <time dateTime={a.date}>
                        {new Date(a.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </time>
                    </div>
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}
