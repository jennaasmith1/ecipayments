import { Link } from 'react-router-dom';

/**
 * Compact insights strip for admin list pages (demo copy).
 * Optional per-item `actions`: { id, label, to?, external?, variant?: 'secondary' | 'tertiary', disabled? }
 */
export default function AdminInsightsRail({ items }) {
  if (!items?.length) return null;

  function actionClass(variant) {
    const base = 'admin-insights-rail-btn';
    if (variant === 'tertiary') return `${base} admin-btn admin-btn-ghost`;
    return `${base} admin-btn`;
  }

  return (
    <section className="admin-insights-rail" aria-label="Insights">
      <div className="admin-insights-rail-aside">
        <span className="admin-insights-rail-icon" aria-hidden>
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </span>
        <span className="admin-insights-rail-heading">Insights</span>
      </div>
      <ul className="admin-insights-rail-grid">
        {items.map((ins) => (
          <li key={ins.id} className={`admin-insights-rail-item admin-insights-rail-item--${ins.tone}`}>
            <p className="admin-insights-rail-text">{ins.text}</p>
            {ins.actions?.length > 0 && (
              <div className="admin-insights-rail-actions">
                {ins.actions.map((a) => {
                  const cls = actionClass(a.variant);
                  if (a.disabled) {
                    return (
                      <button key={a.id} type="button" className={cls} disabled title="Demo only">
                        {a.label}
                      </button>
                    );
                  }
                  if (a.external && a.to) {
                    return (
                      <a key={a.id} href={a.to} className={cls} target="_blank" rel="noreferrer">
                        {a.label}
                      </a>
                    );
                  }
                  if (a.to) {
                    return (
                      <Link key={a.id} to={a.to} className={cls}>
                        {a.label}
                      </Link>
                    );
                  }
                  return (
                    <button key={a.id} type="button" className={cls} disabled title="Demo only">
                      {a.label}
                    </button>
                  );
                })}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
