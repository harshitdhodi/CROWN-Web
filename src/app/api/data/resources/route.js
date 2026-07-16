import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'resources';

    // Proxy to CMS_BAAS API
    const cmsResponse = await fetch(
      `${process.env.CMS_BASE_URL}/api/data/${collection}`
    );

    if (!cmsResponse.ok) {
      throw new Error(`CMS API error: ${cmsResponse.status}`);
    }

    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Resources API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
