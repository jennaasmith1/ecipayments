import { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { adminUser } from '../data/adminMockData';
import './AdminShell.css';
import './adminEciTheme.css';

const navSections = [
  {
    label: 'Overview',
    path: '/admin',
    end: true,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Customers',
    path: '/admin/customers',
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
  },
  {
    label: 'Service',
    path: '/admin/service',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9v2m0 0v2m0-2h6m-6 0H9',
  },
  {
    label: 'Equipment',
    path: '/admin/equipment',
    icon: 'M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z',
  },
  {
    label: 'Orders',
    path: '/admin/orders',
    icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
  },
  {
    label: 'Billing',
    path: '/admin/billing',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    label: 'Employees',
    path: '/admin/users/internal',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    sub: [
      { label: 'Internal users', path: '/admin/users/internal' },
      { label: 'Portal users', path: '/admin/users/portal' },
      { label: 'Roles & permissions', path: '/admin/users/roles' },
    ],
  },
  {
    label: 'Portal experience',
    path: '/admin/portal/branding',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    sub: [
      { label: 'Branding & content', path: '/admin/portal/branding' },
      { label: 'Service requests', path: '/admin/portal/service-requests' },
      { label: 'Payments & invoices', path: '/admin/portal/payments' },
      { label: 'Communications', path: '/admin/portal/communications' },
    ],
  },
  {
    label: 'Audit',
    path: '/admin/audit',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  {
    label: 'Intelligence Hub',
    path: '/admin/intelligence-hub',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
];

export default function AdminShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const location = useLocation();

  const isActiveSection = (path) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/';
    return location.pathname.startsWith(path);
  };

  const toggleSection = (path) => {
    // If this section is the active one (current route inside it), don't allow collapsing it
    if (isActiveSection(path)) {
      setExpandedSection(path);
      return;
    }
    setExpandedSection((prev) => (prev === path ? null : path));
  };

  // Keep dropdown open when a sub-route under a section is active
  useEffect(() => {
    const activeParent = navSections.find(
      (section) => section.sub && location.pathname.startsWith(section.path)
    );
    if (activeParent) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync admin submenu with active route
      setExpandedSection((prev) => (prev === activeParent.path ? prev : activeParent.path));
    }
  }, [location.pathname]);

  return (
    <div className="admin-shell">
      <aside
        className={`admin-sidebar ${sidebarCollapsed ? 'admin-sidebar-collapsed' : ''} ${mobileMenuOpen ? 'admin-sidebar-mobile-open' : ''}`}
      >
        <div className="admin-sidebar-header">
          <Link to="/admin" className="admin-sidebar-logo" onClick={() => setMobileMenuOpen(false)}>
            <img src="/eci-customer-hub.svg" alt="ECI Customer Hub" className="admin-sidebar-logo-img admin-sidebar-logo-img-eci" />
          </Link>
          <div className="admin-sidebar-header-actions">
            <button
              type="button"
              className="admin-sidebar-close-mobile"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <nav className="admin-sidebar-nav" aria-label="Admin navigation">
          {navSections.map((section) => (
            <div key={section.path} className="admin-nav-section">
              {section.sub && !sidebarCollapsed ? (
                <>
                  <NavLink
                    to={section.path}
                    end={section.end}
                    className={({ isActive }) =>
                      `admin-nav-item ${isActive || isActiveSection(section.path) ? 'admin-nav-item-active' : ''}`
                    }
                    onClick={() => {
                      setMobileMenuOpen(false);
                      toggleSection(section.path);
                    }}
                    aria-expanded={expandedSection === section.path}
                    aria-label={expandedSection === section.path ? 'Collapse submenu' : 'Expand submenu'}
                  >
                    <span className="admin-nav-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d={section.icon} />
                      </svg>
                    </span>
                    <span className="admin-nav-label">{section.label}</span>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className={`admin-nav-chevron ${expandedSection === section.path ? 'admin-nav-chevron-open' : ''}`}
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </NavLink>
                  <div className={`admin-nav-dropdown ${expandedSection === section.path ? 'admin-nav-dropdown-open' : ''}`}>
                    <ul className="admin-nav-sub">
                      {section.sub.map((sub) => (
                        <li key={sub.path + sub.label}>
                          <Link
                            to={sub.path}
                            className="admin-nav-sub-link"
                            onClick={() => {
                              setMobileMenuOpen(false);
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
                  end={section.end}
                  className={({ isActive }) =>
                    `admin-nav-item ${isActive || isActiveSection(section.path) ? 'admin-nav-item-active' : ''}`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="admin-nav-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d={section.icon} />
                    </svg>
                  </span>
                  {!sidebarCollapsed && <span className="admin-nav-label">{section.label}</span>}
                </NavLink>
              )}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar-account">
          <button
            type="button"
            className="admin-account-trigger"
            onClick={() => setAccountDropdownOpen((o) => !o)}
            aria-expanded={accountDropdownOpen}
            aria-label={accountDropdownOpen ? 'Close account menu' : 'Open account menu'}
          >
            <div className="admin-account-trigger-row">
              <div className="admin-account-avatar">
                {adminUser.name
                  .split(' ')
                  .map((w) => w[0])
                  .join('')
                  .slice(0, 2)}
              </div>
              {!sidebarCollapsed && (
                <div className="admin-account-labels">
                  <span className="admin-account-name">{adminUser.name}</span>
                  <span className="admin-account-role">{adminUser.role}</span>
                  <span className="admin-account-subtitle">{adminUser.email}</span>
                </div>
              )}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`admin-account-chevron ${accountDropdownOpen ? 'admin-account-chevron-open' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </button>
          <div className={`admin-account-dropdown ${accountDropdownOpen ? 'admin-account-dropdown-open' : ''}`}>
            <ul className="admin-account-links">
              <li>
                <Link to="/" className="admin-account-link" onClick={() => { setAccountDropdownOpen(false); setMobileMenuOpen(false); }}>
                  Open customer portal
                </Link>
              </li>
              <li>
                <Link to="/admin/audit" className="admin-account-link" onClick={() => { setAccountDropdownOpen(false); setMobileMenuOpen(false); }}>
                  Audit log
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="admin-sidebar-collapse-wrap">
          <button
            type="button"
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed((c) => !c)}
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={sidebarCollapsed ? 'admin-sidebar-collapse-icon-expand' : ''}
            >
              <path d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </aside>

      <div className="admin-main-wrap">
        <button
          type="button"
          className="admin-mobile-menu-trigger"
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
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
