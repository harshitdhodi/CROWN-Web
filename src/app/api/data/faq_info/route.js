import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const baseUrl = process.env.CMS_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:3014";
		const url = `${baseUrl}/api/data/faq_info`;
		const cmsResponse = await fetch(url, { next: { revalidate: 0 } });

		if (!cmsResponse.ok) {
			return NextResponse.json({ success: true, data: [] }, { status: 200 });
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Faq Info Data API Error:", error);
		return NextResponse.json(
			{ success: true, data: [] },
			{ status: 200 }
		);
	}
}
