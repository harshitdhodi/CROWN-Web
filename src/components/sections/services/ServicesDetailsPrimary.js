"use client";
import Link from "next/link";
import CtaSidebar from "../cta/CtaSidebar";

/**
 * Resolve an image src for use in a plain <img> tag.
 * Paths starting with /uploads/ are served via Next.js rewrite → CMS.
 * Full http://localhost:3012/... URLs are kept as-is (Next.js image proxy not needed for <img>).
 * Falls back to local static image.
 */
function resolveImgSrc(src, fallback = "/images/service/service-details.webp") {
	if (!src) return fallback;
	// Already a full URL — use as-is
	if (src.startsWith("http://") || src.startsWith("https://")) return src;
	// Relative /uploads/... → goes through next.config rewrite to CMS
	return src;
}

const ServicesDetailsPrimary = ({ option }) => {
	const {
		currentItem,
		moreServices,
		currentId,
		isPrevItem,
		isNextItem,
		prevSlug,
		nextSlug,
	} = option || {};

	const { title, desc, longDescription, img } = currentItem || {};
	const heroSrc = resolveImgSrc(img);

	return (
		<section className="tj-service-area section-gap">
			<div className="container">
				<div className="row row-gap-5">
					{/* ── Main Content ── */}
					<div className="col-lg-8">
						<div className="post-details-wrapper">
							{/* Hero image — plain <img> avoids Next.js domain restrictions */}
							<div className="blog-images wow fadeInUp" data-wow-delay=".1s">
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={heroSrc}
									alt={title || "Service"}
									style={{ width: "100%", height: "auto", borderRadius: "8px" }}
								/>
							</div>

							{/* Title */}
							<h2 className="title title-anim">{title}</h2>

							{/* Short description */}
							{desc && (
								<div className="blog-text">
									<p className="wow fadeInUp" data-wow-delay=".2s">
										{desc}
									</p>
								</div>
							)}

							{/* Long description — Tiptap HTML with full typography */}
							{longDescription && (
								<div
									className="tiptap-content wow fadeInUp"
									data-wow-delay=".3s"
									dangerouslySetInnerHTML={{ __html: longDescription }}
								/>
							)}


						</div>
					</div>

					{/* ── Sidebar ── */}
					<div className="col-lg-4">
						<aside className="tj-main-sidebar">
							{/* More Services — 5 items excluding current */}
							{moreServices?.length > 0 && (
								<div
									className="tj-sidebar-widget service-categories wow fadeInUp"
									data-wow-delay=".1s"
								>
									<h4 className="widget-title">More Services</h4>
									<ul>
										{moreServices.map(({ shortTitle, id, slug }, idx) => (
											<li key={idx}>
												<Link
													className={currentId === id ? "active" : ""}
													href={`/services/${slug}`}
												>
													{shortTitle}
													<span className="icon">
														<i className="tji-arrow-right"></i>
													</span>
												</Link>
											</li>
										))}
									</ul>
								</div>
							)}

							{/* CTA */}
							<div
								className="tj-sidebar-widget widget-feature-item wow fadeInUp"
								data-wow-delay=".3s"
							>
								<CtaSidebar />
							</div>
						</aside>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ServicesDetailsPrimary;
