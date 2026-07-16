import { NextRequest, NextResponse } from 'next/server';

export async function POST(request) {
  try {
    let body;
    
    try {
      // Try to parse as JSON directly
      body = await request.json();
      console.log('Parsed body directly:', body);
    } catch (jsonError) {
      console.log('Failed to parse as JSON, trying text:', jsonError.message);
      
      // If direct parse fails, try text
      const text = await request.text();
      console.log('Raw request body (text):', text);
      
      if (text) {
        try {
          body = JSON.parse(text);
          console.log('Parsed from text:', body);
        } catch (parseError) {
          console.error('Failed to parse request body:', parseError);
          return NextResponse.json(
            { success: false, error: 'Invalid request format' },
            { status: 400 }
          );
        }
      } else {
        body = {};
      }
    }

    // Validation logic removed as requested

    // Proxy to CMS_BAAS API
    const cmsResponse = await fetch(
      `${process.env.CMS_BASE_URL}/api/contact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    console.log('CMS Response status:', cmsResponse.status);
    
    let cmsData;
    try {
      cmsData = await cmsResponse.json();
    } catch (jsonError) {
      console.error('Failed to parse CMS response:', jsonError);
      return NextResponse.json(
        { success: false, error: 'Invalid CMS response' },
        { status: 500 }
      );
    }
    
    console.log('CMS Response data:', cmsData);
    
    return NextResponse.json(cmsData, { status: cmsResponse.status });
  } catch (error) {
    console.error('Contact Form API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  const response = NextResponse.json({ success: true });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
