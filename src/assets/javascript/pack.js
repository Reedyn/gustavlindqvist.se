[...document.querySelectorAll(".pack__list-button__show-inventory")].forEach((button) => {
	button.addEventListener("click", (event) => {
		let container = event.target.closest(".equipment");

		container.classList.remove("-collapsed"); // Show the entire list
		container.removeChild(event.target); // Remove the button
	});
});
