"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import MobileMenuItem from "./MobileMenuItem";

const MobileNavbar = () => {
	const [products, setProducts] = useState([]);
	const [hiddenPages, setHiddenPages] = useState({});
	const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

	useEffect(() => {
		// Fetch products for the Products dropdown
		fetch(`${API_URL}/api/data/our_products`)
			.then((r) => r.json())
			.then((json) => { if (json.success && Array.isArray(json.data)) setProducts(json.data); })
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

							{/* ── Products (dropdown) ── */}
							<MobileMenuItem text="Products" url="/products">
								{products.map((product) => {
									const title = product.product_name || product.name || product.title;
									return (
										<li key={product.id}>
											<Link href={`/${product.slug || product.product_slug || product.id}`}>
												{title}
											</Link>
										</li>
									);
								})}
							</MobileMenuItem>

							{/* ── Excellence & Reach (dropdown) ── */}
							{(!hiddenPages['global-presence'] || !hiddenPages['quality-certification'] || !hiddenPages['manufacturing-infrastructure'] || !hiddenPages['industry-solutions'] || !hiddenPages['events'] || !hiddenPages['downloads']) && (
								<MobileMenuItem text="Excellence & Reach" url="#">
									{!hiddenPages['global-presence'] && <li><Link href="/global-presence">Global Presence</Link></li>}
									{!hiddenPages['quality-certification'] && <li><Link href="/quality-certification">Quality &amp; Certifications</Link></li>}
									{!hiddenPages['manufacturing-infrastructure'] && <li><Link href="/manufacturing-infrastructure">Plant &amp; Infrastructure</Link></li>}
									{!hiddenPages['industry-solutions'] && <li><Link href="/industry-solutions">Industry Solutions</Link></li>}
									{!hiddenPages['events'] && <li><Link href="/events">Our Events</Link></li>}
									{!hiddenPages['downloads'] && <li><Link href="/downloads">Our Resources</Link></li>}
								</MobileMenuItem>
							)}

							{/* ── Blogs ── */}
							{!hiddenPages['blogs'] && (
								<li>
									<Link href="/blogs">Blogs</Link>
								</li>
							)}

							{/* ── Contact Us ── */}
							<li className="mean-last">
								<Link href="/contact">Contact Us</Link>
							</li>
						</ul>
					</nav>
				</div>
			</div>
		</div>
	);
};

export default MobileNavbar;
