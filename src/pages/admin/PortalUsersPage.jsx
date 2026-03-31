import { globalPortalUsers } from '../../data/adminMockData';
import './adminPages.css';

export default function PortalUsersPage() {
  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Portal users</h1>
        <p className="admin-page-subtitle">Customer logins across accounts (demo).</p>
      </header>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Account</th>
            </tr>
          </thead>
          <tbody>
            {globalPortalUsers.map((u) => (
              <tr key={u.id} className={u.duplicate ? 'admin-row-warn' : ''}>
                <td>{u.name}</td>
                <td>
                  {u.email}
                  {u.duplicate && <span className="admin-dup-flag" title="Duplicate" />}
                </td>
                <td>{u.account}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
