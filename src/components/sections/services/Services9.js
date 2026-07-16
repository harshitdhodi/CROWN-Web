"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard10 from "@/components/shared/cards/ServiceCard10";
import { useGSAP, ScrollTrigger } from "@/libs/gsap.config";

const Services9 = ({ heading, services }) => {
  const tagline = heading?.tagline || "CHOOSE THE BEST";
  const title = heading?.heading || "Scalable business services";

  useGSAP(() => {
    const doRefresh = () => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
      }
    };

    // Wait for every image inside this section to load before refreshing
    // ScrollTrigger so the sticky-panel heights are based on real dimensions.
    const section = document.querySelector(".h9-service");

    const scheduleRefresh = () => {
      if (!section) {
        setTimeout(doRefresh, 200);
        return;
      }
      const imgs = Array.from(section.querySelectorAll("img"));
      if (imgs.length === 0) {
        setTimeout(doRefresh, 200);
        return;
      }
      let loaded = 0;
      let fallbackTimer = setTimeout(() => {
        doRefresh();
      }, 1500);

      const onLoad = () => {
        loaded++;
        if (loaded === imgs.length) {
          clearTimeout(fallbackTimer);
          setTimeout(doRefresh, 150);
        }
      };
      imgs.forEach((img) => {
        if (img.complete) {
          onLoad();
        } else {
          img.addEventListener("load", onLoad, { once: true });
          img.addEventListener("error", onLoad, { once: true });
        }
      });
    };

    scheduleRefresh();

    // Also refresh when Portfolios5 (above) finishes re-initialising its
    // scroll slider — that changes the page layout and shifts our offsets.
    window.addEventListener("reinit-scroll-slider", doRefresh);
    return () => window.removeEventListener("reinit-scroll-slider", doRefresh);
  }, [services]);

  return (
    <section className="h9-service section-gap section-gap-x text-gray-400 tj-sticky-panel-container-2 tj-progress-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-4">
            <div className="sec-heading style-8 tj-sticky-panel-2">
              <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                <i className="tji-box"></i>{tagline}
              </span>
              <h2 className="sec-title title-anim">{title}</h2>
              <div className="h9-service-more wow fadeInUp" data-wow-delay=".3s">
                <ButtonPrimary text="More services" url="/services" />
              </div>
            </div>
          </div>

          <div className="col-12 col-lg-8">
            <div className="h9-service-scroll-progress tj-scroll-progress tj-sticky-panel-2">
              {Array.from({ length: services?.length || 4 }).map((_, idx) => (
                <div
                  key={idx}
                  className={`tj-scroll-progress-item${idx === 0 ? " active" : ""}`}
                >
                  <span className="tj-scroll-progress-sln">
                    {String(idx + 1).padStart(2, "0")}.
                  </span>
                  <div className="tj-scroll-progress-ind">
                    <div className="tj-scroll-progress-ind-inner"></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="service-wrapper h9-service-wrapper">
              {services?.length > 0 ? (
                services.map((service, idx) => (
                  <ServiceCard10 key={service.id || idx} service={service} idx={idx} />
                ))
              ) : (
                <div className="text-center py-5">No services available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-shape-1">
        <img src="/images/shape/pattern-2.svg" alt="" width={370} height={590} aria-hidden="true" />
      </div>
      <div className="bg-shape-2">
        <img src="/images/shape/pattern-3.svg" alt="" width={370} height={590} aria-hidden="true" />
      </div>
      <div className="bg-shape-3">
        <img src="/images/shape/h7-testimonial-shape-blur.svg" alt="" width={820} height={808} aria-hidden="true" />
      </div>
    </section>
  );
};

export default Services9;
