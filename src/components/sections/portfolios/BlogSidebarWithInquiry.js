"use client";
import Link from "next/link";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Image from "next/image";
import sliceText from "@/libs/sliceText";
import { useState } from "react";
import dynamic from "next/dynamic";

const PhoneInput = dynamic(() => import("react-phone-input-2"), { ssr: false });
import "react-phone-input-2/lib/style.css";

const BlogSidebarWithInquiry = ({ recentBlogs }) => {
    const [phone, setPhone] = useState("");

    return (
        <aside className="tj-blog-sidebar">

            {/* Recent Blogs Widget */}
            <div className="tj-sidebar-widget tj-recent-posts">
                <h4 className="widget-title">Related post</h4>
                <ul>
                    {recentBlogs?.length
                        ? recentBlogs?.map(({ title, date, img, slug }, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: idx !== recentBlogs.length - 1 ? '20px' : '0' }}>
                                <div style={{ flexShrink: 0, width: '80px', height: '80px' }}>
                                    <Link href={`/blogs/${slug}`}>
                                        <Image
                                            src={img || "/images/blog/post-1.webp"}
                                            alt="Blog"
                                            width={80}
                                            height={80}
                                            className="object-cover rounded-md"
                                            style={{ width: '100%', height: '100%' }}
                                        />
                                    </Link>
                                </div>
                                <div className="post-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '80px', flex: 1 }}>
                                    <h6 className="post-title" style={{ marginBottom: '6px', lineHeight: '1.3', fontSize: '15px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        <Link href={`/blogs/${slug}`}>
                                            {sliceText(title, 35, true)}
                                        </Link>
                                    </h6>
                                    <div className="blog-meta">
                                        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                                            <li style={{ margin: 0, fontSize: '13px', color: 'var(--tj-color-text-body)' }}>{date}</li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        ))
                        : ""}
                </ul>
            </div>

            {/* Inquiry Form Widget (Replaces Category) */}
            <div className="tj-sidebar-widget widget_inquiry">
                <div className="inquiry-form-header ">

                    <h4 className="widget-title " style={{ marginBottom: 0 }}>
                        Inquiry Form
                    </h4>
                    <p className="inquiry-subtitle">
                        Get in touch with us for more details
                    </p>
                </div>
                <div className="sidebar-inquiry-form">
                    <form action="#" className="inquiry-form-modern">
                        <div className="form-input inquiry-field">
                            <label className="inquiry-label">Full Name</label>
                            <div className="inquiry-input-wrap">
                                <i className="tji-user"></i>
                                <input
                                    type="text"
                                    placeholder="Enter your full name"
                                    required
                                    id="inquiry-name"
                                />
                            </div>
                        </div>
                        <div className="form-input inquiry-field">
                            <label className="inquiry-label">Email Address</label>
                            <div className="inquiry-input-wrap">
                                <i className="tji-envelope"></i>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    id="inquiry-email"
                                />
                            </div>
                        </div>
                        <div className="form-input inquiry-field">
                            <label className="inquiry-label">Mobile Number</label>
                            <div className="inquiry-phone-wrap">
                                <PhoneInput
                                    country={"in"}
                                    value={phone}
                                    onChange={(val) => setPhone(val)}
                                    inputProps={{
                                        name: "phone",
                                        required: true,
                                        id: "inquiry-phone",
                                    }}
                                    containerClass="inquiry-phone-container"
                                    inputClass="inquiry-phone-input"
                                    buttonClass="inquiry-phone-button"
                                    dropdownClass="inquiry-phone-dropdown"
                                    enableSearch={true}
                                    searchPlaceholder="Search country..."
                                    preferredCountries={["in", "us", "gb", "au", "ca", "ae"]}
                                />
                            </div>
                        </div>
                        <div className="form-input inquiry-field">
                            <label className="inquiry-label">Your Message</label>
                            <div className="inquiry-input-wrap inquiry-textarea-wrap">
                                <i className="tji-comment" style={{ alignSelf: "flex-start", marginTop: "4px" }}></i>
                                <textarea
                                    placeholder="Write your message here..."
                                    required
                                    id="inquiry-message"
                                    rows={4}
                                ></textarea>
                            </div>
                        </div>
                        <div className="inquiry-btn">
                            <ButtonPrimary text="Submit Inquiry" type="submit" className="inquiry-submit-btn" />
                        </div>
                    </form>
                </div>
            </div>

            {/* Phone input CSS imported via style tag for SSR compatibility */}
            <style jsx global>{`


                /* ── Search Widget Improvements ── */
                .widget_search .search-input-group {
                    display: flex;
                    align-items: center;
                    background: var(--tj-color-common-white);
                    border: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px;
                    padding: 2px 6px 2px 16px;
                    transition: all 0.3s ease;
                }
                .widget_search .search-input-group:focus-within {
                    border-color: var(--tj-color-theme-primary);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
                }
                .widget_search input {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    height: 46px;
                    font-size: 15px;
                    color: var(--tj-color-heading-primary);
                }
                .widget_search button {
                    background: var(--tj-color-theme-primary);
                    color: var(--tj-color-common-white);
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                    transition: all 0.3s ease;
                }
                .widget_search button:hover {
                    background: var(--tj-color-heading-primary);
                    transform: translateY(-1px);
                }

                /* ── Inquiry Form Header ── */
                .inquiry-form-header {
                    text-align: left;
                    margin-bottom: 28px;
                    padding-bottom: 20px;
                    border-bottom: 1px dashed var(--tj-color-border-1);
                }
                .inquiry-icon-wrap {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: var(--tj-color-theme-primary);
                    color: #ebf1f1;
                    font-size: 22px;
                    margin-bottom: 14px;
                    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
                }
                .inquiry-subtitle {
                    font-size: 14px;
                    color: var(--tj-color-text-body);
                    margin: 6px 0 0;
                    line-height: 1.4;
                }

                /* ── Form Fields ── */
                .inquiry-form-modern {
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }
                .inquiry-field {
                    margin-bottom: 0 !important;
                }
                .inquiry-label {
                    display: block;
                    font-size: 13px;
                    font-weight: 600;
                    color: var(--tj-color-heading-primary);
                    margin-bottom: 6px;
                    letter-spacing: 0.02em;
                    text-transform: uppercase;
                }
                .inquiry-input-wrap {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    background: var(--tj-color-common-white);
                    border: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px;
                    padding: 0 14px;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease;
                }
                .inquiry-input-wrap:focus-within {
                    border-color: var(--tj-color-theme-primary);
                    box-shadow: 0 0 0 3px rgba(var(--tj-color-theme-primary-rgb, 0, 123, 255), 0.1);
                }
                .inquiry-input-wrap i {
                    font-size: 16px;
                    color: var(--tj-color-text-body);
                    flex-shrink: 0;
                    opacity: 0.6;
                    transition: color 0.2s ease, opacity 0.2s ease;
                }
                .inquiry-input-wrap:focus-within i {
                    color: var(--tj-color-theme-primary);
                    opacity: 1;
                }
                .inquiry-input-wrap input,
                .inquiry-input-wrap textarea {
                    flex: 1;
                    border: none;
                    outline: none;
                    background: transparent;
                    padding: 12px 0;
                    font-size: 15px;
                    color: var(--tj-color-heading-primary);
                    font-family: inherit;
                    line-height: 1.5;
                }
                .inquiry-input-wrap input::placeholder,
                .inquiry-input-wrap textarea::placeholder {
                    color: var(--tj-color-text-body);
                    opacity: 0.5;
                }
                .inquiry-textarea-wrap {
                    align-items: flex-start;
                    padding-top: 12px;
                }
                .inquiry-textarea-wrap textarea {
                    min-height: 100px;
                    resize: vertical;
                    padding: 0;
                }

                /* ── Phone Input Overrides ── */
                .inquiry-phone-wrap {
                    position: relative;
                }
                .inquiry-phone-container.react-tel-input {
                    font-family: inherit;
                }
                .inquiry-phone-container .form-control.inquiry-phone-input {
                    width: 100%;
                    height: 46px;
                    font-size: 15px;
                    color: var(--tj-color-heading-primary);
                    background: var(--tj-color-common-white);
                    border: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px;
                    padding-left: 52px;
                    font-family: inherit;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease;
                }
                .inquiry-phone-container .form-control.inquiry-phone-input:focus {
                    border-color: var(--tj-color-theme-primary);
                    box-shadow: 0 0 0 3px rgba(var(--tj-color-theme-primary-rgb, 0, 123, 255), 0.1);
                }
                .inquiry-phone-container .flag-dropdown.inquiry-phone-button {
                    background: transparent;
                    border: none;
                    border-right: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px 0 0 10px;
                    padding: 0 8px;
                    transition: background-color 0.2s ease;
                }
                .inquiry-phone-container .flag-dropdown.inquiry-phone-button:hover,
                .inquiry-phone-container .flag-dropdown.inquiry-phone-button.open {
                    background: rgba(0, 0, 0, 0.03);
                }
                .inquiry-phone-container .flag-dropdown .selected-flag {
                    padding: 0 4px;
                    width: 42px;
                }
                .inquiry-phone-container .flag-dropdown .selected-flag .arrow {
                    left: 22px;
                }
                .inquiry-phone-dropdown.country-list {
                    border-radius: 10px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
                    border: 1px solid var(--tj-color-border-1);
                    margin-top: 4px;
                    max-height: 220px;
                    width: 280px !important;
                }
                .inquiry-phone-dropdown .search {
                    padding: 10px 12px;
                    border-bottom: 1px solid var(--tj-color-border-1);
                }
                .inquiry-phone-dropdown .search-box {
                    width: 100%;
                    padding: 8px 10px;
                    border: 1.5px solid var(--tj-color-border-1);
                    border-radius: 6px;
                    font-size: 13px;
                    outline: none;
                    transition: border-color 0.2s ease;
                }
                .inquiry-phone-dropdown .search-box:focus {
                    border-color: var(--tj-color-theme-primary);
                }
                .inquiry-phone-dropdown .country {
                    padding: 10px 14px 10px 46px !important;
                    transition: background-color 0.15s ease;
                    text-align: left;
                }
                .inquiry-phone-dropdown .country:hover,
                .inquiry-phone-dropdown .country.highlight {
                    background-color: var(--tj-color-theme-bg) !important;
                }
                .inquiry-phone-dropdown .country .country-name {
                    font-size: 13px;
                    color: var(--tj-color-heading-primary);
                    margin-right: 6px;
                }
                .inquiry-phone-dropdown .country .dial-code {
                    font-size: 13px;
                    color: var(--tj-color-text-body);
                }
                .inquiry-phone-container .flag-dropdown.inquiry-phone-button {
                    background: transparent;
                    border: none;
                    border-right: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px 0 0 10px;
                    width: 50px;
                }
                .inquiry-phone-container .form-control.inquiry-phone-input {
                    width: 100%;
                    height: 46px;
                    font-size: 15px;
                    color: var(--tj-color-heading-primary);
                    background: var(--tj-color-common-white);
                    border: 1.5px solid var(--tj-color-border-1);
                    border-radius: 10px;
                    padding-left: 60px;
                    font-family: inherit;
                    transition: border-color 0.25s ease, box-shadow 0.25s ease;
                }

                /* ── Submit Button ── */
                .inquiry-btn {
                    padding-top: 4px;
                }
                .inquiry-btn .tj-primary-btn.inquiry-submit-btn {
                    width: 100%;
                    justify-content: center;
                    border-radius: 10px;
                }

                /* ── Widget Inquiry Container Override ── */
                .widget_inquiry {
                    background: linear-gradient(180deg, var(--tj-color-theme-bg) 0%, var(--tj-color-common-white) 100%) !important;
                    border: 1.5px solid var(--tj-color-border-1);
                    overflow: visible;
                }
            `}</style>
        </aside>
    );
};

export default BlogSidebarWithInquiry;