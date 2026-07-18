process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
	enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	turbopack: {
		resolveAlias: {
			"@/components": "./src/components",
			"@/lib": "./src/lib",
			"@/hooks": "./src/hooks",
			"@/libs": "./src/libs",
			"@/assets": "./src/assets"
		}
	},

	// Hide X-Powered-By header
	poweredByHeader: false,

	// Disable production source maps
	productionBrowserSourceMaps: false,

	// Enable gzip/brotli compression
	compress: true,

	experimental: {
		optimizeCss: true,
		cpus: 1,
		workerThreads: false,

		// Optimize imports from common libraries
		optimizePackageImports: [
			"lodash-es",
			"date-fns",
			"lucide-react",
			"react-icons",
			"@mui/icons-material",
		],
	},

	// ------------------------------------------------------------------
	// Cache Headers
	// ------------------------------------------------------------------
	async headers() {
		return [
			{
				source: "/fonts/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/css/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/images/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/video/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
			{
				source: "/assets/:path*",
				headers: [
					{
						key: "Cache-Control",
						value: "public, max-age=31536000, immutable",
					},
				],
			},
		];
	},

	// ------------------------------------------------------------------
	// API Rewrites
	// ------------------------------------------------------------------
	async rewrites() {
		const cmsBase =
			process.env.CMS_BASE_URL ||
			process.env.NEXT_PUBLIC_API_URL ||
			"https://demo.crownpack.in";

		return [
			{
				source: "/api/:path*",
				destination: `${cmsBase}/api/:path*`,
			},
			{
				source: "/uploads/:path*",
				destination: `${cmsBase}/uploads/:path*`,
			},
		];
	},

	// ------------------------------------------------------------------
	// Image Optimization
	// ------------------------------------------------------------------
	images: {
		// Keep true only if you're intentionally bypassing Next Image Optimization
		unoptimized: false,

		formats: ["image/avif", "image/webp"],

		deviceSizes: [390, 576, 768, 992, 1200, 1440, 1920],

		imageSizes: [64, 80, 160, 238, 400],

		minimumCacheTTL: 86400,

		remotePatterns: [
			{
				protocol: "https",
				hostname: "demoadmin.crownpack.in",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "demo.crownpack.in",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "images.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "plus.unsplash.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "bexon.themejunction.net",
				pathname: "/**",
			},
			{
				protocol: "http",
				hostname: "localhost",
				pathname: "/**",
			},
		],
	},

	// ------------------------------------------------------------------
	// Webpack
	// ------------------------------------------------------------------
	webpack: (config, { dev, isServer }) => {
		if (!dev && !isServer) {
			const { PurgeCSSPlugin } = require("purgecss-webpack-plugin");
			const glob = require("glob");

			config.plugins.push(
				new PurgeCSSPlugin({
					paths: glob.sync(
						`${path.join(__dirname, "src").replace(/\\/g, "/")}/**/*`,
						{
							nodir: true,
						}
					),

					safelist: {
						standard: [
							"html",
							"body",

							// Swiper
							/^swiper/,

							// Bootstrap utility classes used dynamically
							/^btn/,
							/^col-/,
							/^row/,
							/^container/,
							/^d-/,
							/^text-/,
							/^mt-/,
							/^mb-/,
							/^pt-/,
							/^pb-/,
							/^p-/,
							/^m-/,
							/^gap-/,
							/^g-/,
							/^offset-/,
							/^justify-/,
							/^align-/,
							/^flex/,

							// Icon fonts
							/^fa-/,
							/^tji-/,

							// WOW.js / animate.css
							/^wow/,
							/^animate__/,
							/^animated/,
							/^fadeIn/,
							/^slideIn/,
							/^zoomIn/,
							/^bounceIn/,

							// Bootstrap JS-driven state classes
							/^active/,
							/^show/,
							/^fade/,
							/^collapse/,
							/^collapsing/,
							/^modal/,
							/^dropdown/,
							/^nav/,
							/^navbar/,
							/^offcanvas/,
							/^sticky/,

							// TJ custom components
							/^tj-/,
							/^h[0-9]+-/,
							/^section-/,
							/^service-/,
							/^project-/,
							/^portfolio-/,
							/^blog-/,
							/^contact-/,
							/^testimonial-/,
							/^team-/,
							/^career-/,
							/^hero-/,
							/^mega-menu/,
							/^sec-heading/,
							/^sub-title/,
							/^sec-title/,
							/^btn-area/,
							/^bg-shape/,
							/^page-header/,
							/^form-input/,
							/^nice-select/,
							/^preloader/,
							/^backtotop/,
							/^cursor/,
							/^odometer/,
							/^glightbox/,
							/^meanmenu/,
							/^style-/,
						],

						deep: [
							/^swiper/,
							/^fa-/,
							/^modal/,
							/^tji-/,
							/^tj-/,
							/^wow/,
							/^animate/,
							/^h[0-9]+-/,
						],

						greedy: [
							/^swiper/,
						],
					},
				})
			);
		}

		return config;
	},
};

module.exports = process.env.ANALYZE === "true" ? withBundleAnalyzer(nextConfig) : nextConfig;