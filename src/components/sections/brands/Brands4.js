import dynamic from "next/dynamic";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import FunfactSingle from "@/components/shared/funfact/FunfactSingle";
import Image from "next/image";

const BrandSlider3 = dynamic(
	() => import("@/components/shared/brands/BrandSlider3")
);

import { resolveCmsImage } from "@/lib/seoConfig";

async function getClientData() {
	try {
		const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
		const res = await fetch(`${baseUrl}/api/data/clients`, {
			next: { revalidate: 60 }, // ISR: Revalidate data every 60 seconds
		});

		const result = await res.json();

		if (result?.success && result.data?.length > 0) {
			const item = result.data[0];

			return {
				...item,
				hover_image: resolveCmsImage(item.hover_image),
				// Format logos as objects with an 'img' property, which is standard for components in this template
				logo: (item.logo || []).map((img) => ({
					img: resolveCmsImage(img),
				})),
			};
		}
	} catch (error) {
		console.error("Error fetching client data:", error);
	}
	return null;
}

const Brands4 = async () => {
	const clientData = await getClientData();

	return (
		<section className="tj-contact-section  section-gap section-gap-x h6-project brands-section-wrapper">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="about-content-area style-3 h5-about-content">
							<div className="sec-heading style-3">

								<div className="h5-about-content-right">

									<div className="h5-sec-title-wrapper">
										<span className="sub-title wow fadeInUp" data-wow-delay=".3s">
											<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>{clientData?.tagline || "Our PARTNERSHIP"}
										</span>
										<h2 className="subtitle-tex title-highlight !text-white">
											{clientData?.title || "Powering2 Innovation Through Partnerships with Brands and Many Companies."}
										</h2>
										<div
											className="about-btn-area-2 mt-5 wow fadeInUp"
											data-wow-delay="1s"
										>
											<ButtonPrimary text={"Get In Touch"} url={"/contact"} />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<BrandSlider3
				logos={clientData?.logo}
				hoverImage={clientData?.hover_image}
			/>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					left: 0,
					width: "100%",
					height: "200px",
					background: "linear-gradient(to top, color-mix(in srgb, var(--tj-color-theme-primary) 5%, transparent), transparent)",
					pointerEvents: "none",
					zIndex: 0
				}}
			/>
			<style>{`
				.brands-section-wrapper {
					margin-top: 30px !important;
					margin-bottom: 30px !important;
				}
				@media (min-width: 992px) {
					.brands-section-wrapper {
						margin-top: 50px !important;
						margin-bottom: 50px !important;
					}
				}
			`}</style>
		</section>
	);
};

export default Brands4;
