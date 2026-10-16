// Local business page: one video player stays put while the categories scroll
// past. When a category crosses the middle of the screen the player crossfades
// to its first spot; the names in its menu pick any other spot. Panels drift and
// fade with their distance from the middle for a little parallax.
//   data-lb-stage       the section
//   data-lb-panel=name  the scrolling category panels (data-lb-first = first video id)
//   data-lb-select=id   menu buttons inside a panel
//   data-lb-layer=id    stacked iframes, loaded one at a time via data-src
//   data-lb-caption=id  title, client and roles shown under the player

export function initLbStage({ reducedMotion }) {
  const stage = document.querySelector("[data-lb-stage]");
  if (!stage) return;

  const panels = [...stage.querySelectorAll("[data-lb-panel]")];
  const buttons = [...stage.querySelectorAll("[data-lb-select]")];
  const layers = [...stage.querySelectorAll("[data-lb-layer]")];
  const captions = [...stage.querySelectorAll("[data-lb-caption]")];
  const layerFor = (id) => layers.find((l) => l.dataset.lbLayer === id);
  let current = layers.find((l) => l.classList.contains("is-active"))?.dataset.lbLayer;
  const unloadTimers = new Map();

  const load = (layer) => {
    clearTimeout(unloadTimers.get(layer));
    if (layer && !layer.getAttribute("src")) layer.src = layer.dataset.src;
  };
  // Let the old video fade out before it is removed
  const unloadSoon = (layer) => {
    clearTimeout(unloadTimers.get(layer));
    unloadTimers.set(layer, setTimeout(() => layer.removeAttribute("src"), 1000));
  };

  function show(id) {
    if (id === current || !layerFor(id)) return;
    const previous = layerFor(current);
    current = id;
    const next = layerFor(id);
    layers.forEach((l) => l.classList.toggle("is-active", l === next));
    buttons.forEach((b) => b.classList.toggle("is-active", b.dataset.lbSelect === id));
    captions.forEach((c) => c.classList.toggle("is-active", c.dataset.lbCaption === id));
    load(next);
    if (previous) unloadSoon(previous);
  }

  // The category crossing the middle of the viewport takes over the player
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        panels.forEach((p) => p.classList.toggle("is-active", p === entry.target));
        show(entry.target.dataset.lbFirst);
      });
    },
    { rootMargin: "-45% 0px -45% 0px" }
  );
  panels.forEach((p) => io.observe(p));

  buttons.forEach((button) => {
    const id = button.dataset.lbSelect;
    button.addEventListener("pointerenter", () => show(id));
    button.addEventListener("focus", () => show(id));
    button.addEventListener("click", () => show(id));
  });

  // Players load only while the section is on screen
  new IntersectionObserver(
    ([entry]) => {
      layers.forEach((l) => {
        if (entry.isIntersecting && l.dataset.lbLayer === current) load(l);
        else if (!entry.isIntersecting) l.removeAttribute("src");
      });
    },
    { threshold: 0.05 }
  ).observe(stage);

  // Parallax: each panel's --d is -1 above the middle, 0 at it, 1 below
  if (reducedMotion.matches) return;
  let ticking = false;
  function drift() {
    ticking = false;
    const mid = window.innerHeight / 2;
    panels.forEach((panel) => {
      const box = panel.getBoundingClientRect();
      const d = Math.max(-1, Math.min(1, (box.top + box.height / 2 - mid) / mid));
      panel.style.setProperty("--d", d.toFixed(3));
    });
  }
  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(drift);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  drift();
}
