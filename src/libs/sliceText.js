const sliceText = (text, length, ext) => {
	if (!text) return "";
	return text.length > length
		? `${text.slice(0, ext ? length - 3 : length)}${ext ? "..." : ""}`
		: text;
};

export default sliceText;
