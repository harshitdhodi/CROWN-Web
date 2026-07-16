const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";

const getCareers = async () => {
	try {
		const response = await fetch(`${cmsBaseUrl}/api/data/career-info`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		if (!data?.success || !data.data) {
			return [];
		}

		// Transform CMS data to match component expectations
		const transformed = data.data.map(item => ({
			id: item.id,
			slug: item.slug,
			title: item.title,
			iconName: "tji-manage",
			category: item.isurgent ? "Urgent" : "",
			need: item.isurgent ? "Urgent" : "",
			location: item.location || "",
			salary: item.salary_,
			duration: item.duration,
			onsite: item.onsite,
			remote: item.remote,
			details: item.details,
			image: item.image?.[0],
			hover_image: item.hover_image?.[0],
			tags: [
				...(item.isurgent ? [{ label: "Urgent" }] : []),
				...(item.onsite ? [{ label: "Onsite" }] : []),
				...(item.remote ? [{ label: "Remote" }] : []),
			],
		}));

		return transformed;
	} catch (error) {
		console.error("Error fetching careers:", error);
		return [];
	}
};

export default getCareers;
