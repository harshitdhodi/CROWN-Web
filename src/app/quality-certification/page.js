import getBannerData from "@/lib/getBannerData";
import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import FeaturesCustom from "@/components/quality-certification/FeaturesCustom";
import HeroInner from "@/components/sections/hero/HeroInner";
import Process2 from "@/components/sections/process/Process2";
import Team1 from "@/components/sections/teams/Team1";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getPageComponents from "@/lib/getPageComponents";

// Map component keys (matching CMS Page Manager keys) to their JSX elements.
// The comment beside each entry is the section name shown in the CMS admin.
const COMPONENT_MAP = {
    Features: FeaturesCustom,               // Mission & Vision (Async Component)
    Process2: Process2,           // Quality Process
    Team1: Team1,     // Certificates
};

// Fallback order when CMS is unreachable (all sections visible)
const DEFAULT_ORDER = [
    "Features",
    "Process2",
    "Team1",
];

export default async function QualityCertification() {
    const banner = await getBannerData("/quality-certification");
    const bannerTitle = banner?.title || "Quality & Certification";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    const activeKeys = await getPageComponents("quality-certification", DEFAULT_ORDER);

    return (
        <CmsPageRoot pageSlug="quality-certification ">
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

                                const props = comp.key === "Team1" ? { type: 3 } : {};

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
    return await getMeta("/quality-certification");
}
