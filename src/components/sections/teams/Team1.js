import Team1Client from "./Team1Client";
import getTeamMembers from "@/libs/getTeamMembers";

import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

async function getTeamData(type) {
	const CMS_BASE_URL = getCmsBase();
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	const section = type === 3 ? "certificates" : "our-team";
	const dataEndpoint = type === 3 ? "certificates" : "our_team";

	let heading = null;
	let items = [];

	try {
		const [headingRes, dataRes] = await Promise.all([
			// Use CMS_BASE_URL directly — same pattern as Services9Wrapper/Portfolios5
			// so the proxy's error-masking doesn't hide a missing section_name document.
			fetch(`${CMS_BASE_URL}/api/heading?section=${section}`, { next: { revalidate: 60 } }),
			fetch(`${baseUrl}/api/data/${dataEndpoint}`, { next: { revalidate: 60 } }),
		]);

		const headingResult = headingRes.ok ? await headingRes.json() : null;
		const dataResult = await dataRes.json();

		if (headingResult?.success) heading = headingResult.data || {};

		if (type === 3) {
			if (dataResult?.success) items = dataResult.data;
		} else {
			items = dataResult?.success && dataResult.data?.length ? dataResult.data : getTeamMembers();
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		if (type !== 3) items = getTeamMembers();
	}

	const formattedItems = (items || []).map((item) => {
		const resolvedImg = resolveCmsImage(item.image);
		const finalImg = resolvedImg || item.img || "";
		return {
			...item,
			name: item.heading || item.name || (type === 3 ? "Certificate" : ""),
			desig: item.description || item.designation || item.desig || "",
			img: finalImg,
			imgLarge: resolvedImg || item.imgLarge || finalImg,
		};
	});

	return { heading, formattedItems };
}

const Team1 = async ({ type }) => {
	const { heading, formattedItems } = await getTeamData(type);
	return <Team1Client type={type} initialItems={formattedItems} heading={heading} />;
};

export default Team1;

