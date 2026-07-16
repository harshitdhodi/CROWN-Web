"use client";
import { useEffect } from "react";


// ── Batch 1: inject immediately — small, needed for visible icons ────────────
const BATCH_1 = [
	"/css/bexon-icons.css",   //  4 KB  (post-load: tji-* icon font)
	"/css/fa-icons-slim.css", //  2 KB  (slim: only 8 icons used)
];

export default function DeferredStyles() {
	useEffect(() => {
		// Batch 1 — inject right away (6 KB total, zero render-blocking)
		BATCH_1.forEach(injectStylesheet);

		// Batch 2 — inject when main thread is idle and conditionally based on DOM elements
		const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 300));
		ric(() => {
			// Meanmenu is always used on pages with navigation
			injectStylesheet("/css/meanmenu.css");
			injectStylesheet("/css/odometer-theme-default.css");

			// Conditionally load other libraries only if their components/elements are active on the page
			if (document.querySelector(".wow")) {
				injectStylesheet("/css/animate.min.css");
			}
			if (document.querySelector(".nice-select")) {
				injectStylesheet("/css/nice-select2.css");
			}
		});
	}, []);

	return null;
}

function injectStylesheet(href) {
	// Avoid duplicating on HMR re-renders or multiple mounts
	if (document.querySelector(`link[data-deferred="${href}"]`)) return;
	const link = document.createElement("link");
	link.rel = "stylesheet";
	link.href = href;
	link.setAttribute("data-deferred", href);
	link.setAttribute("fetchpriority", "low");
	document.head.appendChild(link);
}
