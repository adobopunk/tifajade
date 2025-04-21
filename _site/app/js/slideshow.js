//page number data
let pageNumber = 0;

//page content
const pages = [
  {
    copy: " I’m a Creative Director and Producer with a big love for ambitious ideas, animation that turns heads, and stories that genuinely move people. I thrive in fast-paced, high-stakes projects where bold ideas meet beautiful, buttoned-up execution and heart.",
    src: "/assets/img/videos/AboutLoop1_h264_crf23.mp4",
  },
  {
    copy: " My creative journey started early in Eastern WA, making backyard movies with friends, sneaking into student film contests, and getting obsessed with action films and VFX. I taught myself After Effects in 5th grade and basically haven’t stopped creating since.",
    src: "/assets/img/videos/AboutLoop2_h264_crf23.mp4",
  },
  {
    copy: "I studied film at Eastern Washington University, directing four short films selected by the Spokane International Film Festival, where I was named “Most Promising Filmmaker.” I earned multiple scholarshps for my work, but more importantly I learned how to tell meaningful stories, how to direct successful projects end-to-end, and how to lead a great crew.",
    src: "/assets/img/videos/AboutLoop3_h264_crf23.mp4",
  },
  {
    copy: " That same creative spark landed me my first leadership role as Creative Services Director at an NBC affiliate. I pitched, directed, edited, designed, and quickly picked up motion graphics — falling deeper in love with storytelling in every form I could touch.",
    src: "/assets/img/videos/AboutLoop4_h264_crf23.mp4",
  },
  {
    copy: "I was ambitious, and knew I wanted to keep telling deeper stories. I pitched a documentary series about a rising high school football team to my boss at the station, and convinced him to say yes. A championship season, thousands of hours of footage, and many late night editing sessions later, I had a solo-produced, TV-aired docuseries under my belt barely a year after graduating college.",
    src: "/assets/img/videos/AboutLoop5_h264_crf23.mp4",
  },
  {
    copy: " In 2018, the esports boom hit — and I drove cross-country to join a Las Vegas startup called Impact Gaming. I shaped their brand identity, built partnerships, and filmed yet another docuseries, while falling headfirst into the wild, growing world of esports.",
    src: "/assets/img/videos/AboutLoop4_h264_crf23.mp4",
  },
  {
    copy: " Next came UFC — four wild years directing features, building global campaigns, and telling deeply personal stories inside one of the world’s most intense, fast-paced production environments. It sharpened my skills, instincts, and love for strong creative teams.",
    src: "/assets/img/videos/AboutLoop5_h264_crf23.mp4",
  },
  {
    copy: " At BoomTV, I combined esports with creative direction, leading 400+ branded events and campaigns seen by over 100 million viewers. I directed trailers, shaped creative brands, and worked with huge names like Xbox, Fortnite, Mountain Dew, and so many more.",
    src: "/assets/img/videos/codered_web.mp4",
  },
  {
    copy: " I’ve worked with huge brands, but what drives me is the craft — bringing big ideas to life, building workflows that solve creative headaches, and pushing the limits of what’s possible with smart, scalable, creative-first processes made for speed and soul.",
    src: "/assets/img/projects/mountain-dew-champions-cup/Champions Cup Loop 1.mp4",
  },
  {
    copy: " If you’re building something bold and need a creative partner who thrives under pressure, sweats the small stuff, and lives to chase ambitious, slightly crazy ideas — let’s connect. I’d love to hear what you’re dreaming up and how I can help make it real.",
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
