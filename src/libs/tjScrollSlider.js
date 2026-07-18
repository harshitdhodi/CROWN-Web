import { gsap, ScrollTrigger } from "@/libs/gsap.config";
import rtlValue from "./rtlValue";

const tjScrollSlider = () => {
  let mediaMatch = gsap.matchMedia();
  mediaMatch.add("(min-width: 1200px)", () => {
    const sliders = gsap.utils.toArray(".tj-scroll-slider");
    if (!sliders?.length) return;

    sliders.forEach((slider) => {
      // If this slider already has an active ScrollTrigger, skip it.
      // ClientPortfolios5 kills and re-creates its own trigger after images
      // load, so we must not create a duplicate here.
      const existing = ScrollTrigger.getAll().find(
        (st) => st.trigger === slider || slider.contains(st.trigger)
      );
      if (existing) return;

      const panels = gsap.utils.toArray(".tj-scroll-slider-item", slider);
      if (!panels.length) return;

      gsap.to(panels, {
        xPercent: rtlValue(-100) * (panels.length - 1),
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: slider,
          start: "top+=50 top",
          pin: true,
          scrub: 1,
          markers: false,
          end: () => "+=" + slider.offsetWidth,
        },
      });
    });
  });
};

export default tjScrollSlider;
