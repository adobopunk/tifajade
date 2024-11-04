document.addEventListener("DOMContentLoaded", function () {
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
