[...document.querySelectorAll(".url-not-found")].forEach((element) => {
	element.href = element.getAttribute("data-url-prefix") + window.location.href;
});
document.getElementById("extra-url-info").classList.remove("hidden");
