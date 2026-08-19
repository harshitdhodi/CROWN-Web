import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import BlogDetailsISR, { slugify } from "@/components/sections/blogs/BlogDetailsISR";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import Faq1 from "@/components/sections/faq/Faq1";

import getPageComponents from "@/lib/getPageComponents";
import CmsPageRoot from "@/components/shared/theme/CmsPageRoot";
import { resolveCmsImage, getSiteUrl, getCmsBase } from "@/lib/seoConfig";

const DEFAULT_BLOG_ORDER = ["BlogDetailsISR", "Faq1"];

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const cmsBase = getCmsBase();
	const siteUrl = getSiteUrl();

	try {
		const res = await fetch(`${cmsBase}/api/blogs/${encodeURIComponent(slug)}`, {
			next: { revalidate: 60 },
		});
		if (!res.ok) return {};
		const { success, data } = await res.json();
		if (!success || !data) return {};

		const title = data.metatitle || data.title;
		const description =
			data.meta_description ||
			data.short_description ||
			data.details?.replace(/<[^>]+>/g, "").substring(0, 160) ||
			"";
		const keywords = Array.isArray(data.meta_keyword)
			? data.meta_keyword.join(", ")
			: data.meta_keyword || "";
		const canonical =
			data.canonical_link ||
			data.metaCanonical ||
			data.canonical_url ||
			`${siteUrl}/blogs/${slug}`;
		const ogImage = resolveCmsImage(data.image);

		return {
			title: `${title} | CROWN Packaging`,
			description,
			keywords,
			alternates: { canonical },
			openGraph: {
				title,
				description,
				url: canonical,
				type: "article",
				...(ogImage && { images: [{ url: ogImage, alt: title }] }),
			},
			twitter: {
				card: "summary_large_image",
				title,
				description,
				...(ogImage && { images: [ogImage] }),
			},
		};
	} catch (err) {
		return {};
	}
}

export default async function BlogDetails({ params }) {
	const { slug } = await params;
	const activeKeys = await getPageComponents("blog-details", DEFAULT_BLOG_ORDER);

	return (
		<CmsPageRoot pageSlug="blog-details">
			<div>
				<BackToTop />
				<Header />
				<Header isStickyHeader={true} />
				<div id="smooth-wrapper">
					<div id="smooth-content">
						<main>
							<HeaderSpace />
							{activeKeys.map((comp) => {
								const style = {};
								if (comp.margin_top) style.marginTop = comp.margin_top;
								if (comp.margin_bottom) style.marginBottom = comp.margin_bottom;
								if (comp.padding_top) style.paddingTop = comp.padding_top;
								if (comp.padding_bottom) style.paddingBottom = comp.padding_bottom;

								let content = null;
								if (comp.key === "BlogDetailsISR") {
									content = <BlogDetailsISR slug={slug} />;
								} else if (comp.key === "Faq1") {
									content = <Faq1 page={`blogs/${slug}`} infoPage="blog-details" showFallback={true} />;
								}

								if (!content) return null;

								return (
									<div key={comp.key} style={Object.keys(style).length > 0 ? style : undefined}>
										{content}
									</div>
								);
							})}
						</main>
						<Footer8 />
					</div>
				</div>
				<ClientWrapper />
			</div>
		</CmsPageRoot>
	);
}

export async function generateStaticParams() {
	try {
		const cmsBaseUrl = getCmsBase();
		const res = await fetch(`${cmsBaseUrl}/api/data/blogs`);

		if (!res.ok) {
			const errorBody = await res.text().catch(() => "No response body");
			console.error(`generateStaticParams fetch failed: ${res.status} ${res.statusText} - ${errorBody.slice(0, 100)}`);
			return [];
		}

		const { success, data } = await res.json();

		if (!success || !Array.isArray(data)) {
			console.warn("generateStaticParams: API indicates failure or data is not an array.");
			return [];
		}

		return data.map((blog) => ({ slug: blog.slug || slugify(blog.title) }));
	} catch (error) {
		console.error("Error in generateStaticParams:", error);
		return [];
	}
}
