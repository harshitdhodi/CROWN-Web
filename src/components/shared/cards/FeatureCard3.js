"use client";
import { useState } from "react";

/** Resolve /uploads/... paths via Next.js rewrite proxy */
function resolveImg(src) {
	if (!src) return null;
	if (src.startsWith("http://") || src.startsWith("https://")) return src;
	if (src.includes("/uploads/")) return "/uploads/" + src.split("/uploads/")[1];
	return src;
}

const FeatureCard3 = ({ feature }) => {
	const { icon, title, desc, color_img, hover_img } = feature ? feature : {};
	const defaultImg = resolveImg(hover_img);
	const hoverImg   = resolveImg(color_img) || defaultImg;
	const [isHovered, setIsHovered] = useState(false);
	const currentImg = isHovered && hoverImg ? hoverImg : defaultImg;

	return (
		<div
			className="choose-box"
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="choose-content">
				<div className="choose-icon" style={{
					background: isHovered
						? "var(--tj-color-theme-bg, #f4f8f8)"
						: "var(--tj-color-theme-primary)",
					borderRadius: "50%",
					width: "90px",
					height: "90px",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					flexShrink: 0,
					transition: "background 0.3s ease",
				}}>
					{defaultImg ? (
						<img
							src={currentImg}
							alt={title || ""}
							style={{ objectFit: "contain",  transition: "opacity 0.3s" }}
						/>
					) : (
						<i className={icon}></i>
					)}
				</div>
				<h4 className="title">{title}</h4>
				<p className="desc">{desc}</p>
			</div>
		</div>
	);
};

export default FeatureCard3;
