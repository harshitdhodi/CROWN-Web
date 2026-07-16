import Testimonials6Client from "./Testimonials6Client";

async function getTestimonialsData() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const [leftRes, rightRes] = await Promise.all([
			fetch(`${baseUrl}/api/data/review_left`, { next: { revalidate: 60 } }),
			fetch(`${baseUrl}/api/data/review_right`, { next: { revalidate: 60 } })
		]);
		
		const leftJson = await leftRes.json();
		const rightJson = await rightRes.json();

		let leftData = null;
		let reviews = [];

		if (leftJson?.success && leftJson.data?.length > 0) {
			leftData = leftJson.data[0];
		}
		if (rightJson?.success) {
			reviews = rightJson.data;
		}

		return { leftData, reviews };
	} catch (e) {
		console.error("Failed to fetch testimonials data", e);
		return { leftData: null, reviews: [] };
	}
}

const Testimonials6 = async () => {
	const { leftData, reviews } = await getTestimonialsData();
	return <Testimonials6Client leftData={leftData} reviews={reviews} />;
};

export default Testimonials6;

