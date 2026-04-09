import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { adminUser } from '../../data/adminMockData';
import {
  intelligenceHubActivityInProgress,
  intelligenceHubActivityRecent,
  intelligenceHubKpis,
  intelligenceHubMarginLaborTrend,
  intelligenceHubNeedsReview,
  intelligenceHubQuickCommands,
  intelligenceHubScheduled,
  intelligenceHubServicePlan,
  intelligenceHubVanInventory,
} from '../../data/intelligenceHubMock';
import './adminPages.css';
import './IntelligenceHub.css';

function SparkleIcon({ className, ariaHidden = true }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden={ariaHidden}>
      <path d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  );
}

function severityLabel(severity) {
  if (severity === 'critical') return 'Critical risk';
  if (severity === 'warning') return 'Warning';
  return 'Opportunity';
}

function severityChipClass(severity) {
  if (severity === 'critical') return 'admin-chip admin-chip-danger';
  if (severity === 'warning') return 'admin-chip admin-chip-warn';
  return 'admin-chip intel-chip-opportunity';
}

export default function IntelligenceHub() {
  const [activityOpen, setActivityOpen] = useState(false);
  const activityCloseRef = useRef(null);
  const activityPanelId = useId();

  const firstName = adminUser.name.split(/\s+/)[0] ?? 'Your';

  const openActivity = useCallback(() => setActivityOpen(true), []);
  const closeActivity = useCallback(() => setActivityOpen(false), []);

  useEffect(() => {
    if (!activityOpen) return undefined;
    const id = requestAnimationFrame(() => {
      activityCloseRef.current?.focus();
    });
    return () => cancelAnimationFrame(id);
  }, [activityOpen]);

  useEffect(() => {
    if (!activityOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeActivity();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activityOpen, closeActivity]);

  const trendChart = intelligenceHubMarginLaborTrend;
  const maxY = 100;
  const chartW = 420;
  const chartH = 110;
  const padX = 8;
  const padY = 4;
  const innerW = chartW - padX * 2;
  const innerH = chartH - padY * 2;
  const n = trendChart.length;
  const xAt = (i) => padX + (innerW * i) / Math.max(n - 1, 1);
  const yAt = (v) => padY + innerH - (innerH * v) / maxY;

  const lineMargin = trendChart
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(d.margin).toFixed(1)}`)
    .join(' ');
  const lineLabor = trendChart
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xAt(i).toFixed(1)} ${yAt(d.labor).toFixed(1)}`)
    .join(' ');

  const maxVan = Math.max(...intelligenceHubVanInventory.map((v) => v.total), 1);

  return (
    <div
      className={`admin-page intelligence-hub ${activityOpen ? 'intelligence-hub--activity-open' : ''}`}
    >
      <header className="intelligence-hub-top">
        <div className="intelligence-hub-title-block">
          <h1 className="intelligence-hub-title">
            <span className="intelligence-hub-title-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </span>
            {firstName}&apos;s Intelligence Hub
          </h1>
          <p className="admin-page-subtitle intelligence-hub-subtitle">
            A prioritized view of risks, performance, and opportunities—so you can decide what to do next without
            digging through reports.
          </p>
        </div>
        <div className="intelligence-hub-actions">
          <span className="intelligence-hub-agent-pill">
            <span className="intelligence-hub-agent-dot" aria-hidden />
            AI agent active
          </span>
          <button
            type="button"
            className="intelligence-hub-activity-trigger"
            onClick={activityOpen ? closeActivity : openActivity}
            aria-expanded={activityOpen}
            aria-controls={activityPanelId}
          >
            Activity Center
            <svg
              className={`intelligence-hub-activity-chevron ${activityOpen ? 'intelligence-hub-activity-chevron--open' : ''}`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </header>

      {activityOpen && (
        <button
          type="button"
          className="intelligence-hub-backdrop"
          aria-label="Close Activity Center"
          onClick={closeActivity}
        />
      )}

      <div className="intelligence-hub-columns">
        <div className="intelligence-hub-main">
          <div className="intelligence-hub-row intelligence-hub-row-top">
            <section className="admin-card intelligence-hub-needs" aria-labelledby="intel-needs-heading">
              <div className="intelligence-hub-needs-head">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h2 id="intel-needs-heading" className="intelligence-hub-section-heading">
                  Needs review ({intelligenceHubNeedsReview.length})
                </h2>
              </div>
              <ul className="intelligence-hub-needs-list">
                {intelligenceHubNeedsReview.map((item) => (
                  <li key={item.id} className="intelligence-hub-need-card">
                    <div className="intelligence-hub-need-badges">
                      <span className={severityChipClass(item.severity)}>{severityLabel(item.severity)}</span>
                      {item.tags.map((t) => (
                        <span key={t} className="admin-chip admin-chip-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                    <p className="intelligence-hub-need-title">{item.title}</p>
                    <p className="intelligence-hub-need-body">{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="admin-card intelligence-hub-ask" aria-labelledby="intel-ask-heading">
              <h2 id="intel-ask-heading" className="intelligence-hub-ask-title">
                How can I help?
              </h2>
              <div className="intelligence-hub-ask-input" role="presentation">
                <SparkleIcon className="intelligence-hub-ask-sparkle" />
                <span className="intelligence-hub-ask-placeholder">Ask anything</span>
                <span className="intelligence-hub-ask-mic" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                    <path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8" />
                  </svg>
                </span>
              </div>
              <div className="intelligence-hub-quick">
                <div className="intelligence-hub-quick-label">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  Quick commands
                </div>
                <ul className="intelligence-hub-quick-list">
                  {intelligenceHubQuickCommands.map((q) => (
                    <li key={q.id} className="intelligence-hub-quick-item">
                      <span className="intelligence-hub-quick-cat">{q.category}</span>
                      <p className="intelligence-hub-quick-prompt">&ldquo;{q.prompt}&rdquo;</p>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          <div className="intelligence-hub-row intelligence-hub-row-mid">
            <section className="admin-card intelligence-hub-plan">
              <h2 className="admin-section-title">Service plan subscribers</h2>
              <div className="intelligence-hub-donut-wrap">
                <div
                  className="intelligence-hub-donut"
                  style={{
                    background: `conic-gradient(var(--intel-donut-premium, #6b5b95) 0 ${intelligenceHubServicePlan.premiumPct}%, var(--color-border-light) ${intelligenceHubServicePlan.premiumPct}% 100%)`,
                  }}
                  role="img"
                  aria-label={`Premium ${intelligenceHubServicePlan.premiumPct} percent, Basic ${intelligenceHubServicePlan.basicPct} percent`}
                />
                <div className="intelligence-hub-donut-legend">
                  <p>
                    <strong>{intelligenceHubServicePlan.premiumPct}%</strong> ({intelligenceHubServicePlan.premiumCount}){' '}
                    Premium plan
                  </p>
                  <p>
                    <strong>{intelligenceHubServicePlan.basicPct}%</strong> ({intelligenceHubServicePlan.basicCount}) Basic
                    plan
                  </p>
                </div>
              </div>
              <div className="intelligence-hub-ai-callout">
                <SparkleIcon className="intelligence-hub-ai-callout-icon" />
                <p>{intelligenceHubServicePlan.aiSuggestion}</p>
              </div>
            </section>

            <section className="admin-card intelligence-hub-kpis" aria-labelledby="intel-kpi-heading">
              <h2 id="intel-kpi-heading" className="admin-section-title">
                Business pulse
              </h2>
              <div className="intelligence-hub-kpi-grid">
                {intelligenceHubKpis.map((k) => (
                  <div key={k.id} className="intelligence-hub-kpi-card">
                    <p className="intelligence-hub-kpi-label">{k.label}</p>
                    <p className="intelligence-hub-kpi-value">{k.value}</p>
                    <p
                      className={`intelligence-hub-kpi-trend intelligence-hub-kpi-trend--${k.trendDir}`}
                    >
                      {k.trendDir === 'up' ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                          <path
                            fill="currentColor"
                            d="M12 4l8 8h-5v8H9v-8H4l8-8z"
                          />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
                          <path
                            fill="currentColor"
                            d="M12 20l-8-8h5V4h6v8h5l-8 8z"
                          />
                        </svg>
                      )}
                      {k.trend}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div className="intelligence-hub-row intelligence-hub-row-bottom">
            <section className="admin-card intelligence-hub-chart-card">
              <h2 className="admin-section-title">Service margin vs. labor cost trend</h2>
              <div className="intelligence-hub-line-chart">
                <svg viewBox={`0 0 ${chartW} ${chartH}`} className="intelligence-hub-line-svg" aria-hidden>
                  {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                    <line
                      key={t}
                      x1={padX}
                      x2={chartW - padX}
                      y1={padY + t * innerH}
                      y2={padY + t * innerH}
                      stroke="var(--color-border-light)"
                      strokeWidth="1"
                    />
                  ))}
                  <path
                    d={lineMargin}
                    fill="none"
                    stroke="var(--color-accent)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  />
                  <path
                    d={lineLabor}
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </svg>
                <div className="intelligence-hub-line-labels">
                  {trendChart.map((d) => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
                <div className="intelligence-hub-line-legend">
                  <span>
                    <span className="intelligence-hub-legend-swatch intelligence-hub-legend-swatch--margin" />
                    Service margin %
                  </span>
                  <span>
                    <span className="intelligence-hub-legend-swatch intelligence-hub-legend-swatch--labor" />
                    Labor cost %
                  </span>
                </div>
              </div>
              <div className="intelligence-hub-ai-callout intelligence-hub-ai-callout--compact">
                <SparkleIcon className="intelligence-hub-ai-callout-icon" />
                <p>
                  As labor costs rose by 8% since January, service margin dropped by 11%. Consider optimizing technician
                  scheduling or pricing adjustments.
                </p>
              </div>
            </section>

            <section className="admin-card intelligence-hub-chart-card">
              <h2 className="admin-section-title">Van inventory imbalance</h2>
              <div className="intelligence-hub-van-chart">
                {intelligenceHubVanInventory.map((row) => (
                  <div key={row.id} className="intelligence-hub-van-row">
                    <span className="intelligence-hub-van-name">{row.name}</span>
                    <div
                      className="intelligence-hub-van-bars"
                      role="img"
                      aria-label={`${row.name}: ${row.stale} dollars stale of ${row.total} total inventory`}
                    >
                      <div
                        className="intelligence-hub-van-track"
                        style={{ width: `${(row.total / maxVan) * 100}%` }}
                      >
                        <div
                          className="intelligence-hub-van-seg intelligence-hub-van-seg--stale"
                          style={{ flexGrow: row.stale }}
                        />
                        <div
                          className="intelligence-hub-van-seg intelligence-hub-van-seg--rest"
                          style={{ flexGrow: Math.max(row.total - row.stale, 0) }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="intelligence-hub-van-legend">
                  <span>
                    <span className="intelligence-hub-van-dot intelligence-hub-van-dot--stale" />
                    Stale
                  </span>
                  <span>
                    <span className="intelligence-hub-van-dot intelligence-hub-van-dot--rest" />
                    Total
                  </span>
                </div>
              </div>
              <div className="intelligence-hub-ai-callout intelligence-hub-ai-callout--split">
                <SparkleIcon className="intelligence-hub-ai-callout-icon" />
                <p>
                  4 technicians are carrying $48K in stale inventory. Consider rebalancing car stock or triggering
                  return-to-warehouse workflows to improve inventory turns.
                </p>
                <button type="button" className="intelligence-hub-inline-btn">
                  View details
                </button>
              </div>
            </section>
          </div>

          <button type="button" className="intelligence-hub-fab" aria-label="Open AI assistant (demo)">
            <SparkleIcon className="intelligence-hub-fab-icon" />
          </button>
        </div>

        <aside
          id={activityPanelId}
          className="intelligence-hub-activity"
          hidden={!activityOpen}
          aria-hidden={!activityOpen}
          aria-label="Activity Center"
        >
          <div className="intelligence-hub-activity-head">
            <button
              ref={activityCloseRef}
              type="button"
              className="intelligence-hub-activity-back"
              onClick={closeActivity}
              aria-label="Close Activity Center"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <h2 className="intelligence-hub-activity-title">Activity Center</h2>
            <button type="button" className="intelligence-hub-activity-iconbtn" aria-label="More options (demo)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="intelligence-hub-activity-body">
            <section className="intelligence-hub-ac-section">
              <div className="intelligence-hub-ac-section-head">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 6v6l4 2M22 12a10 10 0 11-20 0 10 10 0 0120 0z" />
                </svg>
                <h3>In progress</h3>
                <span className="intelligence-hub-ac-badge">{intelligenceHubActivityInProgress.length} active</span>
              </div>
              <ul className="intelligence-hub-ac-list">
                {intelligenceHubActivityInProgress.map((job) => (
                  <li key={job.id} className="intelligence-hub-ac-job">
                    <p className="intelligence-hub-ac-job-title">{job.title}</p>
                    <div className="intelligence-hub-ac-progress-track" aria-hidden>
                      <div
                        className="intelligence-hub-ac-progress-fill"
                        style={{ width: `${Math.round(job.progress * 100)}%` }}
                      />
                    </div>
                    <p className="intelligence-hub-ac-job-meta">{job.remaining}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="intelligence-hub-ac-section">
              <div className="intelligence-hub-ac-section-head">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3>Recent activity</h3>
                <span className="intelligence-hub-ac-badge">12 today</span>
              </div>
              <ul className="intelligence-hub-ac-list">
                {intelligenceHubActivityRecent.map((ev) => (
                  <li key={ev.id} className="intelligence-hub-ac-event">
                    <div className="intelligence-hub-ac-event-row">
                      <span className="intelligence-hub-ac-event-title">{ev.title}</span>
                      <time className="intelligence-hub-ac-event-time">{ev.time}</time>
                    </div>
                    <p className="intelligence-hub-ac-event-detail">{ev.detail}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="intelligence-hub-ac-section">
              <div className="intelligence-hub-ac-section-head">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3>Scheduled tasks</h3>
              </div>
              <ul className="intelligence-hub-ac-list">
                {intelligenceHubScheduled.map((sc) => (
                  <li key={sc.id} className="intelligence-hub-ac-sched">
                    <p className="intelligence-hub-ac-sched-title">{sc.title}</p>
                    <p className="intelligence-hub-ac-sched-when">{sc.when}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </aside>
      </div>
    </div>
  );
}
