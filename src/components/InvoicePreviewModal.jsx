import { useEffect } from 'react';
import { usePortalProfile } from '../context/PortalProfileContext';
import './InvoicePreviewModal.css';

export default function InvoicePreviewModal({ invoice, onClose }) {
  const { dealer, customer, formatCurrency, formatDate } = usePortalProfile();
  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="invoice-modal-title">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 id="invoice-modal-title">Invoice #{invoice.number}</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="modal-body">
          <div className="invoice-preview-doc">
            <div className="inv-header">
              <div className="inv-dealer">
                <h3>{dealer.name}</h3>
                <p>{dealer.tagline}</p>
              </div>
              <div className="inv-meta">
                <div className="inv-number">INVOICE #{invoice.number}</div>
                <p>Date: {formatDate(invoice.date)}</p>
                <p>Due: {formatDate(invoice.dueDate)}</p>
              </div>
            </div>
            <div className="inv-bill-to">
              <h4>Bill To</h4>
              <p>{customer.company}</p>
              <p>Attn: {customer.name}</p>
              <p>{customer.accountId}</p>
            </div>
            <table className="inv-line-items">
              <thead>
                <tr>
                  <th>Description</th>
                  <th className="col-qty">Qty</th>
                  <th className="col-amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((line, i) => (
                  <tr key={i}>
                    <td>{line.description}</td>
                    <td>{line.quantity}</td>
                    <td className="col-amount">{formatCurrency(line.amount)}</td>
                  </tr>
                ))}
                <tr className="inv-total-row">
                  <td colSpan={2}>Total</td>
                  <td className="col-amount">{formatCurrency(invoice.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
