import { NextResponse } from "next/server";

export async function GET(request) {
	try {
        const baseUrl = process.env.CMS_BASE_URL || "http://localhost:3014";
		const url = `${baseUrl}/api/data/6a60792eb87d2ddb4478ccee`;
		const cmsResponse = await fetch(url, { next: { revalidate: 3600 } });

		if (!cmsResponse.ok) {
			throw new Error(`CMS API error: ${cmsResponse.status}`);
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Faq Info Data API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch faq info data" },
			{ status: 500 }
		);
	}
}

// trigger rebuild
