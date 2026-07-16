import Link from "next/link";

const PortfolioCard10 = ({ portfolio }) => {
	const {
		title = "Event Management Platform",
		img8,
		slug,
		shortDesc,
		id,
		dataFilter,
		category = "Connect",
	} = portfolio ? portfolio : {};
	return (
		<div
			className={`project-item h4-project-item portfolio-filter-item ${dataFilter}`}
		>
			<div className="project-img" data-cursor-text="View Project">
				<Link href={`/portfolios/${id}`}>
					<img src={img8} alt="Image" />
				</Link>
			</div>
			<div className="project-content">
				<div className="project-text">
					<div className="flex gap-2 flex-col">
						<span className="categories border border-gray-400 px-2 w-fit text-sm py-1 rounded-md">
							{category}
						</span>
						<h4 className="title">
							<Link href={`${slug}`}>{title}</Link>
						</h4>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PortfolioCard10;
