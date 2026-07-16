"use client";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";
import { useState } from "react";

const ServiceCard4 = ({ service }) => {
	const {
		title,
		desc,
		slug,
		img2 = "/images/service/service-1.webp",
	} = service || {};

	const [hovered, setHovered] = useState(false);

	return (
		<div
			className="service-item style-4"
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
			style={{
				backgroundImage: hovered ? "none" : `url(${img2})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundColor: hovered ? "var(--tj-color-theme-primary)" : "transparent",
				overflow: "hidden",
				transition: "background-color 0.3s ease",
			}}
		>
			{/* Bottom-to-top teal overlay — always visible */}
			<div
				style={{
					position: "absolute",
					inset: 0,
					background:
						"linear-gradient(to top, color-mix(in srgb, var(--tj-color-theme-primary) 92%, transparent) 0%, color-mix(in srgb, var(--tj-color-theme-primary) 50%, transparent) 50%, color-mix(in srgb, var(--tj-color-theme-primary) 10%, transparent) 100%)",
					zIndex: 1,
					borderRadius: "inherit",
					transition: "opacity 0.3s ease",
				}}
			/>

			{/* Spacer to push content to bottom */}
			<div className="h-[22vh]" style={{ position: "relative", zIndex: 2 }} />

			<div
				className="service-content"
				style={{ position: "relative", zIndex: 2 }}
			>
				<h4 className="title">
					<Link href={`/services/${slug}`} style={{ color: "#ffffff" }}>
						{title}
					</Link>
				</h4>
				<p className="desc " style={{ color: "#ffffff" , paddingBottom: "1.5rem"}}>
					{desc}
				</p>
				
				<ButtonPrimary
					text={"Learn More"}
					url={`/services/${slug}`}
					className="!bg-black !text-white [&_.btn-icon]:!bg-white [&_.btn-icon_i]:!text-black  "
					aria-label={`Learn More about ${title}`}
				/>
				
			</div>
		</div>
	);
};

export default ServiceCard4;
