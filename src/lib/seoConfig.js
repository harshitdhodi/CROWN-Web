export function getCmsBase(requestUrl) {
  // 1. Browser check
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014';
    }
  }

  // 2. Request URL check (Middleware/Proxy context)
  if (requestUrl) {
    try {
      const urlObj = new URL(requestUrl);
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014';
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Node environment check
  if (process.env.NODE_ENV === 'development') {
    return process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014';
  }

  // 4. Default to configured env variables or production fallback
  return process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014';
}

export function getSiteUrl(requestUrl) {
  // 1. Browser check
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    }
  }

  // 2. Request URL check (Middleware/Proxy context)
  if (requestUrl) {
    try {
      const urlObj = new URL(requestUrl);
      if (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1') {
        return process.env.NEXT_PUBLIC_BASE_URL || urlObj.origin;
      }
    } catch (e) {
      // ignore
    }
  }

  // 3. Node environment check
  if (process.env.NODE_ENV === 'development') {
    return process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3013';
  }

  // 4. Default fallback
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.demo.crownpack.in';
}

export function resolveCmsImage(src) {
  if (!src) return null;
  if (Array.isArray(src)) {
    return resolveCmsImage(src[0]);
  }
  if (typeof src !== "string") return null;
  let cleanSrc = src;
  if (src.includes("/uploads/")) {
    cleanSrc = "/uploads/" + src.split("/uploads/")[1];
  } else if (src.startsWith("http://") || src.startsWith("https://")) {
    if (src.includes("localhost") || src.includes("127.0.0.1")) {
      cleanSrc = "/uploads/" + src.split("/uploads/")[1];
    } else {
      return src;
    }
  }
  const imageBase = "https://demoadmin.crownpack.in";
  return cleanSrc.startsWith("/") ? `${imageBase}${cleanSrc}` : `${imageBase}/${cleanSrc}`;
}
