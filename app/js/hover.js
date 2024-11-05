document.addEventListener("DOMContentLoaded", function () {
  // Function to detect if the device is mobile
  function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
  }

  // If the device is mobile, exit the function early
  if (isMobile()) {
    return; // Do nothing if on mobile
  }

  // Select all Vimeo iframes in the featured gallery
  const vimeoIframes = document.querySelectorAll(
    ".vimeo-container-gallery iframe"
  );

  vimeoIframes.forEach((iframe) => {
    // Initialize a new Vimeo Player instance for each iframe
    const player = new Vimeo.Player(iframe);

    // Pause the video by default
    player.pause();

    // Play video on mouseenter
    iframe
      .closest(".vimeo-container-gallery")
      .addEventListener("mouseenter", () => {
        player.play();
      });

    // Pause video on mouseleave
    iframe
      .closest(".vimeo-container-gallery")
      .addEventListener("mouseleave", () => {
        player.pause();
      });
  });
});
