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
		totalProject,
		image,
		icon_image,
		img,
		svg,
		iconName
	} = service || {};

	const cardDescription =
		desc ||
		description ||
		"Through a combination of data-driven insights and innovative approaches, we work closely with you to develop customized.";

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
					<h4 className="title">
						<Link href={`/services/${serviceId}`}>{title}</Link>
					</h4>
				</div>
				<div className="service-content">
					<p className="desc" style={{ color: "var(--tj-color-text-body-5)" }}>
						{cardDescription}
					</p>
					<ul className="list-items">
						<li style={{ color: "var(--tj-color-text-body-5)" }}>
							<i className="tji-list"></i>Expansion Strategies
						</li>
						<li style={{ color: "var(--tj-color-text-body-5)" }}>
							<i className="tji-list"></i>Operational Efficiency
						</li>
						<li style={{ color: "var(--tj-color-text-body-5)" }}>
							<i className="tji-list"></i>Competitive Edge
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default ServiceCard2;
