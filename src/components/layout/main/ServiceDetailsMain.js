import HeroInner from "@/components/sections/hero/HeroInner";
import ServicesDetailsPrimary from "@/components/sections/services/ServicesDetailsPrimary";
import getALlServices from "@/libs/getALlServices";
import getServiceBySlug from "@/libs/getServiceBySlug";
import getPreviousNextItem from "@/libs/getPreviousNextItem";
import getBannerData from "@/lib/getBannerData";

const ServiceDetailsMain = async ({ currentItemSlug }) => {
	// Fetch full detail (includes long_description) + all services in parallel
	const [currentItem, allItems] = await Promise.all([
		getServiceBySlug(currentItemSlug),
		getALlServices(),
	]);

	const currentId = currentItem?.id;

	// 5 "More Services" — exclude the current one
	const moreServices = allItems
		?.filter((item) => item.slug !== currentItemSlug)
		.slice(0, 5);

	const { prevSlug, nextSlug, isPrevItem, isNextItem } = getPreviousNextItem(
		allItems,
		currentId
	);

	const { title } = currentItem || {};

	// Fetch dynamic banner data for this specific service page
	const pageRoute = `/services/${currentItemSlug}`;
	const banner = await getBannerData(pageRoute);

	const bannerTitle = banner?.title || title || "Service Details";
	let bgImage = "/images/bg/wire-banner.png";

	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	return (
		<div>
			<HeroInner
				title={bannerTitle}
				text={bannerTitle}
				breadcrums={[{ name: "Services", path: "/services" }]}
				bgImage={bgImage}
			/>
			<ServicesDetailsPrimary
				option={{
					currentItem,
					moreServices,
					currentId,
					prevSlug,
					nextSlug,
					isPrevItem,
					isNextItem,
				}}
			/>
		</div>
	);
};

export default ServiceDetailsMain;
