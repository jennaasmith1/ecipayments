import { Navigate, useSearchParams } from 'react-router-dom';

/** Legacy URL: forwards to inline create flow on the Service list page. */
export default function ServiceNew() {
  const [searchParams] = useSearchParams();
  const equipment = searchParams.get('equipment');
  const to = equipment
    ? `/service?create=1&equipment=${encodeURIComponent(equipment)}`
    : '/service?create=1';
  return <Navigate to={to} replace />;
}
