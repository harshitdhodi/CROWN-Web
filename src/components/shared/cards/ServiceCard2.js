"use client";
import Link from "next/link";
import Image from "next/image";

function resolveImage(src, fallback = "/images/service/h9-service-1.webp") {
	if (!src) return fallback;
	if (src.startsWith("http://") || src.startsWith("https://")) return src;
	if (src.startsWith("/")) return src;
	return `/${src}`;
}

const ServiceCard2 = ({ service, idx, lastItem }) => {
	const {
		title,
		desc,
		description,
		id,
		slug,
		icon_image,
		iconName,
	} = service || {};

	const cardDescription =
		desc ||
		description ||
		"Through a combination of data-driven insights and innovative approaches, we work closely with you to develop customized.";

	// Replace <li> bullet points with tji-list icon — flex-start so icon aligns top for multiline text
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

	const serviceId = slug || id || "";

	return (
		<div className="service-item-wrapper tj-fadein-right-on-scroll">
			<div className="service-item style-2 ">
				<div className="title-area">
					<div className="service-icon">
						{icon_image ? (
							<div style={{ position: "relative", width: "48px", height: "48px" }}>
								<Image
									src={resolveImage(icon_image)}
									alt={title || "Service icon"}
									fill
									sizes="48px"
									quality={85}
									style={{ objectFit: "contain" }}
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						) : (
							<i className={iconName ? iconName : "tji-service-1"}></i>
						)}
					</div>
					<h4 className="title" style={{ color: "var(--tj-color-text-body-5)" }}>
						<Link href={`/services/${serviceId}`} style={{ color: "var(--tj-color-text-body-5)" }}>{title}</Link>
					</h4>
				</div>
				<div className="service-content" style={{ color: "var(--tj-color-text-body-5)" }}>
					<p
						className="desc"
						style={{ color: "var(--tj-color-text-body-5)" }}
						dangerouslySetInnerHTML={{ __html: processedDescription }}
					/>
				</div>
			</div>
		</div>
	);
};

export default ServiceCard2;
