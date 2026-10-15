// Header gets a background once the page scrolls, hides while scrolling
// down and comes back as soon as the visitor scrolls up.

const SCROLLED_AT = 24;
const HIDE_AFTER = 320;
const TOLERANCE = 6;

export function initHeader() {
  const header = document.querySelector("[data-header]");
  if (!header) return;

  let lastY = window.scrollY;
  let ticking = false;

  function update() {
    const y = window.scrollY;
    const delta = y - lastY;

    header.dataset.scrolled = String(y > SCROLLED_AT);

    if (Math.abs(delta) > TOLERANCE) {
      header.dataset.hidden = String(delta > 0 && y > HIDE_AFTER);
      lastY = y;
    }
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

  // Never leave the header hidden while something inside it has focus
  header.addEventListener("focusin", () => {
    header.dataset.hidden = "false";
  });

  update();
}
