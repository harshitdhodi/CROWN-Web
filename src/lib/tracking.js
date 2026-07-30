const ADMIN_URL = typeof window !== 'undefined' ? '' : (process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3014');

export function trackEvent({ eventType = 'click', page, buttonName, sessionId, metadata }) {
  try {
    const payload = {
      eventType,
      page: page || (typeof window !== 'undefined' ? window.location.pathname : '/'),
      buttonName: buttonName || null,
      sessionId: sessionId || null,
      metadata: metadata || null,
    };

    fetch(`${ADMIN_URL}/api/tracking/track-event`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true, // Persists fetch even if page unloads
    }).catch(() => {});
  } catch {}
}

export function getSessionId() {
  if (typeof window === 'undefined') return null;
  try {
    let sid = sessionStorage.getItem('_crown_sid');
    if (!sid) {
      sid = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem('_crown_sid', sid);
    }
    return sid;
  } catch { return null; }
}
