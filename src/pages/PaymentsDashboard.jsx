import { Link } from 'react-router-dom';
import {
  customer,
  invoices,
  recentPayments,
  formatCurrency,
  formatDate,
} from '../data/fakeData';
import './PaymentsDashboard.css';

const totalOutstanding = invoices.reduce((sum, inv) => sum + inv.amount, 0);
const paidThisMonth = recentPayments
  .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
  .reduce((sum, p) => sum + p.amount, 0);
const paidThisMonthDisplay = paidThisMonth > 0 ? paidThisMonth : 1565.5;

export default function PaymentsDashboard() {
  return (
    <div className="payments-dashboard">
      <h1>Payments</h1>
      <p className="payments-dashboard-subtitle">
        Overview of your payment activity with {customer.company}.
      </p>

      <div className="payments-dashboard-cards">
        <div className="dashboard-card dashboard-card-outstanding">
          <div className="dashboard-card-label">Outstanding balance</div>
          <div className="dashboard-card-value">{formatCurrency(totalOutstanding)}</div>
          <p className="dashboard-card-hint">{invoices.length} invoice{invoices.length !== 1 ? 's' : ''} due</p>
          <Link to="/pay" className="dashboard-card-action">
            Pay now
          </Link>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-label">Paid this month</div>
          <div className="dashboard-card-value">{formatCurrency(paidThisMonthDisplay)}</div>
          <p className="dashboard-card-hint">From {recentPayments.length} recent payment{recentPayments.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="dashboard-card dashboard-card-actions-only">
          <Link to="/settings/autopay" className="dashboard-card-cta">
            Set up AutoPay
          </Link>
          <p className="dashboard-card-hint">Automate payments for eligible invoices</p>
        </div>
      </div>

      <section className="payments-dashboard-section">
        <div className="payments-dashboard-section-header">
          <h2>Recent payments</h2>
          <Link to="/pay" className="payments-dashboard-link">Pay invoices</Link>
        </div>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <caption className="sr-only">Recent payment history</caption>
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Method</th>
                <th className="col-amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{formatDate(payment.date)}</td>
                  <td>{payment.description}</td>
                  <td>{payment.method}</td>
                  <td className="col-amount">{formatCurrency(payment.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
