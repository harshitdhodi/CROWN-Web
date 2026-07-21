"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLogoData } from "@/components/shared/providers/LogoProvider";

const Logo = ({ headerType, isStickyHeader, isSticky }) => {
	const defaultLogo = (headerType === 2 || headerType === 5 || headerType === 7 || headerType === 9) && !isStickyHeader
		? "/images/logos/page3.png"
		: "/images/logos/page3.png";

	const footerData = useLogoData();
	const pathname = usePathname();
	const isHome = pathname === "/";

	let logoUrl = defaultLogo;
	if (footerData) {
		const cmsLogo = footerData.logo?.[0];
		const cmsHeaderLogo = footerData.headerlogo?.[0];
		const cmsBase = "https://demoadmin.crownpack.in";

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
				logoUrl = resolveUrl(cmsLogo) || defaultLogo;
			} else if (isSticky && cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo) || defaultLogo;
			} else if (cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo) || defaultLogo;
			}
		} else {
			// Inner pages: always use the header logo
			if (cmsHeaderLogo) {
				logoUrl = resolveUrl(cmsHeaderLogo) || defaultLogo;
			} else if (cmsLogo) {
				logoUrl = resolveUrl(cmsLogo) || defaultLogo;
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
					style={{ height: "auto", width: "100%" }}
				/>
			</Link>
		</div>
	);
};

export default Logo;
