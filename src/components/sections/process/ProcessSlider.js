"use client";
import { useEffect, useRef, useState } from "react";
import ProcessCard from "@/components/shared/cards/ProcessCard";

const ProcessSlider = ({ historyData }) => {
	const [cardsToShow, setCardsToShow] = useState(3);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isTransitioning, setIsTransitioning] = useState(true);
	const [isPaused, setIsPaused] = useState(false);

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setCardsToShow(1);
			} else if (window.innerWidth < 992) {
				setCardsToShow(2);
			} else {
				setCardsToShow(3);
			}
		};
		handleResize();
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const intervalRef = useRef(null);
	const originalCount = historyData?.length || 0;
	const processData = originalCount > 0 ? [...historyData, ...historyData.slice(0, cardsToShow)] : [];
	const totalCards = processData.length;

	// Fix animation calculation issue on load
	useEffect(() => {
		const refreshLayout = () => {
			window.dispatchEvent(new Event("resize"));
			if (window.ScrollTrigger) {
				window.ScrollTrigger.refresh();
			}
		};

		const timer = setTimeout(refreshLayout, 500);
		return () => clearTimeout(timer);
	}, []);

	const startAutoPlay = () => {
		clearInterval(intervalRef.current);
		intervalRef.current = setInterval(() => {
			setIsTransitioning(true);
			setCurrentIndex(prev => prev + cardsToShow);
		}, 3000);
	};

	useEffect(() => {
		if (!isPaused && originalCount > cardsToShow) startAutoPlay();
		else clearInterval(intervalRef.current);

		return () => clearInterval(intervalRef.current);
	}, [isPaused, originalCount]);

	// Infinite Loop Reset
	useEffect(() => {
		if (currentIndex >= originalCount && originalCount > 0) {
			const timer = setTimeout(() => {
				setIsTransitioning(false);
				setCurrentIndex(0);
			}, 700);
			return () => clearTimeout(timer);
		}
	}, [currentIndex, originalCount]);

	// Re-enable transition
	useEffect(() => {
		if (!isTransitioning) {
			const timer = setTimeout(() => setIsTransitioning(true), 50);
			return () => clearTimeout(timer);
		}
	}, [isTransitioning]);

	const translateX = totalCards > 0 ? -(currentIndex * (100 / totalCards)) : 0;

	if (originalCount === 0) return null;

	return (
		<div
			className="working-process-slider-wrapper"
			onMouseEnter={() => setIsPaused(true)}
			onMouseLeave={() => setIsPaused(false)}
		>
			<div
				className="working-process-track"
				style={{
					transform: `translateX(${translateX}%)`,
					transition: isTransitioning
						? "transform 0.7s cubic-bezier(0.4, 0.0, 0.2, 1)"
                        : "none",
					width: `${(totalCards / cardsToShow) * 100}%`,
					display: "flex",
				}}
			>
				{processData.map((processSingle, idx) => (
					<div
						key={`${processSingle.id}-${idx}`}
						className="process-slide-item"
						style={{
							width: `${100 / totalCards}%`,
							flexShrink: 0,
						}}
					>
						<ProcessCard processSingle={processSingle} idx={idx % originalCount} />
					</div>
				))}
			</div>

			{/* Pagination Dots */}
			<div className="process-pagination mt-4 d-flex justify-content-center gap-2">
				{Array.from({ length: Math.ceil(originalCount / cardsToShow) }).map((_, pageIndex) => {
					// We calculate active dot based on the current index block
					const isActive = Math.floor((currentIndex % originalCount) / cardsToShow) === pageIndex;
					return (
						<button
							key={pageIndex}
							className={`process-dot ${isActive ? 'active' : ''}`}
							onClick={() => {
								setIsTransitioning(true);
								setCurrentIndex(pageIndex * cardsToShow);
							}}
							aria-label={`Go to page ${pageIndex + 1}`}
						/>
					);
				})}
			</div>

			<style jsx>{`
				.working-process-slider-wrapper {
					overflow: hidden;
					width: 100%;
					position: relative;
					padding-bottom: 30px;
				}
				.working-process-track {
					will-change: transform;
				}
				.process-slide-item {
					padding: 0 12px;
					box-sizing: border-box;
					display: flex;
				}
				:global(.process-item) {
					height: 100%;
					width: 100%;
				}
				.process-pagination {
					position: absolute;
					bottom: 0;
					left: 0;
					width: 100%;
				}
				.process-dot {
					width: 12px;
					height: 12px;
					border-radius: 50%;
					border: 2px solid var(--tj-color-theme-primary);
					background: transparent;
					padding: 0;
					transition: all 0.3s ease;
					cursor: pointer;
				}
				.process-dot.active {
					background: var(--tj-color-theme-primary);
					transform: scale(1.2);
				}
			`}</style>
		</div>
	);
};

export default ProcessSlider;