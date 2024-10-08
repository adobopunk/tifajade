const themeToggleButton = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Define the paths for sun and moon icons
const sunIconSrc = "/assets/img/icons8-day-and-night-30.png";
const moonIconSrc = "/assets/img/icons8-day-and-night-30.png";

// Check local storage for the current theme, default to light
const currentTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", currentTheme);

// Set the initial icon based on the current theme
themeIcon.src = currentTheme === "dark" ? moonIconSrc : sunIconSrc;

themeToggleButton.addEventListener("click", () => {
  const newTheme =
    document.documentElement.getAttribute("data-theme") === "light"
      ? "dark"
      : "light";

  // Toggle theme and save it in local storage
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  // Switch the icon
  themeIcon.src = newTheme === "dark" ? moonIconSrc : sunIconSrc;
});
