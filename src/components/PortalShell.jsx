import { useState } from 'react';
import { Link } from 'react-router-dom';
import { dealer, customer, notifications } from '../data/fakeData';
import './PortalShell.css';

function PortalShell({ children }) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="portal-shell">
      <header className="portal-header">
        <div className="portal-header-left">
          <button
            type="button"
            className="portal-menu-trigger"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {menuOpen && (
            <>
              <div className="portal-menu-backdrop" aria-hidden onClick={() => setMenuOpen(false)} />
              <nav className="portal-menu-dropdown" aria-label="Main navigation">
                <Link to="/payments" onClick={() => setMenuOpen(false)} className="portal-menu-link">Payments</Link>
                <Link to="/pay" onClick={() => setMenuOpen(false)} className="portal-menu-link">Pay Invoices</Link>
                <Link to="/settings/notifications" onClick={() => setMenuOpen(false)} className="portal-menu-link">Notification Settings</Link>
                <Link to="/settings/autopay" onClick={() => setMenuOpen(false)} className="portal-menu-link">AutoPay</Link>
              </nav>
            </>
          )}
          <Link to="/pay" className="portal-header-logo-link" style={{ textDecoration: 'none', color: 'inherit' }} onClick={() => setMenuOpen(false)}>
            <img src="/summit-logo-header.png" alt={dealer.name} className="portal-header-logo" />
          </Link>
        </div>
        <div className="portal-header-right">
          <button
            type="button"
            className="notification-trigger"
            onClick={() => setNotificationOpen((o) => !o)}
            aria-label="Notifications"
            aria-expanded={notificationOpen}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>
          {notificationOpen && (
            <>
              <div
                className="notification-dropdown-backdrop"
                aria-hidden
                onClick={() => setNotificationOpen(false)}
              />
              <div className="notification-dropdown" role="dialog" aria-label="Notifications">
                <div className="notification-dropdown-header">Notifications</div>
                <div className="notification-list">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      className={`notification-item ${!n.read ? 'notification-item-unread' : ''}`}
                      onClick={() => setNotificationOpen(false)}
                    >
                      <div className="notification-item-title">{n.title}</div>
                      <div className="notification-item-message">{n.message}</div>
                      <div className="notification-item-time">{n.time}</div>
                    </button>
                  ))}
                </div>
                <div className="notification-dropdown-footer">
                  <Link to="/settings/notifications" onClick={() => setNotificationOpen(false)}>
                    Manage notification settings
                  </Link>
                </div>
              </div>
            </>
          )}
          <div className="user-avatar">
            <div className="user-avatar-circle">
              {customer.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            <div className="user-avatar-labels">
              <span className="user-name">{customer.name}</span>
              <span className="user-company">{customer.company}</span>
            </div>
          </div>
        </div>
      </header>
      <main className="portal-content">{children}</main>
    </div>
  );
}

export default PortalShell;
