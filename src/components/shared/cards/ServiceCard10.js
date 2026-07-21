"use client";
import Link from "next/link";
import Image from "next/image";

// Resolve an image URL — handles absolute URLs, root-relative paths, and
// falls back to a local placeholder when the value is missing.
function resolveImage(src, fallback = "/images/service/h9-service-1.webp") {
  if (!src) return fallback;
  // Already an absolute URL (from API with baseUrl prepended)
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  // Root-relative path
  if (src.startsWith("/")) return src;
  // Relative path — make root-relative
  return `/${src}`;
}

const ServiceCard10 = ({ service, idx }) => {
  const {
    title,
    desc3,
    short_description,
    id,
    slug,
    // API fields
    image,
    icon_image,
    // Fakedata fields
    img5,
    iconName,
  } = service || {};

  // Prefer API image, then fakedata img5, then fallback
  const cardImage = resolveImage(image || img5);
  const description =
    desc3 ||
    (short_description ? short_description.replace(/<[^>]+>/g, "") : null) ||
    "Through a combination of data-driven insights and innovative approaches, we work closely with you to develop customized solutions.";

  return (
    <div className="service-item style-5 tj-progress-item">
      <div className="service-content-area">
        <div className="service-icon">
          {icon_image ? (
            <div style={{ position: "relative", width: "48px", height: "48px" }}>
              <Image
                src={resolveImage(icon_image)}
                alt={title || "Service icon"}
                fill
                sizes="48px"
                quality={85}
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
          ) : (
            <i className={iconName || "tji-service-1"}></i>
          )}
        </div>
        <div className="service-content">
          <h4 className="title text-white">
            <Link href={`/contact`}>{title}</Link>
          </h4>
          <p className="desc">{description}</p>
        </div>
        <Link href={`/contact`} className="h9-service-nav" aria-label={`View ${title}`}>
          <i className="tji-arrow-right-long"></i>
        </Link>
      </div>
      <div className="service-img" style={{ position: "relative", width: "100%", minHeight: "300px" }}>
        <Image
          src={cardImage}
          alt={title || "Service"}
          fill
          sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1200px) 400px, 450px"
          quality={80}
          style={{
            objectFit: "cover",
            display: "block",
          }}
          onError={(e) => {
            e.currentTarget.src = "/images/service/h9-service-1.webp";
          }}
        />
      </div>
    </div>
  );
};

export default ServiceCard10;
