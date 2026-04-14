import { Navigate, useSearchParams } from 'react-router-dom';
import { usePortalPath } from '../context/PortalProfileContext';

/** Legacy URL: forwards to inline create flow on the Service list page. */
export default function ServiceNew() {
  const [searchParams] = useSearchParams();
  const servicePath = usePortalPath('/service');
  const equipment = searchParams.get('equipment');
  const to = equipment
    ? `${servicePath}?create=1&equipment=${encodeURIComponent(equipment)}`
    : `${servicePath}?create=1`;
  return <Navigate to={to} replace />;
}
