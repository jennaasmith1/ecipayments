/* eslint-disable react-refresh/only-export-components -- context + hooks + helpers shared by portal routes */
import { createContext, useContext, useMemo } from 'react';
import * as summit from '../data/summitFakeData';
import * as tesla from '../data/teslaFakeData';
import { fleetEquipment as summitFleetEquipment } from '../data/summitEquipmentFleetData';
import { fleetEquipment as teslaFleetEquipment } from '../data/teslaEquipmentFleetData';
import { initialServiceTickets as summitInitialTickets } from '../data/summitServiceTicketsData';
import { initialServiceTickets as teslaInitialTickets } from '../data/teslaServiceTicketsData';

/** URL prefix for the Tesla enterprise demo (dealer deep-link). */
export const TESLA_PORTAL_BASE = '/c/tesla';

const REGISTRY = {
  summit: {
    ...summit,
    fleetEquipment: summitFleetEquipment,
    initialServiceTickets: summitInitialTickets,
  },
  tesla: {
    ...tesla,
    fleetEquipment: teslaFleetEquipment,
    initialServiceTickets: teslaInitialTickets,
  },
};

const PortalProfileContext = createContext(null);

export function PortalProfileProvider({ profileId, children }) {
  const value = useMemo(() => {
    const data = REGISTRY[profileId];
    if (!data) throw new Error(`Unknown portal profile: ${profileId}`);
    const basePath = profileId === 'tesla' ? TESLA_PORTAL_BASE : '';
    return {
      profileId,
      basePath,
      ...data,
    };
  }, [profileId]);

  return <PortalProfileContext.Provider value={value}>{children}</PortalProfileContext.Provider>;
}

export function usePortalProfile() {
  const ctx = useContext(PortalProfileContext);
  if (!ctx) {
    throw new Error('usePortalProfile must be used within PortalProfileProvider');
  }
  return ctx;
}

/**
 * Absolute path for the active portal profile, e.g. `/billing` or `/c/tesla/billing`.
 * @param {string} path - Absolute path within the portal (must start with `/`, e.g. `/pay`).
 */
export function usePortalPath(path) {
  const { basePath } = usePortalProfile();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (!basePath) return normalized;
  return `${basePath}${normalized}`;
}

/** Strip profile prefix so nav matching uses logical paths like `/equipment`. */
export function portalPathnameFromLocation(pathname, basePath) {
  if (!basePath || !pathname.startsWith(basePath)) return pathname;
  const rest = pathname.slice(basePath.length) || '/';
  return rest.startsWith('/') ? rest : `/${rest}`;
}
