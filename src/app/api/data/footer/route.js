import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fields = searchParams.get('fields');
    const collection = 'footer';

    // Build query parameters
    const params = new URLSearchParams();
    if (fields) {
      params.append('fields', fields);
    }

    // Proxy to CMS_BAAS API
    const cmsResponse = await fetch(
      `${process.env.CMS_BASE_URL}/api/data/${collection}?${params.toString()}`
    );

    if (!cmsResponse.ok) {
      throw new Error(`CMS API error: ${cmsResponse.status}`);
    }

    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Footer Data API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch footer data' },
      { status: 500 }
    );
  }
}
