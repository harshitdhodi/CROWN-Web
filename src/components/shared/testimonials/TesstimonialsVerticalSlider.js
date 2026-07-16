"use client";
import TestimonialsCard5 from "@/components/shared/cards/TestimonialsCard5";
import { useEffect, useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";




const TesstimonialsVerticalSlider = ({ testimonials = [] }) => {
	// Duplicate so the loop always has enough slides
	const slides = testimonials.length > 0
		? [...testimonials, ...testimonials]
		: [];

	const [currentDirection, setCurrentDirection] = useState("vertical");

	useEffect(() => {
		const getDirection = () => {
			setCurrentDirection(window.innerWidth < 992 ? "horizontal" : "vertical");
		};
		getDirection();
		window.addEventListener("resize", getDirection);
		return () => window.removeEventListener("resize", getDirection);
	}, []);

	if (slides.length === 0) return null;

	return (
		<Swiper
			key={currentDirection}
			direction={currentDirection}
			slidesPerView={1}
			spaceBetween={20}
			loop={true}
			speed={1000}
			autoplay={{ delay: 5000, disableOnInteraction: false }}
			breakpoints={{
				576: { slidesPerView: 1.2 },
				992: { slidesPerView: "auto", spaceBetween: 30 },
			}}
			modules={[Autoplay]}
			className="swiper-container h6-testimonial-slider"
		>
			{slides.map((testimonial, idx) => (
				<SwiperSlide key={idx}>
					<TestimonialsCard5 testimonial={testimonial} />
				</SwiperSlide>
			))}
		</Swiper>
	);
};

export default TesstimonialsVerticalSlider;
