import { gsap } from "@/libs/gsap.config";

const fadeUpAnim = () => {
	const animItems = gsap.utils.toArray(".fade-up-anim");
	if (animItems.length) {
		animItems.forEach((element) => {
			let delayValue = element.getAttribute("data-gsap-delay") || 0;
			gsap.from(element, {
				y: 30,
				autoAlpha: 0,
				duration: 1,
				delay: parseFloat(delayValue),
				ease: "power2.out",
				scrollTrigger: { 
					trigger: element, 
					start: "top 90%",
				},
			});
		});
	}
};

export default fadeUpAnim;
