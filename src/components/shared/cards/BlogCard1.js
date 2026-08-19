import makePath from "@/libs/makePath";
import modifyNumber from "@/libs/modifyNumber";
import Image from "next/image";
import Link from "next/link";
import ButtonPrimary from "../buttons/ButtonPrimary";

import { resolveCmsImage } from "@/lib/seoConfig";

const BlogCard1 = ({ blog, idx }) => {
	const { title, desc, id, img, category, date, day, month, author } = blog || {};
	const authorName = typeof author === "object" ? (author?.name || "Admin") : (author || "Admin");
	const imgSrc = resolveCmsImage(img) || "/images/blog/blog-1.webp";

	return (
		<div className="blog-item wow fadeInUp" data-wow-delay={`0.${idx + 1}s`}>
			<div className="blog-thumb">
				<Link href={`/blogs/${id}`}>
					{" "}
					<Image
						src={imgSrc}
						alt={title || "Blog Image"}
						width={870}
						height={450}
					/>
				</Link>
				<div className="blog-date">
					<span className="date">{modifyNumber(idx + 1)}</span>
					<span className="month">{month}</span>
				</div>
			</div>
			<div className="blog-content">
				<div className="blog-meta">
				
					<span>
						By <Link href={`/blogs/${id}`}>{authorName}</Link>
					</span>
				</div>
				<h4 className="title">
					<Link href={`/blogs/${id}`}>{title}.</Link>
				</h4>
				<ButtonPrimary
					text={"Read More"}
					url={`/blogs/${id}`}
					isTextBtn={true}
				/>
			</div>
		</div>
	);
};

export default BlogCard1;
