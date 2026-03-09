import { Link } from 'react-router-dom';
import { dealer, customer, invoices, formatCurrency, formatDate } from '../data/fakeData';
import './EmailScreen.css';

// Show invoices and total for email
const emailInvoices = invoices.slice(0, 5);
const totalOutstanding = emailInvoices.reduce((sum, inv) => sum + inv.amount, 0);

export default function EmailScreen() {
  return (
    <div className="email-screen">
      <div className="email-envelope">
        <div className="email-envelope-row"><span className="email-envelope-label">From:</span> <span className="email-envelope-value">{dealer.name} &lt;{dealer.billingEmail}&gt;</span></div>
        <div className="email-envelope-row"><span className="email-envelope-label">To:</span> <span className="email-envelope-value">{customer.name} &lt;{customer.email}&gt;</span></div>
        <div className="email-envelope-row"><span className="email-envelope-label">Subject:</span> <span className="email-envelope-value">Payment reminder: {emailInvoices.length} invoices due</span></div>
      </div>
      <div className="email-mockup">
        <div className="email-mockup-header">
          <img src="/summit-logo.png" alt="Summit Office Solutions" className="email-mockup-logo" />
        </div>
        <div className="email-mockup-body">
          <p className="email-greeting">
            Hi {customer.name},
          </p>
          <p className="email-lead">
            You have <strong>{formatCurrency(totalOutstanding)}</strong> in outstanding invoices. Pay now with one click — no login required.
          </p>
          {emailInvoices.length > 0 && (
            <p className="email-earliest-due">
              Earliest due {formatDate(emailInvoices.reduce((min, inv) => (inv.dueDate < min ? inv.dueDate : min), emailInvoices[0].dueDate))}.
            </p>
          )}
          <table className="email-invoice-table">
            <caption className="sr-only">Outstanding invoices</caption>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Description</th>
                <th>Due date</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {emailInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td>{inv.number}</td>
                  <td>{inv.description}</td>
                  <td>{formatDate(inv.dueDate)}</td>
                  <td className="amount">{formatCurrency(inv.amount)}</td>
                </tr>
              ))}
              <tr className="email-total-row">
                <td colSpan={3}>Total outstanding</td>
                <td>{formatCurrency(totalOutstanding)}</td>
              </tr>
            </tbody>
          </table>
          <div className="email-cta-row">
            <Link to="/pay" className="email-cta-primary">
              Pay Now
              <svg className="email-cta-primary-icon email-cta-primary-icon-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="email-cta-secondary-row">
              <Link to="/settings/autopay" className="email-cta-secondary-link">
                <svg className="email-cta-secondary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                Set up AutoPay
              </Link>
              <span className="email-cta-divider" aria-hidden />
              <Link to="/settings/notifications" className="email-cta-secondary-link">
                <svg className="email-cta-secondary-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Manage notification preferences
              </Link>
            </div>
            <div className="email-contact-block">
              <p className="email-contact-intro">If you have questions about any invoice, please contact our billing team.</p>
              <p className="email-contact-name">{dealer.name}</p>
              <p className="email-contact-dept">Billing Department</p>
              <p className="email-contact-detail"><a href={`mailto:${dealer.billingEmail}`}>{dealer.billingEmail}</a></p>
              <p className="email-contact-detail">{dealer.billingPhone}</p>
            </div>
          </div>
          <p className="email-footer-line">You're receiving this because you have an active account with {dealer.name}.</p>
        </div>
      </div>
    </div>
  );
}
