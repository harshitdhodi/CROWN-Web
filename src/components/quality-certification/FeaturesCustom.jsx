import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

const FeaturesCustom = async () => {
    const cmsBase = getCmsBase();

    let features = [];
    let sectionHeading = null;

    try {
        const [missionRes, headingRes] = await Promise.all([
            fetch(`${cmsBase}/api/data/compliance-standards`, { next: { revalidate: 0 } }),
            fetch(`${cmsBase}/api/heading?section=compliance-standards`, { next: { revalidate: 0 } }),
        ]);

        if (!missionRes.ok) {
            console.error("Compliance Standards API failed:", missionRes.status, await missionRes.text().catch(() => ''));
        }
        if (!headingRes.ok) {
            console.error("Heading API failed:", headingRes.status, await headingRes.text().catch(() => ''));
        }

        const missionData = missionRes.ok ? await missionRes.json() : { data: [] };
        const headingData = headingRes.ok ? await headingRes.json() : null;

        features =
            missionData?.data
                ?.filter((item) => item.title || item.heading || item.description || item.details || item.image || item.img)
                ?.map((item) => ({
                    ...item,
                    title: item.title || item.heading || "Information pending",
                    desc: item.description || item.details || "Information pending",
                    icon: resolveCmsImage(item.image || item.img),
                })) || [];

        sectionHeading = headingData?.success ? headingData.data : null;
    } catch (error) {
        console.error("Error fetching Features data:", error);
    }

    return (
        <section id="choose" className="tj-working-process section-gap">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="sec-heading  sec-heading-wrap text-center">
                            <span className="sub-title wow fadeInUp bg-transparent border border-dashed border-gray-300 px-3 py-1 rounded-full" data-wow-delay=".3s" style={{ border: '1px dashed var(--tj-color-border-1)' }}>
                                <i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>
                                {sectionHeading?.tagline || "Choose1 the Best"}
                            </span>
                            <h2 className="max-w-4xl mx-auto sec-title title-anim">
                                {sectionHeading?.heading || "Empowering Business with Expertise."}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-10">
                    {features?.length ? (
                        features.map((feature, idx) => (
                            <div key={idx} className="col-lg-3 col-12 col-sm-6">
                                <div className="choose-box choose-icon-style ">
                                    <div className="choose-content">
                                        <div className="choose-icon">
                                            {feature.icon ? (
                                                <>
                                                    <img
                                                        src={feature.icon}
                                                        alt={feature.title}
                                                        className="icon-light"
                                                    />
                                                    <img
                                                        src={feature.icon}
                                                        alt={feature.title}
                                                        className="icon-dark"
                                                    />
                                                </>
                                            ) : (
                                                <i className="tji-excellence text-6xl"></i>
                                            )}
                                        </div>
                                        <h4 className="title">{feature.title}</h4>
                                        <p className="desc">{feature.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>No features available.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .choose-icon-style .icon-dark {
                    display: none;
                }
                .choose-icon-style {
                    transition: all 0.3s ease;
                    background-color: transparent !important;
                    border: 1px dashed var(--tj-color-theme-primary) !important;
                }

                .choose-icon-style .choose-icon {
                    width: 120px !important;
                    height: 120px !important;
                    max-width: 120px !important;
                    max-height: 120px !important;
                    min-width: 120px !important;
                    min-height: 120px !important;
                    background-color: var(--tj-color-grey-1) !important;
                    border-radius: 50% !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    margin: 0 auto 30px !important;
                    transition: all 0.4s ease !important;
                    color: var(--tj-color-theme-primary) !important;
                    flex-shrink: 0 !important;
                    overflow: hidden !important;
                    aspect-ratio: 1 / 1 !important;
                }
                .choose-icon-style .choose-icon img {
                    width: 75px !important;
                    height: 75px !important;
                    max-width: 75px !important;
                    max-height: 75px !important;
                    object-fit: contain !important;
                }
                .choose-icon-style:hover .icon-light {
                    display: none !important;
                }
                .choose-icon-style:hover .icon-dark {
                    display: block !important;
                    filter: brightness(0) invert(1) !important;
                }
                .choose-icon-style:hover .choose-icon {
                    animation: none !important;
                    transform: none !important;
                    background-color: var(--tj-color-theme-primary) !important;
                    box-shadow: 0 10px 30px rgba(30, 138, 138, 0.25) !important;
                }
                .choose-icon-style:hover {
                    background-color: #ffffff !important;
                }
                .choose-icon-style:hover .title {
                    color: var(--tj-color-heading-primary) !important;
                }
                .choose-icon-style:hover .desc {
                    color: var(--tj-color-text-body) !important;
                }
            `}</style>
        </section>
    );
};

export default FeaturesCustom;