import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET /api/colors
 * Proxies the color palette from the CMS so the frontend can fetch it
 * without exposing the CMS base URL to the browser.
 */
export async function GET() {
  try {
    const cmsBase = process.env.CMS_BASE_URL || 'http://localhost:3012';
    const res = await fetch(`${cmsBase}/api/colors`, {
      // No cache on the proxy — the SSR path in layout.js handles revalidation
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json(
        { success: false, error: `CMS responded with ${res.status}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[/api/colors] Failed to proxy colors from CMS:', err?.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch colors' },
      { status: 500 }
    );
  }
}
