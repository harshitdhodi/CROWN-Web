"use client";
import Link from "next/link";
import { resolveCmsImage } from "@/lib/seoConfig";

const ServiceCard2 = ({ service, idx, lastItem }) => {
	const {
		title,
		desc,
		description,
		id,
		slug,
		icon_image,
		image,
		color_img,
		hover_img,
		iconName,
	} = service || {};

	const cardDescription =
		desc ||
		description ||
		"Through a combination of data-driven insights and innovative approaches, we work closely with you to develop customized.";

	const rawImg = image || color_img || icon_image || hover_img || "";
	const resolvedImg = resolveCmsImage(rawImg);

	// Replace <li> bullet points with tji-list icon
	const processedDescription = cardDescription
		.replace(
			/<li>/gi,
			'<li style="display:flex;align-items:flex-start;gap:8px;color:var(--tj-color-text-body-5);"><i class="tji-list" style="color:var(--tj-color-theme-primary);flex-shrink:0;margin-top:3px;"></i>'
		)
		.replace(
			/<(h[1-6])([\s>])/gi,
			'<$1 style="color:var(--tj-color-text-body-5);"$2'
		)
		.replace(
			/<p([\s>])/gi,
			'<p style="color:var(--tj-color-text-body-5);"$1'
		);

	return (
		<div className="service-item-wrapper tj-fadein-right-on-scroll">
			<style>{`
				.service-item.style-2:hover {
					background-color: transparent !important;
				}
				.service-item.style-2 .service-icon img {
					width: 55px;
					height: 55px;
					object-fit: contain;
				}
			`}</style>
			<div className="service-item style-2">
				<div className="title-area">
					<div className="service-icon">
						{resolvedImg ? (
							<img
								src={resolvedImg}
								alt={title || "Service icon"}
								style={{ width: "55px", height: "55px", objectFit: "contain" }}
							/>
						) : (
							<i className={iconName ? iconName : "tji-service-1"}></i>
						)}
					</div>
					<h4 className="title" style={{ color: "var(--tj-color-text-body-5)" }}>
						<Link href={`/contact`} style={{ color: "var(--tj-color-text-body-5)" }}>{title}</Link>
					</h4>
				</div>
				<div className="service-content" style={{ color: "var(--tj-color-text-body-5)" }}>
					<div
						className="desc"
						style={{ color: "var(--tj-color-text-body-5)" }}
						dangerouslySetInnerHTML={{ __html: processedDescription }}
						suppressHydrationWarning
					/>
				</div>
			</div>
		</div>
	);
};

export default ServiceCard2;
