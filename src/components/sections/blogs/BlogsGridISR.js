import { headers } from "next/headers";
import BlogsGridPrimary from "./BlogsGridPrimary";
import { Suspense } from "react";
import BlogsSkeleton from "./BlogsSkeleton";

const slugify = (text) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w\-]+/g, "") // Remove all non-word chars
		.replace(/\-\-+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
};

async function getBlogsData() {
	try {
		const headersList = await headers();
		const cookieHeader = headersList.get("cookie") || "";
		
		const res = await fetch(`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/data/blog`, {
			headers: { cookie: cookieHeader },
			next: { revalidate: 3600 }, // ISR: Revalidate every hour
		});

		if (!res.ok) return [];

		const { success, data } = await res.json();
		if (!success || !data) return [];

		// Map API format to component format
		return data.map((item) => ({
			id: slugify(item.title),
			title: item.title,
			img: item.image,
			author: item.author,
			date: item.date,
			// Strip HTML tags for the short description
			desc: item.details?.replace(/<[^>]+>/g, "").substring(0, 120) + "...",
			category: "Business", // Default if not in API
		}));
	} catch (error) {
		console.error("Error fetching blogs:", error);
		return [];
	}
}

const BlogsGridContent = async ({ isSidebar }) => {
	const blogs = await getBlogsData();
	return <BlogsGridPrimary isSidebar={isSidebar} blogs={blogs} />;
};

const BlogsGridISR = ({ isSidebar = false }) => {
	return (
		<Suspense fallback={<BlogsSkeleton />}>
			<BlogsGridContent isSidebar={isSidebar} />
		</Suspense>
	);
};

export default BlogsGridISR;