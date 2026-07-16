import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	try {
		const { slug } = await params;
		const { searchParams } = new URL(request.url);
		const exclude = searchParams.get("exclude") || "";

		const url = `${process.env.CMS_BASE_URL}/api/blogs/recent/${encodeURIComponent(slug)}${exclude ? "?exclude=true" : ""}`;

		const cmsResponse = await fetch(url, { next: { revalidate: 3600 } });

		if (!cmsResponse.ok) {
			return NextResponse.json({ success: true, data: [] }, { status: 200 });
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Recent Blogs API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch recent blogs" },
			{ status: 500 }
		);
	}
}
