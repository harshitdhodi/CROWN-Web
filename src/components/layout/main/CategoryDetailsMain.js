"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ContactForm from "@/components/sections/contacts/ContactForm";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

const resolveApiImage = (src) => {
  if (!src) return "/images/service/service-1.webp";
  if (Array.isArray(src)) return resolveApiImage(src[0]);
  if (typeof src !== "string") return "/images/service/service-1.webp";
  let cleanSrc = src;
  if (src.includes("/uploads/")) {
    cleanSrc = "/uploads/" + src.split("/uploads/")[1];
  } else if (src.startsWith("http")) {
    return src;
  }
  return cleanSrc.startsWith("/") ? `${BASE_URL}${cleanSrc}` : `${BASE_URL}/${cleanSrc}`;
};

const CategoryDetailsMain = ({ category, currentSlug }) => {
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchCurrentProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`/api/products-by-category-slug/${currentSlug}`);
        if (!res.ok) throw new Error("Network response was not ok");
        const result = await res.json();
        if (result.success && Array.isArray(result.data)) {
          setCurrentCategoryProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch products for active category:", error);
      } finally {
        setLoadingProducts(false);
      }
    };
    if (currentSlug) fetchCurrentProducts();
  }, [currentSlug]);

  return (
    <div>
      <style>{`
        /* Tiptap prose */
        .tiptap-prose ul {
          list-style: none !important;
          padding: 0 !important;
          margin: 0 0 1rem 0 !important;
        }
        .tiptap-prose ol {
          list-style-type: decimal !important;
          padding-left: 1.55rem !important;
          margin-left: 0 !important;
          columns: 2;
          column-gap: 2rem;
        }
        .tiptap-prose li {
          position: relative;
          padding-left: 20px !important;
          margin-bottom: 8px;
          color: var(--tj-color-text-body);
        }
        .tiptap-prose ul li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 10px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: var(--tj-color-theme-primary);
        }
        .tiptap-prose ol li { padding-left: 0 !important; }
        .tiptap-prose p { margin: 0 0 1rem 0; }
        @media (max-width: 767px) {
          .tiptap-prose ul,
          .tiptap-prose ol { columns: 1 !important; }
        }

        /* Product cards */
        .product-grid-card {
          background: #fff;
          border: 1px solid var(--tj-color-border-1);
          border-radius: 12px;
          overflow: hidden;
          height: 100%;
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
          transition: all 0.4s cubic-bezier(0.165,0.84,0.44,1);
          display: flex;
          flex-direction: column;
        }
        .product-grid-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 30px rgba(30,138,138,0.12);
          border-color: var(--tj-color-theme-primary);
        }
        .product-img-box {
          position: relative;
          height: 270px;
          width: 100%;
          overflow: hidden;
          background: #f8f9fa;
        }
        .product-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.165,0.84,0.44,1);
        }
        .product-grid-card:hover .product-img { transform: scale(1.08); }
        .img-hover-overlay {
          position: absolute;
          inset: 0;
          background: rgba(201, 148, 68, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }
        .product-grid-card:hover .img-hover-overlay { opacity: 1; }
        .view-details-btn {
          color: #fff;
          font-weight: 600;
          font-size: 15px;
          border: 1.5px solid #fff;
          padding: 8px 18px;
          border-radius: 30px;
          transform: translateY(15px);
          transition: all 0.3s ease;
        }
        .product-grid-card:hover .view-details-btn { transform: translateY(0); }
        .product-info-box {
          padding: 22px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          border-top: 1px solid var(--tj-color-border-1);
        }
        .product-name {
          font-size: 19px;
          font-weight: 600;
          color: var(--tj-color-heading-primary);
          margin-bottom: 10px;
          line-height: 1.3;
        }
        .product-desc {
          font-size: 14px;
          color: var(--tj-color-text-body);
          line-height: 1.5;
          margin: 0;
          opacity: 0.85;
        }
        .card-link {
          text-decoration: none;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        /* Sticky sidebar layout */
        .category-layout-row {
          display: flex;
          align-items: flex-start;
          gap: 30px;
        }
        .category-left-col {
          flex: 1 1 0%;
          min-width: 0;
        }
        .category-right-col {
          width: 360px;
          flex-shrink: 0;
          position: sticky;
          top: 110px;
          align-self: flex-start;
        }
        @media (max-width: 991px) {
          .category-layout-row { flex-direction: column; }
          .category-right-col { width: 100%; position: static; }
        }
      `}</style>

      <section className="tj-service-area section-gap">
        <div className="container">
          <div className="category-layout-row">

            {/* ── Left scrollable content ── */}
            <div className="category-left-col">
              <div className="post-details-wrapper">
                <h2 className="title title-anim">{category.title}</h2>

                {/* Products grid */}
                <div className="category-products-section wow fadeInUp" data-wow-delay=".1s" style={{ marginBottom: "50px" }}>
                  <h3 style={{
                    fontSize: "24px",
                    fontWeight: "700",
                    marginBottom: "24px",
                    borderLeft: "4px solid var(--tj-color-theme-primary)",
                    paddingLeft: "14px",
                    color: "var(--tj-color-heading-primary)",
                  }}>
                    Products in this Category
                  </h3>

                  {loadingProducts ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading products...</span>
                      </div>
                    </div>
                  ) : currentCategoryProducts.length > 0 ? (
                    <div className="row row-gap-4">
                      {currentCategoryProducts.map((product) => (
                        <div key={product.id || product.slug} className="col-md-6 col-sm-6">
                          <div className="product-grid-card">
                            <Link href={`/${product.slug}`} className="card-link">
                              <div className="product-img-box">
                                <img
                                  src={resolveApiImage(product.image?.[0])}
                                  alt={product.name}
                                  className="product-img"
                                />
                                <div className="img-hover-overlay">
                                  <span className="view-details-btn">View Details <i className="tji-arrow-right"></i></span>
                                </div>
                              </div>
                              <div className="product-info-box">
                                <h5 className="product-name">{product.name}</h5>
                                <p className="product-desc">
                                  {product.details
                                    ? product.details.replace(/<[^>]+>/g, "").substring(0, 100) + "…"
                                    : "High-quality industrial manufacturing solution."}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 border rounded" style={{ borderColor: "var(--tj-color-border-1)", background: "var(--tj-color-theme-bg)" }}>
                      <p style={{ margin: 0, opacity: 0.6, color: "var(--tj-color-text-body)" }}>
                        No products listed under this category yet.
                      </p>
                    </div>
                  )}
                </div>

                {category.description && (
                  <div className="wow fadeInUp" data-wow-delay=".2s">
                    <div
                      className="tiptap-prose text-justify prose prose-sm sm:prose-base dark:prose-invert max-w-none text-base lg:text-lg"
                      dangerouslySetInnerHTML={{ __html: category.description }}
                    />
                  </div>
                )}

                {category.details && (
                  <div className="details-content-box wow fadeInUp" data-wow-delay=".3s">
                    <div
                      className="tiptap-prose prose text-justify prose-sm sm:prose-base dark:prose-invert max-w-none text-base lg:text-lg [&_li]:my-2"
                      dangerouslySetInnerHTML={{ __html: category.details }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ── Sticky sidebar ── */}
            <div className="category-right-col">
              <div style={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                border: "1px solid rgba(180,140,60,0.25)",
              }}>
                {/* Header — dark gold matching product imagery */}
                <div style={{
                  background: "linear-gradient(135deg, #1a1108 0%, #2c1f0a 50%, #1a1108 100%)",
                  padding: "30px 28px 26px",
                  position: "relative",
                  overflow: "hidden",
                }}>
                  {/* Decorative ring */}
                  <div style={{
                    position: "absolute",
                    top: "-30px",
                    right: "-30px",
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    border: "1.5px solid rgba(196,158,72,0.2)",
                    pointerEvents: "none",
                  }} />
                  <div style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "-20px",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "1px solid rgba(196,158,72,0.15)",
                    pointerEvents: "none",
                  }} />

                

                  <h4 style={{
                    color: "#fff",
                    margin: "0 0 8px",
                    fontSize: "20px",
                    fontWeight: "700",
                    letterSpacing: "0.2px",
                  }}>
                    Get a Free Quote
                  </h4>
                  <p style={{
                    color: "rgba(255,255,255,0.6)",
                    margin: 0,
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}>
                    Tell us what you need — we respond within 24 hrs.
                  </p>

                  {/* Gold accent line */}
                  {/* <div style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: "2px",
                    background: "linear-gradient(90deg, transparent, #c49e48, transparent)",
                  }} /> */}
                </div>

                {/* Form body */}
                <div style={{ background: "#fff", padding: "26px 24px 24px" }}>
                  <ContactForm
                    singleColumn={true}
                    compact={true}
                    redirectPath="/contact/thank-you"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetailsMain;
