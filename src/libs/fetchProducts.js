const cmsBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3012";

export async function fetchProducts() {
	try {
		const response = await fetch(`${cmsBaseUrl}/api/data/our_products`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return data?.success ? data.data : [];
	} catch (error) {
		console.error("Error fetching products:", error);
		return [];
	}
}

export async function fetchIndustries() {
	try {
		const response = await fetch(`${cmsBaseUrl}/api/data/our_products`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();

		if (!data?.success || !data.data) return [];

		// Extract unique industries
		const industryMap = new Map();
		data.data.forEach(product => {
			if (product.industry_populated) {
				industryMap.set(product.industry, {
					id: product.industry,
					title: product.industry_populated.title,
					tag: product.industry_populated.tag,
				});
			}
		});

		return Array.from(industryMap.values());
	} catch (error) {
		console.error("Error fetching industries:", error);
		return [];
	}
}
