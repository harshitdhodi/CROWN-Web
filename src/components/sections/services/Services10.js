import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import dynamic from "next/dynamic";

const ServicesSlider4 = dynamic(
	() => import("@/components/shared/services/ServicesSlider4")
);

const getIndustryData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/data/industry`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : [];
	} catch (err) {
		console.warn("Failed to fetch industry data:", err);
		return [];
	}
};

const getHeadingData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/heading?section=industry`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : null;
	} catch (err) {
		console.warn("Failed to fetch heading for industry:", err);
		return null;
	}
};

const Services10 = async () => {
	const services = await getIndustryData();
	const headingData = await getHeadingData();

	return (
		<section className="h5-service-section h10-service section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap style-8">
							<div className="heading-wrap-content">
								<div className="sec-heading style-3">
									<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
										<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i> {headingData?.tagline || "Our Solutions"}
									</span>
									<h2 className="sec-title text-anim">
										{headingData?.heading || "Tailor Business Solutions for Corporates."}
									</h2>
								</div>
								<div className="btn-area wow fadeInUp" data-wow-delay=".8s">
									<ButtonPrimary text={"Explore More"} url={"/services"} />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row ">
					<div className="col-12">
						<div
							className="service-wrapper h10-service-wrapper wow fadeInUp"
							data-wow-delay=".4s"
						>
							<ServicesSlider4 services={services} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services10;
