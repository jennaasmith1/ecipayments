import { Link } from 'react-router-dom';
import {
  dashboardKpis,
  dashboardAttentionQueue,
  adminActivityFeed,
  chartSeriesWeekly,
} from '../../data/adminMockData';
import './adminPages.css';
import './AdminDashboard.css';

const maxTickets = Math.max(...chartSeriesWeekly.map((d) => d.tickets), 1);
const maxLogins = Math.max(...chartSeriesWeekly.map((d) => d.logins), 1);

export default function AdminDashboard() {
  return (
    <div className="admin-page admin-dashboard">
      <header className="admin-page-header">
        <h1>Overview</h1>
        <p className="admin-page-subtitle">Support queue and portal health for {new Date().getFullYear()}.</p>
      </header>

      <div className="admin-kpi-grid">
        {dashboardKpis.map((k) => (
          <div
            key={k.id}
            className={`admin-kpi-card ${k.empty ? 'admin-kpi-card-empty' : ''}`}
          >
            <p className="admin-kpi-label">{k.label}</p>
            {k.empty ? (
              <>
                <p className="admin-kpi-value admin-kpi-value-empty">—</p>
                <p className="admin-kpi-meta">No items</p>
              </>
            ) : (
              <>
                <p className="admin-kpi-value">{k.value}</p>
                <p className="admin-kpi-meta">{k.meta}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="admin-dashboard-two">
        <section className="admin-card admin-attention">
          <h2 className="admin-section-title">Customers needing attention</h2>
          <ul className="admin-attention-list">
            {dashboardAttentionQueue.map((a) => (
              <li key={a.id}>
                <Link to={`/admin/customers/${a.customerId}`} className="admin-attention-link">
                  <span className={`admin-attention-sev admin-attention-sev-${a.severity}`} aria-hidden />
                  <span>
                    <strong>{a.company}</strong>
                    <span className="admin-attention-snippet">{a.snippet}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-card admin-chart-card">
          <h2 className="admin-section-title">Tickets vs portal logins (week)</h2>
          <div className="admin-chart-dual">
            <div>
              <p className="admin-chart-legend">Tickets opened</p>
              <div className="admin-mini-chart" role="img" aria-label="Bar chart tickets by day">
                {chartSeriesWeekly.map((d) => (
                  <div key={d.label} className="admin-mini-bar-wrap">
                    <div className="admin-mini-bar" title={`${d.label}: ${d.tickets}`}>
                      <div className="admin-mini-bar-inner" style={{ height: `${(d.tickets / maxTickets) * 100}%` }} />
                    </div>
                    <span className="admin-mini-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="admin-chart-legend">Portal logins</p>
              <div className="admin-mini-chart admin-mini-chart-teal" role="img" aria-label="Bar chart logins by day">
                {chartSeriesWeekly.map((d) => (
                  <div key={d.label} className="admin-mini-bar-wrap">
                    <div className="admin-mini-bar admin-mini-bar-teal" title={`${d.label}: ${d.logins}`}>
                      <div
                        className="admin-mini-bar-inner admin-mini-bar-inner-teal"
                        style={{ height: `${(d.logins / maxLogins) * 100}%` }}
                      />
                    </div>
                    <span className="admin-mini-label">{d.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="admin-card admin-feed-section">
        <div className="admin-feed-head">
          <h2 className="admin-section-title" style={{ margin: 0 }}>
            Recent activity
          </h2>
          <Link to="/admin/audit">View all</Link>
        </div>
        <ul className="admin-feed-list">
          {adminActivityFeed.map((item) => (
            <li key={item.id} className="admin-feed-item">
              <span className={`admin-feed-dot admin-feed-dot-${item.type}`} aria-hidden />
              <div>
                <div className="admin-feed-title">{item.title}</div>
                <div className="admin-feed-detail">{item.detail}</div>
                <div className="admin-feed-time">{item.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
