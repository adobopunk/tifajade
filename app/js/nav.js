document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const hamburgerMenuOverlay = document.getElementById(
    "hamburger-menu-overlay"
  );
  const closeHamburgerMenu = document.getElementById("close-hamburger-menu");

  // Open hamburger menu overlay
  menuToggle.addEventListener("click", function () {
    hamburgerMenuOverlay.classList.add("active");
  });

  // Close hamburger menu overlay
  closeHamburgerMenu.addEventListener("click", function () {
    hamburgerMenuOverlay.classList.remove("active");
  });

  // Optional: Close the menu when clicking outside of it
  hamburgerMenuOverlay.addEventListener("click", function (e) {
    if (e.target === hamburgerMenuOverlay) {
      hamburgerMenuOverlay.classList.remove("active");
    }
  });
});
