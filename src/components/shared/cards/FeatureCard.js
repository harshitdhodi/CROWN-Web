"use client";
import "@/app/swiper-styles.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

const FeatureCard = ({ feature, idx }) => {
    const { icon, title, desc } = feature || {};
    const isImageUrl = icon && (icon.startsWith("/") || icon.startsWith("http"));

    return (
        <div className="choose-box" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="choose-content" style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                <div className="choose-icon">
                    {isImageUrl ? (
                        <Image src={icon} alt={title} width={60} height={60} />
                    ) : (
                        <i className={icon || "tji-box"}></i>
                    )}
                </div>
                <h4 className="title">{title}</h4>
                <p className="desc"    style={{ flexGrow: 1 }}>{desc}</p>
            </div> 
        </div>
    );
};

const FeaturesSlider = ({ features }) => {
    if (!features || features.length === 0) return null;

    return (
        <div className="row mt-4">
            <div className="col-12">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                    }}
                    className="features-swiper rightSwipeWrap"
                >
                    {features.map((feature, idx) => (
                        <SwiperSlide key={idx}>
                            <FeatureCard feature={feature} idx={idx} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};

export default FeaturesSlider;