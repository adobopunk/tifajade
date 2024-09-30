window.onload = function () {
	// Get the current year
	const currentYear = new Date().getFullYear();

	// Get the span element
	const yearSpan = document.getElementById('currentYear');

	// Update the span element with the current year
	yearSpan.textContent = currentYear;
};
