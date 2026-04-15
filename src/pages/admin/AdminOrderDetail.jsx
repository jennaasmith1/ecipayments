import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { formatCurrency } from '../../data/adminMockData';
import {
  ADMIN_CUSTOMER_ROUTE_IDS,
  globalOrders,
  orderTypeLabel,
  statusLabel,
} from '../../data/adminOrdersData';
import { globalServiceCalls, isOpenGlobalCall } from '../../data/adminGlobalServiceData';
import './adminPages.css';
import './AdminOrderDetail.css';

function formatDateShort(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

function statusChipClass(key) {
  if (key === 'processing') return 'admin-orders-chip--processing';
  if (key === 'shipped') return 'admin-orders-chip--shipped';
  if (key === 'delivered') return 'admin-orders-chip--delivered';
  if (key === 'backordered') return 'admin-orders-chip--backordered';
  if (key === 'delayed') return 'admin-orders-chip--delayed';
  return 'admin-orders-chip--processing';
}

function lineStatusClass(ls) {
  if (ls === 'backordered') return 'admin-order-detail-line-warn';
  if (ls === 'delayed') return 'admin-order-detail-line-bad';
  return 'admin-order-detail-line-ok';
}

function lineStatusText(ls) {
  if (ls === 'backordered') return 'Backordered';
  if (ls === 'delayed') return 'Delayed';
  return 'OK';
}

function buildFulfillmentSteps(order) {
  const k = order.statusKey;
  const steps = [
    { key: 'sub', label: 'Order submitted', done: true, current: false },
    {
      key: 'proc',
      label: 'Processing',
      done: ['processing', 'shipped', 'delivered', 'backordered', 'delayed'].includes(k),
      current: false,
    },
    {
      key: 'ship',
      label: 'Shipped',
      done: ['shipped', 'delivered'].includes(k),
      current: false,
    },
    { key: 'del', label: 'Delivered', done: k === 'delivered', current: false },
  ];
  if (k === 'backordered' || k === 'delayed' || k === 'processing') steps[1].current = true;
  else if (k === 'shipped') steps[2].current = true;
  else if (k === 'delivered') steps[3].current = true;
  return steps;
}

export default function AdminOrderDetail() {
  const { orderId } = useParams();
  const order = useMemo(() => globalOrders.find((o) => o.id === orderId) ?? null, [orderId]);

  const relatedOrders = useMemo(() => {
    if (!order) return [];
    return globalOrders
      .filter((o) => o.customerId === order.customerId && o.id !== order.id)
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 5);
  }, [order]);

  const openCallsForCustomer = useMemo(() => {
    if (!order) return [];
    return globalServiceCalls.filter((c) => c.customerName === order.customerName && isOpenGlobalCall(c)).slice(0, 4);
  }, [order]);

  if (!order) {
    return (
      <div className="admin-page">
        <p>Order not found.</p>
        <Link to="/admin/orders">Back to orders</Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-order-detail">
      <p className="admin-breadcrumb">
        <Link to="/admin/orders">Orders</Link>
        <span aria-hidden> / </span>
        <span>{order.orderNumber}</span>
      </p>

      <header className="admin-order-detail-header">
        <div>
          <h1>{order.orderNumber}</h1>
          <p className="admin-page-subtitle">
            {ADMIN_CUSTOMER_ROUTE_IDS.has(order.customerId) ? (
              <Link to={`/admin/customers/${order.customerId}?tab=orders`} className="admin-btn admin-btn-customer">
                {order.customerName}
              </Link>
            ) : (
              <span>{order.customerName}</span>
            )}
          </p>
        </div>
        <div className="admin-order-detail-header-right">
          <span className={`admin-orders-chip ${statusChipClass(order.statusKey)}`}>{statusLabel(order.statusKey)}</span>
          <a
            className="admin-btn admin-btn-primary"
            href="https://www.ecisolutions.com"
            target="_blank"
            rel="noreferrer"
          >
            Open in EvolutionX
          </a>
        </div>
      </header>

      <div className="admin-order-detail-grid">
        <section className="admin-order-detail-section admin-card">
          <h2 className="admin-section-title">Overview</h2>
          <dl className="admin-order-detail-dl">
            <div>
              <dt>Order date</dt>
              <dd>{formatDateShort(order.orderDate)}</dd>
            </div>
            <div>
              <dt>Expected delivery</dt>
              <dd>{formatDateShort(order.expectedDelivery)}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{order.location}</dd>
            </div>
            <div>
              <dt>Order type</dt>
              <dd>{orderTypeLabel(order.orderType)}</dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>{order.contractBilling === 'contract' ? 'Contract' : 'Non-contract'}</dd>
            </div>
            <div>
              <dt>Total</dt>
              <dd>{order.total > 0 ? formatCurrency(order.total) : '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-order-detail-section admin-card">
          <h2 className="admin-section-title">Fulfillment</h2>
          <ul className="admin-order-detail-timeline">
            {buildFulfillmentSteps(order).map((step) => (
              <li key={step.key}>
                <span
                  className={`admin-order-detail-tl-dot ${step.done ? 'admin-order-detail-tl-dot--done' : ''} ${step.current ? 'admin-order-detail-tl-dot--current' : ''}`}
                  aria-hidden
                />
                <div>
                  <div className="admin-order-detail-tl-label">{step.label}</div>
                  {step.current && <div className="admin-order-detail-tl-meta">Current stage</div>}
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="admin-order-detail-section admin-card">
          <h2 className="admin-section-title">Shipping</h2>
          <dl className="admin-order-detail-dl">
            <div>
              <dt>Carrier</dt>
              <dd>{order.carrier}</dd>
            </div>
            <div>
              <dt>Tracking</dt>
              <dd>{order.trackingNumber && order.trackingNumber !== '—' ? order.trackingNumber : '—'}</dd>
            </div>
            <div>
              <dt>Notes</dt>
              <dd>{order.shipNote ?? '—'}</dd>
            </div>
          </dl>
        </section>

        <section className="admin-order-detail-section admin-order-detail-section--wide admin-card">
          <h2 className="admin-section-title">Line items</h2>
          <div className="admin-table-wrap">
            <table className="admin-table admin-order-detail-items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Equipment #</th>
                  <th>Line status</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((line, idx) => (
                  <tr key={`${line.name}-${idx}`}>
                    <td>{line.name}</td>
                    <td>{line.qty}</td>
                    <td>{line.equipmentNumber ?? '—'}</td>
                    <td className={lineStatusClass(line.lineStatus)}>{lineStatusText(line.lineStatus)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-order-detail-section admin-card">
          <h2 className="admin-section-title">Other recent orders</h2>
          {relatedOrders.length === 0 ? (
            <p className="admin-order-detail-muted">No other orders for this customer.</p>
          ) : (
            <ul className="admin-order-detail-related-list">
              {relatedOrders.map((o) => (
                <li key={o.id}>
                  <Link to={`/admin/orders/${o.id}`} className="admin-table-link">
                    {o.orderNumber}
                  </Link>
                  <span className="admin-order-detail-muted">{formatDateShort(o.orderDate)}</span>
                  <span className={`admin-orders-chip ${statusChipClass(o.statusKey)}`}>{statusLabel(o.statusKey)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="admin-order-detail-section admin-card">
          <h2 className="admin-section-title">Open service calls</h2>
          {openCallsForCustomer.length === 0 ? (
            <p className="admin-order-detail-muted">No open service calls for this customer.</p>
          ) : (
            <ul className="admin-order-detail-related-list">
              {openCallsForCustomer.map((c) => (
                <li key={c.id}>
                  <Link to="/admin/service" className="admin-table-link">
                    {c.callNumber}
                  </Link>
                  <span>{c.statusLabel}</span>
                  <span className="admin-order-detail-muted">{c.issueSummary}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <p className="admin-order-detail-footer">
        Ordering and inventory changes belong in{' '}
        <a href="https://www.ecisolutions.com" target="_blank" rel="noreferrer">
          EvolutionX
        </a>
        . This view is read-only visibility for account teams.
      </p>
    </div>
  );
}
