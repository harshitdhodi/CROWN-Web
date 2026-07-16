import modifyNumber from "@/libs/modifyNumber";
import Link from "next/link";

const ServiceCard11 = ({ service, idx, lastItemIdx }) => {
	const {
		title,
		desc3,
		description,
		id,
		image,
		totalProject,
		img4 = "/images/service/h6-service-1.webp",
		svg,
		iconName,
		textColor = "#d8e5e5",
	} = service || {};

	const cmsBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";
	const imageUrl = image
		? Array.isArray(image)
			? `${cmsBaseUrl}${image[0]}`
			: image.startsWith("http")
				? image
				: `${cmsBaseUrl}${image}`
		: null;

	return (
		<div className="service-item style-4 custom-bg-card">
			<style>{`
				.custom-bg-card { position: relative; z-index: 1; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
				.custom-bg-card .dynamic-bg {
					position: absolute;
					inset: 0;
					z-index: -1;
					background-size: cover;
					background-position: center;
					transition: opacity 0.5s ease;
					opacity: 1;
				}
				.custom-bg-card .dynamic-bg::before {
					content: '';
					position: absolute;
					inset: 0;
					background: rgba(82, 83, 85, 0.80);
				}
				.custom-bg-card:hover .dynamic-bg {
					opacity: 0;
				}
				.custom-bg-card .service-content { display: flex; flex-direction: column; flex-grow: 1; }
				.custom-bg-card .text-btn { margin-top: auto; }
				.custom-bg-card .service-icon { color: ${textColor}; }
				.custom-bg-card .title { color: ${textColor}; }
				.custom-bg-card .desc { color: ${textColor}; }
			`}</style>

			{imageUrl && (
				<div
					className="dynamic-bg"
					style={{ backgroundImage: `url(${imageUrl})` }}
				></div>
			)}
			<h6 className="h10-service-sln">{modifyNumber(idx + 1)}.</h6>
			<div className="service-icon" style={{ visibility: "hidden", height: "auto" }}>
				<i className={iconName || "tji-box"}></i>
			</div>
			<div className="service-content">
				<h4 className="title">
					<Link href={`/services/${id}`}>{title}</Link>
				</h4>
				<p className="desc line-clamp-3">
					{description ||
						desc3 ||
						"Through a combination of data-driven insights and innovative approaches business."}
				</p>

			</div>
		</div>
	);
};

export default ServiceCard11;
