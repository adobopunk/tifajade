document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(
    ".gallery video, .image-preview-container video"
  );

  // Function to check if we're on a mobile device
  function isMobile() {
    // This breakpoint should match your CSS breakpoint-down(medium)
    return window.innerWidth <= 768; // Adjust this value to match your medium breakpoint
  }

  // Function to set up or tear down video behavior based on screen size
  function setupVideos() {
    videos.forEach((video) => {
      // Get or create the poster image
      let poster = video.nextElementSibling;
      if (!poster || !poster.classList.contains("video-poster")) {
        poster = document.createElement("img");
        poster.classList.add("video-poster");
        poster.src = video.getAttribute("poster") || "";
        poster.alt = "Video thumbnail";
        video.parentNode.insertBefore(poster, video.nextSibling);
      }

      // If mobile, hide video and show poster
      if (isMobile()) {
        video.style.display = "none";
        poster.style.display = "block";
      } else {
        // On desktop, show video and hide poster
        video.style.display = "block";
        poster.style.display = "none";

        // Preload the video but keep it paused
        video.setAttribute("preload", "auto");
        video.load();
        video.pause();
        video.currentTime = 0.1;

        // Parent container (likely the <a> tag)
        const container = video.closest("a") || video.parentElement;

        // Play video on hover (desktop only)
        container.addEventListener("mouseenter", function () {
          if (!isMobile()) {
            video.play().catch((e) => console.log("Playback error:", e));
          }
        });

        // Pause when mouse leaves
        container.addEventListener("mouseleave", function () {
          video.pause();
        });
      }
    });
  }

  // Initial setup
  setupVideos();

  // Update on window resize
  window.addEventListener("resize", setupVideos);
});
