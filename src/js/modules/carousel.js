// Homepage featured carousel. Auto-advances, pauses on hover, focus, hidden
// tabs and the pause button, and supports swipe and arrow keys.
// Only the visible slide's video plays. Pointing at a progress bar previews
// that slide's video; clicking the bar makes it the current slide.

const SLIDE_MS = 7000;
const SWIPE_PX = 40;

export function initCarousel({ reducedMotion }) {
  const root = document.querySelector("[data-carousel]");
  if (!root) return;

  const slides = [...root.querySelectorAll("[data-slide]")];
  const bars = [...root.querySelectorAll("[data-carousel-goto]")];
  const current = root.querySelector("[data-carousel-current]");
  const toggle = root.querySelector("[data-carousel-toggle]");
  const clientLink = root.querySelector("[data-carousel-client]");
  const controls = root.querySelector(".hero__ui") || root;
  if (slides.length < 2) return;

  root.style.setProperty("--slide-duration", `${SLIDE_MS}ms`);

  let index = 0;
  let timer = null;
  let userPaused = reducedMotion.matches;
  let hoverPaused = false;
  // Time left on the current slide, so pausing and resuming never restarts it
  let remaining = SLIDE_MS;
  let startedAt = 0;
  let running = false;
  let previewing = null;

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
    if (running) {
      remaining = Math.max(0, remaining - (performance.now() - startedAt));
      running = false;
    }
    clearTimeout(timer);
    root.dataset.paused = String(isPaused());
    if (!isPaused()) {
      startedAt = performance.now();
      running = true;
      timer = setTimeout(() => go(index + 1), remaining);
    }
  }

  function restartProgress(bar) {
    // Re-trigger the CSS fill animation from zero
    const fill = bar.querySelector(".hero__bar-fill");
    fill.style.animation = "none";
    void fill.offsetWidth;
    fill.style.animation = "";
  }

  function go(next) {
    endPreview();
    const prev = index;
    index = (next + slides.length) % slides.length;
    remaining = SLIDE_MS;
    running = false;

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
    if (clientLink) {
      clientLink.textContent = slides[index].dataset.client;
      clientLink.href = slides[index].dataset.url;
    }

    if (prev !== index) pauseVideo(slides[prev]);
    playVideo(slides[index]);
    schedule();
  }

  function setUserPaused(paused) {
    userPaused = paused;
    toggle?.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow");
    if (paused) slides.forEach(pauseVideo);
    else playVideo(slides[index]);
    schedule();
  }

  // Pointing at a bar shows that slide's video over the current one; leaving
  // puts the current slide back
  function preview(i) {
    if (i === index || previewing === i) return;
    endPreview();
    previewing = i;
    slides[i].classList.add("is-previewing");
    pauseVideo(slides[index]);
    playVideo(slides[i]);
  }

  function endPreview() {
    if (previewing === null) return;
    slides[previewing].classList.remove("is-previewing");
    pauseVideo(slides[previewing]);
    previewing = null;
    if (!userPaused) playVideo(slides[index]);
  }

  root.querySelector("[data-carousel-next]")?.addEventListener("click", () => go(index + 1));
  root.querySelector("[data-carousel-prev]")?.addEventListener("click", () => go(index - 1));
  bars.forEach((bar, i) => {
    bar.addEventListener("click", () => go(i));
    bar.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") preview(i);
    });
    bar.addEventListener("pointerleave", endPreview);
    bar.addEventListener("blur", endPreview);
  });
  toggle?.addEventListener("click", () => setUserPaused(!userPaused));

  // Pause while the pointer or keyboard focus is on the carousel controls.
  // (Not the whole hero: people read the headline over the video.)
  controls.addEventListener("pointerenter", (e) => {
    if (e.pointerType === "mouse") {
      hoverPaused = true;
      schedule();
    }
  });
  controls.addEventListener("pointerleave", () => {
    hoverPaused = false;
    schedule();
  });
  controls.addEventListener("focusin", () => {
    hoverPaused = true;
    schedule();
  });
  controls.addEventListener("focusout", (e) => {
    if (!controls.contains(e.relatedTarget)) {
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
