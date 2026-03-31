import { useState } from 'react';
import { communicationsSettingsSeed } from '../../data/adminMockData';
import './adminPages.css';

export default function CommunicationsSettings() {
  const [banner, setBanner] = useState(communicationsSettingsSeed.bannerText);
  const [emailOn, setEmailOn] = useState(communicationsSettingsSeed.serviceUpdatesEmail);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Communications</h1>
        <p className="admin-page-subtitle">Banners and notifications customers see (prototype).</p>
      </header>
      <div className="admin-card">
        <div className="admin-form-row">
          <label htmlFor="banner">
            Portal banner
            <span className="admin-cx-badge">Affects portal</span>
          </label>
          <textarea id="banner" className="admin-textarea" value={banner} onChange={(e) => setBanner(e.target.value)} />
        </div>
        <div className="admin-form-row">
          <label htmlFor="meter-day">Meter reminder day of month</label>
          <input id="meter-day" className="admin-input" defaultValue={communicationsSettingsSeed.meterReminderDay} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">Service update emails</span>
          <input type="checkbox" checked={emailOn} onChange={(e) => setEmailOn(e.target.checked)} />
        </div>
        <p className="admin-field-hint">Banner text appears at the top of the customer portal when enabled.</p>
      </div>
    </div>
  );
}
