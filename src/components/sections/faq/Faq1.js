"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const resolveApiImage = (src) => {
  if (!src) return "/images/faq/faq.webp";
  if (Array.isArray(src)) {
    return resolveApiImage(src[0]);
  }
  if (typeof src !== "string") return "/images/faq/faq.webp";
  if (src.startsWith("http")) return src;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3032";
  return `${baseUrl}${src}`;
};

const DUMMY_FAQS = [
  {
    question: "What types of industrial packaging solutions do you offer?",
    ans: "We provide conveyor systems, automatic case packers, wrap-around case packers, and custom material handling systems designed to increase production line efficiency."
  },
  {
    question: "Are your machines compatible with custom production line layouts?",
    ans: "Yes, our engineering team designs and adapts all equipment to fit seamlessly into your existing manufacturing infrastructure and space constraints."
  }
];

const Faq1 = ({ page, infoPage, showImage = true, showFallback = false }) => {
  const pathname = usePathname();
  const pageName = page || (pathname ? (pathname.replace(/^\/|\/$/g, "") || "home") : "home");
  const infoPageName = infoPage || pageName;

  const [activeIndex, setActiveIndex] = useState(0);
  const [faqInfo, setFaqInfo] = useState(null);
  const [faqs, setFaqs] = useState([]);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch faq_info
        const resInfo = await fetch(`/api/data/faq_info?page=${infoPageName}`);
        if (resInfo.ok) {
          const jsonInfo = await resInfo.json();
          if (jsonInfo.success && jsonInfo.data?.length > 0) {
            setFaqInfo(jsonInfo.data[0]);
          }
        }

        // Fetch faq list for the specific page
        const resFaqs = await fetch(`/api/data/faqs?page=${pageName}`);
        if (resFaqs.ok) {
          const jsonFaqs = await resFaqs.json();
          if (jsonFaqs.success && Array.isArray(jsonFaqs.data)) {
            setFaqs(jsonFaqs.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch FAQ data:", err);
      }
    };
    fetchData();
  }, [pageName]);

  const displayFaqs = faqs.length > 0 ? faqs : (showFallback ? DUMMY_FAQS : []);

  if (displayFaqs.length === 0) return null;

  const tagline = faqInfo?.tagline || "FAQ";
  const heading = faqInfo?.heading || "Frequently Asked Questions";
  const subheading = faqInfo?.subheading || "Providing Reliable & High-Performance Packaging & Automation Solutions";
  const imageUrl = resolveApiImage(faqInfo?.image);

  return (
    <section className="tj-faq-section section-gap section-gap-x !pt-[0px] lg:!my-[50px]">
      <style>{`
        .tj-faq-section .accordion-item {
          margin-bottom: 15px !important;
          border-radius: 8px !important;
          overflow: hidden;
          border: 1px solid var(--tj-color-border-1) !important;
        }
        .tj-faq-section .faq-title {
          padding: 22px 25px !important;
          font-size: 16px !important;
          line-height: 1.5 !important;
          letter-spacing: normal !important;
        }
        .tj-faq-section .accordion-body {
          padding: 0 25px 22px 25px !important;
        }
      `}</style>
      {!showImage && (
        <style>{`
          .tj-faq-section {
            padding-top: 0 !important;
          }
          .tj-faq-section,
          .tj-faq-section .sec-heading,
          .tj-faq,
          .tj-faq .sec-heading {
            text-align: left !important;
            align-items: flex-start !important;
            justify-content: flex-start !important;
            margin-left: 0 !important;
            margin-right: auto !important;
            display: flex !important;
            flex-direction: column !important;
            width: 100% !important;
          }
          .tj-faq-section .accordion {
            width: 100% !important;
          }
          .tj-faq-section .sec-title,
          .tj-faq .sec-title,
          .sec-title {
            text-align: left !important;
            display: block !important;
            margin-left: 0 !important;
            margin-right: auto !important;
          }
          .tj-faq-section .sub-title,
          .tj-faq .sub-title,
          .sub-title {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            display: inline-flex !important;
            margin-left: 0 !important;
            margin-right: auto !important;
          }
          .tj-faq-section .sub-title i,
          .tj-faq .sub-title i,
          .sub-title i {
            margin-right: 8px !important;
            margin-left: 0 !important;
          }
        `}</style>
      )}
      <div className="container">
        <div className="row align-items-stretch">
          {showImage ? (
            <>


              <div className="col-lg-12 col-12">
                <div className="tj-faq style-2 wow fadeInRight" data-wow-delay=".3s">
                  <div className="sec-heading" style={{ textAlign: "left", maxWidth: "70%", alignItems: "flex-start", marginRight: "auto", marginLeft: "0", display: "flex", flexDirection: "column", gap: "10px" }}>
                    <span className="sub-title" style={{ display: "inline-flex", alignItems: "center", gap: "8px", margin: "0" }}>
                      <i className="tji-box"></i> {tagline}
                    </span>
                    <h2 className="sec-title" style={{ textAlign: "left", maxWidth: "100%", margin: "0" }}>{heading}</h2>
                  </div>

                  <div className="accordion" id="accordionFaq">
                    {displayFaqs.map((faq, idx) => {
                      const isOpen = activeIndex === idx;
                      return (
                        <div key={faq.id || idx} className="accordion-item">
                          <h2 className="accordion-header">
                            <button
                              className={`faq-title ${isOpen ? "" : "collapsed"}`}
                              type="button"
                              onClick={() => toggleAccordion(idx)}
                              aria-expanded={isOpen}
                            >
                              {faq.question}
                            </button>
                          </h2>
                          {isOpen && (
                            <div className="accordion-body">
                              <p>{faq.ans}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="col-lg-12 col-12">
              <div className="tj-faq style-2 wow fadeInRight" data-wow-delay=".3s">
                <div className="sec-heading" style={{ textAlign: "left" }}>
                  <span className="sub-title" style={{ display: "inline-flex", alignItems: "center", gap: "8px", justifyContent: "flex-start" }}>
                    <i className="tji-box"></i> {tagline}
                  </span>
                  <h2 className="sec-title" style={{ textAlign: "left" }}>{heading}</h2>
                </div>

                <div className="accordion" id="accordionFaq">
                  {displayFaqs.map((faq, idx) => {
                    const isOpen = activeIndex === idx;
                    return (
                      <div key={faq.id || idx} className="accordion-item">
                        <h2 className="accordion-header">
                          <button
                            className={`faq-title ${isOpen ? "" : "collapsed"}`}
                            type="button"
                            onClick={() => toggleAccordion(idx)}
                            aria-expanded={isOpen}
                          >
                            {faq.question}
                          </button>
                        </h2>
                        {isOpen && (
                          <div className="accordion-body">
                            <p>{faq.ans}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Faq1;
