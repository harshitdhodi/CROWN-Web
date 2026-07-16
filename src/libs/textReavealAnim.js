import { gsap } from "@/libs/gsap.config";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const textReavealAnim = contanerRef => {
	const animItems = gsap.utils.toArray(".tj-text-invert:not(.start-anim)");
	if (animItems.length) {
		animItems.forEach(element => {
			element.classList.add("start-anim");
			const split = new SplitText(element, { type: "lines" });
			split.lines.forEach(target => {
				gsap.to(target, {
					backgroundPositionX: 0,
					ease: "none",
					scrollTrigger: {
						trigger: target,
						scrub: 1,
						start: "top 85%",
						end: "bottom center",
					},
				});
			});
		});
	}
};

export default textReavealAnim;
