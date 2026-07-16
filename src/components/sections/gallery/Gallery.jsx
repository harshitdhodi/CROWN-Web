"use client";

import "./Gallery.scss";
import Image from "next/image";
import { useEffect, useState } from "react";

function toGalleryImage(event) {
  return {
    id: event.id,
    src: event.image[0]?.startsWith("http")
      ? event.image[0]
      : `${process.env.NEXT_PUBLIC_API_URL ?? ""}${event.image[0]}`,
    alt: event.heading,
    heading: event.heading,
    location: event.location,
    date: event.date,
    description: event.description,
  };
}

/** Split into groups of 4; the last group keeps only the remaining images. */
function chunkImages(images) {
  if (images.length <= 4) return [images];

  const chunks = [];
  for (let i = 0; i < images.length; i += 4) {
    chunks.push(images.slice(i, i + 4));
  }
  return chunks;
}

const FOUR_ITEM_CLASSES = {
  normal: ["wide", "tall", "square square-1", "square square-2"],
  reversed: ["tall", "wide", "square square-1", "square square-2"],
};

function getItemClass(count, index, isReversed) {
  if (count === 4) {
    const key = isReversed ? "reversed" : "normal";
    return FOUR_ITEM_CLASSES[key][index];
  }
  return `item-${index}`;
}

function GalleryItem({ img, className, style }) {
  return (
    <div className={`gallery-item ${className}`} style={style}>
      <Image
        src={img.src}
        alt={img.alt}
        fill
        className="gallery-image"
        sizes="(max-width: 768px) 100vw, 66vw"
      />
      <div className="gallery-overlay">
        <div className="gallery-overlay-content">
          <h3 className="gallery-overlay-title">{img.heading}</h3>
          <p className="gallery-overlay-location">
            <i className="tji-location" /> {img.location}
          </p>
        </div>
      </div>
    </div>
  );
}

function GalleryGroup({ images, isReversed = false }) {
  const count = images.length;
  if (!count) return null;

  const layoutClass = `layout-${Math.min(count, 4)}`;

  return (
    <div className={`gallery-group ${layoutClass} ${isReversed ? "reversed" : ""}`}>
      {images.map((img, index) => (
        <GalleryItem
          key={img.id}
          img={img}
          className={getItemClass(count, index, isReversed)}
        />
      ))}
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="gallery-grid-wrapper gallery-skeleton" aria-busy="true" aria-label="Loading gallery">
      <div className="gallery-group layout-4">
        <div className="gallery-item wide skeleton-block" />
        <div className="gallery-item tall skeleton-block" />
        <div className="gallery-item square square-1 skeleton-block" />
        <div className="gallery-item square square-2 skeleton-block" />
      </div>
    </div>
  );
}

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [headingData, setHeadingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const headingRes = await fetch("/api/heading?section=upcoming-events");
        if (headingRes.ok) {
          const headingJson = await headingRes.json();
          if (headingJson.success) {
            setHeadingData(headingJson.data);
          }
        }

        const res = await fetch("/api/data/events/past");

        if (!res.ok) {
          throw new Error(`Request failed: ${res.status} ${res.statusText}`);
        }

        const json = await res.json();
        if (!json.success) {
          throw new Error("API returned success: false");
        }

        setImages(json.data.map(toGalleryImage));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load gallery data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const groups = chunkImages(images);

  return (
    <section className="gallery-section section-gap" style={{ marginTop: "50px" , marginBottom: "100px" }}>
      <div className="gallery-container gallery-header">
        <div className="sec-heading style-3">
          <span className="sub-title wow fadeInUp" data-wow-delay=".3s">
            <i className="tji-box" />
            {headingData?.tagline || "Our Work"}
          </span>
          <h2 className="sec-title title-anim">
            {headingData?.heading || "A Glimpse Into Our World"}
          </h2>
        </div>
      </div>

      {loading && (
        <div className="gallery-container">
          <GallerySkeleton />
        </div>
      )}

      {!loading && error && (
        <div className="gallery-container gallery-error" role="alert">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="gallery-container gallery-empty">
          <p>No past events to display yet.</p>
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="gallery-container gallery-grid-wrapper">
          {groups.map((group, index) => (
            <GalleryGroup key={index} images={group} isReversed={index % 2 === 1} />
          ))}
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="gallery-container gallery-mobile-list">
          {images.map((img) => (
            <div key={img.id} className="mobile-item">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="gallery-image"
                sizes="100vw"
              />
              <div className="gallery-overlay">
                <div className="gallery-overlay-content">
                  <h3 className="gallery-overlay-title">{img.heading}</h3>
                  <p className="gallery-overlay-location">{img.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
