import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import dynamic from "next/dynamic";

const ServicesSlider2 = dynamic(
	() => import("@/components/shared/services/ServicesSlider2")
);

const Services5 = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	let qualityData = [];
	let headingData = null;

	try {
		const [qualityRes, headingRes] = await Promise.all([
			fetch(`${baseUrl}/api/data/quality-control-process`, {
				next: { revalidate: 60 },
			}),
			fetch(`${baseUrl}/api/heading?section=quality-control-process`, {
				next: { revalidate: 60 },
			}),
		]);

		if (qualityRes.ok) {
			const json = await qualityRes.json();
			if (json.success && json.data) {
				qualityData = json.data.map((item) => ({
					id: item.id,
					title: item.title,
					desc3: item.description,
				})).reverse();
			}
		}

		if (headingRes.ok) {
			const json = await headingRes.json();
			if (json.success && json.data) {
				headingData = json.data;
			}
		}
	} catch (error) {
		console.error("Error fetching quality control process data:", error);
	}

	return (
		<section className="h5-service-section overflow-hidden section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap style-3">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>
								{headingData?.tagline || "Our Solutions"}
							</span>
							<div className="heading-wrap-content">
								<div className="sec-heading style-3">
									<h2 className="sec-title text-anim">
										{headingData?.heading || "Tailor Business Solutions for Corporates."}
									</h2>
								</div>
								<div className="btn-area wow fadeInUp" data-wow-delay=".8s">
									<ButtonPrimary text={"Contact Us"} url={"/contact"} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="service-wrapper wow fadeInUp" data-wow-delay=".4s">
							<ServicesSlider2 data={qualityData} />
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services5;
