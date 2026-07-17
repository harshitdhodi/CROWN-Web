import Testimonials4Client from "./Testimonials4Client";
import getBannerData from "@/lib/getBannerData";

async function getProducts() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/data/our_products`, { next: { revalidate: 60 } });
		const result = await res.json();
		if (result.success && Array.isArray(result.data)) {
			return result.data;
		}
	} catch (e) {
		console.error("Failed to fetch products for Testimonials4 form", e);
	}
	return [];
}

const Testimonials4 = async () => {
	const products = await getProducts();
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
			initialProducts={products}
			bannerTitle={bannerTitle}
			bgImage={bgImage}
		/>
	);
};

export default Testimonials4;

