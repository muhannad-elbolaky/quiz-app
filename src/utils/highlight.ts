export const highlight = (inputString: string): string => {
	const regex = /&&([^&]+)&&/g;
	const spanSize = inputString.length > 90 ? "3rem" : "5.4rem";
	const highlightedString = inputString.replace(
		regex,
		`<span style="color: yellow; font-size: ${spanSize}">$1</span>`,
	);
	const finalString = highlightedString.replace(/&&/g, "");
	return finalString;
};
