import ButtonPrimary from "@/components/shared/buttons/ButtonPrimary";
import Team2Client from "./Team2Client";

async function getTeamData() {
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Ensure this points to your API server
	try {
		const [headingRes, teamRes] = await Promise.all([
			fetch(`${baseUrl}/api/heading?section=our-team`, {
				next: { revalidate: 60 },
			}),
			fetch(`${baseUrl}/api/data/our_team`, {
				next: { revalidate: 60 },
			}),
		]);

		const headingData = await headingRes.json();
		const teamData = await teamRes.json();

		return {
			heading: headingData?.success ? headingData.data : null,
			teamMembers: teamData?.success ? teamData.data : [],
		};
	} catch (error) {
		console.error("Error fetching team data:", error);
		return { heading: null, teamMembers: [] };
	}
}

const Team2 = async () => {
	const { heading, teamMembers } = await getTeamData();

	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"; // Ensure this points to your API server

	const resolveImg = (src) => {
		if (!src) return null;
		if (Array.isArray(src)) return resolveImg(src[0]);
		if (typeof src !== "string") return null;
		return src.startsWith("/") ? `${baseUrl}${src}` : src;
	};

	// Map API data to component requirements and limit to 4
	const formattedMembers = teamMembers.slice(0, 4).map(member => {
		const resolvedImg = resolveImg(member.image);
		return {
			...member,
			desig: member.designation,
			imgLarge: resolvedImg,
			img: resolvedImg,
		};
	});

	return (
		<section className="tj-team-section-2 tj-working-process section-gap">
			<div className="container">
				<div className="row">
					<div className="col-12">
						<div className="sec-heading-wrap">
							<span className="sub-title wow fadeInUp" data-wow-delay=".3s" style={{ backgroundColor: 'transparent', border: '1px dashed var(--tj-color-border-1)', padding: '2px 10px' }}>
								<i className="tji-box"></i>
								{heading?.tagline || "Meet Our Team"}
							</span>
							<div className="heading-wrap-content">
								<div className="sec-heading style-3">
									<h2 className="sec-title title-anim">
										{heading?.heading || "People Behind Wiretex."}
									</h2>
								</div>
								{heading?.subheading && (
									<p className="desc wow fadeInUp" data-wow-delay=".4s">
										{heading.subheading}
									</p>
								)}
								<div className="btn-wrap wow fadeInUp" data-wow-delay=".5s">
									<ButtonPrimary text="More Members" url="/team" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-12">
						{formattedMembers.length > 0 && (
							<Team2Client items={formattedMembers} />
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default Team2;
