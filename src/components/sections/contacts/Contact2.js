import Contact2Client from "./Contact2Client";

const CMS_BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";

const DEFAULT_LOCATIONS = [
	{
		id: "dummy-loc1",
		label: "Corporate Headquarters & Factory Unit 1",
		address: "Plot No. 124, GIDC Industrial Estate, Vapi, Gujarat 396195, India",
		phone: "+91 98251 00000",
		email: "info@crownpack.in",
		position: { top: "45%", left: "68%" }
	},
	{
		id: "dummy-loc2",
		label: "Manufacturing Unit 2",
		address: "Survey No. 45, Daman Industrial Area, Daman 396210, India",
		phone: "+91 98251 11111",
		email: "sales@crownpack.in",
		position: { top: "48%", left: "70%" }
	},
	{
		id: "dummy-loc3",
		label: "International Export Division",
		address: "B-402, Trade Centre, BKC, Mumbai, Maharashtra 400051, India",
		phone: "+91 22 6600 0000",
		email: "export@crownpack.in",
		position: { top: "52%", left: "67%" }
	}
];

async function getContactData() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	try {
		const [headingRes, locRes] = await Promise.all([
			fetch(`${CMS_BASE_URL}/api/heading?section=global-presence`, { cache: 'no-store' }),
			fetch(`${baseUrl}/api/global-presence`, { cache: 'no-store' })
		]);
		
		const headingJson = headingRes.ok ? await headingRes.json() : null;
		const locJson = locRes.ok ? await locRes.json() : null;

		const locations = (locJson?.success && Array.isArray(locJson.data) && locJson.data.length > 0)
			? locJson.data
			: DEFAULT_LOCATIONS;

		return {
			headingData: headingJson?.success ? { tagline: headingJson.data.tagline || "GLOBAL PRESENCE", heading: headingJson.data.heading || "Worldwide Reach & Distribution", image: headingJson.data.image || "" } : { tagline: "GLOBAL PRESENCE", heading: "Worldwide Reach & Distribution", image: "" },
			locations,
		};
	} catch (e) {
		console.error("Failed to fetch contact data", e);
		return { headingData: { tagline: "GLOBAL PRESENCE", heading: "Worldwide Reach & Distribution" }, locations: DEFAULT_LOCATIONS };
	}
}

const Contact2 = async ({ isInnerPage = false, styleConfig }) => {
	const { headingData, locations } = await getContactData();
	return <Contact2Client isInnerPage={isInnerPage} styleConfig={styleConfig} initialHeadingData={headingData} initialLocations={locations} />;
};

export default Contact2;
