import JourneyClient from "./JourneyClient";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getJourneyData() {
	try {
		const [cardsRes, headingRes] = await Promise.all([
			fetch(`${BASE_URL}/api/data/journey`, { next: { revalidate: 60 } }),
			fetch(`${BASE_URL}/api/heading?section=journey`, { next: { revalidate: 60 } }),
		]);

		const cardsData = cardsRes.ok ? await cardsRes.json() : null;
		const headingData = headingRes.ok ? await headingRes.json() : null;

		const raw = cardsData?.success ? cardsData.data : [];
		return {
			items: [...raw].reverse(),
			heading: headingData?.success ? headingData.data : null,
		};
	} catch (err) {
		console.error("Failed to fetch journey data:", err);
		return { items: [], heading: null };
	}
}

const Journey = async () => {
	const { items, heading } = await getJourneyData();
	return <JourneyClient items={items} heading={heading} />;
};

export default Journey;
