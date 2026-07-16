const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";

const resolveImage = (imagePath) => {
	if (!imagePath) return "/images/service/service-1.webp";
	return imagePath.startsWith("http") ? imagePath : `${cmsBaseUrl}${imagePath}`;
};

const getALlServices = async () => {
	try {
		const res = await fetch(`${cmsBaseUrl}/api/data/service`, {
			next: { revalidate: 3600 },
		});

		if (!res.ok) {
			console.error(`Failed to fetch services: ${res.status}`);
			return [];
		}

		const { success, data } = await res.json();
		if (!success || !Array.isArray(data)) return [];

		return data.map((item) => ({
			id: item.id,
			title: item.title,
			shortTitle: item.short_title || item.title,
			slug: item.slug,
			desc: item.description || "",
			img: resolveImage(item.image),
			img2: resolveImage(item.image),
			iconImg: resolveImage(item.icon_image),
			created_at: item.created_at,
		}));
	} catch (error) {
		console.error("Error fetching services:", error);
		return [];
	}
};

export default getALlServices;
