import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import Portfolios10 from "@/components/sections/portfolios/Portfolios10";
import Services10 from "@/components/sections/services/Services10";
import Services2 from "@/components/sections/services/Services2";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getPageComponents from "@/lib/getPageComponents";

const COMPONENT_MAP = {
    About6: <About6 />, // Our Solutions
    Services3: <Services3 />,
   Services2: <Services2 />, // Industry
};

const DEFAULT_ORDER = [
    "About6",
    "Services3",
    "Services2",
];

export default async function IndustrySolutions() {
    const banner = await getBannerData("/manufacturing-infrastructure");
    const bannerTitle = banner?.title || "Manufacturing ";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    const activeKeys = await getPageComponents("industry-solutions", DEFAULT_ORDER);

    return (
        <CmsPageRoot pageSlug="industry-solutions">
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
import About6 from "@/components/sections/about/About6";
import Services3 from "@/components/sections/services/Services3";
export async function generateMetadata() {
    return await getMeta("/industry-solutions");
}
