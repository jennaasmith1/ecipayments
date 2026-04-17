import { useState, useRef, useEffect, useCallback } from 'react';
import { usePortalProfile } from '../context/PortalProfileContext';
import './Team.css';

const STATUS_CHIP = {
  active: { label: 'Active', cls: 'team-chip-active' },
  invited: { label: 'Invited', cls: 'team-chip-invited' },
  deactivated: { label: 'Deactivated', cls: '' },
};

function initials(first, last) {
  return `${first[0]}${last[0]}`;
}

function timeAgo(iso) {
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Action menu (three-dot) ── */
function ActionMenu({ member, onClose, onAction }) {
  const ref = useRef(null);
  const [openUp, setOpenUp] = useState(false);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 8) setOpenUp(true);
    }
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = [];
  if (member.status === 'active') {
    items.push({ label: 'Change role', action: 'role' });
    items.push({ label: 'Remove from team', action: 'remove', danger: true });
  } else if (member.status === 'invited') {
    items.push({ label: 'Resend invite', action: 'resend' });
    items.push({ label: 'Revoke invite', action: 'revoke', danger: true });
  }

  return (
    <ul className={`team-action-menu${openUp ? ' team-action-menu--up' : ''}`} ref={ref}>
      {items.map((it) => (
        <li key={it.action}>
          <button
            type="button"
            className={`team-action-menu-item${it.danger ? ' team-action-menu-danger' : ''}`}
            onClick={() => { onAction(it.action, member); onClose(); }}
          >
            {it.label}
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ── Invite modal ── */
function InviteModal({ roles, onClose, onInvite }) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [message, setMessage] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!email.trim()) return;
    onInvite({ email: email.trim(), role, message: message.trim() });
  }

  return (
    <div className="team-modal-backdrop" onClick={onClose}>
      <form
        className="team-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="team-modal-header">
          <h2>Invite teammate</h2>
          <button type="button" className="team-modal-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="team-modal-body">
          <div className="team-field">
            <label htmlFor="invite-email">Email address</label>
            <input
              ref={inputRef}
              id="invite-email"
              type="email"
              placeholder="colleague@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="team-field">
            <label>Role</label>
            <div className="team-role-options">
              {roles.map((r) => (
                <label
                  key={r.id}
                  className={`team-role-option${role === r.id ? ' team-role-option-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="invite-role"
                    value={r.id}
                    checked={role === r.id}
                    onChange={() => setRole(r.id)}
                  />
                  <div>
                    <div className="team-role-option-label">{r.name}</div>
                    <div className="team-role-option-desc">{r.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="team-field">
            <label htmlFor="invite-message">Personal message (optional)</label>
            <textarea
              id="invite-message"
              placeholder="Hey, join our service portal so you can..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={2}
            />
          </div>
        </div>

        <div className="team-modal-footer">
          <button type="button" className="team-btn team-btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="team-btn team-btn-primary" disabled={!email.trim()}>
            Send invite
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── Main page ── */
export default function Team() {
  const { customer, teamMembers: initialMembers, customerRoles } = usePortalProfile();
  const [members, setMembers] = useState(initialMembers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [openAction, setOpenAction] = useState(null);
  const [toast, setToast] = useState(null);

  const isAdmin = members.find((m) => m.isSelf)?.role === 'admin';
  const activeCount = members.filter((m) => m.status !== 'deactivated').length;

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }, []);

  function handleInvite({ email, role }) {
    const name = email.split('@')[0];
    const parts = name.split('.');
    const first = parts[0] ? parts[0][0].toUpperCase() + parts[0].slice(1) : '';
    const last = parts[1] ? parts[1][0].toUpperCase() + parts[1].slice(1) : '';
    setMembers((prev) => [
      ...prev,
      {
        id: `tm-new-${Date.now()}`,
        firstName: first || email,
        lastName: last || '',
        email,
        jobTitle: '',
        role,
        status: 'invited',
        lastActive: null,
        dateAdded: new Date().toISOString().slice(0, 10),
        isSelf: false,
      },
    ]);
    setInviteOpen(false);
    showToast(`Invite sent to ${email}`);
  }

  function handleAction(action, member) {
    if (action === 'resend') {
      showToast(`Invite resent to ${member.email}`);
    } else if (action === 'revoke') {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      showToast(`Invite for ${member.firstName} revoked`);
    } else if (action === 'remove') {
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      showToast(`${member.firstName} ${member.lastName} removed from team`);
    } else if (action === 'role') {
      const currentIdx = customerRoles.findIndex((r) => r.id === member.role);
      const nextRole = customerRoles[(currentIdx + 1) % customerRoles.length];
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, role: nextRole.id } : m))
      );
      showToast(`${member.firstName}'s role changed to ${nextRole.name}`);
    }
  }

  return (
    <div className="team-page">
      <header className="team-header">
        <div className="team-header-row">
          <div>
            <h1>Team</h1>
            <p className="team-subtitle">
              Manage who at {customer.company} can access this portal.
            </p>
            <p className="team-seat-count">{activeCount} active member{activeCount !== 1 ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <button
              type="button"
              className="team-btn team-btn-primary"
              onClick={() => setInviteOpen(true)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Invite teammate
            </button>
          )}
        </div>
      </header>

      <div className="team-list">
        {members.length === 0 && (
          <div className="team-empty">No team members yet. Invite your first teammate to get started.</div>
        )}
        {members.map((m) => {
          const roleObj = customerRoles.find((r) => r.id === m.role);
          const statusMeta = STATUS_CHIP[m.status] || STATUS_CHIP.active;
          const isInvited = m.status === 'invited';

          return (
            <div key={m.id} className="team-member-row">
              <div className={`team-member-avatar${isInvited ? ' team-member-avatar-invited' : ''}`}>
                {initials(m.firstName, m.lastName || m.firstName)}
              </div>

              <div className="team-member-info">
                <div className="team-member-name">
                  {m.firstName} {m.lastName}
                  {m.isSelf && <span className="team-member-you">you</span>}
                </div>
                <div className="team-member-detail">
                  {m.email}
                  {m.jobTitle ? ` · ${m.jobTitle}` : ''}
                </div>
              </div>

              <div className="team-member-meta">
                <span className={`team-chip team-chip-${m.role}`}>
                  {roleObj?.name || m.role}
                </span>

                {isInvited ? (
                  <span className={`team-chip ${statusMeta.cls}`}>{statusMeta.label}</span>
                ) : (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', minWidth: 60, textAlign: 'right' }}>
                    {timeAgo(m.lastActive)}
                  </span>
                )}

                {isAdmin && !m.isSelf && (
                  <div className="team-action-wrap">
                    <button
                      type="button"
                      className="team-action-trigger"
                      aria-label={`Actions for ${m.firstName}`}
                      onClick={() => setOpenAction(openAction === m.id ? null : m.id)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>
                    </button>
                    {openAction === m.id && (
                      <ActionMenu
                        member={m}
                        onClose={() => setOpenAction(null)}
                        onAction={handleAction}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {inviteOpen && (
        <InviteModal
          roles={customerRoles}
          onClose={() => setInviteOpen(false)}
          onInvite={handleInvite}
        />
      )}

      {toast && <div className="team-toast">{toast}</div>}
    </div>
  );
}
