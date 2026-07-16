"use client";

import HeroInner from "@/components/sections/hero/HeroInner";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

const resolveApiImage = (src) => {
  if (!src) return "/images/project/h5-project-1.webp";
  if (Array.isArray(src)) {
    return resolveApiImage(src[0]);
  }
  if (typeof src !== "string") return "/images/project/h5-project-1.webp";
  let cleanSrc = src;
  if (src.includes("/uploads/")) {
    cleanSrc = "/uploads/" + src.split("/uploads/")[1];
  } else if (src.startsWith("http")) {
    return src;
  }
  return cleanSrc.startsWith("/") ? `${BASE_URL}${cleanSrc}` : `${BASE_URL}/${cleanSrc}`;
};

const ProductDetailsMain = ({ product, categories = [], relatedProducts = [] }) => {
  const router = useRouter();
  const sidebarCategories = categories.slice(0, 6);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: null });
  const [resources, setResources] = useState([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/data/resources');
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setResources(json.data.slice(-2));
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      }
    };
    fetchResources();
  }, []);

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
  console.log("ProductDetailsMain received product:", product);
  return (
    <div>
      <HeroInner
        title={product.name}
        text={product.name}
        breadcrums={[
          { name: "Categories", path: "/categories" },
          { name: "Products", path: "/products" }
        ]}
      />

      <section className="tj-product-details-area section-gap">
        <div className="container">
          <div className="row row-gap-5">
            <div className="col-lg-8">
              <div className="product-details-wrapper">
                {/* Product Images Section */}
                <div className="product-main-image wow fadeInUp" data-wow-delay=".1s">
                  <div className="image-box" style={{ position: 'relative', overflow: 'hidden', borderRadius: '12px', border: '1px solid var(--tj-color-border-1)', marginBottom: '30px' }}>
                    <img
                      src={resolveApiImage(product.image?.[0])}
                      alt={product.name}
                      style={{ width: "100%", height: "auto", display: 'block' }}
                    />
                    <div
                      className="page-header-overlay"
                      style={{
                        backgroundImage: `url('/images/shape/pheader-overlay.webp')`,
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 1
                      }}
                    ></div>
                  </div>
                </div>

                <div className="product-content">
                  <h2 className="title wow fadeInUp">{product.name}</h2>

                  {/* Dynamic Content Styling */}
                  <style>{`
                    .product-prose h4 { 
                      font-size: 24px; 
                      margin: 40px 0 20px 0; 
                      color: var(--tj-color-heading-primary); 
                      border-bottom: 2px solid var(--tj-color-theme-primary);
                      display: inline-block;
                      padding-bottom: 5px;
                    }
                    .product-prose table { 
                      width: 100%; 
                      border-collapse: collapse; 
                      margin: 20px 0; 
                      background: #fdfdfd;
                    }
                    .product-prose th { 
                      background: var(--tj-color-theme-bg) !important; 
                      color: var(--tj-color-heading-primary); 
                      text-align: left;
                      font-weight: 600;
                    }
                    .product-prose td, .product-prose th { 
                      border: 1px solid var(--tj-color-border-1) !important; 
                      padding: 12px 15px !important; 
                    }
                    .product-prose ul { 
                      list-style: none !important; 
                      padding: 0 !important; 
                      display: grid; 
                      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); 
                      gap: 10px;
                    }
                    .product-prose li { 
                      position: relative; 
                      padding-left: 20px !important; 
                      margin-bottom: 8px;
                      color: var(--tj-color-text-body);
                    }
                    .product-prose li::before { 
                      content: ""; 
                      position: absolute; 
                      left: 0; 
                      top: 10px;
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background-color: var(--tj-color-theme-primary); 
                    }
                    .cta-card {
                      background: var(--tj-color-theme-dark);
                      padding: 40px;
                      border-radius: 12px;
                      color: #fff;
                      margin-top: 50px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      flex-wrap: wrap;
                      gap: 20px;
                    }
                    .tj-btn-primary { 
                      background: var(--tj-color-theme-primary);
                      color: #fff;
                      padding: 15px 30px;
                      border-radius: 5px;
                      font-weight: 600;
                      display: inline-block;
                    }
                  `}</style>

                  <div className="product-prose wow fadeInUp" data-wow-delay=".2s">
                    <div dangerouslySetInnerHTML={{ __html: product.details }} />

                    {/* Grades / Certifications Placeholders (if not in details) */}
                    {product.grades && (
                      <div className="grades-section">
                        <h4>Grades & Variants</h4>
                        <p>{product.grades}</p>
                      </div>
                    )}
                  </div>

                  {/* CTA Section */}
                  <div className="cta-card wow fadeInUp">
                    <div className="cta-text">
                      <h3 style={{ color: '#fff', marginBottom: '10px' }}>Need a Custom Quote?</h3>
                      <p style={{ margin: 0, opacity: 0.8 }}>Contact our sales team for bulk pricing and technical consultation.</p>
                    </div>
                    <div className="cta-actions">
                      <Link href="/contact" className="tj-btn-primary">Get A Quote</Link>
                    </div>
                  </div>
                </div>

                {/* Related Products Section */}
                {relatedProducts.length > 0 && (
                  <div className="related-products-section wow fadeInUp" style={{ marginTop: '60px' }}>
                    <h3 className="widget-title" style={{ marginBottom: '30px', borderLeft: '4px solid var(--tj-color-theme-primary)', paddingLeft: '15px' }}>
                      Related Products
                    </h3>
                    <div className="row row-gap-4">
                      {relatedProducts.slice(0, 4).map((item, idx) => (
                        <div key={idx} className="col-sm-6 col-md-4">
                          <div className="related-item-card" style={{
                            border: '1px solid var(--tj-color-border-1)',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            transition: '0.3s'
                          }}>
                            <Link href={`/${item.slug}`}>
                              <div className="item-img" style={{ height: '180px', overflow: 'hidden' }}>
                                <img
                                  src={resolveApiImage(item.image?.[0])}
                                  alt={item.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                              <div className="item-content" style={{ padding: '15px' }}>
                                <h6 style={{
                                  margin: 0,
                                  fontSize: '16px',
                                  color: 'var(--tj-color-heading-primary)',
                                  overflow: 'hidden',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical'
                                }}>
                                  {item.name}
                                </h6>
                              </div>
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="col-lg-4">
              <aside className="tj-main-sidebar">
                {/* Download Brochure Widget */}
                <div className="tj-sidebar-widget wow fadeInUp">
                  <h4 className="widget-title">Downloads</h4>
                  <div className="download-btn-wrap" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {resources.map((item) => (
                      <a key={item.id} href={item.pdf ? resolveApiImage(item.pdf) : '#'} target="_blank" rel="noopener noreferrer" className="download-btn" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: '#f5f5f5', borderRadius: '8px', color: 'var(--tj-color-heading-primary)', fontWeight: '600' }}>
                        <i className={`fa-light ${item.title.toLowerCase().includes('cert') ? 'fa-file-shield' : 'fa-file-pdf'}`} style={{ fontSize: '24px', color: item.title.toLowerCase().includes('cert') ? 'var(--tj-color-theme-primary)' : 'red' }}></i>
                        <span>{item.title}</span>
                      </a>
                    ))}
                    {resources.length === 0 && (
                      <span style={{ fontSize: '14px', color: '#666' }}>No downloads available.</span>
                    )}
                  </div>
                </div>

                <div className="tj-sidebar-widget service-categories wow fadeInUp">
                  <h4 className="widget-title">Product Categories</h4>
                  <style>{`
                    .tj-category-link {
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      padding: 15px 20px;
                      background: #fafafa;
                      border-radius: 8px;
                      margin-bottom: 12px;
                      color: var(--tj-color-heading-primary);
                      text-decoration: none;
                      font-weight: 500;
                      border: 1px solid #eaeaea;
                      transition: all 0.3s ease;
                    }
                    .tj-category-link:hover {
                      background: var(--tj-color-theme-primary);
                      color: #fff;
                      border-color: var(--tj-color-theme-primary);
                      transform: translateX(5px);
                      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                    }
                    .tj-category-link i {
                      font-size: 16px;
                      transition: all 0.3s ease;
                    }
                  `}</style>
                  <ul className="category-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {sidebarCategories.map((item) => (
                      <li key={item.slug}>
                        <Link href={`/${item.slug}`} className="tj-category-link">
                          <span>{item.title}</span>
                          <i className="tji-arrow-right"></i>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tj-sidebar-widget contact-widget" style={{ background: 'var(--tj-color-theme-bg)', padding: '30px', borderRadius: '12px', color: 'var(--tj-color-text-body)', border: '1px solid var(--tj-color-border-1)' }}>
                  <h4 className="widget-title">Quick Enquiry For Services</h4>
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

export default ProductDetailsMain;