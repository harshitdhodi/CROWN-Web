"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const TeamCard = ({ teamMember }) => {
	const [isHovered, setIsHovered] = useState(false);
	const {
		id,
		name,
		desig,
		imgLarge,
		img = "/images/team/team-1.webp",
	} = teamMember || {};

	const [imageSrc, setImageSrc] = useState(img);
	const [largeImageSrc, setLargeImageSrc] = useState(imgLarge || img);

	useEffect(() => {
		setImageSrc(img);
		setLargeImageSrc(imgLarge || img);
	}, [img, imgLarge]);

	return (
		<div
			className={`team-item  left-swipe ${isHovered ? "active active-hover" : ""}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			style={{ display: "flex", flexDirection: "column", height: "100%" }}
		>
			{/* Reveal Background on Hover */}
			<div 
				className="team-reveal-bg" 
				style={{ 
					backgroundImage: `url("${largeImageSrc}")`,
					backgroundSize: "contain",
					backgroundRepeat: "no-repeat",
					backgroundPosition: "center"
				}} 
			></div>

			<div className="team-img" style={{ position: "relative", width: "100%", height: "100%", minHeight: "350px" }}>
				<div className="team-img-inner" style={{ position: "relative", width: "100%", height: "100%" }}>
					<Image 
						src={imageSrc} 
						alt="" 
						fill 
						sizes="(max-width: 768px) 100vw, 33vw" 
						style={{ objectFit: "fill" }} 
						onError={() => {
							setImageSrc("/images/team/team-1.webp");
							setLargeImageSrc("/images/team/team-1.webp");
						}}
					/>
				</div>
			</div>
			
		</div>
	);
};

export default TeamCard;
