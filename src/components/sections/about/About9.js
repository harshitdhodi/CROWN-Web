import About9Client from "./About9Client";

async function getAboutData() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const res = await fetch(`${baseUrl}/api/data/about_us_`, {
			next: { revalidate: 0 },
		});
		const json = await res.json();
		return json?.data?.[0] ?? null;
	} catch (err) {
		console.error("Failed to fetch about data:", err);
		return null;
	}
}

const About9 = async () => {
	const about = await getAboutData();
	return <About9Client about={about} />;
};

export default About9;
