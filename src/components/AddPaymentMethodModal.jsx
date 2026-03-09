import { useState, useEffect } from 'react';
import './AddPaymentMethodModal.css';
import './InvoicePreviewModal.css';

export default function AddPaymentMethodModal({ onClose }) {
  const [tab, setTab] = useState('card');
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="modal-backdrop add-payment-modal" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="add-payment-title">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="add-payment-title">Payment method options</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="tabs">
          <button type="button" className={`tab ${tab === 'card' ? 'active' : ''}`} onClick={() => setTab('card')}>
            Credit / Debit Card
          </button>
          <button type="button" className={`tab ${tab === 'ach' ? 'active' : ''}`} onClick={() => setTab('ach')}>
            ACH Bank Account
          </button>
          <button type="button" className={`tab ${tab === 'echeck' ? 'active' : ''}`} onClick={() => setTab('echeck')}>
            eCheck
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="tab-panel">
            {tab === 'card' && (
              <>
                <div className="form-group">
                  <label htmlFor="card-number">Card Number</label>
                  <input id="card-number" type="text" placeholder="4242 4242 4242 4242" />
                </div>
                <div className="form-group">
                  <label htmlFor="card-name">Name on Card</label>
                  <input id="card-name" type="text" placeholder="John Smith" />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiry">Expiration</label>
                    <input id="expiry" type="text" placeholder="MM / YY" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvc">CVC</label>
                    <input id="cvc" type="text" placeholder="123" />
                  </div>
                </div>
              </>
            )}
            {tab === 'ach' && (
              <>
                <div className="form-group">
                  <label htmlFor="routing">Routing Number</label>
                  <input id="routing" type="text" placeholder="021000021" />
                  <p className="hint">9-digit ABA routing number</p>
                </div>
                <div className="form-group">
                  <label htmlFor="account">Account Number</label>
                  <input id="account" type="text" placeholder="Account number" />
                </div>
                <div className="form-group">
                  <label htmlFor="account-type">Account Type</label>
                  <select id="account-type">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </>
            )}
            {tab === 'echeck' && (
              <>
                <div className="form-group">
                  <label htmlFor="echeck-routing">Routing Number</label>
                  <input id="echeck-routing" type="text" placeholder="021000021" />
                  <p className="hint">9-digit ABA routing number</p>
                </div>
                <div className="form-group">
                  <label htmlFor="echeck-account">Account Number</label>
                  <input id="echeck-account" type="text" placeholder="Account number" />
                </div>
                <div className="form-group">
                  <label htmlFor="echeck-type">Account Type</label>
                  <select id="echeck-type">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save Payment Method
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
