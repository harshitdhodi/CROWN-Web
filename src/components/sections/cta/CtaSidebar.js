"use client";
import { useEffect, useState } from "react";



/**
 * Extract plain text from an HTML string by tag name.
 * e.g. extractTag("<h2>Get Our</h2><p>Latest</p>", "h2") → "Get Our"
 */
function extractTag(html, tag) {
	if (!html || typeof document === "undefined") return null;
	const tmp = document.createElement("div");
	tmp.innerHTML = html;
	const el = tmp.querySelector(tag);
	return el ? el.innerText.trim() : null;
}

/**
 * Resolve a CMS file path to a usable URL.
 * /uploads/... paths are proxied through Next.js rewrites.
 */
function resolveUrl(path) {
	if (!path) return null;
	if (path.startsWith("http")) return path;
	return path; // relative /uploads/... — served via next.config rewrite
}

const CtaSidebar = () => {
	const [catalogue, setCatalogue] = useState(null);

	useEffect(() => {
		fetch("/api/data/catalogue")
			.then((res) => res.json())
			.then((json) => {
				if (json.success && Array.isArray(json.data) && json.data.length > 0) {
					setCatalogue(json.data[0]);
				}
			})
			.catch((err) => console.error("Failed to fetch catalogue:", err));
	}, []);

	// Derived values from CMS data, with static fallbacks
	const heading = catalogue ? extractTag(catalogue.title, "h2") || "Get Our" : "Get Our";
	const subtext = catalogue ? extractTag(catalogue.title, "p") || "Latest Catalogue" : "Latest Catalogue";
	const pdfUrl = catalogue ? resolveUrl(catalogue.catalogue) : null;
	const imageUrl = catalogue?.image?.[0] ? resolveUrl(catalogue.image[0]) : "/images/service/service-ad.webp";
	const downloadHref = pdfUrl || "/downloads";

	return (
		<div className="feature-box">
			<div className="feature-content">
				<h2 className="title">{heading}</h2>
				<span>{subtext}</span>
				<a
					className="read-more feature-contact"
					href={downloadHref}
					{...(pdfUrl
						? { download: true, target: "_blank", rel: "noopener noreferrer" }
						: {})}
					aria-label="Download PDF Catalogue"
				>
					<i aria-hidden="true" style={{ display: "inline-flex", alignItems: "center" }}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							width="1em"
							height="1em"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
							<polyline points="14 2 14 8 20 8" />
							<line x1="9"  y1="13" x2="9"  y2="17" />
							<path d="M9 13h1a1 1 0 0 1 0 2H9" />
							<line x1="13" y1="13" x2="13" y2="17" />
							<path d="M13 13h1a2 2 0 0 1 0 4h-1" />
							<line x1="17" y1="13" x2="17" y2="17" />
							<line x1="17" y1="15" x2="18.5" y2="15" />
						</svg>
					</i>
					<span>Download Catalogue</span>
				</a>
			</div>
			<div className="feature-images">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img src={imageUrl} alt={subtext || "Catalogue"} />
			</div>
		</div>
	);
};

export default CtaSidebar;
