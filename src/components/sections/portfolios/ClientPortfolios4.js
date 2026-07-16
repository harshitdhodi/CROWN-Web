"use client";
import PortfolioCard4 from "@/components/shared/cards/PortfolioCard4";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

/**
 * Client-side Swiper wrapper for the Machinery & Equipment carousel.
 * Receives pre-fetched data from the server-side Portfolios4 component.
 */
const ClientPortfolios4 = ({ portfolio = [] }) => {
	return (
		<Swiper
			slidesPerView={1.2}
			spaceBetween={15}
			loop={true}
			speed={1500}
			centeredSlides={false}
			autoplay={{
				delay: 6000,
			}}
			pagination={{
				el: ".swiper-pagination-area",
				clickable: true,
			}}
			breakpoints={{
				576: {
					slidesPerView: 1.5,
					spaceBetween: 20,
				},
				768: {
					slidesPerView: 2,
					spaceBetween: 20,
				},
				992: {
					slidesPerView: 2.4,
					spaceBetween: 30,
				},
				1200: {
					slidesPerView: 3,
					spaceBetween: 30,
				},
			}}
			modules={[Pagination, Autoplay]}
			className="project-slider-3"
		>
			{portfolio?.length
				? portfolio.map((item, idx) => (
					<SwiperSlide key={idx}>
						<PortfolioCard4 portfolio={item} />
					</SwiperSlide>
				))
				: ""}
			<div className="swiper-pagination-area"></div>
		</Swiper>
	);
};

export default ClientPortfolios4;
