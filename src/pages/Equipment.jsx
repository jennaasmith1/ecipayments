import { Link } from 'react-router-dom';
import { equipment, formatDate } from '../data/fakeData';
import './Equipment.css';

export default function Equipment() {
  return (
    <div className="equipment-page">
      <header className="equipment-header">
        <h1>Equipment</h1>
        <p className="equipment-subtitle">
          Manage your devices, submit meter readings, and request service.
        </p>
      </header>

      <div className="equipment-actions-bar">
        <Link to="/equipment#meter" className="equipment-btn equipment-btn-primary">
          Submit meter reading
        </Link>
        <Link to="/service#create" className="equipment-btn">
          Request service
        </Link>
        <Link to="/supplies" className="equipment-btn">
          Order supplies
        </Link>
      </div>

      <div className="equipment-table-wrap">
        <table className="equipment-table">
          <caption className="sr-only">Your equipment list</caption>
          <thead>
            <tr>
              <th>Device</th>
              <th>Model</th>
              <th>Serial number</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last meter read</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((device) => (
              <tr key={device.id} className={device.needsAttention ? 'equipment-row-attention' : ''}>
                <td>
                  <div className="equipment-device-name">{device.name}</div>
                  {device.needsAttention && (
                    <span className="equipment-badge equipment-badge-warning">Needs attention</span>
                  )}
                </td>
                <td>{device.model}</td>
                <td><code className="equipment-serial">{device.serialNumber}</code></td>
                <td>{device.location}</td>
                <td>
                  <span className={`equipment-status equipment-status-${device.status}`}>
                    {device.status === 'active' ? 'Active' : device.status}
                  </span>
                </td>
                <td>
                  {formatDate(device.lastMeterRead)}
                  <span className="equipment-meter-value"> ({device.lastMeterValue.toLocaleString()} {device.meterType})</span>
                </td>
                <td>
                  <div className="equipment-row-actions">
                    <Link to="/equipment#meter" className="equipment-link">Meter read</Link>
                    <Link to="/service#create" className="equipment-link">Service</Link>
                    <Link to="/supplies" className="equipment-link">Supplies</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
