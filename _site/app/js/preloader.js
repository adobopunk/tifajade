document.addEventListener("DOMContentLoaded", function () {
  const preloader = document.querySelector(".preloader");
  const iframe = document.querySelector(".video-background iframe");

  // Hide preloader once the iframe is loaded
  iframe.addEventListener("load", function () {
    preloader.style.display = "none"; // Hide preloader
  });
});
