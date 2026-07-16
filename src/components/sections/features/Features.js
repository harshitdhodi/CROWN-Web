import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import dynamic from "next/dynamic";

const FeaturesSlider = dynamic(
	() => import("@/components/shared/cards/FeatureCard")
);

export const revalidate = 60;

const Features = async ({ type }) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

    let features = [];
    let sectionHeading = null;

    try {
        const [missionRes, headingRes] = await Promise.all([
            fetch(`${baseUrl}/api/data/mission_vision`, { next: { revalidate: 60 } }),
            fetch(`${baseUrl}/api/heading?section=mission-vision`, { next: { revalidate: 60 } }),
        ]);

        if (!missionRes.ok) {
            console.error("Mission API failed:", missionRes.status, await missionRes.text());
        }
        if (!headingRes.ok) {
            console.error("Heading API failed:", headingRes.status, await headingRes.text());
        }

        const missionData = missionRes.ok ? await missionRes.json() : { data: [] };
        const headingData = headingRes.ok ? await headingRes.json() : null;

        console.log("Fetched Mission & Vision Data:", { missionData, headingData });

        features =
            missionData?.data?.map((item) => {
                const imgUrl = item.image?.startsWith("/")
                    ? `${baseUrl}${item.image}`
                    : item.image || item.img;
                return {
                    ...item,
                    title: item.heading,
                    desc: item.details,
                    icon: imgUrl,
                    img: imgUrl,
                    imgLarge: imgUrl,
                };
            }) || [];

        sectionHeading = headingData?.success ? headingData.data : null;

        console.log("Fetched Features Data:", { features, sectionHeading });
    } catch (error) {
        console.error("Error fetching Features data:", error);
    }

    return (
        <section id="choose" className="tj-working-process section-gap">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        {type == 2 ? (
                            <div className="sec-heading-wrap ">
                                <span className="sub-title wow fadeInUp bg-white border-0 rounded-lg" data-wow-delay=".3s">
                                    <i className="tji-box"></i>
                                     {sectionHeading?.tagline || "Choose the Best2"}
                                </span>
                                <div className="heading-wrap-content d-flex flex-column flex-lg-row align-items-start align-items-lg-center">
                                    <div className="sec-heading mb-lg-0">
                                        <h2 className="sec-title title-anim">
                                            {sectionHeading?.heading || "Empowering Business with Expertise."}
                                        </h2>
                                    </div>
                                    <div className="btn-wrap wow fadeInUp" data-wow-delay=".6s">
                                        <ButtonPrimary text="Request a Call" url="/contact" />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="sec-heading text-center">
                                <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
                                    <i className="tji-box"></i>
                                    {sectionHeading?.tagline || "Choose the Best"}
                                </span>
                                <h2 className="sec-title title-anim">
                                    {sectionHeading?.heading || "Empowering Business with Expertise."}
                                </h2>
                            </div>
                        )}
                    </div>
                </div>

                <FeaturesSlider features={features} />
            </div>
        </section>
    );
};

export default Features;