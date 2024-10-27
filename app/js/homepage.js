document.addEventListener("DOMContentLoaded", function () {
  const videoBackground = document.querySelector(".video-background");
  const iframe = videoBackground.querySelector("iframe");

  // Initially set the iframe src to an empty URL to avoid grey box
  iframe.src = "about:blank";

  // Set the src of the iframe for the background video after the page has loaded
  window.addEventListener("load", function () {
    // Set the src of the iframe
    iframe.src =
      "https://player.vimeo.com/video/544297893?autoplay=1&loop=1&background=1&enablejsapi=1";

    // Delay before fading in the iframe
    setTimeout(() => {
      iframe.style.opacity = "1"; // Fade in effect
    }, 1200); // Adjust delay time as needed (1000ms = 1 second)
  });
});
