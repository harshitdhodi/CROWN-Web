"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import PortfolioCard6 from "@/components/shared/cards/PortfolioCard6";
import { useCallback, useState } from "react";
const Portfolios6 = ({ heading, portfolio }) => {
	console.log("heading",heading)
	const [currentIndex, setCurrentIndex] = useState(2);
	const displayPortfolio = portfolio?.slice(0, 6); // Ensure only up to 6 items are displayed
	const handleCurrentIndex = useCallback(idx => {
		setCurrentIndex(idx);
	}, []);

	return (
		<section
			className="h6-project section-gap section-gap-x"
			// style={{ paddingTop: '50px', paddingBottom: '50px' }}
		>
			<div className="container ">
				<div className="row">
					<div className="col-12">
						<div className="heading-wrap-content">
							<div className="sec-heading style-2  style-6">
								<span className="sub-title section-gap wow fadeInUp" data-wow-delay=".3s"> {/* Use heading tagline */}
									<i className="tji-box"></i>
									{heading?.tagline || "Proud Projects"}
								</span>
								<h2 className="sec-title w-full text-white "> {/* Use heading title */}
									{heading?.heading || "Breaking Boundaries, Building Dreams."}
								</h2>
							</div>
							<div className="btn-area  wow fadeInUp" data-wow-delay=".8s">
								<ButtonPrimary text={"More Projects"} url={"/portfolios"} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="container-fluid">
				<div className="row">
					<div className="col-12 section-gap">
						<div
							className="h6-project-inner   wow fadeInUp"
							data-wow-delay="0.6s"
						>
							{displayPortfolio?.length
								? displayPortfolio?.map((portfolioSingle, idx) => (
										<PortfolioCard6
											key={idx}
											portfolio={portfolioSingle}
											idx={idx}
											currentIndex={currentIndex}
											handleCurrentIndex={handleCurrentIndex}
										/>
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
			<div className="bg-shape-1">
				<img src="/images/shape/pattern-2.svg" alt="" width={370} height={590} />
			</div>
			<div className="bg-shape-2">
				<img src="/images/shape/pattern-3.svg" alt="" width={370} height={590} />
			</div>
			<div className="bg-shape-3">
				<img src="/images/shape/shape-blur.svg" alt="" width={917} height={393} />
			</div>
		</section>
	);
};

export default Portfolios6;
