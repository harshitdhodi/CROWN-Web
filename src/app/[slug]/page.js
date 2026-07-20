import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import CategoryDetailsMain from "@/components/layout/main/CategoryDetailsMain";
import ProductDetailsMain from "@/components/layout/main/ProductDetailsMain";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import HeroInner from "@/components/sections/hero/HeroInner";
import getBannerData from "@/lib/getBannerData";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://CROWN Packaging.rndtd.com";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

function resolveImage(src) {
  if (!src) return null;
  if (src.startsWith("http")) return src;
  return src.startsWith("/") ? `${API_URL}${src}` : `${API_URL}/${src}`;
}

function slugify(text) {
  return text
    ? text
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
    : "";
}

function getNodeTitle(node) {
  return node?.category_name || node?.name || node?.title || node?.slug || "Untitled";
}

function mapApiCategory(node) {
  return {
    id: node?.id || node?._id,
    slug: node?.category_slug || slugify(getNodeTitle(node)),
    title: getNodeTitle(node),
    tagline: node?.tagline || "",
    description:
      node?.short_description || node?.description || node?.tagline || "",
    details: node?.category_details || node?.description || "",
    image: node?.image || "/images/project/h5-project-1.webp",
    products: Array.isArray(node?.children)
      ? node.children.map((child) => getNodeTitle(child))
      : [],
    metatitle: node?.metatitle || "",
    meta_description: node?.meta_description || "",
    meta_keyword: node?.meta_keyword || [],
    canonical_link: node?.canonical_link || "",
    schema: node?.schema || "",
  };
}

async function fetchCategoryBySlug(slug) {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") || "";
  const catRes = await fetch(
    `${BASE_URL}/api/hierarchies/categories?category_slug=${encodeURIComponent(slug)}`,
    {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }
  );

  if (!catRes.ok) {
    return null;
  }

  const json = await catRes.json();
  console.log("json", json)
  if (!json?.success || !Array.isArray(json.data) || json.data.length === 0) {
    return null;
  }

  return mapApiCategory(json.data[0]);
}

async function fetchAllCategories() {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") || "";
  const allCatsRes = await fetch(`${BASE_URL}/api/hierarchies/categories`, {
    headers: { cookie: cookieHeader },
    next: { revalidate: 0 },
  });

  if (!allCatsRes.ok) {
    return [];
  }

  const json = await allCatsRes.json();
  if (!json?.success || !Array.isArray(json.data)) {
    return [];
  }

  return json.data.map(mapApiCategory);
}

async function fetchProductBySlug(slug) {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") || "";
  const prodRes = await fetch(`${BASE_URL}/api/products/${slug}`, {
    headers: { cookie: cookieHeader },
    next: { revalidate: 0 },
  });
  if (!prodRes.ok) return null;
  const json = await prodRes.json();
  return json?.success ? json.data : null;
}

async function fetchRelatedProducts(categorySlug) {
  const headerList = await headers();
  const cookieHeader = headerList.get("cookie") || "";
  const relatedRes = await fetch(
    `${BASE_URL}/api/products-by-category-slug/${categorySlug}`,
    {
      headers: { cookie: cookieHeader },
      next: { revalidate: 0 },
    }
  );
  if (!relatedRes.ok) return [];
  const json = await relatedRes.json();
  return json?.success ? json.data : [];
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  // Try product first, then category
  const product = await fetchProductBySlug(slug);
  if (product) {
    const title = product.metatitle || product.name;
    const description = product.meta_description || "";
    const keywords = Array.isArray(product.meta_keyword)
      ? product.meta_keyword.join(", ")
      : product.meta_keyword || "";
    const canonical = product.canonical_link || `${SITE_URL}/${slug}`;
    const ogImage = resolveImage(product.image?.[0]);

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        ...(ogImage && { images: [{ url: ogImage, alt: product.name }] }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
    };
  }

  // Fall back to category
  const category = await fetchCategoryBySlug(slug);
  if (category) {
    const title = category.metatitle || category.title;
    const description = category.meta_description || category.description || category.tagline || "";
    const keywords = Array.isArray(category.meta_keyword)
      ? category.meta_keyword.join(", ")
      : category.meta_keyword || "";
    const canonical = category.canonical_link || `${SITE_URL}/${slug}`;
    const ogImage = resolveImage(
      typeof category.image === "string" ? category.image : category.image?.[0]
    );

    return {
      title,
      description,
      keywords,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        ...(ogImage && { images: [{ url: ogImage, alt: category.title }] }),
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        ...(ogImage && { images: [ogImage] }),
      },
    };
  }

  return {};
}

export default async function CategorySlugPage({ params }) {
  const { slug } = await params;
  const allCategories = await fetchAllCategories();

  // 1. Try to find a Category
  let category = await fetchCategoryBySlug(slug);
  let product = null;
  let relatedProducts = [];
  console.log("Fetched category:", category);
  // 2. If not a category, try to find a Product
  if (!category) {
    product = await fetchProductBySlug(slug);
    if (!product) notFound();

    // Find the category slug for related products (matching product.category ID with allCategories)
    const parentCategory = allCategories.find(c => c.id === product.category || c.slug === product.category);
    relatedProducts = await fetchRelatedProducts(parentCategory?.slug || product.category);
  }

  // Resolve banner data matching the main category/product pages
  const bannerPath = category ? "/categories" : "/products";
  const banner = await getBannerData(bannerPath);
  const bannerTitle = category ? category.title : (product ? product.name : "");
  let bgImage = "/images/bg/bg.png";
  if (banner?.image?.[0]) {
    bgImage = banner.image[0];
    if (bgImage.startsWith('/uploads')) {
      bgImage = `${process.env.CMS_BASE_URL || "http://localhost:3012"}${bgImage}`;
    }
  }

  const breadcrums = category
    ? [
        { name: "Categories", path: "/categories" }
      ]
    : [
        { name: "Products", path: "/products" }
      ];

  return (
    <div>
      <BackToTop />
      <Header />
      <Header isStickyHeader={true} />
      {/* Inject JSON-LD schema from product CMS field */}
      {product?.schema && (
        product.schema.trim().startsWith("<script") ? (
          <div dangerouslySetInnerHTML={{ __html: product.schema }} />
        ) : (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: product.schema }} />
        )
      )}
      {/* Inject JSON-LD schema from category CMS field */}
      {category?.schema && (
        category.schema.trim().startsWith("<script") ? (
          <div dangerouslySetInnerHTML={{ __html: category.schema }} />
        ) : (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: category.schema }} />
        )
      )}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main>
            <HeaderSpace />
            <HeroInner title={bannerTitle} text={bannerTitle} breadcrums={breadcrums} bgImage={bgImage} />
            {category ? (
              <CategoryDetailsMain
                category={category}
                categories={allCategories}
                currentSlug={slug}
              />
            ) : (
              <ProductDetailsMain
                product={product}
                categories={allCategories}
                relatedProducts={relatedProducts.filter(p => p.slug !== slug)}
              />
            )}

          </main>
          <Footer8 />
        </div>
      </div>

      <ClientWrapper />
    </div>
  );
}
