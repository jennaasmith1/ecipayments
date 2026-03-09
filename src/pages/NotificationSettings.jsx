import { useState } from 'react';
import { customer } from '../data/fakeData';
import './NotificationSettings.css';

function TeamsLogo({ className }) {
  return (
    <span className="teams-logo-bg">
      <img
        src="/teams-logo.png"
        alt=""
        className={className}
        aria-hidden
      />
    </span>
  );
}

function SlackLogo({ className }) {
  return (
    <img
      src="/slack-logo.png"
      alt=""
      className={className}
      aria-hidden
    />
  );
}

const billingNotifications = [
  { id: 'new_invoice', label: 'New invoice available', desc: 'When a new invoice is ready to view' },
  { id: 'payment_reminder', label: 'Payment reminders', desc: 'Reminders before due date' },
  { id: 'overdue', label: 'Invoice overdue alerts', desc: 'When an invoice is past due' },
  { id: 'payment_confirm', label: 'Payment confirmation', desc: 'After a payment is processed' },
  { id: 'autopay', label: 'AutoPay processed', desc: 'When AutoPay runs successfully' },
];

const serviceNotifications = [
  { id: 'ticket_update', label: 'Service ticket updates', desc: 'Status changes on your tickets' },
  { id: 'technician', label: 'Technician scheduled', desc: 'When a visit is scheduled' },
  { id: 'completed', label: 'Service completed', desc: 'When work is finished' },
];

const displayChannels = [
  { id: 'email', label: 'Email' },
  { id: 'sms', label: 'SMS' },
  { id: 'portal', label: 'In-portal' },
  { id: 'teams', label: 'Microsoft Teams' },
];

function getInitialSelections(notifications) {
  const s = {};
  notifications.forEach((n) => {
    s[n.id] = { email: true, sms: false, portal: true, teams: true };
  });
  return s;
}

function NotificationTable({ notifications, selections, setSelections, integrations, onToggleIntegration }) {
  const toggleSelection = (notificationId, channelId) => {
    setSelections((prev) => ({
      ...prev,
      [notificationId]: {
        ...prev[notificationId],
        [channelId]: !prev[notificationId][channelId],
      },
    }));
  };

  const selectAllForChannel = (list, channelId, value) => {
    setSelections((prev) => {
      const next = { ...prev };
      list.forEach((n) => {
        next[n.id] = { ...next[n.id], [channelId]: value };
      });
      return next;
    });
  };

  const isColumnAllSelected = (list, channelId) =>
    list.length > 0 && list.every((n) => selections[n.id] && selections[n.id][channelId]);

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
                    checked={ch.id === 'teams' && !integrations.teams ? false : isColumnAllSelected(notifications, ch.id)}
                    onChange={() => selectAllForChannel(notifications, ch.id, !isColumnAllSelected(notifications, ch.id))}
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
                    checked={!!(selections[item.id] && selections[item.id][ch.id])}
                    onChange={() => toggleSelection(item.id, ch.id)}
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

const allNotifications = [...billingNotifications, ...serviceNotifications];

export default function NotificationSettings() {
  const [integrations, setIntegrations] = useState({ teams: true, slack: false });
  const [selections, setSelections] = useState(() => getInitialSelections(allNotifications));
  const onToggleIntegration = (key) => setIntegrations((i) => ({ ...i, [key]: !i[key] }));

  return (
    <div className="notification-settings">
      <h1>Notification Settings</h1>
      <p className="subtitle">Choose how and where you receive notifications.</p>

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
                <span className="connected-account-value">Connected as {customer.name}</span>
                <button type="button" className="btn-disconnect" onClick={() => onToggleIntegration('teams')}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button type="button" className="btn-connect" onClick={() => onToggleIntegration('teams')}>
                Connect Teams
              </button>
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
                <button type="button" className="btn-disconnect" onClick={() => onToggleIntegration('slack')}>
                  Disconnect
                </button>
              </div>
            ) : (
              <button type="button" className="btn-connect" onClick={() => onToggleIntegration('slack')}>
                Connect Slack
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="settings-card">
        <h2>Billing & Payments</h2>
        <NotificationTable
          notifications={billingNotifications}
          selections={selections}
          setSelections={setSelections}
          integrations={integrations}
          onToggleIntegration={onToggleIntegration}
        />
      </div>

      <div className="settings-card">
        <h2>Service & Equipment</h2>
        <NotificationTable
          notifications={serviceNotifications}
          selections={selections}
          setSelections={setSelections}
          integrations={integrations}
          onToggleIntegration={onToggleIntegration}
        />
      </div>
    </div>
  );
}
