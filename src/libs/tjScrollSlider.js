import { gsap, ScrollTrigger } from "@/libs/gsap.config";
import rtlValue from "./rtlValue";

const tjScrollSlider = () => {
  if (typeof window === "undefined") return;

  const mediaMatch = gsap.matchMedia();
  mediaMatch.add("(min-width: 992px)", () => {
    const sliders = gsap.utils.toArray(".tj-scroll-slider");
    if (!sliders?.length) return;

    sliders.forEach((slider) => {
      // Find and kill existing triggers on this slider before initializing
      const existingTriggers = ScrollTrigger.getAll().filter(
        (st) => st.trigger === slider || (st.trigger && slider.contains(st.trigger))
      );
      existingTriggers.forEach((st) => st.kill(true));

      const panels = gsap.utils.toArray(".tj-scroll-slider-item", slider);
      if (!panels.length || panels.length <= 1) return;

      // Clear any leftover transforms
      gsap.set(panels, { clearProps: "transform,x,xPercent" });

      // Proportional scroll distance (~320px per item) prevents huge empty white space gaps
      const scrollDistance = Math.min(Math.max(panels.length * 320, 600), 1800);

      gsap.to(panels, {
        xPercent: rtlValue(-100) * (panels.length - 1),
        force3D: true,
        ease: "none",
        scrollTrigger: {
          trigger: slider,
          start: "top+=50 top",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          scrub: 1,
          markers: false,
          end: () => "+=" + scrollDistance,
          invalidateOnRefresh: true,
        },
      });
    });
  });
};

export default tjScrollSlider;
