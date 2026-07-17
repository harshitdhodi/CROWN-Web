'use client';
import { useState } from "react";
import Image from "next/image";

const ServiceCard3 = ({ service, idx, lastItem, isIndustrySolutions, variant }) => {
	const {
		title,
		desc,
		img2 = "/images/service/service-2.webp",
		color_img,
		hover_img,
		iconName,
		year,
	} = service || {};

	const [isHovered, setIsHovered] = useState(false);
	const isJourney = variant === "journey";

	// On industry-solutions: default = color_img (on white bg), hover = hover_img (on primary bg/reveal image)
	const displayImage = isIndustrySolutions
		? (isHovered ? (hover_img || color_img) : color_img)
		: (isHovered ? (hover_img || color_img) : color_img);

	// Inline styles that override CSS for industry-solutions variant
	const cardStyle = isIndustrySolutions ? {
		backgroundColor: isHovered
			? "var(--tj-color-theme-primary)"
			: "var(--tj-color-common-white)",
		border: "1px solid var(--tj-color-theme-primary)",
		transition: "all 0.3s ease-in-out",
	} : {};

	const titleStyle = isIndustrySolutions ? {
		color: isHovered
			? "var(--tj-color-common-white)"
			: "var(--tj-color-text-body-4)",
		transition: "color 0.3s ease-in-out",
	} : {};

	const descStyle = isIndustrySolutions ? {
		color: isHovered
			? "var(--tj-color-text-body-5)"
			: "var(--tj-color-text-body-2)",
		transition: "color 0.3s ease-in-out",
		maxWidth: "550px",
	} : {};

	const revealBgStyle = {
		backgroundImage: `url('${img2}')`,
		...(isHovered && {
			transform: "translate(-85%, -50%) scale(1)",
		})
	};

	return (
		<div
			className="service-item style-3 wow fadeInUp"
			data-wow-delay=".3s"
			style={cardStyle}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="service-content-wrap">
				<div className="service-title" style={isJourney ? { maxWidth: "320px" } : {}}>
					<div className="service-icon" style={isHovered ? { background: "transparent", border: "none", boxShadow: "none", transition: "none" } : { transition: "none" }}>
						{isJourney ? (
							// Year badge — larger circle, range years split vertically
							(() => {
								// Split "2018 – 2020" → ["2018", "2020"], single year stays one line
								const parts = year ? year.split(/\s*[–—-]\s*/) : ["—"];
								const isRange = parts.length > 1;
								return (
									<span style={{
										display: "inline-flex",
										flexDirection: "column",
										alignItems: "center",
										justifyContent: "center",
										width:  "80px",
										height: "80px",
										borderRadius: "50%",
										background: isHovered
											? "rgba(255,255,255,0.25)"
											: "var(--tj-color-theme-primary)",
										color: "#fff",
										fontWeight: 700,
										fontSize: isRange ? "13px" : "16px",
										letterSpacing: "-0.2px",
										lineHeight: 1.3,
										textAlign: "center",
										flexShrink: 0,
										border: isHovered
											? "2px solid rgba(255,255,255,0.5)"
											: "2px solid transparent",
										transition: "all 0.3s ease",
										boxSizing: "border-box",
										padding: "6px",
										gap: isRange ? "2px" : "0",
									}}>
										{isRange ? (
											<>
												<span style={{ display: "block" }}>{parts[0]}</span>
												<span style={{ display: "block", opacity: 0.75, fontSize: "10px" }}>—</span>
												<span style={{ display: "block" }}>{parts[1]}</span>
											</>
										) : (
											<span>{parts[0]}</span>
										)}
									</span>
								);
							})()
						) : color_img ? (
							<Image
								src={displayImage}
								alt={title}
								width={60}
								height={60}
								style={{ objectFit: "contain", width: "auto", height: "auto" }}
							/>
						) : (
							<i className={iconName ? iconName : "tji-service-1"}></i>
						)}
					</div>
					<h4 className="title" style={{ ...titleStyle, ...(isJourney ? { maxWidth: "200px", whiteSpace: "normal", wordBreak: "break-word" } : {}) }}>
						{title}
					</h4>
				</div>
				<div className="service-content">
					<p className="desc" style={descStyle}>{desc}</p>
				</div>
			</div>
			<div
				className="service-reveal-bg"
				style={revealBgStyle}
			></div>
		</div>
	);
};

export default ServiceCard3;
