import Services3Client from "./Services3Client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getServices() {
	try {
		const res = await fetch(`${BASE_URL}/api/data/industry`, { next: { revalidate: 60 } });
		const result = await res.json();
		if (result.success && result.data) {
			return result.data.slice(0, 4).map((item) => ({
				id: item.id,
				title: item.title,
				desc: item.description,
				img2: item.image,
				color_img: item.color_img,
				hover_img: item.hover_img,
			}));
		}
	} catch (e) {
		console.error("Failed to fetch industry data:", e);
	}
	return [];
}

async function getHeading() {
	try {
		const res = await fetch(`${BASE_URL}/api/heading?section=industries-we-serve`, { next: { revalidate: 60 } });
		if (!res.ok) return null;
		const result = await res.json();
		return result?.success ? result.data : null;
	} catch (e) {
		console.error("Failed to fetch heading for Services3:", e);
		return null;
	}
}

async function getJourneyServices() {
	try {
		const [cardsRes, headingRes] = await Promise.all([
			fetch(`${BASE_URL}/api/data/journey`, { next: { revalidate: 60 } }),
			fetch(`${BASE_URL}/api/heading?section=journey`, { next: { revalidate: 60 } }),
		]);
		const cardsData = cardsRes.ok ? await cardsRes.json() : null;
		const headingData = headingRes.ok ? await headingRes.json() : null;

		const raw = cardsData?.success ? cardsData.data : [];
		const services = [...raw].reverse().map((item) => ({
			id:        item.id,
			title:     item.heading || "",
			desc:      item.description || "",
			year:      item.year || "",
			img2:      item.image || "",
			color_img: null,
			hover_img: null,
		}));

		return {
			services,
			heading: headingData?.success ? headingData.data : null,
		};
	} catch (e) {
		console.error("Failed to fetch journey data for Services3:", e);
		return { services: [], heading: null };
	}
}

// variant="journey" → fetches journey API, shows year badge instead of image (about-us page)
// default           → fetches industry API, shows image/icon (everywhere else)
const Services3 = async ({ variant } = {}) => {
	if (variant === "journey") {
		const { services, heading } = await getJourneyServices();
		return <Services3Client services={services} heading={heading} variant="journey" />;
	}

	const [services, heading] = await Promise.all([getServices(), getHeading()]);
	return <Services3Client services={services} heading={heading} />;
};

export default Services3;
