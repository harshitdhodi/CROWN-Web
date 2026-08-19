import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collection = searchParams.get('collection') || 'resources';
    const baseUrl = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3014';

    // Proxy to CMS_BAAS API
    const cmsResponse = await fetch(
      `${baseUrl}/api/data/${collection}`,
      { next: { revalidate: 0 } }
    );

    if (!cmsResponse.ok) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 });
    }

    const data = await cmsResponse.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Resources API Error:', error);
    return NextResponse.json(
      { success: true, data: [] },
      { status: 200 }
    );
  }
}
