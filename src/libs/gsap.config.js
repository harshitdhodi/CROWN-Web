import { useGSAP } from "@gsap/react";
import gsap from "gsap/dist/gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(
	ScrollTrigger,
	ScrollSmoother,
	ScrollToPlugin,
	useGSAP
);

export { gsap, ScrollSmoother, ScrollTrigger, useGSAP };
