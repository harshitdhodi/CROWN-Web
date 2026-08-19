'use client';
import { useEffect, useState } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { getCmsBase } from "@/lib/seoConfig";

const About6 = () => {
	const [headingData, setHeadingData] = useState(null);
	const [aboutData, setAboutData] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchData = async () => {
			const CMS_BASE_URL = getCmsBase();
			try {
				const [headingRes, aboutRes] = await Promise.all([
					fetch(`${CMS_BASE_URL}/api/heading?section=production-capacity`),
					fetch(`${CMS_BASE_URL}/api/data/packaging-solutions`),
				]);

				if (headingRes.ok) {
					const headingJson = await headingRes.json();
					if (headingJson.success && headingJson.data) {
						setHeadingData(headingJson.data);
					}
				}

				if (aboutRes.ok) {
					const aboutJson = await aboutRes.json();
					if (aboutJson.success && Array.isArray(aboutJson.data) && aboutJson.data.length > 0) {
						setAboutData(aboutJson.data[0]);
					}
				}
			} catch (err) {
				console.error("Failed to fetch About6 data:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, []);

	// Resolve dynamic text fields from packaging-solutions CMS data or fallback heading defaults
	const tagline = aboutData?.tagline || headingData?.tagline || "GET TO KNOW US";
	const heading = aboutData?.heading || headingData?.heading || "Powering Innovations Throughout Partnerships with our Brands and Many Companies.";
	const rawDesc = aboutData?.description || headingData?.subheading || "At CROWN Packaging, we are passionate about shaping the future of manufacturing and packaging.";

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
											{tagline}
										</span>
									</div>
									<div className="col-12 col-lg-8">
										<div className="h7-about-content-inner">
											<h2 className="sec-title text-black">
												{heading}
											</h2>
											{rawDesc && rawDesc.includes('<p>') ? (
												<div
													className="desc-content"
													dangerouslySetInnerHTML={{ __html: rawDesc }}
												/>
											) : (
												<p>{rawDesc}</p>
											)}
											<div
												className="about-btn-area-2 wow fadeInUp mt-6"
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