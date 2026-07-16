"use client";
import { usePathname } from "next/navigation";
import ServiceCard3 from "@/components/shared/cards/ServiceCard3";

const Services3Client = ({ services, heading, variant }) => {
	const pathname = usePathname();
	const isIndustrySolutionsPage = pathname === "/industry-solutions";
	const isIndustrySolutions = true;

	const tagline = heading?.tagline || "Our Solutions";
	const title = heading?.heading || "Tailor Business Solutions for Corporates.";

	return (
		<section className={(isIndustrySolutionsPage ? "service-3-light section-gap" : " h6-project  service-3  section-gap") + " services-section-wrapper"}>
			<div className="container ">
				<div className="row">
					<div className="col-lg-12">
						<div className="sec-heading style-3 text-center">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s" style={{ border: '1px dashed var(--tj-color-border-1)', padding: '2px 10px' }}>
								<i className="tji-box"></i>{tagline}
							</span>
							<div className="sec-heading style-3">
								<h2 className="sec-title" style={{
									...(isIndustrySolutionsPage ? { color: "var(--tj-color-text-body-4)" } : { color: "var(--tj-color-text-body-5)" }),
									...(variant === "journey" ? { maxWidth: "600px", margin: "0 auto" } : {}),
								}}>
									{title}
								</h2>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="service-wrapper">
							{services?.length
								? services.map((service, idx) => (
										<ServiceCard3
											key={idx}
											service={service}
											idx={idx}
											isIndustrySolutions={isIndustrySolutions}
											variant={variant}
										/>
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
			<style>{`
				.services-section-wrapper {
					margin-top: 30px !important;
					margin-bottom: 30px !important;
				}
				@media (min-width: 992px) {
					.services-section-wrapper {
						margin-top: 50px !important;
						margin-bottom: 50px !important;
					}
				}
			`}</style>
		</section>
	);
};

export default Services3Client;
