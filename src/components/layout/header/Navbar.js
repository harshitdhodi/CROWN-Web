"use client";
import useActiveLink from "@/hooks/useActiveLink";
import getNavItems from "@/libs/getNavItems";
import "@/libs/i18n";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const Navbar = ({ headerType, isStickyHeader }) => {
	const { t } = useTranslation();
	const makeActiveLink = useActiveLink();
	const navItems = getNavItems();
	const homeNav = makeActiveLink(navItems[0] || { name: "Home", path: "/" });
	const pagesNav = makeActiveLink(navItems[1] || { name: "Pages", path: "#" });
	const serviceNav = makeActiveLink(navItems[2] || { name: "Services", path: "/services" });
	const portfolioNav = makeActiveLink(navItems[3] || { name: "Portfolio", path: "/portfolios" });
	const blogNav = makeActiveLink(navItems[4] || { name: "Blogs", path: "/blogs" });
	const contactNav = makeActiveLink(navItems[5] || { name: "Contact Us", path: "/contact" });

	const [categories, setCategories] = useState([]);
	const [dynamicServices, setDynamicServices] = useState([]);
	const [products, setProducts] = useState([]);
	const [hiddenPages, setHiddenPages] = useState({});
	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

	useEffect(() => {
		// Fetch categories
		fetch(`${API_URL}/api/data/categories`)
			.then((res) => res.json())
			.then((json) => { if (json.success) setCategories(json.data); })
			.catch(() => setCategories([]));

		// Fetch services for the mega-menu dropdown
		fetch(`${API_URL}/api/data/service`)
			.then((res) => res.json())
			.then((json) => { if (json.success && Array.isArray(json.data)) setDynamicServices(json.data); })
			.catch(() => setDynamicServices([]));

		// Fetch products for the categories mega-menu
		fetch(`${API_URL}/api/data/our_products`)
			.then((res) => res.json())
			.then((json) => { if (json.success && Array.isArray(json.data)) setProducts(json.data); })
			.catch(() => setProducts([]));

		// Fetch page visibility
		fetch(`${API_URL}/api/page-visibility`)
			.then((res) => {
				if (!res.ok) {
					console.warn('Page visibility API returned', res.status);
					return null;
				}
				return res.json();
			})
			.then((json) => {
				if (json && json.success && Array.isArray(json.data)) {
					const hiddenMap = {};
					json.data.forEach(page => {
						if (page.is_hidden) {
							hiddenMap[page.key] = true;
						}
					});
					setHiddenPages(hiddenMap);
				}
			})
			.catch((err) => {
				console.warn('Failed to fetch page visibility:', err.message);
				setHiddenPages({});
			});
	}, []);

	const aboutPage = navItems.find(item => item.name === "About Us");
	const aboutNav = makeActiveLink(aboutPage || { name: "About Us", path: "/about-us" });
	return (
		<div className="menu-area d-none d-lg-inline-flex align-items-center">
			<nav id="mobile-menu" className="mainmenu">
				<ul>
					{!hiddenPages['about-us'] && (
						<li
							className={` ${pagesNav?.isActive ? "current-menu-ancestor" : ""
								}`}
						>
							<Link href="about-us" prefetch={false}>{t("About Us")}</Link>
						</li>
					)}
					<li className="has-dropdown">
						<Link href={`/products`} prefetch={false}>
							Products
						</Link>
						<ul className="sub-menu mega-menu-service">
							{products?.map((product) => {
								const title = product.product_name || product.name || product.title;
								return (
									<li key={product.id}>
										<Link
											href={`/${product.slug || product.product_slug || product.id}`}
											prefetch={false}
											className="mega-menu-service-single"
										>
											<span className="mega-menu-service-title">
												{title}
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								);
							})}
						</ul>
					</li>

					{(!hiddenPages['global-presence'] || !hiddenPages['quality-certification'] || !hiddenPages['manufacturing-infrastructure'] || !hiddenPages['industry-solutions']) && (
						<li
							className={`has-dropdown ${pagesNav?.isActive ? "current-menu-ancestor" : ""
								}`}
						>
							<Link href="#" prefetch={false}>
								Excellence & Reach
							</Link>
							<ul className="sub-menu mega-menu-service">
								{!hiddenPages['global-presence'] && (
									<li>
										<Link className="mega-menu-service-single" href="/global-presence" prefetch={false}>
											<span className="mega-menu-service-icon">
												<i className="tji-worldwide"></i>
											</span>
											<span className="mega-menu-service-title">
												Global Presence
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								)}
								{!hiddenPages['quality-certification'] && (
									<li>
										<Link className="mega-menu-service-single" href="/quality-certification" prefetch={false}>
											<span className="mega-menu-service-icon">
												<i className="tji-excellence"></i>
											</span>
											<span className="mega-menu-service-title">
												Quality & Certifications
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								)}
								{!hiddenPages['manufacturing-infrastructure'] && (
									<li>
										<Link className="mega-menu-service-single" href="/manufacturing-infrastructure" prefetch={false}>
											<span className="mega-menu-service-icon">
												<i className="tji-process-1"></i>
											</span>
											<span className="mega-menu-service-title">
												Manufacturing & Infrastructure
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								)}
								{!hiddenPages['industry-solutions'] && (
									<li>
										<Link className="mega-menu-service-single" href="/industry-solutions" prefetch={false}>
											<span className="mega-menu-service-icon">
												<i className="tji-strategy"></i>
											</span>
											<span className="mega-menu-service-title">
												Industry Solutions
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								)}

							</ul>
						</li>
					)}
					{!hiddenPages['blogs'] && (
						<li
							className={`${blogNav?.isActive ? "current-menu-ancestor" : ""
								}`}
						>
							<Link href="/blogs" prefetch={false}>
								{/* {blogNav?.name} */}
								Blogs
							</Link>
						</li>
					)}
					<li className={contactNav?.isActive ? "current-menu-ancestor" : ""}>
						<Link href={contactNav?.path ? contactNav?.path : "#"} prefetch={false}>
							{/* {contactNav?.name ? contactNav?.name : "Contact Us"} */}
							Contact Us
						</Link>
					</li>
				</ul>
			</nav>
		</div>
	);
};

export default Navbar;
