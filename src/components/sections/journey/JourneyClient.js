"use client";

import makeWowDelay from "@/libs/makeWowDelay";

/** Resolve /uploads/... paths — served via Next.js rewrite proxy */
function resolveImg(src) {
	if (!src) return null;
	if (src.startsWith("http://") || src.startsWith("https://")) return src;
	if (src.includes("/uploads/")) return "/uploads/" + src.split("/uploads/")[1];
	return src;
}

const JourneyClient = ({ items = [], heading }) => {
	const tagline = heading?.tagline || "Our Growth Story";
	const title = heading?.heading || "A Journey of Innovation, Quality & Trusted Partnerships";
	const subheading = heading?.subheading || "";

	if (items.length === 0) return null;

	return (
		<section className="tj-journey-section section-gap section-gap-x">
			{/* ── Section Heading ── */}
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-xl-8 col-lg-10">
						<div className="sec-heading-wrap text-center mb-60">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>
								{tagline}
							</span>
							<h2 className="sec-title title-anim">{title}</h2>
							{subheading && (
								<p className="desc wow fadeInUp" data-wow-delay=".5s">
									{subheading}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* ── Timeline Cards ── */}
				<div className="tj-journey-list">
					{items.map((item, idx) => {
						const isEven = idx % 2 === 1;
						const imgSrc = resolveImg(item.image);

						return (
							<div
								key={item.id}
								className={`tj-journey-item wow fadeInUp${isEven ? " journey-reverse" : ""}`}
								data-wow-delay={makeWowDelay(idx, 0.2)}
							>
								{/* ── Year Badge (left side) ── */}
								<div className="journey-year-col">
									<div className="journey-year-badge">
										<span>{item.year || "—"}</span>
									</div>
								</div>

								{/* ── Connector line + dot ── */}
								<div className="journey-connector">
									<div className="journey-dot"></div>
									<div className="journey-line"></div>
								</div>

								{/* ── Card (right side) ── */}
								<div className="journey-card-col">
									<div className="journey-card">
										{imgSrc && (
											<div className="journey-card-img">
												<img
													src={imgSrc}
													alt={item.imgtitle || item.heading || ""}
													title={item.imgtitle || ""}
													loading="lazy"
												/>
											</div>
										)}
										<div className="journey-card-body">
											<h4 className="journey-card-title">{item.heading}</h4>
											<p className="journey-card-desc">{item.description}</p>
										</div>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<style jsx>{`
				/* ─── Layout ─────────────────────────────────────────────── */
				.tj-journey-list {
					position: relative;
					display: flex;
					flex-direction: column;
					gap: 48px;
				}

				.tj-journey-item {
					display: grid;
					grid-template-columns: 180px 48px 1fr;
					align-items: flex-start;
					gap: 0;
					position: relative;
				}

				/* Reversed: card on the left, year on the right */
				.tj-journey-item.journey-reverse {
					grid-template-columns: 1fr 48px 180px;
				}
				.tj-journey-item.journey-reverse .journey-year-col {
					order: 3;
					text-align: left;
				}
				.tj-journey-item.journey-reverse .journey-connector {
					order: 2;
				}
				.tj-journey-item.journey-reverse .journey-card-col {
					order: 1;
				}

				/* ─── Year Badge ─────────────────────────────────────────── */
				.journey-year-col {
					display: flex;
					align-items: flex-start;
					justify-content: flex-end;
					padding-top: 22px;
					padding-right: 16px;
				}
				.tj-journey-item.journey-reverse .journey-year-col {
					justify-content: flex-start;
					padding-right: 0;
					padding-left: 16px;
				}

				.journey-year-badge {
					display: inline-flex;
					align-items: center;
					justify-content: center;
					background: var(--tj-color-theme-primary);
					color: #fff;
					font-size: 18px;
					font-weight: 700;
					letter-spacing: -0.5px;
					padding: 10px 18px;
					border-radius: 40px;
					white-space: nowrap;
					box-shadow: 0 4px 18px color-mix(in srgb, var(--tj-color-theme-primary) 35%, transparent);
					line-height: 1.2;
				}

				/* ─── Connector ──────────────────────────────────────────── */
				.journey-connector {
					display: flex;
					flex-direction: column;
					align-items: center;
					width: 48px;
					position: relative;
				}

				.journey-dot {
					width: 16px;
					height: 16px;
					border-radius: 50%;
					background: var(--tj-color-theme-primary);
					border: 3px solid #fff;
					box-shadow: 0 0 0 3px var(--tj-color-theme-primary);
					flex-shrink: 0;
					margin-top: 28px;
					position: relative;
					z-index: 2;
				}

				.journey-line {
					width: 2px;
					flex: 1;
					min-height: 60px;
					background: linear-gradient(
						to bottom,
						var(--tj-color-theme-primary),
						color-mix(in srgb, var(--tj-color-theme-primary) 20%, transparent)
					);
					margin-top: 4px;
				}

				/* ─── Card ───────────────────────────────────────────────── */
				.journey-card-col {
					padding-left: 16px;
				}
				.tj-journey-item.journey-reverse .journey-card-col {
					padding-left: 0;
					padding-right: 16px;
				}

				.journey-card {
					background: var(--tj-color-common-white, #fff);
					border: 1px solid var(--tj-color-border-1, #eef3f3);
					border-radius: 16px;
					overflow: hidden;
					box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
					transition: box-shadow 0.3s ease, transform 0.3s ease;
					display: flex;
					flex-direction: column;
				}
				.journey-card:hover {
					box-shadow: 0 8px 36px rgba(0, 0, 0, 0.12);
					transform: translateY(-4px);
				}

				.journey-card-img {
					width: 100%;
					aspect-ratio: 16 / 7;
					overflow: hidden;
				}
				.journey-card-img img {
					width: 100%;
					height: 100%;
					object-fit: cover;
					display: block;
					transition: transform 0.5s ease;
				}
				.journey-card:hover .journey-card-img img {
					transform: scale(1.04);
				}

				.journey-card-body {
					padding: 24px 28px;
				}

				.journey-card-title {
					font-size: 20px;
					font-weight: 700;
					color: var(--tj-color-heading-primary, #1a1a2e);
					margin-bottom: 10px;
					line-height: 1.3;
				}

				.journey-card-desc {
					font-size: 15px;
					line-height: 1.7;
					color: var(--tj-color-body-primary, #54606c);
					margin-bottom: 0;
				}

				/* ─── Responsive ─────────────────────────────────────────── */
				@media (max-width: 767px) {
					.tj-journey-item,
					.tj-journey-item.journey-reverse {
						grid-template-columns: 1fr;
						gap: 12px;
					}

					.journey-year-col,
					.tj-journey-item.journey-reverse .journey-year-col {
						order: 0;
						justify-content: flex-start;
						padding: 0;
					}

					.journey-connector {
						display: none;
					}

					.journey-card-col,
					.tj-journey-item.journey-reverse .journey-card-col {
						order: 1;
						padding: 0;
					}
				}

				@media (min-width: 768px) and (max-width: 991px) {
					.tj-journey-item,
					.tj-journey-item.journey-reverse {
						grid-template-columns: 140px 40px 1fr;
					}
					.tj-journey-item.journey-reverse {
						grid-template-columns: 1fr 40px 140px;
					}
					.journey-year-badge {
						font-size: 15px;
						padding: 8px 14px;
					}
				}
			`}</style>
		</section>
	);
};

export default JourneyClient;
