"use client";
import ContactForm from "@/components/sections/contacts/ContactForm";
import LazyMap from "@/components/shared/LazyMap";

const Contact3 = ({ mapUrl, formHeading }) => {
    const headingText = typeof formHeading === 'string'
        ? formHeading
        : (formHeading?.form_heading || "Feel Free to Get in Touch or Visit our Location.");

    return (
        <section className="tj-contact-section-2 section-gap section-bottom-gap">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6">
                        <div className="wow fadeInUp" data-wow-delay=".1s">
                            <h3 className="title" style={{ marginBottom: "30px" }}>{headingText}</h3>
                            <ContactForm redirectPath="/contact/thank-you" />
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div
                            className="map-area wow fadeInUp"
                            data-wow-delay=".3s"
                            style={{
                                backgroundColor: 'var(--tj-color-theme-dark)',
                                borderRadius: '8px',
                                overflow: 'hidden'
                            }}
                        >
                            {(() => {
                                if (!mapUrl) return "Map not found";
                                
                                let iframeSrc = mapUrl;
                                // If the user provided an iframe HTML string, extract the src
                                if (mapUrl.includes("<iframe")) {
                                    const match = mapUrl.match(/src="([^"]+)"/);
                                    if (match) iframeSrc = match[1];
                                } 
                                // If the user provided a raw address (not a URL), generate Google Maps embed URL
                                else if (!mapUrl.startsWith("http")) {
                                    iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&t=m&z=15&output=embed&iwloc=near`;
                                }

                                return (
                                    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="map-link d-block h-100">
                                        <LazyMap
                                            src={iframeSrc}
                                            width="100%"
                                            height="100%"
                                            style={{
                                                border: 0,
                                                filter: 'grayscale(100%) contrast(1.2)',
                                                opacity: 0.6,
                                                mixBlendMode: 'luminosity'
                                            }}
                                            loading="lazy"
                                            allowFullScreen=""
                                        />
                                    </a>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact3;
