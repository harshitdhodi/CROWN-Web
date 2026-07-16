import Portfolios6 from "./Portfolios6";

const CMS_BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";

async function getIndustryData() {
    try {
        const [headingRes, dataRes] = await Promise.all([
            fetch(`${CMS_BASE_URL}/api/heading?section=industry`, {
                next: { revalidate: 0 },
            }),
            fetch(`${CMS_BASE_URL}/api/data/industry`, {
                next: { revalidate: 0 },
            }),
        ]);

        const headingData = headingRes.ok ? await headingRes.json() : null;
        const industryData = dataRes.ok ? await dataRes.json() : null;

        const resolveImg = (src) => {
            if (!src) return null;
            if (Array.isArray(src)) return resolveImg(src[0]);
            if (typeof src !== "string") return null;
            return src.startsWith("http://") || src.startsWith("https://")
                ? src
                : src.startsWith("/")
                    ? `${CMS_BASE_URL}${src}`
                    : `${CMS_BASE_URL}/${src}`;
        };

        const formattedPortfolio = (industryData?.data || []).map(item => {
            const resolvedImg = resolveImg(item.image);
            return {
                ...item,
                category: item.tag,
                img: resolvedImg,
                img6: resolvedImg,
                imgLarge: resolvedImg,
            };
        });

        return {
            heading: headingData?.success ? headingData.data : null,
            portfolio: formattedPortfolio,
        };
    } catch (error) {
        console.error("Error fetching industry data:", error);
        return { heading: null, portfolio: [] };
    }
}

const Portfolios6Wrapper = async () => {
    const { heading, portfolio } = await getIndustryData();
    return <div className="section-gap">
        <Portfolios6 heading={heading} portfolio={portfolio} />
    </div> ;
};

export default Portfolios6Wrapper;