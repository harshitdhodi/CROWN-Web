export default async function getBannerData(pageRoute) {
	if (!pageRoute) return null;
	try {
		const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";
		const res = await fetch(`${cmsBase}/api/data/banner?page=${encodeURIComponent(pageRoute)}`, {
			next: { revalidate: 60 }
		});
		if (res.ok) {
			const json = await res.json();
			if (json.success && json.data && json.data.length > 0) {
				return json.data[0];
			}
		}
	} catch (e) {
		console.warn("Failed to fetch banner for", pageRoute, e.message);
	}
	return null;
}
