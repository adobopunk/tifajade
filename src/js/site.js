// Entry point for the redesigned site. Each module sets up one behavior.
import { initTheme } from "./modules/theme.js";
import { initHeader } from "./modules/header.js";
import { initDialogs } from "./modules/dialogs.js";
import { initSmoothScroll } from "./modules/smooth-scroll.js";
import { initReveal } from "./modules/reveal.js";
import { initCarousel } from "./modules/carousel.js";
import { initProjectGrid } from "./modules/project-grid.js";
import { initClientReel } from "./modules/client-reel.js";
import { initAboutStory } from "./modules/about-story.js";
import { initParallax } from "./modules/parallax.js";
import { initSegmented } from "./modules/segmented.js";
import { initBooking } from "./modules/booking.js";
import { initCopyEmail } from "./modules/copy-email.js";

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

initTheme();
initHeader();
const lenis = initSmoothScroll({ reducedMotion });
initDialogs({ lenis });
initReveal({ reducedMotion });
initSegmented();
initBooking();
initCopyEmail();

// Page-specific behavior; each does nothing if its markup isn't on the page
initCarousel({ reducedMotion });
initProjectGrid({ reducedMotion });
initClientReel({ reducedMotion });
initAboutStory({ reducedMotion });
initParallax({ reducedMotion });
