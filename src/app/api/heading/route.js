import { NextRequest, NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { success: false, error: 'Section name is required' },
        { status: 400 }
      );
    }

    // Proxy to CMS_BAAS API
    const cmsResponse = await fetch(
      `${process.env.CMS_BASE_URL}/api/heading?section=${section}`
    );

    if (!cmsResponse.ok) {
      throw new Error(`CMS API error: ${cmsResponse.status}`);
    }

    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Heading API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch heading data' },
      { status: 500 }
    );
  }
}
