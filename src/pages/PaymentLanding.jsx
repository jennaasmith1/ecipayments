import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import InvoicePreviewModal from '../components/InvoicePreviewModal';
import AddPaymentMethodModal from '../components/AddPaymentMethodModal';
import './PaymentLanding.css';

const PAYMENT_PROCESSING_MS = 2200;

export default function PaymentLanding() {
  const { invoices, paymentMethods, formatCurrency, formatDate, getStatusLabel, getStatusVariant } =
    usePortalProfile();
  const paySuccessPath = usePortalPath('/pay/success');
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState(() => new Set(invoices.map((i) => i.id)));
  const [selectedPaymentId, setSelectedPaymentId] = useState(
    () => paymentMethods.find((m) => m.isRecommended)?.id ?? paymentMethods[0]?.id ?? ''
  );
  const [previewInvoice, setPreviewInvoice] = useState(null);
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const selectedInvoices = invoices.filter((i) => selectedIds.has(i.id));
  const totalDue = selectedInvoices.reduce((sum, i) => sum + i.amount, 0);

  const toggleInvoice = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === invoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoices.map((i) => i.id)));
    }
  };

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      navigate(paySuccessPath, {
        state: {
          amount: totalDue,
          paymentMethod: paymentMethods.find((m) => m.id === selectedPaymentId),
          invoices: selectedInvoices,
        },
      });
    }, PAYMENT_PROCESSING_MS);
  };

  return (
    <div className="payment-landing">
      <div className="payment-landing-header">
        <h1>Pay Invoices</h1>
        <p className="payment-landing-subtitle">Select invoices to pay and choose your payment method below.</p>
      </div>

      <div className="layout-two-col">
        <div className="invoice-table-card">
          <h2>Outstanding Invoices</h2>
          {invoices.length === 0 ? (
            <div className="invoice-list-empty">
              <p className="invoice-list-empty-title">No Outstanding Invoices</p>
              <p className="invoice-list-empty-subtitle">You're all caught up.</p>
            </div>
          ) : (
            <>
          <div className="invoice-list-header">
            <div className="invoice-list-header-check">
              <input
                id="select-all-invoices"
                type="checkbox"
                checked={selectedIds.size === invoices.length}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </div>
            <div className="invoice-list-header-content">
              <label htmlFor="select-all-invoices" className={`invoice-list-select-all ${selectedIds.size === invoices.length ? 'invoice-list-select-all--muted' : ''}`}>
                {selectedIds.size === invoices.length ? 'Deselect All' : 'Select All'}
              </label>
              <span className="invoice-list-count">{selectedIds.size} of {invoices.length} selected</span>
            </div>
          </div>
          <div className="invoice-list">
            {[...invoices]
              .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
              .map((inv) => (
              <div key={inv.id} className="invoice-list-item">
                <div className="invoice-item-check-col">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(inv.id)}
                    onChange={() => toggleInvoice(inv.id)}
                    aria-label={`Select invoice ${inv.number}`}
                    className="invoice-item-checkbox"
                  />
                </div>
                <div className="invoice-item-content">
                <div className="invoice-item-left">
                  <div className="invoice-item-meta">
                    <span className="invoice-item-number">#{inv.number}</span>
                    <span className={`status-tag status-tag--${getStatusVariant(inv.status)}`}>
                      {getStatusLabel(inv.status)}
                    </span>
                  </div>
                  <p className="invoice-item-description">{inv.description}</p>
                  <button
                    type="button"
                    className="view-invoice-link link-style"
                    onClick={() => setPreviewInvoice(inv)}
                  >
                    View Invoice
                  </button>
                </div>
                <div className="invoice-item-right">
                  <span className="invoice-item-amount">{formatCurrency(inv.amount)}</span>
                  <span className={`invoice-item-due ${inv.status === 'overdue' ? 'invoice-item-due--overdue' : ''}`}>
                    <svg className="invoice-item-due-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    Due {formatDate(inv.dueDate)}
                  </span>
                </div>
                </div>
              </div>
            ))}
          </div>
            </>
          )}
        </div>

        <aside className="summary-card">
          <h2>Payment Summary</h2>
          <div className="summary-total">{formatCurrency(totalDue)}</div>
          {selectedInvoices.length === 0 ? (
            <p className="summary-zero-hint">Select at least one invoice above to pay.</p>
          ) : (
            <>
              <p className="summary-invoice-count">
                {selectedInvoices.length} {selectedInvoices.length === 1 ? 'invoice' : 'invoices'} selected
              </p>
              <p className="summary-earliest-due">
                Earliest due: {formatDate(selectedInvoices.reduce((min, i) => (i.dueDate < min ? i.dueDate : min), selectedInvoices[0].dueDate))}
              </p>
            </>
          )}

          <div className="payment-methods-section">
            <h3>Payment Method</h3>
            {paymentMethods.map((pm) => (
              <div key={pm.id} className={`payment-method-option ${selectedPaymentId === pm.id ? 'selected' : ''}`}>
                <label className="payment-method-option-inner">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={selectedPaymentId === pm.id}
                    onChange={() => setSelectedPaymentId(pm.id)}
                  />
                  {pm.type === 'ach' ? (
                    <svg className="payment-method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                    </svg>
                  ) : (
                    <svg className="payment-method-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  )}
                  <span className="label">
                    {pm.label} ending in {pm.last4}
                    {pm.recommendationNote && <div className="note">{pm.recommendationNote}</div>}
                  </span>
                </label>
                <button
                  type="button"
                  className="payment-method-edit"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setAddPaymentOpen(true); }}
                  aria-label={`Edit ${pm.label} ending in ${pm.last4}`}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
              </div>
            ))}
            <button type="button" className="add-payment-link link-style" onClick={() => setAddPaymentOpen(true)}>
              + Add New Payment Method
            </button>
          </div>

          <button
            type="button"
            className="pay-button"
            onClick={handlePay}
            disabled={selectedInvoices.length === 0 || isPaying}
          >
            Pay {formatCurrency(totalDue)}
          </button>
          <p className="pay-button-trust">
            <svg className="pay-button-trust-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Secure Payment
          </p>
        </aside>
      </div>

      {isPaying && (
        <div className="payment-loading-overlay" aria-live="polite" aria-busy="true">
          <div className="payment-loading-overlay-content">
            <div className="payment-loading-spinner" aria-hidden />
            <p className="payment-loading-message">Processing your payment...</p>
          </div>
        </div>
      )}

      {previewInvoice && (
        <InvoicePreviewModal invoice={previewInvoice} onClose={() => setPreviewInvoice(null)} />
      )}
      {addPaymentOpen && <AddPaymentMethodModal onClose={() => setAddPaymentOpen(false)} />}
    </div>
  );
}
