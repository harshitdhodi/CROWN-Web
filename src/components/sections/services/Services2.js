import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard2 from "@/components/shared/cards/ServiceCard2";

const getServicesData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/data/industry`,
			{ cache: "no-store" }
		);
		const json = await res.json();
		return json.success ? json.data.slice(0, 4) : [];
	} catch (err) {
		console.warn("Failed to fetch services data:", err);
		return [];
	}
};

const getHeadingData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/heading?section=industry`,
			{ cache: "no-store" }
		);
		const json = await res.json();
		return json.success ? json.data : null;
	} catch (err) {
		console.warn("Failed to fetch heading for services2:", err);
		return null;
	}
};

const Services2 = async () => {
	const [services, headingData] = await Promise.all([
		getServicesData(),
		getHeadingData(),
	]);

	return (
		<section className="tj-service-section service-2 section-gap section-gap-x">
			<div className="container">
				<div className="row align-items-start">
					<div className="col-lg-4">
						{/* content-wrap is sticky; col-lg-4 stretches full height via align-items-start on row */}
						<div className="content-wrap slidebar-stickiy">
							<div className="sec-heading style-2">
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i> {headingData?.tagline || "Our Solutions"}
								</span>
								<h2 className="sec-title text-white text-anim">
									{headingData?.heading || "Tailored Business Solutions for our Corporates."}
								</h2>
							</div>
							<div className="wow fadeInUp" data-wow-delay=".6s">
								<ButtonPrimary text={"More Services"} url={"/services"} />
							</div>
						</div>
					</div>
					<div className="col-lg-8">
						<div className="service-wrapper-2">
							{services?.length
								? services?.map((service, idx) => (
										<ServiceCard2 key={idx} service={service} idx={idx} />
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services2;
