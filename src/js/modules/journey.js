// "How it works" timeline. A line fills as you scroll and each step lights up
// when it reaches the middle of the screen.
//   data-journey   on the <ol>; steps are its .journey__step children

export function initJourney({ reducedMotion }) {
  document.querySelectorAll("[data-journey]").forEach((journey) => {
    const steps = [...journey.querySelectorAll(".journey__step")];

    if (reducedMotion.matches) {
      journey.style.setProperty("--progress", 1);
      steps.forEach((step) => step.classList.add("is-active"));
      return;
    }

    let ticking = false;

    function update() {
      ticking = false;
      const mid = window.innerHeight * 0.55;
      const box = journey.getBoundingClientRect();
      const progress = Math.min(Math.max((mid - box.top) / box.height, 0), 1);
      journey.style.setProperty("--progress", progress.toFixed(4));
      steps.forEach((step) => {
        const node = step.querySelector(".journey__node").getBoundingClientRect();
        step.classList.toggle("is-active", node.top + node.height / 2 < mid);
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  });
}
