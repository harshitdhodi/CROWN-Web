import Hero2Client from "./Hero2Client";

const Hero2 = async () => {
	let heroSlides = [];
	try {
		// Server-side fetch goes directly to CMS
		const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";
		const res = await fetch(`${cmsBase}/api/data/hero_section`, {
			next: { revalidate: 0 }, // ISR: revalidate every 60 seconds
		});
		if (!res.ok) throw new Error(`CMS returned ${res.status}`);
		const json = await res.json();
		console.log("banner",json.data)
		heroSlides = json.data ?? [];
	} catch (err) {
		console.error("[Hero2] Failed to fetch hero section data:", err?.message);
	}

	return <Hero2Client heroSlides={heroSlides} />;
};

export default Hero2;
