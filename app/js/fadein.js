// Utility functions
const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

// Debugging function
function debug(message) {
  // console.log(`[Debug] ${message}`);
}

// Mobile device check
function isMobileDevice() {
  return window.innerWidth <= 900; // You can adjust this threshold as needed
}

// Fade-in animations
function setupFadeInAnimations() {
  const animatedTags = selectAll(
    ".hero h1, h1, .about h1, h2, .hero h3, p, .about__img, button, .footer__img, .topnav__homelink, .topnav__item, .footer__logo, .footer__links, .subfeature__img, .subfeature__feature-img, .subfeature__content-text, .about img, .about__headshot, div.divider, .about__bio, .projects-directory img, figure, h3, form, div.simple-divider, .project img, .project video, .project h1, .project h2, .project p, .footer img, figcaption, li, header, video, a, iframe"
  );

  debug(`Found ${animatedTags.length} animated tags`);

  animatedTags.forEach((tag) => (tag.style.opacity = 0));

  function fadeIn() {
    let delay = 0;
    animatedTags.forEach((tag) => {
      const tagTop = tag.getBoundingClientRect().top;
      const tagBottom = tag.getBoundingClientRect().bottom;
      if (
        tagTop < window.innerHeight - 75 &&
        tagBottom > 0 &&
        tag.style.opacity == 0
      ) {
        tag.style.animation = `fadein-scale 1s ease-out ${delay}s both`;
        delay += 0.02;
      }
    });
  }

  return fadeIn;
}

// Accent animations
function setupAccentAnimations() {
  const breathers = selectAll(".breathe");
  const spinners = selectAll(".rotate");

  debug(
    `Found ${breathers.length} breather elements and ${spinners.length} spinner elements`
  );

  breathers.forEach((breather, index) => {
    breather.animate(
      [
        { transform: "scale(1)" },
        { transform: "scale(1.05)" },
        { transform: "scale(1)" },
      ],
      {
        delay: 600 * index,
        duration: 6000,
        iterations: Infinity,
      }
    );
  });

  spinners.forEach((spinner, index) => {
    spinner.animate(
      [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
      {
        delay: 300 * index,
        duration: 50000,
        iterations: Infinity,
      }
    );
  });
}

// Parallax effects
function setupParallaxEffects() {
  const heroSection = select(".hero");
  const featuresContainer = select(".features");
  const sections = selectAll(".features .subfeature");

  debug(
    `Hero section found: ${!!heroSection}, Features container found: ${!!featuresContainer}, Number of sections: ${
      sections.length
    }`
  );

  function applyHeroParallax() {
    if (!heroSection) {
      debug("Hero section not found, skipping hero parallax");
      return;
    }

    if (isMobileDevice()) {
      debug("Mobile device detected, skipping hero parallax");
      return;
    }

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const parallaxTags = heroSection.querySelectorAll("[data-parallax]");

    debug(`Applying hero parallax to ${parallaxTags.length} elements`);

    parallaxTags.forEach((tag) => {
      const speed = parseFloat(tag.getAttribute("data-parallax"));
      const yPos = scrollY * speed;
      tag.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  function applyFeaturesParallax() {
    if (!featuresContainer) {
      debug("Features container not found, skipping features parallax");
      return;
    }

    if (isMobileDevice()) {
      debug("Mobile device detected, skipping features parallax");
      return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const viewportHeight = window.innerHeight;
    const featuresTop = featuresContainer.offsetTop;

    sections.forEach((section, index) => {
      const topSection = section.offsetTop + featuresTop;
      const midSection = topSection + section.offsetHeight / 2;
      const distanceToSection = scrollY + viewportHeight / 2 - midSection;
      const parallaxTags = section.querySelectorAll("[data-parallax]");

      debug(
        `Applying parallax to section ${index + 1}, ${
          parallaxTags.length
        } parallax elements`
      );

      parallaxTags.forEach((tag) => {
        const speed = parseFloat(tag.getAttribute("data-parallax"));
        tag.style.transform = `translate3d(0, ${
          distanceToSection * speed
        }px, 0)`;
      });

      // Background color change logic
      const dataBackground = section.getAttribute("data-background");
      if (dataBackground) {
        const sectionVisibility =
          (scrollY + viewportHeight / 2 - topSection) / section.offsetHeight;
        if (sectionVisibility > 0 && sectionVisibility < 1) {
          let backgroundColor = dataBackground;
          if (backgroundColor.startsWith("var(")) {
            backgroundColor = getComputedStyle(
              document.documentElement
            ).getPropertyValue(backgroundColor.slice(4, -1).trim());
          }
          featuresContainer.style.backgroundColor = backgroundColor;
          debug(
            `Changed background color to ${backgroundColor} for section ${
              index + 1
            }`
          );
        }
      }
    });
  }

  return { applyHeroParallax, applyFeaturesParallax };
}

// Main initialization
function initializeAnimationsAndParallax() {
  debug("Initializing animations and parallax effects");

  const fadeIn = setupFadeInAnimations();
  setupAccentAnimations();
  const { applyHeroParallax, applyFeaturesParallax } = setupParallaxEffects();

  // Combine all effects into a single scroll handler
  function handleScroll() {
    fadeIn();
    applyHeroParallax();
    applyFeaturesParallax();
  }

  // Initial application
  handleScroll();

  // Throttle scroll events for better performance
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Handle resize events
  window.addEventListener("resize", () => {
    handleScroll();
    debug(`Window resized. Is mobile device: ${isMobileDevice()}`);
  });

  debug("Initialization complete, event listeners attached");
}

// Run initialization when the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener(
    "DOMContentLoaded",
    initializeAnimationsAndParallax
  );
} else {
  initializeAnimationsAndParallax();
}

// Add CSS for fade-in animation if it doesn't exist
if (!document.querySelector("style#fade-in-animation")) {
  const style = document.createElement("style");
  style.id = "fade-in-animation";
  style.textContent = `
        @keyframes fadein {
            0% {
                opacity: 0;

            }
            100% {
                opacity: 1;

            }
        }
    `;
  document.head.appendChild(style);
  debug("Added fade-in animation CSS");
}
