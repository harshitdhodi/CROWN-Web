import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import Contact3 from "@/components/sections/contacts/Contact3";
import ContactTop from "@/components/sections/contacts/ContactTop";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";

export default async function Contact() {
    const banner = await getBannerData("/contact");
    const bannerTitle = banner?.title || "Contact Us";
    let bgImage = "/images/bg/wire-banner.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    // Fetch all data from APIs
    const [headingRes, contactRes, activeKeys] = await Promise.all([
        fetch(`${process.env.CMS_BASE_URL}/api/heading?section=contact`),
        fetch(`${process.env.CMS_BASE_URL}/api/data/contactus`),
        getPageComponents("contact", ["ContactTop", "Contact3", "Cta"])
    ]);

    const headingData = await headingRes.json();
    const contactData = await contactRes.json();
    console.log("headingData",contactData)

    const heading = headingData.success ? headingData.data : null;
    const formheading = contactData.success && contactData.data.length > 0 ? contactData.data[0] : null;
    const contact = contactData.success && contactData.data.length > 0 ? contactData.data[0] : null;
    const mapUrl = contact?.mapurl || "";

    const COMPONENT_MAP = {
        ContactTop: <ContactTop headingData={heading} contactData={contact} />,
        Contact3: <Contact3 mapUrl={mapUrl} formHeading={formheading} />,
    };

    return (
        <CmsPageRoot pageSlug="contact">
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
    return await getMeta("/contact");
}
