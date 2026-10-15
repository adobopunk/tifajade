// Homepage featured carousel. Auto-advances, pauses on hover, focus, hidden
// tabs and the pause button, and supports swipe and arrow keys.
// Only the visible slide's video plays.

const SLIDE_MS = 7000;
const SWIPE_PX = 40;

export function initCarousel({ reducedMotion }) {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-slide]")];
  const bars = [...root.querySelectorAll("[data-carousel-goto]")];
  const current = root.querySelector("[data-carousel-current]");
  const toggle = root.querySelector("[data-carousel-toggle]");
  if (slides.length < 2) return;

  root.style.setProperty("--slide-duration", `${SLIDE_MS}ms`);

  let index = 0;
  let timer = null;
  let userPaused = reducedMotion.matches;
  let hoverPaused = false;

  function playVideo(slide) {
    const video = slide.querySelector("video");
    if (!video) return;
    if (video.preload === "none") video.preload = "auto";
    video.play().catch(() => {
      // Autoplay can be refused (data saver, low power); the poster stays up
    });
  }

  function pauseVideo(slide) {
    slide.querySelector("video")?.pause();
  }

  function isPaused() {
    return userPaused || hoverPaused || document.hidden;
  }

  function schedule() {
    clearTimeout(timer);
    root.dataset.paused = String(isPaused());
    if (!isPaused()) timer = setTimeout(() => go(index + 1), SLIDE_MS);
  }

  function restartProgress(bar) {
    // Re-trigger the CSS fill animation from zero
    const fill = bar.querySelector(".hero__bar-fill");
    fill.style.animation = "none";
    void fill.offsetWidth;
    fill.style.animation = "";
  }

  function go(next) {
    const prev = index;
    index = (next + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle("is-active", active);
      slide.inert = !active;
    });

    bars.forEach((bar, i) => {
      bar.classList.toggle("is-active", i === index);
      bar.classList.toggle("is-done", i < index);
      if (i === index) bar.setAttribute("aria-current", "true");
      else bar.removeAttribute("aria-current");
    });
    restartProgress(bars[index]);

    if (current) current.textContent = String(index + 1).padStart(2, "0");

    if (prev !== index) pauseVideo(slides[prev]);
    playVideo(slides[index]);
    schedule();
  }

  function setUserPaused(paused) {
    userPaused = paused;
    toggle?.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    if (paused) slides.forEach(pauseVideo);
    else playVideo(slides[index]);
    // Resuming restarts the current slide's timer from the beginning
    if (!paused) restartProgress(bars[index]);
    schedule();
  }

  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index + 1));
  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index - 1));
  bars.forEach((bar, i) => bar.addEventListener("click", () => go(i)));
  toggle?.addEventListener("click", () => setUserPaused(!userPaused));

  // Pause while the pointer or keyboard focus is inside the carousel
  root.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") {
      hoverPaused = true;
      schedule();
    }
  });
  root.addEventListener("pointerleave", () => {
    hoverPaused = false;
    restartProgress(bars[index]);
    schedule();
  });
  root.addEventListener("focusin", () => {
    hoverPaused = true;
    schedule();
  });
  root.addEventListener("focusout", (e) => {
    if (!root.contains(e.relatedTarget)) {
      hoverPaused = false;
      schedule();
    }
  });

  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") go(index + 1);
    if (e.key === "ArrowLeft") go(index - 1);
  });

  // Swipe on touch screens
  let startX = null;
  root.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX), { passive: true });
  root.addEventListener(
    "touchend",
    (e) => {
      if (startX === null) return;
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > SWIPE_PX) go(index + (dx < 0 ? 1 : -1));
      startX = null;
    },
    { passive: true }
  );

  document.addEventListener("visibilitychange", schedule);

  // Stop the video while the hero is scrolled out of view
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !userPaused) playVideo(slides[index]);
    else pauseVideo(slides[index]);
  }).observe(root);

  if (userPaused) setUserPaused(true);
  else go(0);
}
