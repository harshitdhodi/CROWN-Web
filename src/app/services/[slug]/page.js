import Footer8 from "@/components/layout/footer/Footer8";
import Header from "@/components/layout/header/Header";
import ServiceDetailsMain from "@/components/layout/main/ServiceDetailsMain";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import getALlServices from "@/libs/getALlServices";
import getServiceBySlug from "@/libs/getServiceBySlug";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://wiretex.rndtd.com";

export async function generateMetadata({ params }) {
	const { slug } = await params;
	const service = await getServiceBySlug(slug);

	if (!service) return {};

	const title = service.metatitle || service.title;
	const description = service.meta_description || service.desc || "";
	const keywords = Array.isArray(service.meta_keyword)
		? service.meta_keyword.join(", ")
		: service.meta_keyword || "";
	const canonical = service.canonical_link || `${SITE_URL}/services/${slug}`;
	const ogImage = service.img?.startsWith("http") ? service.img : null;

	return {
		title,
		description,
		keywords,
		alternates: { canonical },
		openGraph: {
			title,
			description,
			url: canonical,
			type: "website",
			...(ogImage && { images: [{ url: ogImage, alt: service.title }] }),
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			...(ogImage && { images: [ogImage] }),
		},
	};
}

export default async function ServiceDetails({ params }) {
	const { slug } = await params;
	const items = await getALlServices();

	const isExistItem = items?.find((item) => item.slug === slug);
	if (!isExistItem) {
		notFound();
	}

	const service = await getServiceBySlug(slug);

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			{/* Inject JSON-LD schema from service CMS field */}
			{service?.schema && (
				<div dangerouslySetInnerHTML={{ __html: service.schema }} />
			)}
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<ServiceDetailsMain currentItemSlug={slug} />
					</main>
					<Footer8 />
				</div>
			</div>

			<ClientWrapper />
		</div>
	);
}

export async function generateStaticParams() {
	try {
		const items = await getALlServices();
		return items?.map(({ slug }) => ({ slug })) || [];
	} catch (error) {
		console.error("Error in generateStaticParams for services:", error);
		return [];
	}
}
