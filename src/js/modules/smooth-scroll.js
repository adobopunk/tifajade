// Inertial smooth scrolling with Lenis (loaded as a deferred global).
// Skipped entirely when the visitor prefers reduced motion.

export function initSmoothScroll({ reducedMotion }) {
  if (reducedMotion.matches || typeof window.Lenis !== "function") return null;

  const lenis = new window.Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    anchors: { offset: -80 },
    autoRaf: true,
  });

  return lenis;
}
