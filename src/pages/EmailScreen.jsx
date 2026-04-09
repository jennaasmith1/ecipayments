import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  dealer,
  customer,
  invoices,
  inboxEmails,
  formatCurrency,
  formatDate,
  getStatusLabel,
  getStatusVariant,
} from '../data/fakeData';
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
const INBOX_COUNT = inboxEmails.filter((e) => !e.read).length;

export default function EmailScreen() {
  const [selectedEmailId, setSelectedEmailId] = useState('tesla-payment');

  useEffect(() => {
    document.body.classList.add(BODY_CLASS);
    return () => document.body.classList.remove(BODY_CLASS);
  }, []);

  const selectedEmail = inboxEmails.find((e) => e.id === selectedEmailId);
  const isPortalBillingEmail = selectedEmail?.bodyType === 'tesla-payment';

  return (
    <div className="email-inbox-app">
      <aside className="email-inbox-sidebar">
        <div className="email-inbox-sidebar-header">
          <span className="email-inbox-sidebar-title">Mail</span>
        </div>
        <button type="button" className="email-inbox-compose" aria-label="Compose">
          <span className="email-inbox-compose-icon" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </span>
          Compose
        </button>
        <nav className="email-inbox-nav" aria-label="Mail folders">
          <a href="#inbox" className="email-inbox-nav-item email-inbox-nav-item--active" aria-current="page">
            <span className="email-inbox-nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 12h-6l-2 3h-4l-2-3H2" />
              </svg>
            </span>
            Inbox
            {INBOX_COUNT > 0 && <span className="email-inbox-nav-count">{INBOX_COUNT}</span>}
          </a>
          <a href="#sent" className="email-inbox-nav-item">
            <span className="email-inbox-nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </span>
            Sent
          </a>
          <a href="#drafts" className="email-inbox-nav-item">
            <span className="email-inbox-nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </span>
            Drafts
          </a>
          <a href="#trash" className="email-inbox-nav-item">
            <span className="email-inbox-nav-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </span>
            Trash
          </a>
        </nav>
        <div className="email-inbox-account">
          <span className="email-inbox-account-name">{customer.name}</span>
          <span className="email-inbox-account-email">{customer.email}</span>
        </div>
      </aside>

      <section className="email-inbox-list" aria-label="Email list">
        {inboxEmails.map((email) => (
          <button
            key={email.id}
            type="button"
            className={`email-inbox-list-row ${selectedEmailId === email.id ? 'email-inbox-list-row--selected' : ''} ${!email.read ? 'email-inbox-list-row--unread' : ''}`}
            onClick={() => setSelectedEmailId(email.id)}
          >
            <div className="email-inbox-list-row-from">{email.from.name}</div>
            <div className="email-inbox-list-row-subject">{email.subject}</div>
            <div className="email-inbox-list-row-snippet">{email.snippet}</div>
            <div className="email-inbox-list-row-meta">
              {email.date === '2026-03-10' ? email.time : formatDate(email.date)}
            </div>
          </button>
        ))}
      </section>

      <main className="email-inbox-pane" aria-label="Reading pane">
        {selectedEmail && (
          <>
            <div className="email-envelope">
              <div className="email-envelope-row">
                <span className="email-envelope-label">From:</span>{' '}
                <span className="email-envelope-value">
                  {isPortalBillingEmail
                    ? `${dealer.name} <${dealer.billingEmail}>`
                    : `${selectedEmail.from.name} <${selectedEmail.from.email}>`}
                </span>
              </div>
              <div className="email-envelope-row">
                <span className="email-envelope-label">To:</span>{' '}
                <span className="email-envelope-value">
                  {customer.name} &lt;{customer.email}&gt;
                </span>
              </div>
              <div className="email-envelope-row">
                <span className="email-envelope-label">Subject:</span>{' '}
                <span className="email-envelope-value">
                  {isPortalBillingEmail
                    ? `Payment reminder: ${emailInvoices.length} invoices due`
                    : selectedEmail.subject}
                </span>
              </div>
            </div>
            <div className="email-inbox-pane-inner">
{isPortalBillingEmail ? (
              <TeslaBillingEmailBody />
            ) : (
                <GenericEmailBody email={selectedEmail} />
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function TeslaBillingEmailBody() {
  return (
    <div className="email-card">
      <div className="email-mockup">
        <div className="email-mockup-header">
          <img
            src="/branding/tesla-logo.png"
            alt="Tesla"
            className="email-mockup-logo"
          />
        </div>
        <div className="email-mockup-body">
          <p className="email-greeting">Hi {customer.name},</p>
          <p className="email-lead">
            You have <strong>{formatCurrency(totalOutstanding)}</strong> in outstanding invoices.
            Pay now, no login required.
          </p>
          {emailInvoices.length > 0 && (
            <p className="email-earliest-due">
              Earliest due{' '}
              {formatDate(
                emailInvoices.reduce(
                  (min, inv) => (inv.dueDate < min ? inv.dueDate : min),
                  emailInvoices[0].dueDate
                )
              )}
              .
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
                        <span
                          className={`email-status-tag email-status-tag--${getStatusVariant(inv.status)}`}
                        >
                          {getStatusLabel(inv.status)}
                        </span>
                      </div>
                      <p className="email-invoice-item-description">{inv.description}</p>
                      <Link to="/pay" className="email-view-invoice-link">
                        View Invoice
                      </Link>
                    </div>
                    <div className="email-invoice-item-right">
                      <span className="email-invoice-item-amount">
                        {formatCurrency(inv.amount)}
                      </span>
                      <span
                        className={`email-invoice-item-due ${isOverdue(inv.dueDate) ? 'email-invoice-item-due--overdue' : ''}`}
                      >
                        <svg
                          className="email-invoice-item-due-icon"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          aria-hidden
                        >
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
                  <span className="email-invoice-total-amount">
                    {formatCurrency(totalOutstanding)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="email-cta-row">
            <a
              href="/pay"
              target="_blank"
              rel="noopener noreferrer"
              className="email-cta-primary"
              aria-label="Pay Now"
            >
              Pay Now
              <svg
                className="email-cta-primary-icon email-cta-primary-icon-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                aria-hidden
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <div className="email-cta-secondary-row">
              <Link to="/settings/autopay" className="email-cta-secondary-link">
                <svg
                  className="email-cta-secondary-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
                Set up AutoPay
              </Link>
              <span className="email-cta-divider" aria-hidden />
              <Link to="/settings/notifications" className="email-cta-secondary-link">
                <svg
                  className="email-cta-secondary-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                Manage notification preferences
              </Link>
            </div>
            <div className="email-contact-block">
              <p className="email-contact-intro">
                If you have questions about your invoice, we're here to help.
              </p>
              <div className="email-signature-links">
                <Link to="/chat" className="email-signature-link">
                  <span className="email-signature-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  </span>
                  Ask AI about your bill
                </Link>
                <span className="email-signature-link-sep" aria-hidden> · </span>
                <a href={`tel:+1${dealer.billingPhone.replace(/\D/g, '')}`} className="email-signature-link">
                  <span className="email-signature-link-icon" aria-hidden>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>
                  </span>
                  Talk to a billing specialist
                </a>
              </div>
              <p className="email-contact-name">{dealer.name}</p>
              <p className="email-contact-dept">Billing Department</p>
              <p className="email-contact-detail">
                <a href={`mailto:${dealer.billingEmail}`}>{dealer.billingEmail}</a>
              </p>
              <p className="email-contact-detail">{dealer.billingPhone}</p>
            </div>
          </div>
          <p className="email-footer-line">
            You're receiving this because you have an active account with {dealer.name}.
          </p>
        </div>
      </div>
    </div>
  );
}

function GenericEmailBody({ email }) {
  return (
    <div className="email-inbox-generic-body">
      <div className="email-inbox-generic-body-content">
        <p>{email.snippet}</p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
          nulla pariatur.
        </p>
      </div>
    </div>
  );
}
