import { gsap, ScrollSmoother } from "@/libs/gsap.config";

const initSmoothScroller = contanerRef => {
	// Skip initialization on mobile devices
	if (typeof window !== "undefined" && window.innerWidth < 1024) {
		return;
	}

	// Check if ScrollSmoother already exists to prevent recreation
	if (ScrollSmoother.get()) {
		return;
	}

	const animItems = gsap.utils.toArray("#smooth-wrapper");
	if (animItems.length) {
		gsap.config({
			nullTargetWarn: false,
		});

		// Check if any elements on the page use GSAP scroll speed/lag effects
		const hasEffects = typeof document !== "undefined" && document.querySelector("[data-speed], [data-lag]") !== null;

		ScrollSmoother.create({
			content: "#smooth-content",
			wrapper: "#smooth-wrapper",
			smooth: 1.5,
			effects: hasEffects,
			smoothTouch: 0.1,
			ignoreMobileResize: true,
		});
	}
};

export default initSmoothScroller;
