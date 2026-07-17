"use client";
import Image from "next/image";
import Link from "next/link";
import MobileNavbar from "./MobileNavbar";
import { useEffect, useState } from "react";

const MobileMenu = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
	const [logoUrl, setLogoUrl] = useState("/images/logos/logo-2.webp");
	const [contactInfo, setContactInfo] = useState({
		phone: "",
		email: "",
		address: "",
		facebook: "",
		instagram: "",
		twitter: "",
		linkedin: "",
	});

	useEffect(() => {
		const cmsBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";
		fetch(`${cmsBase}/api/data/footer`)
			.then(res => res.json())
			.then(json => {
				if (json.success && json.data?.length > 0) {
					const d = json.data[0];

					// Logo
					if (d.headerlogo?.[0]) {
						const rawLogo = d.headerlogo[0];
						setLogoUrl(rawLogo.startsWith("/") ? `${cmsBase}${rawLogo}` : rawLogo);
					}

					// Contact info & socials
					setContactInfo({
						phone:     d.mobile   || "",
						email:     d.email    || "",
						address:   d.address  || "",
						facebook:  d.facebook  || "https://www.facebook.com/",
						instagram: d.instagram || "https://www.instagram.com/",
						twitter:   d.twitter   || "https://x.com/",
						linkedin:  d.linkedin  || "https://www.linkedin.com/",
					});
				}
			})
			.catch(err => console.error("Failed to fetch footer data:", err));
	}, []);

	const handleClick = () => {
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			<div
				className={`body-overlay ${isMobileMenuOpen ? "opened" : ""}`}
				onClick={handleClick}
			></div>
			<div
				className={`hamburger-area d-lg-none ${isMobileMenuOpen ? "opened" : ""}`}
			>
				<div className="hamburger_bg"></div>
				<div className="hamburger_wrapper">
					<div className="hamburger_inner">
						{/* Logo + Close */}
						<div className="hamburger_top d-flex align-items-center justify-content-between">
							<div className="hamburger_logo">
								<Link href="/" className="mobile_logo" onClick={handleClick}>
									<Image
										src={logoUrl}
										alt="Logo"
										width={136}
										height={45}
										style={{ height: "auto", width: "100%" }}
									/>
								</Link>
							</div>
							<div className="hamburger_close">
								<button className="hamburger_close_btn" onClick={handleClick} aria-label="Close menu">
									<i className="fa-thin fa-times"></i>
								</button>
							</div>
						</div>

						{/* Nav links */}
						<MobileNavbar />

						{/* Contact Info */}
						<div className="hamburger-infos">
							<h5 className="hamburger-title">Contact Info</h5>
							<div className="contact-info">
								{contactInfo.phone && (
									<div className="contact-item">
										<span className="subtitle">Phone</span>
										<Link
											className="contact-link"
											href={`tel:${contactInfo.phone.replace(/[^0-9+]/g, "")}`}
										>
											{contactInfo.phone}
										</Link>
									</div>
								)}
								{contactInfo.email && (
									<div className="contact-item">
										<span className="subtitle">Email</span>
										<Link
											className="contact-link"
											href={`mailto:${contactInfo.email}`}
										>
											{contactInfo.email}
										</Link>
									</div>
								)}
								{contactInfo.address && (
									<div className="contact-item">
										<span className="subtitle">Location</span>
										<span className="contact-link">{contactInfo.address}</span>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Social Links */}
					<div className="hamburger-socials">
						<h5 className="hamburger-title">Follow Us</h5>
						<div className="social-links style-3">
							<ul>
								{contactInfo.facebook && (
									<li>
										<Link href={contactInfo.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
											<i className="fa-brands fa-facebook-f"></i>
										</Link>
									</li>
								)}
								{contactInfo.instagram && (
									<li>
										<Link href={contactInfo.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
											<i className="fa-brands fa-instagram"></i>
										</Link>
									</li>
								)}
								{contactInfo.twitter && (
									<li>
										<Link href={contactInfo.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
											<i className="fa-brands fa-x-twitter"></i>
										</Link>
									</li>
								)}
								{contactInfo.linkedin && (
									<li>
										<Link href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
											<i className="fa-brands fa-linkedin-in"></i>
										</Link>
									</li>
								)}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default MobileMenu;
