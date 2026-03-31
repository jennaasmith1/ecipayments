import { useMemo, useState } from 'react';
import { auditEvents } from '../../data/adminMockData';
import './adminPages.css';

const FILTERS = ['All', 'Impersonation', 'Settings', 'User', 'Billing'];

export default function AuditActivity() {
  const [filter, setFilter] = useState('All');
  const [q, setQ] = useState('');

  const rows = useMemo(() => {
    let list = auditEvents;
    if (filter !== 'All') list = list.filter((e) => e.type === filter);
    const s = q.trim().toLowerCase();
    if (s) {
      list = list.filter(
        (e) =>
          e.actor.toLowerCase().includes(s) ||
          e.detail.toLowerCase().includes(s) ||
          e.account.toLowerCase().includes(s)
      );
    }
    return list;
  }, [filter, q]);

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Audit & activity</h1>
        <p className="admin-page-subtitle">Immutable-style log (demo data only).</p>
      </header>
      <div className="admin-card admin-audit-toolbar">
        <div className="admin-audit-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`admin-chip admin-filter-chip ${filter === f ? 'admin-filter-chip-on' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input className="admin-input" placeholder="Search actor, detail, account…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Type</th>
              <th>Detail</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((e) => (
              <tr key={e.id} className={e.type === 'Impersonation' ? 'admin-row-warn' : ''}>
                <td>{e.time}</td>
                <td>{e.actor}</td>
                <td>{e.type}</td>
                <td>{e.detail}</td>
                <td>{e.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
