"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import dynamic from "next/dynamic";
import Image from "next/image";

const TesstimonialsVerticalSlider = dynamic(
	() => import("@/components/shared/testimonials/TesstimonialsVerticalSlider"),
	{ ssr: false }
);

const Testimonials6Client = ({ leftData, reviews }) => {
	// Resolve image URL — uploads come from the CMS server
	const resolveImg = (path) => {
		if (!path) return null;
		if (path.startsWith("/uploads/")) {
			const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
			return `${baseUrl}${path}`;
		}
		return path;
	};

	return (
		<div style={{ paddingTop: "50px", paddingBottom: "50px" }}>
			<section className="h6-testimonial section-gap section-gap-x slidebar-stickiy-container">
			<div className="container">
				<div className="row">
					{/* ── Left: image + heading ── */}
					<div className="col-lg-6">
						<div className="slidebar-stickiy">
							{/* Banner image (replaces video) */}
							<div className="h6-testimonial-banner">
								{leftData?.image ? (
									<Image
										src={resolveImg(leftData.image)}
										alt={leftData.heading || "Testimonial"}
										width={600}
										height={450}
										style={{ width: "100%", height: "auto", borderRadius: 12, display: "block" }}
									/>
								) : (
									<Image
										src="/images/testimonial/h6-testimonial-banner.webp"
										alt="Testimonial"
										width={600}
										height={450}
										style={{ width: "100%", height: "auto" }}
									/>
								)}
							</div>

							{/* Heading block */}
							<div className="content-wrap">
								<div className="sec-heading style-2 style-6">
									<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
										<i className="tji-box"></i>
										{leftData?.tag || "CLIENT FEEDBACK"}
									</span>
									<h2 className="sec-title ">
										{leftData?.heading || leftData?.title || leftData?.subheading || "Our Clients Share Their Success Stories"}
									</h2>
								</div>
								<p className="desc">
									{leftData?.subheading ||
										"Our approach to customer experience is comprehensive and data-driven. We begin by assessing your current."}
								</p>
								<div
									className="d-none d-lg-inline-flex wow fadeInUp"
									data-wow-delay=".6s"
								>
									<ButtonPrimary text={"Explore More"} url={"/contact"} />
								</div>
							</div>
						</div>
					</div>

					{/* ── Right: review slider ── */}
					<div className="col-lg-6">
						<div
							className="testimonial-wrapper h6-testimonial-wrapper wow fadeInUp"
							data-wow-delay=".5s"
						>
							<TesstimonialsVerticalSlider testimonials={reviews} />
						</div>
					</div>
				</div>
			</div>

			<div className="bg-shape-1">
				<Image src="/images/shape/pattern-2.svg" alt="" width={100} height={100} style={{ width: "100%", height: "auto" }} />
			</div>
			<div className="bg-shape-2">
				<Image src="/images/shape/pattern-3.svg" alt="" width={100} height={100} style={{ width: "100%", height: "auto" }} />
			</div>
		</section>
		</div>
	);
};

export default Testimonials6Client;
