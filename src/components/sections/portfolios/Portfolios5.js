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

// ISR Fetch Function
async function getCategories() {
  try {
    const res = await fetch(`${BASE_URL}/api/data/our_products`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      const errorBody = await res.text().catch(() => "No response body");
      console.error(
        `Failed to fetch categories: ${res.status} ${res.statusText} - ${errorBody}`
      );
      return [];
    }

    const { success, data } = await res.json();

    if (!success || !data) {
      console.warn("API returned no data or success was false.");
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      title: item.name || "Dropper Bottles",
      slug: item.slug || slugify(item.name || item.id),
      // Pass the resolved image as both `image` (primary) and `img5` (fallback key)
      image: resolveCmsImage(item.image),
      img5: resolveCmsImage(item.image),
      desc: item.category_populated?.short_description?.replace(/<[^>]+>/g, "") || "",
      category: item.category_populated?.tagline || item.category_label || "Connect",
      categorySlug: item.category_populated?.category_slug || "",
    }));
  } catch (error) {
    console.error("Error fetching or parsing categories:", error);
    return [];
  }
}

async function getHeading() {
  try {
    const res = await fetch(`${BASE_URL}/api/heading?section=home-product`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.success ? json.data : null;
  } catch (error) {
    console.error("Error fetching heading:", error);
    return null;
  }
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
