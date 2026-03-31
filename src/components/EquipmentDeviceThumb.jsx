import '../pages/Equipment.css';

/**
 * Table / drawer thumbnail for a fleet device. Uses `device.imageUrl` when set (e.g. demo catalog photos),
 * otherwise the brand-tinted SVG placeholder.
 */
export default function EquipmentDeviceThumb({ device, className = '' }) {
  if (!device?.thumbnailKey) return null;
  const base = `equipment-thumb equipment-thumb--${device.thumbnailKey}`;
  const photo = Boolean(device.imageUrl);
  const rootClass = [base, photo ? 'equipment-thumb--photo' : '', className].filter(Boolean).join(' ');

  return (
    <div className={rootClass} aria-hidden>
      {photo ? (
        <img src={device.imageUrl} alt="" className="equipment-thumb-img" loading="lazy" decoding="async" />
      ) : (
        <svg className="equipment-thumb-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="6" y="3" width="12" height="18" rx="2" />
          <path d="M9 7h6M9 11h6M9 15h4" strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}
