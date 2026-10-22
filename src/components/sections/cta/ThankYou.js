"use client";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import { useSearchParams } from "next/navigation";

const CONTENT_MAP = {
	product: {
		eyebrow: "Product Inquiry Received",
		title: "Thank You for Your Product Inquiry!",
		description:
			"We have received your product inquiry and specifications. Our sales and technical experts will review your requirements and provide a tailored quotation and details shortly.",
		primaryBtn: { text: "Explore More Products", url: "/products" },
		secondaryBtn: { text: "Back to Home", url: "/" },
		iconColor: "var(--tj-color-theme-primary, #c49e48)",
		iconBg: "rgba(196, 158, 72, 0.12)",
		icon: (
			<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
				<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
				<polyline points="3.27 6.96 12 12.01 20.73 6.96" />
				<line x1="12" y1="22.08" x2="12" y2="12" />
			</svg>
		),
	},
	career: {
		eyebrow: "Application Submitted",
		title: "Thank You for Your Application!",
		description:
			"We have received your job application and resume. Our HR talent acquisition team will review your qualifications and reach out if your profile matches our requirements.",
		primaryBtn: { text: "View All Careers", url: "/careers" },
		secondaryBtn: { text: "Back to Home", url: "/" },
		iconColor: "#2563eb",
		iconBg: "rgba(37, 99, 235, 0.12)",
		icon: (
			<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
				<rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
				<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
			</svg>
		),
	},
	contact: {
		eyebrow: "Inquiry Received",
		title: "Thank You for Contacting Us!",
		description:
			"We have received your message and appreciate your interest in CROWN Packaging. Our team is reviewing your details and will get in touch with you shortly.",
		primaryBtn: { text: "Back to Home", url: "/" },
		secondaryBtn: { text: "Explore Products", url: "/products" },
		iconColor: "#10b981",
		iconBg: "rgba(16, 185, 129, 0.12)",
		icon: (
			<svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
				<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
				<polyline points="22 4 12 14.01 9 11.01" />
			</svg>
		),
	},
};

const ThankYou = ({ type: propType }) => {
	const searchParams = useSearchParams();
	const rawType = (propType || searchParams?.get("type") || "").toLowerCase().trim();

	let normalizedType = "contact";
	if (rawType.includes("product") || rawType.includes("quote") || rawType.includes("category")) {
		normalizedType = "product";
	} else if (rawType.includes("career") || rawType.includes("job") || rawType.includes("apply")) {
		normalizedType = "career";
	}

	const config = CONTENT_MAP[normalizedType] || CONTENT_MAP.contact;

	return (
		<section className="tj-thankyou-section section-gap" style={{ padding: "80px 0" }}>
			<div className="container">
				<div className="row justify-content-center">
					<div className="col-lg-8">
						<div
							className="thankyou-content text-center p-4 p-md-5"
							style={{
								background: "#ffffff",
								borderRadius: "16px",
								boxShadow: "0 10px 40px rgba(0, 0, 0, 0.05)",
								border: "1px solid #f0f2f5",
							}}
						>
							<div
								className="thankyou-icon mb-4 d-inline-flex align-items-center justify-content-center"
								style={{
									width: "90px",
									height: "90px",
									borderRadius: "50%",
									background: config.iconBg,
									color: config.iconColor,
								}}
							>
								{config.icon}
							</div>

							<span
								style={{
									display: "block",
									fontSize: "13px",
									fontWeight: "700",
									color: config.iconColor,
									textTransform: "uppercase",
									letterSpacing: "1.5px",
									marginBottom: "10px",
								}}
							>
								{config.eyebrow}
							</span>

							<h2 className="title mb-3" style={{ fontSize: "32px", fontWeight: "700" }}>
								{config.title}
							</h2>

							<p
								className="mb-4"
								style={{
									fontSize: "16px",
									lineHeight: "1.7",
									color: "#54606c",
									maxWidth: "580px",
									margin: "0 auto 30px auto",
								}}
							>
								{config.description}
							</p>

							<div className="thankyou-btns d-flex justify-content-center align-items-center gap-3 flex-wrap">
								<ButtonPrimary
									text={config.primaryBtn.text}
									url={config.primaryBtn.url}
									className="btn-primary"
								/>
								<ButtonPrimary
									text={config.secondaryBtn.text}
									url={config.secondaryBtn.url}
									className="btn-primary"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ThankYou;
