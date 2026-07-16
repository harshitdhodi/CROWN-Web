"use client";
import { useEffect, useRef } from "react";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import ServiceCard2 from "@/components/shared/cards/ServiceCard2";

const Services2Client = ({ services, headingData }) => {
	const sidebarRef = useRef(null);
	const containerRef = useRef(null);

	useEffect(() => {
		if (typeof window === "undefined" || window.innerWidth < 992) return;

		let ctx;
		// Delay to let ScrollSmoother initialize first
		const timer = setTimeout(async () => {
			try {
				const { gsap, ScrollTrigger } = await import("@/libs/gsap.config");
				ctx = gsap.context(() => {
					const smoother = window.ScrollSmoother?.get?.();
					ScrollTrigger.create({
						trigger: containerRef.current,
						pin: sidebarRef.current,
						start: "top top+=120",
						end: "bottom bottom-=120",
						pinSpacing: false,
						scroller: smoother ? "#smooth-wrapper" : window,
					});
				});
			} catch (e) {
				console.warn("Services2 sticky init failed:", e);
			}
		}, 800);

		return () => {
			clearTimeout(timer);
			ctx?.revert();
		};
	}, []);

	return (
		<section
			ref={containerRef}
			className="tj-service-section service-2 section-gap section-gap-x"
		>
			<div className="container">
				<div className="row">
					<div className="col-lg-4">
						<div ref={sidebarRef} className="content-wrap">
							<div className="sec-heading style-2">
								<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
									<i className="tji-box"></i> {headingData?.tagline || "Our Solutions"}
								</span>
								<h2 className="sec-title text-white text-anim">
									{headingData?.heading || "Tailored Business Solutions for our Corporates."}
								</h2>
							</div>
							<div className="wow fadeInUp" data-wow-delay=".6s">
								<ButtonPrimary text={"More Services"} url={"/services"} />
							</div>
						</div>
					</div>
					<div className="col-lg-8">
						<div className="service-wrapper-2">
							{services?.length
								? services?.map((service, idx) => (
										<ServiceCard2 key={idx} service={service} idx={idx} />
								  ))
								: ""}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Services2Client;
