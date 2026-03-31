import { useState, useMemo } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { dealer, customer, notifications } from '../data/fakeData';
import { ADMIN_PREVIEW_STORAGE_KEY } from '../data/adminMockData';
import './PortalShell.css';

const navSections = [
  {
    label: 'Home',
    path: '/',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Equipment',
    path: '/equipment',
    icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 0H3m2 0h2m2 0h2M5 15H3m2 0H3m2 0h2m2 0h2M17 9h-2m2 0h2m2 0h2m2 0h2M17 15h-2m2 0h2m2 0h2m2 0h2',
    sub: [
      { label: 'View equipment list', path: '/equipment' },
      { label: 'Equipment details', path: '/equipment' },
      { label: 'Meter readings', path: '/equipment#meter' },
    ],
  },
  {
    label: 'Service',
    path: '/service',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
    sub: [
      { label: 'Create service ticket', path: '/service?create=1' },
      { label: 'View service tickets', path: '/service' },
      { label: 'Track technician', path: '/service' },
    ],
  },
  {
    label: 'Orders',
    path: '/supplies',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
    sub: [
      { label: 'Order supplies', path: '/supplies' },
      { label: 'Previous orders', path: '/supplies#orders' },
    ],
  },
  {
    label: 'Billing',
    path: '/billing',
    icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z',
    sub: [
      { label: 'View invoices', path: '/billing' },
      { label: 'Invoice history', path: '/billing' },
      { label: 'Account balance', path: '/billing' },
    ],
  },
  {
    label: 'Payments',
    path: '/payments',
    icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    sub: [
      { label: 'Pay invoices', path: '/pay' },
      { label: 'Payment history', path: '/payments' },
      { label: 'AutoPay settings', path: '/settings/autopay' },
    ],
  },
];

const accountLinks = [
  { label: 'Company details', path: '/account' },
  { label: 'Saved payment methods', path: '/account#payment-methods' },
  { label: 'Notification settings', path: '/settings/notifications' },
  { label: 'User preferences', path: '/account#preferences' },
  { label: 'Dealer admin', path: '/admin' },
];

