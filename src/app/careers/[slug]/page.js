import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import CareerDetails1 from "@/components/sections/careers/CareerDetails1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { notFound } from "next/navigation";
import getCareers from "@/libs/getCareers";
import getPreviousNextItem from "@/libs/getPreviousNextItem";
import Footer8 from "@/components/layout/footer/Footer8";

const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";

export default async function CareerDetails({ params }) {
	const banner = await getBannerData(`/careers/${params.slug}`);
	const bannerTitle = banner?.title || "Careers Details";
	let bgImage = "/images/bg/bg.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	const { slug } = await params;
	const items = await getCareers();

	const isExistItem = items?.find(({ slug: itemSlug }) => itemSlug === slug);
	if (!isExistItem) {
		notFound();
	}

	// Get previous/next items
	const currentIndex = items?.findIndex(({ slug: itemSlug }) => itemSlug === slug);
	const { prevId, nextId, currentItem: prevNextItem, isPrevItem, isNextItem } = getPreviousNextItem(items, currentIndex + 1);

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} />
						<CareerDetails1 currentItemId={isExistItem} prevId={prevId} nextId={nextId} isPrevItem={isPrevItem} isNextItem={isNextItem} />
						<Cta />
					</main>
					<Footer8 />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}

export async function generateStaticParams() {
	try {
		const response = await fetch(`${cmsBaseUrl}/api/data/career-info`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		const items = data?.success ? data.data : [];
		return items?.map((item) => ({ slug: item.slug })) || [];
	} catch (error) {
		console.error("Error fetching careers for static params:", error);
		return [];
	}
}
