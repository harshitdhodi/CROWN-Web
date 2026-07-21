"use client";

import React, { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const CLIENT_DEBOUNCE_MS = 3000; // 3 seconds client-side deduplication window

export function ActivityTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const sessionIdRef = useRef(null);
  const previousPathRef = useRef(null);
  const currentPathRef = useRef(null);
  const lastTrackedMapRef = useRef(new Map());

  // Initialize or retrieve Session ID
  const getOrCreateSessionId = () => {
    if (sessionIdRef.current) return sessionIdRef.current;
    if (typeof window === 'undefined') return 'server-side';

    let sid = localStorage.getItem('crown_visitor_session_id');
    if (!sid) {
      sid =
        (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : null) ||
        'sess_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
      try {
        localStorage.setItem('crown_visitor_session_id', sid);
      } catch (e) {
        // ignore storage errors
      }
    }
    sessionIdRef.current = sid;
    return sid;
  };

  // Helper to send event payload
  const trackEvent = async (payload) => {
    if (typeof window === 'undefined') return;

    const sid = getOrCreateSessionId();
    const fullUrl = window.location.href;
    const currentPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Client-side debounce check: prevent rapid duplicate triggers
    const debounceKey = `${payload.eventType}_${currentPath}_${payload.elementText || ''}`;
    const now = Date.now();
    const lastSentTime = lastTrackedMapRef.current.get(debounceKey) || 0;
    if (now - lastSentTime < CLIENT_DEBOUNCE_MS) {
      return; // Deduplicated on client
    }
    lastTrackedMapRef.current.set(debounceKey, now);

    const eventData = {
      sessionId: sid,
      eventType: payload.eventType || 'custom',
      url: fullUrl,
      path: currentPath,
      referrer: payload.referrer !== undefined ? payload.referrer : (previousPathRef.current || document.referrer || null),
      elementText: payload.elementText || null,
      elementSelector: payload.elementSelector || null,
      metadata: payload.metadata || {},
      userAgent: window.navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    try {
      // First try sending via relative /api rewrite proxy
      let response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
        keepalive: true,
      });

      // If relative API call fails or 404s (if not rewritten), fallback to NEXT_PUBLIC_API_URL
      if (!response.ok && response.status === 404 && process.env.NEXT_PUBLIC_API_URL) {
        const fallbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`;
        await fetch(fallbackUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventData),
          keepalive: true,
        });
      }
    } catch (err) {
      // If relative fetch fails, try direct backend fetch
      if (process.env.NEXT_PUBLIC_API_URL) {
        try {
          const fallbackUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`;
          await fetch(fallbackUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(eventData),
            keepalive: true,
          });
        } catch (e) {
          // silently ignore tracker network issues to never disrupt user experience
        }
      }
    }
  };

  // 1. Track Page View on Route Change
  useEffect(() => {
    if (!pathname) return;

    trackEvent({
      eventType: 'pageview',
      referrer: previousPathRef.current || document.referrer || null,
    });

    // Update path refs after tracking
    const newPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    if (currentPathRef.current !== newPath) {
      previousPathRef.current = currentPathRef.current;
      currentPathRef.current = newPath;
    }
  }, [pathname, searchParams]);

  // 2. Track Global Interactive Clicks (Buttons, Links, Submit actions, Copy actions)
  useEffect(() => {
    const handleGlobalClick = (e) => {
      try {
        const target = e.target?.closest?.('a, button, input[type="submit"], [role="button"], [data-copy]');
        if (!target) return;

        const tagName = target.tagName.toLowerCase();
        const text =
          target.innerText?.trim() ||
          target.getAttribute('aria-label')?.trim() ||
          target.getAttribute('title')?.trim() ||
          target.value?.trim() ||
          (tagName === 'a' ? target.getAttribute('href') : 'button');

        // Ignore empty or dummy anchor clicks if desired, or keep to see exact user behavior
        if (!text || text.length > 150) return;

        const elementSelector = [
          tagName,
          target.id ? `#${target.id}` : '',
          target.className && typeof target.className === 'string'
            ? `.${target.className.split(' ').filter(Boolean).slice(0, 2).join('.')}`
            : '',
        ].join('');

        const sectionEl = target.closest('section, header, footer, nav, [data-section]');
        let sectionName = 'main_content';
        if (sectionEl) {
          sectionName = sectionEl.getAttribute('data-section') || sectionEl.id || sectionEl.tagName.toLowerCase();
        }

        const copyAttr = target.getAttribute('data-copy');
        if (copyAttr) {
          const copyText = target.getAttribute('data-copy-text') || text;
          try {
            navigator.clipboard.writeText(copyText);
            // Optional: simple visual feedback
            const originalText = target.innerText;
            if (target.tagName.toLowerCase() !== 'i' && !target.querySelector('i')) {
              target.innerText = 'Copied!';
              setTimeout(() => { target.innerText = originalText; }, 2000);
            }
          } catch (e) {}

          trackEvent({
            eventType: 'copy',
            elementText: copyText,
            elementSelector: elementSelector,
            metadata: {
              type: copyAttr,
              section: sectionName,
            },
          });
          e.preventDefault();
          e.stopPropagation();
          return;
        }

        trackEvent({
          eventType: tagName === 'a' ? 'link_click' : 'button_click',
          elementText: text,
          elementSelector: elementSelector,
          metadata: {
            href: target.getAttribute('href') || null,
            section: sectionName,
          },
        });
      } catch (err) {
        // ignore click handler errors
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, [pathname]);

  return null;
}
export default ActivityTracker;
