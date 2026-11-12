import { createContext, useContext, type CSSProperties } from 'react';

/** A DOM container, or a callback evaluated after mount (safe for SSR). */
export type FqPortalContainer = HTMLElement | (() => HTMLElement | null) | null;

export interface PortalScope {
  'data-fq-theme': string;
  style: CSSProperties;
  'data-theme': 'light' | 'dark';
  'data-density': string;
}

export const PortalScopeContext = createContext<PortalScope | null>(null);

/** React context crosses portals; inline variables keep independent brands local. */
export function usePortalScope() {
  return useContext(PortalScopeContext);
}
