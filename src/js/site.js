// Entry point for the redesigned site. Each module sets up one behavior.
import { initTheme } from "./modules/theme.js";
import { initHeader } from "./modules/header.js";
import { initDialogs } from "./modules/dialogs.js";
import { initSmoothScroll } from "./modules/smooth-scroll.js";
import { initReveal } from "./modules/reveal.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

initTheme();
initHeader();
const lenis = initSmoothScroll({ reducedMotion });
initDialogs({ lenis });
initReveal({ reducedMotion });
