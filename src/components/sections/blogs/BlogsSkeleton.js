"use client";
const BlogsSkeleton = () => {
	return (
		<section className="tj-blog-section section-gap">
			<div className="container">
				<div className="row row-gap-4">
					{[1, 2, 3, 4, 5, 6].map((i) => (
						<div key={i} className="col-lg-4 col-md-6">
							<div className="skeleton-card" style={{ background: "#f3f4f6", borderRadius: "10px", height: "450px", marginBottom: "30px", animation: "pulse 1.5s infinite ease-in-out" }}>
								<div style={{ height: "250px", background: "#e5e7eb", borderRadius: "10px 10px 0 0" }}></div>
								<div style={{ padding: "20px" }}>
									<div style={{ height: "20px", background: "#e5e7eb", width: "40%", marginBottom: "15px" }}></div>
									<div style={{ height: "30px", background: "#e5e7eb", width: "90%", marginBottom: "10px" }}></div>
									<div style={{ height: "20px", background: "#e5e7eb", width: "100%" }}></div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
			<style jsx>{`
				@keyframes pulse {
					0% { opacity: 1; }
					50% { opacity: 0.5; }
					100% { opacity: 1; }
				}
			`}</style>
		</section>
	);
};

export default BlogsSkeleton;