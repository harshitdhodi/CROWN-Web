import getBannerData from "@/lib/getBannerData";

import Header from "@/components/layout/header/Header";
import Careers1 from "@/components/sections/careers/Careers1";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";

import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";

const COMPONENT_MAP = {
	Careers1: <Careers1 />,
	Cta: <Cta />,
};

const DEFAULT_ORDER = [
	"Careers1",
	"Cta",
];

export default async function Careers() {
	const banner = await getBannerData("/careers");
	const bannerTitle = banner?.title || "Careers";
	let bgImage = "/images/bg/bg.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	const activeKeys = await getPageComponents("careers", DEFAULT_ORDER);

	return (
		<CmsPageRoot pageSlug="careers">
			<div>
				<BackToTop />
				<Header />
				<Header isStickyHeader={true} />
				<div id="smooth-wrapper">
					<div id="smooth-content">
						<main>
							<HeaderSpace />
							<HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} />
							{activeKeys.map((comp) => {
								const style = {};
								if (comp.margin_top) style.marginTop = comp.margin_top;
								if (comp.margin_bottom) style.marginBottom = comp.margin_bottom;
								if (comp.padding_top) style.paddingTop = comp.padding_top;
								if (comp.padding_bottom) style.paddingBottom = comp.padding_bottom;

								return COMPONENT_MAP[comp.key] ? (
									<div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
										{COMPONENT_MAP[comp.key]}
									</div>
								) : null;
							})}
						</main>
						<Footer8 />
					</div>
				</div>

				<ClientWrapper />
			</div>
		</CmsPageRoot>
	);
}

import { getMeta } from "@/lib/getMeta";
import Footer8 from "@/components/layout/footer/Footer8";
export async function generateMetadata() {
	return await getMeta("/careers");
}
