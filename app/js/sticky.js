window.addEventListener("load", () => {
  const stickyNavbar = document.querySelector(".sticky-navbar");
  const footer = document.querySelector(".footer");

  const footerHeight = footer.offsetHeight;
  stickyNavbar.style.marginBottom = `${footerHeight}px`;
});
