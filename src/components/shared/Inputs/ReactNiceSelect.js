"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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
	const selectRef = useRef(null);

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

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event) => {
			if (selectRef.current && !selectRef.current.contains(event.target)) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		document.addEventListener("touchstart", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
			document.removeEventListener("touchstart", handleClickOutside);
		};
	}, [isOpen]);

	const { optionName } = selectedOption || {};

	const handleSelect = useCallback(
		(option, idx) => {
			if (disabled || option.disabled) return;
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
			ref={selectRef}
			data-lenis-prevent
			className={`nice-select wide ${isOpen ? "open" : ""} ${disabled ? "disabled" : ""} ${
				className || ""
			}`}
			tabIndex={disabled ? -1 : 0}
			onClick={toggleOpen}
		>
			<span className="current">{optionName || placeholder}</span>

			<div className="nice-select-dropdown">
				<ul className="list">
					{options.map((option, idx) => (
						<li
							key={option.value || `option-${idx}`}
							data-value={option.value}
							className={`option ${currentIndex === idx ? "selected focus" : ""} ${
								option.disabled ? "disabled" : ""
							}`}
							onMouseDown={(e) => e.preventDefault()}
							onClick={(e) => { e.stopPropagation(); handleSelect(option, idx); }}
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
