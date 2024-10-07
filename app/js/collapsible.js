var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function () {
    this.classList.toggle("active");
    var reveal = this.nextElementSibling;

    if (reveal.style.maxHeight) {
      // Collapse the section
      reveal.style.maxHeight = null; // Collapse
    } else {
      // Expand to the full height of the content
      reveal.style.maxHeight = reveal.scrollHeight + "px"; // Expand
    }
  });
}
