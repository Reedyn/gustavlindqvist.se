const commentForm = document.getElementById("comment-form");

document.getElementById("content").addEventListener("focus", (event) => {
	commentForm.classList.remove("-inactive");
	event.target.attributes.placeholder.value = "";
});

const handleSubmit = (e) => {
	e.preventDefault();
	let formStatus = document.getElementById("form-status");
	let formData = new FormData(commentForm);
	fetch("/", {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams(formData).toString(),
	})
		.then(() => {
			commentForm.classList.add("hidden");
			formStatus.innerText =
				"Tack för din kommentar! Hanteringen sker manuellt och publiceringen sker vanligtvis inom någon dag.";
			formStatus.classList.remove("hidden");
		})
		.catch((error) => alert(error));
};

document.querySelector("form").addEventListener("submit", handleSubmit);
