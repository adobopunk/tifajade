// Good Loser Media cards: on devices with a hover, pointing at a card plays a
// muted preview over its still. The preview iframe ignores the pointer so the
// click still opens goodloser.me. Touch screens just show the still.
//   data-gl-card   the link wrapping a card; its .gl-work__preview iframe has data-src

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

export function initGlPreview({ reducedMotion }) {
  if (!canHover.matches || reducedMotion.matches) return;

  document.querySelectorAll("[data-gl-card]").forEach((card) => {
    const frame = card.querySelector(".gl-work__frame");
    const preview = card.querySelector(".gl-work__preview");
    if (!preview) return;

    const start = () => {
      if (!preview.getAttribute("src")) preview.src = preview.dataset.src;
      frame.classList.add("is-previewing");
    };
    const stop = () => {
      frame.classList.remove("is-previewing");
      // Remove after the fade so the player stops loading in the background
      setTimeout(() => {
        if (!frame.classList.contains("is-previewing")) preview.removeAttribute("src");
      }, 500);
    };

    card.addEventListener("pointerenter", start);
    card.addEventListener("pointerleave", stop);
    card.addEventListener("focus", start);
    card.addEventListener("blur", stop);
  });
}
