"use client";
import "@/app/swiper-styles.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import Image from "next/image";
import { useState } from "react";

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
    const [prevEl, setPrevEl] = useState(null);
    const [nextEl, setNextEl] = useState(null);

    if (!features || features.length === 0) return null;

    return (
        <div className="row mt-4">
            <div className="col-12">
                <Swiper
                    modules={[Pagination, Autoplay, Navigation]}
                    spaceBetween={24}
                    slidesPerView={1}
                    navigation={{ prevEl, nextEl }}
                    autoplay={{ delay: 4000, disableOnInteraction: false }}
                    breakpoints={{
                        576: { slidesPerView: 1 },
                        768: { slidesPerView: 2 },
                        992: { slidesPerView: 3 },
                    }}
                    className="features-swiper"
                >
                    {features.map((feature, idx) => (
                        <SwiperSlide key={idx} style={{ height: "auto" }}>
                            <FeatureCard feature={feature} idx={idx} />
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div className="d-flex align-items-center justify-content-center gap-3 mt-5">
                    <button 
                        ref={(node) => setPrevEl(node)}
                        className="features-prev tj-primary-btn" 
                        style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                    >
                        <i className="tji-arrow-left-long" style={{ fontSize: "16px", color: "var(--tj-color-common-white, white)" }}></i>
                    </button>
                    <button 
                        ref={(node) => setNextEl(node)}
                        className="features-next tj-primary-btn" 
                        style={{ width: "45px", height: "45px", borderRadius: "50%", padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer" }}
                    >
                        <i className="tji-arrow-right-long" style={{ fontSize: "16px", color: "var(--tj-color-common-white, white)" }}></i>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FeaturesSlider;