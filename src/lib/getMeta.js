import { getCmsBase } from "./seoConfig";

const FETCH_TIMEOUT_MS = 8000;

function slugToTitle(slug) {
	if (!slug || slug === "/") return "Home";
	const segment = slug.replace(/^\//, "").split("/").pop() || "";
	return segment
		.split("-")
		.filter(Boolean)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");
}

async function fetchCmsData(url, revalidate = 60) {
	try {
		const res = await fetch(url, {
			next: { revalidate },
			signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
		});
		if (!res.ok) return null;
		const json = await res.json();
		return json?.success ? json.data : null;
	} catch (err) {
		const isTimeout = err?.name === "TimeoutError" || err?.code === 23;
		console.warn(
			`[getMeta] ${isTimeout ? "Timeout" : "Failed"} fetching ${url}:`,
			err?.message || err
		);
		return null;
	}
}

function buildFallbackMetadata(slug, siteName = "Wiretex") {
	const pageTitle = slugToTitle(slug);
	return {
		title: `${pageTitle} | ${siteName}`,
		description: `${pageTitle} - ${siteName}`,
	};
}

export async function getMeta(slug) {
	const cmsBase = getCmsBase();
	const siteNameFallback = "Wiretex";

	const [pageMeta, globalSettings] = await Promise.all([
		fetchCmsData(`${cmsBase}/api/seo/meta?slug=${encodeURIComponent(slug)}`, 60),
		fetchCmsData(`${cmsBase}/api/seo/settings`, 300),
	]);

	const siteName = globalSettings?.siteName || siteNameFallback;
	const defaultOgImage = globalSettings?.defaultOgImage || "";
	const twitterHandle = globalSettings?.twitterHandle || "";

	if (!pageMeta && !globalSettings) {
		return buildFallbackMetadata(slug, siteName);
	}

	const resolveMediaUrl = (url) => {
		if (!url) return "";
		if (url.startsWith("http")) return url;
		return `${cmsBase}${url.startsWith("/") ? "" : "/"}${url}`;
	};

	const metaTitle = pageMeta?.metaTitle || "";
	const metaDescription = pageMeta?.metaDescription || globalSettings?.metaDescription || "";
	const metaKeyword = pageMeta?.metaKeyword || "";
	const metaCanonical = pageMeta?.metaCanonical || "";
	const ogTitle = pageMeta?.ogTitle || metaTitle;
	const ogDescription = pageMeta?.ogDescription || metaDescription;
	const ogImage = resolveMediaUrl(pageMeta?.ogImage || defaultOgImage);
	const ogType = pageMeta?.ogType || "website";
	const twitterCard = pageMeta?.twitterCard || "summary_large_image";
	const noIndex = pageMeta?.noIndex ?? false;
	const noFollow = pageMeta?.noFollow ?? false;

	const fullTitle = metaTitle
		? `${metaTitle} | ${siteName}`
		: buildFallbackMetadata(slug, siteName).title;

	const metadata = {
		title: fullTitle,
		description: metaDescription || buildFallbackMetadata(slug, siteName).description,
		keywords: metaKeyword ? metaKeyword.split(",").map((k) => k.trim()) : undefined,
		robots: {
			index: !noIndex,
			follow: !noFollow,
		},
		openGraph: {
			title: ogTitle || fullTitle,
			description: ogDescription || metaDescription,
			type: ogType,
			images: ogImage ? [{ url: ogImage }] : undefined,
		},
		twitter: {
			card: twitterCard,
			title: ogTitle || fullTitle,
			description: ogDescription || metaDescription,
			images: ogImage ? [ogImage] : undefined,
			creator: twitterHandle
				? twitterHandle.startsWith("@")
					? twitterHandle
					: `@${twitterHandle}`
				: undefined,
		},
	};

	if (metaCanonical) {
		metadata.alternates = {
			canonical: metaCanonical,
		};
	}

	if (pageMeta?.metaSchema || pageMeta?.faqSchema) {
		metadata.other = {};
		if (pageMeta.metaSchema) {
			metadata.other["meta-schema-markup"] = pageMeta.metaSchema;
		}
		if (pageMeta.faqSchema) {
			metadata.other["faq-schema-markup"] = pageMeta.faqSchema;
		}
	}

	return metadata;
}
