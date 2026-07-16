"use client";
import BlogSidebarWithInquiry from "@/components/sections/portfolios/BlogSidebarWithInquiry";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

const BlogDetailsPrimary = ({ option, recentBlogs }) => {
  const { currentItem, isPrevItem, isNextItem, prevId, nextId } = option || {};
  const { title, img, details, author, date } = currentItem || {};

  const blogContent = details
    ? details
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, "&")
    : "";

  useEffect(() => {
    if (typeof window === "undefined" || !blogContent) return;

    // Force animation libraries to recalculate layout after content injection
    const refreshAnimations = () => {
      window.dispatchEvent(new Event("resize"));
      
      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }

      // Re-initialize WOW.js if it's used for entrance animations (wow fadeInUp)
      if (window.WOW) {
        new window.WOW().init();
      }
    };

    // Execute refresh at intervals to catch layout shifts as images load
    const timers = [
      setTimeout(refreshAnimations, 200),
      setTimeout(refreshAnimations, 1000),
      setTimeout(refreshAnimations, 2500),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [blogContent]);

  return (
    <section className="tj-blog-section section-gap slidebar-stickiy-container">
      <div className="container">
        <div className="row row-gap-5">
          <div className="col-lg-8">
            <div className="post-details-wrapper">
              {img && (
                <div
                  className="blog-images wow fadeInUp"
                  data-wow-delay=".1s"
                  suppressHydrationWarning
                >
                  <Image
                    src={img}
                    alt={title || "Blog Image"}
                    width={870}
                    height={450}
                    style={{ height: "auto" }}
                  />
                </div>
              )}

              <h2
                className=""
                suppressHydrationWarning
              >
                {title}
              </h2>

              <div
                className="blog-category-two wow fadeInUp"
                data-wow-delay=".3s"
                suppressHydrationWarning
              >
                <div className="category-item">
                  <div className="cate-icons">
                    <i className="tji-user"></i>
                  </div>
                  <div className="cate-text">
                    <span className="degination">Authored by</span>
                    <h6 className="title">{author}</h6>
                  </div>
                </div>
                <div className="category-item">
                  <div className="cate-icons">
                    <i className="tji-calendar"></i>
                  </div>
                  <div className="cate-text">
                    <span className="degination">Date Released</span>
                    <h6 className="text">{date}</h6>
                  </div>
                </div>
              </div>

              <div
                className="blog-text"
                data-gramm="false"
                dangerouslySetInnerHTML={{ __html: blogContent }}
              />

             
            </div>
          </div>
          <div className="col-lg-4">
            <BlogSidebarWithInquiry recentBlogs={recentBlogs} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsPrimary;