// Menu and showreel dialogs. Native <dialog> handles focus and Escape;
// this wires up the buttons, pauses smooth scroll and stops the reel on close.

export function initDialogs({ lenis } = {}) {
  const menu = document.querySelector("[data-menu]");
  const reel = document.querySelector("[data-reel]");
  const menuButtons = document.querySelectorAll("[data-menu-open]");

  function open(dialog) {
    if (!dialog || dialog.open) return;
    lenis?.stop();
    dialog.showModal();
  }

  function setMenuExpanded(expanded) {
    menuButtons.forEach((btn) => btn.setAttribute("aria-expanded", String(expanded)));
  }

  [menu, reel].forEach((dialog) => {
    if (!dialog) return;

    dialog.querySelectorAll("[data-dialog-close]").forEach((btn) => {
      btn.addEventListener("click", () => dialog.close());
    });

    // Clicking the empty area around the content closes the dialog
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      if (!menu?.open && !reel?.open) lenis?.start();
    });
  });

  menuButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      open(menu);
      setMenuExpanded(true);
    });
  });
  menu?.addEventListener("close", () => setMenuExpanded(false));

  // Following a menu link to the current page should just close the menu
  menu?.querySelectorAll("a[href]").forEach((link) => {
    link.addEventListener("click", () => menu.close());
  });

  const iframe = reel?.querySelector("iframe");

  document.querySelectorAll("[data-reel-open]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (menu?.open) menu.close();
      if (iframe) iframe.src = iframe.dataset.src;
      open(reel);
    });
  });

  reel?.addEventListener("close", () => {
    // Blank the player so audio stops immediately
    if (iframe) iframe.src = "about:blank";
  });
}
