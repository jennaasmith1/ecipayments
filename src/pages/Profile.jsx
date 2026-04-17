import { Link } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import './Profile.css';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function Profile() {
  const { user, customer } = usePortalProfile();
  const accountPath = usePortalPath('/account');
  const notifPath = usePortalPath('/settings/notifications');

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div className="profile-page">
      <header className="profile-header">
        <h1>My profile</h1>
        <p className="profile-subtitle">
          Manage your personal information, security settings, and preferences.
        </p>
      </header>

      {/* ── Identity banner ── */}
      <div className="profile-identity">
        <div className="profile-avatar">{initials}</div>
        <div className="profile-identity-info">
          <p className="profile-identity-name">
            {user.firstName} {user.lastName}
          </p>
          <p className="profile-identity-role">
            {user.jobTitle} · {customer.company}
          </p>
          <p className="profile-identity-meta">
            Member since {formatDate(user.memberSince)} · Last login{' '}
            {formatDateTime(user.lastLogin)}
          </p>
        </div>
        <span className="profile-badge profile-badge-info">{user.role}</span>
      </div>

      {/* ── Personal information ── */}
      <section className="profile-section">
        <div className="profile-section-head">
          <h2 className="profile-section-title">Personal information</h2>
          <button type="button" className="profile-btn profile-btn-sm">
            Edit
          </button>
        </div>
        <div className="profile-card">
          <dl className="profile-dl">
            <dt>First name</dt>
            <dd>{user.firstName}</dd>
            <dt>Last name</dt>
            <dd>{user.lastName}</dd>
            <dt>Email</dt>
            <dd>
              {user.email}
              {user.emailVerified ? (
                <span className="profile-badge profile-badge-success">Verified</span>
              ) : (
                <span className="profile-badge profile-badge-warning">Unverified</span>
              )}
            </dd>
            <dt>Phone</dt>
            <dd>{user.phone}</dd>
            <dt>Job title</dt>
            <dd>{user.jobTitle}</dd>
            <dt>Timezone</dt>
            <dd>{user.timezone.replace('_', ' ').replace('America/', '')}</dd>
            <dt>Language</dt>
            <dd>{user.language}</dd>
          </dl>
        </div>
      </section>

      {/* ── Login & security ── */}
      <section className="profile-section">
        <h2 className="profile-section-title">Login &amp; security</h2>
        <div className="profile-card">
          <div className="profile-security-rows">
            <div className="profile-security-row">
              <div>
                <div className="profile-security-label">Password</div>
                <div className="profile-security-desc">
                  Last changed over 90 days ago
                </div>
              </div>
              <div className="profile-security-right">
                <button type="button" className="profile-btn profile-btn-sm">
                  Change password
                </button>
              </div>
            </div>

            <div className="profile-security-row">
              <div>
                <div className="profile-security-label">
                  Two-factor authentication
                </div>
                <div className="profile-security-desc">
                  {user.twoFactorEnabled
                    ? 'Enabled via authenticator app'
                    : 'Add an extra layer of security to your account'}
                </div>
              </div>
              <div className="profile-security-right">
                {user.twoFactorEnabled ? (
                  <span className="profile-badge profile-badge-success">
                    Enabled
                  </span>
                ) : (
                  <button
                    type="button"
                    className="profile-btn profile-btn-sm profile-btn-primary"
                  >
                    Enable
                  </button>
                )}
              </div>
            </div>

            <div className="profile-security-row">
              <div>
                <div className="profile-security-label">Email address</div>
                <div className="profile-security-desc">
                  {user.email}
                </div>
              </div>
              <div className="profile-security-right">
                {user.emailVerified && (
                  <span className="profile-badge profile-badge-success">Verified</span>
                )}
                <button type="button" className="profile-btn profile-btn-sm">
                  Change email
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Active sessions ── */}
      <section className="profile-section">
        <h2 className="profile-section-title">Active sessions</h2>
        <div className="profile-card">
          <div className="profile-sessions-list">
            <div className="profile-session-row">
              <div>
                <div className="profile-session-device">Chrome on macOS</div>
                <div className="profile-session-detail">
                  San Francisco, CA · {formatDateTime(user.lastLogin)}
                </div>
              </div>
              <span className="profile-session-current">Current session</span>
            </div>
            <div className="profile-session-row">
              <div>
                <div className="profile-session-device">Safari on iPhone</div>
                <div className="profile-session-detail">
                  San Francisco, CA · Apr 15, 2026, 6:12 PM
                </div>
              </div>
              <button type="button" className="profile-btn profile-btn-sm">
                Revoke
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick links ── */}
      <section className="profile-section">
        <h2 className="profile-section-title">Related settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link to={accountPath} className="account-link-card">
            <span className="account-link-card-title">Company details</span>
            <span className="account-link-card-desc">
              Billing address, company info, and payment methods
            </span>
          </Link>
          <Link to={notifPath} className="account-link-card">
            <span className="account-link-card-title">Notification settings</span>
            <span className="account-link-card-desc">
              Email, SMS, and Teams/Slack preferences
            </span>
          </Link>
        </div>
      </section>

      {/* ── Deactivate ── */}
      <section className="profile-section profile-deactivate-section">
        <div className="profile-deactivate-row">
          <div className="profile-deactivate-info">
            <div className="profile-deactivate-label">Deactivate my account</div>
            <div className="profile-deactivate-desc">
              Permanently remove your access to this portal. Company data will
              not be affected.
            </div>
          </div>
          <button type="button" className="profile-btn profile-btn-sm profile-btn-danger-subtle">
            Deactivate account
          </button>
        </div>
      </section>
    </div>
  );
}
