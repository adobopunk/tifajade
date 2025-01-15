document.addEventListener("DOMContentLoaded", function () {
  const showreelButtons = document.querySelectorAll(".showreel"); // Get all buttons
  const overlay = document.getElementById("showreel-overlay");
  const closeButton = document.querySelector(".close-overlay");
  const iframe = document.querySelector(
    "#showreel-overlay .vimeo-container iframe"
  );
  const player = new Vimeo.Player(iframe); // Initialize Vimeo player for this iframe

  // Iterate over each showreel button and apply event listener
  showreelButtons.forEach((button) => {
    button.addEventListener("click", function () {
      overlay.classList.add("active");
      overlay.style.display = "flex";
      setTimeout(() => {
        overlay.style.opacity = "1";
        player.play(); // Start playing the video on overlay open
      }, 10);
    });
  });

  // Hide overlay, reset video time, and stop playback when close button is clicked
  closeButton.addEventListener("click", function () {
    overlay.style.opacity = "0"; // Fade out effect
    overlay.addEventListener(
      "transitionend",
      function () {
        overlay.classList.remove("active");
        overlay.style.display = "none";
        player
          .setCurrentTime(0) // Reset video to start
          .then(() => player.pause()) // Stop playback after resetting time
          .catch(function (error) {
            console.error("Error stopping playback:", error);
          });
      },
      { once: true }
    ); // Listener removed after running once
  });
});
