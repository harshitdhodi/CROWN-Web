"use client";
import { useGSAP, ScrollTrigger } from "@/libs/gsap.config";
import initSmoothScroller from "@/libs/initSmoothScroller";
import titleAnim from "@/libs/titleAnim";
import titleAnim2 from "@/libs/titleAnim2";
import titleAnim3 from "@/libs/titleAnim3";
import textReavealAnim from "@/libs/textReavealAnim";
import smoothScrollToTop from "@/libs/smoothScrollToTop";
import { useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION TIERS — main thread strategy
// ─────────────────────────────────────────────────────────────────────────────
//
// TIER 1 — static imports, run synchronously inside useGSAP:
//   initSmoothScroller, title/text anims — needed immediately for above-fold
//   content. These are small libs and run only once.
//
// TIER 2 — dynamic imports, scheduled via requestIdleCallback:
//   All scroll-driven, below-fold, or interaction animations. The browser
//   loads and evaluates these JS chunks only when the main thread is free,
//   so they never compete with hydration or LCP.
//
// smoothScrollToTop is registered in a plain useEffect (not useGSAP) because
//   it only attaches click listeners and doesn't need GSAP context.
//
// tjMagicCursorAnimation is likewise in useEffect — it uses RAF throttling
//   internally so its mousemove handler is compositor-safe.
// ─────────────────────────────────────────────────────────────────────────────

const ClientWrapper = () => {

	// ── plain useEffect: lightweight non-GSAP setup ──────────────────────────
	useEffect(() => {
		// WOW.js — loaded dynamically only if .wow elements exist on the page
		if (document.querySelector(".wow")) {
			import("wow.js").then(({ default: WOW }) => {
				new WOW().init();
			});
		}

		// Smooth hash-link scrolling — pure event listener, no layout cost
		smoothScrollToTop();

		// Magic cursor — uses RAF throttling internally
		import("@/libs/tjMagicCursorAnimation").then(({ default: tjMagicCursorAnimation }) => {
			const cleanup = tjMagicCursorAnimation();
			return () => { if (cleanup) cleanup(); };
		});

		// Listen to lazy-loaded section event to re-trigger animations
		const handleLazyLoad = () => {
			titleAnim();
			titleAnim2();
			titleAnim3();
			textReavealAnim();
			ScrollTrigger.refresh();
		};
		window.addEventListener("lazy-section-loaded", handleLazyLoad);
		return () => {
			window.removeEventListener("lazy-section-loaded", handleLazyLoad);
		};
	}, []);

	// ── useGSAP: TIER 1 & TIER 2 animations ───────────────────────────────────
	useGSAP(() => {
		// Smooth scroller must be set up before any ScrollTrigger animations
		initSmoothScroller();

		// Title / text animations — above-fold content needs these immediately
		titleAnim();
		titleAnim2();
		titleAnim3();
		textReavealAnim();

		// ── TIER 2 — schedule via requestIdleCallback ─────────────────────────
		// All below-fold and interaction-triggered animations. We check for
		// target elements and import them sequentially to avoid blocking the main thread.
		const dynamicAnimations = [
			{ selector: ".tj-arrange-container", loader: () => import("@/libs/arrangeAnim") },
			{ selector: ".tj-arrange-container-2", loader: () => import("@/libs/arrangeAnim2") },
			{ selector: ".tj-fadein-right-on-scroll", loader: () => import("@/libs/fadeInRightOnScrollAnim") },
			{ selector: ".title-highlight", loader: () => import("@/libs/animateInvertText") },
			{ selector: ".tj-scroll-btn", loader: () => import("@/libs/onePageNavAnim") },
			{ selector: ".tj-progress", loader: () => import("@/libs/progressBar") },
			{ selector: ".service-stack", loader: () => import("@/libs/tjStackAnimation") },
			{ selector: ".tj-scroll-slider", loader: () => import("@/libs/tjScrollSlider") },
			{ selector: ".tj-sticky-panel", loader: () => import("@/libs/tjStackAnimation2") },
			{ selector: ".img-parallax", loader: () => import("@/libs/tjImageParallex") },
			{ selector: ".tj-sticky-panel-2, .tj-progress-item, .tj-scroll-progress-item", loader: () => import("@/libs/tjProgressAnimation") },
			{ selector: ".zoom-on-scroll", loader: () => import("@/libs/tjZoomInScroll") },
			{ selector: ".tj-sticky-panel-3", loader: () => import("@/libs/tjStackAnimation3") },
			{ selector: ".fade-up-anim", loader: () => import("@/libs/fadeUpAnim") },
			{ selector: ".slidebar-stickiy-container", loader: () => import("@/libs/sidebarSticky") },
		];

		const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

		const loadNextAnimation = async (index) => {
			if (index >= dynamicAnimations.length) {
				// Refresh ScrollTrigger once everything is registered
				ScrollTrigger.refresh();
				return;
			}

			const anim = dynamicAnimations[index];
			if (document.querySelector(anim.selector)) {
				try {
					const module = await anim.loader();
					if (module && typeof module.default === "function") {
						module.default();
					}
				} catch (err) {
					console.error(`Failed to load animation for selector "${anim.selector}":`, err);
				}
				ric(() => loadNextAnimation(index + 1));
			} else {
				// Skip immediately if the elements are not on the page
				loadNextAnimation(index + 1);
			}
		};

		ric(() => loadNextAnimation(0));
	});

	return null;
};

export default ClientWrapper;
