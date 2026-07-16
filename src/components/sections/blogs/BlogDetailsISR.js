import HeroInner from "@/components/sections/hero/HeroInner";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import BlogDetailsPrimary from "./BlogDetailsPrimary";
import { Suspense } from "react";
import BlogsSkeleton from "./BlogsSkeleton";

export const slugify = (text) => {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^\w\-]+/g, "")
		.replace(/\-\-+/g, "-")
		.replace(/^-+/, "")
		.replace(/-+$/, "");
};

async function getBlogData(slug) {
	try {
		const headersList = await headers();
		const cookieHeader = headersList.get("cookie") || "";

		const res = await fetch(`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/blogs/${slug}`, {
			headers: { cookie: cookieHeader },
			next: { revalidate: 3600 },
		});

		if (!res.ok) return null;

		const { success, data, prev, next } = await res.json();
		if (!success || !data) return null;

		return {
			currentItem: {
				id: data.id,
				title: data.title,
				img: data.image,
				author: data.author,
				date: data.date,
				details: data.details,
				tags: data.meta_keyword || [],
			},
			prevId: prev ? slugify(prev.title) : null,
			nextId: next ? slugify(next.title) : null,
			isPrevItem: !!prev,
			isNextItem: !!next,
		};
	} catch (error) {
		console.error("Error fetching blog details:", error);
		return null;
	}
}

async function getRecentBlogs(slug) {
	try {
		const res = await fetch(
			`${process.env.CMS_BASE_URL || "http://localhost:3012"}/api/blogs/recent/${slug}?exclude=true`,
			{ next: { revalidate: 3600 } }
		);

		if (!res.ok) return [];

		const { success, data } = await res.json();
		return success && data
			? data.map((blog) => ({
					title: blog.title,
					date: blog.date,
					img: blog.image,
					slug: slugify(blog.title),
			  }))
			: [];
	} catch (error) {
		console.error("Error fetching recent blogs:", error);
		return [];
	}
}

const BlogDetailsContent = async ({ slug }) => {
	const [option, recentBlogs] = await Promise.all([getBlogData(slug), getRecentBlogs(slug)]);

	if (!option) {
		notFound();
	}

	const { title } = option.currentItem || {};

	return (
		<>
			<HeroInner
				title={"Blog Details"}
				text={title ? title : "Blog Details"}
				breadcrums={[{ name: "Blogs", path: "/blogs" }]}
			/>
			<BlogDetailsPrimary option={option} recentBlogs={recentBlogs} />
		</>
	);
};

const BlogDetailsISR = ({ slug }) => {
	return (
		<Suspense fallback={<BlogsSkeleton />}>
			<BlogDetailsContent slug={slug} />
		</Suspense>
	);
};

export default BlogDetailsISR;