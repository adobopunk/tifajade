// Light/dark toggle. Follows the OS until the visitor picks a theme,
// then remembers their choice.

const root = document.documentElement;
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
  return root.getAttribute("data-theme") || (darkQuery.matches ? "dark" : "light");
}

function updateLabels() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.setAttribute("aria-label", `Switch to ${next} mode`);
  });
}

export function initTheme() {
  updateLabels();
  darkQuery.addEventListener("change", updateLabels);

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem("theme", next);
      } catch (e) {
        // Storage unavailable (private mode); the choice lasts for this page only
      }
      updateLabels();
    });
  });
}
