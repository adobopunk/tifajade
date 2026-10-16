// Live website embeds on project pages.
//   data-site-embed         on the frame; its iframe is rendered at data-site-width px
//                           and scaled down to fit the frame's width
// The embed ignores the pointer until it is clicked, so scrolling the page over
// it keeps scrolling the page. It locks again when the pointer leaves.

export function initSiteEmbed() {
  document.querySelectorAll("[data-site-embed]").forEach((frame) => {
    const width = Number(frame.dataset.siteWidth) || 1440;
    frame.style.setProperty("--site-width", width);

    const rescale = () => frame.style.setProperty("--embed-scale", (frame.clientWidth / width).toFixed(4));
    new ResizeObserver(rescale).observe(frame);
    rescale();

    frame.addEventListener("click", () => frame.classList.add("is-active"));
    frame.addEventListener("pointerleave", () => frame.classList.remove("is-active"));
  });
}
