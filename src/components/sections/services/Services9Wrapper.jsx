import Services9 from "./Services9";

const CMS_BASE_URL = process.env.CMS_BASE_URL || "http://localhost:3012";

function resolveApiImage(src) {
  if (!src) return null;
  if (Array.isArray(src)) {
    return resolveApiImage(src[0]);
  }
  if (typeof src !== "string") return null;
  let cleanSrc = src;
  if (src.includes("/uploads/")) {
    cleanSrc = "/uploads/" + src.split("/uploads/")[1];
  } else if (src.startsWith("http://") || src.startsWith("https://")) {
    return src;
  }
  return cleanSrc.startsWith("/") ? `${CMS_BASE_URL}${cleanSrc}` : `${CMS_BASE_URL}/${cleanSrc}`;
}

async function getServicesData() {
  try {
    const [headingRes, servicesRes] = await Promise.all([
      fetch(`${CMS_BASE_URL}/api/heading?section=services`, {
        next: { revalidate: 0 },
      }),
      fetch(`${CMS_BASE_URL}/api/data/service`, {
        next: { revalidate: 0 },
      }),
    ]);

    const headingData = headingRes.ok ? await headingRes.json() : null;
    const servicesData = servicesRes.ok ? await servicesRes.json() : null;

    const formattedServices = (servicesData?.data || [])
      .slice(0, 4)
      .map((item) => ({
        ...item,
        // Normalise image fields so ServiceCard10 can use them directly.
        image: resolveApiImage(item.image),
        icon_image: resolveApiImage(item.icon_image),
        // Keep img5 as an alias so the card's fallback chain works.
        img5: resolveApiImage(item.image),
      }));

    return {
      heading: headingData?.success ? headingData.data : null,
      services: formattedServices,
    };
  } catch (error) {
    console.error("Error fetching services data:", error);
    return { heading: null, services: [] };
  }
}

const Services9Wrapper = async () => {
  const { heading, services } = await getServicesData();
  return <div className="section-gap">
    <Services9 heading={heading} services={services} />
  </div>;
};

export default Services9Wrapper;
