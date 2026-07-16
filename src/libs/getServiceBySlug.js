const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";

const resolveImage = (imagePath) => {
	if (!imagePath) return "/images/service/service-1.webp";
	return imagePath.startsWith("http") ? imagePath : `${cmsBaseUrl}${imagePath}`;
};

const getServiceBySlug = async (slug) => {
	try {
		const res = await fetch(
			`${cmsBaseUrl}/api/data/service?slug=${encodeURIComponent(slug)}`,
			{ next: { revalidate: 3600 } }
		);

		if (!res.ok) {
			console.error(`Failed to fetch service by slug "${slug}": ${res.status}`);
			return null;
		}

		const { success, data } = await res.json();
		console.log("data",data)
		if (!success || !Array.isArray(data) || data.length === 0) return null;

		const item = data[0];
		return {
			id: item.id,
			title: item.title,
			shortTitle: item.short_title || item.title,
			slug: item.slug,
			desc: item.description || "",
			longDescription: item.long_description || "",
			img: resolveImage(item.image),
			img2: resolveImage(item.image),
			iconImg: resolveImage(item.icon_image),
			created_at: item.created_at,
			metatitle: item.metatitle || "",
			meta_description: item.meta_description || "",
			meta_keyword: item.meta_keyword || [],
			canonical_link: item.canonical_link || "",
			schema: item.schema || "",
		};
	} catch (error) {
		console.error("Error fetching service by slug:", error);
		return null;
	}
};

export default getServiceBySlug;
