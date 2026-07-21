'use client';

import Link from "next/link";

const ContactTop = ({ headingData, contactData }) => {
    const tagline = headingData?.tagline || "Contact info";
    const mainHeading = headingData?.heading || "Reach Out to Us";

    const address = contactData?.address || "993 Renner Burg, West Rond, MT 94251-030";

    const rawEmail = contactData?.email;
    const email = Array.isArray(rawEmail)
        ? rawEmail[0] || "support@CROWN Packaging.com"
        : String(rawEmail || "support@CROWN Packaging.com");

    const rawMobile = contactData?.mobile;
    const mobile = Array.isArray(rawMobile)
        ? rawMobile[0] || "+1 (009) 544-7818"
        : String(rawMobile || "+1 (009) 544-7818");

    const locationLabel = contactData?.location_label || "Our Location";
    const emailLabel = contactData?.email_label || "Email us";
    const callLabel = contactData?.call_label || "Call us";
    const whatsappLabel = contactData?.whatsapp_label || "WhatsApp";

    const mapUrl = contactData?.mapurl || "#";
    const whatsappUrl = `https://wa.me/${mobile.replace(/\D/g, "")}`;

    return (
        <div className="tj-contact-area section-gap">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="sec-heading text-center">
                            <span className="sub-title wow fadeInUp" data-wow-delay=".1s">
                                <i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
                                {tagline}
                            </span>
                            <h2 className="sec-title ">
                                <span>{mainHeading}</span>
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="row row-gap-4">
                    {/* Location */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <Link
                            href={mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-item style-2 wow justify-center items-center fadeInUp h-100 d-flex flex-column"
                            data-wow-delay=".3s"
                        >
                            <div className="contact-icon items-center">
                                <i className="tji-location-3"></i>
                            </div>
                            <h3 className="contact-title">{locationLabel}</h3>
                            <p className="flex-grow-1 text-break">{address}</p>
                        </Link>
                    </div>

                    {/* Email */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <Link
                            href={`mailto:${email}`}
                            className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column"
                            data-wow-delay=".5s"
                        >
                            <div className="contact-icon">
                                <i className="tji-envelop"></i>
                            </div>
                            <h3 className="contact-title">{emailLabel}</h3>
                            <ul className="contact-list flex-grow-1">
                                <li className="text-break d-flex align-items-center justify-content-center gap-2">
                                  {email}
                                  <span className="d-inline-flex align-items-center" style={{ cursor: 'pointer', color: 'var(--tj-theme-primary, #c29742)' }} data-copy="Email" data-copy-text={email} title="Copy Email">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-copy="Email" data-copy-text={email}>
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </span>
                                </li>
                            </ul>
                        </Link>
                    </div>

                    {/* Phone */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <Link
                            href={`tel:${mobile}`}
                            className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column"
                            data-wow-delay=".7s"
                        >
                            <div className="contact-icon">
                                <i className="tji-phone"></i>
                            </div>
                            <h3 className="contact-title">{callLabel}</h3>
                            <ul className="contact-list flex-grow-1">
                                <li className="d-flex align-items-center justify-content-center gap-2">
                                  {mobile}
                                  <span className="d-inline-flex align-items-center" style={{ cursor: 'pointer', color: 'var(--tj-theme-primary, #c29742)' }} data-copy="Phone" data-copy-text={mobile} title="Copy Phone">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-copy="Phone" data-copy-text={mobile}>
                                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                  </span>
                                </li>
                            </ul>
                        </Link>
                    </div>

                    {/* WhatsApp */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <Link
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column"
                            data-wow-delay=".9s"
                        >
                            <div className="contact-icon">
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <h3 className="contact-title">{whatsappLabel}</h3>
                            <ul className="contact-list flex-grow-1">
                                <li>Chat on WhatsApp</li>
                            </ul>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactTop;