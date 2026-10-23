// Service sections: the video plays on its own while the section is on
// screen. Hovering or focusing a related project below crossfades to that
// project's video and the link highlights. The last one hovered stays selected.
//   data-service-media   on the media column; the related list is in the same section

export function initServiceMedia({ reducedMotion }) {
  document.querySelectorAll("[data-service-media]").forEach((media) => {
    const section = media.closest(".service-detail");
    const layers = [...media.querySelectorAll("[data-layer]")];
    const links = [...section.querySelectorAll("[data-layer-link]")];
    const phone = media.querySelector("[data-svc-phone]");
    const phoneVideo = phone?.querySelector("video");
    if (!layers.length) return;

    const defaultSlug = layers.find((l) => l.classList.contains("is-active"))?.dataset.layer;
    let current = defaultSlug;
    let visible = false;

    const layerFor = (slug) => layers.find((l) => l.dataset.layer === slug);

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
      playActive();
    }

    links.forEach((link) => {
      const slug = link.dataset.layerLink;
      link.addEventListener("pointerenter", () => show(slug));
      link.addEventListener("focus", () => show(slug));
    });

    new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        playActive();
      },
      { threshold: 0.35 }
    ).observe(media);
  });
}
