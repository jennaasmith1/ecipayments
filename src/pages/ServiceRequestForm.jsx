import { useEffect, useMemo, useState } from 'react';
import { customer } from '../data/fakeData';
import { fleetEquipment } from '../data/equipmentFleetData';
import { useServiceTickets } from '../context/ServiceTicketsContext';
import ServiceEquipmentPicker from '../components/ServiceEquipmentPicker';
import { buildSubmittedTicket, nextTicketId, paymentScenario } from './serviceFormShared';

/**
 * Create-ticket form for use in the Service split detail pane (or standalone page chrome elsewhere).
 * When `draftTicket` is set, submitting replaces that draft with a real ticket (same id).
 */
export default function ServiceRequestForm({ draftTicket, equipmentQuery, onSuccess, onCancel }) {
  const { tickets, setTickets } = useServiceTickets();
  const fleetById = useMemo(() => Object.fromEntries(fleetEquipment.map((e) => [e.id, e])), []);

  const [createEquipmentId, setCreateEquipmentId] = useState(() => {
    if (draftTicket?.equipmentId && fleetById[draftTicket.equipmentId]) {
      return draftTicket.equipmentId;
    }
    const q = equipmentQuery;
    return q && fleetById[q] ? q : fleetEquipment[0]?.id ?? '';
  });
  const [createSubject, setCreateSubject] = useState(() => {
    if (draftTicket?.subject && draftTicket.subject !== 'New service request') {
      return draftTicket.subject;
    }
    return '';
  });
  const [createDescription, setCreateDescription] = useState('');
  const [createPo, setCreatePo] = useState('');
  const [createAvailability, setCreateAvailability] = useState('');
  const [createContact, setCreateContact] = useState(customer.name);
  const [createPhone, setCreatePhone] = useState(customer.phone);
  const [machineDown, setMachineDown] = useState(false);
  const [remoteOk, setRemoteOk] = useState(true);
  const [createFiles, setCreateFiles] = useState([]);
  const [mockCardNumber, setMockCardNumber] = useState('');
  const [mockCardName, setMockCardName] = useState('');
  const [mockCardExp, setMockCardExp] = useState('');
  const [mockCardSaved, setMockCardSaved] = useState(false);

  useEffect(() => {
    if (draftTicket?.equipmentId && fleetById[draftTicket.equipmentId]) {
      setCreateEquipmentId(draftTicket.equipmentId);
      setMockCardSaved(false);
      return;
    }
    const q = equipmentQuery;
    if (q && fleetById[q]) {
      setCreateEquipmentId(q);
      setMockCardSaved(false);
    }
  }, [draftTicket?.equipmentId, equipmentQuery, fleetById]);

  const createEquipment = fleetById[createEquipmentId];
  const payCase = createEquipment ? paymentScenario(createEquipment) : 'covered';

  const resetCreateForm = () => {
    setCreateSubject('');
    setCreateDescription('');
    setCreatePo('');
    setCreateAvailability('');
    setCreateContact(customer.name);
    setCreatePhone(customer.phone);
    setMachineDown(false);
    setRemoteOk(true);
    setCreateFiles([]);
    setMockCardNumber('');
    setMockCardName('');
    setMockCardExp('');
    setMockCardSaved(false);
  };

  const onPickFiles = (e) => {
    const files = e.target.files;
    if (!files?.length) return;
    setCreateFiles((prev) => [
      ...prev,
      ...[...files].map((f) => ({
        name: f.name,
        size: f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(f.size / 1024)} KB`,
      })),
    ]);
    e.target.value = '';
  };

  const removeFile = (index) => {
    setCreateFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const saveMockCard = () => {
    if (mockCardNumber.replace(/\D/g, '').length < 15 || !mockCardName.trim() || !mockCardExp.trim()) return;
    setMockCardSaved(true);
  };

  const saveDraftProgress = () => {
    if (!draftTicket) return;
    const subj = createSubject.trim() || 'New service request';
    const desc = createDescription.trim();
    const summary =
      desc.length > 140 ? `${desc.slice(0, 137)}…` : desc || 'Blank draft — add details and submit when ready.';
    setTickets((prev) =>
      prev.map((t) =>
        t.id === draftTicket.id
          ? { ...t, subject: subj, summary, updatedAt: new Date().toISOString() }
          : t,
      ),
    );
  };

  const submitCreate = (e) => {
    e.preventDefault();
    if (!createEquipment) return;
    if (!createSubject.trim() || !createDescription.trim() || !createContact.trim() || !createPhone.trim()) return;
    if (payCase === 'pay_add_card' && !mockCardSaved) return;

    let paymentSummary = null;
    if (payCase === 'pay_saved') paymentSummary = 'Visa ending in 4242';
    if (payCase === 'pay_add_card') paymentSummary = 'Visa ending in 4242 (demo)';

    const nextId = draftTicket ? draftTicket.id : nextTicketId(tickets);
    const ticket = buildSubmittedTicket(
      {
        nextId,
        subject: createSubject,
        description: createDescription + (machineDown ? ' [Equipment reported fully down.]' : ''),
        po: createPo,
        availability: createAvailability,
        contactName: createContact,
        files: createFiles,
        machineDown,
        remoteOk,
      },
      createEquipment,
      paymentSummary
    );

    if (draftTicket) {
      setTickets((prev) => prev.map((t) => (t.id === draftTicket.id ? ticket : t)));
    } else {
      setTickets((prev) => [ticket, ...prev]);
    }
    resetCreateForm();
    onSuccess(ticket);
  };

  return (
    <div className="service-detail-create" role="region" aria-labelledby="service-inline-create-title">
      <div className="service-detail-create-toolbar">
        <h2 id="service-inline-create-title" className="service-detail-create-title">
          Request service
        </h2>
        <div className="service-detail-create-toolbar-actions">
          {draftTicket && (
            <button type="button" className="service-btn service-btn-ghost" onClick={saveDraftProgress}>
              Save draft
            </button>
          )}
          <button type="button" className="service-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
      <div className="service-detail-create-body">
        <p className="service-detail-create-lead">
          {draftTicket
            ? 'This request is saved as a draft in your list until you submit it. You can save your progress anytime, then submit when you’re ready.'
            : 'Describe what’s happening with the equipment. You can upload photos of error codes or the issue — it helps our technician prepare.'}
        </p>
        <section className="service-create-panel service-create-panel-inline" aria-labelledby="service-create-title">
          <h3 id="service-create-title" className="service-sr-only">
            New service request form
          </h3>

          <form className="service-create-form" onSubmit={submitCreate}>
            <div className="service-form-grid">
              <ServiceEquipmentPicker
                fleet={fleetEquipment}
                selectedId={createEquipmentId}
                onSelect={(id) => {
                  setCreateEquipmentId(id);
                  setMockCardSaved(false);
                }}
              />

              <div className="service-field-span-2 service-coverage-stack">
                {payCase === 'covered' && (
                  <div className="service-callout service-callout-positive">
                    <strong>Coverage</strong>
                    <p>This equipment appears to be covered under contract for standard service. Final charges still depend on what we find on site.</p>
                  </div>
                )}

                {payCase !== 'covered' && (
                  <div className="service-callout service-callout-warning">
                    <strong>Payment authorization may be required</strong>
                    <p>
                      For non-contract equipment, payment authorization may be required before we dispatch or begin billable work. This
                      authorizes potential billable service — final charges depend on the service performed and are not necessarily the amount
                      authorized today.
                    </p>
                  </div>
                )}

                {payCase === 'pay_saved' && (
                  <div className="service-payment-card">
                    <h3 className="service-payment-title">Payment method</h3>
                    <p className="service-payment-line">
                      Using <strong>Visa ending in 4242</strong> for service authorization.
                    </p>
                    <button
                      type="button"
                      className="service-btn service-btn-ghost"
                      onClick={() => window.alert('Demo: would open saved payment methods or add a new card.')}
                    >
                      Change payment method
                    </button>
                  </div>
                )}

                {payCase === 'pay_add_card' && (
                  <div className="service-payment-card service-payment-card-required">
                    <h3 className="service-payment-title">Card required for this equipment</h3>
                    <p className="service-field-hint">
                      Enter test data only — nothing is processed. This simulates authorization for potential billable service.
                    </p>
                    {!mockCardSaved ? (
                      <div className="service-mock-card-form">
                        <label className="service-field">
                          <span className="service-field-label">Name on card</span>
                          <input
                            className="service-input"
                            value={mockCardName}
                            onChange={(e) => setMockCardName(e.target.value)}
                            placeholder="Jordan Lee"
                          />
                        </label>
                        <label className="service-field">
                          <span className="service-field-label">Card number</span>
                          <input
                            className="service-input"
                            inputMode="numeric"
                            autoComplete="off"
                            value={mockCardNumber}
                            onChange={(e) => setMockCardNumber(e.target.value)}
                            placeholder="4242 4242 4242 4242"
                          />
                        </label>
                        <label className="service-field">
                          <span className="service-field-label">Expiry (MM/YY)</span>
                          <input
                            className="service-input"
                            value={mockCardExp}
                            onChange={(e) => setMockCardExp(e.target.value)}
                            placeholder="12/28"
                          />
                        </label>
                        <button type="button" className="service-btn service-btn-primary" onClick={saveMockCard}>
                          Save card (demo)
                        </button>
                      </div>
                    ) : (
                      <p className="service-payment-line">
                        <strong>Card on file for this request (demo).</strong> You can submit the ticket.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <label className="service-field service-field-span-2">
                <span className="service-field-label">Subject</span>
                <input
                  className="service-input"
                  value={createSubject}
                  onChange={(e) => setCreateSubject(e.target.value)}
                  placeholder="Short title, e.g. Paper jam in tray 2"
                  required
                />
              </label>

              <label className="service-field service-field-span-2">
                <span className="service-field-label">Problem description</span>
                <textarea
                  className="service-input service-textarea"
                  rows={4}
                  value={createDescription}
                  onChange={(e) => setCreateDescription(e.target.value)}
                  placeholder="Describe what’s happening with the equipment, when it started, and any error codes on the display."
                  required
                />
              </label>

              <label className="service-field">
                <span className="service-field-label">PO number (optional)</span>
                <input
                  className="service-input"
                  value={createPo}
                  onChange={(e) => setCreatePo(e.target.value)}
                  placeholder="Your internal PO or cost center"
                />
              </label>

              <label className="service-field">
                <span className="service-field-label">Preferred availability / access</span>
                <input
                  className="service-input"
                  value={createAvailability}
                  onChange={(e) => setCreateAvailability(e.target.value)}
                  placeholder="e.g. Weekdays after 2 PM; loading dock code 4521"
                />
              </label>
              <p className="service-field-hint service-field-span-2">
                Preferred availability helps us plan a technician visit if one is needed — free text is fine for now.
              </p>

              <label className="service-field">
                <span className="service-field-label">Contact person</span>
                <input className="service-input" value={createContact} onChange={(e) => setCreateContact(e.target.value)} required />
              </label>

              <label className="service-field">
                <span className="service-field-label">Phone for visit</span>
                <input className="service-input" type="tel" value={createPhone} onChange={(e) => setCreatePhone(e.target.value)} required />
              </label>

              <div className="service-field service-field-span-2 service-check-row">
                <label className="service-check">
                  <input type="checkbox" checked={machineDown} onChange={(e) => setMachineDown(e.target.checked)} />
                  <span>Equipment is completely down (cannot print or copy at all)</span>
                </label>
                <label className="service-check">
                  <input type="checkbox" checked={remoteOk} onChange={(e) => setRemoteOk(e.target.checked)} />
                  <span>Remote troubleshooting is okay to try first</span>
                </label>
              </div>
            </div>

            <div className="service-upload-block">
              <span className="service-field-label">Attachments (optional)</span>
              <p className="service-field-hint">You can upload photos of error codes or the issue. In production these would go to your service team.</p>
              <label className="service-upload-zone">
                <input type="file" accept="image/*,.pdf" multiple className="service-upload-input" onChange={onPickFiles} />
                <span>Drop files here or browse — demo only, stored in this browser session</span>
              </label>
              {createFiles.length > 0 && (
                <ul className="service-upload-list">
                  {createFiles.map((f, i) => (
                    <li key={`${f.name}-${i}`}>
                      <span>{f.name}</span>
                      <span className="service-upload-meta">{f.size}</span>
                      <button type="button" className="service-btn service-btn-ghost service-btn-small" onClick={() => removeFile(i)}>
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="service-create-actions">
              <button type="submit" className="service-btn service-btn-primary" disabled={payCase === 'pay_add_card' && !mockCardSaved}>
                Submit ticket
              </button>
              {draftTicket && (
                <button type="button" className="service-btn service-btn-ghost" onClick={saveDraftProgress}>
                  Save draft
                </button>
              )}
              <button type="button" className="service-btn" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
