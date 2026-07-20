import Image from "next/image";
import Link from "next/link";



const PortfolioCard3 = ({ portfolio }) => {
	console.log("PortfolioCard3 received portfolio:", portfolio);
	const {
		title = "Event Management Platform",
		image,
		img,
		img3,
		shortDesc,
		slug,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};
	
	let imgSrc = image || img || img3;
	if (typeof imgSrc === 'string') {
		// The API might return http://localhost:3000 or 3001. 
		// We strip it to use a relative path so Next.js rewrites can proxy it to the CMS.
		imgSrc = imgSrc.replace(/^https?:\/\/localhost:300[01]/, "");
	}
	if (!imgSrc) {
		imgSrc = "/images/project/h5-project-1.webp";
	}
	return (
		<div className="project-item">
			<div className="project-img">
				<img
					src={imgSrc}
					alt={title}
					style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
				/>
			</div>
			<div className="project-content">
				<span className="categories">
					<Link href={`/${slug}`}>{category}</Link>
				</span>
				<div className="project-text">
					<h4 className="title">
						<Link href={`/${slug}`}>{title}</Link>
					</h4>
					<Link className="project-btn" href={`/${slug}`}>
						<i className="tji-arrow-right-big"></i>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PortfolioCard3;
