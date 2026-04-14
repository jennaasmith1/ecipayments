import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import EquipmentDeviceThumb from './EquipmentDeviceThumb';

function equipmentSearchHaystack(eq) {
  return [
    eq.displayName,
    eq.equipmentNo,
    eq.serialNumber,
    eq.label,
    eq.siteName,
    eq.manufacturer,
    eq.model,
    eq.modelFamily,
    eq.nickname,
    eq.department,
    eq.floorRoom,
    eq.hostname,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

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

export function ServiceEquipmentPreviewModal({ equipment, open, onClose }) {
  const { formatDate } = usePortalProfile();
  const equipmentListPath = usePortalPath('/equipment');
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

  if (!equipment) return null;

  return (
    <>
      <div
        className={`service-equip-preview-backdrop ${open ? 'is-open' : ''}`}
        aria-hidden={!open}
        onClick={onClose}
      />
      <div
        className={`service-equip-preview-dialog ${open ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="service-equip-preview-title"
        hidden={!open}
      >
        <div className="service-equip-preview-header">
          <div>
            <p className="service-equip-preview-kicker">{equipment.equipmentNo}</p>
            <h2 id="service-equip-preview-title" className="service-equip-preview-title">
              {equipment.displayName}
            </h2>
            {equipment.nickname && <p className="service-equip-preview-nick">{equipment.nickname}</p>}
          </div>
          <button ref={closeBtnRef} type="button" className="service-equip-preview-close" onClick={onClose} aria-label="Close preview">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="service-equip-preview-body">
          <EquipmentDeviceThumb device={equipment} className="service-equip-preview-thumb" />

          <dl className="service-equip-preview-dl">
            <div>
              <dt>Serial number</dt>
              <dd>{equipment.serialNumber}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{equipment.label}</dd>
            </div>
            <div>
              <dt>Site</dt>
              <dd>{equipment.siteName}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd>{equipment.address}</dd>
            </div>
            <div>
              <dt>Department</dt>
              <dd>{equipment.department || '—'}</dd>
            </div>
            <div>
              <dt>Primary contact</dt>
              <dd>{equipment.primaryContact || '—'}</dd>
            </div>
            <div>
              <dt>Contract</dt>
              <dd>{contractLabels[equipment.contractStatus] || equipment.contractStatus}</dd>
            </div>
            <div>
              <dt>Reporting</dt>
              <dd>{reportingLabels[equipment.reportingStatus] || equipment.reportingStatus}</dd>
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
              <dt>Last service</dt>
              <dd>{equipment.lastServiceDate ? formatDate(equipment.lastServiceDate) : '—'}</dd>
            </div>
            <div>
              <dt>Hostname / IP</dt>
              <dd>
                {equipment.hostname || '—'}
                {equipment.ipAddress ? ` · ${equipment.ipAddress}` : ''}
              </dd>
            </div>
          </dl>

          {equipment.openService && (
            <p className="service-equip-preview-open-svc">
              <strong>Open service:</strong> {equipment.openService.id} — {equipment.openService.summary}
            </p>
          )}

          <div className="service-equip-preview-actions">
            <Link to={equipmentListPath} className="service-btn service-btn-primary" onClick={onClose}>
              View equipment list
            </Link>
            <button type="button" className="service-btn" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function ServiceEquipmentPicker({ fleet, selectedId, onSelect }) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapRef = useRef(null);
  const searchRef = useRef(null);
  const listboxId = useId();

  const selected = useMemo(() => fleet.find((e) => e.id === selectedId) ?? null, [fleet, selectedId]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return fleet;
    return fleet.filter((eq) => equipmentSearchHaystack(eq).includes(q));
  }, [fleet, query]);

  useEffect(() => {
    if (!panelOpen) return;
    const id = window.requestAnimationFrame(() => searchRef.current?.focus());
    return () => window.cancelAnimationFrame(id);
  }, [panelOpen]);

  useEffect(() => {
    if (!panelOpen) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setPanelOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [panelOpen]);

  const selectOne = (id) => {
    onSelect(id);
    setPanelOpen(false);
    setQuery('');
  };

  const togglePanel = () => {
    setPanelOpen((o) => {
      const next = !o;
      if (!next) setQuery('');
      return next;
    });
  };

  return (
    <div className="service-field service-field-span-2 service-equip-picker-wrap" ref={wrapRef}>
      <span className="service-field-label" id={`${listboxId}-label`}>
        Equipment
      </span>
      <p className="service-field-hint service-equip-picker-hint">
        Search by model name, equipment number, serial number, or location, then select a row. Use preview to confirm details before you
        submit.
      </p>
      <div className="service-equip-picker-row">
        <button
          type="button"
          className="service-equip-picker-trigger service-input"
          aria-expanded={panelOpen}
          aria-haspopup="listbox"
          aria-controls={panelOpen ? listboxId : undefined}
          aria-labelledby={`${listboxId}-label`}
          onClick={togglePanel}
        >
          <span className="service-equip-picker-trigger-text">
            {selected ? (
              <>
                <span className="service-equip-picker-trigger-main">{selected.displayName}</span>
                <span className="service-equip-picker-trigger-meta">
                  {selected.equipmentNo} · {selected.label}
                </span>
              </>
            ) : (
              <span className="service-equip-picker-placeholder">Select equipment…</span>
            )}
          </span>
          <svg className={`service-equip-picker-chevron ${panelOpen ? 'is-open' : ''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M6 9l6 6 6-6" strokeLinecap="round" />
          </svg>
        </button>
        <button
          type="button"
          className="service-btn service-btn-ghost service-equip-preview-open-btn"
          onClick={() => setPreviewOpen(true)}
          disabled={!selected}
        >
          Preview equipment
        </button>
      </div>

      {panelOpen && (
        <div className="service-equip-picker-panel" role="presentation">
          <input
            ref={searchRef}
            type="search"
            className="service-input service-equip-picker-search"
            placeholder="Search equipment…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Filter equipment list"
            autoComplete="off"
          />
          <ul id={listboxId} className="service-equip-picker-list" role="listbox" aria-label="Equipment matches">
            {filtered.length === 0 ? (
              <li className="service-equip-picker-empty" role="presentation">
                No equipment matches your search.
              </li>
            ) : (
              filtered.map((eq) => (
                <li key={eq.id} role="presentation" className="service-equip-picker-li">
                  <button
                    type="button"
                    role="option"
                    aria-selected={eq.id === selectedId}
                    className={`service-equip-picker-option ${eq.id === selectedId ? 'is-selected' : ''}`}
                    onClick={() => selectOne(eq.id)}
                  >
                    <span className="service-equip-picker-opt-name">{eq.displayName}</span>
                    <span className="service-equip-picker-opt-meta">
                      {eq.equipmentNo} · {eq.serialNumber} · {eq.label}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}

      <ServiceEquipmentPreviewModal equipment={selected} open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  );
}
