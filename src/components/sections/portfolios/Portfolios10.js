"use client";

import PortfolioCard10 from "@/components/shared/cards/PortfolioCard10";
import { fetchProducts, fetchIndustries } from "@/libs/fetchProducts";
import { useEffect, useRef, useState } from "react";

const Portfolios10 = () => {
	const [products, setProducts] = useState([]);
	const [industries, setIndustries] = useState([]);
	const [filteredProducts, setFilteredProducts] = useState([]);
	const gridRef = useRef(null);
	const btnGroupRef = useRef(null);

	// Fetch products and industries on mount
	useEffect(() => {
		const loadData = async () => {
			const productsData = await fetchProducts();
			console.log("Fetched products:", productsData);
			setProducts(productsData);
			setFilteredProducts(productsData);

			const industriesData = await fetchIndustries();
			setIndustries(industriesData);
		};

		loadData();
	}, []);

	useEffect(() => {
		if (!products.length) return;
		let iso = null;
		let imgLoad = null;
		let imagesLoaded = null;
		let Isotope = null;

		// Dynamically import only on the client f
		(async () => {
			const imagesLoadedModule = await import(
				"imagesloaded/imagesloaded.pkgd.min.js"
			);
			const isotopeModule = await import("isotope-layout");
			imagesLoaded = imagesLoadedModule.default;
			Isotope = isotopeModule.default;
			imgLoad = imagesLoaded(gridRef.current, () => {
				iso = new Isotope(gridRef.current, {
					itemSelector: ".portfolio-filter-item",
					percentPosition: true,
					masonry: {
						columnWidth: ".portfolio-sizer",
						gutter: ".gutter-sizer",
					},
				});
			});
		})();

		// Filter button handler
		const btnGroup = btnGroupRef.current;
		const handleBtnClick = e => {
			if (e.target.tagName !== "BUTTON") return;
			const filterValue = e.target.getAttribute("data-filter");

			btnGroup
				.querySelectorAll("button")
				.forEach(btn => btn.classList.remove("active"));
			e.target.classList.add("active");

			if (filterValue === "*") {
				setFilteredProducts(products);
			} else {
				setFilteredProducts(
					products.filter(p => p.industry === filterValue)
				);
			}

			iso?.arrange({ filter: filterValue });
		};
		btnGroup.addEventListener("click", handleBtnClick);
		return () => {
			btnGroup.removeEventListener("click", handleBtnClick);
			imgLoad?.off?.("always");
			iso?.destroy();
		};
	}, [products]);
	return (
		<section className="h10-project section-gap tj-sticky-panel-container">
			<div className="container">
				<div className="row">
					{/* Heading */}
					<div className="col-12">
						<div className="sec-heading style-3 sec-heading-centered">
							<span className="sub-title">
								<i className="tji-box hidden sm:block mb-2 sm:mb-0"></i>Latest Projects
							</span>
							<h2 className="sec-title text-anim">
								Breaking Boundaries, Building Dreams.
							</h2>

							{/* Filter Buttons */}
							<div className="portfolio-filter h10-project-filter text-center">
								<div
									className="button-group h10-project-button-group filter-button-group"
									ref={btnGroupRef}
								>
									<button data-filter="*" className="active">
										All
									</button>
									{industries.map(industry => (
										<button key={industry.id} data-filter={industry.id}>
											{industry.title || industry.tag}
										</button>
									))}
									<div className="active-bg"></div>
								</div>
							</div>
						</div>
					</div>

					{/* Grid */}
					<div className="col-12">
						<div
							className="project-wrapper h7-project-wrapper h10-project-wrapper portfolio-filter-box"
							ref={gridRef}
						>
							<div className="portfolio-sizer"></div>
							<div className="gutter-sizer"></div>

							{/* Your Items */}
							{filteredProducts?.length
								? filteredProducts?.map((product, idx) => {
									const industryTitle =
										product.industry_populated?.title ||
										product.industry_populated?.tag ||
										"Uncategorized";
									return (
										<PortfolioCard10
											key={idx}
											portfolio={{
												...product,
												dataFilter: product.industry,
												img8: product.image?.[0]
													? `http://localhost:3012${product.image[0]}`
													: "/images/project/h10-project-1.webp",
												category: industryTitle,
												title: product.name,
												slug: product.slug,
											}}
										/>
									);
								})
								: ""}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Portfolios10;
