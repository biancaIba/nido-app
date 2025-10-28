"use client";

import { useState, useEffect } from "react";

/**
 * React hook to handle media queries
 * @param query The media query to check against
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    // Set initial value
    setMatches(mediaQuery.matches);

    // Define and call the handler to update state when query matches change
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    // Add event listener
    mediaQuery.addEventListener("change", handler);

    // Clean up
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}
