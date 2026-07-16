"use client";
import { useState, useEffect } from "react";
import CareerCard from "@/components/shared/cards/CareerCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";

const Careers1 = () => {
	const [items, setItems] = useState([]);

	useEffect(() => {
		const fetchCareers = async () => {
			try {
				const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
				const cmsBase = process.env.CMS_BASE_URL || "http://localhost:3012";

				const res = await fetch(`${baseUrl}/api/data/career-info`);
				const json = await res.json();

				if (json.success && json.data) {
					const mappedData = json.data.map((item) => {
						// Process image URL handling both relative and absolute paths
						const rawImg = Array.isArray(item.image) ? item.image[0] : item.image;
						const img = rawImg?.startsWith("/uploads/") ? `${cmsBase}${rawImg}` : rawImg;

						const rawHoverImg = Array.isArray(item.hover_image) ? item.hover_image[0] : item.hover_image;
						const hover_img = rawHoverImg?.startsWith("/uploads/") ? `${cmsBase}${rawHoverImg}` : rawHoverImg;

						return {
							...item,
							img,
							hover_img,
							salary: item.salary_,
							category: item.duration || "Consulting",
							tags: [
								...(item.isurgent ? [{ label: "Urgent" }] : []),
								...(item.onsite ? [{ label: "Onsite" }] : []),
								...(item.remote ? [{ label: "Remote" }] : []),
							],
							// iconName: "tji-manage", // Removed to prioritize image display
						};
					});
					setItems(mappedData);
				}
			} catch (error) {
				console.error("Error fetching dynamic career data:", error);
			}
		};
		fetchCareers();
	}, []);

	const limit = 6;
	// get pagination details
	const {
		currentItems,
		currentpage,
		setCurrentpage,
		paginationItems,
		currentPaginationItems,
		totalPages,
		handleCurrentPage,
		firstItem,
		lastItem,
	} = usePagination(items, limit);
	const totalPortfolios = items?.length;
	const totalPortfoliosToShow = currentItems?.length;
	return (
		<section className="tj-careers-section section-gap">
			<div className="container">
				<div className="row rg-30">
					{currentItems?.length
						? currentItems?.map((careerSingle, idx) => (
							<div className="col-xl-4 col-md-6" key={idx}>
								<CareerCard key={idx} careerSingle={careerSingle} idx={idx} />
							</div>
						))
						: ""}
				</div>
				{/* <!-- post pagination --> */}
				{totalPortfoliosToShow < totalPortfolios ? (
					<Paginations
						paginationDetails={{
							currentItems,
							currentpage,
							setCurrentpage,
							paginationItems,
							currentPaginationItems,
							totalPages,
							handleCurrentPage,
							firstItem,
							lastItem,
						}}
					/>
				) : (
					""
				)}
			</div>
		</section>
	);
};

export default Careers1;
