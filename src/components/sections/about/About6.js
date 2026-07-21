'use client';
import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";

const About6 = () => {
	const [headingData, setHeadingData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchHeading = async () => {
			try {
				const res = await fetch("/api/heading?section=production-capacity");
				const json = await res.json();
				if (json.success && json.data) {
					setHeadingData(json.data);
				}
			} catch (err) {
				console.error("Failed to fetch heading data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchHeading();
	}, []);

	return (
		<section className="tj-about-section section-gap section-gap-x h7-about" style={{ marginTop: "50px", marginBottom: "50px" }}>
			<div className="container">
				<div className="row row-gap-4">
					<div className="col-12">
						<div
							className="about-content-area-2 wow fadeInUp"
							data-wow-delay=".3s"
						>
							<div className="sec-heading style-2 style-7">
								<div className="row">
									<div className="col-12 col-lg-4">
										<span
											className="sub-title wow fadeInUp"
											data-wow-delay=".3s"
										>
											<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
											{loading ? "Get to Know Us" : headingData?.tagline || "Get to Know Us"}
										</span>
									</div>
									<div className="col-12 col-lg-8">
										<div className="h7-about-content-inner">
											<h2 className="sec-title title-highlight">
												{loading
													? "Powering Innovations Throughout Partnerships with our Brands and Many Companies."
													: headingData?.heading || "Powering Innovations Throughout Partnerships with our Brands and Many Companies."}
											</h2>
											<p>
												{loading
													? "At CROWN Packaging, we are passionate about shaping the future of manufacturing..."
													: headingData?.subheading?.split("\n\n")[0] || ""}
											</p>
											{!loading && headingData?.subheading?.split("\n\n")[1] && (
												<p>{headingData.subheading.split("\n\n")[1]}</p>
											)}
											<div
												className="about-btn-area-2 wow fadeInUp"
												data-wow-delay="1s"
											>
												<ButtonPrimary text={"Know More Us"} url={"/about-us"} />
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div>
		</section>
	);
};

export default About6;  