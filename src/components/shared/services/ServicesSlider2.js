"use client";
import getALlServices from "@/libs/getALlServices";
import { useEffect, useState } from "react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";



import ServiceCard6 from "../cards/ServiceCard6";

const ServicesSlider2 = ({ data }) => {
	const [defaultServices, setDefaultServices] = useState([]);

	useEffect(() => {
		if (!data || data.length === 0) {
			getALlServices().then((res) => {
				setDefaultServices(res?.slice(0, 4) || []);
			});
		}
	}, [data]);

	const showableSevices = data && data.length > 0 ? data : defaultServices;
	const services = [...showableSevices, ...showableSevices];

	return (
		<Swiper
			slidesPerView={1.3}
			spaceBetween={15}
			loop={true}
			speed={1500}
			autoplay={{
				delay: 5000,
				disableOnInteraction: false,
			}}
			pagination={{
				el: ".swiper-pagination-area",
				clickable: true,
			}}
			breakpoints={{
				576: {
					slidesPerView: 2,
				},
				992: {
					slidesPerView: 3,
				},
				1200: {
					slidesPerView: 3,
					spaceBetween: 20,
				},
				1400: {
					slidesPerView: 3,
					spaceBetween: 28,
				},
			}}
			modules={[Pagination, Autoplay]}
			className="service-slider-2"
		>
			{services?.length
				? services?.map((service, idx) => (
						<SwiperSlide key={idx}>
							<ServiceCard6 service={service} idx={idx % (showableSevices.length || 1)} />
						</SwiperSlide>
				  ))
				: ""}
			<div className="swiper-pagination-area"></div>
		</Swiper>
	);
};

export default ServicesSlider2;
