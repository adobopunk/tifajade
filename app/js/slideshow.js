//page number data
let pageNumber = 0;

//page content
const pages = [
  {
    copy: " I’m a Creative Director and Producer with a big love for ambitious ideas, animation that turns heads, and stories that genuinely move people. I thrive in fast-paced, high-stakes projects where bold ideas meet beautiful, buttoned-up execution and heart.",
    src: "/assets/img/projects/mountain-dew-champions-cup/Champions Cup Loop 1.mp4",
    circle: "#3e78ed",
  },
  {
    copy: " My creative journey started early in Eastern WA, making backyard movies with friends, sneaking into student film contests, and getting obsessed with action films and VFX. I taught myself After Effects in 5th grade and basically haven’t stopped creating since.",
    src: "/assets/img/videos/codered_web.mp4",
    circle: "#e34a47",
  },
  {
    copy: " I studied film at Eastern Washington University, directing four short films that screened at the Spokane International Film Festival. I earned “Most Promising Filmmaker,” was voted best director, landed scholarships, and learned how to lead a great crew.",
    src: "/assets/img/projects/mountain-dew-champions-cup/Champions Cup Loop 1.mp4",
  },
  {
    copy: " That same creative spark landed me my first leadership role as Creative Services Director at an NBC affiliate. I pitched, directed, edited, designed, and quickly picked up motion graphics — falling deeper in love with storytelling in every form I could touch.",
    src: "/assets/img/videos/codered_web.mp4",
  },
];

let maxPages = pages.length - 1;

//select tags
const nextTag = document.querySelector("svg.next");
const prevTag = document.querySelector("svg.previous");
const outputTag = document.querySelector("p.slideshow-copy");
const videoTag = document.querySelector("video.slideshow-video");
const bodyTag = document.querySelector("body");

//increase and decrease page numbers
const next = function () {
  pageNumber = pageNumber + 1;

  if (pageNumber > maxPages) {
    pageNumber = 0;
  }

  updateSection();
};

const previous = function () {
  pageNumber = pageNumber - 1;

  if (pageNumber < 0) {
    pageNumber = maxPages;
  }

  updateSection();
};

const random = function () {
  pageNumber = Math.floor(Math.random() * pages.length);

  updateSection();
};

//update section content
const updateSection = function () {
  // Add classes for video movement
  videoTag.classList.add("move-out");
  outputTag.classList.add("fade-out");

  setTimeout(() => {
    outputTag.innerHTML = pages[pageNumber].copy;
    videoTag.src = pages[pageNumber].src;

    videoTag.classList.remove("move-out");
    outputTag.classList.remove("fade-out");

    // Apply classes to move video back and fade text in
    videoTag.classList.add("move-in");
    outputTag.classList.add("fade-in");

    // Remove classes after animation completes
    setTimeout(() => {
      videoTag.classList.remove("move-in");
      outputTag.classList.remove("fade-in");
    }, 500); // Matches the duration of the fade transition
  }, 500); // Matches the duration of the move-out transition
};

//add event listeners and function triggers to buttons
nextTag.addEventListener("click", function () {
  next();
});
prevTag.addEventListener("click", function () {
  previous();
});


//add keypress functions
document.addEventListener("keyup", function (event) {
  console.log(event);

  if (event.key == "ArrowRight") {
    next();
  } else if (event.key == "ArrowLeft") {
    previous();
  }
});
