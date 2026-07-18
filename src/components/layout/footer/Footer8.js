import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";
import Link from "next/link";
import LazyMap from "@/components/shared/LazyMap";
import Image from "next/image";

const Footer8 = async () => {
	const cmsBase = getCmsBase();
	let footerData = null;
	let productsData = [];
	let contactMapUrl = null;
	try {
		const [resFooter, resProducts, resContact] = await Promise.all([
			fetch(`${cmsBase}/api/data/footer`, { next: { revalidate: 60 } }),
			fetch(`${cmsBase}/api/data/our_products`, { next: { revalidate: 60 } }),
			fetch(`${cmsBase}/api/data/contactus?fields=mapurl`, { next: { revalidate: 60 } })
		]);
		if (resFooter.ok) {
			const json = await resFooter.json();
			if (json.success && json.data?.length > 0) {
				footerData = json.data[0];
			}
		}
		if (resProducts.ok) {
			const json = await resProducts.json();
			if (json.success && Array.isArray(json.data)) {
				productsData = json.data.slice(0, 6);
			}
		}
		if (resContact.ok) {
			const json = await resContact.json();
			let mapurl = json.data[0].mapurl;

			if (mapurl) {
				if (typeof mapurl === 'string' && mapurl.includes("<iframe")) {
					// Extract src from iframe HTML string
					const iframeMatch = mapurl.match(/<iframe.*?src="([^"]+)"/);
					if (iframeMatch?.[1]) {
						contactMapUrl = iframeMatch[1];
					}
				} else if (
					mapurl.includes("google.com/maps/embed") ||
					mapurl.includes("maps.google.com")
				) {
					// Already a valid embed URL
					contactMapUrl = mapurl;
				} else if (
					mapurl.includes("maps.app.goo.gl") ||
					mapurl.includes("goo.gl/maps")
				) {
					// Try to resolve the short URL to extract the location for embedding
					try {
						const mapRes = await fetch(mapurl, { method: 'HEAD', redirect: 'follow', next: { revalidate: 86400 } });
						const expandedUrl = mapRes.url;

						const pathMatch = expandedUrl.match(/\/place\/([^\/]+)/);
						const coordsMatch = expandedUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);

						let query = "";
						if (pathMatch && pathMatch[1]) {
							query = pathMatch[1];
						} else if (coordsMatch) {
							query = `${coordsMatch[1]},${coordsMatch[2]}`;
						}

						if (query) {
							contactMapUrl = `https://maps.google.com/maps?q=${query}&output=embed`;
							console.log(`[Footer8] Resolved short map URL to query: ${query}`);
						} else {
							contactMapUrl = null;
							console.warn("[Footer8] Could not extract location from expanded map URL:", expandedUrl);
						}
					} catch (err) {
						contactMapUrl = null; // Will show "Map not available"
						console.warn("[Footer8] Failed to resolve short Google Maps URL:", mapurl, err.message);
					}
				} else {
					contactMapUrl = mapurl;
				}
			}
		}
	} catch (err) {
		console.error("[Footer8] Failed to fetch footer data:", err?.message);
	}

	const rawLogoUrl = footerData?.logo?.[0];
	const logoUrl = resolveCmsImage(rawLogoUrl) || "/images/logos/logo-large.webp";
	const description = footerData?.description || "Developing personalze our customer journeys to increase satisfaction & loyalty of our expansion. CROWN Packaging has been a game.";
	const address = footerData?.address || "993 Renner Burg, West Rond, MT 94251-030, USA.";
	const mobile = footerData?.mobile || "+1 (009) 544-7818";
	const email = footerData?.email || "support@CROWN Packaging.com";

	const facebook = footerData?.facebook || "https://www.facebook.com/";
	const instagram = footerData?.instagram || "https://www.instagram.com/";
	const twitter = footerData?.twitter || "https://x.com/";
	const linkedin = footerData?.linkedin || "https://www.linkedin.com/";

	return (
		<footer className="tj-footer-section footer-2 h5-footer  h6-footer  h8-footer section-gap-x footer-section-wrapper" style={{ position: "relative", overflow: "hidden" }}>
			<style dangerouslySetInnerHTML={{
				__html: `
				.h8-footer, .h8-footer p, .h8-footer a, .h8-footer h5.title, .h8-footer li a, .h8-footer span {
					color: var(--tj-color-text-body-5) !important;
				}
				.h8-footer a:hover, .h8-footer li a:hover {
					color: var(--tj-color-theme-primary) !important;
				}
				.footer-section-wrapper {
					margin-top: 50px !important;
				}
			`}} />
			<div className="h6-footer-logo-area ">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="h8-footer-logo-wrapper">
								<div className="h6-footer-logo h8-footer-logo">
									<Link
										href="/"
										prefetch={false}
										className="wow fadeInLeftBig"
										data-wow-delay=".3s"
									>
										<Image src={logoUrl} alt="Logo" width={140} height={75} style={{ height: "auto" }} />
									</Link>
								</div>
								<div
									className="h8-footer-logo-content wow fadeInRightBig"
									data-wow-delay=".4s"
								>
									<div className="footer-text">
										<p>{description}</p>
									</div>
									<div className="social-links style-3">
										<ul>
											<li>
												<Link href={facebook} target="_blank" aria-label="Facebook">
													<i className="fa-brands fa-facebook-f"></i>
												</Link>
											</li>
											<li>
												<Link href={instagram} target="_blank" aria-label="Instagram">
													<i className="fa-brands fa-instagram"></i>
												</Link>
											</li>
											<li>
												<Link href={twitter} target="_blank" aria-label="Twitter">
													<i className="fa-brands fa-x-twitter"></i>
												</Link>
											</li>
											<li>
												<Link href={linkedin} target="_blank" aria-label="LinkedIn">
													<i className="fa-brands fa-linkedin-in"></i>
												</Link>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="footer-main-area h8-footer-main">
				<div className="container">
					<div className="row justify-content-between">
						<div className="col-xl-3 col-lg-3  col-md-6">
							<div
								className="footer-widget widget-contact h6-footer-contact h8-footer-contact wow fadeInUp"
								data-wow-delay=".3s"
							>
								<h5 className="title">Our Office</h5>
								<div className="footer-contact-info">
									<div className="contact-item">
										<span>{address}</span>
									</div>
									<div className="contact-item">
										<Link href={`tel:${mobile.replace(/[^0-9+]/g, '')}`}>P: {mobile}</Link>
										<Link href={`mailto:${email}`}>
											M: {email}
										</Link>
									</div>
									{/* <div className="contact-item">
										<span>
											<i className="tji-clock"></i> Mon-Fri 10am-10pm
										</span>
									</div> */}
								</div>
							</div>
						</div>
						<div className="col-xl-3  col-lg-3 col-md-6">
							<div
								className="footer-widget footer-col-2 widget-nav-menu h6-footer-col-2  h8-footer-col-2 wow fadeInUp"
								data-wow-delay=".4s"
							>
								<h5 className="title">Our Products</h5>
								<ul>
									{productsData.length > 0 ? (
										productsData.map((product) => (
											<li key={product.id}>
												<Link href={`/${product.slug}`} prefetch={false}>{product.name}</Link>
											</li>
										))
									) : (
										<>
											<li><Link href="/products" prefetch={false}>View All Products</Link></li>
										</>
									)}
								</ul>
							</div>
						</div>
						<div className="col-xl-2 col-lg-2 col-md-6">
							<div
								className="footer-widget footer-col-3 widget-nav-menu h6-footer-col-3  h8-footer-col-3 wow fadeInUp"
								data-wow-delay=".5s"
							>
								<h5 className="title">Resources</h5>
								<ul>
									<li><Link href="/" prefetch={false}>Home</Link></li>
									<li><Link href="/about-us" prefetch={false}>About Us</Link></li>
									<li><Link href="/products" prefetch={false}>Products</Link></li>
									<li><Link href="/categories" prefetch={false}>Categories</Link></li>
									<li><Link href="/blogs" prefetch={false}>Blogs</Link></li>
									<li><Link href="/contact" prefetch={false}>Contact</Link></li>
								</ul>
							</div>
						</div>
						<div className="col-xl-4 col-lg-4 col-md-6">
							<div
								className="footer-widget widget-subscribe h6-footer-subscribe h8-footer-subscribe wow fadeInUp"
								data-wow-delay=".6s"
							>
								<h5 className="title">
									Find Us Here
								</h5>
								<div className="footer-map" style={{ borderRadius: '10px', overflow: 'hidden' }}>
									{contactMapUrl ? (
										<LazyMap
											src={contactMapUrl}
											width="100%"
											height="220px"
											style={{ border: 0, borderRadius: '10px' }}
											allowFullScreen=""
											loading="lazy"
											referrerPolicy="no-referrer-when-downgrade"
										/>
									) : (
										<div style={{ width: '100%', height: '220px', background: '#e9ecef', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
											<p style={{ color: '#6c757d' }}>Map not available</p>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="tj-copyright-area-2 h5-footer-copyright h8-footer-copyright">
				<div className="container">
					<div className="row">
						<div className="col-12">
							<div className="copyright-content-area">
								<div className="copyright-text">
									<p>
										&copy; {new Date().getFullYear()}{" "}
										<Link
											href="#"
											prefetch={false}
										>
											CROWN PACKAGING
										</Link>{" "}
										All right reserved
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Top Left Shadow */}
			<div
				style={{
					position: "absolute",
					top: "-200px",
					left: "-200px",
					width: "600px",
					height: "600px",
					background: "radial-gradient(circle, color-mix(in srgb, var(--tj-color-theme-primary) 40%, transparent) 0%, transparent 70%)",
					filter: "blur(60px)",
					pointerEvents: "none",
					zIndex: 1,
				}}
			/>
			{/* Bottom Right Shadow */}
			<div
				style={{
					position: "absolute",
					bottom: "-200px",
					right: "-200px",
					width: "600px",
					height: "600px",
					background: "radial-gradient(circle, color-mix(in srgb, var(--tj-color-theme-primary) 40%, transparent) 0%, transparent 70%)",
					filter: "blur(60px)",
					pointerEvents: "none",
					zIndex: 1,
				}}
			/>
		</footer>
	);
};

export default Footer8;
