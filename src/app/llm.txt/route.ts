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
      if (json.success && json.data?.llmTxt) {
        return new NextResponse(json.data.llmTxt, {
          headers: { 'Content-Type': 'text/plain; charset=utf-8' }
        });
      }
    }
  } catch (err) {
    console.error('Failed to fetch llm.txt settings:', err);
  }

  // Fallback llm.txt content
  const fallback = `# Wiretex Manufacturing\n\nWiretex is a leading manufacturer of high-quality industrial components.`;
  return new NextResponse(fallback, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' }
  });
}
