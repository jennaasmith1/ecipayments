import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatCurrency } from '../../data/adminMockData';
import { ADMIN_CUSTOMER_ROUTE_IDS } from '../../data/adminOrdersData';
import {
  customerOutstanding,
  globalInvoices,
  statusLabel,
} from '../../data/adminBillingData';
import './adminPages.css';
import './AdminBillingDetail.css';

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function statusClass(key) {
  if (key === 'paid') return 'admin-billing-status--paid';
  if (key === 'open') return 'admin-billing-status--open';
  if (key === 'overdue') return 'admin-billing-status--overdue';
  if (key === 'partial') return 'admin-billing-status--partial';
  return 'admin-billing-status--open';
}

export default function AdminBillingDetail() {
  const { invoiceId } = useParams();
  const invoice = useMemo(() => globalInvoices.find((i) => i.id === invoiceId) ?? null, [invoiceId]);

  const otherOpenForCustomer = useMemo(() => {
    if (!invoice) return [];
    return globalInvoices
      .filter((i) => i.customerId === invoice.customerId && i.id !== invoice.id && i.balance > 0)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  }, [invoice]);

  const customerOpenTotal = useMemo(() => {
    if (!invoice) return 0;
    return customerOutstanding(globalInvoices, invoice.customerId);
  }, [invoice]);

  const recentPaymentsForCustomer = useMemo(() => {
    if (!invoice) return [];
    const rows = [];
    for (const inv of globalInvoices.filter((i) => i.customerId === invoice.customerId)) {
      for (const p of inv.payments || []) {
        rows.push({ ...p, invoiceNumber: inv.invoiceNumber, invoiceId: inv.id });
      }
    }
    return rows.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);
  }, [invoice]);

  if (!invoice) {
    return (
      <div className="admin-page">
        <p>Invoice not found.</p>
        <Link to="/admin/billing">Back to billing</Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-billing-detail-page">
      <p className="admin-breadcrumb">
        <Link to="/admin/billing">Billing</Link>
        <span aria-hidden> / </span>
        <span>{invoice.invoiceNumber}</span>
      </p>

      <header className="admin-billing-detail-header">
        <div>
          <h1>{invoice.invoiceNumber}</h1>
          <p className="admin-page-subtitle">
            {ADMIN_CUSTOMER_ROUTE_IDS.has(invoice.customerId) ? (
              <Link to={`/admin/customers/${invoice.customerId}?tab=invoices`} className="admin-btn admin-btn-customer">
                {invoice.customerName}
              </Link>
            ) : (
              <span>{invoice.customerName}</span>
            )}
          </p>
        </div>
        <div className="admin-billing-detail-header-right">
          <span className={`admin-billing-status ${statusClass(invoice.statusKey)}`}>{statusLabel(invoice.statusKey)}</span>
        </div>
      </header>

      <div className="admin-billing-detail-grid">
        <section className="admin-billing-detail-section admin-card">
          <h2 className="admin-section-title">Overview</h2>
          <dl className="admin-billing-detail-dl">
            <div>
              <dt>Invoice date</dt>
              <dd>{formatDateShort(invoice.invoiceDate)}</dd>
            </div>
            <div>
              <dt>Due date</dt>
              <dd>{formatDateShort(invoice.dueDate)}</dd>
            </div>
            <div>
              <dt>PO number</dt>
              <dd>{invoice.poNumber ?? '—'}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{invoice.location}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-billing-detail-section admin-card">
          <h2 className="admin-section-title">Amounts</h2>
          <dl className="admin-billing-detail-dl">
            <div>
              <dt>Invoice total</dt>
              <dd>{formatCurrency(invoice.total)}</dd>
            </div>
            <div>
              <dt>Amount paid</dt>
              <dd>{formatCurrency(invoice.amountPaid)}</dd>
            </div>
            <div>
              <dt>Remaining balance</dt>
              <dd>{invoice.balance <= 0 ? <span className="admin-billing-muted">$0 — paid in full</span> : formatCurrency(invoice.balance)}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-billing-detail-section admin-billing-detail-section--wide admin-card">
          <h2 className="admin-section-title">Line items</h2>
          <div className="admin-table-wrap">
            <table className="admin-table admin-billing-items-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Qty</th>
                  <th className="admin-col-num">Line total</th>
                </tr>
              </thead>
              <tbody>
                {invoice.lineItems.map((line, idx) => (
                  <tr key={`${line.description}-${idx}`}>
                    <td>{line.description}</td>
                    <td>{line.qty}</td>
                    <td className="admin-col-num">{formatCurrency(line.lineTotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-billing-detail-section admin-card">
          <h2 className="admin-section-title">Payment history</h2>
          {invoice.payments.length === 0 ? (
            <p className="admin-billing-muted">No payments recorded on this invoice yet.</p>
          ) : (
            <ul className="admin-billing-pay-list">
              {invoice.payments.map((p, idx) => (
                <li key={`${p.date}-${idx}`}>
                  <strong>{formatDateShort(p.date)}</strong>
                  <span>{formatCurrency(p.amount)}</span>
                  <span className="admin-billing-muted">{p.method}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-billing-detail-section admin-card">
          <h2 className="admin-section-title">Customer context</h2>
          <div className="admin-billing-context-card">
            <p className="admin-billing-context-highlight">
              Total outstanding for {invoice.customerName}: {formatCurrency(customerOpenTotal)}
            </p>
            <p className="admin-billing-context-muted">
              {otherOpenForCustomer.length === 0
                ? 'No other unpaid invoices for this customer.'
                : `${otherOpenForCustomer.length} other unpaid invoice${otherOpenForCustomer.length !== 1 ? 's' : ''} on file.`}
            </p>
          </div>
          {otherOpenForCustomer.length > 0 && (
            <ul className="admin-billing-related-list">
              {otherOpenForCustomer.map((inv) => (
                <li key={inv.id}>
                  <Link to={`/admin/billing/${inv.id}`} className="admin-table-link">
                    {inv.invoiceNumber}
                  </Link>
                  <span>Due {formatDateShort(inv.dueDate)}</span>
                  <span>{formatCurrency(inv.balance)}</span>
                  <span className={`admin-billing-status ${statusClass(inv.statusKey)}`}>{statusLabel(inv.statusKey)}</span>
                </li>
              ))}
            </ul>
          )}
          {recentPaymentsForCustomer.length > 0 && (
            <>
              <p className="admin-section-title" style={{ marginTop: 16 }}>
                Recent payment activity
              </p>
              <ul className="admin-billing-pay-list">
                {recentPaymentsForCustomer.map((p, idx) => (
                  <li key={`${p.invoiceId}-${p.date}-${idx}`}>
                    <span>{formatDateShort(p.date)}</span>
                    <span>{formatCurrency(p.amount)}</span>
                    <span className="admin-billing-muted">
                      {p.method} · {p.invoiceNumber}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {invoice.paymentHabitNote === 'late' && (
            <p className="admin-billing-muted" style={{ marginTop: 10 }}>
              Note: payments from this account are often a few days after the due date.
            </p>
          )}
        </section>

        <section className="admin-billing-detail-section admin-card">
          <h2 className="admin-section-title">Actions</h2>
          <div className="admin-billing-actions">
            <button type="button" className="admin-btn" disabled title="Demo only">
              Download invoice
            </button>
            <button type="button" className="admin-btn" disabled title="Demo only">
              Send to customer
            </button>
            <button type="button" className="admin-btn admin-btn-primary" disabled title="Demo only">
              Record payment
            </button>
          </div>
        </section>
      </div>

      <p className="admin-billing-detail-footer">
        This view helps your team answer billing questions. For journal entries, GL detail, and reconciliation, use e-automate.
      </p>
    </div>
  );
}
