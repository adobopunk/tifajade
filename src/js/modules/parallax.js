// Gentle parallax: elements with data-parallax="0.35" move down at that
// fraction of the scroll distance, so they drift slower than the page.
// Off when the visitor prefers reduced motion.

export function initParallax({ reducedMotion }) {
  const items = [...document.querySelectorAll("[data-parallax]")];
  if (!items.length || reducedMotion.matches) return;

  let ticking = false;

  function update() {
    const y = window.scrollY;
    items.forEach((el) => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      // Only while it can still be on screen
      if (y < window.innerHeight * 1.5) {
        el.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      }
    });
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );

  update();
}
