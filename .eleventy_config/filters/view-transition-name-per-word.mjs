export default function (title, hash) {
	const words = title.split(' ');
	const title_separated = [];
	let counter = 0;

	words.forEach((word) => {
		title_separated.push(
			`<span style="view-transition-name: title-${hash}-${counter};">${word}</span>`,
		);
		counter++;
	});

	return title_separated.join(' ');
}
