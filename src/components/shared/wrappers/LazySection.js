"use client";
import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";

export default function LazySection({ children, rootMargin = "250px 0px", minHeight = "150px" }) {
	const { ref, inView } = useInView({
		triggerOnce: true,
		rootMargin,
	});
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (inView) {
			const timer = setTimeout(() => {
				window.dispatchEvent(new CustomEvent("lazy-section-loaded"));
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [inView]);

	// Server-side: render children directly for SEO
	if (!mounted) {
		return <div ref={ref}>{children}</div>;
	}

	return (
		<div ref={ref} style={{ minHeight: inView ? "auto" : minHeight }}>
			{inView ? children : <div style={{ height: minHeight }} />}
		</div>
	);
}
