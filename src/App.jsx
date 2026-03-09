import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import PortalShell from './components/PortalShell';
import EmailScreen from './pages/EmailScreen';
import PaymentLanding from './pages/PaymentLanding';
import PaymentSuccess from './pages/PaymentSuccess';
import AutoPaySetup from './pages/AutoPaySetup';
import NotificationSettings from './pages/NotificationSettings';
import PaymentsDashboard from './pages/PaymentsDashboard';
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
          <Route path="/" element={<Navigate to="/email" replace />} />
          <Route path="/email" element={<EmailScreen />} />
          <Route path="/payments" element={<PaymentsDashboard />} />
          <Route path="/pay" element={<PaymentLanding />} />
          <Route path="/pay/success" element={<PaymentSuccess />} />
          <Route path="/settings/autopay" element={<AutoPaySetup />} />
          <Route path="/settings/notifications" element={<NotificationSettings />} />
        </Routes>
      </ConditionalShell>
    </BrowserRouter>
  );
}

export default App;
