import { Link } from 'react-router-dom';
import {
  customer,
  invoices,
  equipment,
  notifications,
  recentActivity,
  formatCurrency,
} from '../data/fakeData';
import { serviceTickets, isOpenServiceTicket } from '../data/serviceTicketsData';
import './HomeDashboard.css';

const totalBalance = invoices.reduce((sum, inv) => sum + inv.amount, 0);
const invoicesDue = invoices.filter((i) => i.status === 'due_soon' || i.status === 'overdue');
const amountDue = invoicesDue.reduce((sum, i) => sum + i.amount, 0);
const openTickets = serviceTickets.filter(isOpenServiceTicket);
const devicesNeedingAttention = equipment.filter((e) => e.needsAttention);

export default function HomeDashboard() {
  return (
    <div className="home-dashboard">
      <header className="home-dashboard-header">
        <h1>Welcome back, {customer.name.split(' ')[0]}</h1>
        <p className="home-dashboard-subtitle">
          Here’s an overview of your account with {customer.company}.
        </p>
      </header>

      <div className="home-dashboard-grid">
        {/* Account Balance */}
        <section className="home-card home-card-balance">
          <h2 className="home-card-title">Account balance</h2>
          <div className="home-card-value">{formatCurrency(totalBalance)}</div>
          <p className="home-card-meta">Outstanding across {invoices.length} invoice{invoices.length !== 1 ? 's' : ''}</p>
          <Link to="/pay" className="home-card-cta home-card-cta-primary">
            Pay now
          </Link>
        </section>

        {/* Invoices Due */}
        <section className="home-card">
          <h2 className="home-card-title">Invoices due</h2>
          <div className="home-card-value">{invoicesDue.length}</div>
          <p className="home-card-meta">{formatCurrency(amountDue)} total due</p>
          <Link to="/billing" className="home-card-cta">
            View invoices
          </Link>
        </section>

        {/* Equipment Overview */}
        <section className="home-card">
          <h2 className="home-card-title">Equipment</h2>
          <div className="home-card-value">{equipment.length}</div>
          <p className="home-card-meta">Active device{equipment.length !== 1 ? 's' : ''}</p>
          {devicesNeedingAttention.length > 0 && (
            <p className="home-card-alert">
              {devicesNeedingAttention.length} device{devicesNeedingAttention.length !== 1 ? 's' : ''} with alerts (offline, meter, or supplies)
            </p>
          )}
          <Link to="/equipment" className="home-card-cta">
            View equipment
          </Link>
        </section>

        {/* Service Tickets */}
        <section className="home-card">
          <h2 className="home-card-title">Service tickets</h2>
          <div className="home-card-value">{openTickets.length}</div>
          <p className="home-card-meta">Open ticket{openTickets.length !== 1 ? 's' : ''}</p>
          <Link to="/service" className="home-card-cta">
            View tickets
          </Link>
        </section>
      </div>

      {/* Quick Actions */}
      <section className="home-section">
        <h2 className="home-section-title">Quick actions</h2>
        <div className="home-quick-actions">
          <Link to="/service?create=1" className="home-quick-action">
            <span className="home-quick-action-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 4v16M4 12h16" /></svg>
            </span>
            Create service ticket
          </Link>
          <Link to="/equipment#meter" className="home-quick-action">
            <span className="home-quick-action-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            </span>
            Capture meter read
          </Link>
          <Link to="/supplies" className="home-quick-action">
            <span className="home-quick-action-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </span>
            Order supplies
          </Link>
          <Link to="/pay" className="home-quick-action">
            <span className="home-quick-action-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </span>
            Pay invoice
          </Link>
        </div>
      </section>

      <div className="home-dashboard-two-col">
        {/* Recent Activity */}
        <section className="home-section home-activity-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Recent activity</h2>
            <Link to="/payments" className="home-section-link">View all</Link>
          </div>
          <ul className="home-activity-list">
            {recentActivity.slice(0, 5).map((item) => (
              <li key={item.id} className="home-activity-item">
                <Link to={item.link} className="home-activity-link">
                  <span className={`home-activity-dot home-activity-dot-${item.type}`} />
                  <div>
                    <span className="home-activity-title">{item.title}</span>
                    <span className="home-activity-detail">{item.detail}</span>
                  </div>
                  <span className="home-activity-time">{item.time}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Notifications */}
        <section className="home-section home-notifications-section">
          <div className="home-section-header">
            <h2 className="home-section-title">Notifications</h2>
            <div className="home-section-header-actions">
              <Link to="/notifications" className="home-section-link">See all</Link>
              <Link to="/settings/notifications" className="home-section-link">Settings</Link>
            </div>
          </div>
          <ul className="home-notifications-list">
            {notifications.slice(0, 4).map((n) => (
              <li key={n.id} className={`home-notification-item ${!n.read ? 'home-notification-unread' : ''}`}>
                <div className="home-notification-title">{n.title}</div>
                <div className="home-notification-message">{n.message}</div>
                <div className="home-notification-time">{n.time}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