function PortalShell() {
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [previewRev, setPreviewRev] = useState(0);
  const location = useLocation();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const adminPreview = useMemo(() => {
    void location.pathname;
    void previewRev;
    if (typeof sessionStorage === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem(ADMIN_PREVIEW_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [location.pathname, previewRev]);

  const dismissAdminPreview = () => {
    try {
      sessionStorage.removeItem(ADMIN_PREVIEW_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setPreviewRev((r) => r + 1);
  };

  const isActiveSection = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const toggleSection = (path) => {
    setExpandedSection((prev) => (prev === path ? null : path));
  };

  return (
    <div className="portal-shell">
      <aside className={`portal-sidebar ${sidebarCollapsed ? 'portal-sidebar-collapsed' : ''} ${mobileMenuOpen ? 'portal-sidebar-mobile-open' : ''}`}>
        <div className="portal-sidebar-header">
          <Link to="/" className="portal-sidebar-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/summit-logo-header.png" alt={dealer.name} className="portal-sidebar-logo-img" />
          </Link>
          <div className="portal-sidebar-header-actions">
            <button
              type="button"
              className="portal-sidebar-close-mobile"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <nav className="portal-sidebar-nav" aria-label="Main navigation">
          {navSections.map((section) => (
            <div
              key={section.path}
              className="portal-nav-section"
              onMouseEnter={() => {
                if (!sidebarCollapsed && section.sub) {
                  setExpandedSection(section.path);
                }
              }}
              onMouseLeave={() => {
                if (!sidebarCollapsed && section.sub) {
                  setExpandedSection(null);
                }
              }}
            >
              {section.sub && !sidebarCollapsed ? (
                <>
                  <div
                    className={`portal-nav-item-wrapper portal-nav-item-wrapper-with-dropdown ${
                      expandedSection === section.path ? 'portal-nav-item-wrapper-open' : ''
                    }`}
                  >
                    <NavLink
                      to={section.path}
                      end={section.path === '/'}
                      className={({ isActive }) =>
                        `portal-nav-item ${isActive ? 'portal-nav-item-active' : ''} ${isActiveSection(section.path) ? 'portal-nav-item-active' : ''}`
                      }
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="portal-nav-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d={section.icon} />
                        </svg>
                      </span>
                      <span className="portal-nav-label">{section.label}</span>
                      <span className="portal-nav-chevron-wrap">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className={expandedSection === section.path ? 'portal-nav-chevron-open' : ''}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </span>
                    </NavLink>
                  </div>
                  <div className={`portal-nav-dropdown ${expandedSection === section.path ? 'portal-nav-dropdown-open' : ''}`}>
                    <ul className="portal-nav-sub">
                      {section.sub.map((sub) => (
                        <li key={sub.path + sub.label}>
                          <Link
                            to={sub.path}
                            className="portal-nav-sub-link"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setExpandedSection(null);
                            }}
                          >
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <NavLink
                  to={section.path}
                  end={section.path === '/'}
                  className={({ isActive }) =>
                    `portal-nav-item ${isActive ? 'portal-nav-item-active' : ''} ${isActiveSection(section.path) ? 'portal-nav-item-active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="portal-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={section.icon} />
                    </svg>
                  </span>
                  {!sidebarCollapsed && <span className="portal-nav-label">{section.label}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        <div className="portal-sidebar-notifications">
          <button
            type="button"
            className={`portal-notifications-trigger ${notificationOpen ? 'portal-notifications-trigger-open' : ''}`}
            onClick={() => setNotificationOpen((o) => !o)}
            aria-expanded={notificationOpen}
            aria-label={notificationOpen ? 'Close notifications' : 'Open notifications'}
          >
            <span className="portal-notifications-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && <span className="portal-notifications-badge">{unreadCount}</span>}
            </span>
            {!sidebarCollapsed && <span className="portal-notifications-label">Notifications</span>}
            {!sidebarCollapsed && (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`portal-notifications-chevron ${notificationOpen ? 'portal-notifications-chevron-open' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </button>
          {notificationOpen && (
            <div className="portal-sidebar-notification-backdrop" aria-hidden onClick={() => setNotificationOpen(false)} />
          )}
          <div className={`portal-sidebar-notification-dropdown ${notificationOpen ? 'portal-sidebar-notification-dropdown-open' : ''}`}>
            <div className="portal-sidebar-notification-dropdown-header">Notifications</div>
            <div className="portal-sidebar-notification-list">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`portal-sidebar-notification-item ${!n.read ? 'portal-sidebar-notification-item-unread' : ''}`}
                  onClick={() => setNotificationOpen(false)}
                >
                  <div className="portal-sidebar-notification-item-title">{n.title}</div>
                  <div className="portal-sidebar-notification-item-message">{n.message}</div>
                  <div className="portal-sidebar-notification-item-time">{n.time}</div>
                </button>
              ))}
            </div>
            <div className="portal-sidebar-notification-dropdown-footer">
              <Link to="/settings/notifications" onClick={() => setNotificationOpen(false)}>
                Manage notification settings
              </Link>
            </div>
          </div>
        </div>
        <div className="portal-sidebar-account">
          <button
            type="button"
            className="portal-account-trigger"
            onClick={() => setAccountDropdownOpen((o) => !o)}
            aria-expanded={accountDropdownOpen}
            aria-label={accountDropdownOpen ? 'Close account menu' : 'Open account menu'}
          >
            <div className="portal-account-avatar">
              {customer.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
            </div>
            {!sidebarCollapsed && (
              <div className="portal-account-labels">
                <span className="portal-account-name">{customer.name}</span>
                <span className="portal-account-company">{customer.company}</span>
              </div>
            )}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`portal-account-chevron ${accountDropdownOpen ? 'portal-account-chevron-open' : ''}`}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
          <div className={`portal-account-dropdown ${accountDropdownOpen ? 'portal-account-dropdown-open' : ''}`}>
            <ul className="portal-account-links">
              {accountLinks.map((link) => (
                <li key={link.path + link.label}>
                  <Link
                    to={link.path}
                    className="portal-account-link"
                    onClick={() => {
                      setAccountDropdownOpen(false);
                      setMobileMenuOpen(false);
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="portal-sidebar-collapse-wrap">
          <button
            type="button"
            className="portal-sidebar-toggle"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={sidebarCollapsed ? 'portal-sidebar-collapse-icon-expand' : ''}
            >
              <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="portal-main-wrap">
        {adminPreview?.label && (
          <div className="portal-admin-preview-banner" role="status">
            <span>
              Viewing as <strong>{adminPreview.label}</strong>
              {adminPreview.accountId && <span className="portal-admin-preview-meta"> · {adminPreview.accountId}</span>} (preview)
            </span>
            <div className="portal-admin-preview-actions">
              <Link to="/admin" className="portal-admin-preview-link" onClick={dismissAdminPreview}>
                Back to admin
              </Link>
              <button type="button" className="portal-admin-preview-dismiss" onClick={dismissAdminPreview}>
                Dismiss
              </button>
            </div>
          </div>
        )}
        <button
          type="button"
          className="portal-mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
        <main className="portal-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default PortalShell;
