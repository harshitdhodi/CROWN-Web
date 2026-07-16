"use client";

import ReactNiceSelect from "@/components/shared/Inputs/ReactNiceSelect";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import cta from "../../../../public/images/cta/CTA.png";
import "./Testimonials4Client.scss";

const Testimonials4Client = ({ initialServices, bannerTitle, bgImage }) => {
	const router = useRouter();

	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		service_id: "",
		message: "",
	});

	const [services] = useState(initialServices || []);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const hasServices = services.length > 0;
	const serviceOptions = hasServices
		? [
				{ value: "", optionName: "Choose a service" },
				...services.map((s) => ({ value: String(s.id), optionName: s.title })),
			]
		: [{ value: "", optionName: "No services available" }];

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		if (!formData.name || !formData.email || !formData.service_id || !formData.message) {
			setError("All fields are required");
			return;
		}

		setLoading(true);

		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					...formData,
					url: typeof window !== "undefined" ? window.location.href : "",
				}),
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Failed to submit form");
			}

			setFormData({ name: "", email: "", phone: "", service_id: "", message: "" });
			router.push("/contact/thank-you");
		} catch (err) {
			setError(err.message || "Failed to submit form");
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
		<style>{`
			.testimonials-section-wrapper {
				margin-top: 30px !important;
				margin-bottom: 30px !important;
			}
			@media (min-width: 992px) {
				.testimonials-section-wrapper {
					margin-top: 50px !important;
					margin-bottom: 50px !important;
				}
			}
		`}</style>
		<section
			className="h4-contact-section testimonials-section-wrapper"
			style={{
				position: "relative",
				backgroundImage: `url(${bgImage || cta.src})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				width: "98%",
				marginLeft: "auto",
				marginRight: "auto",
				padding: "50px 0",
				borderRadius: "8px",
			}}
		>
			<div className="container" style={{ position: "relative", zIndex: 1 }}>
				<div className="row">
					<div className="col-lg-6">
						<div
							className="contact-form style-3 t4-contact-form wow fadeInUp"
							data-wow-delay=".4s"
							style={{
								background: "var(--tj-color-common-white)",
								padding: "28px",
								borderRadius: "12px",
								boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
							}}
						>
							<div className="sec-heading style-4">
								<span className="sub-title">
									<i className="tji-box"></i>Get in Touch
								</span>
								<h2 className="sec-title">{bannerTitle || "Drop us a Line Here."}</h2>
							</div>

							{error && <div className="form-alert">{error}</div>}

							<form id="contact-form-3" onSubmit={handleSubmit}>
								<div className="row wow fadeInUp" data-wow-delay=".5s">
									<div className="col-sm-6">
										<div className="form-input">
											<label className="cf-label" htmlFor="t4-name">
												Full Name *
											</label>
											<input
												id="t4-name"
												type="text"
												name="name"
												value={formData.name}
												onChange={handleChange}
												placeholder="Full Name"
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<label className="cf-label" htmlFor="t4-email">
												Email Address *
											</label>
											<input
												id="t4-email"
												type="email"
												name="email"
												value={formData.email}
												onChange={handleChange}
												placeholder="Email Address"
												required
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<label className="cf-label" htmlFor="t4-phone">
												Phone number
											</label>
											<input
												id="t4-phone"
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												placeholder="Phone number"
											/>
										</div>
									</div>
									<div className="col-sm-6">
										<div className="form-input">
											<label className="cf-label">Choose a service *</label>
											<div className="tj-nice-select-box">
												<div className="tj-select">
													<ReactNiceSelect
														options={serviceOptions}
														value={formData.service_id}
														getSelectedOption={(val) =>
															setFormData((prev) => ({ ...prev, service_id: val }))
														}
														disabled={!hasServices}
														placeholder="Choose a service"
													/>
												</div>
											</div>
										</div>
									</div>
									<div className="col-sm-12">
										<div className="form-input message-input">
											<label className="cf-label" htmlFor="message-t4">
												Message here... *
											</label>
											<textarea
												name="message"
												id="message-t4"
												value={formData.message}
												onChange={handleChange}
												placeholder="Type your message"
												rows="3"
												required
											></textarea>
										</div>
									</div>
									<div className="submit-btn">
										<button
											className="tj-primary-btn"
											type="submit"
											disabled={loading || !hasServices}
										>
											<span className="btn-text">
												<span>{loading ? "Sending..." : "Send Message"}</span>
											</span>
											<span className="btn-icon">
												<i className="tji-arrow-right-long"></i>
											</span>
										</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-shape-1">
				<Image
					src="/images/shape/pattern-2.svg"
					alt=""
					width={100}
					height={100}
					style={{ width: "100%", height: "auto" }}
				/>
			</div>
			<div className="bg-shape-2">
				<Image
					src="/images/shape/pattern-3.svg"
					alt=""
					width={100}
					height={100}
					style={{ width: "100%", height: "auto" }}
				/>
			</div>
		</section>
		</>
	);
};

export default Testimonials4Client;
