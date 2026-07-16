import Contact2Client from "./Contact2Client";

const CMS_BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";

async function getContactData() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const [headingRes, locRes] = await Promise.all([
			// Use CMS_BASE_URL directly to avoid the proxy masking a 404 as a 500
			fetch(`${CMS_BASE_URL}/api/heading?section=global-presence`, { next: { revalidate: 60 } }),
			fetch(`${baseUrl}/api/global-presence`, { next: { revalidate: 60 } })
		]);
		
		const headingJson = headingRes.ok ? await headingRes.json() : null;
		const locJson = await locRes.json();

		return {
			headingData: headingJson?.success ? { tagline: headingJson.data.tagline || "", heading: headingJson.data.heading || "" } : { tagline: "", heading: "" },
			locations: locJson?.success && Array.isArray(locJson.data) ? locJson.data : [],
		};
	} catch (e) {
		console.error("Failed to fetch contact data", e);
		return { headingData: { tagline: "", heading: "" }, locations: [] };
	}
}

const Contact2 = async ({ isInnerPage = false, styleConfig }) => {
	const { headingData, locations } = await getContactData();
	return <Contact2Client isInnerPage={isInnerPage} styleConfig={styleConfig} initialHeadingData={headingData} initialLocations={locations} />;
};

export default Contact2;
