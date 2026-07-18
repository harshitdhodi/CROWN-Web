"use client";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";

// Custom animated counter — counts up from 0 to target when scrolled into view
const AnimatedCounter = ({ target, suffix = "", format = (n) => n }) => {
	const [count, setCount] = useState(0);
	const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
	const rafRef = useRef(null);

	useEffect(() => {
		if (!inView) return;
		const duration = 1800; // ms
		const start = performance.now();
		const animate = (now) => {
			const elapsed = now - start;
			const progress = Math.min(elapsed / duration, 1);
			// Ease-out cubic
			const eased = 1 - Math.pow(1 - progress, 3);
			setCount(Math.round(eased * target));
			if (progress < 1) rafRef.current = requestAnimationFrame(animate);
		};
		rafRef.current = requestAnimationFrame(animate);
		return () => cancelAnimationFrame(rafRef.current);
	}, [inView, target]);

	return (
		<span ref={ref} style={{ display: "inline-flex", alignItems: "baseline", gap: "2px" }}>
			{format(count)}{suffix}
		</span>
	);
};

import { resolveCmsImage } from "@/lib/seoConfig";

const resolveApiImage = resolveCmsImage;

const parseAchievement = (val, defaultVal, defaultSuffix) => {
	if (!val) return { num: defaultVal, suffix: defaultSuffix };
	const str = String(val).trim();
	const numMatch = str.match(/^[\d,]+/);
	if (!numMatch) return { num: defaultVal, suffix: defaultSuffix };
	const numStr = numMatch[0];
	const num = Number(numStr.replace(/,/g, ""));
	const suffix = str.replace(numStr, "").trim();
	return { num, suffix: suffix || defaultSuffix };
};

