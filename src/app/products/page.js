import getBannerData from "@/lib/getBannerData";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import PortfoliosPrimary from "@/components/sections/portfolios/PortfoliosPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import getPageComponents from "@/lib/getPageComponents";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

// Environment base URLs
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3012";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

// Helper to create URL‑friendly slugs
const slugify = (text) =>
    text?.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') || "";

// Resolve image URLs reported by the API
const resolveApiImage = (imagePath) => {
    if (!imagePath) return "/images/service/service-1.webp";
    if (Array.isArray(imagePath)) {
        return resolveApiImage(imagePath[0]);
    }
    if (typeof imagePath !== "string") {
        console.warn("resolveApiImage received non-string imagePath", imagePath);
        return "/images/service/service-1.webp";
    }
    let cleanSrc = imagePath;
    if (imagePath.includes("/uploads/")) {
        cleanSrc = "/uploads/" + imagePath.split("/uploads/")[1];
    } else if (imagePath.startsWith("http")) {
        return imagePath;
    }
    return cleanSrc.startsWith("/") ? `${API_URL}${cleanSrc}` : `${API_URL}/${cleanSrc}`;
};

/** Fetch product data from the backend */
async function getProducts() {
    try {
        const headersList = await headers();
        const cookieHeader = headersList.get("cookie") || "";
        const res = await fetch(`${API_URL}/api/data/our_products`, {
            headers: { cookie: cookieHeader },
            next: { revalidate: 3600 }, // 1‑hour ISR
        });

        if (!res.ok) {
            const errorBody = await res.text().catch(() => "No response body");
            console.error(`Failed to fetch products: ${res.status} ${res.statusText} - ${errorBody}`);
            return [];
        }

        const { success, data } = await res.json();
        if (!success || !data || !Array.isArray(data)) {
            console.warn("API returned no data or success was false.");
            return [];
        }

        // Adapt the API shape to what PortfoliosPrimary expects
        return data.map((item) => {
            const title = item.product_name || item.name || item.title || `Product ${item.id}`;
            const slugSource = item.product_slug || item.slug || title;
            return {
                id: item.id,
                title,
                slug: item.product_slug || item.slug || slugify(slugSource),
                image: resolveApiImage(item.image),
                img: resolveApiImage(item.image), // Compatibility with PortfolioCard3
                img5: resolveApiImage(item.image),
                desc: item.short_description?.replace(/(&lt;|<)[^&>]+(&gt;|>)/g, "") || "",
                category:
                    item.category_label ||
                    item.category_populated?.category_name ||
                    item.category_name ||
                    item.tagline ||
                    "Product",
            };
        });
    } catch (error) {
        console.error("Error fetching or parsing products:", error);
        return [];
    }
}

export default async function Products() {
    const banner = await getBannerData("/products");
    const bannerTitle = banner?.title || "Products";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    const [products, activeKeys] = await Promise.all([
        getProducts(),
        getPageComponents("products", ["PortfoliosPrimary"])
    ]);

    const COMPONENT_MAP = {
        PortfoliosPrimary: <PortfoliosPrimary items={products} />,
    };

    return (
        <CmsPageRoot pageSlug="products">
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
    return await getMeta("/products");
}
