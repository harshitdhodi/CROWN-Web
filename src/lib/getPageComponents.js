const formatStyleValue = (val) => {
	if (!val) return "";
	const trimmed = String(val).trim();
	if (!trimmed) return "";
	// If the value is purely numeric, append "px" so it is valid CSS
	if (/^\d+$/.test(trimmed)) {
		return `${trimmed}px`;
	}
	return trimmed;
};

export default async function getPageComponents(pageSlug, defaultOrder = []) {
	try {
		// Server-side fetch goes directly to CMS (bypasses the client-side proxy rewrite)
		// Set CMS_BASE_URL in bexon .env if CMS runs on a different host/port
		const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";
		const res = await fetch(`${cmsBase}/api/page-components?page=${pageSlug}`, {
			cache: "no-store",
		});
		if (!res.ok) throw new Error(`CMS returned ${res.status}`);
		const json = await res.json();
		console.log(`[CMS getPageComponents ${pageSlug}] components:`, json?.data?.map(c => ({ key: c.key, is_active: c.is_active, order: c.order })));
		if (json.success && Array.isArray(json.data) && json.data.length > 0) {
			return json.data
				.filter((c) => c.is_active)
				.sort((a, b) => a.order - b.order)
				.map((c) => ({
					key: c.key,
					margin_top: formatStyleValue(c.margin_top),
					margin_bottom: formatStyleValue(c.margin_bottom),
					padding_top: formatStyleValue(c.padding_top),
					padding_bottom: formatStyleValue(c.padding_bottom)
				}));
		}
	} catch (err) {
		// CMS unreachable — fall back to default order (all visible)
		console.warn(`[${pageSlug}] Could not fetch page components from CMS:`, err?.message);
	}
	return defaultOrder.map(key => ({ key, is_active: true }));
}
