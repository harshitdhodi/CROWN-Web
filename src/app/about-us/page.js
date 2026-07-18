import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import About9 from "@/components/sections/about/About9";
import Features from "@/components/sections/features/Features";
import Features3 from "@/components/sections/features/Features3";
import HeroInner from "@/components/sections/hero/HeroInner";
import Process from "@/components/sections/process/Process";
import Services3 from "@/components/sections/services/Services3";
import Services4 from "@/components/sections/services/Services4";
import Team1 from "@/components/sections/teams/Team1";
import Team2 from "@/components/sections/teams/Team2";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getPageComponents from "@/lib/getPageComponents";
import getBannerData from "@/lib/getBannerData";

// Map component keys (matching CMS Page Manager keys) to their JSX elements.
// The comment beside each entry is the section name shown in the CMS admin.
const COMPONENT_MAP = {
	About9: About9,                                          // Company Overview
	Features: Features,                                      // Our Mission & Vision
	Process: (props) => <Process type="core-value" {...props} />, // core values
	Team2: Team2,                                            // Leadership Team
	Services4: Services4,                                    // Manufacturing Strength
	Team1: Team1,                                            // Certificates
	Services3: (props) => <Services3 variant="journey" {...props} />, // Our Journey
	Features3: (props) => <Features3 variant="journey" {...props} />, // Why Choose Us
};

// Fallback order when CMS is unreachable (all sections visible)
const DEFAULT_ORDER = [
	"About9",
	"Features",
	"Process",
	"Team2",
	"Services4",
	"Team1",
	"Services3",
	"Features3",
];

export default async function About() {
	const activeKeys = await getPageComponents("about-us", DEFAULT_ORDER);
	const banner = await getBannerData("/about-us");

	const bannerTitle = banner?.title || "About Us";
	let bgImage = "/images/bg/bg.png";

	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	return (
		<CmsPageRoot pageSlug="about-us">
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
								const Component = COMPONENT_MAP[comp.key];
								if (!Component) return null;

								const style = {};
								if (comp.margin_top) style.marginTop = comp.margin_top;
								if (comp.margin_bottom) style.marginBottom = comp.margin_bottom;
								if (comp.padding_top) style.paddingTop = comp.padding_top;
								if (comp.padding_bottom) style.paddingBottom = comp.padding_bottom;

								const props = comp.key === "Team2" ? { type: 2 } : comp.key === "Team1" ? { type: 3 } : {};

								return (
									<div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
										<Component {...props} />
									</div>
								);
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
	return await getMeta("/about-us");
}
