import Services3Client from "./Services3Client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetchCollectionData(collectionName) {
	const urls = [
		`${BASE_URL}/api/data/${collectionName}`,
		`http://localhost:3014/api/data/${collectionName}`,
		`http://127.0.0.1:3014/api/data/${collectionName}`,
	];

	for (const url of urls) {
		try {
			const res = await fetch(url, { next: { revalidate: 0 } });
			if (!res.ok) continue;
			const json = await res.json().catch(() => null);
			if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
				return json.data;
			}
		} catch (e) {
			// ignore and try next fallback
		}
	}
	return [];
}

const DEFAULT_SERVICES = [
	{
		id: "dummy-s1",
		title: "Pharmaceutical Packaging",
		desc: "High-barrier packaging solutions designed for maximum moisture and light protection.",
		img2: "/images/service/service-1.webp",
		color_img: "/uploads/1784022526764-ulwmtlxm1wd.webp",
		hover_img: "/uploads/1784022526868-aw0l3jrdpkm.webp"
	},
	{
		id: "dummy-s2",
		title: "Nutraceutical Packaging",
		desc: "Custom compliance bottles and jars engineered for vitamins and supplements.",
		img2: "/images/service/service-2.webp",
		color_img: "/uploads/1784022526868-aw0l3jrdpkm.webp",
		hover_img: "/uploads/1784022526957-1fy7nsuszva.webp"
	},
	{
		id: "dummy-s3",
		title: "Food & Beverage Containers",
		desc: "Food-grade PET and HDPE rigid packaging certified for safety and freshness.",
		img2: "/images/service/service-3.webp",
		color_img: "/uploads/1784022526957-1fy7nsuszva.webp",
		hover_img: "/uploads/1784022527029-idmroj19jjp.webp"
	},
	{
		id: "dummy-s4",
		title: "Chemical & Industrial Solutions",
		desc: "Heavy-duty chemical-resistant jerrycans and drums tailored for agrochemicals.",
		img2: "/images/service/service-4.webp",
		color_img: "/uploads/1784022527029-idmroj19jjp.webp",
		hover_img: "/uploads/1784022526764-ulwmtlxm1wd.webp"
	}
];

import { resolveCmsImage } from "@/lib/seoConfig";

async function getServices() {
	try {
		let data = [];
		for (const col of ["industry", "services3", "services"]) {
			data = await fetchCollectionData(col);
			if (data.length > 0) break;
		}

		if (!data || data.length === 0) {
			return DEFAULT_SERVICES;
		}

		return data.slice(0, 4).map((item, idx) => {
			const fallbackImg = `/images/service/service-${(idx % 4) + 1}.webp`;
			return {
				id: item.id || item._id,
				title: item.title || item.heading || "",
				desc: item.description || item.desc || "",
				img2: resolveCmsImage(item.image || item.img2 || item.color_img) || fallbackImg,
				color_img: resolveCmsImage(item.color_img || item.image || item.img2) || fallbackImg,
				hover_img: resolveCmsImage(item.hover_img || item.color_img || item.image || item.img2) || fallbackImg,
				iconName: item.iconName || null,
				year: item.year || null,
			};
		});
	} catch (e) {
		console.error("Failed to fetch services3 data:", e);
		return DEFAULT_SERVICES;
	}
}

async function getHeading() {
	try {
		const res = await fetch(`${BASE_URL}/api/heading?section=industries-we-serve`, { next: { revalidate: 0 } });
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
			fetch(`${BASE_URL}/api/data/journey`, { next: { revalidate: 0 } }),
			fetch(`${BASE_URL}/api/heading?section=journey`, { next: { revalidate: 0 } }),
		]);
		const cardsData = cardsRes.ok ? await cardsRes.json() : null;
		const headingData = headingRes.ok ? await headingRes.json() : null;

		const raw = cardsData?.success ? cardsData.data : [];
		const services = [...raw].reverse().map((item) => ({
			id: item.id,
			title: item.heading || "",
			desc: item.description || "",
			year: item.year || "",
			img2: item.image || "",
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
