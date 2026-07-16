"use client";
import TeamCard2 from "@/components/shared/cards/TeamCard2";
import { useCallback, useEffect, useRef, useState } from "react";

const Team2Client = ({ items }) => {
	const [activeMember, setActiveMember] = useState(items?.[0]);
	const [fade, setFade] = useState(true);
	const [fade2, setFade2] = useState(true);
	const timeout1 = useRef(null);
	const timeout2 = useRef(null);
	const timeout3 = useRef(null);

	const handleMouseEnter = useCallback(member => {
		setActiveMember(member);
		setFade(false);
		setFade2(false);
		timeout1.current = setTimeout(() => {
			setFade(true);
			setFade2(true);
			timeout2.current = setTimeout(() => {
				setFade2(false);
				timeout3.current = setTimeout(() => {
					setFade2(true);
				}, 300);
			}, 300);
		}, 300);
	}, []);

	useEffect(() => {
		return () => {
			clearTimeout(timeout1.current);
			clearTimeout(timeout2.current);
			clearTimeout(timeout3.current);
		};
	}, []);

	return (
		<div className="team-wrapper">
			<div className="team-img-wrap wow fadeInUp" data-wow-delay=".5s">
				<div
					id="team-img"
					className="team-img"
					style={{
						transition: "all .3s ease-in-out",
						opacity: fade ? 1 : 0.3,
					}}
				>
					<img
						key={activeMember?.imgLarge} // forces fade on change
						src={activeMember?.imgLarge}
						alt={activeMember?.name}
						style={{
							transform: `scale(${fade2 ? 1 : 1.1})`,
							objectFit: "cover",
						}}
					/>
				</div>
			</div>
			<div className="team-item-wrap">
				{items.map((item, idx) => (
					<TeamCard2
						key={idx}
						teamMember={item}
						activeMember={activeMember}
						handleMouseEnter={handleMouseEnter}
					/>
				))}
			</div>
		</div>
	);
};

export default Team2Client;