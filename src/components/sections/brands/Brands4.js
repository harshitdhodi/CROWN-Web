import dynamic from "next/dynamic";
import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import FunfactSingle from "@/components/shared/funfact/FunfactSingle";
import Image from "next/image";

const BrandSlider3 = dynamic(
	() => import("@/components/shared/brands/BrandSlider3")
);

import { getCmsBase, resolveCmsImage } from "@/lib/seoConfig";

async function getClientData() {
	const cmsBase = getCmsBase();
	const baseUrls = [
		cmsBase,
		"http://localhost:3014",
		"http://127.0.0.1:3014",
		"https://demoadmin.crownpack.in"
	];

	for (const base of baseUrls) {
		if (!base) continue;
		for (const col of ["clients", "whychooseus"]) {
			try {
				const res = await fetch(`${base}/api/data/${col}`, { next: { revalidate: 0 } });
				if (!res.ok) continue;
				const result = await res.json().catch(() => null);

				if (result?.success && result.data?.length > 0) {
					const item = result.data[0];
					let logos = [];
					result.data.forEach((row) => {
						const logoField = row.logo || row.image || row.logos || row.images || row.color_img;
						if (logoField) {
							if (Array.isArray(logoField)) {
								logoField.forEach((l) => {
									const resolved = resolveCmsImage(l);
									if (resolved) logos.push({ img: resolved });
								});
							} else {
								const resolved = resolveCmsImage(logoField);
								if (resolved) logos.push({ img: resolved });
							}
						}
					});

					return {
						...item,
						hover_image: resolveCmsImage(item.hover_image),
						logo: logos.length > 0 ? logos : (item.logo || []).map((img) => ({
							img: resolveCmsImage(img),
						})),
					};
				}
			} catch (error) {
				// try next
			}
		}
	}
	return null;
}

const DEFAULT_BRAND_DATA = {
	tagline: "Our PARTNERSHIP",
	title: "Powering Innovation Through Partnerships with Brands and Many Companies.",
	logo: [
		{ img: "/images/logos/logo.webp" },
		{ img: "/images/logos/logo.webp" },
		{ img: "/images/logos/logo.webp" },
		{ img: "/images/logos/logo.webp" },
		{ img: "/images/logos/logo.webp" }
	]
};

const Brands4 = async () => {
	const fetchedClientData = await getClientData();
	const clientData = (fetchedClientData && fetchedClientData.logo?.length > 0)
		? fetchedClientData
		: DEFAULT_BRAND_DATA;

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
