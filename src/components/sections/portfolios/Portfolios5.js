import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ClientPortfolios5 from "./ClientPortfolios5.js";

import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

const BASE_URL = getCmsBase();

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

async function fetchCollectionData(collectionName) {
  const urls = [
    `${BASE_URL}/api/data/${collectionName}`,
    `http://localhost:3014/api/data/${collectionName}`,
    `http://127.0.0.1:3014/api/data/${collectionName}`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 0 } });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
        return json.data;
      }
    } catch (e) {
      // ignore and try next fallback
    }
  }
  return [];
}

const DEFAULT_PORTFOLIOS = [
  {
    id: "dummy-p1",
    title: "Dropper Bottles",
    slug: "dropper-bottles",
    image: "/images/project/project-1.webp",
    img5: "/images/project/project-1.webp",
    desc: "Precision-engineered dropper bottles designed for pharmaceutical and healthcare dosage accuracy.",
    category: "Connect",
    categorySlug: "connect"
  },
  {
    id: "dummy-p2",
    title: "Caps & Closures",
    slug: "caps-closures",
    image: "/images/project/project-2.webp",
    img5: "/images/project/project-2.webp",
    desc: "Tamper-evident and child-resistant closures ensuring product safety and leak-proof sealing.",
    category: "Connect",
    categorySlug: "connect"
  },
  {
    id: "dummy-p3",
    title: "Measuring Cups",
    slug: "measuring-cups",
    image: "/images/project/project-3.webp",
    img5: "/images/project/project-3.webp",
    desc: "Food-grade PP measuring cups for precise liquid medicine dispensing.",
    category: "Connect",
    categorySlug: "connect"
  },
  {
    id: "dummy-p4",
    title: "Dry Syrup Bottles",
    slug: "dry-syrup-bottles",
    image: "/images/project/project-4.webp",
    img5: "/images/project/project-4.webp",
    desc: "HDPE dry syrup bottles engineered for optimal shelf life and moisture protection.",
    category: "Connect",
    categorySlug: "connect"
  }
];

async function getCategories() {
  try {
    let data = [];
    for (const col of ["our_products", "projects", "portfolios"]) {
      data = await fetchCollectionData(col);
      if (data.length > 0) break;
    }

    if (!data || data.length === 0) {
      return DEFAULT_PORTFOLIOS;
    }

    return data.map((item) => {
      const rawImg = Array.isArray(item.image) ? item.image[0] : (item.image || item.img || item.img5);
      const resolvedImg = resolveCmsImage(rawImg) || "/images/project/project-1.webp";

      return {
        id: item.id || item._id,
        title: item.name || item.title || "Product Showcase",
        slug: item.slug || slugify(item.name || item.title || item.id),
        image: resolvedImg,
        img5: resolvedImg,
        desc: (item.short_description || item.description || item.desc || item.category_populated?.short_description || "")
          .replace(/<[^>]+>/g, "")
          .trim(),
        category: item.category || item.category_populated?.name || item.category_populated?.tagline || item.category_label || "Products",
        categorySlug: item.categorySlug || item.category_populated?.category_slug || "",
      };
    });
  } catch (error) {
    console.error("Error fetching or parsing portfolios:", error);
    return DEFAULT_PORTFOLIOS;
  }
}

async function getHeading() {
  const urls = [
    `${BASE_URL}/api/heading?section=home-product`,
    `http://localhost:3014/api/heading?section=home-product`,
    `http://127.0.0.1:3014/api/heading?section=home-product`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, { next: { revalidate: 0 } });
      if (!res.ok) continue;
      const json = await res.json().catch(() => null);
      if (json?.success && json?.data) return json.data;
    } catch (error) {
      // try next URL
    }
  }
  return null;
}

// Server Component — fetches data, passes to client child
const Portfolios5 = async () => {
  const [portfolio, headingData] = await Promise.all([
    getCategories(),
    getHeading(),
  ]);

  const tagline = headingData?.tagline || "Proud Projects";
  const title = headingData?.heading || "Breaking Boundaries, Building Dreams.";

  return (
    <section className="h5-project section-gap">
      <div className="tj-scroll-slider">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="sec-heading-wrap style-3">
                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                  <i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>{tagline}
                </span>
                <div className="heading-wrap-content">
                  <div className="sec-heading style-3" style={{ maxWidth: "800px" }}>
                    <h2 className=" ">
                      {title}
                    </h2>
                  </div>
                  <div className="btn-area wow fadeInUp" data-wow-delay=".8s">
                    <ButtonPrimary text={"Explore More"} url={"/products"} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <div className="project-wrapper h5-project-wrapper">
                {portfolio?.length ? (
                  <ClientPortfolios5 portfolio={portfolio} />
                ) : (
                  <p className="text-center py-5">No projects available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Portfolios5;
