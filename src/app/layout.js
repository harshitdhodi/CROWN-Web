process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { Mona_Sans } from "next/font/google";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "./assets/css/bootstrap.min.css";
import "./globals.scss";
import "./tailwind.css";
import DeferredStyles from "@/components/shared/wrappers/DeferredStyles";
import ThemeColorLoader from "@/components/shared/theme/ThemeColorLoader";
import ActivityTracker from "@/components/analytics/ActivityTracker";
import { getCmsBase } from "@/lib/seoConfig";
import { LogoProvider } from "@/components/shared/providers/LogoProvider";




// ─────────────────────────────────────────────────────────────────────────────
// CSS LOADING STRATEGY
// ─────────────────────────────────────────────────────────────────────────────
// CRITICAL — block paint only for genuinely above-fold CSS:
//   • bootstrap.min.css — grid system (.container/.row/.col-* above-fold)
//   • globals.scss      — header, hero, footer layout + critical swiper stubs
//   • tailwind.css      — utility overrides
//

// DEFERRED via <DeferredStyles> — loaded after first paint:
//   • fa-icons-slim.css         —   2 KB, slim FA (8 icons: brands + file-pdf, file-shield, times)
//   • bexon-icons.css           —   4 KB, tji-* icon font (loaded first, highest priority)
//   • animate.min.css            —  54 KB, WOW.js scroll animations
//   • swiper-bundle.min.css      —  18 KB, full swiper CSS (hero uses stubs)
//   • glightbox.min.css          —  14 KB, click-triggered lightbox
//   • nice-select2.css           —   4 KB, custom dropdowns
//   • odometer-theme-default.css —   4 KB, counter animations
//   • meanmenu.css               —   3 KB, mobile menu (hidden until click)
//   • range-slider.css           —   2 KB, product filter (products page)
// ─────────────────────────────────────────────────────────────────────────────

const monaSans = Mona_Sans({
	variable: "--tj-ff-mona",
	subsets: ["latin"],
	weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	display: "swap",
});

