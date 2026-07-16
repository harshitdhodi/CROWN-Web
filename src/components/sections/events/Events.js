"use client";

import { useState, useEffect } from "react";

// ── helpers ──────────────────────────────────────────────────────────────────

function formatEventDate(dateStr) {
	if (!dateStr) return { day: "--", month: "---", time: "" };
	const d = new Date(dateStr);
	return {
		day: String(d.getDate()).padStart(2, "0"),
		month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
		year: d.getFullYear(),
		time: d.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit" }),
	};
}

// ── Event Card ───────────────────────────────────────────────────────────────

function EventCard({ event, idx }) {
	const { heading, description, location, date, image } = event;
	const imgSrc = Array.isArray(image) ? image[0] : image || "/images/blog/blog-1.webp";
	const { day, month, time } = formatEventDate(date);
	const delay = `${0.3 + idx * 0.15}s`;
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="blog-item style-2 wow fadeInUp" data-wow-delay={delay}>
			<div className="blog-thumb">
				<img src={imgSrc} alt={heading} />
				<div className="blog-date">
					<span className="date">{day}</span>
					<span className="month">{month}</span>
				</div>
			</div>
			<div className="blog-content">
				<div className="title-area">
					<div className="blog-meta">
						{location && (
							<span className="categories">
								<i className="tji-location" style={{ marginRight: 4 }}></i>
								{location}
							</span>
						)}
						{time && (
							<span>
								<i className="tji-clock" style={{ marginRight: 4 }}></i>
								{time}
							</span>
						)}
					</div>
					<h3 className="title">{heading}</h3>
					{description && (
						<>
							<p className={`event-desc${expanded ? " expanded" : ""}`}>
								{description}
							</p>
							<button
								className="read-more-btn"
								onClick={() => setExpanded(!expanded)}
							>
								{expanded ? "Read Less" : "Read More"}
							</button>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

// ── Main Section ─────────────────────────────────────────────────────────────

const EventsSection = () => {
	const [events, setEvents]       = useState([]);
	const [headingData, setHeadingData] = useState(null);
	const [loading, setLoading]     = useState(true);

	useEffect(() => {
		Promise.all([
			fetch("/api/data/events/upcoming").then((r) => r.json()),
			fetch("/api/heading?section=upcoming-events").then((r) => r.json()),
		])
			.then(([eventsJson, headingJson]) => {
				if (eventsJson.success && Array.isArray(eventsJson.data)) {
					setEvents(eventsJson.data);
				}
				if (headingJson.success && headingJson.data) {
					setHeadingData(headingJson.data);
				}
			})
			.catch((err) => console.error("Error fetching events:", err))
			.finally(() => setLoading(false));
	}, []);

	useEffect(() => {
		if (loading) return;

		let cancelled = false;

		const initStickySidebar = async () => {
			const [{ default: sidebarSticky }, { ScrollTrigger }] = await Promise.all([
				import("@/libs/sidebarSticky"),
				import("@/libs/gsap.config"),
			]);
			if (cancelled) return;

			sidebarSticky();
			requestAnimationFrame(() => ScrollTrigger.refresh());
		};

		requestAnimationFrame(() => {
			requestAnimationFrame(initStickySidebar);
		});

		return () => {
			cancelled = true;
		};
	}, [loading, events.length]);

	const tagline     = headingData?.tagline || "Upcoming Events";
	const mainHeading = headingData?.heading || "Industry Events & Knowledge Exchange";

	return (
		<section className="tj-blog-section-2 h8-blog section-gap slidebar-stickiy-container">
			<div className="container">
				<div className="row">

					{/* ── Left: sticky heading ── */}
					<div className="col-12 col-lg-4 col-xl-3">
						<div className="sec-heading style-3 slidebar-stickiy">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
								<i className="tji-box"></i>{tagline}
							</span>
							<h2 className="sec-title">
								{mainHeading}
							</h2>
						</div>
					</div>

					{/* ── Right: scrollable event cards ── */}
					<div className="col-12 col-lg-8 col-xl-9">
						<div className="blog-wrapper h8-blog-wrapper">
							{loading ? (
								<div className="py-5">Loading events...</div>
							) : events.length > 0 ? (
								events.map((event, idx) => (
									<EventCard key={event.id} event={event} idx={idx} />
								))
							) : (
								<p className="text-muted">No upcoming events at this time.</p>
							)}
						</div>
					</div>

				</div>
			</div>

			<style>{`
				.event-desc {
					font-size: 14px;
					color: var(--tj-color-text-body);
					margin-top: 8px;
					line-height: 1.6;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
				}
				.event-desc.expanded {
					display: block;
					-webkit-line-clamp: unset;
					overflow: visible;
				}
				.read-more-btn {
					background: none;
					border: none;
					padding: 0;
					font-size: 13px;
					font-weight: 600;
					color: var(--tj-color-theme-primary, #0066cc);
					cursor: pointer;
					text-decoration: underline;
					display: block;
					margin-top: 4px;
				}
				.read-more-btn:hover { opacity: 0.75; }
			`}</style>
		</section>
	);
};

export default EventsSection;
