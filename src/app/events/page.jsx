import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import HeroInner from "@/components/sections/hero/HeroInner";
import EventsSection from "@/components/sections/events/Events";
import Gallery from "@/components/sections/gallery/Gallery";
import Footer8 from "@/components/layout/footer/Footer8";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";

export const dynamic = "force-dynamic";

const COMPONENT_MAP = {
	EventsSection: EventsSection,
	Gallery: Gallery,
};

const DEFAULT_ORDER = [
	"EventsSection",
	"Gallery",
];

export default async function Events() {
	const activeKeys = await getPageComponents("events", DEFAULT_ORDER);
	const banner = await getBannerData("/services");
	const bannerTitle = banner?.title || "Events";
	const bannerText = banner?.text || "Our Memorable Events";
	let bgImage = "/images/bg/bg.png";
	if (banner?.image?.[0]) {
		bgImage = banner.image[0];
		if (bgImage.startsWith('/uploads')) {
			bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
		}
	}

	return (
		<CmsPageRoot pageSlug="events">
			<div>
				<BackToTop />
				<Header />
				<Header isStickyHeader={true} />
				<div id="smooth-wrapper">
					<div id="smooth-content">
						<main>
							<HeaderSpace />
							<HeroInner title={bannerTitle} text={bannerText} bgImage={bgImage} />
							{activeKeys.map((comp) => {
								const Component = COMPONENT_MAP[comp.key];
								if (!Component) return null;

								const style = {};
								if (comp.margin_top) style.marginTop = comp.margin_top;
								if (comp.margin_bottom) style.marginBottom = comp.margin_bottom;
								if (comp.padding_top) style.paddingTop = comp.padding_top;
								if (comp.padding_bottom) style.paddingBottom = comp.padding_bottom;

								return (
									<div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
										<Component />
									</div>
								);
							})}
						</main>
					<div style={{ marginTop: '50px' }}>
							<Footer8 />
						</div>
					</div>
				</div>
				<ClientWrapper />
			</div>
		</CmsPageRoot>
	);
}
