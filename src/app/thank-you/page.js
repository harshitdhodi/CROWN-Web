import { Suspense } from "react";
import Header from "@/components/layout/header/Header";
import Footer8 from "@/components/layout/footer/Footer8";
import ThankYou from "@/components/sections/cta/ThankYou";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { getMeta } from "@/lib/getMeta";

export default async function ThankYouPage({ searchParams }) {
	const params = await searchParams;
	const type = params?.type;

	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<Suspense fallback={<div style={{ minHeight: "60vh" }} />}>
							<ThankYou type={type} />
						</Suspense>
					</main>
					<Footer8 />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}

export async function generateMetadata({ searchParams }) {
	const params = await searchParams;
	const type = params?.type;
	const baseMeta = await getMeta("/thank-you");

	let customTitle = baseMeta?.title || "Thank You | CROWN Packaging";
	if (type === "product") {
		customTitle = "Thank You for Your Inquiry | CROWN Packaging";
	} else if (type === "career") {
		customTitle = "Thank You for Your Application | CROWN Packaging";
	}

	return {
		...baseMeta,
		title: customTitle,
	};
}
