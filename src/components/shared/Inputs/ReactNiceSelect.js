"use client";

import { useCallback, useEffect, useState } from "react";

const ReactNiceSelect = ({
	options = [],
	selectedIndex = 0,
	value,
	getSelectedOption = () => {},
	className,
	disabled = false,
	placeholder = "Choose a service",
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOption] = useState(() => options[selectedIndex] || options[0] || null);
	const [currentIndex, setCurrentIndex] = useState(selectedIndex);

	useEffect(() => {
		if (!options.length) return;

		const matchIndex =
			value !== undefined && value !== null
				? options.findIndex((option) => option.value === String(value))
				: selectedIndex;

		const nextIndex = matchIndex >= 0 ? matchIndex : selectedIndex;
		setSelectedOption(options[nextIndex] || options[0]);
		setCurrentIndex(nextIndex);
	}, [options, value, selectedIndex]);

	const { optionName } = selectedOption || {};

	const handleSelect = useCallback(
		(option, idx) => {
			if (disabled || !option.value) return;
			setSelectedOption(option);
			setCurrentIndex(idx);
			getSelectedOption(option.value);
			setIsOpen(false);
		},
		[disabled, getSelectedOption]
	);

	const toggleOpen = () => {
		if (disabled) return;
		setIsOpen((open) => !open);
	};

	return (
		<div
			data-lenis-prevent
			className={`nice-select wide ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${
				className || ""
			}`}
			tabIndex={disabled ? -1 : 0}
			onClick={toggleOpen}
			onBlur={() => setIsOpen(false)}
		>
			<span className="current">{optionName || placeholder}</span>

			<div className="nice-select-dropdown">
				<ul className="list">
					{options.map((option, idx) => (
						<li
							key={option.value || `option-${idx}`}
							data-value={option.value}
							className={`option ${currentIndex === idx ? "selected focus" : ""} ${
								!option.value ? "disabled" : ""
							}`}
							onMouseDown={(e) => e.preventDefault()}
							onClick={() => handleSelect(option, idx)}
						>
							{option.optionName}
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default ReactNiceSelect;
