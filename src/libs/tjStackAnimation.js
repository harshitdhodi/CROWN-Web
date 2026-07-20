import { gsap } from "@/libs/gsap.config";
const tjStackAnimation = selector => {
	const animItems = gsap.utils.toArray(".service-stack");
	if (animItems?.length) {
		let mediaMatch = gsap.matchMedia();
		mediaMatch.add("(min-width: 992px)", () => {
			animItems.forEach(item => {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: item,
						scrub: true,
						start: "top 20px",
						pin: true,
						pinSpacing: false,
						markers: false,
					},
				});

				// Hold card fully visible at top before animating
				tl.to(item, {
					duration: 0.5,
				});

				// Fade out and scale down
				tl.to(item, {
					opacity: 0,
					scale: 0.9,
					y: 50,
					duration: 1,
				});
			});
		});
	}
};
export default tjStackAnimation;
