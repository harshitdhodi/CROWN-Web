import getBannerData from "@/lib/getBannerData";
import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import TeamDetails1 from "@/components/sections/teams/TeamDetails1";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getTeamMembers from "@/libs/getTeamMembers";
import { notFound } from "next/navigation";
const items = getTeamMembers();

export default async function TeamDetails({ params }) {
	const banner = await getBannerData(`/team/${params.id}`);
	const bannerTitle = banner?.title || "Team details";
	let bgImage = "/images/bg/bg.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	const { id } = await params;

	const isExistItem = items?.find(({ id: id1 }) => id1 === parseInt(id));
	if (!isExistItem) {
		notFound();
	}
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
						<TeamDetails1 currentItemId={parseInt(id)} />

					</main>
					<Footer8 />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}
export async function generateStaticParams() {
	return items?.map(({ id }) => ({ id: id.toString() }));
}
