/**
 * Sets data-cms-page on body children wrapper so page-scoped section styles apply.
 * Usage on a page: <CmsPageRoot pageSlug="home">...</CmsPageRoot>
 */
const CmsPageRoot = ({ pageSlug, children }) => {
	if (!pageSlug) return children;

	return <div data-cms-page={pageSlug}>{children}</div>;
};

export default CmsPageRoot;
