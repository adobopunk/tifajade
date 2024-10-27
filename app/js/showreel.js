document.addEventListener("DOMContentLoaded", function () {
  const showreelButton = document.querySelector(".showreel");
  const overlay = document.getElementById("showreel-overlay");
  const closeButton = document.querySelector(".close-overlay");
  const iframe = document.querySelector(".vimeo-container iframe"); // Select the iframe
  const player = new Vimeo.Player(iframe); // Initialize the Vimeo player

  // Show overlay when button is clicked
  showreelButton.addEventListener("click", function () {
    overlay.classList.add("active");
    overlay.style.display = "flex"; // Set to flex when active to enable flex styles
    setTimeout(() => {
      overlay.style.opacity = "1"; // Set opacity after display
    }, 10); // Small timeout to ensure display is applied before opacity
    player.play(); // Start playing the video
  });

  // Hide overlay when close button is clicked
  closeButton.addEventListener("click", function () {
    overlay.style.opacity = "0"; // Fade out effect
    overlay.addEventListener(
      "transitionend",
      function () {
        overlay.classList.remove("active"); // Remove active class after fade out
        overlay.style.display = "none"; // Set back to none
        player
          .setCurrentTime(0) // Reset video playback position to the beginning
          .then(function () {
            // Optionally, you can pause it after resetting the time
            player.pause();
          })
          .catch(function (error) {
            console.error("Error setting playback time:", error);
          });
      },
      { once: true }
    ); // Remove listener after it runs
  });
});
