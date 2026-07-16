"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Logo = ({ headerType, isStickyHeader, isSticky }) => {
	const defaultLogo = (headerType === 2 || headerType === 5 || headerType === 7 || headerType === 9) && !isStickyHeader
		? "/images/logos/logo-2.webp"
		: "/images/logos/logo.webp";

	const [footerData, setFooterData] = useState(null);
	const pathname = usePathname();
	const isHome = pathname === "/";

	useEffect(() => {
		const cmsBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";
		fetch(`${cmsBase}/api/data/footer`)
			.then(res => res.json())
			.then(json => {
				if (json.success && json.data?.length > 0) {
					setFooterData(json.data[0]);
				}
			})
			.catch(err => console.error("Failed to fetch logo:", err));
	}, []);

	let logoUrl = defaultLogo;
	if (footerData) {
		const cmsLogo = footerData.logo?.[0];
		const cmsHeaderLogo = footerData.headerlogo?.[0];
		const cmsBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

		const resolveUrl = (url) => {
			if (!url) return null;
			let cleanUrl = url;
			if (url.includes("/uploads/")) {
				cleanUrl = "/uploads/" + url.split("/uploads/")[1];
			}
			if (cleanUrl.startsWith("/") && !cleanUrl.startsWith("/images/")) {
				return `${cmsBase}${cleanUrl}`;
			}
			return cleanUrl;
		};

		if (isHome) {
			// Home page logic: standard logo before scroll, headerlogo after scroll
			if (!isSticky && cmsLogo) {
				logoUrl = resolveUrl(cmsLogo);
			} else if (isSticky && cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo);
			} else if (cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo);
			}
		} else {
			// Inner pages: always use the header logo
			if (cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo);
			} else if (cmsLogo) {
				logoUrl = resolveUrl(cmsLogo);
			}
		}
	}

	return (
		<div className="site_logo">
			<Link className="logo" href="/">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={logoUrl}
					alt="Site Logo"
					width={136}
					height={45}
					style={{ height: "auto", width: "100%", maxWidth: "70px", paddingTop:"5px",paddingBottom:"5px" }}
				/>
			</Link>
		</div>
	);
};

export default Logo;
