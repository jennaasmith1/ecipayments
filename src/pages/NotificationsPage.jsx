import { Link } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import './NotificationsPage.css';

function groupByReadStatus(list) {
  const unread = list.filter((n) => !n.read);
  const read = list.filter((n) => n.read);
  return { unread, read };
}

export default function NotificationsPage() {
  const { notifications } = usePortalProfile();
  const settingsPath = usePortalPath('/settings/notifications');
  const billingPath = usePortalPath('/billing');
  const { unread, read } = groupByReadStatus(notifications);
  const hasAny = notifications.length > 0;

  return (
    <div className="notifications-page">
      <header className="notifications-page-header">
        <div>
          <h1 className="notifications-page-title">Notifications</h1>
          <p className="notifications-page-subtitle">
            Review recent billing, payment, and service updates for your account.
          </p>
        </div>
        <Link to={settingsPath} className="notifications-page-settings-link">
          Notification settings
        </Link>
      </header>

      {!hasAny && (
        <div className="notifications-page-empty">
          <p>You don&apos;t have any notifications yet.</p>
          <p className="notifications-page-empty-secondary">
            When there&apos;s activity on your account, it will show up here.
          </p>
          <Link to={billingPath} className="notifications-page-empty-cta">
            Go to billing
          </Link>
        </div>
      )}

      {hasAny && (
        <div className="notifications-page-content">
          {unread.length > 0 && (
            <section className="notifications-page-section">
              <h2 className="notifications-page-section-title">Unread</h2>
              <ul className="notifications-page-list" aria-label="Unread notifications">
                {unread.map((n) => (
                  <li key={n.id} className="notifications-page-item notifications-page-item-unread">
                    <div className="notifications-page-item-main">
                      <div className="notifications-page-item-header">
                        <span className="notifications-page-item-dot" aria-hidden />
                        <span className="notifications-page-item-title">{n.title}</span>
                      </div>
                      <div className="notifications-page-item-message">{n.message}</div>
                    </div>
                    <div className="notifications-page-item-meta">
                      <span className="notifications-page-item-time">{n.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {read.length > 0 && (
            <section className="notifications-page-section">
              <h2 className="notifications-page-section-title">Earlier</h2>
              <ul className="notifications-page-list" aria-label="Earlier notifications">
                {read.map((n) => (
                  <li key={n.id} className="notifications-page-item">
                    <div className="notifications-page-item-main">
                      <div className="notifications-page-item-header">
                        <span className="notifications-page-item-title">{n.title}</span>
                      </div>
                      <div className="notifications-page-item-message">{n.message}</div>
                    </div>
                    <div className="notifications-page-item-meta">
                      <span className="notifications-page-item-time">{n.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
