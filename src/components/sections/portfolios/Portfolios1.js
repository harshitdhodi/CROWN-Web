import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import PortfolioCard1 from "@/components/shared/cards/PortfolioCard1";

const getGalleryData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/data/gallery`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : [];
	} catch (err) {
		console.warn("Failed to fetch gallery data:", err);
		return [];
	}
};

const getHeadingData = async () => {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/heading?section=gallery`,
			{
				next: { revalidate: 60 },
			}
		);
		const json = await res.json();
		return json.success ? json.data : null;
	} catch (err) {
		console.warn("Failed to fetch heading for gallery:", err);
		return null;
	}
};

const Portfolios1 = async () => {
	const portfolio = await getGalleryData();
	const headingData = await getHeadingData();

	return (
		<section className="tj-project-section section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>
								{headingData?.tagline || "Proud Projects"}
							</span>
							<div className="heading-wrap-content">
								<div className="sec-heading">
									<h2 className="sec-title title-anim">
										{headingData?.heading || (
											<>
												Breaking Boundaries, Building <span>Dreams.</span>
											</>
										)}
									</h2>
								</div>
								<p className="desc wow fadeInUp" data-wow-delay=".5s">
									{headingData?.subheading ||
										"We work closely with our clients to understand their unique needs and craft tailored solutions that address challenges."}
								</p>
								<div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
									<ButtonPrimary text={"More Projects"} url="/portfolios" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						<div className="project-area tj-arrange-container">
							{portfolio?.length
								? portfolio?.slice(0, 4).map((portfolioSingle, idx) => (
									<PortfolioCard1 key={idx} portfolio={portfolioSingle} />
								))
								: ""}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Portfolios1;
