import Header from "@/components/layout/header/Header";
import Cta from "@/components/sections/cta/Cta";
import HeroInner from "@/components/sections/hero/HeroInner";
import ThankYou from "@/components/sections/cta/ThankYou";
import BackToTop from "@/components/shared/others/BackToTop";
import HeaderSpace from "@/components/shared/others/HeaderSpace";
import ClientWrapper from "@/components/shared/wrappers/ClientWrapper";
import Footer8 from "@/components/layout/footer/Footer8";
import { getMeta } from "@/lib/getMeta";

export async function generateMetadata() {
	return await getMeta("/contact/thank-you");
}

export default function ContactThankYouPage() {
	return (
		<div>
			<BackToTop />
			<Header />
			<Header isStickyHeader={true} />
			<div id="smooth-wrapper">
				<div id="smooth-content">
					<main>
						<HeaderSpace />
						<HeaderSpace />
						{/* <HeroInner title={"Thank You"} text={"Message Sent"} /> */}
						<ThankYou />
					
					</main>
					{/* <Footer8 /> */}
				</div>
			</div>
			<ClientWrapper />
		</div>
	);
}
