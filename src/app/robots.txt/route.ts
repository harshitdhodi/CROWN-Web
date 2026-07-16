import { NextResponse } from 'next/server';
import { getCmsBase } from '../../lib/seoConfig';

export async function GET(request: Request) {
  const cmsBase = getCmsBase(request.url);
  try {
    const res = await fetch(`${cmsBase}/api/seo/settings`, {
      next: { revalidate: 300 }
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data?.robotsTxt) {
        return new NextResponse(json.data.robotsTxt, {
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    }
  } catch (err) {
    console.error('Failed to fetch robots.txt settings:', err);
  }

  // Fallback robots.txt
  const fallback = `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /_next/\n\nSitemap: http://localhost:3011/sitemap.xml`;
  return new NextResponse(fallback, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
