"use client";
import getNavItems from "@/libs/getNavItems";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenuItem from "./MobileMenuItem";

const MobileNavbar = () => {
	const navItems = getNavItems();
	const serviceNav = navItems[2] || { name: "Services", path: "/services" };
	const blogNav = navItems[4] || { name: "Blog", path: "/blogs" };
	const contactNav = navItems[5] || { name: "Contact", path: "/contact" };

	const [categories, setCategories] = useState([]);
	const [dynamicServices, setDynamicServices] = useState([]);
	const [hiddenPages, setHiddenPages] = useState({});
	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

	useEffect(() => {
		// Fetch categories for dropdown
		fetch(`${API_URL}/api/data/categories`)
			.then((r) => r.json())
			.then((json) => { if (json.success) setCategories(json.data); })
			.catch(() => { });

		// Fetch services for dropdown
		fetch(`${API_URL}/api/data/service`)
			.then((r) => r.json())
			.then((json) => { if (json.success && Array.isArray(json.data)) setDynamicServices(json.data); })
			.catch(() => { });

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

	return (
		<div className="hamburger_menu">
			<div className="mobile_menu mean-container">
				<div className="mean-bar">
					<Link
						href="#nav"
						className="meanmenu-reveal"
						style={{ right: 0, left: "auto" }}
						aria-label="Toggle navigation menu"
					>
						<span><span><span></span></span></span>
					</Link>

					<nav className="mean-nav">
						<ul>
							{/* ── Home ── */}
							<li>
								<Link href="/">Home</Link>
							</li>

							{/* ── About Us ── */}
							{!hiddenPages['about-us'] && (
								<li>
									<Link href="/about-us">About Us</Link>
								</li>
							)}

							{/* ── Products ── */}
							<li>
								<Link href="/products">Products</Link>
							</li>

							{/* ── Services (dynamic dropdown) ── */}
							<MobileMenuItem
								text={serviceNav.name}
								url={serviceNav.path}
								submenuClass="mega-menu-service"
							>
								{(dynamicServices.length
									? dynamicServices
									: serviceNav.submenu || []
								).map((item, idx) => (
									<li key={item.id ?? idx}>
										<Link
											className="mega-menu-service-single"
											href={item.slug ? `/services/${item.slug}` : (item.path || "/")}
										>
											<span className="mega-menu-service-icon">
												{item.icon_image ? (
													// eslint-disable-next-line @next/next/no-img-element
													<img
														src={
															item.icon_image.startsWith("http")
																? item.icon_image
																: `${API_URL}${item.icon_image}`
														}
														alt={item.title || item.name}
														style={{ width: 24, height: 24, objectFit: "contain" }}
													/>
												) : (
													<i className={item.icon || "tji-service-1"}></i>
												)}
											</span>
											<span className="mega-menu-service-title">
												{item.title || item.name || "Service"}
											</span>
											<span className="mega-menu-service-nav">
												<i className="tji-arrow-right-long"></i>
												<i className="tji-arrow-right-long"></i>
											</span>
										</Link>
									</li>
								))}
							</MobileMenuItem>

							{/* ── Categories (dynamic dropdown) ── */}
							<MobileMenuItem text="Categories" url="/categories">
								{categories.map((cat) => (
									<li key={cat.id}>
										<Link href={`/categories?category=${cat.category_slug}`}>
											{cat.category_name}
										</Link>
									</li>
								))}
							</MobileMenuItem>

							{/* ── Excellence & Reach (static dropdown) ── */}
							{(!hiddenPages['global-presence'] || !hiddenPages['quality-certification'] || !hiddenPages['manufacturing-infrastructure'] || !hiddenPages['industry-solutions'] || !hiddenPages['events'] || !hiddenPages['downloads']) && (
								<MobileMenuItem text="Excellence & Reach" url="#">
									{!hiddenPages['global-presence'] && <li><Link href="/global-presence">Global Presence</Link></li>}
									{!hiddenPages['quality-certification'] && <li><Link href="/quality-certification">Quality & Certifications</Link></li>}
									{!hiddenPages['manufacturing-infrastructure'] && <li><Link href="/manufacturing-infrastructure">Plant & Infrastructure</Link></li>}
									{!hiddenPages['industry-solutions'] && <li><Link href="/industry-solutions">Industry Solutions</Link></li>}
									{!hiddenPages['events'] && <li><Link href="/events">Our Events</Link></li>}
									{!hiddenPages['downloads'] && <li><Link href="/downloads">Our Resources</Link></li>}
								</MobileMenuItem>
							)}

							{/* ── Blog ── */}
							{!hiddenPages['blogs'] && (
								<li>
									<Link href="/blogs">{blogNav.name}</Link>
								</li>
							)}

							{/* ── Contact ── */}
							<li className="mean-last">
								<Link href={contactNav.path || "/contact"}>
									{contactNav.name || "Contact"}
								</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default MobileNavbar;
