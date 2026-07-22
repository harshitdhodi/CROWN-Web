import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const page = searchParams.get("page");
        const baseUrl = process.env.CMS_BASE_URL || "http://localhost:3014";

		const url = page
			? `${baseUrl}/api/data/6a60792eb87d2ddb4478ccef?page=${encodeURIComponent(page)}`
			: `${baseUrl}/api/data/6a60792eb87d2ddb4478ccef`;

		const cmsResponse = await fetch(url, { next: { revalidate: 0 } });

		if (!cmsResponse.ok) {
			throw new Error(`CMS API error: ${cmsResponse.status}`);
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Faq Data API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch faq data" },
			{ status: 500 }
		);
	}
}

// trigger rebuild
