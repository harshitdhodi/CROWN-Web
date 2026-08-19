import getBannerData from "@/lib/getBannerData";
import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import Services4 from "@/components/sections/services/Services4";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getPageComponents from "@/lib/getPageComponents";
import { getMeta } from "@/lib/getMeta";

const COMPONENT_MAP = {
    Services4: (props) => <Services4 variant="industry" {...props} />,
};

const DEFAULT_ORDER = [
    "Services4",
];

export default async function ManufacturingInfrastructure() {
    const banner = await getBannerData("/manufacturing-infrastructure");
    const bannerTitle = banner?.title || "Manufacturing & Infrastructure";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    const activeKeys = await getPageComponents("manufacturing-infrastructure", DEFAULT_ORDER);

    return (
        <CmsPageRoot pageSlug="manufacturing-infrastructure">
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

                                return (
                                    <div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
                                        <Component />
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

export async function generateMetadata() {
    return await getMeta("/manufacturing-infrastructure");
}
