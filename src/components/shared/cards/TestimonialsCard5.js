const StarRating = ({ rate = 5 }) => {
	const pct = Math.min(Math.max((rate / 5) * 100, 0), 100);
	return (
		<div className="star-ratings">
			<div className="fill-ratings" style={{ width: `${pct}%` }}>
				<span>★★★★★</span>
			</div>
			<div className="empty-ratings">
				<span>★★★★★</span>
			</div>
		</div>
	);
};

const TestimonialsCard5 = ({ testimonial }) => {
	if (!testimonial) return null;

	const { name, designation, message, image, rate = 5 } = testimonial;

	const imgSrc = image
		? image.startsWith("/uploads/")
			? `${process.env.NEXT_PUBLIC_API_URL}${image}`
			: image
		: "/images/testimonial/client-1.webp";

	return (
		<div className="testimonial-item">
			<div className="h6-testimonial-author-wrapper">
				<div className="testimonial-author">
					<div className="author-inner">
						<div className="author-img">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={imgSrc}
								alt={name || "Client"}
								width={89}
								height={89}
								style={{ width: 89, height: 89, objectFit: "cover", borderRadius: "50%" }}
							/>
						</div>
						<div className="author-header">
							<h4 className="title">{name}</h4>
							<span className="designation">{designation}</span>
						</div>
					</div>
				</div>
				<StarRating rate={rate} />
			</div>
			<div className="desc">
				<p>"{message}"</p>
			</div>
		</div>
	);
};

export default TestimonialsCard5;
