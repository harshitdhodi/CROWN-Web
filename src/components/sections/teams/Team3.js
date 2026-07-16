"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const TeamMarqueeSlider = dynamic(
	() => import("@/components/shared/marquee/TeamMarqueeSlider"),
	{ ssr: false }
);

const Team3 = ({ isInnerPage = false, styleConfig }) => {
	const [headingData, setHeadingData] = useState({ tagline: "", heading: "" });
	const [partners, setPartners] = useState([]);
	const [loading, setLoading] = useState(true);
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

	// Apply dynamic styles from CMS
	const sectionStyle = {
		backgroundColor: styleConfig?.background_color,
		color: styleConfig?.text_color,
		marginTop: "50px",
		marginBottom: "50px",
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [headingRes, dataRes] = await Promise.all([
					fetch(`${baseUrl}/api/heading?section=logistics_partners`),
					fetch(`${baseUrl}/api/data/logistics_partners`),
				]);

				const headingResult = await headingRes.json();
				const dataResult = await dataRes.json();

				if (headingResult?.success && headingResult.data) {
					setHeadingData({
						tagline: headingResult.data.tagline?.trim(),
						heading: headingResult.data.heading,
					});
				}

				if (dataResult?.success && Array.isArray(dataResult.data)) {
					const formattedPartners = dataResult.data.map((item) => ({
						...item,
						img: item.image?.startsWith("/") ? `${baseUrl}${item.image}` : item.image,
						name: "", // Remove name as requested
						desig: "", // Remove designation as requested
					}));
					setPartners(formattedPartners);
				}
			} catch (error) {
				console.error("Error fetching logistics partners data:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [baseUrl]);
 
	return (
		<section className="h7-team section-gap section-gap-x" style={sectionStyle}>
			<div className="container-fluid">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading style-2 style-7 sec-heading-centered">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i> {headingData.tagline || "Meet Our Logistics Partners"}
							</span>
							<h2 className="sec-title text-anim">
								{headingData.heading || "The People Empowering Business Level."}
							</h2>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="h7-team-wrapper">
							{!loading && (
								<>
									<TeamMarqueeSlider items={partners} />
									<TeamMarqueeSlider items={partners} isRtl={true} />
								</>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="bg-shape-3">
				<img src="/images/shape/h7-testimonial-shape-blur.svg" alt="" />
			</div>
		</section>
	);
};

export default Team3;
