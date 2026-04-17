import { useState } from 'react';
import { adminUser, adminNotificationCategories } from '../../data/adminMockData';
import './adminPages.css';
import './AdminNotificationSettings.css';

const displayChannels = [
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
  { id: 'inApp', label: 'In-app' },
  { id: 'teams', label: 'Microsoft Teams' },
];

function buildInitialSelections() {
  const s = {};
  for (const cat of adminNotificationCategories) {
    for (const item of cat.items) {
      s[item.id] = { email: true, sms: false, inApp: true, teams: false };
    }
  }
  return s;
}

function TeamsLogo({ className }) {
  return (
    <span className="teams-logo-bg">
      <img src="/teams-logo.png" alt="" className={className} aria-hidden />
    </span>
  );
}

function SlackLogo({ className }) {
  return <img src="/slack-logo.png" alt="" className={className} aria-hidden />;
}

function NotificationTable({ notifications, selections, setSelections, integrations, onToggleIntegration }) {
  const toggle = (itemId, chId) => {
    setSelections((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], [chId]: !prev[itemId][chId] },
    }));
  };

  const isAllSelected = (chId) =>
    notifications.every((n) => selections[n.id]?.[chId]);

  const selectAll = (chId, value) => {
    setSelections((prev) => {
      const next = { ...prev };
      notifications.forEach((n) => {
        next[n.id] = { ...next[n.id], [chId]: value };
      });
      return next;
    });
  };

  return (
    <table className="notification-table">
      <caption className="sr-only">Notification channels</caption>
      <thead>
        <tr>
          <th className="notification-table-col-label">Notification</th>
          {displayChannels.map((ch) => (
            <th key={ch.id} className="notification-table-col-channel">
              {ch.id === 'teams' && !integrations.teams ? (
                <button
                  type="button"
                  className="connect-integration connect-integration-in-table"
                  onClick={() => onToggleIntegration('teams')}
                >
                  <TeamsLogo className="channel-logo channel-logo-teams" />
                  Connect Teams
                </button>
              ) : (
                <label className="notification-table-header-label">
                  <span className="notification-table-header-text">{ch.label}</span>
                  <input
                    type="checkbox"
                    checked={ch.id === 'teams' && !integrations.teams ? false : isAllSelected(ch.id)}
                    onChange={() => selectAll(ch.id, !isAllSelected(ch.id))}
                    disabled={ch.id === 'teams' && !integrations.teams}
                    aria-label={`Select all ${ch.label}`}
                  />
                </label>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {notifications.map((item) => (
          <tr key={item.id}>
            <td className="notification-table-col-label">
              <div className="notification-table-cell-label">
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </div>
            </td>
            {displayChannels.map((ch) => (
              <td key={ch.id} className="notification-table-col-channel">
                {ch.id === 'teams' && !integrations.teams ? (
                  <span className="notification-table-cell-empty">—</span>
                ) : (
                  <input
                    type="checkbox"
                    checked={!!(selections[item.id]?.[ch.id])}
                    onChange={() => toggle(item.id, ch.id)}
                    aria-label={`${item.label}, ${ch.label}`}
                  />
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function AdminNotificationSettings() {
  const [integrations, setIntegrations] = useState({ teams: true, slack: false });
  const [selections, setSelections] = useState(buildInitialSelections);
  const [digest, setDigest] = useState('realtime');
  const [toast, setToast] = useState(null);
  const onToggleIntegration = (key) => setIntegrations((i) => ({ ...i, [key]: !i[key] }));

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  return (
    <div className="admin-notif-settings">
      <h1>Notification settings</h1>
      <p className="subtitle">Choose how and where you receive notifications.</p>

      <div className="settings-card">
        <h2>Delivery preference</h2>
        <div className="ans-digest-row">
          <div className="ans-digest-info">
            <strong>Frequency</strong>
            <span>Receive notifications in real time or as a digest</span>
          </div>
          <div className="ans-digest-options">
            <label className="ans-digest-option">
              <input type="radio" name="digest" value="realtime" checked={digest === 'realtime'} onChange={() => setDigest('realtime')} />
              Real-time
            </label>
            <label className="ans-digest-option">
              <input type="radio" name="digest" value="daily" checked={digest === 'daily'} onChange={() => setDigest('daily')} />
              Daily digest
            </label>
            <label className="ans-digest-option">
              <input type="radio" name="digest" value="weekly" checked={digest === 'weekly'} onChange={() => setDigest('weekly')} />
              Weekly digest
            </label>
          </div>
        </div>
      </div>

      <div className="settings-card connected-accounts">
        <h2>Connected accounts</h2>
        <div className="connected-accounts-list">
          <div className="connected-account-row">
            <div className="connected-account-channel">
              <TeamsLogo className="connected-account-logo channel-logo-teams" />
              <span className="connected-account-label">Microsoft Teams</span>
            </div>
            {integrations.teams ? (
              <div className="connected-account-right">
                <span className="connected-account-value">Connected as {adminUser.name}</span>
                <button type="button" className="btn-disconnect" onClick={() => onToggleIntegration('teams')}>Disconnect</button>
              </div>
            ) : (
              <button type="button" className="btn-connect" onClick={() => onToggleIntegration('teams')}>Connect Teams</button>
            )}
          </div>
          <div className="connected-account-row">
            <div className="connected-account-channel">
              <SlackLogo className="connected-account-logo" />
              <span className="connected-account-label">Slack</span>
            </div>
            {integrations.slack ? (
              <div className="connected-account-right">
                <span className="connected-account-value">Connected</span>
                <button type="button" className="btn-disconnect" onClick={() => onToggleIntegration('slack')}>Disconnect</button>
              </div>
            ) : (
              <button type="button" className="btn-connect" onClick={() => onToggleIntegration('slack')}>Connect Slack</button>
            )}
          </div>
        </div>
      </div>

      {adminNotificationCategories.map((cat) => (
        <div key={cat.id} className="settings-card">
          <h2>{cat.label}</h2>
          <NotificationTable
            notifications={cat.items}
            selections={selections}
            setSelections={setSelections}
            integrations={integrations}
            onToggleIntegration={onToggleIntegration}
          />
        </div>
      ))}

      <div className="ans-save-bar">
        <button type="button" className="admin-btn admin-btn-primary" onClick={() => showToast('Notification preferences saved')}>
          Save preferences
        </button>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}
