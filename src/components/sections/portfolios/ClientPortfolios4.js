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
		<>
			<style>{`
				.tj-project-section-4 .swiper-wrapper {
					align-items: stretch !important;
				}
				.tj-project-section-4 .swiper-slide {
					height: auto !important;
					display: flex !important;
				}
				.tj-project-section-4 .project-item.h4-project-item {
					height: 100% !important;
					display: flex !important;
					flex-direction: column !important;
					justify-content: space-between !important;
					width: 100% !important;
				}
				.tj-project-section-4 .project-content {
					flex: 1 0 auto !important;
					display: flex !important;
					flex-direction: column !important;
					justify-content: flex-start !important;
					padding-bottom: 20px !important;
				}
				.tj-project-section-4 .project-text {
					display: flex !important;
					align-items: flex-start !important;
					justify-content: space-between !important;
					width: 100% !important;
					gap: 15px !important;
					margin-top: 0 !important;
				}
				.tj-project-section-4 .project-text .title {
					max-width: 100% !important;
					flex: 1 !important;
					margin: 0 !important;
					min-height: 56px !important;
					display: flex !important;
					align-items: flex-start !important;
				}
				.tj-project-section-4 .project-text .tji-icon-btn {
					flex-shrink: 0 !important;
				}
				.tj-project-section-4 .project-img {
					margin-top: auto !important;
					flex-shrink: 0 !important;
				}
			`}</style>
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
		</>
	);
};

export default ClientPortfolios4;
