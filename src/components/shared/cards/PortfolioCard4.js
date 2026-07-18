import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const PortfolioCard4 = ({ portfolio }) => {
	const {
		title = "Event Management Platform",
		img4 = "/images/project/project-4.webp",
		shortDesc,
		id,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};

	const [imageSrc, setImageSrc] = useState(img4);

	useEffect(() => {
		setImageSrc(img4);
	}, [img4]);

	return (
		<div className="project-item h4-project-item">
			<div className="project-content">
				{/* <span className="categories">
					<Link href={`/portfolios/${id}`}>{category}</Link>
				</span> */}
				<div className="project-text">
					<h4 className="title">
						<Link href={`/portfolios/${id}`}>{title}</Link>
					</h4>
					<Link className="tji-icon-btn" href={`/portfolios/${id}`} aria-label={`Read more about ${title}`}>
						<i className="tji-arrow-right-long"></i>
					</Link>
				</div>
			</div>
			<div className="project-img" style={{ position: "relative", width: "100%", height: "300px" }}>
				<Image 
					src={imageSrc} 
					alt="Image" 
					fill 
					style={{ objectFit: "cover" }} 
					onError={() => {
						setImageSrc("/images/project/project-4.webp");
					}}
				/>
			</div>
		</div>
	);
};

export default PortfolioCard4;
