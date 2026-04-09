import { useEffect, useRef, useState } from 'react';
import { defaultBranding, summitPortalColors, summitPortalLogoSrc } from '../../data/adminMockData';
import { dealer } from '../../data/fakeData';
import './adminPages.css';
import './BrandingPortal.css';

const modulesSeed = ['Account summary', 'Open service', 'Recent invoices', 'Order supplies', 'Announcements'];

export default function BrandingPortal() {
  const [heroTitle, setHeroTitle] = useState(defaultBranding.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(defaultBranding.heroSubtitle);
  const [primaryHex, setPrimaryHex] = useState(summitPortalColors.primaryHex);
  const [accentHex, setAccentHex] = useState(summitPortalColors.accentHex);
  const [invoiceLabel, setInvoiceLabel] = useState(defaultBranding.invoiceLabel);
  const [modules, setModules] = useState(modulesSeed);
  const [logoSrc, setLogoSrc] = useState(summitPortalLogoSrc);
  const logoBlobRef = useRef(null);

  useEffect(
    () => () => {
      if (logoBlobRef.current) URL.revokeObjectURL(logoBlobRef.current);
    },
    []
  );

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file?.type.startsWith('image/')) return;
    if (logoBlobRef.current) {
      URL.revokeObjectURL(logoBlobRef.current);
      logoBlobRef.current = null;
    }
    const url = URL.createObjectURL(file);
    logoBlobRef.current = url;
    setLogoSrc(url);
    e.target.value = '';
  };

  const resetLogo = () => {
    if (logoBlobRef.current) {
      URL.revokeObjectURL(logoBlobRef.current);
      logoBlobRef.current = null;
    }
    setLogoSrc(summitPortalLogoSrc);
  };

  const move = (i, dir) => {
    const j = i + dir;
    if (j < 0 || j >= modules.length) return;
    const next = [...modules];
    [next[i], next[j]] = [next[j], next[i]];
    setModules(next);
  };

  return (
    <div className="admin-page admin-branding-page">
      <header className="admin-page-header">
        <h1>Branding & portal content</h1>
        <p className="admin-page-subtitle">What customers see on sign-in and home (live preview).</p>
      </header>

      <div className="admin-branding-split">
        <div className="admin-branding-controls">
          <section className="admin-card">
            <h2 className="admin-section-title">Hero & copy</h2>
            <div className="admin-form-row">
              <label htmlFor="hero-title">Headline</label>
              <input id="hero-title" className="admin-input" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
            </div>
            <div className="admin-form-row">
              <label htmlFor="hero-sub">Subtitle</label>
              <input id="hero-sub" className="admin-input" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
            </div>
            <div className="admin-form-row">
              <label htmlFor="inv-label">{invoiceLabel} label (terminology)</label>
              <input id="inv-label" className="admin-input" value={invoiceLabel} onChange={(e) => setInvoiceLabel(e.target.value)} />
            </div>
          </section>

          <section className="admin-card">
            <h2 className="admin-section-title">Company logo</h2>
            <p className="admin-branding-colors-caption">
              Shown in the customer portal sidebar header for <strong>{dealer.name}</strong>.
            </p>
            <div className="admin-branding-logo-row">
              <div className="admin-branding-logo-thumb-wrap">
                <img src={logoSrc} alt="" className="admin-branding-logo-thumb" />
              </div>
              <div className="admin-branding-logo-actions">
                <input
                  id="branding-logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  className="admin-branding-logo-file-input"
                  onChange={handleLogoUpload}
                />
                <label htmlFor="branding-logo-upload" className="admin-btn admin-branding-logo-upload-label">
                  Upload image
                </label>
                <button type="button" className="admin-btn admin-btn-ghost" onClick={resetLogo}>
                  Reset to default
                </button>
              </div>
            </div>
          </section>

          <section className="admin-card">
            <h2 className="admin-section-title">Colors</h2>
            <p className="admin-branding-colors-caption">
              Customer portal theme for <strong>{dealer.name}</strong> (matches the live white-label portal).
            </p>
            <div className="admin-color-row">
              <div className="admin-form-row">
                <label htmlFor="col-p">Primary</label>
                <input id="col-p" type="color" value={primaryHex} onChange={(e) => setPrimaryHex(e.target.value)} />
              </div>
              <div className="admin-form-row">
                <label htmlFor="col-a">Accent</label>
                <input id="col-a" type="color" value={accentHex} onChange={(e) => setAccentHex(e.target.value)} />
              </div>
            </div>
          </section>

          <section className="admin-card">
            <h2 className="admin-section-title">Homepage modules</h2>
            <ul className="admin-module-list">
              {modules.map((m, i) => (
                <li key={m + i}>
                  <span>{m}</span>
                  <span className="admin-module-btns">
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={() => move(i, -1)} disabled={i === 0}>
                      Up
                    </button>
                    <button type="button" className="admin-btn admin-btn-ghost" onClick={() => move(i, 1)} disabled={i === modules.length - 1}>
                      Down
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="admin-branding-preview-wrap">
          <p className="admin-preview-label">Live preview</p>
          <div
            className="admin-portal-preview"
            style={{
              '--preview-primary': primaryHex,
              '--preview-accent': accentHex,
            }}
          >
            <div className="admin-portal-preview-body">
              <div className="admin-portal-preview-sidebar">
                <div className="admin-portal-preview-sidebar-brand">
                  <img src={logoSrc} alt={dealer.name} className="admin-portal-preview-logo-img" />
                </div>
              </div>
              <div className="admin-portal-preview-main">
                <div className="admin-portal-preview-hero">
                  <h3 style={{ color: 'var(--preview-primary)' }}>{heroTitle}</h3>
                  <p>{heroSubtitle}</p>
                </div>
                <div className="admin-portal-preview-grid">
                  {modules.slice(0, 4).map((m) => (
                    <div key={m} className="admin-portal-preview-card">
                      <span className="admin-portal-preview-card-title">{m}</span>
                      <span className="admin-portal-preview-cta" style={{ color: 'var(--preview-accent)' }}>
                        View {invoiceLabel.toLowerCase()}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
