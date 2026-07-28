"use client";
import PortfolioCard5 from "@/components/shared/cards/PortfolioCard5";
import { useGSAP, ScrollTrigger } from "@/libs/gsap.config";
import tjScrollSlider from "@/libs/tjScrollSlider";

const ClientPortfolios5 = ({ portfolio }) => {
  useGSAP(() => {
    if (typeof window === "undefined") return;

    const reinit = () => {
      // Kill any existing ScrollTrigger instances that are pinning the
      // .tj-scroll-slider inside .h5-project and revert inline pin styles.
      const slider = document.querySelector(".h5-project .tj-scroll-slider");
      if (slider) {
        ScrollTrigger.getAll().forEach((st) => {
          if (st.trigger === slider || (st.trigger && slider.contains(st.trigger))) {
            st.kill(true);
          }
        });
      }

      // Re-create the scroll slider now that images are loaded and the DOM
      // has correct dimensions.
      tjScrollSlider();

      // Refresh all remaining triggers so sibling sections recalculate positions.
      ScrollTrigger.refresh();

      // Notify Services9 and any other siblings.
      window.dispatchEvent(new CustomEvent("reinit-scroll-slider"));
    };

    const section = document.querySelector(".h5-project");
    const imgs = section ? Array.from(section.querySelectorAll("img")) : [];

    if (imgs.length === 0) {
      // No images in DOM yet — wait one frame then reinit.
      const raf = requestAnimationFrame(reinit);
      return () => cancelAnimationFrame(raf);
    }

    let loaded = 0;
    let fallbackTimer = setTimeout(() => {
      reinit();
    }, 1000);

    const onLoad = () => {
      loaded++;
      if (loaded === imgs.length) {
        clearTimeout(fallbackTimer);
        setTimeout(reinit, 100);
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

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, [portfolio]);

  return (
    <>
      {portfolio.map((portfolioSingle, idx) => (
        <PortfolioCard5 key={portfolioSingle.id ?? idx} portfolio={portfolioSingle} />
      ))}
    </>
  );
};

export default ClientPortfolios5;
