import { Link } from 'react-router-dom';
import { invoices, formatCurrency, formatDate, getStatusLabel, getStatusVariant } from '../data/fakeData';
import './Billing.css';

const totalBalance = invoices.reduce((sum, inv) => sum + inv.amount, 0);

export default function Billing() {
  return (
    <div className="billing-page">
      <header className="billing-header">
        <h1>Billing</h1>
        <p className="billing-subtitle">
          View invoices and manage your account balance.
        </p>
      </header>

      <div className="billing-top-row">
        <div className="billing-balance-card">
          <div className="billing-balance-label">Account balance</div>
          <div className="billing-balance-value">{formatCurrency(totalBalance)}</div>
          <p className="billing-balance-meta">Total outstanding across {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
          <Link to="/pay" className="billing-balance-cta">Pay now</Link>
        </div>

        <section className="billing-help-section">
          <h2 className="billing-help-title">Need help with your bill?</h2>
          <p className="billing-help-desc">If something doesn’t make sense, get answers quickly.</p>
          <div className="billing-help-actions">
            <button type="button" className="billing-help-btn billing-help-ai">
              <span className="billing-help-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              </span>
              Ask AI about your bill
            </button>
            <a href="tel:+15555550100" className="billing-help-btn billing-help-voice">
              <span className="billing-help-icon" aria-hidden>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
              </span>
              Talk to a billing specialist
            </a>
          </div>
        </section>
      </div>

      <section className="billing-section">
        <h2 className="billing-section-title">Invoices</h2>
        <div className="billing-table-wrap">
          <table className="billing-table">
            <caption className="sr-only">Invoice list</caption>
            <thead>
              <tr>
                <th>Invoice</th>
                <th>Description</th>
                <th>Date</th>
                <th>Due date</th>
                <th>Status</th>
                <th className="col-amount">Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td><strong>#{inv.number}</strong></td>
                  <td>{inv.description}</td>
                  <td>{formatDate(inv.date)}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td>
                    <span className={`billing-status billing-status-${getStatusVariant(inv.status)}`}>
                      {getStatusLabel(inv.status)}
                    </span>
                  </td>
                  <td className="col-amount">{formatCurrency(inv.amount)}</td>
                  <td>
                    <Link to="/pay" className="billing-link">Pay</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
