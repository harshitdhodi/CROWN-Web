import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ProcessSlider from "./ProcessSlider";

async function getProcessData(type) {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
	const isCoreValue = type === "core-value";
	const isQuality = type === "quality";

	const headingSection = isCoreValue ? "core-value"
		: isQuality ? "quality-assurance"
			: "our-history";

	const dataEndpoint = isCoreValue ? "core_value"
		: isQuality ? "quality-control-process"
			: "history";

	try {
		const [headingRes, historyRes] = await Promise.all([
			fetch(`${baseUrl}/api/heading?section=${headingSection}`, {
				next: { revalidate: 0 }, // Reduced to 60s for easier testing of dynamic updates
			}),
			fetch(`${baseUrl}/api/data/${dataEndpoint}`, {
				next: { revalidate: 0 },
			}),
		]);

		const headingData = await headingRes.json();
		const historyData = await historyRes.json();

		return {
			heading: headingData?.success ? headingData.data : null,
			history: historyData?.success ? historyData.data : [],
		};
	} catch (error) {
		console.error("Error fetching process data:", error);
		return { heading: null, history: [] };
	}
}

const DEFAULT_PROCESS_STEPS = [
	{ id: "dummy-pr1", title: "Cleanroom Manufacturing", details: "Production inside ISO Class 8 cleanrooms ensuring ultra-hygienic conditions." },
	{ id: "dummy-pr2", title: "Automated Vision Inspection", details: "100% camera-based dimensional accuracy and defect check on every bottle." },
	{ id: "dummy-pr3", title: "Strict Quality Control", details: "Physical leak testing, drop tests, and chemical compatibility evaluations." },
	{ id: "dummy-pr4", title: "Dust-Free Protective Packaging", details: "Double-bagged sealed carton packaging for safe transit to pharmaceutical clients." }
];

const Process = async ({ type = "history" }) => {
	const { heading, history } = await getProcessData(type);
	// Reverse history to show oldest to newest and map fields robustly
	let rawHistory = history && history.length > 0 ? history : DEFAULT_PROCESS_STEPS;
	const formattedHistory = [...rawHistory]
		.filter(item => item.title || item.name || item.details || item.description || item.subheading)
		.reverse().map(item => ({
			...item,
			title: item.title || item.name || "Information pending",
			desc: item.details || item.description || item.subheading || "Information pending",
		}));

	return (
		<section className=" section-gap section-gap-x">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap ">
							<span className="sub-title wow fadeInUp " data-wow-delay=".3s">
								<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
								{heading?.tagline || "Our Process"}
							</span>
							<div className="heading-wrap-content d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
								<div className="sec-heading style-2 mb-lg-0">
									<h2 className="sec-title text-anim">
										{heading?.heading || "Seamless Process, Great Results."}
									</h2>
								</div>
								<p className="desc wow fadeInUp" data-wow-delay=".5s">
									{heading?.subheading || "Developing personalized customer journeys to increase satisfaction and loyalty."}
								</p>
								<div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
									<ButtonPrimary text={"Request a Call"} url={"/contact"} />
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="row">
					<div className="col-12">
						<ProcessSlider historyData={formattedHistory} />
					</div>
				</div>
			</div>
		</section>
	);
};

export default Process;