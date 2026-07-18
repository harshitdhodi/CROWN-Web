"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import TeamCard from "@/components/shared/cards/TeamCard";
import Paginations from "@/components/shared/others/Paginations";
import usePagination from "@/hooks/usePagination";
import { usePathname } from "next/navigation";

const Team1Client = ({ type, initialItems, heading }) => {
	const pathname = usePathname();
	const isGlobalPresencePage = pathname === "/global-presence";
	const items = initialItems || [];

	const limit = type === 2 ? 8 : 4;
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
	return (
		<section
			className={` ${type === 2
				? " section-gap"
				: type === 4
					? "tj-team-section-3 tj-working-process section-gap-x"
					: " tj-working-process"
				}`}
			style={type === 3 ? { backgroundColor: "var(--tj-color-theme-white)", position: "relative", overflow: "hidden" } : undefined}
		>
			<div className="container section-gap">
				{type !== 2 && (
					<div className="row">
						<div className="col-12">
							<div className={`sec-heading text-center ${type === 3 ? "" : "style-2"}`}>
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i>
									{heading?.tagline || "Meet Our Team"}
								</span>
								{type === 3 ? (
									<h2 key={heading?.heading ? "loaded" : "loading"}>
										{heading?.heading || <>Success <span>Stories</span> Fuel our Innovation.</>}
									</h2>
								) : (
									<h2 className={`sec-title ${type === 2 ? "title-anim" : "text-anim"}`} key={heading?.heading ? "loaded" : "loading"}>
										{heading?.heading || <>People Behind <span>CROWN Packaging.</span></>}
									</h2>
								)}
							</div>
						</div>
					</div>
				)}

				<div className="row leftSwipeWrap">
					{currentItems?.length
						? currentItems.map((item, idx) => (
							<div key={idx} className="col-lg-3 col-sm-6 mb-4 mb-lg-0">
								<TeamCard teamMember={item} />
							</div>
						))
						: ""}
				</div>

				{type === 2 && totalItemsToShow < totalItems ? (
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
			{/* Background shapes consistent with Team3 and Team4 styles */}
			{type === 3 && (
				<div
					style={{
						position: "absolute",
						top: "-100px",
						left: "-100px",
						width: "500px",
						height: "500px",
						background: "radial-gradient(circle, color-mix(in srgb, var(--tj-color-theme-primary) 25%, transparent) 0%, transparent 70%)",
						filter: "blur(40px)",
						pointerEvents: "none",
						zIndex: 0,
					}}
				/>
			)}
		</section>
	);
};

export default Team1Client;
