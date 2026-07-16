'use client';

import { useEffect } from 'react';

/**
 * ThemeColorLoader
 *
 * Colors are injected server-side in layout.js as :root CSS variables — no FOUC.
 * This component acts as a client-side safety net: on mount it re-applies colors
 * from the /api/colors proxy in case the SSR-injected values need a refresh
 * (e.g. after a color change in the CMS without a redeploy).
 */
const ThemeColorLoader = () => {
  useEffect(() => {
    const applyColors = (c) => {
      const root = document.documentElement;
      root.style.setProperty('--tj-color-common-white', c.common?.white);
      root.style.setProperty('--tj-color-common-black', c.common?.black);
      root.style.setProperty('--tj-color-heading-primary', c.heading?.primary);
      root.style.setProperty('--tj-color-text-body', c.text?.body);
      root.style.setProperty('--tj-color-text-body-2', c.text?.body2);
      root.style.setProperty('--tj-color-text-body-3', c.text?.body3);
      root.style.setProperty('--tj-color-text-body-4', c.text?.body4);
      root.style.setProperty('--tj-color-text-body-5', c.text?.body5);
      root.style.setProperty('--tj-color-theme-primary', c.theme?.primary);
      root.style.setProperty('--tj-color-theme-bg', c.theme?.bg);
      root.style.setProperty('--tj-color-theme-bg-2', c.theme?.bg2);
      root.style.setProperty('--tj-color-theme-bg-3', c.theme?.bg3);
      root.style.setProperty('--tj-color-theme-dark', c.theme?.dark);
      root.style.setProperty('--tj-color-theme-dark-2', c.theme?.dark2);
      root.style.setProperty('--tj-color-theme-dark-3', c.theme?.dark3);
      root.style.setProperty('--tj-color-theme-dark-4', c.theme?.dark4);
      root.style.setProperty('--tj-color-theme-dark-5', c.theme?.dark5);
      root.style.setProperty('--tj-color-grey-1', c.grey?.['1']);
      root.style.setProperty('--tj-color-grey-2', c.grey?.['2']);
      root.style.setProperty('--tj-color-grey-3', c.grey?.['3']);
      root.style.setProperty('--tj-color-border-1', c.border?.['1']);
      root.style.setProperty('--tj-color-border-2', c.border?.['2']);
      root.style.setProperty('--tj-color-border-3', c.border?.['3']);
      root.style.setProperty('--tj-color-border-4', c.border?.['4']);
      root.style.setProperty('--tj-color-border-5', c.border?.['5']);
    };

    const fetchColors = async () => {
      try {
        const resColors = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/colors`, { next: { revalidate: 0 } });
        if (resColors.ok) {
          const json = await resColors.json();
          const c = json?.data?.colors;
          if (c) {
            applyColors(c);
          }
        }
      } catch (err) {
        // SSR-injected values are already in place — silently ignore
      }
    };

    fetchColors();
  }, []);

  return null;
};

export default ThemeColorLoader;
