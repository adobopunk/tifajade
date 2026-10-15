// About page scroll story. Whichever chapter is in the middle of the screen
// becomes active: on wide screens its loop fades in on the sticky video
// column, and on phones its own inline video plays.

export function initAboutStory({ reducedMotion }) {
  const root = document.querySelector("[data-about-story]");
  if (!root) return;

  const chapters = [...root.querySelectorAll("[data-chapter]")];
  const stickyVideos = [...root.querySelectorAll("[data-chapter-video]")];
  const counter = root.querySelector("[data-chapter-current]");
  const wide = window.matchMedia("(min-width: 1000px)");
  let current = -1;

  function play(video) {
    if (!video || reducedMotion.matches) return;
    if (video.preload === "none") video.preload = "auto";
    video.play().catch(() => {});
  }

  function activate(index) {
    if (index === current) return;
    current = index;
    if (counter) counter.textContent = String(index + 1).padStart(2, "0");

    stickyVideos.forEach((video, i) => {
      const active = i === index && wide.matches;
      video.classList.toggle("is-active", i === index);
      if (active) play(video);
      else video.pause();
    });

    chapters.forEach((chapter, i) => {
      const inline = chapter.querySelector(".chapter__media video");
      if (i === index && !wide.matches) play(inline);
      else inline?.pause();
    });
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) activate(chapters.indexOf(entry.target));
      });
    },
    // A thin band across the middle of the screen
    { rootMargin: "-45% 0px -45% 0px" }
  );
  chapters.forEach((chapter) => observer.observe(chapter));

  wide.addEventListener("change", () => {
    const index = current;
    current = -1;
    activate(Math.max(index, 0));
  });
}
