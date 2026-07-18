import FeatureCard3 from "@/components/shared/cards/FeatureCard3";
import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getWhyChooseData() {
	try {
		const [featuresRes, headingRes] = await Promise.all([
			fetch(`${BASE_URL}/api/data/whychooseus`, { next: { revalidate: 60 } }),
			fetch(`${BASE_URL}/api/heading?section=why-choose-us`, { next: { revalidate: 60 } }),
		]);

		const featuresData = featuresRes.ok ? await featuresRes.json() : null;
		const headingData = headingRes.ok ? await headingRes.json() : null;

		const features = featuresData?.success
			? featuresData.data.map((item) => ({
				id: item.id,
				title: item.heading || item.title || "",
				icon: item.icon || "tji-innovative",
				desc: item.details || item.description || item.desc || "",
				color_img: item.color_img || null,
				hover_img: item.hover_img || null,
			}))
			: [];

		const heading = headingData?.success ? headingData.data : null;

		return { features, heading };
	} catch (error) {
		console.error("Error fetching Why Choose Us data:", error);
		return { features: [], heading: null };
	}
}

// Default fallback features if API is unavailable
const defaultFeatures = [
	{
		id: 1,
		title: "Quality Assurance",
		icon: "tji-excellence",
		desc: "Strict quality checks at every stage ensure our packaging is safe, consistent, and meets global pharma standards.",
	},
	{
		id: 2,
		title: "Innovative Manufacturing",
		icon: "tji-innovative",
		desc: "We leverage cutting-edge technology and modern processes to deliver high-performance packaging solutions.",
	},
	{
		id: 3,
		title: "Expert Team",
		icon: "tji-team",
		desc: "Our skilled professionals bring deep industry expertise to every project, ensuring precision and reliability.",
	},
	{
		id: 4,
		title: "Dedicated Support",
		icon: "tji-support",
		desc: "From design to delivery, our team is always available to address your needs and provide tailored solutions.",
	},
];

const Features3 = async () => {
	const { features: apiFeatures, heading } = await getWhyChooseData();
	const features = apiFeatures.length > 0 ? apiFeatures : defaultFeatures;

	const tagline = heading?.tagline || "Why Choose Us";
	const title = heading?.heading || "Solutions Built for Excellence.";

	// All 5 API items render as regular FeatureCard3 cards
	// Layout: [1][heading][2] / [3][4][0]
	const card0 = features[0] || defaultFeatures[0];
	const card1 = features[1] || defaultFeatures[1];
	const card2 = features[2] || defaultFeatures[2];
	const card3 = features[3] || defaultFeatures[3];
	const card4 = features[4] || defaultFeatures[0];

	return (
		<section id="why-choose-us" className="tj-choose-section section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{/* Top-left card */}
					<div className="col-lg-4 col-md-6 order-lg-0 order-1 wow fadeInUp" data-wow-delay=".2s">
						<FeatureCard3 feature={card1} />
					</div>

					{/* Center: heading + CTA */}
					<div className="col-lg-4 col-md-6 order-lg-1 order-0">
						<div className="h4-content-wrap text-center">
							<div className="sec-heading style-4 text-center">
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>{tagline}
								</span>
								<h2 className="sec-title title-anim">{title}</h2>
							</div>
							<Link
								href="/contact"
								className="tj-primary-btn wow fadeInUp"
								data-wow-delay=".5s"
							>
								<span className="btn-text">
									<span>Get in Touch</span>
								</span>
								<span className="btn-icon">
									<i className="tji-arrow-right-long"></i>
								</span>
							</Link>
						</div>
					</div>

					{/* Top-right card */}
					<div className="col-lg-4 col-md-6 order-lg-2 order-2 wow fadeInUp" data-wow-delay=".3s">
						<FeatureCard3 feature={card2} />
					</div>

					{/* Bottom-left card */}
					<div className="col-lg-4 col-md-6 order-lg-3 order-3 wow fadeInUp" data-wow-delay=".5s">
						<FeatureCard3 feature={card3} />
					</div>

					{/* Bottom-center card */}
					<div className="col-lg-4 col-md-6 order-lg-4 order-4 wow fadeInUp" data-wow-delay=".7s">
						<FeatureCard3 feature={card0} />
					</div>

					{/* Bottom-right: 5th card */}
					<div className="col-lg-4 col-md-6 order-lg-5 order-5 wow fadeInUp" data-wow-delay=".9s">
						<FeatureCard3 feature={card4} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Features3;
