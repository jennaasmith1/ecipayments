import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PortalShell from './components/PortalShell';
import AdminShell from './components/AdminShell';
import { PortalProfileProvider } from './context/PortalProfileContext';
import EmailScreen from './pages/EmailScreen';
import HomeDashboard from './pages/HomeDashboard';
import Equipment from './pages/Equipment';
import Service from './pages/Service';
import ServiceNew from './pages/ServiceNew';
import ServiceTicketsLayout from './pages/ServiceTicketsLayout';
import Supplies from './pages/Supplies';
import Billing from './pages/Billing';
import PaymentLanding from './pages/PaymentLanding';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentsDashboard from './pages/PaymentsDashboard';
import AutoPaySetup from './pages/AutoPaySetup';
import NotificationsPage from './pages/NotificationsPage';
import NotificationSettings from './pages/NotificationSettings';
import Account from './pages/Account';
import Chat from './pages/Chat';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomerList from './pages/admin/CustomerList';
import CustomerDetail from './pages/admin/CustomerDetail';
import InternalUsers from './pages/admin/InternalUsers';
import PortalUsersPage from './pages/admin/PortalUsersPage';
import RolesPermissions from './pages/admin/RolesPermissions';
import BrandingPortal from './pages/admin/BrandingPortal';
import ServiceRequestSettings from './pages/admin/ServiceRequestSettings';
import PaymentsSettings from './pages/admin/PaymentsSettings';
import CommunicationsSettings from './pages/admin/CommunicationsSettings';
import AuditActivity from './pages/admin/AuditActivity';
import IntelligenceHub from './pages/admin/IntelligenceHub';
import AdminGlobalService from './pages/admin/AdminGlobalService';
import AdminServiceDetail from './pages/admin/AdminServiceDetail';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminBilling from './pages/admin/AdminBilling';
import AdminBillingDetail from './pages/admin/AdminBillingDetail';
import AdminEquipment from './pages/admin/AdminEquipment';
import './App.css';

/** Shared portal route tree. Must be a fragment (not a <Component/>) — RR7 only allows Route | Fragment as route children. Call per parent so each branch gets its own elements. */
function portalRoutesElements() {
  return (
    <>
      <Route index element={<HomeDashboard />} />
      <Route path="equipment" element={<Equipment />} />
      <Route path="service" element={<ServiceTicketsLayout />}>
        <Route index element={<Service />} />
        <Route path="new" element={<ServiceNew />} />
        <Route path=":ticketId" element={<Service />} />
      </Route>
      <Route path="supplies" element={<Supplies />} />
      <Route path="billing" element={<Billing />} />
      <Route path="payments" element={<PaymentsDashboard />} />
      <Route path="pay" element={<PaymentLanding />} />
      <Route path="pay/success" element={<PaymentSuccess />} />
      <Route path="account" element={<Account />} />
      <Route path="chat" element={<Chat />} />
      <Route path="settings/autopay" element={<AutoPaySetup />} />
      <Route path="settings/notifications" element={<NotificationSettings />} />
      <Route path="notifications" element={<NotificationsPage />} />
      <Route path="email" element={<EmailScreen />} />
      <Route path="*" element={<Navigate to=".." relative="path" replace />} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminShell />}>
          <Route index element={<AdminDashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/:customerId" element={<CustomerDetail />} />
          <Route path="service" element={<AdminGlobalService />} />
          <Route path="service/:callId" element={<AdminServiceDetail />} />
          <Route path="equipment" element={<AdminEquipment />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:orderId" element={<AdminOrderDetail />} />
          <Route path="billing" element={<AdminBilling />} />
          <Route path="billing/:invoiceId" element={<AdminBillingDetail />} />
          <Route path="users/internal" element={<InternalUsers />} />
          <Route path="users/portal" element={<PortalUsersPage />} />
          <Route path="users/roles" element={<RolesPermissions />} />
          <Route path="portal/branding" element={<BrandingPortal />} />
          <Route path="portal/service-requests" element={<ServiceRequestSettings />} />
          <Route path="portal/payments" element={<PaymentsSettings />} />
          <Route path="portal/communications" element={<CommunicationsSettings />} />
          <Route path="audit" element={<AuditActivity />} />
          <Route path="intelligence-hub" element={<IntelligenceHub />} />
        </Route>

        <Route
          path="/c/tesla/*"
          element={
            <PortalProfileProvider profileId="tesla">
              <PortalShell />
            </PortalProfileProvider>
          }
        >
          {portalRoutesElements()}
        </Route>

        <Route
          path="/*"
          element={
            <PortalProfileProvider profileId="summit">
              <PortalShell />
            </PortalProfileProvider>
          }
        >
          {portalRoutesElements()}
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
