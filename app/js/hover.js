document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(
    ".gallery video, .image-preview-container video, .featured-gallery video"
  );

  // Function to check if we're on a mobile device
  function isMobile() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  // Function to set up or tear down video behavior based on screen size
  function setupVideos() {
    videos.forEach((video) => {
      let poster = video.nextElementSibling;
      if (!poster || !poster.classList.contains("video-poster")) {
        poster = document.createElement("img");
        poster.classList.add("video-poster");
        poster.src = video.getAttribute("poster") || "";
        poster.alt = "Video thumbnail";
        video.parentNode.insertBefore(poster, video.nextSibling);
      }

      const container = video.closest("a") || video.parentElement;

      // Remove existing listeners if any
      container.onmouseenter = null;
      container.onmouseleave = null;

      if (isMobile()) {
        video.style.display = "none";
        poster.style.display = "block";
      } else {
        video.style.display = "block";
        poster.style.display = "none";

        video.setAttribute("preload", "auto");
        video.load();
        video.pause();
        video.currentTime = 0.1;

        container.onmouseenter = () => {
          if (!isMobile()) {
            video.play().catch((e) => console.log("Playback error:", e));
          }
        };

        container.onmouseleave = () => {
          video.pause();
        };
      }
    });
  }

  // Initial setup
  setupVideos();

  // Update on window resize
  window.addEventListener("resize", setupVideos);
});
