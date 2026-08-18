import dynamic from "next/dynamic";
import { resolveCmsImage } from "@/lib/seoConfig";

const ClientPortfolios4 = dynamic(
	() => import("./ClientPortfolios4")
);

/**
 * Machinery & Equipment section – async server component with ISR.
 * Fetches data at build / revalidation time; does NOT call the API on every
 * page visit or navigation. Passes data to the client-side Swiper wrapper.
 */
import { getCmsBase } from "@/lib/seoConfig";

const DEFAULT_EQUIPMENT = [
	{ id: "dummy-g1", title: "Hygienic & GMP-Compliant Environment", img4: "/uploads/1784277083439-u1syl8pv1.png" },
	{ id: "dummy-g2", title: "Reliable High-Volume Manufacturing", img4: "/uploads/1784277119152-2iwkbrut81w.png" },
	{ id: "dummy-g3", title: "Experienced & Dedicated Professionals", img4: "/uploads/1784277131046-i47c757ikea.png" },
	{ id: "dummy-g4", title: "Advanced Manufacturing Technology", img4: "/uploads/1784277147782-ysxf4cokkx.png" }
];

async function fetchGalleryItems() {
	const cmsBase = getCmsBase();
	const baseUrls = [
		cmsBase,
		"http://localhost:3014",
		"http://127.0.0.1:3014",
		"https://demoadmin.crownpack.in"
	];

	for (const base of baseUrls) {
		if (!base) continue;
		for (const col of ["gallery", "manufacturing_strength"]) {
			try {
				const res = await fetch(`${base}/api/data/${col}`, { next: { revalidate: 0 } });
				if (!res.ok) continue;
				const json = await res.json().catch(() => null);
				if (json?.success && Array.isArray(json?.data) && json.data.length > 0) {
					return json.data.map((item) => ({
						id: item.id || item._id,
						title: item.title || item.name || "Machinery & Equipment",
						img4: resolveCmsImage(item.image || item.icon_image) || "/uploads/1784277083439-u1syl8pv1.png",
					}));
				}
			} catch (e) {
				// ignore and try next
			}
		}
	}
	return DEFAULT_EQUIPMENT;
}

async function fetchGalleryHeading() {
	const cmsBase = getCmsBase();
	const baseUrls = [
		cmsBase,
		"http://localhost:3014",
		"http://127.0.0.1:3014",
		"https://demoadmin.crownpack.in"
	];

	for (const base of baseUrls) {
		if (!base) continue;
		try {
			const res = await fetch(`${base}/api/heading?section=gallery`, { next: { revalidate: 0 } });
			if (!res.ok) continue;
			const json = await res.json().catch(() => null);
			if (json?.success && json?.data) return json.data;
		} catch (e) {}
	}
	return null;
}

const Portfolios4 = async () => {
	const [equipmentItems, sectionHeading] = await Promise.all([
		fetchGalleryItems(),
		fetchGalleryHeading(),
	]);

	// Duplicate items for continuous carousel effect
	const portfolio = [...equipmentItems, ...equipmentItems];

	return (
		<section className="tj-project-section-4 section-gap">
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading w-full style-4 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s" style={{ color: "var(--tj-color-text-body-4)" }}>
								<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
								{sectionHeading?.tagline || "Proud Projects"}
							</span>
							<h2 className="sec-title title-anim" style={{ color: "var(--tj-color-text-body-4)" }}>
								{sectionHeading?.heading ||
									"Breaking Boundaries, Building Dreams."}
							</h2>
							{/* {sectionHeading?.subheading && (
								<p className="desc wow fadeInUp" data-wow-delay=".4s" style={{ color: "var(--tj-color-text-body-4)", marginTop: "10px" }}>
									{sectionHeading.subheading}
								</p>
							)} */}
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="project-wrapper wow fadeInUp" data-wow-delay=".5s">
							<ClientPortfolios4 portfolio={portfolio} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Portfolios4;
