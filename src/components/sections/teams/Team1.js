import Team1Client from "./Team1Client";
import getTeamMembers from "@/libs/getTeamMembers";

import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

const DEFAULT_CERTIFICATES = [
	{ id: "dummy-c1", heading: "ISO 9001:2015 Certification", name: "ISO 9001:2015 Certification", description: "Quality Management System", desig: "Quality Management System", img: "/uploads/1784178192017-rtlryoojrhb.png", image: "/uploads/1784178192017-rtlryoojrhb.png" },
	{ id: "dummy-c2", heading: "Cleanroom Facility Standard", name: "Cleanroom Facility Standard", description: "ISO Class 8 Cleanroom", desig: "ISO Class 8 Cleanroom", img: "/uploads/1784178241405-jd7bmrsjqoj.png", image: "/uploads/1784178241405-jd7bmrsjqoj.png" },
	{ id: "dummy-c3", heading: "US FDA DMF Registered", name: "US FDA DMF Registered", description: "Drug Master File Compliance", desig: "Drug Master File Compliance", img: "/uploads/1784178360081-lb5aqdgdsm.png", image: "/uploads/1784178360081-lb5aqdgdsm.png" },
	{ id: "dummy-c4", heading: "GMP Certified Packaging", name: "GMP Certified Packaging", description: "Good Manufacturing Practice", desig: "Good Manufacturing Practice", img: "/uploads/1784178437774-ue8d842b8j.png", image: "/uploads/1784178437774-ue8d842b8j.png" }
];

async function getTeamData(type) {
	const CMS_BASE_URL = getCmsBase();
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	const section = type === 3 ? "certificates" : "our-team";
	const dataEndpoint = type === 3 ? "certificates" : "our_team";

	let heading = null;
	let items = [];

	try {
		const [headingRes, dataRes] = await Promise.all([
			fetch(`${CMS_BASE_URL}/api/heading?section=${section}`, { next: { revalidate: 0 } }),
			fetch(`${CMS_BASE_URL}/api/data/${dataEndpoint}`, { next: { revalidate: 0 } }),
		]);

		const headingResult = headingRes.ok ? await headingRes.json() : null;
		const dataResult = dataRes.ok ? await dataRes.json() : null;

		if (headingResult?.success) heading = headingResult.data || {};

		if (type === 3) {
			items = dataResult?.success && dataResult.data?.length ? dataResult.data : DEFAULT_CERTIFICATES;
		} else {
			items = dataResult?.success && dataResult.data?.length ? dataResult.data : getTeamMembers();
		}
	} catch (error) {
		console.error("Error fetching data:", error);
		items = type === 3 ? DEFAULT_CERTIFICATES : getTeamMembers();
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

