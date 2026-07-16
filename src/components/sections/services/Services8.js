import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard9 from "@/components/shared/cards/ServiceCard9";

const getSafetyStandards = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/data/safety_standards`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : [];
	} catch (err) {
		console.warn("Failed to fetch safety standards:", err);
		return [];
	}
};

const getHeadingData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/heading?section=safety-standards`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : null;
	} catch (err) {
		console.warn("Failed to fetch heading for safety-standards:", err);
		return null;
	}
};

const Services8 = async () => {
	const services = await getSafetyStandards();
	const headingData = await getHeadingData();

	return (
		<section className="h8-service overflow-hidden section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-3 sec-heading-centered">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>
								{headingData?.tagline || "Our Solutions"}
							</span>
							<h2 className="sec-title title-anim">
								{headingData?.heading || "Tailor Business Solutions for Corporates."}
							</h2>
							{headingData?.subheading && (
								<p className="mt-3 max-w-3xl mx-auto">
									{headingData.subheading}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="container gap-30">
				<div className="row">
					<div className="col-12">
						<div
							className="service-wrapper h8-service-wrapper  wow bounceInLeft"
							data-wow-delay=".3s"
						>
							<div className="row">
								{services?.length
									? services?.map((service, idx) => (
										<div key={idx} className="col-12 col-md-6 col-xl-4 mb-4">
											<ServiceCard9 service={service} idx={idx} />
										</div>
									))
									: ""}
							</div>
						</div>
					</div>
				</div>
				
			</div>
		</section>
	);
};

export default Services8;
