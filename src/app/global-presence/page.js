import getBannerData from "@/lib/getBannerData";
import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import Contact2 from "@/components/sections/contacts/Contact2";
import HeroInner from "@/components/sections/hero/HeroInner";
import Team1 from "@/components/sections/teams/Team1";
import Team3 from "@/components/sections/teams/Team3";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getPageComponents from "@/lib/getPageComponents";

// Map component keys (matching CMS Page Manager keys) to their JSX elements.
// The comment beside each entry is the section name shown in the CMS admin.
const COMPONENT_MAP = {
	Contact2: <Contact2 isInnerPage={true} />, // map
	Team3: <Team3 isInnerPage={true} />, // Our Team
	Team1: <Team1 type={3} />, // Certificates
};

// Fallback order when CMS is unreachable (all sections visible)
const DEFAULT_ORDER = ["Contact2", "Team3", "Team1"];

export default async function GlobalPresence() {
	const banner = await getBannerData("/global-presence");
	const bannerTitle = banner?.title || "Global Presence";
	let bgImage = "/images/bg/bg.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	const activeKeys = await getPageComponents("global-presence", DEFAULT_ORDER);

	return (
		<CmsPageRoot pageSlug="global-presence">
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
export async function generateMetadata() {
  return await getMeta("/global-presence");
}
