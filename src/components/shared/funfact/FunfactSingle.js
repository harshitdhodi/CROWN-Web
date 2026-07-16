"use client";
// odometer-theme-default.css is deferred via DeferredStyles in layout.js
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const FunfactSingle = ({ currentValue, symbol, sup, type }) => {
	const numericValue = typeof currentValue === "string" ? parseFloat(currentValue) : Number(currentValue || 0);
	const hasDecimal = !isNaN(numericValue) && numericValue % 1 !== 0;

	const [value, setValue] = useState(0);

	const [Odometer, setOdometer] = useState(null);
	// Intersection Observer
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.4, // Adjust as needed
	});
	useEffect(() => {
		import("react-odometerjs").then(mod => setOdometer(() => mod.default));
	}, []);

	// Trigger odometer when visible
	useEffect(() => {
		if (inView) {
			const timeoutId = setTimeout(() => {
				setValue(isNaN(numericValue) ? 0 : numericValue);
			}, 250);
			return () => clearTimeout(timeoutId);
		}
	}, [inView, numericValue]);

	return (
		<div
			ref={ref}
			className={ 
				type === 3
					? "h5-about-counter"
					: type === 2
					? "hero-counter"
					: "inline-content"
			}
		>
			{Odometer ? (
				<Odometer
					className={`odometer  ${
						type === 2 || type === 3 ? "" : "countup-number"
					}`}
					value={value}
					format={hasDecimal ? "(,ddd).d" : "d"}
				/>
			) : (
				<div
					className={`odometer odometer-auto-theme ${
						type === 2 || type === 3 ? "" : "countup-number"
					}`}
				>
					<div className="odometer-inside">
						<span className="odometer-digit">
							<span className="odometer-digit-spacer">0</span>
							<span className="odometer-digit-inner">
								<span className="odometer-ribbon">
									<span className="odometer-ribbon-inner">
										<span className="odometer-value">0</span>
									</span>
								</span>
							</span>
						</span>
					</div>
				</div>
			)}{" "}
			{sup ? <sup className="count-plus">{sup}</sup> : ""}
			{symbol ? (
				<span
					className={`${type === 3 ? "h5-about-counter-symbol" : "count-plus"}`}
				>
					{symbol}
				</span>
			) : (
				""
			)}
		</div>
	);
};

export default FunfactSingle;
