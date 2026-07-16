import makeWowDelay from "@/libs/makeWowDelay";
import Link from "next/link";



const   CareerCard = ({ careerSingle, idx }) => {
	const { title, iconName, salary, location, duration, category, tags, slug, img, hover_img } =
		careerSingle || {};

	return (
		<div
			className="tj-careers wow fadeInUp"
			data-wow-delay={makeWowDelay(idx, 0.1)}
		>
			<div className="tj-careers-icon mb-30">
				{img ? (
					<div className="career-icon-image">
						<img src={img} alt={title} className="main-img" />
						{hover_img && <img src={hover_img} alt={title} className="hover-img" />}
					</div>
				) : (
					<i className={iconName ? iconName : "tji-strategy"}></i>
				)}
			</div>
			<div className="tj-careers-tag">
				{tags && tags.length > 0 ? (
					tags.map((tag, idx) => (
						<span key={idx} className={tag.label === "Urgent" ? "urgent-tag" : tag.label === "Remote" ? "remote-tag" : "onsite-tag"}>
							{tag.label}
						</span>
					))
				) : (
					<span>{category}</span>
				)}
			</div>
			<h4 className="tj-careers-title">
				<Link href={`/careers/${slug}`}>{title}</Link>
			</h4>
			<div className="tj-careers-salary">
				<span>${salary?.toLocaleString()}</span> / {duration}
			</div>
			<div className="tj-careers-bottom">
				<span className="location">
					<i className="tji-location"></i>
					{location}
				</span>
				<Link href={`/careers/${slug}`} className="tj-careers-btn">
					<div className="btn-text">
						<span>Apply now</span>
					</div>
					<span className="btn-icon">
						<i className="tji-arrow-right"></i>
						<i className="tji-arrow-right"></i>
					</span>
				</Link>
			</div>

			<style jsx>{`
    .career-icon-image {
        position: relative;
        display: inline-block;
    }
    .career-icon-image img {
        display: block;
        width: 60px;
        height: 60px;
        object-fit: contain;
        transition: opacity 0.3s ease;
    }
    .career-icon-image .hover-img {
        position: absolute;
        top: 0;
        left: 0;
        opacity: 0;
    }
    .tj-careers:hover .main-img {
        opacity: 0;
    }
    .tj-careers:hover .hover-img {
        opacity: 1;
    }
`}</style>
		</div>
	);
};

export default CareerCard;
