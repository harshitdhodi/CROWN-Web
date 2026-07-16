import { NextResponse } from 'next/server';

const CMS_BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";

export async function POST(request) {
  try {
    const contentType = request.headers.get('content-type') || '';
    let payload;

    if (contentType.includes('multipart/form-data')) {
      // Next.js App Router native way to handle multipart/form-data (equivalent to multer)
      payload = await request.formData();

      const name = payload.get('name');
      const email = payload.get('email');
      const position = payload.get('position');
      const cvFile = payload.get('cv_file');

      if (!name || !email || !position) {
        return NextResponse.json({ success: false, error: 'Name, email, and position are required' }, { status: 400 });
      }

      // Validate that the uploaded file is a PDF
      if (cvFile && cvFile instanceof File && cvFile.type !== 'application/pdf') {
        return NextResponse.json({ success: false, error: 'Only PDF files are allowed for resume' }, { status: 400 });
      }
    } else {
      payload = await request.json();
      const { name, email, position } = payload;
      if (!name || !email || !position) {
        return NextResponse.json({ success: false, error: 'Name, email, and position are required' }, { status: 400 });
      }
    }

    // Proxy request to CMS_BAAS
    const response = await fetch(`${CMS_BASE_URL}/api/career-application`, {
      method: 'POST',
      // When passing a FormData object to fetch, it automatically sets the correct 
      // content-type header with the multipart boundary.
      body: payload instanceof FormData ? payload : JSON.stringify(payload),
      headers: payload instanceof FormData ? {} : { 'Content-Type': 'application/json' },
    });

    const result = await response.json();

    // Forward the response from CMS_BAAS
    return NextResponse.json(result, {
      status: response.ok ? 200 : response.status,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });

  } catch (error) {
    console.error('Career Application Proxy Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to submit application'
    }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
