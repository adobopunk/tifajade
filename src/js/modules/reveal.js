// Scroll reveals.
//   data-reveal              fade and rise when it enters the viewport
//   data-reveal="fade|scale" alternative entrances
//   data-reveal-stagger      on a parent: stagger its direct children
//   data-split               on a heading: words slide up one after another

function splitWords(el) {
  let wordIndex = 0;

  function wrap(content) {
    const outer = document.createElement("span");
    outer.className = "split-word";
    outer.style.setProperty("--word-i", wordIndex++);
    const inner = document.createElement("span");
    inner.append(content);
    outer.append(inner);
    return outer;
  }

  function walk(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const parts = child.textContent.split(/(\s+)/);
        const fragment = document.createDocumentFragment();
        parts.forEach((part) => {
          if (!part) return;
          fragment.append(/^\s+$/.test(part) ? part : wrap(part));
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        // Links keep their own element and get their words split inside;
        // any other inline element (like .flourish) moves as one word.
        if (child.tagName === "A") walk(child);
        else child.replaceWith(wrap(child.cloneNode(true)));
      }
    });
  }

  walk(el);
}

export function initReveal({ reducedMotion }) {
  const targets = document.querySelectorAll("[data-reveal], [data-split]");
  if (!targets.length) return;

  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  document.querySelectorAll("[data-split]").forEach(splitWords);

  document.querySelectorAll("[data-reveal-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.setProperty("--reveal-i", i);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
}
