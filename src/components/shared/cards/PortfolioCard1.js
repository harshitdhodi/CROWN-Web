import Link from "next/link";

const PortfolioCard1 = ({ portfolio }) => {
	const {
		title = "Event Management Platform",
		name, // New property for gallery API
		img = "/images/project/project-1.webp",
		image, // New property for gallery API
		shortDesc,
		id,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};

	const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";
	const displayTitle = name || title;
	const displayImg = image?.[0] ? `${cmsBaseUrl}${image[0]}` : img;

	return (
		<div className="project-item tj-arrange-item">
			<div
				className="project-img"
				style={{ backgroundImage: `url(${displayImg})` }}
			></div>
			<div className="project-content">

				<div className="project-text">
					<h4 className="title">
						{displayTitle}
					</h4>
				</div>
			</div>
		</div>
	);
};

export default PortfolioCard1;
