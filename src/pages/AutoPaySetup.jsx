import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { paymentMethods } from '../data/fakeData';
import './AutoPaySetup.css';

const invoiceTypeOptions = [
  { id: 'all', label: 'All invoices' },
  { id: 'sales', label: 'Sales' },
  { id: 'service', label: 'Service' },
  { id: 'contract', label: 'Contract' },
  { id: 'miscellaneous', label: 'Miscellaneous' },
];

export default function AutoPaySetup() {
  const [on, setOn] = useState(false);
  const [saved, setSaved] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState(paymentMethods[0]?.id ?? '');
  const [invoiceTypes, setInvoiceTypes] = useState(['all']);
  const [invoiceTypesOpen, setInvoiceTypesOpen] = useState(false);
  const invoiceTypesRef = useRef(null);
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [timing, setTiming] = useState('due_date');
  const [dayOfMonth, setDayOfMonth] = useState('1');
  const [emailBeforeRun, setEmailBeforeRun] = useState(false);

  const toggleInvoiceType = (id) => {
    if (id === 'all') {
      setInvoiceTypes(invoiceTypes.includes('all') ? [] : ['all']);
      return;
    }
    setInvoiceTypes((prev) => {
      const next = prev.filter((x) => x !== 'all');
      if (next.includes(id)) return next.filter((x) => x !== id);
      return [...next, id];
    });
  };

  const invoiceTypesLabel =
    invoiceTypes.includes('all') || invoiceTypes.length === 0
      ? 'All invoices'
      : invoiceTypes
          .map((id) => invoiceTypeOptions.find((o) => o.id === id)?.label)
          .filter(Boolean)
          .join(', ');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (invoiceTypesRef.current && !invoiceTypesRef.current.contains(e.target)) {
        setInvoiceTypesOpen(false);
      }
    };
    if (invoiceTypesOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [invoiceTypesOpen]);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="autopay-setup">
        <h1>AutoPay</h1>
        <p className="subtitle">Manage Automatic Payments</p>
        <div className="autopay-card autopay-success-state">
          <div className="success-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <h3>AutoPay updated</h3>
          <p>Your preferences have been saved. We'll process payments automatically according to your settings.</p>
          <div className="autopay-actions" style={{ justifyContent: 'center', marginTop: 24 }}>
            <button type="button" className="btn-secondary" onClick={() => setSaved(false)}>Edit Settings</button>
            <Link to="/pay" className="btn-primary" style={{ textDecoration: 'none' }}>Back to Invoices</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="autopay-setup">
      <h1>AutoPay</h1>
      <p className="subtitle">Pay invoices automatically on the due date. No more manual payments.</p>

      <div className="autopay-card">
        <div className="toggle-row">
          <div className="label-block">
            <h3>Enable AutoPay</h3>
            <p>Automatically pay eligible invoices using your selected payment method.</p>
          </div>
          <button
            type="button"
            className={`toggle-switch ${on ? 'on' : ''}`}
            onClick={() => setOn((o) => !o)}
            aria-pressed={on}
            aria-label="Toggle AutoPay"
          />
        </div>

        {on && (
          <>
            <div className="form-section" style={{ marginTop: 20 }}>
              <h3>Payment Method</h3>
              <div className="form-group">
                <select
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(e.target.value)}
                >
                  {paymentMethods.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.label} ending in {pm.last4}
                    </option>
                  ))}
                </select>
                <p className="hint">We'll use this method for AutoPay. You can change it anytime.</p>
              </div>
            </div>

            <div className="form-section" ref={invoiceTypesRef}>
              <h3>Invoice Types</h3>
              <div className="form-group">
                <div className="invoice-types-dropdown">
                  <button
                    type="button"
                    className="invoice-types-trigger"
                    onClick={() => setInvoiceTypesOpen((o) => !o)}
                    aria-expanded={invoiceTypesOpen}
                    aria-haspopup="listbox"
                    aria-label="Select invoice types"
                  >
                    <span className="invoice-types-trigger-label">{invoiceTypesLabel}</span>
                    <svg className="invoice-types-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                  {invoiceTypesOpen && (
                    <div
                      className="invoice-types-panel"
                      role="listbox"
                      aria-multiselectable="true"
                    >
                      {invoiceTypeOptions.map((opt) => (
                        <div
                          key={opt.id}
                          role="option"
                          aria-selected={invoiceTypes.includes(opt.id)}
                          className="invoice-types-option"
                          onClick={() => toggleInvoiceType(opt.id)}
                        >
                          <input
                            type="checkbox"
                            checked={invoiceTypes.includes(opt.id)}
                            onChange={() => {}}
                            tabIndex={-1}
                            aria-hidden="true"
                          />
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="hint">Choose which invoices to pay automatically.</p>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment amount limits</h3>
              <div className="form-group limits-row">
                <div>
                  <label htmlFor="autopay-min">Minimum payment amount (optional)</label>
                  <div className="amount-input-wrap">
                    <span className="amount-input-prefix" aria-hidden="true">$</span>
                    <input
                      id="autopay-min"
                      type="text"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="Leave blank for no minimum"
                      className="amount-input"
                    />
                  </div>
                  <p className="hint">Only auto-pay invoices at or above this amount. Leave blank to pay any amount.</p>
                </div>
                <div>
                  <label htmlFor="autopay-max">Maximum payment amount (optional)</label>
                  <div className="amount-input-wrap">
                    <span className="amount-input-prefix" aria-hidden="true">$</span>
                    <input
                      id="autopay-max"
                      type="text"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="Leave blank for no maximum"
                      className="amount-input"
                    />
                  </div>
                  <p className="hint">We won't auto-pay any single invoice above this amount. Leave blank for no limit.</p>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Payment Timing</h3>
              <div className="timing-options">
                <label className={`timing-option ${timing === 'due_date' ? 'timing-option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="timing"
                    checked={timing === 'due_date'}
                    onChange={() => setTiming('due_date')}
                    className="timing-option-radio"
                  />
                  <span className="timing-option-title">On due date</span>
                  <p className="timing-option-hint">Pay each invoice on its due date.</p>
                </label>
                <label className={`timing-option ${timing === 'day_of_month' ? 'timing-option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="timing"
                    checked={timing === 'day_of_month'}
                    onChange={() => setTiming('day_of_month')}
                    className="timing-option-radio"
                  />
                  <span className="timing-option-title">Specific day of month</span>
                  {timing === 'day_of_month' && (
                    <div className="timing-option-select-wrap">
                      <select
                        value={dayOfMonth}
                        onChange={(e) => setDayOfMonth(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="timing-option-select"
                      >
                        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
                          <option key={d} value={String(d)}>Day {d}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <p className="timing-option-hint">We'll pay all due invoices on this day each month.</p>
                </label>
              </div>
            </div>

            <div className="form-section">
              <h3>Advance notice</h3>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={emailBeforeRun}
                    onChange={(e) => setEmailBeforeRun(e.target.checked)}
                  />
                  Email me before each AutoPay run
                </label>
                <p className="hint">We'll send a summary of invoices that will be paid 1 day before.</p>
              </div>
            </div>

            {(() => {
              const typeLabel = invoiceTypes.includes('all')
                ? 'All invoices'
                : invoiceTypes.map((id) => invoiceTypeOptions.find((o) => o.id === id)?.label).filter(Boolean).join(', ');
              const hasMin = minAmount.trim() !== '';
              const hasMax = maxAmount.trim() !== '';
              const limitText = hasMin && hasMax
                ? ` between $${minAmount} and $${maxAmount}`
                : hasMin
                  ? ` at or above $${minAmount}`
                  : hasMax
                    ? ` up to $${maxAmount}`
                    : '';
              const timingText = timing === 'due_date'
                ? ' on the due date'
                : ` on day ${dayOfMonth} of each month`;
              return (
                <p className="autopay-summary">
                  AutoPay will pay {typeLabel}{limitText}{timingText}.
                </p>
              );
            })()}
          </>
        )}
      </div>

      <div className="autopay-actions">
        <Link to="/pay" className="btn-secondary" style={{ textDecoration: 'none' }}>Cancel</Link>
        <button type="button" className="btn-primary" onClick={handleSave}>
          Save Preferences
        </button>
      </div>
    </div>
  );
}
