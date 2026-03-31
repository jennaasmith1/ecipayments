import { Outlet } from 'react-router-dom';
import { ServiceTicketsProvider } from '../context/ServiceTicketsContext';

export default function ServiceTicketsLayout() {
  return (
    <ServiceTicketsProvider>
      <Outlet />
    </ServiceTicketsProvider>
  );
}
