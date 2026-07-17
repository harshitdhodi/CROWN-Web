import getBannerData from "@/lib/getBannerData";
import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import HeroInner from "@/components/sections/hero/HeroInner";
import PortfoliosPrimary from "@/components/sections/portfolios/PortfoliosPrimary";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { headers } from "next/headers";
import { getMeta } from "@/lib/getMeta";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
	return await getMeta("/categories");
}

// NEXT_PUBLIC_BASE_URL is usually port 3000 (Frontend)
// NEXT_PUBLIC_API_URL should be port 3001 (Backend)
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper to create URL-friendly slugs
const slugify = (text) =>
    text?.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '') || "";

// Helper to resolve image paths from the API
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

async function getCategories() {
    try {
        const headersList = await headers();
        const cookieHeader = headersList.get("cookie") || "";
        // Fetch from API_URL to ensure we hit the backend directly
        const res = await fetch(`${API_URL}/api/data/categories`, {
            headers: { cookie: cookieHeader },
            next: { revalidate: 3600 },
        });

        if (!res.ok) {
            const errorBody = await res.text().catch(() => "No response body");
            console.error(`Failed to fetch categories: ${res.status} ${res.statusText} - ${errorBody}`);
            return [];
        }

        const { success, data } = await res.json();
        if (!success || !data || !Array.isArray(data)) {
            console.warn("API returned no data or success was false.");
            return [];
        }

        return data.map((item) => ({
            id: item.id,
            title: item.category_name,
            slug: item.category_slug || slugify(item.category_name || item.tagline || item.id),
            image: resolveApiImage(item.image),
            img: resolveApiImage(item.image), // Added 'img' key for PortfolioCard3 compatibility
            img5: resolveApiImage(item.image),
            // Updated regex to handle encoded HTML tags like &lt;p&gt;
            desc: item.short_description?.replace(/(&lt;|<)[^&>]+(&gt;|>)/g, "") || "",
            category: item.tagline || "Connect",
        }));
    } catch (error) {
        console.error("Error fetching or parsing categories:", error);
        return [];
    }
}

export default async function Categories() {
    const banner = await getBannerData("/categories");
    const bannerTitle = banner?.title || "Categories";
    let bgImage = "/images/bg/bg.png";
    if (banner?.image?.[0]) {
        bgImage = banner.image[0];
        if (bgImage.startsWith('/uploads')) {
            bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
        }
    }

    const categories = await getCategories();

    return (
        <div>
            <BackToTop />
            <Header />
            <Header isStickyHeader={true} />
            <div id="smooth-wrapper">
                <div id="smooth-content">
                    <main>
                        <HeaderSpace />
                        <HeroInner title={bannerTitle} text={bannerTitle} bgImage={bgImage} />
                        <PortfoliosPrimary items={categories} />  {/* Category Grid View */}
                
                    </main>
                    <Footer8 />
                </div>
            </div>
            <ClientWrapper />
        </div>
    );
}