const About9Client = ({ about }) => {
	const defaultAbout = {
		heading: "ABOUT OUR COMPANY",
		subheading: "Driven by Purpose, and Fueled by a Relentless Pursuit of Results and Client Real Success.",
		image: "/images/about/h10-about-banner.webp",
		team_leader: [
			"/images/testimonial/client-1.webp",
			"/images/testimonial/client-2.webp",
			"/images/testimonial/client-3.webp"
		],
		description: "Recognize that exceptional customer experiences are at the heart of every successful business. Our Customer Experience Solutions are crafted to help you transform every interaction.",
		acheivment1: "8",
		acheivment_text1: "Years Experience",
		acheivment2: "10",
		acheivment_text2: "Lakh+ Monthly Production Capacity",
		acheivment3: "10000",
		acheivment_text3: "Sq. Ft. Clean Room Facility",
	};

	const heading = about?.heading || defaultAbout.heading;
	const subheading = about?.subheading || defaultAbout.subheading;
	const image = about?.image || defaultAbout.image;
	const team_leader = about?.team_leader && about.team_leader.length > 0 ? about.team_leader : defaultAbout.team_leader;
	const description = about?.description || defaultAbout.description;
	const acheivment1 = about?.acheivment1 || defaultAbout.acheivment1;
	const acheivment_text1 = about?.acheivment_text1 || defaultAbout.acheivment_text1;
	const acheivment2 = about?.acheivment2 || defaultAbout.acheivment2;
	const acheivment_text2 = about?.acheivment_text2 || defaultAbout.acheivment_text2;
	const acheivment3 = about?.acheivment3 || defaultAbout.acheivment3;
	const acheivment_text3 = about?.acheivment_text3 || defaultAbout.acheivment_text3;

	const ach1 = parseAchievement(acheivment1, 7, "+");
	const ach2 = parseAchievement(acheivment2, 10, " Lakh+");
	const ach3 = parseAchievement(acheivment3, 10000, "+");

	const cardStyle = {
		background: "var(--tj-color-common-white, white)",
		padding: "22px 20px",
		borderRadius: "14px",
		border: "1px solid var(--tj-color-border-1, #eef3f3)",
		height: "100%",
		boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
		display: "flex",
		flexDirection: "column",
		gap: "10px",
	};

	const iconBadgeStyle = {
		width: "44px", height: "44px", borderRadius: "10px",
		background: "color-mix(in srgb, var(--tj-color-theme-primary) 12%, transparent)",
		display: "flex", alignItems: "center", justifyContent: "center",
	};

	const statStyle = {
		fontSize: "40px", fontWeight: "800", color: "var(--tj-color-theme-primary)", letterSpacing: "-1px"
	};

	const labelStyle = {
		fontSize: "13px", fontWeight: "500", color: "var(--tj-color-body-primary, #667085)", lineHeight: "1.4"
	};

	const btnStyle = {
		background: "var(--tj-color-theme-primary)",
		color: "var(--tj-color-common-white, white)",
		padding: "14px 28px",
		borderRadius: "30px",
		fontWeight: "600",
		fontSize: "15px",
		display: "inline-flex",
		alignItems: "center",
		gap: "10px",
		border: "none",
		textDecoration: "none"
	};

	return (
		<section className="h10-about section-gap " style={{ background: "#f4f8f8" }}>
			<style>{`
				.h10-about-achievement-card .odometer,
				.h10-about-achievement-card .odometer .odometer-digit,
				.h10-about-achievement-card .odometer span,
				.h10-about-achievement-card .count-plus {
					color: var(--tj-color-theme-primary) !important;
				}
			`}</style>
			<div className="container">
				<div className="row align-items-center">
					{/* Left Column: Image with floating glassmorphic box */}
					<div className="col-12 col-md-5 col-lg-5 mb-5 mb-lg-0">
						<div
							className="about-img-area h10-about-banner wow bounceInLeft"
							data-wow-delay=".3s"
							style={{ position: "relative" }}
						>
							<div className="about-img overflow-hidden" style={{ borderRadius: "16px", position: "relative" }}>
								<img
									data-speed=".8"
									src={resolveApiImage(image) || "/images/about/h10-about-banner.webp"}
									alt="About us"
									style={{ width: "100%", height: "auto", objectFit: "cover", display: "block", borderRadius: "16px" }}
								/>

								{/* Floating Glassmorphic Customer Card */}
								<div
									className="customers-box style-3 h10-about-clients wow fadeInUp"
									data-wow-delay=".4s"
									style={{
										position: "absolute",
										bottom: "25px",
										left: "25px",
										zIndex: 10,
										background: "rgba(255, 255, 255, 0.15)",
										backdropFilter: "blur(12px)",
										WebkitBackdropFilter: "blur(12px)",
										padding: "20px 24px",
										borderRadius: "16px",
										border: "1px solid rgba(255, 255, 255, 0.25)",
										boxShadow: "0 10px 30px rgba(0, 0, 0, 0.25)",
										maxWidth: "280px"
									}}
								>
									<div className="customers" style={{ marginBottom: "8px" }}>
										<ul style={{ display: "flex", padding: 0, margin: 0, listStyle: "none" }}>
											{team_leader?.map((src, i) => (
												<li
													key={i}
													className="wow fadeInRight"
													data-wow-delay={`${0.2 + i * 0.1}s`}
													style={{ marginLeft: i === 0 ? "0px" : "-15px" }}
												>
													<img
														src={resolveApiImage(src)}
														alt="team"
														style={{ width: "42px", height: "42px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.85)", objectFit: "cover" }}
													/>
												</li>
											))}
											<li className="wow fadeInRight" data-wow-delay=".5s" style={{ marginLeft: "-15px" }}>
												<span
													style={{
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														width: "42px",
														height: "42px",
														borderRadius: "50%",
														background: "var(--tj-color-theme-primary)",
														color: "var(--tj-color-common-white, white)",
														fontSize: "14px",
														fontWeight: "bold"
													}}
												>
													<i className="tji-plus"></i>
												</span>
											</li>
										</ul>
									</div>
									<div style={{ color: "var(--tj-color-common-white, white)", fontSize: "14px", fontWeight: "600", letterSpacing: "-0.2px" }}>
										We have 100+ happy customer.
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column: Title, and on large screens: Counters, Description, Button */}
					<div className="col-12 col-md-7 col-lg-7">
						<div className="h10-about-content-wrapper md:pl-[15px] pl-0 " style={{ maxWidth: "100%" }}>
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box hidden sm:block mb-2 lg:mb-0 sm:mb-0"></i>
								{heading}
							</span>
							<h2
								className="sec-title text-[30px] lg:text-[38px] title-highlight wow fadeInUp"
								data-wow-delay=".3s"
								style={{ fontWeight: "500", lineHeight: "1.25", marginBottom: "35px" }}
							>
								{subheading}
							</h2>

							{/* DESKTOP LAYOUT (Visible on lg/1024px screens and above) */}
							<div className="d-none d-lg-block">
								{/* Achievement Cards Layout — 3 cards */}
								<div className="row mb-4 g-3">
									<div className="col-md-4">
										<div style={cardStyle}>
											<div style={iconBadgeStyle}>
												<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
													<path d="M12 8v4l3 3" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
													<circle cx="12" cy="12" r="10" stroke="var(--tj-color-theme-primary)" strokeWidth="2" />
												</svg>
											</div>
											<div style={{ display: "flex", alignItems: "baseline", gap: "2px", lineHeight: 1 }}>
												<span style={statStyle}>
													<AnimatedCounter target={ach1.num} suffix={ach1.suffix} />
												</span>
											</div>
											<span style={labelStyle}>{acheivment_text1}</span>
										</div>
									</div>

									<div className="col-md-4">
										<div style={cardStyle}>
											<div style={iconBadgeStyle}>
												<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
													<path d="M3 20V14M8 20V9M13 20V4M18 20V11" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</div>
											<div style={{ display: "flex", alignItems: "baseline", gap: "3px", lineHeight: 1, flexWrap: "nowrap" }}>
												<span style={statStyle}>
													<AnimatedCounter target={ach2.num} suffix={ach2.suffix} />
												</span>
											</div>
											<span style={labelStyle}>{acheivment_text2}</span>
										</div>
									</div>

									<div className="col-md-4">
										<div style={cardStyle}>
											<div style={iconBadgeStyle}>
												<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
													<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
													<path d="M9 22V12h6v10" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
												</svg>
											</div>
											<div style={{ display: "flex", alignItems: "baseline", gap: "2px", lineHeight: 1, flexWrap: "nowrap" }}>
												<span style={statStyle}>
													<AnimatedCounter target={ach3.num} suffix={ach3.suffix} format={(n) => n.toLocaleString()} />
												</span>
											</div>
											<span style={labelStyle}>{acheivment_text3}</span>
										</div>
									</div>
								</div>

								{/* Description paragraph */}
								<div
									className="desc wow fadeInUp"
									data-wow-delay=".4s"
									style={{ color: "var(--tj-color-body-primary, #54606c)", fontSize: "15px", lineHeight: "1.6", marginBottom: "35px" }}
									dangerouslySetInnerHTML={{ __html: description }}
								/>

								{/* Action buttons */}
								<div style={{ display: "flex", alignItems: "center", gap: "25px", flexWrap: "wrap" }}>
									<Link href="/contact" className="tj-primary-btn" style={btnStyle}>
										Know more us
										<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
											<path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* MOBILE/TABLET LAYOUT (Visible below lg/1024px screens) */}
				<div className="row d-lg-none mt-4">
					<div className="col-12">
						{/* Achievement Cards Layout — 3 cards side-by-side using full width */}
						<div className="row mb-4 g-4">
							<div className="col-12 col-md-4">
								<div style={cardStyle}>
									<div style={iconBadgeStyle}>
										<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
											<path d="M12 8v4l3 3" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<circle cx="12" cy="12" r="10" stroke="var(--tj-color-theme-primary)" strokeWidth="2" />
										</svg>
									</div>
									<div style={{ display: "flex", alignItems: "baseline", gap: "2px", lineHeight: 1 }}>
										<span style={statStyle}>
											<AnimatedCounter target={ach1.num} suffix={ach1.suffix} />
										</span>
									</div>
									<span style={labelStyle}>{acheivment_text1}</span>
								</div>
							</div>

							<div className="col-12 col-md-4">
								<div style={cardStyle}>
									<div style={iconBadgeStyle}>
										<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
											<path d="M3 20V14M8 20V9M13 20V4M18 20V11" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>
									<div style={{ display: "flex", alignItems: "baseline", gap: "3px", lineHeight: 1, flexWrap: "nowrap" }}>
										<span style={statStyle}>
											<AnimatedCounter target={ach2.num} suffix={ach2.suffix} />
										</span>
									</div>
									<span style={labelStyle}>{acheivment_text2}</span>
								</div>
							</div>

							<div className="col-12 col-md-4">
								<div style={cardStyle}>
									<div style={iconBadgeStyle}>
										<svg width="22" height="22" viewBox="0 0 24 24" fill="none">
											<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M9 22V12h6v10" stroke="var(--tj-color-theme-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</div>
									<div style={{ display: "flex", alignItems: "baseline", gap: "2px", lineHeight: 1, flexWrap: "nowrap" }}>
										<span style={statStyle}>
											<AnimatedCounter target={ach3.num} suffix={ach3.suffix} format={(n) => n.toLocaleString()} />
										</span>
									</div>
									<span style={labelStyle}>{acheivment_text3}</span>
								</div>
							</div>
						</div>

						{/* Description Paragraph */}
						<div
							className="desc wow fadeInUp"
							data-wow-delay=".4s"
							style={{ color: "var(--tj-color-body-primary, #54606c)", fontSize: "15px", lineHeight: "1.6", marginBottom: "35px" }}
							dangerouslySetInnerHTML={{ __html: description }}
						/>

						{/* Action Buttons */}
						<div style={{ display: "flex", alignItems: "center", gap: "25px", flexWrap: "wrap" }}>
							<Link href="/contact" className="tj-primary-btn" style={btnStyle}>
								Know more us
								<svg width="14" height="14" viewBox="0 0 24 24" fill="none">
									<path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
								</svg>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default About9Client;
