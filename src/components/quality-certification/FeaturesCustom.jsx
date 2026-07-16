const FeaturesCustom = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    let features = [];
    let sectionHeading = null;

    try {
        const [missionRes, headingRes] = await Promise.all([
            fetch(`${baseUrl}/api/data/compliance-standards`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/heading?section=compliance-standards`, { next: { revalidate: 60 } }),
        ]);

        if (!missionRes.ok) {
            console.error("Mission API failed:", missionRes.status, await missionRes.text());
        }
        if (!headingRes.ok) {
            console.error("Heading API failed:", headingRes.status, await headingRes.text());
        }

        const missionData = missionRes.ok ? await missionRes.json() : { data: [] };
        const headingData = headingRes.ok ? await headingRes.json() : null;

        features =
            missionData?.data?.map((item) => ({
                ...item,
                title: item.title,
                desc: item.description,
                icon: item.image?.startsWith("/")
                    ? `${baseUrl}${item.image}`
                    : item.image || item.img,
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
                                <i className="tji-box"></i>
                                {sectionHeading?.tagline || "Choose the Best"}
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
                                <div className="choose-box choose-icon-style">
                                    <div className="choose-content">
                                        <div className="choose-icon">
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
                    border: 1px dashed var(--tj-color-border-1) !important;
                }

                .choose-icon-style .choose-icon img {
                    width: 60px;
                    height: 60px;
                    object-fit: contain;
}
                .choose-icon-style .choose-icon {
                    width: 140px;
                    height: 100px;
                    aspect-ratio: 1 / 1; 
                    background-color: var(--tj-color-grey-1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 30px;
                    transition: all 0.4s ease;
                    color: var(--tj-color-theme-primary);
                    flex-shrink: 0;
                    overflow: hidden;
                }
                .choose-icon-style .choose-icon img {
                    width: 60px;
                    height: auto;
                    object-fit: contain;
                }
                .choose-icon-style:hover .icon-light {
                    display: none;
                }
                .choose-icon-style:hover .icon-dark {
                    display: block;
                    filter: brightness(0) invert(1);
                }
                .choose-icon-style:hover .choose-icon {
                    background-color: var(--tj-color-theme-primary);
                    box-shadow: 0 10px 30px rgba(30, 138, 138, 0.25);
                 
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