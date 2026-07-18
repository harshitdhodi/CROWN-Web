import ServiceCard5 from "@/components/shared/cards/ServiceCard5";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getInfrastructureData() {
	try {
		const [headingRes, dataRes] = await Promise.all([
			fetch(`${BASE_URL}/api/heading?section=manufacturing_strength`, { next: { revalidate: 60 } }),
			fetch(`${BASE_URL}/api/data/manufacturing_strength`, { next: { revalidate: 60 } }),
		]);
		const headingResult = await headingRes.json();
		const dataResult = await dataRes.json();
		return {
			heading: headingResult?.success ? headingResult.data : null,
			items: dataResult?.success ? dataResult.data : [],
		};
	} catch (error) {
		console.error("Error fetching infrastructure data:", error);
		return { heading: null, items: [] };
	}
}

async function getIndustryData() {
	try {
		const [headingRes, dataRes] = await Promise.all([
			fetch(`${BASE_URL}/api/heading?section=industries-we-serve`, { next: { revalidate: 60 } }),
			fetch(`${BASE_URL}/api/data/industry`, { next: { revalidate: 60 } }),
		]);
		const headingResult = await headingRes.json();
		const dataResult = await dataRes.json();
		return {
			heading: headingResult?.success ? headingResult.data : null,
			items: dataResult?.success ? dataResult.data : [],
		};
	} catch (error) {
		console.error("Error fetching industry data:", error);
		return { heading: null, items: [] };
	}
}

// variant="industry" → /api/data/industry + /api/heading?section=industries-we-serve (industry-solutions page)
// default            → /api/data/manufacturing_strength + manufacturing_strength heading (all other pages)
const Services4 = async ({ variant } = {}) => {
	const { heading, items } = variant === "industry"
		? await getIndustryData()
		: await getInfrastructureData();

	// Map API fields to the format expected by ServiceCard5
	// Reverse so newest-added items appear last (oldest first)
	const formattedServices = [...items].reverse().map((item) => ({
		...item,
		title: item.title || item.heading || "",
		desc: item.description,
		img: item.image || "",
		icon: item.icon_image || item.color_img || "",
	}));

	const lastItemIdx = formattedServices.length - 1;

	return (
		<section className="tj-service-section-5 section-gap">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="sec-heading style-4 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
								{heading?.tagline || "Our Solutions"}
							</span>
							<h2 className="sec-title title-anim" style={{ maxWidth: "800px", margin: "0 auto" }}>
								{heading?.heading || "Tailor Business Solutions for Corporates."}
							</h2>

							
						</div>
						
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						
						<div className="service-wrapper">
							{formattedServices?.length
								? formattedServices.map((service, idx) => (
									<ServiceCard5
										key={idx}
										service={service}
										idx={idx}
										lastItemIdx={lastItemIdx}
									/>
								))
								: ""}
						</div>

					</div>
				</div>
			</div>
		</section>
	);
};

export default Services4;

