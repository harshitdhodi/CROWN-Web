"use client";

import { useState, useEffect } from "react";
import HeroInner from "@/components/sections/hero/HeroInner";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

const resolveApiImage = (src) => {
  if (!src) return "/images/service/service-1.webp";
  if (Array.isArray(src)) {
    return resolveApiImage(src[0]);
  }
  if (typeof src !== "string") return "/images/service/service-1.webp";
  let cleanSrc = src;
  if (src.includes("/uploads/")) {
    cleanSrc = "/uploads/" + src.split("/uploads/")[1];
  } else if (src.startsWith("http")) {
    return src;
  }
  return cleanSrc.startsWith("/") ? `${BASE_URL}${cleanSrc}` : `${BASE_URL}/${cleanSrc}`;
};

const CategoryDetailsMain = ({ category, categories = [], currentSlug }) => {
  const router = useRouter();
  const sidebarCategories = categories.slice(0, 6);
console.log("category",category)
  const [openDropdownSlug, setOpenDropdownSlug] = useState(null);
  const [productsData, setProductsData] = useState({}); // Store products by slug
  const [loadingSlug, setLoadingSlug] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
  const [currentCategoryProducts, setCurrentCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: null });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          url: typeof window !== 'undefined' ? window.location.href : ''
        })
      });
      if (response.ok) {
        setFormStatus({ loading: false, success: true, error: null });
        setFormData({ name: '', email: '', message: '' });
        router.push('/thank-you');
      } else {
        const errData = await response.json();
        setFormStatus({ loading: false, success: false, error: errData.error || 'Failed to submit' });
      }
    } catch (err) {
      setFormStatus({ loading: false, success: false, error: 'Network error. Please try again later.' });
    }
  };

  // Fetch products when dropdown is opened
  useEffect(() => {
    if (!openDropdownSlug) return;

    const fetchProducts = async () => {
      if (productsData[openDropdownSlug]) return; // Already loaded

      setLoadingSlug(openDropdownSlug);
      try {
        const res = await fetch(`/api/products-by-category-slug/${openDropdownSlug}`, {
          signal: AbortController.signal // Logic to prevent race conditions on fast clicking
        });

        if (!res.ok) throw new Error('Network response was not ok');

        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          setProductsData((prev) => ({
            ...prev,
            [openDropdownSlug]: result.data,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoadingSlug(null);
      }
    };

    fetchProducts();
  }, [openDropdownSlug]);

  // Fetch products for current category
  useEffect(() => {
    const fetchCurrentProducts = async () => {
      setLoadingProducts(true);
      try {
        const res = await fetch(`/api/products-by-category-slug/${currentSlug}`);
        if (!res.ok) throw new Error('Network response was not ok');
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
    if (currentSlug) {
      fetchCurrentProducts();
    }
  }, [currentSlug]);

  const toggleDropdown = (slug, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenDropdownSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div>
      <HeroInner
        title={category.title}
        text={category.title}
        breadcrums={[{ name: "Services", path: "/services" }]}
      />

      <section className="tj-service-area section-gap">
        <div className="container">
          <div className="row row-gap-5">
            <div className="col-lg-8">
              <div className="post-details-wrapper">
                {/* <div className="blog-images wow fadeInUp" data-wow-delay=".1s">
                  <img
                    src={resolveApiImage(category.image)}
                    alt={category.title}
                    style={{ width: "100%", height: "auto", borderRadius: "12px" }}
                  />
                </div> */}

                <h2 className="title title-anim">{category.title}</h2>
                <div className="blog-text">
                  <style>{`
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
                    .tiptap-prose ol li {
                      padding-left: 0 !important;
                    }
                    .tiptap-prose p { margin: 0 0 1rem 0; }
                    @media (max-width:767px){ .tiptap-prose ul, .tiptap-prose ol { grid-template-columns: 1fr; columns: 1 !important; } }
                  `}</style>

                  {/* Sidebar Theme Improvements */}
                  <style>{`
                    .category-list { list-style: none; padding: 0; margin: 0; }
                    .category-item { border-bottom: 1px solid var(--tj-color-border-1); }
                    .category-item:last-child { border-bottom: none; }
                    .category-link { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; color: var(--tj-color-heading-primary); font-weight: 500; transition: all 0.3s ease; text-decoration: none; }
                    .category-link.active { color: var(--tj-color-theme-primary); }
                    .category-link:hover { color: var(--tj-color-theme-primary); padding-left: 5px; }
                    
                    .category-link .icon { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background: var(--tj-color-theme-bg); border-radius: 4px; font-size: 12px; cursor: pointer; transition: 0.3s; color: var(--tj-color-heading-primary); }
                    .category-link:hover .icon { background: var(--tj-color-theme-primary); color: #fff; }
                    
                    .products-dropdown { padding: 0 0 15px 15px; animation: slideDown 0.4s ease forwards; overflow: hidden; }
                    .products-list { list-style: none; padding: 0; margin: 0; border-left: 2px solid var(--tj-color-theme-primary); }
                    .product-item { padding: 0; font-size: 14px; position: relative; transition: 0.3s; }
                    .product-item a { display: block; padding: 6px 18px; color: var(--tj-color-text-body); text-decoration: none; transition: 0.3s; }
                    .product-item::before { content: ""; position: absolute; left: 0; top: 18px; width: 10px; height: 1px; background: var(--tj-color-theme-primary); }
                    .product-item:hover a { color: var(--tj-color-theme-primary); padding-left: 22px; }
                    
                    .loading-text, .no-products { font-size: 13px; font-style: italic; color: var(--tj-color-text-body); opacity: 0.6; padding: 10px 0 10px 18px; }

                    @keyframes slideDown {
                      from { opacity: 0; max-height: 0; transform: translateY(-8px); }
                      to { opacity: 1; max-height: 800px; transform: translateY(0); }
                    }
                    
                    .category-link .icon i { transition: all 0.3s ease; }
                    .category-link.active .icon { background: var(--tj-color-theme-primary); color: #fff; }
                  `}</style>

                {/* Custom products grid styles */}
                <style>{`
                  .category-products-section {
                    margin-bottom: 50px;
                  }
                  .product-grid-card {
                    background: #fff;
                    border: 1px solid var(--tj-color-border-1);
                    border-radius: 12px;
                    overflow: hidden;
                    height: 100%;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
                    transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
                    display: flex;
                    flex-direction: column;
                  }
                  .product-grid-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 12px 30px rgba(30, 138, 138, 0.12);
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
                    transition: transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
                  }
                  .product-grid-card:hover .product-img {
                    transform: scale(1.08);
                  }
                  .img-hover-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(30, 138, 138, 0.85);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    pointer-events: none;
                  }
                  .product-grid-card:hover .img-hover-overlay {
                    opacity: 1;
                  }
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
                  .product-grid-card:hover .view-details-btn {
                    transform: translateY(0);
                  }
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
                `}</style>

                {/* Category Products Grid (Shown Upperside) */}
                <div className="category-products-section wow fadeInUp" data-wow-delay=".3s">
                  <h3 className="section-title" style={{ 
                    fontSize: '28px',
                    fontWeight: '700',
                    marginBottom: '30px', 
                    borderLeft: '4px solid var(--tj-color-theme-primary)', 
                    paddingLeft: '15px',
                    color: 'var(--tj-color-heading-primary)'
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
                                  {product.details ? product.details.replace(/<[^>]+>/g, "").substring(0, 100) + "..." : "High-quality industrial manufacturing solution."}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-5 border rounded" style={{ borderColor: 'var(--tj-color-border-1)', background: 'var(--tj-color-theme-bg)' }}>
                      <p style={{ margin: 0, opacity: 0.6, color: 'var(--tj-color-text-body)' }}>No products listed under this category yet.</p>
                    </div>
                  )}
                </div>

                {category.description && (
                  <div className="wow fadeInUp" data-wow-delay=".3s">
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
          </div>

            {/* Sidebar - Formal & Attractive Design */}
            <div className="col-lg-4">
              <aside className="tj-main-sidebar">
                <div className="tj-sidebar-widget service-categories wow fadeInUp" data-wow-delay=".1s">
                  <h4 className="widget-title">Our Categories</h4>
                  <ul className="category-list">
                    {sidebarCategories.map((item) => (
                      <li key={item.slug} className="category-item">
                        <Link
                          className={`category-link ${item.slug === currentSlug ? "active" : ""}`}
                          href={`/${item.slug}`}
                        >
                          <span className="category-title">{item.title}</span>
                          <span
                            className="icon"
                            onClick={(e) => toggleDropdown(item.slug, e)}
                          >
                            <i className={openDropdownSlug === item.slug ? "tji-arrow-down" : "tji-arrow-right"}></i>
                          </span>
                        </Link>

                        {/* Products Dropdown */}
                        {openDropdownSlug === item.slug && (
                          <div className="products-dropdown">
                            <ul className="products-list">
                              {loadingSlug === item.slug ? (
                                <li className="loading-text">Loading products...</li>
                              ) : productsData[item.slug] && productsData[item.slug].length > 0 ? (
                                productsData[item.slug].map((product, idx) => (
                                  <li key={product.slug || idx} className="product-item">
                                    <Link href={`/${product.slug}`}>
                                      {product.name}
                                    </Link>
                                  </li>
                                ))
                              ) : (
                                <li className="no-products">No products available</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Quick Enquiry Widget */}
                <div className="tj-sidebar-widget contact-widget wow fadeInUp" data-wow-delay=".2s" style={{ background: 'var(--tj-color-theme-bg)', padding: '30px', borderRadius: '12px', color: 'var(--tj-color-text-body)', border: '1px solid var(--tj-color-border-1)', marginTop: '30px' }}>
                  <h4 style={{ color: 'var(--tj-color-heading-primary)', marginBottom: '20px' }}>Quick Enquiry For Services</h4>
                  <form onSubmit={handleFormSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="Your Name"
                        required
                        style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--tj-color-border-1)', outline: 'none', color: 'var(--tj-color-text-body)', background: '#fff' }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Your Email"
                        required
                        style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--tj-color-border-1)', outline: 'none', color: 'var(--tj-color-text-body)', background: '#fff' }}
                      />
                    </div>
                    <div style={{ marginBottom: '15px' }}>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleFormChange}
                        placeholder="Your Message"
                        required
                        rows="3"
                        style={{ width: '100%', padding: '10px 15px', borderRadius: '6px', border: '1px solid var(--tj-color-border-1)', outline: 'none', color: 'var(--tj-color-text-body)', background: '#fff', resize: 'vertical' }}
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      disabled={formStatus.loading}
                      style={{ background: 'var(--tj-color-theme-primary)', color: '#fff', padding: '12px 20px', borderRadius: '6px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%', transition: 'all 0.3s' }}
                    >
                      {formStatus.loading ? 'Sending...' : 'Send Enquiry Now'}
                    </button>
                    {formStatus.success && <p style={{ color: '#28a745', marginTop: '10px', fontSize: '14px' }}>Message sent successfully!</p>}
                    {formStatus.error && <p style={{ color: '#dc3545', marginTop: '10px', fontSize: '14px' }}>{formStatus.error}</p>}
                  </form>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryDetailsMain;