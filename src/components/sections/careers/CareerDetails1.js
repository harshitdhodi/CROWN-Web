'use client'
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import getCareers from "@/libs/getCareers";
import getPreviousNextItem from "@/libs/getPreviousNextItem";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useState } from "react";

const CareerDetails1 = ({ currentItemId, prevId, nextId, isPrevItem, isNextItem }) => {
	// Form states
	const [formState, setFormState] = useState({
		name: "",
		email: "",
		phone: "",
		coverLetter: "",
	});
	const [cvFile, setCvFile] = useState(null);
	const [fileName, setFileName] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();

	const cmsBase = process.env.NEXT_PUBLIC_API_URL || "/api";

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formState.name || !formState.email) {
			setError("Name and email are required");
			return;
		}

		if (cvFile) {
			// Validate file type
			if (cvFile.type !== "application/pdf" && cvFile.type !== "application/msword" && cvFile.type !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
				setError("Only PDF, DOC, or DOCX files are allowed for resume");
				return;
			}
			// Validate file size (max 5MB)
			if (cvFile.size > 5 * 1024 * 1024) {
				setError("File size should be less than 5MB");
				return;
			}
		}

		setSubmitting(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("name", formState.name);
			formData.append("email", formState.email);
			formData.append("phone", formState.phone || "");
			formData.append("position", currentItemId?.title || "");
			formData.append("coverLetter", formState.coverLetter || "");
			if (cvFile) {
				formData.append("cv_file", cvFile);
			}

			const response = await fetch(`${cmsBase}/career-application`, {
				method: "POST",
				body: formData,
			});

			const result = await response.json();
			if (!response.ok) {
				throw new Error(result.error || "Failed to submit application");
			}

			// Reset form
			setFormState({ name: "", email: "", phone: "", coverLetter: "" });
			setCvFile(null);
			setFileName("");

			// Redirect to thank you page
			router.push('/thank-you');

		} catch (err) {
			setError(err.message || "Failed to submit application");
		} finally {
			setSubmitting(false);
		}
	};

	// Get current item
	const currentId = currentItemId;
	const currentItem = typeof currentId === 'object' ? currentId : null;

	if (!currentItem) {
		const items = getCareers();
		if (!items?.length) notFound();
		const { currentItem: fallbackItem } = getPreviousNextItem(items, currentId);
		if (!fallbackItem) notFound();
		return <CareerDetails1 currentItemId={fallbackItem} prevId={prevId} nextId={nextId} isPrevItem={isPrevItem} isNextItem={isNextItem} />;
	}

	const { title, iconName, category, need, location, details, image, onsite, remote, isurgent } = currentItem;

	const tags = [];
	if (isurgent) tags.push({ label: "Urgent", className: "urgent-tag" });
	if (remote) tags.push({ label: "Remote", className: "remote-tag" });
	if (onsite) tags.push({ label: "Onsite", className: "onsite-tag" });

	return (
		<>
			<style>{`
				.tj-careers-details .tj-entry-content h4 {
					color: var(--tj-color-heading-primary);
					font-weight: var(--tj-fw-sbold);
					margin-bottom: 20px;
					margin-top: 30px;
				}
				.tj-careers-details .tj-entry-content p {
					color: var(--tj-color-text-body);
					line-height: 1.8;
					margin-bottom: 20px;
				}
				.tj-careers-details .tj-entry-content ul {
					list-style: none;
					padding-left: 20px;
					margin-bottom: 20px;
				}
				.tj-careers-details .tj-entry-content ul li {
					color: var(--tj-color-text-body);
					line-height: 1.8;
					margin-bottom: 10px;
					position: relative;
					padding-left: 20px;
				}
				.tj-careers-details .tj-entry-content ul li::before {
					content: "•";
					color: var(--tj-color-theme-primary);
					font-weight: bold;
					position: absolute;
					left: 0;
					top: 0;
				}
				.tj-careers-details .tj-entry-content ol {
					list-style: decimal;
					padding-left: 20px;
					margin-bottom: 20px;
				}
				.tj-careers-details .tj-entry-content ol li {
					color: var(--tj-color-text-body);
					line-height: 1.8;
					margin-bottom: 10px;
				}
				.tj-careers-details .tj-entry-content strong {
					font-weight: var(--tj-fw-sbold);
					color: var(--tj-color-heading-primary);
				}
				.tj-careers-details .tj-entry-content table {
					width: 100%;
					border-collapse: collapse;
					margin-bottom: 20px;
				}
				.tj-careers-details .tj-entry-content th,
				.tj-careers-details .tj-entry-content td {
					border: 1px solid var(--tj-color-border-1);
					padding: 12px;
					text-align: left;
				}
				.tj-careers-details .tj-entry-content th {
					background-color: var(--tj-color-theme-bg);
					font-weight: var(--tj-fw-sbold);
					color: var(--tj-color-heading-primary);
				}
				.tj-careers-details .tj-entry-content img {
					max-width: 100%;
					height: auto;
					margin: 20px 0;
					border-radius: 8px;
				}
				.tj-careers-details .tj-careers-top-icon {
					width: 100%;
					max-width: 150px;
					height: auto;
				}
				.tj-careers-details .tj-careers-top-icon img {
					width: 100%;
					height: auto;
					object-fit: cover;
					border-radius: 8px;
				}
				.tj-careers-details .tj-careers-tag {
					display: flex;
					gap: 10px;
					flex-wrap: wrap;
					margin-bottom: 15px;
				}
				.tj-careers-details .tj-careers-tag .urgent-tag {
					color: gray;
					border: 1px dashed #ef4444;
					padding: 4px 14px;
					border-radius: 4px;
				}
				.tj-careers-details .tj-careers-tag .urgent-tag:hover {
					background-color: #ef4444;
					color: #ffffff;
				}
				.tj-careers-details .tj-careers-tag .remote-tag {
					color: gray;
					border: 1px dashed gray;
					padding: 4px 14px;
					border-radius: 4px;
				}
				.tj-careers-details .tj-careers-tag .remote-tag:hover {
					background-color: gray;
					color: #ffffff;
				}
				.tj-careers-details .tj-careers-tag .onsite-tag {
					color: gray;
					border: 1px dashed gray;
					padding: 4px 14px;
					border-radius: 4px;
				}
				.tj-careers-details .tj-careers-tag .onsite-tag:hover {
					background-color: gray;
					color: #ffffff;
				}
				.tj-careers-details input[type="file"] {
					font-size: 14px;
				}
				.tj-careers-details .tj-careers-button button:disabled {
					opacity: 0.7;
					cursor: not-allowed;
				}
				.tj-careers-details .selected-file {
					font-size: 12px;
					color: #6b7280;
					margin-top: 4px;
				}
			`}</style>

			<section className="tj-careers-details section-gap">
				<div className="container">
					<div className="row rg-50">
						<div className="col-lg-8">
							<div className="tj-post-wrapper">
								<div className="tj-post-single-post">
									<div className="tj-careers-top mb-30">
										<div className="tj-careers-top-icon bg-white">
											{image ? (
												<img
													src={`${process.env.CMS_BASE_URL || 'http://localhost:3012'}${image}`}
													alt={title}
													className="w-full h-auto rounded-lg"
												/>
											) : (
												<i className={iconName ? iconName : "tji-manage"}></i>
											)}
										</div>
										<div className="tj-careers-top-content">
											<div className="tj-careers-tag">
												{tags.map((tag, idx) => (
													<span key={idx} className={tag.className}>
														{tag.label}
													</span>
												))}
											</div>
											<h3 className="tj-careers-top-title text-anim">{title}</h3>
											<span className="location">
												<i className="tji-location"></i>
												{location}
											</span>
										</div>
									</div>
									<div className="tj-entry-content" dangerouslySetInnerHTML={{ __html: details || '' }} />
								</div>

								{isPrevItem || isNextItem ? (
									<div className="tj-post__navigation mb-0 wow fadeInUp" data-wow-delay="0.3s">
										<div className="tj-nav__post previous" style={{ visibility: isPrevItem ? "visible" : "hidden" }}>
											<div className="tj-nav-post__nav prev_post">
												<Link href={isPrevItem ? `/careers/${prevId}` : "#"}>
													<span><i className="tji-arrow-left"></i></span> Previous
												</Link>
											</div>
										</div>
										<Link href="/careers" className="tj-nav-post__grid">
											<i className="tji-window"></i>
										</Link>
										<div className="tj-nav__post next" style={{ visibility: isNextItem ? "visible" : "hidden" }}>
											<div className="tj-nav-post__nav next_post">
												<Link href={isNextItem ? `/careers/${nextId}` : "#"}>
													Next <span><i className="tji-arrow-right"></i></span>
												</Link>
											</div>
										</div>
									</div>
								) : null}
							</div>
						</div>

						<div className="col-lg-4">
							<aside className="tj-blog-sidebar">
								<div className="tj-sidebar-widget wow fadeInUp" data-wow-delay="0.3s">
									<h4 className="widget-title">Apply Online</h4>

									<div className="tj-careers-form">
										<form onSubmit={handleSubmit}>
											{error && (
												<div style={{ background: "#f8d7da", color: "#721c24", padding: "12px", borderRadius: "4px", marginBottom: "15px" }}>
													{error}
												</div>
											)}
											<div className="form-input">
												<input
													type="text"
													value={formState.name}
													onChange={(e) => setFormState({ ...formState, name: e.target.value })}
													placeholder="Full name*"
													required
												/>
											</div>
											<div className="form-input">
												<input
													type="email"
													value={formState.email}
													onChange={(e) => setFormState({ ...formState, email: e.target.value })}
													placeholder="Enter email*"
													required
												/>
											</div>
											<div className="form-input">
												<input
													type="text"
													value={formState.phone}
													onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
													placeholder="Phone number"
												/>
											</div>
											<div className="form-input">
												<textarea
													value={formState.coverLetter}
													onChange={(e) => setFormState({ ...formState, coverLetter: e.target.value })}
													placeholder="Cover letter"
													rows={4}
												></textarea>
											</div>
											<div className="form-input reduce">
												<label className="label" htmlFor="inputFile">
													Attach resume
												</label>
												<input
													type="file"
													id="inputFile"
													accept=".pdf,.doc,.docx"
													onChange={(e) => {
														const file = e.target.files?.[0] || null;
														setCvFile(file);
														if (file) {
															setFileName(file.name);
														} else {
															setFileName("");
														}
													}}
												/>
												{fileName && <span className="tj-careers-details selected-file">Selected: {fileName}</span>}
											</div>
											<div className="tj-careers-button">
												<ButtonPrimary
													text={submitting ? "Submitting..." : "Submit now"}
													type="submit"
													disabled={submitting}
												/>
											</div>
										</form>
									</div>
								</div>
							</aside>
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default CareerDetails1;
