import { useState } from 'react';
import { serviceRequestSettingsSeed } from '../../data/adminMockData';
import './adminPages.css';

export default function ServiceRequestSettings() {
  const [poRequired, setPoRequired] = useState(serviceRequestSettingsSeed.poRequired);
  const [attachments, setAttachments] = useState(serviceRequestSettingsSeed.attachmentsAllowed);
  const [nonContract, setNonContract] = useState(serviceRequestSettingsSeed.showNonContractOption);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Service request settings</h1>
        <p className="admin-page-subtitle">Rules for customer-submitted tickets (prototype).</p>
      </header>
      <div className="admin-card">
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">
            Require PO on requests
            <span className="admin-cx-badge">Affects portal</span>
          </span>
          <input type="checkbox" checked={poRequired} onChange={(e) => setPoRequired(e.target.checked)} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">
            Allow attachments
            <span className="admin-cx-badge">Affects portal</span>
          </span>
          <input type="checkbox" checked={attachments} onChange={(e) => setAttachments(e.target.checked)} />
        </div>
        <div className="admin-toggle-row">
          <span className="admin-toggle-label">Show non-contract option</span>
          <input type="checkbox" checked={nonContract} onChange={(e) => setNonContract(e.target.checked)} />
        </div>
        <div className="admin-form-row" style={{ marginTop: 16 }}>
          <label htmlFor="def-type">Default request type</label>
          <select id="def-type" className="admin-select" defaultValue={serviceRequestSettingsSeed.defaultType}>
            <option>Break / fix</option>
            <option>Install / move</option>
            <option>Toner / supplies</option>
          </select>
          <p className="admin-field-hint">Customers will see this as the first option in the form.</p>
        </div>
      </div>
    </div>
  );
}
