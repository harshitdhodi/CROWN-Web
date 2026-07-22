import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import BlogDetailsISR, { slugify } from "@/components/sections/blogs/BlogDetailsISR";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import Faq1 from "@/components/sections/faq/Faq1";

export default async function BlogDetails({ params }) {
	const { slug } = await params;
	console.log("slug", slug)
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<BlogDetailsISR slug={slug} />
						<Faq1 page={`blogs/${slug}`} infoPage="blog-details" showFallback={true} />
					</main>
					<Footer8 />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}

export async function generateStaticParams() {
	try {
		// Use CMS_BASE_URL directly — server-side fetches bypass Next.js rewrites
		const cmsBaseUrl = process.env.CMS_BASE_URL || "http://localhost:3012";
		const res = await fetch(`${cmsBaseUrl}/api/data/blog`);

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

		return data.map((blog) => ({ slug: slugify(blog.title) }));
	} catch (error) {
		console.error("Error in generateStaticParams:", error);
		return [];
	}
}
