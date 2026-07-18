import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");

		const url = slug
			? `${process.env.CMS_BASE_URL}/api/data/service?slug=${encodeURIComponent(slug)}`
			: `${process.env.CMS_BASE_URL}/api/data/service`;

		const cmsResponse = await fetch(url);

		if (!cmsResponse.ok) {
			// If the collection doesn't exist yet in the CMS, return empty data gracefully
			if (cmsResponse.status === 404) {
				console.warn("Service collection not found in CMS (404). Returning empty data.");
				return NextResponse.json(
					{ success: true, data: [] },
					{ status: 200 }
				);
			}
			throw new Error(`CMS API error: ${cmsResponse.status}`);
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Service Data API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch service data" },
			{ status: 500 }
		);
	}
}
