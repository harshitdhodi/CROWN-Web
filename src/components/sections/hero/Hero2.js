import Hero2Client from "./Hero2Client";

const DEFAULT_HERO_SLIDES = [
	{
		id: "dummy-1",
		heading: "Innovating Packaging Solutions",
		subheading: "High-quality plastic packaging solutions for pharmaceutical, nutraceutical, and healthcare industries.",
		image: "/images/hero/slider-1.webp",
		btn_text: "Explore Products",
		btn_link: "/products"
	},
	{
		id: "dummy-2",
		heading: "Precision & Quality Excellence",
		subheading: "State-of-the-art clean room facilities and automated manufacturing technology.",
		image: "/images/hero/slider-2.webp",
		btn_text: "About Us",
		btn_link: "/about-us"
	}
];

const Hero2 = async () => {
	let heroSlides = [];
	try {
		// Server-side fetch goes directly to CMS
		const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";
		const res = await fetch(`${cmsBase}/api/data/hero_section`, {
			next: { revalidate: 0 }, // ISR: revalidate every 60 seconds
		});
		if (res.ok) {
			const json = await res.json();
			heroSlides = json.data ?? [];
		}
	} catch (err) {
		console.error("[Hero2] Failed to fetch hero section data:", err?.message);
	}

	if (!heroSlides || heroSlides.length === 0) {
		heroSlides = DEFAULT_HERO_SLIDES;
	}

	return <Hero2Client heroSlides={heroSlides} />;
};

export default Hero2;
