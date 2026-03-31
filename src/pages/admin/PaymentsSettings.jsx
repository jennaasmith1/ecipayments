import { useState } from 'react';
import { paymentsSettingsSeed } from '../../data/adminMockData';
import './adminPages.css';

export default function PaymentsSettings() {
  const [ach, setAch] = useState(paymentsSettingsSeed.achEnabled);
  const [card, setCard] = useState(paymentsSettingsSeed.cardEnabled);
  const [saved, setSaved] = useState(paymentsSettingsSeed.showSavedMethods);
  const [pdf, setPdf] = useState(paymentsSettingsSeed.pdfDownload);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Payments & invoice experience</h1>
        <p className="admin-page-subtitle">How customers pay and view bills (prototype).</p>
      </header>
      <div className="admin-card">
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">
            ACH enabled
            <span className="admin-cx-badge">Affects portal</span>
          </span>
          <input type="checkbox" checked={ach} onChange={(e) => setAch(e.target.checked)} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">
            Cards enabled
            <span className="admin-cx-badge">Affects portal</span>
          </span>
          <input type="checkbox" checked={card} onChange={(e) => setCard(e.target.checked)} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">Saved payment methods</span>
          <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">Invoice PDF download</span>
          <input type="checkbox" checked={pdf} onChange={(e) => setPdf(e.target.checked)} />
        </div>
        <p className="admin-field-hint" style={{ marginTop: 12 }}>
          Customers will see payment options on Pay now and Billing.
        </p>
      </div>
    </div>
  );
}
