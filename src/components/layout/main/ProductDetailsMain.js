"use client";

import HeroInner from "@/components/sections/hero/HeroInner";
import ContactForm from "@/components/sections/contacts/ContactForm";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import { resolveCmsImage } from "@/lib/seoConfig";

const resolveApiImage = (src) => {
  if (!src) return "/images/project/h5-project-1.webp";
  return resolveCmsImage(src) || "/images/project/h5-project-1.webp";
};

const ProductDetailsMain = ({ product, categories = [], relatedProducts = [] }) => {
  const sidebarCategories = categories.slice(0, 6);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    // Check if product has specific resources mapping to backend CMS
    const productResources = [];
    
    if (product?.catalog || product?.brochure) {
      productResources.push({
        id: 'catalog',
        title: 'Product Catalog',
        pdf: product.catalog || product.brochure
      });
    }
    
    if (product?.certificate) {
      productResources.push({
        id: 'certificate',
        title: 'Quality Certificate',
        pdf: product.certificate
      });
    }

    if (productResources.length > 0) {
      setResources(productResources);
      return;
    }

    // Fallback to global resources if no product-specific ones are found
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
  }, [product]);
  console.log("ProductDetailsMain received product:", product);
  return (
    <div>
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
                      style={{ width: "100%", height: "520px", objectFit: "cover", display: 'block' }}
                    />
                 
                  </div>
                </div>

                <div className="product-content">

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
                <div
                  className="tj-sidebar-widget wow fadeInUp"
                  style={{
                    border: "1px dashed var(--tj-color-theme-primary)",
                  }}
                >
                  <h4 className="widget-title">Our Resources</h4>
                  <style>{`
                    .download-item {
                      display: flex;
                      align-items: center;
                      gap: 14px;
                      padding: 14px 16px;
                      border-radius: 10px;
                      border: 1px solid var(--tj-color-border-1);
                      background: #fff;
                      color: var(--tj-color-heading-primary);
                      font-weight: 600;
                      font-size: 14px;
                      text-decoration: none;
                      transition: all 0.25s ease;
                      margin-bottom: 10px;
                      position: relative;
                      overflow: hidden;
                    }
                    .download-item::before {
                      content: '';
                      position: absolute;
                      left: 0; top: 0; bottom: 0;
                      width: 3px;
                      background: var(--tj-color-theme-primary);
                      border-radius: 10px 0 0 10px;
                    }
                    .download-item:hover {
                      background: var(--tj-color-theme-primary);
                      color: #fff;
                      border-color: var(--tj-color-theme-primary);
                      transform: translateX(4px);
                      box-shadow: 0 6px 20px rgba(201,148,68,0.2);
                    }
                    .download-item:hover::before { background: rgba(255,255,255,0.4); }
                    .download-item:hover .dl-icon { color: #fff !important; }
                    .download-item:hover .dl-arrow { opacity: 1; transform: translateX(0); }
                    .dl-icon-wrap {
                      width: 42px; height: 42px;
                      border-radius: 8px;
                      background: var(--tj-color-theme-bg, #fdf8f0);
                      display: flex; align-items: center; justify-content: center;
                      flex-shrink: 0;
                      transition: background 0.25s;
                    }
                    .download-item:hover .dl-icon-wrap { background: rgba(255,255,255,0.2); }
                    .dl-icon { font-size: 20px; transition: color 0.25s; }
                    .dl-text { flex: 1; line-height: 1.3; }
                    .dl-label { font-size: 11px; font-weight: 500; opacity: 0.6; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
                    .dl-arrow {
                      font-size: 14px;
                      opacity: 0;
                      transform: translateX(-6px);
                      transition: all 0.25s;
                    }
                    .dl-empty {
                      text-align: center;
                      padding: 20px;
                      font-size: 13px;
                      color: #94a3b8;
                      border: 1px dashed var(--tj-color-border-1);
                      border-radius: 8px;
                    }
                  `}</style>
                  <div>
                    {resources.map((item) => {
                      const isCert = item.title.toLowerCase().includes('cert');
                      return (
                        <a
                          key={item.id}
                          href={item.pdf ? resolveApiImage(item.pdf) : '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-item"
                        >
                          <div className="dl-icon-wrap">
                            <i
                              className={`fa-light ${isCert ? 'fa-file-shield' : 'fa-file-pdf'} dl-icon`}
                              style={{ color: isCert ? 'var(--tj-color-theme-primary)' : '#e53e3e' }}
                            />
                          </div>
                          <div className="dl-text">
                            <div className="dl-label">{isCert ? 'Certificate' : 'PDF Document'}</div>
                            <div>{item.title}</div>
                          </div>
                          <i className="tji-arrow-right dl-arrow" />
                        </a>
                      );
                    })}
                    {resources.length === 0 && (
                      <div className="dl-empty">
                        <i className="fa-light fa-folder-open" style={{ fontSize: '28px', marginBottom: '8px', display: 'block', color: 'var(--tj-color-theme-primary)' }} />
                        No downloads available
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Enquiry Form */}
                <div className=" wow fadeInUp">
                  <div style={{
                    background: 'var(--tj-color-theme-dark)',
                    borderRadius: '12px 12px 0 0',
                    padding: '20px 24px 16px',
                    borderBottom: '3px solid var(--tj-color-theme-primary)',
                  }}>
                    <h4 className="widget-title" style={{ color: '#fff', marginBottom: '4px' }}>Get a Free Quote</h4>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>Tell us what you need — we respond within 24 hrs.</p>
                  </div>
                  <div style={{ background: '#fff', padding: '26px 24px 24px', borderRadius: '0 0 12px 12px', border: '1px solid var(--tj-color-border-1)', borderTop: 'none' }}>
                    <ContactForm
                      singleColumn={true}
                      compact={true}
                      redirectPath="/contact/thank-you"
                    />
                  </div>
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