'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LazyMap from '@/components/shared/LazyMap';

export default function Footer8Client() {
  const [footerData, setFooterData] = useState(null);
  const [servicesData, setServicesData] = useState([]);
  const [contactMapUrl, setContactMapUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const [resFooter, resService, resContact] = await Promise.all([
          fetch('/api/data/footer'),
          fetch('/api/data/service'),
          fetch('/api/data/contactus?fields=mapurl')
        ]);

        if (resFooter.ok) {
          const json = await resFooter.json();
          if (json.success && json.data?.length > 0) {
            setFooterData(json.data[0]);
          }
        }
        if (resService.ok) {
          const json = await resService.json();
          if (json.success && Array.isArray(json.data)) {
            setServicesData(json.data);
          }
        }
        if (resContact.ok) {
          const json = await resContact.json();
          const mapurl = json.data?.[0]?.mapurl;

          if (mapurl) {
            if (typeof mapurl === 'string' && mapurl.includes('<iframe')) {
              const iframeMatch = mapurl.match(/<iframe.*?src="([^"]+)"/);
              if (iframeMatch?.[1]) {
                setContactMapUrl(iframeMatch[1]);
              }
            } else if (
              mapurl.includes('google.com/maps/embed') ||
              mapurl.includes('maps.google.com')
            ) {
              setContactMapUrl(mapurl);
            } else if (
              mapurl.includes('maps.app.goo.gl') ||
              mapurl.includes('goo.gl/maps')
            ) {
              try {
                const mapRes = await fetch(mapurl, { method: 'HEAD', redirect: 'follow' });
                const expandedUrl = mapRes.url;
                const pathMatch = expandedUrl.match(/\/place\/([^\/]+)/);
                const coordsMatch = expandedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
                
                let query = '';
                if (pathMatch && pathMatch[1]) {
                  query = pathMatch[1]; 
                } else if (coordsMatch) {
                  query = `${coordsMatch[1]},${coordsMatch[2]}`;
                }
                
                if (query) {
                  setContactMapUrl(`https://maps.google.com/maps?q=${query}&output=embed`);
                }
              } catch (err) {
                console.warn('Failed to resolve short Google Maps URL client-side:', err);
              }
            } else {
              setContactMapUrl(mapurl);
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch footer data client-side:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const logoUrl = footerData?.logo?.[0]
    ? (footerData.logo[0].startsWith('/') ? footerData.logo[0] : `/${footerData.logo[0]}`)
    : '/images/logos/logo-large.webp';
    
  const description = footerData?.description || 'Developing personalized client experiences to maximize satisfaction & brand loyalty across our operations.';
  const address = footerData?.address || '993 Renner Burg, West Rond, MT 94251-030, USA.';
  const mobile = footerData?.mobile || '+1 (009) 544-7818';
  const email = footerData?.email || 'support@wiretex.com';

  const facebook = footerData?.facebook || 'https://www.facebook.com/';
  const instagram = footerData?.instagram || 'https://www.instagram.com/';
  const twitter = footerData?.twitter || 'https://x.com/';
  const linkedin = footerData?.linkedin || 'https://www.linkedin.com/';

  return (
    <footer className="tj-footer-section footer-2 h5-footer h6-footer h8-footer section-gap-x" style={{ marginTop: '50px' }}>
      <div className="h6-footer-logo-area">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="h8-footer-logo-wrapper">
                <div className="h6-footer-logo h8-footer-logo">
                  <Link href="/" prefetch={false} className="wow fadeInLeftBig" data-wow-delay=".3s">
                    <Image src={logoUrl} alt="Logo" width={440} height={75} style={{ height: 'auto' }} />
                  </Link>
                </div>
                <div className="h8-footer-logo-content wow fadeInRightBig" data-wow-delay=".4s">
                  <div className="footer-text">
                    <p>{description}</p>
                  </div>
                  <div className="social-links style-3">
                    <ul>
                      <li>
                        <Link href={facebook} target="_blank" aria-label="Facebook">
                          <i className="fa-brands fa-facebook-f"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={instagram} target="_blank" aria-label="Instagram">
                          <i className="fa-brands fa-instagram"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={twitter} target="_blank" aria-label="Twitter">
                          <i className="fa-brands fa-x-twitter"></i>
                        </Link>
                      </li>
                      <li>
                        <Link href={linkedin} target="_blank" aria-label="LinkedIn">
                          <i className="fa-brands fa-linkedin-in"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-main-area h8-footer-main">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div className="footer-widget widget-contact h6-footer-contact h8-footer-contact wow fadeInUp" data-wow-delay=".3s">
                <h5 className="title">Our Office</h5>
                <div className="footer-contact-info">
                  <div className="contact-item">
                    <span>{address}</span>
                  </div>
                  <div className="contact-item">
                    <Link href={`tel:${mobile.replace(/[^0-9+]/g, '')}`}>P: {mobile}</Link>
                    <Link href={`mailto:${email}`}>M: {email}</Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-3 col-md-6">
              <div className="footer-widget footer-col-2 widget-nav-menu h6-footer-col-2 h8-footer-col-2 wow fadeInUp" data-wow-delay=".4s">
                <h5 className="title">Services</h5>
                <ul>
                  {servicesData.length > 0 ? (
                    servicesData.slice(0, 6).map((service) => (
                      <li key={service.id}>
                        <Link href={`/services/${service.slug}`} prefetch={false}>{service.title}</Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><Link href="/services/customer-experience" prefetch={false}>Customer Experience</Link></li>
                      <li><Link href="/services/training-programs" prefetch={false}>Training Programs</Link></li>
                      <li><Link href="/services/business-strategy" prefetch={false}>Business Strategy</Link></li>
                      <li><Link href="/services/esg-consulting" prefetch={false}>ESG Consulting</Link></li>
                    </>
                  )}
                </ul>
              </div>
            </div>
            <div className="col-xl-2 col-lg-2 col-md-6">
              <div className="footer-widget footer-col-3 widget-nav-menu h6-footer-col-3 h8-footer-col-3 wow fadeInUp" data-wow-delay=".5s">
                <h5 className="title">Resources</h5>
                <ul>
                  <li><Link href="/" prefetch={false}>Home</Link></li>
                  <li><Link href="/about-us" prefetch={false}>About Us</Link></li>
                  <li><Link href="/products" prefetch={false}>Products</Link></li>
                  <li><Link href="/services" prefetch={false}>Services</Link></li>
                  <li><Link href="/categories" prefetch={false}>Categories</Link></li>
                  <li><Link href="/blogs" prefetch={false}>Blog</Link></li>
                  <li><Link href="/contact" prefetch={false}>Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-xl-4 col-lg-4 col-md-6">
              <div className="footer-widget widget-subscribe h6-footer-subscribe h8-footer-subscribe wow fadeInUp" data-wow-delay=".6s">
                <h5 className="title">Find Us Here</h5>
                <div className="footer-map" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                  {contactMapUrl ? (
                    <LazyMap
                      src={contactMapUrl}
                      width="100%"
                      height="220px; border:0; border-radius:10px"
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div style={{ width: '100%', height: '220px', background: '#e9ecef', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <p style={{ color: '#6c757d', fontSize: '12px' }}>Map not available</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="tj-copyright-area-2 h5-footer-copyright h8-footer-copyright">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="copyright-content-area">
                <div className="copyright-text">
                  <p>
                    &copy; {new Date().getFullYear()}{' '}
                    <Link href="#" prefetch={false}>
                      Wiretex
                    </Link>{' '}
                    All right reserved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-shape-1">
        <img src="/images/shape/pattern-2.svg" alt="" width={370} height={590} />
      </div>
      <div className="bg-shape-2">
        <img src="/images/shape/pattern-3.svg" alt="" width={370} height={590} />
      </div>
    </footer>
  );
}
