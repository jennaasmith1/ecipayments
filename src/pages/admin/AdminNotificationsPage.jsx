import { Link } from 'react-router-dom';
import { adminNotifications } from '../../data/adminMockData';
import './adminPages.css';
import './AdminNotificationsPage.css';

function groupByReadStatus(list) {
  const unread = list.filter((n) => !n.read);
  const read = list.filter((n) => n.read);
  return { unread, read };
}

export default function AdminNotificationsPage() {
  const { unread, read } = groupByReadStatus(adminNotifications);
  const hasAny = adminNotifications.length > 0;

  return (
    <div className="admin-notifications-page">
      <header className="anp-header">
        <div>
          <h1 className="anp-title">Notifications</h1>
          <p className="anp-subtitle">
            Review recent service, billing, portal, and equipment alerts.
          </p>
        </div>
        <Link to="/admin/settings/notifications" className="anp-settings-link">
          Notification settings
        </Link>
      </header>

      {!hasAny && (
        <div className="anp-empty">
          <p>You don&apos;t have any notifications yet.</p>
          <p className="anp-empty-secondary">
            When there&apos;s activity on your accounts, it will show up here.
          </p>
        </div>
      )}

      {hasAny && (
        <div className="anp-content">
          {unread.length > 0 && (
            <section className="anp-section">
              <h2 className="anp-section-title">Unread</h2>
              <ul className="anp-list" aria-label="Unread notifications">
                {unread.map((n) => (
                  <li key={n.id} className="anp-item anp-item-unread">
                    <div className="anp-item-main">
                      <div className="anp-item-header">
                        <span className="anp-item-dot" aria-hidden />
                        <span className="anp-item-title">{n.title}</span>
                      </div>
                      <div className="anp-item-message">{n.message}</div>
                    </div>
                    <div className="anp-item-meta">
                      <span className="anp-item-time">{n.time}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {read.length > 0 && (
            <section className="anp-section">
              <h2 className="anp-section-title">Earlier</h2>
              <ul className="anp-list" aria-label="Earlier notifications">
                {read.map((n) => (
                  <li key={n.id} className="anp-item">
                    <div className="anp-item-main">
                      <div className="anp-item-header">
                        <span className="anp-item-title">{n.title}</span>
                      </div>
                      <div className="anp-item-message">{n.message}</div>
                    </div>
                    <div className="anp-item-meta">
                      <span className="anp-item-time">{n.time}</span>
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
