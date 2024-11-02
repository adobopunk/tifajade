document.addEventListener("DOMContentLoaded", function () {
  // Handle video background
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
    }, 1200); // Adjust delay time as needed (1200ms = 1.2 seconds)
  });

  // Handle showreel button
  const showreelButton = document.getElementById("showreelButton");

  // Check if the showreelButton exists to avoid errors
  if (showreelButton) {
    // Add a delay before showing the button
    setTimeout(() => {
      showreelButton.classList.add("show"); // Add the 'show' class after 1 second
    }, 800); // 1000ms delay
  } else {
    console.error("Showreel button not found!"); // Debugging message if button is not found
  }
});
