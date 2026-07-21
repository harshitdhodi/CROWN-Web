"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

let cachedFooterData = null;
let isFetchingFooterData = false;
let footerDataSubscribers = [];

const Logo = ({ headerType, isStickyHeader, isSticky }) => {
	const defaultLogo = (headerType === 2 || headerType === 5 || headerType === 7 || headerType === 9) && !isStickyHeader
		? "/images/logos/page3.png"
		: "/images/logos/page3.png";

	const [footerData, setFooterData] = useState(cachedFooterData);
	const pathname = usePathname();
	const isHome = pathname === "/";

	useEffect(() => {
		if (cachedFooterData) {
			return;
		}

		const handleData = (data) => setFooterData(data);
		footerDataSubscribers.push(handleData);

		if (!isFetchingFooterData) {
			isFetchingFooterData = true;
			const cmsBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";
			fetch(`${cmsBase}/api/data/footer`)
				.then(res => res.json())
				.then(json => {
					if (json.success && json.data?.length > 0) {
						cachedFooterData = json.data[0];
						footerDataSubscribers.forEach(sub => sub(cachedFooterData));
					}
				})
				.catch(err => {
					console.error("Failed to fetch logo:", err);
				})
				.finally(() => {
					footerDataSubscribers = [];
					isFetchingFooterData = false;
				});
		}

		return () => {
			footerDataSubscribers = footerDataSubscribers.filter(sub => sub !== handleData);
		};
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
					style={{ height: "auto", width: "100%" }}
				/>
			</Link>
		</div>
	);
};

export default Logo;
