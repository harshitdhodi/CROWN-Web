"use client";
import getTeamMembers from "@/libs/getTeamMembers";
import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const TeamMarqueeSlider = ({ isRtl, items: propItems }) => {
	// Use passed items if available, otherwise fallback to static team members
	const sourceItems = (propItems && propItems.length > 0) ? propItems : getTeamMembers()?.slice(isRtl ? 4 : 0, isRtl ? 8 : 4);
	
	// Duplicate items to ensure smooth infinite loop in the marquee (at least 12 items to avoid loop limits on wide viewports)
	let displayItems = [];
	if (sourceItems?.length) {
		displayItems = [...sourceItems];
		while (displayItems.length < 12) {
			displayItems = [...displayItems, ...sourceItems];
		}
	}

	return (
		<Swiper
			slidesPerView="auto"
			spaceBetween={10}
			loop={true}
			centeredSlides={false}
			allowTouchMove={false}
			speed={7000}
			autoplay={{
				delay: 0,
				disableOnInteraction: false,
				pauseOnMouseEnter: false,
			}}
			loopAddBlankSlides={false}
			observer={true}
			observeParents={true}
			breakpoints={{
				992: {
					spaceBetween: 15,
				},
			}}
			dir={isRtl ? "rtl" : "ltr"}
			className="h7-team-marquee"
			modules={[Autoplay]}
		>
			{displayItems?.length
				? displayItems?.map(
						(
							{ id, name, desig, img, img2, imgLarge },
							idx
						) => (
							<SwiperSlide key={idx} style={{ width: "200px" }}>
								<div style={{
									flexDirection: "column",
									borderRadius: "24px",
									color: "var(--tj-color-text-body, gray)",
									padding: "8px",
									height: "100px",
									width: "100%",
									gap: "10px"
								}}>
									<div className="team-item" style={{
										width: "100%",
										height: "100%",
										borderRadius: "16px",
										overflow: "hidden",
										flexBasis: "85%",
										color: "var(--tj-color-text-body, gray)",
										backgroundColor: "var(--tj-color-theme-bg, lightgray)",
									}}>
										<img 
											src={imgLarge || img || img2 || "/images/team/h7-team-1.webp"} 
											alt={name || "partner-logo"} 
											style={{ width: "100%", height: "100%", objectFit: "contain" }} 
										/>
									</div>
									
								</div>
							</SwiperSlide>
						)
				  )
				: ""}
		</Swiper>
	);
};

export default TeamMarqueeSlider;

