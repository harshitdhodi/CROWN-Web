import dynamic from "next/dynamic";

const ClientPortfolios4 = dynamic(
	() => import("./ClientPortfolios4")
);

/**
 * Machinery & Equipment section – async server component with ISR.
 * Fetches data at build / revalidation time; does NOT call the API on every
 * page visit or navigation. Passes data to the client-side Swiper wrapper.
 */
const Portfolios4 = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";

	let equipmentItems = [];
	let sectionHeading = null;

	try {
		const [equipmentRes, headingRes] = await Promise.all([
			fetch(`${baseUrl}/api/data/gallery`, {
				cache: "no-store",
			}),
			fetch(`${baseUrl}/api/heading?section=gallery`, {
				cache: "no-store",
			}),
		]);

		if (!equipmentRes.ok) {
			console.error("Machinery Equipment API failed:", equipmentRes.status);
		}
		if (!headingRes.ok) {
			console.error("Heading API failed:", headingRes.status);
		}

		const equipmentData = equipmentRes.ok
			? await equipmentRes.json()
			: { data: [] };
		const headingData = headingRes.ok ? await headingRes.json() : null;
		console.log("Heading", headingData)
		equipmentItems =
			equipmentData?.data?.map((item) => {
				// Build the image URL: API returns an array like ["/uploads/xxx.jpg"]
				const rawImg = Array.isArray(item.image)
					? item.image[0]
					: item.image;
				const img4 = rawImg?.startsWith("/uploads/")
					? `${cmsBase}${rawImg}`
					: rawImg || "/images/project/project-4.webp";

				return {
					id: item.id,
					title: item.name,
					img4,
				};
			}) ?? [];

		sectionHeading = headingData?.success ? headingData.data : null;
	} catch (error) {
		console.error("Error fetching Machinery & Equipment data:", error);
	}

	// Duplicate items for continuous carousel effect
	const portfolio = [...equipmentItems, ...equipmentItems];

	return (
		<section className="tj-project-section-4 section-gap">
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading w-full style-4 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s" style={{ color: "var(--tj-color-text-body-4)" }}>
								<i className="tji-box"></i>
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
