

const PortfolioCard6 = ({
	portfolio,
	idx,
	handleCurrentIndex,
	currentIndex,
}) => {
	const {
		title = "Event Management Platform",
		img6 = "/images/project/h6-project-1.webp",
		shortDesc,
		id,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};
	return (
		<div
			className={`project-item h6-project-item ${
				currentIndex === idx ? "active" : ""
			}`}
			onMouseEnter={() => handleCurrentIndex(idx)}
		>
			<div
				className="project-item-inner h6-project-item-inner"
				style={{ backgroundImage: `url("${img6}")` }}
			>
				<div className="project-content">
					<span className="categories">
						<span className="border border-dashed px-3 py-[0.5px] bg-transparent text-white rounded-sm">{category}</span>
					</span>
					<div className="project-text">
						<h3 className="title">
						{title}
						</h3>
						{/* <Link className="project-btn" href={`/portfolios/${id}`}>
							<i className="tji-arrow-right-long"></i>
						</Link> */}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PortfolioCard6;
