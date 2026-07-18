import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

export default async function getBannerData(pageRoute) {
	if (!pageRoute) return null;
	try {
		const cmsBase = getCmsBase();
		const res = await fetch(`${cmsBase}/api/data/banner?page=${encodeURIComponent(pageRoute)}`, {
			next: { revalidate: 60 }
		});
		if (res.ok) {
			const json = await res.json();
			if (json.success && json.data && json.data.length > 0) {
				const banner = json.data[0];
				if (banner.image) {
					if (Array.isArray(banner.image)) {
						banner.image = banner.image.map(img => resolveCmsImage(img));
					} else {
						banner.image = [resolveCmsImage(banner.image)];
					}
				}
				return banner;
			}
		}
	} catch (e) {
		console.warn("Failed to fetch banner for", pageRoute, e.message);
	}
	return null;
}
