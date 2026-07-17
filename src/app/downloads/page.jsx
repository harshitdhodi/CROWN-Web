
import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import DownloadCenter from "@/components/sections/download/DownloadCenter";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import HeroInner from "@/components/sections/hero/HeroInner";
import Footer8 from "@/components/layout/footer/Footer8";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";

export const revalidate = 0;

const COMPONENT_MAP = {
    DownloadCenter: DownloadCenter,
};

const DEFAULT_ORDER = [
    "DownloadCenter",
];

export default async function Downloads() {
    const activeKeys = await getPageComponents("downloads", DEFAULT_ORDER);
    const banner = await getBannerData("/downloads");
    const bannerTitle = banner?.title || "Download Resources";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    return (
        <CmsPageRoot pageSlug="downloads">
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

import { getMeta } from "@/lib/getMeta";
export async function generateMetadata() {
    return await getMeta("/downloads");
}

