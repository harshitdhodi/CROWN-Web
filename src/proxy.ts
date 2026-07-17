import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCmsBase } from './lib/seoConfig';

const PAGE_KEY_TO_ROUTE: Record<string, string> = {
  'home-02': '/',
  'about-us': '/about-us',
  'blogs': '/blogs',
  'careers': '/careers',
  'contact': '/contact',
  'events': '/events',
  'downloads': '/downloads',
  'global-presence': '/global-presence',
  'industry-solutions': '/industry-solutions',
  'manufacturing-infrastructure': '/manufacturing-infrastructure',
  'products': '/products',
  'quality-certification': '/quality-certification',
  'terms-and-conditions': '/terms-and-conditions',
};

const ROUTE_TO_PAGE_KEY = Object.entries(PAGE_KEY_TO_ROUTE).reduce((acc, [key, route]) => {
  acc[route] = key;
  return acc;
}, {} as Record<string, string>);

let hiddenPagesCache: Set<string> | null = null;
let lastCacheTime = 0;
const CACHE_DURATION = 60000; // 1 minute cache

async function fetchHiddenPages(cmsBase: string): Promise<Set<string>> {
  const now = Date.now();
  if (hiddenPagesCache && now - lastCacheTime < CACHE_DURATION) {
    return hiddenPagesCache;
  }

  try {
    const res = await fetch(`${process.env.API_URL}/api/page-visibility`, {
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      console.warn(`Page visibility API returned ${res.status}`);
      return new Set();
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('Page visibility API did not return JSON');
      return new Set();
    }

    const json = await res.json();
    
    if (json.success && Array.isArray(json.data)) {
      const hiddenSet = new Set<string>();
      json.data.forEach((page: any) => {
        if (page.is_hidden) {
          hiddenSet.add(page.key);
        }
      });
      hiddenPagesCache = hiddenSet;
      lastCacheTime = now;
      return hiddenSet;
    }
  } catch (err) {
    console.warn('Failed to fetch page visibility:', (err as Error).message);
  }
  
  return new Set();
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // Skip internal next.js, static files, and api requests
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/css') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/fonts') ||
    pathname.startsWith('/video') ||
    pathname.includes('.') // matches favicon.ico, sitemap.xml, robots.txt, etc.
  ) {
    return NextResponse.next();
  }

  const cmsBase = getCmsBase(request.url);

  // Check page visibility before SEO redirect
  const pageKey = ROUTE_TO_PAGE_KEY[pathname];
  if (pageKey) {
    const hiddenPages = await fetchHiddenPages(cmsBase);
    if (hiddenPages.has(pageKey)) {
      console.log(`[Page Visibility] Redirecting hidden page ${pathname} to home`);
      return NextResponse.redirect(new URL('/', request.url));
    }
  }
  
  try {
    const fullPath = `${pathname}${search}`;
    const resolveUrl = `${cmsBase}/api/seo/resolve?url=${encodeURIComponent(fullPath)}`;
    
    // Call the fast resolve API with a short timeout to prevent slow page load
    const response = await fetch(resolveUrl, {
      signal: AbortSignal.timeout(2000),
      next: { revalidate: 60 } // cache for 1 minute to prevent database thrashing
    });
    
    if (response.ok) {
      const json = await response.json();
      
      if (json.success && json.data) {
        const { targetUrl, statusCode } = json.data;
        
        let destination = targetUrl;
        // If relative target, resolve to absolute URL using request origin
        if (!destination.startsWith('http')) {
          destination = new URL(destination.startsWith('/') ? destination : `/${destination}`, request.url).toString();
        }
        
        console.log(`[SEO Redirect] Redirecting ${pathname} to ${destination} with status ${statusCode}`);
        return NextResponse.redirect(destination, Number(statusCode || 301));
      }
    }
  } catch (err) {
    // Fail silently to ensure site is functional even if CMS resolves slowly
    console.error('Proxy redirect check failed:', err);
  }

  return NextResponse.next();
}

// Apply proxy to all routes except standard static patterns
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
