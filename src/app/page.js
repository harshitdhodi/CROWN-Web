import dynamic from "next/dynamic";
import Header from "@/components/layout/header/Header";
import Hero2 from "@/components/sections/hero/Hero2";
import BackToTop from "@/components/shared/others/BackToTop";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";
import LazySection from "@/components/shared/wrappers/LazySection";

// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL IMPORTS (above the fold — loaded eagerly):
//   Header, Hero2 — visible immediately on page load
//
// DYNAMIC IMPORTS (below the fold — code-split, loaded on demand):
//   All other sections are lazily imported so their JS is not included in the
//   initial JS bundle. This reduces the amount of unused JavaScript shipped to
//   the browser by ~300-400 KB, improving LCP and TBT.
//   ssr: true ensures server-side rendering still works for SEO.
// ─────────────────────────────────────────────────────────────────────────────

const Footer8 = dynamic(() => import("@/components/layout/footer/Footer8"), { ssr: true });
const About9 = dynamic(() => import("@/components/sections/about/About9"), { ssr: true });
const Brands4 = dynamic(() => import("@/components/sections/brands/Brands4"), { ssr: true });
const Contact2 = dynamic(() => import("@/components/sections/contacts/Contact2"), { ssr: true });
const Portfolios5 = dynamic(() => import("@/components/sections/portfolios/Portfolios5"), { ssr: true });
const Services3 = dynamic(() => import("@/components/sections/services/Services3"), { ssr: true });
const Team1 = dynamic(() => import("@/components/sections/teams/Team1"), { ssr: true });
const Testimonials4 = dynamic(() => import("@/components/sections/testimonials/Testimonials4"), { ssr: true });
import Portfolios4 from "@/components/sections/portfolios/Portfolios4";
export const revalidate = 0;

// Map component keys to their references
// Order and visibility are controlled from the CMS admin (Page Manager)
// The comment beside each entry is the section name used in the CMS to show/hide it
const COMPONENT_MAP = {
	Hero2:              Hero2,              // Hero Banner
	About9:             About9,             // About
	Portfolios5:        Portfolios5,        // product
	Services3:          Services3,          // industries
	Brands4:            Brands4,            // Clients
	Team1:              Team1,              // certificate
	Portfolios4:        Portfolios4,        // Gallery Slider
	Contact2:           Contact2,           // Global Presence
    Process: (props) => <Process type="quality" {...props} />, //Quality
	Testimonials4:      Testimonials4,      // cta
};

// Fallback order when CMS is unreachable
const DEFAULT_ORDER = [
	"Hero2",
	"About9",
	"Portfolios5",
	"Services3",
	"Portfolios4",
	"Brands4",
	"Team1",
	"Contact2",
	"Process",
	"Testimonials4",
];

export default async function Home() {
	const activeKeys = await getPageComponents("home-02", DEFAULT_ORDER);
	const seenKeys = new Set();
	const uniqueKeys = activeKeys.filter((comp) => {
		if (seenKeys.has(comp.key)) return false;
		seenKeys.add(comp.key);
		return true;
	});

	try {
		const fs = require('fs');
		const path = require('path');
		const logData = {
			timestamp: new Date().toISOString(),
			activeKeys: uniqueKeys.map(k => ({ key: k.key, existsInMap: !!COMPONENT_MAP[k.key] })),
			componentMapKeys: Object.keys(COMPONENT_MAP),
		};
		fs.writeFileSync(path.join(process.cwd(), 'debug_page_components.json'), JSON.stringify(logData, null, 2));
	} catch (e) {
		console.error("Failed to write debug log:", e);
	}

	return (
		<CmsPageRoot pageSlug="home-02">
			<div>
				<BackToTop />
				<Header headerType={2} customColorClass="text-gray-900" />
				<Header headerType={2} isStickyHeader={true} customColorClass="text-gray-900" />
				<div id="smooth-wrapper">
					<div id="smooth-content">
						<main>
							<div className="top-space-15"></div>
							{uniqueKeys.map((comp) => {
								const Component = COMPONENT_MAP[comp.key];
								if (!Component) return null;

								const style = {};
								if (comp.margin_top) style.marginTop = comp.margin_top;
								if (comp.margin_bottom) style.marginBottom = comp.margin_bottom;
								if (comp.padding_top) style.paddingTop = comp.padding_top;
								if (comp.padding_bottom) style.paddingBottom = comp.padding_bottom;
								
								const props = comp.key === "Team1" ? { type: 3 } : {};
								const content = <Component {...props} />;

								// Hero2 and Services9Wrapper must not be lazy-loaded:
								// Hero2 is above-the-fold; Services9Wrapper relies on GSAP ScrollTrigger
								// registering its sticky-panel elements at page init — if those elements
								// are injected later by IntersectionObserver the triggers are never
								// registered and the scroll animation doesn't work.
								const skipLazy = comp.key === "Hero2" || comp.key === "Services9Wrapper";

								return (
									<div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
										{skipLazy ? (
											content
										) : (
											<LazySection minHeight="250px">
												{content}
											</LazySection>
										)}
									</div>
								);
							})}
						</main>
						<LazySection minHeight="400px">
							<Footer8 />
						</LazySection>
					</div>
				</div>
				<ClientWrapper />
			</div>
		</CmsPageRoot>
	);
}

import { getMeta } from "@/lib/getMeta";
import Process from "@/components/sections/process/Process";

export async function generateMetadata() {
  return await getMeta("/");
}
