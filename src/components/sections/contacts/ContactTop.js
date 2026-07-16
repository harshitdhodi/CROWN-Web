'use client';

import Link from "next/link";

const ContactTop = ({ headingData, contactData }) => {
    const tagline = headingData?.tagline || "Contact info";
    const mainHeading = headingData?.heading || "Reach Out to Us";

    const address = contactData?.address || "993 Renner Burg, West Rond, MT 94251-030";
    const email = contactData?.email || "support@wiretex.com";
    const mobile = contactData?.mobile || "+1 (009) 544-7818";

    return (
        <div className="tj-contact-area section-gap">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="sec-heading text-center">
                            <span className="sub-title wow fadeInUp" data-wow-delay=".1s">
                                <i className="tji-box"></i>
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
                        <div className="contact-item style-2 wow justify-center items-center fadeInUp h-100 d-flex flex-column" data-wow-delay=".3s">
                            <div className="contact-icon items-center">
                                <i className="tji-location-3"></i>
                            </div>
                            <h3 className="contact-title">Our Location</h3>
                            <p className="flex-grow-1 text-break">{address}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <div className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column" data-wow-delay=".5s">
                            <div className="contact-icon">
                                <i className="tji-envelop"></i>
                            </div>
                            <h3 className="contact-title">Email us</h3>
                            <ul className="contact-list flex-grow-1">
                                <li className="text-break">
                                    <Link href={`mailto:${email}`}>{email}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <div className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column" data-wow-delay=".7s">
                            <div className="contact-icon">
                                <i className="tji-phone"></i>
                            </div>
                            <h3 className="contact-title">Call us</h3>
                            <ul className="contact-list flex-grow-1">
                                <li>
                                    <Link href={`tel:${mobile}`}>{mobile}</Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="col-xl-3 col-lg-6 col-sm-6">
                        <div className="contact-item style-2 wow fadeInUp justify-center items-center h-100 d-flex flex-column" data-wow-delay=".9s">
                            <div className="contact-icon">
                                <i className="fa-brands fa-whatsapp"></i>
                            </div>
                            <h3 className="contact-title">WhatsApp</h3>
                            <ul className="contact-list flex-grow-1">
                                <li>
                                    <Link href={`https://wa.me/${mobile.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</Link>
                                </li>
                                <li className="active">
                                    <Link href="/contact">Need help?</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactTop;