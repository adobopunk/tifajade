// Horizontal scroller with arrow buttons.
//   data-scroller          wrapper
//   data-scroller-track    the scrolling list
//   data-scroller-prev/next  buttons; disabled at the ends

export function initScrollers({ reducedMotion }) {
  document.querySelectorAll("[data-scroller]").forEach((root) => {
    const track = root.querySelector("[data-scroller-track]");
    const prev = root.querySelector("[data-scroller-prev]");
    const next = root.querySelector("[data-scroller-next]");
    if (!track || !prev || !next) return;

    const behavior = reducedMotion.matches ? "auto" : "smooth";
    const step = () => track.clientWidth * 0.8;

    function update() {
      const max = track.scrollWidth - track.clientWidth;
      prev.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= max - 2;
    }

    prev.addEventListener("click", () => track.scrollBy({ left: -step(), behavior }));
    next.addEventListener("click", () => track.scrollBy({ left: step(), behavior }));
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });
}
