import Link from "next/link";
import Image from "next/image";

const ServiceCard9 = ({ service, idx, lastItemIdx }) => {
	const {
		title,
		description,
		id,
		image,
		iconName,
	} = service || {};

	const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";
	const imageUrl = image?.[0] ? `${cmsBaseUrl}${image[0]}` : null;

	return (
		<div className="service-item h8-service-item h-100">
			<div className="service-icon">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt={title || "Service"}
						width={60}
						height={60}
						style={{ objectFit: "contain" }}
					/>
				) : (
					<i className={iconName || "tji-box"}></i>
				)}
			</div>
			<h4 className="title">
				{title}
			</h4>
			<div className="service-content">
				{description ? (
					<>
						<style>{`
							.desc-html ul { list-style-type: disc !important; padding-left: 1.25rem !important; margin-bottom: 1rem; }
							.desc-html ol { list-style-type: decimal !important; padding-left: 1.25rem !important; margin-bottom: 1rem; }
							.desc-html li { display: list-item !important; margin-bottom: 0.25rem; }
							.desc-html p { margin-bottom: 0.5rem; }
						`}</style>
						<div
							className="desc-html text-justify"
							dangerouslySetInnerHTML={{ __html: description }}
						/>
					</>
				) : (
					<>
						<p className="desc">
							Through a combination of data-driven insights and innovative
							approaches, we work closely with you to develop customized.
						</p>
						<ul className="list-items">
							<li>
								<i className="tji-list"></i>Expansion Strategies
							</li>
							<li>
								<i className="tji-list"></i>Operational Efficiency
							</li>
							<li>
								<i className="tji-list"></i>Competitive Edge
							</li>
						</ul>
					</>
				)}
			</div>
		</div>
	);
};

export default ServiceCard9;
