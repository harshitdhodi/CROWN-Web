import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard2 from "@/components/shared/cards/ServiceCard2";
import { getCmsBase } from "@/lib/seoConfig";

const getServicesData = async () => {
	const CMS_BASE_URL = getCmsBase();
	try {
		const res = await fetch(
			`${CMS_BASE_URL}/api/data/manufacturing_process`,
			{ next: { revalidate: 0 }, cache: 'no-store' }
		);
		const json = await res.json();
		return json.success ? json.data : [];
	} catch (err) {
		console.warn("Failed to fetch services data:", err);
		return [];
	}
};

const getHeadingData = async () => {
	const CMS_BASE_URL = getCmsBase();
	try {
		const res = await fetch(
			`${CMS_BASE_URL}/api/heading?section=industry`,
			{ next: { revalidate: 0 }, cache: 'no-store' }
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
						<div className="content-wrap slidebar-stickiy">
							<div className="sec-heading style-2">
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s" style={{ backgroundColor: 'transparent', padding: '0' }}>
									<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i> {headingData?.tagline || "Our Solutions"}
								</span>
								<h2 className="sec-title text-white title-anim">
									{headingData?.heading || "Tailored Business Solutions for our Corporates."}
								</h2>
							</div>
						</div>
					</div>
					<div className="col-lg-8">
						<div className="service-wrapper-2">
							{services?.length
								? services?.map((service, idx) => (
									<ServiceCard2 key={service.id || idx} service={service} idx={idx} />
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
