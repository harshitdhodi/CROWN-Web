"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const DownloadCenter = () => {
    const [resources, setResources] = useState([]);
    const [headingData, setHeadingData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageErrors, setImageErrors] = useState({});

    const fetchData = async () => {
        try {
            const [resourcesRes, headingRes] = await Promise.all([
                fetch("/api/data/resources"),
                fetch("/api/heading?section=resource")
            ]);

            const resourcesJson = await resourcesRes.json();
            const headingJson = await headingRes.json();
            console.log("resources", resourcesJson);
            console.log("heading", headingJson);
            if (resourcesJson.success && Array.isArray(resourcesJson.data)) {
                setResources(resourcesJson.data);
            }

            if (headingJson.success && headingJson.data) {
                setHeadingData(headingJson.data);
            }
        } catch (err) {
            console.error("Error fetching resources data:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const tagline = headingData?.tagline || "Download Center";
    const mainHeading = headingData?.heading || "Download Our Resources";
    const subHeading = headingData?.subheading || "Access all our downloadable resources in one place. Choose from catalogs, guides, and documents to help you make informed decisions.";

    if (loading) {
        return (
            <section className="tj-download-center section-gap">
                <div className="container">
                    <div className="text-center">Loading resources...</div>
                </div>
            </section>
        );
    }

    return (
        <section className="tj-download-center section-gap">
            <style>{`
                .tj-download-center {
                    background: radial-gradient(circle at top left, color-mix(in srgb, var(--tj-color-theme-bg) 85%, var(--tj-color-theme-bg-2)), var(--tj-color-theme-bg));
                    padding: 50px 0;
                    position: relative;
                }
                .tj-download-center .sec-heading {
                    margin-bottom: 60px;
                }
                .tj-download-center .sub-title {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: color-mix(in srgb, var(--tj-color-theme-primary) 12%, transparent);
                    color: var(--tj-color-theme-primary);
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 6px 16px;
                    border-radius: 100px;
                    margin-bottom: 18px;
                }
                .tj-download-center .sec-title {
                    color: var(--tj-color-heading-primary);
                    font-size: clamp(28px, 4vw, 42px);
                    font-weight: 700;
                    line-height: 1.2;
                    margin-bottom: 0;
                }
                .tj-download-center .sec-subtitle-text {
                    color: var(--tj-color-text-body);
                    font-size: 16px;
                    line-height: 1.7;
                    max-width: 600px;
                    margin: 16px auto 0;
                }
                .tj-download-center .download-card {
                    background: var(--tj-color-common-white);
                    border: 1px solid color-mix(in srgb, var(--tj-color-border-1) 60%, transparent);
                    border-radius: 20px;
                    padding: 40px 30px 32px;
                    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                                box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                                border-color 0.4s ease;
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
                }
                .tj-download-center .download-card:hover {
                    transform: translateY(-10px) scale(1.01);
                    box-shadow: 0 20px 40px color-mix(in srgb, var(--tj-color-theme-primary) 10%, transparent);
                    border-color: var(--tj-color-theme-primary);
                }
                .tj-download-center .download-icon-wrapper {
                    width: 68px;
                    height: 68px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    font-size: 28px;
                    margin-bottom: 24px;
                    background: color-mix(in srgb, var(--tj-color-theme-primary) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--tj-color-theme-primary) 15%, transparent);
                    color: var(--tj-color-theme-primary);
                    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                }
                .tj-download-center .download-icon-wrapper img {
                    max-width: 80%;
                    max-height: 80%;
                    width: auto;
                    height: auto;
                    object-fit: contain;
                    border-radius: 8px;
                }
                .tj-download-center .download-card:hover .download-icon-wrapper {
                    background: color-mix(in srgb, var(--tj-color-theme-primary) 15%, transparent);
                    border-color: var(--tj-color-theme-primary);
                    box-shadow: 0 8px 16px color-mix(in srgb, var(--tj-color-theme-primary) 12%, transparent);
                }
                .tj-download-center .download-title {
                    color: var(--tj-color-heading-primary);
                    font-size: 20px;
                    font-weight: 700;
                    margin-bottom: 12px;
                    line-height: 1.4;
                    transition: color 0.3s ease;
                }
                .tj-download-center .download-card:hover .download-title {
                    color: var(--tj-color-theme-primary);
                }
                .tj-download-center .download-description {
                    color: var(--tj-color-text-body-3);
                    font-size: 14px;
                    line-height: 1.7;
                    flex: 1;
                    margin-bottom: 0;
                }
                .tj-download-center .download-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding-top: 20px;
                    margin-top: 24px;
                    border-top: 1px solid color-mix(in srgb, var(--tj-color-border-1) 40%, transparent);
                }
                .tj-download-center .document-count {
                    font-size: 13px;
                    font-weight: 500;
                    color: var(--tj-color-text-body-2);
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .tj-download-center .document-count i {
                    color: var(--tj-color-text-body-3);
                }
                .tj-download-center .download-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    color: var(--tj-color-theme-primary);
                    background: color-mix(in srgb, var(--tj-color-theme-primary) 8%, transparent);
                    border: 1px solid color-mix(in srgb, var(--tj-color-theme-primary) 20%, transparent);
                    border-radius: 100px;
                    padding: 8px 18px;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    text-decoration: none;
                    white-space: nowrap;
                }
                .tj-download-center .download-btn:hover {
                    background: var(--tj-color-theme-primary);
                    color: var(--tj-color-common-white);
                    border-color: var(--tj-color-theme-primary);
                    box-shadow: 0 4px 12px color-mix(in srgb, var(--tj-color-theme-primary) 25%, transparent);
                }
            `}</style>

            <div className="container">
                {/* Section Header */}
                <div className="row">
                    <div className="col-12">
                        <div className="sec-heading text-center">
                            <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                                <i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
                                {tagline}
                            </span>
                            <h2 className="sec-title  wow fadeInUp" data-wow-delay=".5s">
                                {mainHeading}
                            </h2>
                            <p className="sec-subtitle-text wow fadeInUp" data-wow-delay=".7s">
                                {subHeading}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Download Resources Grid */}
                <div className="row row-gap-4">
                    {resources.length > 0 ? (
                        resources.map((resource, idx) => (
                            <div className="col-lg-4 col-md-6 col-sm-12" key={resource.id}>
                                <div
                                    className="download-card wow fadeInUp h-100"
                                    data-wow-delay={`${(idx + 1) * 0.1}s`}
                                    style={{ "--card-accent": "var(--tj-color-theme-primary)" }}
                                >
                                    <div
                                        className="download-icon-wrapper"
                                    >
                                        {resource.image && !imageErrors[resource.id] ? (
                                            <img
                                                src={
                                                    typeof resource.image === 'string'
                                                        ? resource.image
                                                        : typeof resource.image === 'object' && resource.image.url
                                                            ? resource.image.url
                                                            : `${process.env.NEXT_PUBLIC_BASE_URL || ''}${resource.image}`
                                                }
                                                alt={resource.title}
                                                onError={() => {
                                                    setImageErrors(prev => ({ ...prev, [resource.id]: true }));
                                                }}
                                            />
                                        ) : (
                                            <i className="fa-light fa-file-pdf" aria-hidden="true"></i>
                                        )}
                                    </div>
                                    <h4 className="download-title">{resource.title}</h4>
                                    <p className="download-description">{resource.description}</p>

                                    <div className="download-footer">
                                        <span className="document-count">
                                            <i className="fa-light fa-file-pdf"></i>
                                            1 document
                                        </span>
                                        <a
                                            href={resource.pdf}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="download-btn"
                                        >
                                            <i className="ti ti-download" aria-hidden="true"></i>
                                            Download
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p className="text-muted">No resources available at this time.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default DownloadCenter;

