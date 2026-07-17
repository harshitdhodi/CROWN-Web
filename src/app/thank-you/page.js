import Header from "@/components/layout/header/Header";
import Footer8 from "@/components/layout/footer/Footer8";
import ThankYou from "@/components/sections/cta/ThankYou";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import { getMeta } from "@/lib/getMeta";

export default function ThankYouPage() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<ThankYou />
					</main>
					<Footer8 />
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}

export async function generateMetadata() {
	return await getMeta("/thank-you");
}
