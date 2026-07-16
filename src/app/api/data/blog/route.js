import { NextResponse } from "next/server";

export async function GET(request) {
	try {
		const { searchParams } = new URL(request.url);
		const slug = searchParams.get("slug");

		const url = slug
			? `${process.env.CMS_BASE_URL}/api/data/blog?slug=${encodeURIComponent(slug)}`
			: `${process.env.CMS_BASE_URL}/api/data/blog`;

		const cmsResponse = await fetch(url, { next: { revalidate: 3600 } });

		if (!cmsResponse.ok) {
			throw new Error(`CMS API error: ${cmsResponse.status}`);
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Blog Data API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch blog data" },
			{ status: 500 }
		);
	}
}
