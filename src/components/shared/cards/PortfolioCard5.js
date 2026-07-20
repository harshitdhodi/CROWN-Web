"use client";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";
import Image from "next/image";

// Resolve image URL — handles absolute URLs, root-relative paths, and fallback.
function resolveImage(src, fallback = "/images/project/h5-project-1.webp") {
  if (!src) return fallback;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  if (src.startsWith("/")) return src;
  return `/${src}`;
}

function slugify(text) {
  return text
    ? text
        .toString()
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : "";
}

const PortfolioCard5 = ({ portfolio }) => {
  const {
    title = "Event Management Platform",
    img5,
    image, // API field
    desc = "",
    short_description,
    id,
    slug,
    category = "Connect",
    categorySlug,
  } = portfolio || {};

  // Prefer API image field, then img5 fakedata field, then fallback
  const imgSrc = resolveImage(image || img5);

  const description =
    desc ||
    (short_description ? short_description.replace(/<[^>]+>/g, "") : null) ||
    "Through a combination of data-driven insights and innovative approaches, we work closely with you to develop customized solutions.";

  const finalSlug =
    slug || slugify(category) || slugify(title) || `portfolio-${id}`;
  const href = categorySlug && slug ? `/${categorySlug}/${slug}` : (finalSlug ? `/${finalSlug}` : `/portfolios/${id}`);

  return (
    <div className="h5-project-item-wrapper tj-scroll-slider-item">
      <div className="project-item h4-project-item h5-project-item">
        <div
          className="project-img"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 576px) 100vw, (max-width: 992px) 50vw, (max-width: 1400px) 400px, 450px"
            quality={80}
            style={{
              objectFit: "cover",
              display: "block",
            }}
            onError={(e) => {
              e.currentTarget.src = "/images/project/h5-project-1.webp";
            }}
          />
        </div>
        <div className="project-content">
          <span className="categories">
            <Link href={href}>{category}</Link>
          </span>
          <div className="project-text">
            <h3 className="title">
              <Link href={href}>{title}</Link>
            </h3>
          </div>
          <p className="desc text-justify">{description}</p>
          <ButtonPrimary text={"Learn More"} url={href} aria-label={`Learn More about ${title}`} />
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard5;
