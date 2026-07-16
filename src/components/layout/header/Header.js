"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import useIsSticky from "@/hooks/useIsSticky";
import Link from "next/link";
import { useState } from "react";
import ContactMenu from "./ContactMenu";
import HeaderTop from "./HeaderTop";
import Logo from "./Logo";
import MobileMenu from "./MobileMenu";
import Navbar from "./Navbar";

const Header = ({
	headerType = 1,
	isHeaderTop = false,
	topbarType = 1,
	isStickyHeader = false,
}) => {
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isContactOpen, setIsContactOpen] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const isSticky = useIsSticky(true);

	const handleContactTogglerClick = () => {
		setIsContactOpen(true);
	};
	const handleMobileTogglerClick = () => {
		setIsMobileMenuOpen(true);
	};

	// Return null for the duplicate sticky headers on existing pages to avoid double rendering
	if (isStickyHeader) return null;

	const renderHeaderElement = (isStickyMode) => {
		const headerClass =
			headerType === 10
				? "header-3 h10-header"
				: headerType === 9
					? isStickyMode
						? "header-3"
						: "h9-header"
					: headerType === 8
						? "header-1 h8-header"
						: headerType === 7
							? "header-2 h7-header"
							: headerType === 6
								? "header-1 h6-header"
								: headerType === 5
									? `header-2 ${isStickyMode ? "" : "header-5"}`
									: headerType === 3
										? "header-3"
										: headerType === 2
											? "header-2"
											: "header-1";

		const positionClass = isStickyMode
			? `header-duplicate header-sticky ${isSticky ? "sticky" : ""}`
			: "header-absolute";

		return (
			<header className={`header-area ${headerClass}  section-gap-x ${positionClass}`}>
				{isHeaderTop && !isStickyMode && <HeaderTop type={topbarType} />}
				{headerType === 8 && !isStickyMode ? (
					<div className="h8-header-mainmenu-bg-shape"></div>
				) : (
					""
				)}
				<div className="container-fluid">
					<div className="row">
						<div className="col-12">
							<div className="header-wrapper flex items-center w-full">
								{/* <!-- site logo --> */}
								<Logo headerType={headerType} isStickyHeader={isStickyMode} isSticky={isSticky} />

								{/* <!-- navigation (centered) --> */}
								<div className="flex-1 flex justify-center">
									<Navbar />
								</div>

								{/* <!-- header right: CTA button + mobile toggler --> */}
								<div className="flex items-center gap-4">
									{/* CTA button — desktop only */}
									<div className="header-button d-none d-lg-inline-flex">
										<ButtonPrimary text={"Get a Quote"} url={"/contact"} />
									</div>
									{/* <!-- menu bar (mobile) --> */}
									<div
										className="menu_bar mobile_menu_bar d-lg-none"
										onClick={handleMobileTogglerClick}
									>
										<span></span>
										<span></span>
										<span></span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* <!-- Search Popup --> */}
				{/* <div className={`search_popup ${isSearchOpen ? "search-opened" : ""}`}>
					<div className="container">
						<div className="row justify-content-center">
							<div className="col-8">
								<div className="tj_search_wrapper">
									<div className="search_form">
										<form action="#">
											<div className="search_input">
												<div className="search-box">
													<input
														className="search-form-input"
														type="text"
														placeholder="Type Words and Hit Enter"
														required
													/>
													<button type="submit">
														<i className="tji-search"></i>
													</button>
												</div>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div> */}
			</header>
		);
	};

	return (
		<>
			{/* <!-- start: Offcanvas Menu --> */}
			<ContactMenu
				isContactOpen={isContactOpen}
				setIsContactOpen={setIsContactOpen}
			/>
			{/* <!-- end: Offcanvas Menu --> */}

			{/* <!-- start: Offcanvas Menu --> */}
			<MobileMenu
				isMobileMenuOpen={isMobileMenuOpen}
				setIsMobileMenuOpen={setIsMobileMenuOpen}
			/>
			{/* <!-- end: Offcanvas Menu --> */}

			{/* Search Popup --> */}
			<div
				className={`search-popup-overlay ${isSearchOpen ? "search-popup-overlay-open" : ""
					}`}
				onClick={() => setIsSearchOpen(false)}
			></div>

			{/* Render absolute header */}
			{renderHeaderElement(false)}

			{/* Render sticky header */}
			{renderHeaderElement(true)}
		</>
	);
};

export default Header;