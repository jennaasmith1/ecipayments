import { useState } from 'react';
import { Link } from 'react-router-dom';
import { serviceTickets, equipment, formatDate } from '../data/fakeData';
import './Service.css';

export default function Service() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const openTickets = serviceTickets.filter((t) => t.status !== 'completed');

  const getStatusClass = (status) => {
    switch (status) {
      case 'scheduled':
        return 'service-status-scheduled';
      case 'in_progress':
        return 'service-status-progress';
      case 'completed':
        return 'service-status-completed';
      default:
        return '';
    }
  };

  return (
    <div className="service-page">
      <header className="service-header">
        <h1>Service</h1>
        <p className="service-subtitle">
          Create and track service requests for your equipment.
        </p>
      </header>

      <div className="service-actions-bar">
        <button
          type="button"
          className="service-btn service-btn-primary"
          onClick={() => setShowCreateForm((v) => !v)}
        >
          {showCreateForm ? 'Cancel' : 'Create service ticket'}
        </button>
      </div>

      {showCreateForm && (
        <section className="service-create-card" id="create">
          <h2>New service request</h2>
          <form className="service-form" onSubmit={(e) => e.preventDefault()}>
            <label className="service-form-label">
              Device
              <select className="service-form-select">
                {equipment.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} – {d.location}</option>
                ))}
              </select>
            </label>
            <label className="service-form-label">
              Subject
              <input type="text" className="service-form-input" placeholder="e.g. Paper jam, Toner low" />
            </label>
            <label className="service-form-label">
              Description
              <textarea className="service-form-textarea" rows={3} placeholder="Describe the issue..." />
            </label>
            <div className="service-form-actions">
              <button type="submit" className="service-btn service-btn-primary">
                Submit ticket
              </button>
              <button type="button" className="service-btn" onClick={() => setShowCreateForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="service-tickets-section">
        <h2 className="service-section-title">Service tickets</h2>
        <div className="service-tickets-list">
          {serviceTickets.map((ticket) => (
            <div key={ticket.id} className="service-ticket-card">
              <div className="service-ticket-header">
                <span className="service-ticket-id">{ticket.id}</span>
                <span className={`service-ticket-status ${getStatusClass(ticket.status)}`}>
                  {ticket.statusLabel}
                </span>
              </div>
              <h3 className="service-ticket-subject">{ticket.subject}</h3>
              <p className="service-ticket-device">{ticket.deviceName}</p>
              <p className="service-ticket-desc">{ticket.description}</p>
              <div className="service-ticket-meta">
                <span>Created {formatDate(ticket.createdAt)}</span>
                {ticket.scheduledDate && (
                  <span>Technician scheduled: {formatDate(ticket.scheduledDate)}</span>
                )}
                {ticket.completedDate && (
                  <span>Completed: {formatDate(ticket.completedDate)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
