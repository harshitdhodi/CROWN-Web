"use client";

import React from "react";
import { useInView } from "react-intersection-observer";

const LazyMap = ({ src, width = "100%", height = "100%", style = {}, ...props }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // Only trigger once
        rootMargin: "200px 0px", // Start loading slightly before it comes into view
    });

    return (
        <div ref={ref} style={{ width, height, ...style }} className="lazy-map-container">
            {inView ? (
                <iframe
                    src={src}
                    width={width}
                    height={height}
                    style={{ border: 0, ...style }}
                    loading="lazy"
                    allowFullScreen=""
                    referrerPolicy="no-referrer-when-downgrade"
                    {...props}
                />
            ) : (
                <div 
                    className="lazy-map-placeholder" 
                    style={{ 
                        width: "100%", 
                        height: "100%", 
                        background: "#e9ecef", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        borderRadius: style.borderRadius || 0
                    }}
                >
                    <span style={{ color: "#6c757d", fontSize: "14px" }}>Loading Map...</span>
                </div>
            )}
        </div>
    );
};

export default LazyMap;
