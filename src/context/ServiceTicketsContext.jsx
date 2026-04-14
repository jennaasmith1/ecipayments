import { createContext, useContext, useMemo, useState } from 'react';
import { usePortalProfile } from './PortalProfileContext';

const ServiceTicketsContext = createContext(null);

export function ServiceTicketsProvider({ children }) {
  const { initialServiceTickets } = usePortalProfile();
  const [tickets, setTickets] = useState(() => initialServiceTickets.map((t) => ({ ...t })));
  const value = useMemo(() => ({ tickets, setTickets }), [tickets]);
  return <ServiceTicketsContext.Provider value={value}>{children}</ServiceTicketsContext.Provider>;
}

/** Context consumer hook (not a component; colocated with provider for this demo app). */
// eslint-disable-next-line react-refresh/only-export-components -- hook paired with Provider above
export function useServiceTickets() {
  const ctx = useContext(ServiceTicketsContext);
  if (!ctx) {
    throw new Error('useServiceTickets must be used within ServiceTicketsProvider');
  }
  return ctx;
}
