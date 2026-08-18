"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade, Navigation, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { resolveCmsImage } from "@/lib/seoConfig";

const Hero2Client = ({ heroSlides = [] }) => {
	const [controlledMainSwiper, setControlledMainSwiper] = useState(null);

	if (!heroSlides || heroSlides.length === 0) return null;

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
				{heroSlides.map((slide, idx) => {
					const heading = slide.heading || slide.title || "";
					const subheading = slide.subheading || slide.description || slide.subtitle || "";
					const imageSrc = slide.image || slide.bg_image || slide.img;
					const btnText = slide.btn_text || slide.button_text || slide.btnText || slide.buttonText || "Explore More";
					const btnLink = slide.btn_link || slide.button_link || slide.btnLink || slide.buttonLink || slide.link || slide.url || "/about-us";
					const altName = slide.altname || slide.alt || heading || "Hero Banner";
					const imgTitle = slide.imgtitle || slide.title || "";

					const bgImage = (imageSrc && resolveCmsImage(imageSrc)) || "/images/hero/slider-1.webp";

					return (
						<SwiperSlide
							key={slide.id || idx}
							className="tj-slider-item"
							style={{ height: "auto" }}
						>
							<div
								className="slider-bg-image"
								style={{
									backgroundImage: `url('${bgImage}')`,
								}}
							></div>
							<div className="container">
								<div className="slider-wrapper">
									<div className="slider-content" style={{ maxWidth: "820px" }}>
										{heading && (
											<h1
												className="slider-title"
												style={{ fontSize: "clamp(3.2rem, 5.5vw, 5.5rem)", lineHeight: 1.08 }}
											>
												{heading}
											</h1>
										)}
										{subheading && (
											<div
												className="slider-desc"
												dangerouslySetInnerHTML={{ __html: subheading }}
												style={{ color: "var(--tj-color-text-body-5)" }}
											/>
										)}
										<div className="slider-btn">
											<ButtonPrimary text={btnText} url={btnLink} />
										</div>
									</div>
								</div>
							</div>
						</SwiperSlide>
					);
				})}

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
				slidesPerView={Math.min(heroSlides.length, 3)}
				spaceBetween={15}
				loop={false}
				freeMode={true}
				watchSlidesProgress={true}
				modules={[Thumbs]}
				className="hero-thumb wow fadeIn"
				data-wow-delay="2s"
			>
				{heroSlides.map((slide, idx) => {
					const imageSrc = slide.image || slide.bg_image || slide.img;
					const altName = slide.altname || slide.alt || slide.heading || "Hero Slide Thumb";
					const imgTitle = slide.imgtitle || "";
					const thumbImage = (imageSrc && resolveCmsImage(imageSrc)) || "/images/hero/slider-thumb-1.webp";

					return (
						<SwiperSlide key={slide.id ? `thumb-${slide.id}` : idx} className="thumb-item">
							<div style={{ position: "relative", width: 80, height: 80 }}>
								<img
									src={thumbImage}
									alt={altName}
									title={imgTitle}
									style={{ width: "100%", height: "100%", objectFit: "cover" }}
								/>
							</div>
						</SwiperSlide>
					);
				})}
			</Swiper>

			<div className="circle-text-wrap wow fadeInUp" data-wow-delay="1s">
				<span
					className="circle-text"
					style={{ backgroundImage: "url('/images/hero/circle-text.webp')" }}
				></span>
				<Link className="circle-icon" href="/about-us" aria-label="Scroll down to services">
					<i className="tji-arrow-down-big"></i>
				</Link>
			</div>
		</section>
	);
};

export default Hero2Client;
