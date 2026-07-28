"use client";
import ContactForm from "@/components/sections/contacts/ContactForm";
import LazyMap from "@/components/shared/LazyMap";

const Contact3 = ({ mapUrl, formHeading, address }) => {
    const headingText = typeof formHeading === 'string'
        ? formHeading
        : (formHeading?.form_heading || "Feel Free to Get in Touch or Visit our Location.");

    const officeAddress = address || formHeading?.address || "";

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
                                backgroundColor: '#f8fafc',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                        >
                            {(() => {
                                const rawUrl = String(mapUrl || "").trim();
                                let iframeSrc = null;

                                if (rawUrl) {
                                    if (rawUrl.includes("<iframe")) {
                                        const iframeMatch = rawUrl.match(/<iframe.*?src="([^"]+)"/);
                                        if (iframeMatch?.[1]) {
                                            iframeSrc = iframeMatch[1];
                                        }
                                    } else if (rawUrl.includes("google.com/maps/embed") || rawUrl.includes("maps.google.com")) {
                                        iframeSrc = rawUrl;
                                    } else if (rawUrl.includes("maps.app.goo.gl") || rawUrl.includes("goo.gl/maps")) {
                                        const queryLoc = officeAddress || rawUrl;
                                        iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(queryLoc)}&t=m&z=15&output=embed&iwloc=near`;
                                    } else if (!rawUrl.startsWith("http")) {
                                        iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(rawUrl)}&t=m&z=15&output=embed&iwloc=near`;
                                    } else {
                                        iframeSrc = rawUrl;
                                    }
                                } else if (officeAddress) {
                                    iframeSrc = `https://maps.google.com/maps?q=${encodeURIComponent(officeAddress)}&t=m&z=15&output=embed&iwloc=near`;
                                }

                                if (!iframeSrc) {
                                    return (
                                        <div style={{ width: '100%', height: '100%', minHeight: '450px', background: '#e9ecef', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p style={{ color: '#6c757d', fontSize: '14px', margin: 0 }}>Map not available</p>
                                        </div>
                                    );
                                }

                                const directMapLink = officeAddress 
                                    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(officeAddress)}`
                                    : (rawUrl.startsWith("http") ? rawUrl : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(rawUrl)}`);

                                return (
                                    <div className="map-wrapper h-100" style={{ position: 'relative' }}>
                                        <LazyMap
                                            src={iframeSrc}
                                            width="100%"
                                            height="100%"
                                            style={{
                                                border: 0,
                                                minHeight: '450px',
                                                borderRadius: '8px',
                                                display: 'block'
                                            }}
                                            loading="lazy"
                                            allowFullScreen=""
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
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
