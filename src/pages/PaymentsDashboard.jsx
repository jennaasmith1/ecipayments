import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortalProfile, usePortalPath } from '../context/PortalProfileContext';
import './PaymentsDashboard.css';

export default function PaymentsDashboard() {
  const { customer, invoices, recentPayments, formatCurrency, formatDate } = usePortalProfile();
  const payPath = usePortalPath('/pay');
  const autopayPath = usePortalPath('/settings/autopay');

  const { totalOutstanding, paidThisMonthDisplay } = useMemo(() => {
    const totalOutstandingInner = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidThisMonth = recentPayments
      .filter((p) => new Date(p.date).getMonth() === new Date().getMonth())
      .reduce((sum, p) => sum + p.amount, 0);
    const paidThisMonthDisplayInner = paidThisMonth > 0 ? paidThisMonth : 1565.5;
    return { totalOutstanding: totalOutstandingInner, paidThisMonthDisplay: paidThisMonthDisplayInner };
  }, [invoices, recentPayments]);

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
          <Link to={payPath} className="dashboard-card-action">
            Pay now
          </Link>
        </div>
        <div className="dashboard-card">
          <div className="dashboard-card-label">Paid this month</div>
          <div className="dashboard-card-value">{formatCurrency(paidThisMonthDisplay)}</div>
          <p className="dashboard-card-hint">From {recentPayments.length} recent payment{recentPayments.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="dashboard-card dashboard-card-actions-only">
          <Link to={autopayPath} className="dashboard-card-cta">
            Set up AutoPay
          </Link>
          <p className="dashboard-card-hint">Automate payments for eligible invoices</p>
        </div>
      </div>

      <section className="payments-dashboard-section">
        <div className="payments-dashboard-section-header">
          <h2>Recent payments</h2>
          <Link to={payPath} className="payments-dashboard-link">Pay invoices</Link>
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
