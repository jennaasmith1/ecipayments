import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dealer, customer, invoices, formatCurrency, formatDate, getStatusLabel, getStatusVariant } from '../data/fakeData';
import './EmailScreen.css';

// Show invoices sorted by due date (earliest first), then take first 5
const emailInvoices = [...invoices]
  .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  .slice(0, 5);
const totalOutstanding = emailInvoices.reduce((sum, inv) => sum + inv.amount, 0);

const today = new Date().toISOString().slice(0, 10);
function isOverdue(dueDate) {
  return dueDate < today;
}

const BODY_CLASS = 'email-screen-page';

export default function EmailScreen() {
  useEffect(() => {
    document.body.classList.add(BODY_CLASS);
    return () => document.body.classList.remove(BODY_CLASS);
  }, []);

  return (
    <div className="email-screen">
      <div className="email-card">
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
            You have <strong>{formatCurrency(totalOutstanding)}</strong> in outstanding invoices. Pay now, no login required.
          </p>
          {emailInvoices.length > 0 && (
            <p className="email-earliest-due">
              Earliest due {formatDate(emailInvoices.reduce((min, inv) => (inv.dueDate < min ? inv.dueDate : min), emailInvoices[0].dueDate))}.
            </p>
          )}
          <div className="email-invoice-card">
            <h2 className="email-invoice-list-heading">Outstanding invoices</h2>
            <div className="email-invoice-list">
              {emailInvoices.map((inv) => (
                <div key={inv.id} className="email-invoice-list-item">
                  <div className="email-invoice-item-content">
                    <div className="email-invoice-item-left">
                      <div className="email-invoice-item-meta">
                        <span className="email-invoice-item-number">#{inv.number}</span>
                        <span className={`email-status-tag email-status-tag--${getStatusVariant(inv.status)}`}>
                          {getStatusLabel(inv.status)}
                        </span>
                      </div>
                      <p className="email-invoice-item-description">{inv.description}</p>
                      <Link to="/pay" className="email-view-invoice-link">View Invoice</Link>
                    </div>
                    <div className="email-invoice-item-right">
                      <span className="email-invoice-item-amount">{formatCurrency(inv.amount)}</span>
                      <span className={`email-invoice-item-due ${isOverdue(inv.dueDate) ? 'email-invoice-item-due--overdue' : ''}`}>
                        <svg className="email-invoice-item-due-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
              <div className="email-invoice-list-item email-invoice-total-row">
                <div className="email-invoice-item-content">
                  <span className="email-invoice-total-label">Total outstanding</span>
                  <span className="email-invoice-total-amount">{formatCurrency(totalOutstanding)}</span>
                </div>
              </div>
            </div>
          </div>
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
    </div>
  );
}
