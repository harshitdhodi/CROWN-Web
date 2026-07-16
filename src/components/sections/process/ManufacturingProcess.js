import ProcessCard2 from "@/components/shared/cards/ProcessCard2";

/**
 * Manufacturing Process section – async server component with ISR.
 * Fetches data from /api/data/manufacturing_process and
 * /api/heading?section=manufacturing-process at build / revalidation time.
 */
const ManufacturingProcess = async () => {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

	let processes = [];
	let sectionHeading = null;

	try {
		const [processRes, headingRes] = await Promise.all([
			fetch(`${baseUrl}/api/data/manufacturing_process`, {
				next: { revalidate: 60 },
			}),
			fetch(`${baseUrl}/api/heading?section=manufacturing-process`, {
				next: { revalidate: 60 },
			}),
		]);

		if (!processRes.ok) {
			console.error("Manufacturing Process API failed:", processRes.status);
		}
		if (!headingRes.ok) {
			console.error("Manufacturing Process Heading API failed:", headingRes.status);
		}

		const processData = processRes.ok
			? await processRes.json()
			: { data: [] };
		const headingData = headingRes.ok ? await headingRes.json() : null;

		processes =
			processData?.data?.map((item) => ({
				id: item.id,
				title: item.title,
				desc: item.description,
			})).reverse() || [];

		sectionHeading = headingData?.success ? headingData.data : null;
	} catch (error) {
		console.error("Error fetching Manufacturing Process data:", error);
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
		<section className="h5-working-process  section-gap section-gap-x" style={{ marginTop: "50px", marginBottom: "50px" }}>
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading sec-heading-centered style-3">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>
								{sectionHeading?.tagline || "OUR PROCESS"}
							</span>

							<h2 className="max-w-4xl mx-auto sec-title title-anim text-white">
								{sectionHeading?.heading ||
									"Seamless Process and Great Results."}
							</h2>
						</div>
					</div>
				</div>
			</div>

			<div>
				{rows.map((row, rowIdx) => (
					<div
						key={rowIdx}
						className="h5-working-process-inner"
						style={{ marginTop: rowIdx > 0 ? "80px" : "0" }}
					>
						<div className="container">
							<div className="row">
								<div className="col-12">
									<div
										className="working-process-area h5-working-process-wrapper"
										style={{
											marginBottom:
												rowIdx < rows.length - 1 ? "30px" : "0",
										}}
									>
										{row.map((processSingle, idx) => (
											<ProcessCard2
												key={processSingle.id}
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

			<div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" />
			</div>
			<div className="bg-shape-3">
				<img src="/images/shape/shape-blur.svg" alt="" />
			</div>
			<div className="bg-shape-4">
				<img src="/images/shape/shape-blur.svg" alt="" />
			</div>
		</section>
	);
};

export default ManufacturingProcess;
