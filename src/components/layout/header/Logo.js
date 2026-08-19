"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLogoData } from "@/components/shared/providers/LogoProvider";

function extractUrl(val) {
	if (!val) return null;
	if (Array.isArray(val)) return val[0] || null;
	if (typeof val === 'string') return val.trim();
	return null;
}

const Logo = ({ headerType, isStickyHeader, isSticky }) => {
	const defaultLogo = "/images/logos/page3.png";
	const cmsBase = "https://demoadmin.crownpack.in";

	const footerData = useLogoData();
	const pathname = usePathname();
	const isHome = pathname === "/";

	let targetLogo = defaultLogo;

	if (footerData) {
		const rawLogo = extractUrl(footerData.logo);
		const rawHeaderLogo = extractUrl(footerData.headerlogo);

		const resolveUrl = (url) => {
			if (!url) return null;
			let cleanUrl = url;
			if (url.includes("/uploads/")) {
				cleanUrl = "/uploads/" + url.split("/uploads/")[1];
			}
			if (cleanUrl.startsWith("/")) {
				return `${cmsBase}${cleanUrl}`;
			}
			return cleanUrl;
		};

		const cmsLogo = resolveUrl(rawLogo);
		const cmsHeaderLogo = resolveUrl(rawHeaderLogo);

		if (isHome) {
			// Home Page ONLY: transparent navbar uses logo field, sticky navbar uses headerlogo field
			if (isStickyHeader || isSticky) {
				targetLogo = cmsHeaderLogo || cmsLogo || defaultLogo;
			} else {
				targetLogo = cmsLogo || cmsHeaderLogo || defaultLogo;
			}
		} else {
			// All inner pages (/about-us, /contact, etc.): ALWAYS show headerlogo image
			targetLogo = cmsHeaderLogo || cmsLogo || defaultLogo;
		}
	}

	const [imgSrc, setImgSrc] = useState(targetLogo);

	useEffect(() => {
		setImgSrc(targetLogo);
	}, [targetLogo]);

	return (
		<div className="site_logo">
			<Link className="logo" href="/">
				{/* eslint-disable-next-line @next/next/no-img-element */}
				<img
					src={imgSrc || defaultLogo}
					alt="Site Logo"
					width={180}
					height={65}
					style={{ height: "auto", maxHeight: "80px", maxWidth: "180px", width: "auto", objectFit: "contain" }}
					onError={() => {
						if (imgSrc !== defaultLogo) {
							setImgSrc(defaultLogo);
						}
					}}
				/>
			</Link>
		</div>
	);
};

export default Logo;
