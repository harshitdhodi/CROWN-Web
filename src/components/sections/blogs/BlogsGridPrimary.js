"use client";
import BlogCard1 from "@/components/shared/cards/BlogCard1";
import Paginations from "@/components/shared/others/Paginations";
import BlogSidebar from "@/components/shared/sidebar/BlogSidebar";
import usePagination from "@/hooks/usePagination";
import { useEffect } from "react";

const BlogsGridPrimary = ({ isSidebar = false, blogs = [] }) => {
	const items = blogs;
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
	const totalItems = items?.length;
	const totalItemsToShow = currentItems?.length;
	useEffect(() => {
		setCurrentpage(0);
	}, [totalItems]);

	useEffect(() => {
		if (typeof window === "undefined" || !currentItems?.length) return;

		const refreshAnimations = () => {
			window.dispatchEvent(new Event("resize"));

			if (window.ScrollTrigger) {
				window.ScrollTrigger.refresh();
			}

			if (window.WOW) {
				new window.WOW().init();
			}
		};

		// Execute multiple refreshes to handle images loading in the grid
		const timers = [
			setTimeout(refreshAnimations, 200),
			setTimeout(refreshAnimations, 800),
			setTimeout(refreshAnimations, 1500),
		];

		return () => timers.forEach((timer) => clearTimeout(timer));
	}, [currentItems]);

	return (
		<section className="tj-blog-section section-gap">
			<div className="container">
				<div className="row row-gap-5">
					<div className={isSidebar ? "col-lg-8" : "col-lg-12"}>
						<div className="row row-gap-4">
							{currentItems?.length
								? currentItems?.map((blog, idx) => (
										<div
											key={idx}
											className={`col-md-6 ${isSidebar ? "" : "col-xl-6"}`}
										>
											<BlogCard1 blog={blog} idx={idx} />
										</div>
								  ))
								: ""}
						</div>
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
							type={isSidebar ? 2 : 1}
						/>
					</div>
					{isSidebar ? (
						<div className="col-lg-4">
							<BlogSidebar type={2} />
						</div>
					) : (
						""
					)}
				</div>
			</div>
		</section>
	);
};

export default BlogsGridPrimary;
