export function getCmsBase(requestUrl) {
  // 1. Browser check
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'http://localhost:3012';
    }
  }

  // 2. Request URL check (Middleware/Proxy context)
  if (requestUrl) {
    try {
      const urlObj = new URL(requestUrl);
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return 'http://localhost:3012';
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Node environment check
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3012';
  }

  // 4. Default to configured env variables or production fallback
  return process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3012';
}

export function getSiteUrl(requestUrl) {
  // 1. Browser check
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
  }

  // 2. Request URL check (Middleware/Proxy context)
  if (requestUrl) {
    try {
      const urlObj = new URL(requestUrl);
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return urlObj.origin;
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Node environment check
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3011';
  }

  // 4. Default fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wiretex.com';
}
