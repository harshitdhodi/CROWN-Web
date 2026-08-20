export function sortProductsBySequence(products) {
	if (!Array.isArray(products)) return products;

	const getIndex = (item) => {
		const slug = (item?.slug || item?.product_slug || "").toLowerCase();
		const title = (item?.product_name || item?.name || item?.title || "").toLowerCase();

		if (slug.includes("dry-syrup") || title.includes("dry syrup")) return 0;
		if (slug.includes("dropper") || title.includes("dropper")) return 1;
		if (slug.includes("tablet") || title.includes("tablet")) return 2;
		if (slug.includes("cap") || slug.includes("closure") || title.includes("cap") || title.includes("closure")) return 3;
		if (slug.includes("measuring") || title.includes("measuring")) return 4;

		return 99;
	};

	return [...products].sort((a, b) => getIndex(a) - getIndex(b));
}

export default sortProductsBySequence;
