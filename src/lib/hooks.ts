"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * SSR-safe media query subscription.
 *
 * Uses useSyncExternalStore rather than useState + useEffect so there's no
 * cascading render on mount and the value stays live if the user changes
 * their OS setting (or rotates a device) mid-session.
 */
export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false, // server: assume no match
  );
}

export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
