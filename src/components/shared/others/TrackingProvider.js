'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { trackEvent, getSessionId } from '@/lib/tracking';

export default function TrackingProvider() {
  const pathname = usePathname();

  // Track page view
  useEffect(() => {
    trackEvent({ eventType: 'page_view', page: pathname, buttonName: 'page_view', sessionId: getSessionId() });
  }, [pathname]);

  // Click Interceptor
  useEffect(() => {
    const handleClick = (e) => {
      let el = e.target;
      while (el && el !== document.body) {
        const dataTrack = el.getAttribute?.('data-track');
        if (dataTrack) {
          trackEvent({ eventType: 'click', page: pathname, buttonName: dataTrack, sessionId: getSessionId() });
          return;
        }

        const dataCopy = el.getAttribute?.('data-copy');
        if (dataCopy) {
          const buttonName = dataCopy.toLowerCase() === 'phone' ? 'footer_phone_copy' : 'footer_email_copy';
          trackEvent({ eventType: 'click', page: pathname, buttonName, sessionId: getSessionId() });
          return;
        }
        
        // Auto capture phone/email link clicks
        if (el.tagName === 'A') {
          if (el.href?.startsWith('tel:')) {
            trackEvent({ eventType: 'click', page: pathname, buttonName: 'footer_phone', sessionId: getSessionId() });
            return;
          }
          if (el.href?.startsWith('mailto:')) {
            trackEvent({ eventType: 'click', page: pathname, buttonName: 'footer_email', sessionId: getSessionId() });
            return;
          }
        }
        el = el.parentElement;
      }
    };

    document.addEventListener('click', handleClick, { passive: true });
    return () => document.removeEventListener('click', handleClick);
  }, [pathname]);

  return null;
}
