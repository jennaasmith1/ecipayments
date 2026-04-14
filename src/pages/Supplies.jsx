import { usePortalProfile } from '../context/PortalProfileContext';
import './Supplies.css';

export default function Supplies() {
  const { supplies, supplyOrders, formatCurrency, formatDate } = usePortalProfile();
  const recommended = supplies.filter((s) => s.recommended);

  return (
    <div className="supplies-page">
      <header className="supplies-header">
        <h1>Supplies</h1>
        <p className="supplies-subtitle">
          Order toner, drums, and other supplies for your devices.
        </p>
      </header>

      <section className="supplies-section">
        <h2 className="supplies-section-title">Recommended for your devices</h2>
        <div className="supplies-grid">
          {recommended.map((item) => (
            <div key={item.id} className="supplies-card">
              <div className="supplies-card-body">
                <h3 className="supplies-card-name">{item.name}</h3>
                <p className="supplies-card-device">For {item.forDevice}</p>
                {item.lastOrdered && (
                  <p className="supplies-card-meta">Last ordered {formatDate(item.lastOrdered)}</p>
                )}
              </div>
              <button type="button" className="supplies-btn supplies-btn-primary">
                Quick order
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="supplies-section">
        <h2 className="supplies-section-title">Reorder previous</h2>
        <p className="supplies-section-desc">Select from your past orders to reorder quickly.</p>
        <div className="supplies-orders-list">
          {supplyOrders.map((order) => (
            <div key={order.id} className="supplies-order-card">
              <div className="supplies-order-info">
                <span className="supplies-order-date">{formatDate(order.date)}</span>
                <span className="supplies-order-status">{order.status}</span>
              </div>
              <ul className="supplies-order-items">
                {order.items.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
              <div className="supplies-order-footer">
                <span className="supplies-order-total">{formatCurrency(order.total)}</span>
                <button type="button" className="supplies-btn">Reorder</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
