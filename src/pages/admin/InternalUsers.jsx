import { internalUsers } from '../../data/adminMockData';
import './adminPages.css';

export default function InternalUsers() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Internal users</h1>
        <p className="admin-page-subtitle">Ubeo internal team directory (demo).</p>
      </header>
      <div className="admin-actions-row" style={{ marginBottom: 16 }}>
        <button type="button" className="admin-btn admin-btn-primary">
          Invite user
        </button>
      </div>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Territory</th>
              <th>Last active</th>
            </tr>
          </thead>
          <tbody>
            {internalUsers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.role}</td>
                <td>{u.territory}</td>
                <td>{u.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
