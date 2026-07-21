"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Margarine } from "next/font/google";

const Contact2Client = ({ isInnerPage = false, styleConfig, initialHeadingData, initialLocations }) => {
	const pathname = usePathname();
	const isGlobalPresencePage = pathname === "/global-presence";
	const [locations, setLocations] = useState(initialLocations || []);
	const [activeId, setActiveId] = useState(null);
	const [headingData, setHeadingData] = useState(initialHeadingData || { tagline: "", heading: "" });
	const popupRefs = useRef({});

	// Close popup when clicking outside any pin/popup
	useEffect(() => {
		const handler = (e) => {
			const clickedInsideAny = Object.values(popupRefs.current).some(
				(el) => el && el.contains(e.target)
			);
			if (!clickedInsideAny) setActiveId(null);
		};
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, []);

	// Fetch dynamic image and heading data for global presence
	useEffect(() => {
		fetch("/api/heading?section=global-presence")
			.then((res) => res.json())
			.then((json) => {
				if (json.success && json.data) {
					setHeadingData((prev) => ({
						...prev,
						...json.data,
					}));
				}
			})
			.catch((err) => console.error("Failed to fetch global presence heading", err));
	}, []);

	const handlePinClick = (id) => {
		setActiveId((prev) => (prev === id ? null : id));
	};

	// Apply dynamic styles from CMS
	const sectionStyle = {
		backgroundColor: styleConfig?.background_color,
		color: styleConfig?.text_color
	};

	return (
		<section className={`tj-contact-section ${!isInnerPage ? "h6-project" : "sm:mb-5"} section-gap section-gap-x`} style={sectionStyle} >
			<div className="container">
				<div className="row align-items-start relative">

					{/* ── Left: SVG Map with clickable pins ── */}
					<div className="col-12 d-flex justify-content-center">
						<div className="global-map wow fadeInUp" data-wow-delay=".3s" style={{ width: "100%", overflowX: "auto" }}>
							<div className="global-map-img" style={{ position: "relative", width: "100%", minWidth: "600px" }}>
								<Image src={headingData?.image || "/images/bg/map.svg"} alt="Global Map" width={600} height={400} style={{ width: "100%", height: "auto" }} />

								{locations.map((loc, idx) => (
									<div
										key={loc.id}
										ref={(el) => (popupRefs.current[loc.id] = el)}
										className={`location-indicator loc-${idx + 1} ${activeId === loc.id ? "active" : ""}`}
										onMouseEnter={() => setActiveId(loc.id)}
										onMouseLeave={() => setActiveId(null)}
										onClick={() => handlePinClick(loc.id)}
										style={{
											cursor: "pointer",
											position: "absolute",
											top: loc.position?.top ?? "50%",
											left: loc.position?.left ?? "50%",
											transform: "translate(-50%, -50%)",
											background: "none",
										}}
									>
										<span
											style={{
												display: "block",
												width: "16px",
												height: "16px",
												backgroundColor: styleConfig?.primary_color || "var(--tj-color-theme-primary)",
												borderRadius: "50% 50% 50% 0",
												transform: "rotate(-45deg)",
												boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
											}}
										></span>

										{/* Tooltip shown on click */}
										{activeId === loc.id && (
											<div
												className="location-tooltip"
												style={{ display: "block", pointerEvents: "auto" }}
											>
												<span>{loc.label}:</span>
												<p>{loc.address}</p>
												{loc.phone?.href && (
													<Link href={loc.phone.href} style={{ wordBreak: "break-all" }}>P: {loc.phone.label}</Link>
												)}
												{loc.email?.href && (
													<Link href={loc.email.href} style={{ wordBreak: "break-all" }}>M: {loc.email.label}</Link>
												)}
											</div>
										)}
									</div>
								))}
							</div>
						</div>
					</div>



				</div>
			</div>

			<div className="bg-shape-1">
				<Image src="/images/shape/pattern-2.svg" alt="" width={100} height={100} style={{ width: "100%", height: "auto" }} />
			</div>
			<div className="bg-shape-2">
				<Image src="/images/shape/pattern-3.svg" alt="" width={100} height={100} style={{ width: "100%", height: "auto" }} />
			</div>
		</section>
	);
};

export default Contact2Client;
