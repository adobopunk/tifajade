// Project grid: category filters, plus preview videos that play on hover
// (mouse) or while a card is centered on screen (touch).

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

function previewVideo(container, trigger, { reducedMotion }) {
  const video = container.querySelector("video");
  if (!video || reducedMotion.matches) return;

  const play = () => {
    if (video.preload === "none") video.preload = "auto";
    video
      .play()
      .then(() => container.classList.add("is-playing"))
      .catch(() => {});
  };
  const stop = () => {
    video.pause();
    container.classList.remove("is-playing");
  };

  if (canHover.matches) {
    trigger.addEventListener("pointerenter", play);
    trigger.addEventListener("pointerleave", stop);
    trigger.addEventListener("focus", play);
    trigger.addEventListener("blur", stop);
  } else {
    // On phones, play whichever card is in the middle of the screen
    new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : stop()),
      { rootMargin: "-35% 0px -35% 0px" }
    ).observe(container);
  }
}

export function initProjectGrid({ reducedMotion }) {
  document.querySelectorAll(".project-card").forEach((card) => {
    previewVideo(card, card.querySelector("a"), { reducedMotion });
  });

  // The Next project preview at the end of each case study
  document.querySelectorAll(".case-next__media").forEach((media) => {
    previewVideo(media, media.closest(".case-next__link"), { reducedMotion });
  });

  // Service rows (homepage accordion, Services page sections) reuse the same
  // preview behavior on their media panel
  document.querySelectorAll(".service__media").forEach((media) => {
    previewVideo(media, media.closest(".service, .service-detail"), { reducedMotion });
  });

  document.querySelectorAll("[data-project-filter]").forEach((section) => {
    const toggle = section.querySelector("[data-segmented]");
    const cards = [...section.querySelectorAll(".project-card")];

    toggle?.addEventListener("segmented:change", (e) => {
      const filter = e.detail.value;
      let shown = 0;
      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.classList.remove("is-filtering-in");
        card.hidden = !match;
        if (match) {
          card.style.setProperty("--filter-i", shown++);
          void card.offsetWidth;
          card.classList.add("is-filtering-in");
        }
      });
    });
  });
}
