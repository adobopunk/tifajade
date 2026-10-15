// Click-to-copy email links ([data-copy-email]). Clicking copies the address
// and briefly shows "Copied!" with a check mark; screen readers hear it too.
// If copying fails, the link falls through to its normal mailto: behavior.

const RESET_MS = 1800;

let announcer = null;
function announce(message) {
  if (!announcer) {
    announcer = document.createElement("p");
    announcer.className = "visually-hidden";
    announcer.setAttribute("aria-live", "polite");
    document.body.append(announcer);
  }
  // Clear first so repeating the same message is announced again
  announcer.textContent = "";
  requestAnimationFrame(() => (announcer.textContent = message));
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers, or no clipboard permission
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const ok = document.execCommand?.("copy") ?? false;
    field.remove();
    return ok;
  }
}

export function initCopyEmail() {
  document.querySelectorAll("[data-copy-email]").forEach((link) => {
    let timer = null;

    link.addEventListener("click", async (e) => {
      // Modified clicks still open the mail app
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();

      if (!(await copy(link.dataset.copyEmail))) {
        window.location.href = link.href;
        return;
      }

      link.classList.add("is-copied");
      announce("Email address copied");
      clearTimeout(timer);
      timer = setTimeout(() => link.classList.remove("is-copied"), RESET_MS);
    });
  });
}
