import { useState, useMemo } from 'react';
import { rolesCatalog, permissionMatrix, rolePermissionsSeed } from '../../data/adminMockData';
import './adminPages.css';
import './RolesPermissions.css';

export default function RolesPermissions() {
  const [selectedRoleId, setSelectedRoleId] = useState(rolesCatalog[0].id);
  const [grants, setGrants] = useState(() => ({ ...rolePermissionsSeed }));

  const keysForRole = useMemo(() => new Set(grants[selectedRoleId] ?? []), [grants, selectedRoleId]);

  const toggle = (key) => {
    setGrants((prev) => {
      const list = new Set(prev[selectedRoleId] ?? []);
      if (list.has(key)) list.delete(key);
      else list.add(key);
      return { ...prev, [selectedRoleId]: [...list] };
    });
  };

  return (
    <div className="admin-page">
      <header className="admin-page-header">
        <h1>Roles & permissions</h1>
        <p className="admin-page-subtitle">Concept matrix — changes are not saved (prototype).</p>
      </header>
      <div className="admin-roles-layout">
        <div className="admin-card admin-roles-list">
          <h2 className="admin-section-title">Roles</h2>
          <ul className="admin-role-pills">
            {rolesCatalog.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  className={`admin-role-pill ${selectedRoleId === r.id ? 'admin-role-pill-active' : ''}`}
                  onClick={() => setSelectedRoleId(r.id)}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
          {rolesCatalog
            .filter((r) => r.id === selectedRoleId)
            .map((r) => (
              <p key={r.id} className="admin-role-desc">
                {r.description}
              </p>
            ))}
        </div>
        <div className="admin-card">
          <h2 className="admin-section-title">Permissions for selected role</h2>
          <div className="admin-perm-list">
            {permissionMatrix.map((p) => (
              <label key={p.key} className="admin-perm-row">
                <span>{p.label}</span>
                <input type="checkbox" checked={keysForRole.has(p.key)} onChange={() => toggle(p.key)} />
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