export async function generateMetadata() {
	const cmsBase = getCmsBase();
	let faviconUrl = "/images/icons/spool.svg";

	try {
		// Use longer cache + timeout to prevent build hangs
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s max

		const resFooter = await fetch(`${cmsBase}/api/data/footer?fields=favicon`, {
			next: { revalidate: 3600 }, // Cache for 1 hour (much better than 0)
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (resFooter.ok) {
			const json = await resFooter.json();
			if (json.success && json.data?.[0]?.favicon?.[0]) {
				const rawUrl = json.data[0].favicon[0];
				faviconUrl = rawUrl.startsWith("http")
					? rawUrl
					: `${process.env.NEXT_PUBLIC_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
			}
		}
	} catch (err) {
		console.error("[generateMetadata] Failed to fetch favicon:", err?.message);
		// Continue with fallback - don't let this crash the build
	}

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 10000);

		const resSettings = await fetch(`${cmsBase}/api/seo/settings`, {
			next: { revalidate: 3600 }, // Important: don't use revalidate: 0 here
			signal: controller.signal,
		});

		clearTimeout(timeoutId);

		if (resSettings.ok) {
			const json = await resSettings.json();
			if (json?.success && json.data) {
				const settings = json.data;
				return {
					title: {
						default: settings.siteName || "CROWN Packaging",
						template: `%s | ${settings.siteName || "CROWN Packaging"}`,
					},
					description: settings.metaDescription || "CROWN Packaging - Premium cable and wire manufacturing solutions.",
					icons: {
						icon: faviconUrl,
						shortcut: faviconUrl,
						apple: faviconUrl,
					},
					...(settings.searchConsoleVerification && {
						verification: { google: settings.searchConsoleVerification },
					}),
				};
			}
		}
	} catch (err) {
		console.error("[Root generateMetadata] Error:", err?.message);
	}

	// Fallback
	return {
		title: "CROWN Packaging - Cable & Wire Manufacturing Solutions",
		description: "CROWN Packaging - Premium cable and wire manufacturing solutions.",
		icons: {
			icon: faviconUrl,
			shortcut: faviconUrl,
			apple: faviconUrl,
		},
	};
}

export default async function RootLayout({ children }) {
	let faviconUrl = "/images/icons/spool.svg";
	let googleAnalyticsId = "";
	let colorsCss = "";
	let footerData = null;

	try {
		const cmsBase = getCmsBase();

		// 1. Fetch favicon and logos from footer collection
		const resFooter = await fetch(`${cmsBase}/api/data/footer?fields=favicon,logo,headerlogo`, { next: { revalidate: 60 } });
		if (resFooter.ok) {
			const json = await resFooter.json();
			if (json.success && json.data?.length > 0) {
				footerData = json.data[0];
				if (footerData.favicon?.[0]) {
					const rawUrl = footerData.favicon[0];
					faviconUrl = rawUrl.startsWith("http") ? rawUrl : `${process.env.NEXT_PUBLIC_BASE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
				}
			}
		}

		// 2. Fetch SEO Settings for Google Analytics ID
		const resSettings = await fetch(`${cmsBase}/api/seo/settings`, { next: { revalidate: 60 } });
		if (resSettings.ok) {
			const json = await resSettings.json();
			if (json.success && json.data) {
				googleAnalyticsId = json.data.googleAnalyticsId || "";
			}
		}

		// 3. Fetch CMS color palette and build CSS variables server-side (eliminates FOUC)
		const resColors = await fetch(`${cmsBase}/api/colors`, { next: { revalidate: 60 } });
		if (resColors.ok) {
			const json = await resColors.json();
			const c = json?.data?.colors;
			if (c) {
				colorsCss = `
					--tj-color-common-white: ${c.common?.white ?? '#ffffff'};
					--tj-color-common-black: ${c.common?.black ?? '#000000'};
					--tj-color-heading-primary: ${c.heading?.primary ?? '#0c1e21'};
					--tj-color-text-body: ${c.text?.body ?? '#364e52'};
					--tj-color-text-body-2: ${c.text?.body2 ?? '#a9b8b8'};
					--tj-color-text-body-3: ${c.text?.body3 ?? '#67787a'};
					--tj-color-text-body-4: ${c.text?.body4 ?? '#18292c'};
					--tj-color-text-body-5: ${c.text?.body5 ?? '#ffffffcc'};
					--tj-color-theme-primary: ${c.theme?.primary ?? '#1e8a8a'};
					--tj-color-theme-bg: ${c.theme?.bg ?? '#d8e5e5'};
					--tj-color-theme-bg-2: ${c.theme?.bg2 ?? '#cee0e0'};
					--tj-color-theme-bg-3: ${c.theme?.bg3 ?? '#202e30'};
					--tj-color-theme-dark: ${c.theme?.dark ?? '#0c1e21'};
					--tj-color-theme-dark-2: ${c.theme?.dark2 ?? '#18292c'};
					--tj-color-theme-dark-3: ${c.theme?.dark3 ?? '#364e52'};
					--tj-color-theme-dark-4: ${c.theme?.dark4 ?? '#67787a'};
					--tj-color-theme-dark-5: ${c.theme?.dark5 ?? '#676e7a'};
					--tj-color-grey-1: ${c.grey?.['1'] ?? '#ecf0f0'};
					--tj-color-grey-2: ${c.grey?.['2'] ?? '#a9b8b8'};
					--tj-color-grey-3: ${c.grey?.['3'] ?? '#ffffff1a'};
					--tj-color-border-1: ${c.border?.['1'] ?? '#c9d1d1'};
					--tj-color-border-2: ${c.border?.['2'] ?? '#313d3d'};
					--tj-color-border-3: ${c.border?.['3'] ?? '#ffffff26'};
					--tj-color-border-4: ${c.border?.['4'] ?? '#ffffff33'};
					--tj-color-border-5: ${c.border?.['5'] ?? '#1e8a8a26'};
				`.trim();
			}
		}
	} catch (err) {
		console.error("[RootLayout] Failed to fetch favicon/settings/colors:", err?.message);
	}

	return (
		<html lang="en" data-scroll-behavior="smooth" dir="ltr">
			<head>
				{/* ── Preconnect: establish early connections to reduce TTFB for images ── */}
				<link rel="preconnect" href="http://localhost:3012" crossOrigin="anonymous" />
				<link rel="dns-prefetch" href="http://localhost:3012" />

				{/* ── Dynamic favicon — explicit link tag so it works on every page ── */}
				<link rel="icon" href={faviconUrl} />
				<link rel="shortcut icon" href={faviconUrl} />
				<link rel="apple-touch-icon" href={faviconUrl} />

				{/* ── Dynamic favicon, font variables & CMS color variables ── */}
				<style dangerouslySetInnerHTML={{
					__html: `
					:root {
						${colorsCss}
						--dynamic-favicon: url('${faviconUrl}');
					}
					.tji-box:before {
						background-image: url('${faviconUrl}');
					}
					body {
						--tj-ff-body: var(--tj-ff-mona) !important;
						--tj-ff-heading: var(--tj-ff-mona) !important;
						font-family: var(--tj-ff-mona) !important;
					}
				` }} />

				{/* ── Google Analytics Script ── */}
				{googleAnalyticsId && (
					<>
						<script async src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`} />
						<script
							dangerouslySetInnerHTML={{
								__html: `
									window.dataLayer = window.dataLayer || [];
									function gtag(){dataLayer.push(arguments);}
									gtag('js', new Date());
									gtag('config', '${googleAnalyticsId}', {
										page_path: window.location.pathname,
									});
								`
							}}
						/>
					</>
				)}
			</head>
			<body className={monaSans.variable}>
				{/* Load CMS-saved colors as CSS variable overrides — runs immediately on mount */}
				<ThemeColorLoader />
				<ActivityTracker />
				<LogoProvider footerData={footerData}>
					{children}
				</LogoProvider>
				{/* Defer fa-icons-slim (~2KB) — slim FA build, loaded after first paint */}
				<DeferredStyles />
			</body>
		</html>
	);
}
