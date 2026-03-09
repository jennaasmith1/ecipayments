import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PortalShell from './components/PortalShell';
import EmailScreen from './pages/EmailScreen';
import HomeDashboard from './pages/HomeDashboard';
import Equipment from './pages/Equipment';
import Service from './pages/Service';
import Supplies from './pages/Supplies';
import Billing from './pages/Billing';
import PaymentLanding from './pages/PaymentLanding';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentsDashboard from './pages/PaymentsDashboard';
import AutoPaySetup from './pages/AutoPaySetup';
import NotificationSettings from './pages/NotificationSettings';
import Account from './pages/Account';
import './App.css';

function ConditionalShell({ children }) {
  const location = useLocation();
  if (location.pathname === '/email') {
    return <>{children}</>;
  }
  return <PortalShell>{children}</PortalShell>;
}

function App() {
  return (
    <BrowserRouter>
      <ConditionalShell>
        <Routes>
          <Route path="/" element={<HomeDashboard />} />
          <Route path="/email" element={<EmailScreen />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/service" element={<Service />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/payments" element={<PaymentsDashboard />} />
          <Route path="/pay" element={<PaymentLanding />} />
          <Route path="/pay/success" element={<PaymentSuccess />} />
          <Route path="/account" element={<Account />} />
          <Route path="/settings/autopay" element={<AutoPaySetup />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ConditionalShell>
    </BrowserRouter>
  );
}

export default App;
