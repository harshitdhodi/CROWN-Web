const getPreviousNextItem = (items, currentId) => {
	if (!items?.length) return {};
	const currentIndex = items.findIndex((item) => item.id === currentId);

	const prevItem = currentIndex > 0 ? items[currentIndex - 1] : null;
	const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

	const prevSlug = prevItem?.slug;
	const nextSlug = nextItem?.slug;
	const currentItem = items?.[currentIndex];
	const isPrevItem = !!prevItem;
	const isNextItem = !!nextItem;
	return { prevSlug, nextSlug, currentItem, isPrevItem, isNextItem };
};

export default getPreviousNextItem;
