import { NextResponse } from "next/server";

export async function GET() {
	try {
		const res = await fetch(`${process.env.CMS_BASE_URL}/api/data/catalogue`, {
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			throw new Error(`CMS error: ${res.status}`);
		}

		const data = await res.json();
		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Catalogue API error:", error);
		return NextResponse.json(
			{ success: false, error: "Failed to fetch catalogue data" },
			{ status: 500 }
		);
	}
}
