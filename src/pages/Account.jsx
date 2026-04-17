import { Link } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import './Account.css';

export default function Account() {
  const { customer, dealer, paymentMethods } = usePortalProfile();
  const paymentsPath = usePortalPath('/payments');
  const notifPath = usePortalPath('/settings/notifications');
  const autopayPath = usePortalPath('/settings/autopay');

  return (
    <div className="account-page">
      <header className="account-header">
        <h1>Company details</h1>
        <p className="account-subtitle">
          Company information, payment methods, and preferences.
        </p>
      </header>

      <section className="account-section">
        <h2 className="account-section-title">Company details</h2>
        <div className="account-card">
          <dl className="account-dl">
            <dt>Company</dt>
            <dd>{customer.company}</dd>
            <dt>Account ID</dt>
            <dd><code>{customer.accountId}</code></dd>
            <dt>Billing email</dt>
            <dd>{customer.billingEmail}</dd>
            <dt>Contact email</dt>
            <dd>{customer.email}</dd>
            <dt>Phone</dt>
            <dd>{customer.phone}</dd>
          </dl>
          <p className="account-card-note">Contact your account manager at {dealer.name} to update company information.</p>
        </div>
      </section>

      <section className="account-section" id="payment-methods">
        <h2 className="account-section-title">Saved payment methods</h2>
        <div className="account-methods-list">
          {paymentMethods.map((method) => (
            <div key={method.id} className="account-method-card">
              <div className="account-method-info">
                <span className="account-method-type">{method.label}</span>
                <span className="account-method-last4">•••• {method.last4}</span>
                {method.isRecommended && (
                  <span className="account-method-badge">Recommended</span>
                )}
              </div>
              <Link to={paymentsPath} className="account-link">Manage</Link>
            </div>
          ))}
        </div>
        <Link to={paymentsPath} className="account-section-link">Add payment method</Link>
      </section>

      <section className="account-section">
        <h2 className="account-section-title">Notifications & preferences</h2>
        <div className="account-links-list">
          <Link to={notifPath} className="account-link-card">
            <span className="account-link-card-title">Notification settings</span>
            <span className="account-link-card-desc">Email, SMS, and Teams/Slack preferences</span>
          </Link>
          <Link to={autopayPath} className="account-link-card">
            <span className="account-link-card-title">AutoPay</span>
            <span className="account-link-card-desc">Automate payments for eligible invoices</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
