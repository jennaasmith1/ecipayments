import { useState } from 'react';
import { Link } from 'react-router-dom';
import { adminUser, adminUserSessions } from '../../data/adminMockData';
import './adminPages.css';
import './AdminAccount.css';

const timezones = [
  { value: 'America/New_York', label: 'Eastern (ET)' },
  { value: 'America/Chicago', label: 'Central (CT)' },
  { value: 'America/Denver', label: 'Mountain (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific (PT)' },
  { value: 'America/Phoenix', label: 'Arizona (no DST)' },
  { value: 'Pacific/Honolulu', label: 'Hawaii (HT)' },
];

const landingPages = [
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'customers', label: 'Customers' },
  { value: 'service', label: 'Service queue' },
  { value: 'billing', label: 'Billing' },
  { value: 'orders', label: 'Orders' },
];

const densityOptions = [
  { value: 'comfortable', label: 'Comfortable' },
  { value: 'compact', label: 'Compact' },
];

export default function AdminAccount() {
  const [firstName, setFirstName] = useState(adminUser.firstName);
  const [lastName, setLastName] = useState(adminUser.lastName);
  const [email, setEmail] = useState(adminUser.email);
  const [phone, setPhone] = useState(adminUser.phone);
  const [mfaEnabled, setMfaEnabled] = useState(adminUser.mfaEnabled);
  const [timezone, setTimezone] = useState(adminUser.timezone);
  const [landingPage, setLandingPage] = useState(adminUser.defaultLandingPage);
  const [density, setDensity] = useState(adminUser.tableDensity);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const initials = `${firstName[0] ?? ''}${lastName[0] ?? ''}`.toUpperCase();

  return (
    <div className="admin-page aa-account">
      <header className="admin-page-header">
        <h1>My profile</h1>
        <p className="admin-page-subtitle">Manage your personal information, security, and preferences.</p>
      </header>

      {/* ── Profile ── */}
      <div className="aa-card">
        <h2 className="aa-card-title">Profile</h2>
        <div className="aa-card-body">
          <div className="aa-profile-top">
            <div className="aa-avatar-area">
              <div className="aa-avatar">{initials}</div>
              <button type="button" className="admin-btn aa-avatar-btn" onClick={() => showToast('Photo upload coming soon')}>
                Change photo
              </button>
            </div>
            <div className="aa-profile-fields">
              <div className="aa-field-row aa-field-row--half">
                <div className="aa-field">
                  <label htmlFor="aa-first">First name</label>
                  <input id="aa-first" className="admin-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="aa-field">
                  <label htmlFor="aa-last">Last name</label>
                  <input id="aa-last" className="admin-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="aa-field">
                <label htmlFor="aa-email">Email address</label>
                <input id="aa-email" type="email" className="admin-input" value={email} onChange={(e) => setEmail(e.target.value)} />
                <span className="aa-field-hint">Changing your email will require re-verification.</span>
              </div>
              <div className="aa-field">
                <label htmlFor="aa-phone">Phone number</label>
                <input id="aa-phone" type="tel" className="admin-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="aa-field">
                <label>Role</label>
                <span className="aa-field-static">{adminUser.role}</span>
                <span className="aa-field-hint">Contact a platform admin to change your role.</span>
              </div>
            </div>
          </div>
          <div className="aa-card-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => showToast('Profile saved')}>
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* ── Security ── */}
      <div className="aa-card">
        <h2 className="aa-card-title">Security</h2>
        <div className="aa-card-body">
          <div className="aa-security-row">
            <div className="aa-security-label">
              <strong>Password</strong>
              <span>Last changed {adminUser.lastPasswordChange}</span>
            </div>
            <button type="button" className="admin-btn" onClick={() => showToast('Password reset email sent')}>
              Change password
            </button>
          </div>

          <div className="aa-security-row">
            <div className="aa-security-label">
              <strong>Two-factor authentication</strong>
              <span>{mfaEnabled ? `Enabled · ${adminUser.mfaMethod}` : 'Not enabled'}</span>
            </div>
            <button
              type="button"
              className={`admin-btn ${mfaEnabled ? '' : 'admin-btn-primary'}`}
              onClick={() => { setMfaEnabled((v) => !v); showToast(mfaEnabled ? '2FA disabled' : '2FA enabled'); }}
            >
              {mfaEnabled ? 'Disable' : 'Enable 2FA'}
            </button>
          </div>

          <div className="aa-security-row aa-security-row--sessions">
            <div className="aa-security-label">
              <strong>Active sessions</strong>
              <span>{adminUserSessions.length} devices signed in</span>
            </div>
            <button type="button" className="admin-btn aa-btn-danger-outline" onClick={() => showToast('All other sessions signed out')}>
              Sign out all others
            </button>
          </div>

          <div className="aa-sessions-list">
            {adminUserSessions.map((s) => (
              <div key={s.id} className="aa-session-row">
                <div className="aa-session-info">
                  <span className="aa-session-device">
                    {s.device}
                    {s.current && <span className="aa-session-badge">This device</span>}
                  </span>
                  <span className="aa-session-meta">{s.location} · {s.lastActive}</span>
                </div>
                {!s.current && (
                  <button type="button" className="aa-session-revoke" onClick={() => showToast(`Signed out ${s.device}`)}>
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Notifications link ── */}
      <div className="aa-card">
        <h2 className="aa-card-title">Notifications</h2>
        <div className="aa-card-body">
          <div className="aa-link-row">
            <div className="aa-security-label">
              <strong>Notification preferences</strong>
              <span>Choose channels and frequency for service, billing, portal, and equipment alerts</span>
            </div>
            <Link to="/admin/settings/notifications" className="admin-btn">
              Manage notifications
            </Link>
          </div>
        </div>
      </div>

      {/* ── Preferences ── */}
      <div className="aa-card">
        <h2 className="aa-card-title">Preferences</h2>
        <div className="aa-card-body">
          <div className="aa-pref-grid">
            <div className="aa-field">
              <label htmlFor="aa-tz">Time zone</label>
              <select id="aa-tz" className="admin-select" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>{tz.label}</option>
                ))}
              </select>
            </div>
            <div className="aa-field">
              <label htmlFor="aa-landing">Default landing page</label>
              <select id="aa-landing" className="admin-select" value={landingPage} onChange={(e) => setLandingPage(e.target.value)}>
                {landingPages.map((lp) => (
                  <option key={lp.value} value={lp.value}>{lp.label}</option>
                ))}
              </select>
            </div>
            <div className="aa-field">
              <label htmlFor="aa-density">Table density</label>
              <select id="aa-density" className="admin-select" value={density} onChange={(e) => setDensity(e.target.value)}>
                {densityOptions.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="aa-card-actions">
            <button type="button" className="admin-btn admin-btn-primary" onClick={() => showToast('Preferences saved')}>
              Save preferences
            </button>
          </div>
        </div>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
