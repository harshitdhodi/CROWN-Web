"use client";

import { useState, useEffect, useRef } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

const BrandItem = ({ img }) => {
  const [src, setSrc] = useState(img);

  useEffect(() => {
    setSrc(img);
  }, [img]);

  return (
    <div className="brand-inner">
      <div className="brand-front">
        <div className="client-logo">
          <Image
            src={src}
            alt="Brand logo"
            fill
            sizes="254px"
            style={{ objectFit: "contain", padding: "20px" }}
            onError={() => {
              setSrc("/images/logos/logo.webp");
            }}
          />
        </div>
      </div>
      <div className="brand-back">
        <div className="client-logo">
          <Image
            src={src}
            alt="Brand logo"
            fill
            sizes="254px"
            style={{ objectFit: "contain", padding: "20px" }}
            onError={() => {
              setSrc("/images/logos/logo.webp");
            }}
          />
        </div>
      </div>
    </div>
  );
};

const BrandSlider3 = ({ logos, hoverImage }) => {
  const swiperRef = useRef(null);

  // Guard against null/undefined logos from CMS
  const safeLogos = Array.isArray(logos) && logos.length > 0 ? logos : [];
  // Need at least enough slides to fill the viewport for smooth looping
  // Duplicate until we have at least 8 items
  let duplicatedLogos = [...safeLogos, ...safeLogos];
  while (duplicatedLogos.length < 8 && duplicatedLogos.length > 0) {
    duplicatedLogos = [...duplicatedLogos, ...safeLogos];
  }

  // Swiper is initialised before the deferred swiper-bundle.min.css lands,
  // so slide widths are calculated without CSS → loop breaks / slides collapse.
  // We listen for the <link> element to load and call swiper.update() + loop reset.
  useEffect(() => {
    const swiper = swiperRef.current?.swiper;
    if (!swiper) return;

    const cssLink = document.querySelector('link[data-deferred="/css/swiper-bundle.min.css"]');
    if (!cssLink) return;

    const handleLoad = () => {
      // Give the browser one frame to apply the newly loaded CSS
      requestAnimationFrame(() => {
        swiper.update();
        swiper.loopDestroy?.();
        swiper.loopCreate?.();
        swiper.slideToLoop?.(0, 0);
      });
    };

    // If the stylesheet already loaded (e.g. navigated back to page)
    if (cssLink.sheet) {
      handleLoad();
    } else {
      cssLink.addEventListener("load", handleLoad, { once: true });
    }

    return () => cssLink.removeEventListener("load", handleLoad);
  }, []);

  if (duplicatedLogos.length === 0) return null;

  return (
    <Swiper
      ref={swiperRef}
      slidesPerView="auto"
      spaceBetween={30}
      freeMode={true}
      loop={true}
      speed={4000}
      allowTouchMove={false}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      className="client-slider client-slider-3"
      modules={[Autoplay]}
    >
      {duplicatedLogos.map(({ img }, idx) => (
        <SwiperSlide
          key={idx}
          className="client-item h5-client-item brand-flip-card"
          style={{ "--hover-bg": `url(${hoverImage})`, width: "auto" }}
        >
          {/* Explicit height so brand-inner's 100% resolves correctly for 3D flip */}
          <div style={{ width: "254px", height: "254px" }}>
            <BrandItem img={img} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BrandSlider3;