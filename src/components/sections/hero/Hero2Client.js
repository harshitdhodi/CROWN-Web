"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { resolveCmsImage } from "@/lib/seoConfig";

const Hero2Client = ({ heroSlides = [] }) => {
	const [controlledMainSwiper, setControlledMainSwiper] = useState(null);

	if (heroSlides.length === 0) return null;

	return (
		<section className="tj-slider-section">
			<Swiper
				slidesPerView={1}
				spaceBetween={0}
				loop={true}
				effect="fade"
				speed={1400}
				autoplay={{ delay: 5000 }}
				modules={[Autoplay, Navigation, EffectFade, Thumbs]}
				thumbs={{ swiper: controlledMainSwiper }}
				navigation={{ nextEl: ".slider-next", prevEl: ".slider-prev" }}
				className="hero-slider"
				style={{ height: "100%" }}
			>
				{heroSlides.map(({ image, heading, subheading }, idx) => (
					<SwiperSlide
						key={idx}
						className="tj-slider-item"
						style={{ height: "auto" }}
					>
						<div
							className="slider-bg-image"
							style={{
								backgroundImage: `url('${image ? resolveCmsImage(image) : "/images/hero/slider-1.webp"
									}')`,
							}}
						></div>
						<div className="container">
							<div className="slider-wrapper">
								<div className="slider-content">
									<h1 className="slider-title">{heading}</h1>
									<div
										className="slider-desc"
										dangerouslySetInnerHTML={{ __html: subheading }}
										style={{ color: "var(--tj-color-text-body-5)" }}
									/>
									<div className="slider-btn">
										<ButtonPrimary text={"Get Started"} url={"/contact"} />
									</div>
								</div>
							</div>
						</div>
					</SwiperSlide>
				))}

				<div
					className="hero-navigation d-inline-flex wow fadeIn"
					data-wow-delay="1.5s"
				>
					<div className="slider-prev" role="button">
						<span className="anim-icon">
							<i className="tji-arrow-left"></i>
							<i className="tji-arrow-left"></i>
						</span>
					</div>
					<div className="slider-next" role="button">
						<span className="anim-icon">
							<i className="tji-arrow-right"></i>
							<i className="tji-arrow-right"></i>
						</span>
					</div>
				</div>
			</Swiper>
			<Swiper
				onSwiper={setControlledMainSwiper}
				slidesPerView={3}
				spaceBetween={15}
				loop={false}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[Thumbs]}
				className="hero-thumb wow fadeIn"
				data-wow-delay="2s"
			>
				{heroSlides.map(({ image }, idx) => (
					<SwiperSlide key={idx} className="thumb-item">
						<div style={{ position: "relative", width: 80, height: 80 }}>
							<img
								src={image ? resolveCmsImage(image) : "/images/hero/slider-thumb-1.webp"}
								alt="images"
								style={{ width: "100%", height: "100%", objectFit: "cover" }}
							/>
						</div>
					</SwiperSlide>
				))}
			</Swiper>

			<div className="circle-text-wrap wow fadeInUp" data-wow-delay="1s">
				<span
					className="circle-text"
					style={{ backgroundImage: "url('/images/hero/circle-text.webp')" }}
				></span>
				<Link className="circle-icon" href="/services" aria-label="Scroll down to services">
					<i className="tji-arrow-down-big"></i>
				</Link>
			</div>
		</section>
	);
};

export default Hero2Client;
