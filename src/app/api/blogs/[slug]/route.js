import { NextResponse } from "next/server";

export async function GET(request, { params }) {
	try {
		const { slug } = await params;

		const cmsResponse = await fetch(
			`${process.env.CMS_BASE_URL}/api/blogs/${encodeURIComponent(slug)}`,
			{ next: { revalidate: 3600 } }
		);

		if (!cmsResponse.ok) {
			return NextResponse.json(
				{ success: false, error: "Blog not found" },
				{ status: cmsResponse.status }
			);
		}

		const data = await cmsResponse.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Blog Detail API Error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch blog" },
			{ status: 500 }
		);
	}
}
