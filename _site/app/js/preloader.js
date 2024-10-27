// your-script.js
document.addEventListener("DOMContentLoaded", function () {
  // When the document is loaded, remove the preloader
  const preloader = document.querySelector(".preloader");

  // Optional: Add a delay before removing the preloader for better effect
  setTimeout(() => {
    preloader.style.opacity = "0"; // Fade out
    preloader.style.transition = "opacity 0.5s ease"; // Transition for fade out
    setTimeout(() => {
      preloader.style.display = "none"; // Remove from view
    }, 500); // Match this timeout with the transition duration
  }, 1000); // Adjust this delay as needed (in milliseconds)
});
