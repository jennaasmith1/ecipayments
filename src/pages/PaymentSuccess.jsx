import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { customer, formatCurrency } from '../data/fakeData';
import './PaymentSuccess.css';

export default function PaymentSuccess() {
  const [invoicesExpanded, setInvoicesExpanded] = useState(false);
  const location = useLocation();
  const state = location.state || {};
  const amount = state.amount ?? 3099.25;
  const paymentMethod = state.paymentMethod ?? { type: 'ach', label: 'ACH Bank Account', last4: '1187' };
  const invoices = state.invoices ?? [];
  const paidAt = new Date().toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  const [confirmationNumber] = useState(
    () => state.confirmationNumber ?? `CONF-${Date.now().toString(36).toUpperCase().slice(-9)}`
  );

  return (
    <div className="payment-success">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <h1>Payment Successful!</h1>
      <p className="subtitle">Your payment has been processed.</p>

      <div className="receipt-card">
        <h2>Payment Details</h2>
        <div className="receipt-details-grid">
          <div className="receipt-grid-item receipt-grid-item--amount">
            <span className="receipt-grid-label">Amount Paid</span>
            <span className="receipt-grid-value">{formatCurrency(amount)}</span>
          </div>
          <div className="receipt-grid-item">
            <span className="receipt-grid-label">Confirmation Number</span>
            <span className="receipt-grid-value">{confirmationNumber}</span>
          </div>
          <div className="receipt-grid-item">
            <span className="receipt-grid-label">Payment Method</span>
            <span className="receipt-grid-value receipt-row-payment-method">
              {paymentMethod.type === 'ach' ? (
                <svg className="receipt-payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
                </svg>
              ) : (
                <svg className="receipt-payment-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                  <line x1="1" y1="10" x2="23" y2="10" />
                </svg>
              )}
              {paymentMethod.label} •••• {paymentMethod.last4}
            </span>
          </div>
          <div className="receipt-grid-item">
            <span className="receipt-grid-label">Transaction Date</span>
            <span className="receipt-grid-value">{paidAt}</span>
          </div>
        </div>
        {invoices.length > 0 && (
          <div className="receipt-invoices">
            <button
              type="button"
              className="receipt-invoices-toggle"
              onClick={() => setInvoicesExpanded((e) => !e)}
              aria-expanded={invoicesExpanded}
              aria-controls="receipt-invoices-list"
            >
              <span className="receipt-invoices-summary">
                Paid Invoices ({invoices.length})
              </span>
              <svg className={`receipt-invoices-chevron ${invoicesExpanded ? 'receipt-invoices-chevron--open' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div id="receipt-invoices-list" className="receipt-invoices-list" hidden={!invoicesExpanded}>
              {invoices.map((inv) => (
                <div key={inv.id} className="inv-item">
                  <span>#{inv.number} – {inv.description}</span>
                  <span className="amount">{formatCurrency(inv.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <p className="receipt-email-note">
          Receipt sent to {customer.billingEmail}
        </p>
      </div>

      <div className="success-actions">
        <button type="button" className="btn btn-outline">
          <svg className="success-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download receipt
        </button>
        <button type="button" className="btn btn-outline">
          <svg className="success-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Forward receipt
        </button>
      </div>

      <div className="autopay-promo-card">
        <h3>Set up AutoPay for Future Invoices</h3>
        <p>
          Avoid manual payments and stay current on invoices automatically. Set up AutoPay to pay on the due date with your preferred payment method.
        </p>
        <Link to="/settings/autopay" className="btn-accent">
          <svg className="btn-accent-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14" />
            <path d="M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
          Set Up AutoPay
        </Link>
      </div>
    </div>
  );
}
