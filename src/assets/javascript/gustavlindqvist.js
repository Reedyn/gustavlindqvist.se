const gustavlindqvist = (() => {
	// Add js-class and remove no-js-class from <html>
	const isJS = (() => {
		const htmlElement = document.documentElement;

		htmlElement.classList.remove("no-js");
		htmlElement.classList.add("js");
	})();

	const initializeDayJS = (() => {
		dayjs.extend(dayjs_plugin_relativeTime);
		dayjs.locale("sv");
		[...document.querySelectorAll(".timeago")].forEach((element) => {
			if (typeof element.getAttribute("datetime") !== "undefined") {
				let newString = dayjs().to(element.attributes.datetime.value);

				const today = new Date();
				const date = new Date(element.attributes.datetime.value);

				// If date is today
				if (
					date.getDate() === today.getDate() &&
					date.getMonth() === today.getMonth() &&
					date.getFullYear() === today.getFullYear()
				) {
					newString = "idag";
				} else {
					if (typeof element.getAttribute("prefix") === "undefined") {
						newString = newString.replace("för ", "");
					}
				}

				if (element.hasAttribute("data-firstletterupper")) {
					newString = newString.charAt(0).toUpperCase() + newString.slice(1);
				}

				element.innerText = newString;
			}
		});
	})();

	return {
		isJS,
		initializeDayJS,
	};
})();
