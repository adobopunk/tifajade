// Clients list: hovering or focusing a client name fades in that project's
// loop (or its still, if it has no video) behind the list.
// Touch screens skip this; tapping a name just opens the project.

const canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

export function initClientReel({ reducedMotion }) {
  const section = document.querySelector("[data-client-reel]");
  if (!section || !canHover.matches) return;

  const links = [...section.querySelectorAll("[data-client]")];
  const items = new Map(
    [...section.querySelectorAll("[data-client-media]")].map((el) => [el.dataset.clientMedia, el])
  );
  let active = null;

  function show(link) {
    const item = items.get(link.dataset.client);
    links.forEach((l) => l.classList.toggle("is-active", l === link));
    if (!item || item === active) return;

    if (active) {
      active.classList.remove("is-active");
      active.querySelector("video")?.pause();
    }
    active = item;
    item.classList.add("is-active");
    section.classList.add("has-media");

    const video = item.querySelector("video");
    if (video && !reducedMotion.matches) {
      if (video.preload === "none") video.preload = "auto";
      video.play().catch(() => {
        // Still image stays up if playback is refused
      });
    }
  }

  function hide() {
    links.forEach((l) => l.classList.remove("is-active"));
    section.classList.remove("has-media");
    if (active) {
      active.classList.remove("is-active");
      active.querySelector("video")?.pause();
      active = null;
    }
  }

  links.forEach((link) => {
    link.addEventListener("pointerenter", () => show(link));
    link.addEventListener("focus", () => show(link));
    link.addEventListener("blur", hide);
  });

  // Leaving the list (not just one name) clears the background, so moving
  // between names doesn't flash back to the plain page
  section.querySelector(".client-cloud")?.addEventListener("pointerleave", hide);
}
