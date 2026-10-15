// Cal.com booking. Nothing from Cal.com loads until it's needed:
//   [data-booking="user/event"]        opens the calendar in a pop-up
//   [data-booking-inline="user/event"] gets the calendar placed inside it
// The script starts downloading when someone hovers or focuses a booking
// button. Links keep their href, so booking still works if the script is
// blocked.

import { selectOption } from "./segmented.js";

const NAMESPACE = "booking";
const EMBED_SRC = "https://app.cal.com/embed/embed.js";
const ORIGIN = "https://cal.com";
const BRAND = { light: "#007a50", dark: "#1fbf85" };

let api = null;

function siteTheme() {
  const set = document.documentElement.getAttribute("data-theme");
  if (set === "light" || set === "dark") return set;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Cal.com's loader, unchanged apart from formatting: it queues calls made
// before embed.js has arrived and replays them once it has.
function installLoader() {
  (function (C, A, L) {
    const p = function (a, ar) {
      a.q.push(ar);
    };
    const d = C.document;
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal;
        const ar = arguments;
        if (!cal.loaded) {
          cal.ns = {};
          cal.q = cal.q || [];
          d.head.appendChild(d.createElement("script")).src = A;
          cal.loaded = true;
        }
        if (ar[0] === L) {
          const nsApi = function () {
            p(nsApi, arguments);
          };
          const namespace = ar[1];
          nsApi.q = nsApi.q || [];
          if (typeof namespace === "string") {
            cal.ns[namespace] = cal.ns[namespace] || nsApi;
            p(cal.ns[namespace], ar);
            p(cal, ["initNamespace", namespace]);
          } else p(cal, ar);
          return;
        }
        p(cal, ar);
      };
  })(window, EMBED_SRC, "init");
}

function applyTheme() {
  api?.("ui", {
    theme: siteTheme(),
    hideEventTypeDetails: false,
    layout: "month_view",
    cssVarsPerTheme: {
      light: { "cal-brand": BRAND.light },
      dark: { "cal-brand": BRAND.dark },
    },
  });
}

function load() {
  if (api) return api;
  installLoader();
  window.Cal("init", NAMESPACE, { origin: ORIGIN });
  api = window.Cal.ns[NAMESPACE];
  applyTheme();
  return api;
}

function config() {
  return { layout: "month_view", theme: siteTheme() };
}

function openPopup(calLink) {
  load()("modal", { calLink, config: config() });
}

let inlineDone = false;
function showInline(container) {
  if (inlineDone) return;
  inlineDone = true;
  container.classList.add("is-embedded");
  load()("inline", {
    elementOrSelector: container,
    calLink: container.dataset.bookingInline,
    config: config(),
  });
}

// Contact page: switch between the message form and the calendar
function initContactPanels() {
  const root = document.querySelector("[data-contact-panels]");
  if (!root) return;

  const group = root.querySelector("[data-segmented]");
  const form = root.querySelector("#panel-message");
  const booking = root.querySelector("[data-booking-inline]");

  function show(value) {
    form.hidden = value !== "message";
    booking.hidden = value !== "book";
    if (value === "book") showInline(booking);
  }

  group.addEventListener("segmented:change", (e) => show(e.detail.value));

  // Links elsewhere on the page that should flip to the calendar
  document.querySelectorAll("[data-contact-show]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      selectOption(group, link.dataset.contactShow);
      root.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // /contact/#book opens straight to the calendar
  const start = location.hash === "#book" ? "book" : "message";
  show(start);
  if (start === "book") selectOption(group, "book");
}

export function initBooking() {
  const buttons = document.querySelectorAll("[data-booking]");

  buttons.forEach((button) => {
    // Start fetching the embed as soon as someone shows intent
    button.addEventListener("pointerenter", load, { once: true });
    button.addEventListener("focus", load, { once: true });

    button.addEventListener("click", (e) => {
      // Let modified clicks (new tab, etc.) go to the booking page
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      openPopup(button.dataset.booking);
    });
  });

  initContactPanels();

  // Follow the site's light/dark toggle
  new MutationObserver(applyTheme).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
}
