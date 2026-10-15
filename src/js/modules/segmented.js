// Sliding pill toggle ([data-segmented]). The thumb slides under the chosen
// option. Each option has a data-value; choosing one fires a
// "segmented:change" event on the group with { value } in detail.
// Options with role="tab" use aria-selected; plain buttons use aria-pressed.

function stateAttr(option) {
  return option.getAttribute("role") === "tab" ? "aria-selected" : "aria-pressed";
}

export function selectOption(group, value) {
  const options = [...group.querySelectorAll("[data-value]")];
  const chosen = options.find((o) => o.dataset.value === value);
  if (!chosen) return;

  options.forEach((o) => {
    const on = o === chosen;
    o.setAttribute(stateAttr(o), String(on));
    if (o.getAttribute("role") === "tab") o.tabIndex = on ? 0 : -1;
  });
  moveThumb(group);
  group.dispatchEvent(new CustomEvent("segmented:change", { detail: { value } }));
}

function moveThumb(group) {
  const chosen = [...group.querySelectorAll("[data-value]")].find(
    (o) => o.getAttribute(stateAttr(o)) === "true"
  );
  if (!chosen) return;
  group.style.setProperty("--thumb-x", `${chosen.offsetLeft}px`);
  group.style.setProperty("--thumb-w", `${chosen.offsetWidth}px`);
}

export function initSegmented() {
  const groups = [...document.querySelectorAll("[data-segmented]")];
  if (!groups.length) return;

  groups.forEach((group) => {
    const options = [...group.querySelectorAll("[data-value]")];

    options.forEach((option, i) => {
      option.addEventListener("click", () => selectOption(group, option.dataset.value));

      // Arrow keys move between tabs, as in any tab list
      if (option.getAttribute("role") === "tab") {
        option.addEventListener("keydown", (e) => {
          const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!step) return;
          const next = options[(i + step + options.length) % options.length];
          next.focus();
          selectOption(group, next.dataset.value);
        });
      }
    });

    moveThumb(group);
    // Reveal the thumb once it's in place, so it doesn't slide in on load
    requestAnimationFrame(() => group.classList.add("is-ready"));
  });

  const refresh = () => groups.forEach(moveThumb);
  window.addEventListener("resize", refresh);
  document.fonts?.ready.then(refresh);
}
