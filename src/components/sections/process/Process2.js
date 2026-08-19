import ProcessCard2 from "@/components/shared/cards/ProcessCard2";
import { getCmsBase } from "@/lib/seoConfig";

const Process2 = async () => {
	const CMS_BASE_URL = getCmsBase();

	let processes = [];
	let sectionHeading = null;

	try {
		const [processRes, headingRes] = await Promise.all([
			fetch(`${CMS_BASE_URL}/api/data/quality-process`, { next: { revalidate: 0 } }),
			fetch(`${CMS_BASE_URL}/api/heading?section=quality-process`, { next: { revalidate: 0 } }),
		]);

		if (!processRes.ok) {
			console.error("Process API failed:", processRes.status);
		}
		if (!headingRes.ok) {
			console.error("Heading API failed:", headingRes.status);
		}

		const processData = processRes.ok ? await processRes.json() : { data: [] };
		const headingData = headingRes.ok ? await headingRes.json() : null;

		processes =
			processData?.data?.map((item) => ({
				id: item.id,
				heading: item.heading || item.title,
				description: item.description || item.desc || item.details,
			})) || [];

		sectionHeading = headingData?.success ? headingData.data : null;
	} catch (error) {
		console.error("Error fetching Process data:", error);
	}

	// Helper to chunk array into rows of 3
	const chunkArray = (arr, size) =>
		arr.reduce(
			(acc, _, i) =>
				i % size === 0 ? [...acc, arr.slice(i, i + size)] : acc,
			[]
		);
	const rows = chunkArray(processes, 3);

	return (
		<section className="h5-working-process section-gap section-gap-x" style={{ marginTop: "50px", marginBottom: "50px" }}>
			<div className="container">
				<div className="row">
					<div className="col-12 lg:!mb-20">
						<div className="sec-heading sec-heading-centered style-3">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
								{sectionHeading?.tagline || "OUR PROCESS"}
							</span>

							<h2 className="max-w-4xl mx-auto sec-title title-anim text-white">
								{sectionHeading?.heading || "Seamless Process and Great Results."}
							</h2>
						</div>
					</div>
				</div>
			</div>

			<div>
				{rows.map((row, rowIdx) => (
					<div
						key={rowIdx}
						className={`h5-working-process-inner ${
							rowIdx > 0 ? "mt-5 sm:mt-[72px]" : "mt-0"
						}`}
					>
						<div className="container">
							<div className="row">
								<div className="col-12">
									<div
										className={`working-process-area h5-working-process-wrapper ${
											rowIdx < rows.length - 1 ? "sm:mb-[30px] mb-0" : "mb-0"
										}`}
									>
										{row.map((processSingle, idx) => (
											<ProcessCard2
												key={processSingle.id || idx}
												processSingle={processSingle}
												idx={rowIdx * 3 + idx}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</section>
	);
};

export default Process2;