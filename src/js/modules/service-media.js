// Service sections: the video plays on its own while the section is on
// screen. Hovering or focusing a related project below crossfades to that
// project's video, and the caption and link highlight follow along.
//   data-service-media   on the media column; the related list is in the same section

export function initServiceMedia({ reducedMotion }) {
  document.querySelectorAll("[data-service-media]").forEach((media) => {
    const section = media.closest(".service-detail");
    const layers = [...media.querySelectorAll("[data-layer]")];
    const links = [...section.querySelectorAll("[data-layer-link]")];
    const now = media.querySelector("[data-now]");
    const phone = media.querySelector("[data-svc-phone]");
    const phoneVideo = phone?.querySelector("video");
    if (!layers.length) return;

    const defaultSlug = layers.find((l) => l.classList.contains("is-active"))?.dataset.layer;
    let current = defaultSlug;
    let visible = false;

    const layerFor = (slug) => layers.find((l) => l.dataset.layer === slug);
    const linkFor = (slug) => links.find((l) => l.dataset.layerLink === slug);

    function setLabel(slug) {
      const text = linkFor(slug)?.dataset.nowLabel || "";
      if (!now || now.textContent === text) return;
      now.classList.add("is-swapping");
      setTimeout(() => {
        now.textContent = text;
        now.classList.remove("is-swapping");
      }, 150);
    }

    function playActive() {
      // A phone overlay shows a vertical cut of the project it belongs to
      const phoneOn = phone && current === phone.dataset.svcPhone;
      phone?.classList.toggle("is-visible", Boolean(phoneOn));
      if (phoneVideo) {
        if (phoneOn && visible && !reducedMotion.matches) {
          if (phoneVideo.preload === "none") phoneVideo.preload = "auto";
          phoneVideo.play().catch(() => {});
        } else {
          phoneVideo.pause();
        }
      }
      layers.forEach((layer) => {
        if (layer.dataset.layer === current && visible && !reducedMotion.matches) {
          if (layer.preload === "none") layer.preload = "auto";
          layer.play().catch(() => {});
        } else {
          layer.pause();
        }
      });
    }

    function show(slug) {
      if (!layerFor(slug) || slug === current) return;
      current = slug;
      layers.forEach((l) => l.classList.toggle("is-active", l.dataset.layer === slug));
      links.forEach((l) => l.classList.toggle("is-active", l.dataset.layerLink === slug));
      setLabel(slug);
      playActive();
    }

    if (now) now.textContent = linkFor(defaultSlug)?.dataset.nowLabel || "";

    links.forEach((link) => {
      const slug = link.dataset.layerLink;
      link.addEventListener("pointerenter", () => show(slug));
      link.addEventListener("focus", () => show(slug));
    });
    // Back to the section's own project when the pointer leaves the list
    section.querySelector("[data-related]")?.addEventListener("pointerleave", () => show(defaultSlug));

    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        playActive();
      },
      { threshold: 0.35 }
    ).observe(media);
  });
}
