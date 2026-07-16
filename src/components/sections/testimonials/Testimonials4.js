import Testimonials4Client from "./Testimonials4Client";
import getBannerData from "@/lib/getBannerData";

async function getServices() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/data/service`, { next: { revalidate: 60 } });
		const result = await res.json();
		if (result.success && Array.isArray(result.data)) {
			return result.data;
		}
	} catch (e) {
		console.error("Failed to fetch services for Testimonials4 form", e);
	}
	return [];
}

const Testimonials4 = async () => {
	const services = await getServices();
	const banner = await getBannerData("/");

	const bannerTitle = banner?.title || "Drop us a Line Here.";
	let bgImage = "/images/cta/CTA.png";

	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	return (
		<Testimonials4Client
			initialServices={services}
			bannerTitle={bannerTitle}
			bgImage={bgImage}
		/>
	);
};

export default Testimonials4;

