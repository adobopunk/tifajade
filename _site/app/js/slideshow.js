//page content
const pages = [
  {
    copy: "I’m a Creative Director and Video Producer with a lot of ambition and an obsession with visual storytelling. You can often catch me staring down the barrel of a camera lens while framing my shot. I live in Seattle with my cat Rogue, where I also build computers and enjoy cooking Mexican food. Here's how I got here.",
    src: "/assets/img/videos/AboutLoop1_h264_preview.mp4",
  },
  {
    copy: "I grew up in Richland, Washington, making backyard movies with friends. I loved action films like The Matrix and Mission: Impossible. I taught myself After Effects in 5th grade, entered student art competitions and earned a spot in independent study programs to create original projects and sharpen my filmmaking skills long before high school.",
    src: "/assets/img/videos/AboutLoop2_h264_preview.mp4",
  },
  {
    copy: "I studied film at Eastern Washington University, where four of my short films screened at the Spokane International Film Festival and I was named “Most Promising Filmmaker.” I earned multiple scholarships, but most importantly, I learned how to tell meaningful stories, lead a great crew, and direct successful projects end-to-end. By the time I graduated, I knew I wanted to keep telling stories for a living, and I carried those skills into every role since.",
    src: "/assets/img/videos/AboutLoop3_h264_preview.mp4",
  },
  {
    copy: "My creative path led me to my first leadership role as Creative Services Director at an NBC affiliate, where the pay was terrible and the experience was invaluable. I pitched, directed, edited, and designed campaigns while rapidly developing my motion graphics skills. I built strong partnerships with local business owners and produced the station’s first Spanish-language newscast for Telemundo — a milestone in community outreach for the area.",
    src: "/assets/img/videos/AboutLoop4_h264_preview.mp4",
  },
  {
    copy: "Eager to push beyond small-town markets, I pitched a docuseries about a rising high school football team to my boss, and convinced him to say yes. I filmed what became a championship season, edited down thousands of hours of footage, and delivered the entire project to air on TV as a solo director/producer, barely a year after graduating college. That experience opened the door to an unforgettable opportunity in Las Vegas.",
    src: "/assets/img/videos/AboutLoop5_h264_preview.mp4",
  },
  {
    copy: "In 2018, I relocated to Las Vegas to join an esports startup called Impact Gaming. I shaped their brand identity and content strategy, producing another docuseries. I wasn't an expert in esports—nor had I been any sort of expert in football. But I knew how to build trust, capture honest stories, and craft emotionally resonant narratives that connect with audiences.",
    src: "/assets/img/videos/AboutLoop6_h264_preview.mp4",
  },
  {
    copy: "My portfolio opened the door to UFC’s original content department, where I spent four years producing branded content, editing social media / long-form programming, and marketing record-breaking events. I thrived in one of the world’s fastest-paced, intense production environments — sharpening my creative instincts and leadership abilities.",
    src: "/assets/img/videos/AboutLoop7_h264_preview.mp4",
  },
  {
    copy: "I reconnected my love of storytelling with my interest in gaming when I was asked to lead BoomTV's video production team. Directing creative projects for a games marketing agency meant partnering with names like Fortnite, Halo, and Call of Duty, designing experiences that earned millions of impressions, and recognition from industry veterans.",
    src: "/assets/img/videos/AboutLoop9_h264_preview.mp4",
  },
  {
    copy: "Across massive global brands, fast-growing startups, and scrappy creative teams, I’ve applied storytelling expertise and creative leadership to solve creative challenges. No matter what the mission is, I'm there because I love the craft — bringing bold ideas to life, building workflows that dismantle creative roadblocks, and pushing the boundaries of visual storytelling.",
    src: "/assets/img/videos/AboutLoop8_h264_preview.mp4",
  },
  {
    copy: "Today, I’m a freelance Creative Director running my agency, Tiny Pond, and producing events for the games industry through our venture In Queue. If you’re building bold, high-impact projects and need a creative leader who thrives under pressure and lives for ambitious, slightly crazy ideas — let’s connect. You might just be my Slide 11.",
    src: "/assets/img/videos/AboutLoop10_h264_preview.mp4",
  },
];

let maxPages = pages.length - 1;
let pageNumber = 0;

// Select tags
const nextTag = document.querySelector("svg.next");
const prevTag = document.querySelector("svg.previous");
const outputTag = document.querySelector("p.slideshow-copy");
const videoTag = document.querySelector("video.slideshow-video");
const bodyTag = document.querySelector("body");
const contactButton = document.querySelector(".slideshow-contact");
const counterTag = document.querySelector("p.slideshow-counter"); // ← grab the counter

// Increase and decrease page numbers
const next = function () {
  pageNumber = pageNumber + 1 > maxPages ? 0 : pageNumber + 1;
  updateSection("next");
};

const previous = function () {
  pageNumber = pageNumber - 1 < 0 ? maxPages : pageNumber - 1;
  updateSection("previous");
};

const random = function () {
  pageNumber = Math.floor(Math.random() * pages.length);
  updateSection("random"); // can decide default behavior here
};

// Update section content
const updateSection = function (direction) {
  let moveOutClass = "";
  let moveInClass = "";

  // Determine animation classes based on direction
  if (direction === "next") {
    moveOutClass = "move-out-left";
    moveInClass = "move-in-right";
  } else if (direction === "previous") {
    moveOutClass = "move-out-right";
    moveInClass = "move-in-left";
  } else {
    // fallback or random
    moveOutClass = "move-out-left";
    moveInClass = "move-in-right";
  }

  // Add animation classes
  videoTag.classList.add(moveOutClass);
  outputTag.classList.add("fade-out");

  setTimeout(() => {
    outputTag.innerHTML = pages[pageNumber].copy;
    videoTag.src = pages[pageNumber].src;

    // Remove old classes
    videoTag.classList.remove(moveOutClass);
    outputTag.classList.remove("fade-out");

    // Apply move-in and fade-in classes
    videoTag.classList.add(moveInClass);
    outputTag.classList.add("fade-in");

    counterTag.innerHTML = `${pageNumber + 1} / ${pages.length}`;

    // Show contact button if on final slide, hide otherwise
    if (pageNumber === maxPages) {
      contactButton.classList.add("visible");
    } else {
      contactButton.classList.remove("visible");
    }

    // Remove move-in and fade-in after animation
    setTimeout(() => {
      videoTag.classList.remove(moveInClass);
      outputTag.classList.remove("fade-in");
    }, 500); // matches CSS duration
  }, 500); // matches CSS duration
};

// Add event listeners
nextTag.addEventListener("click", next);
prevTag.addEventListener("click", previous);

// Add keypress functions
document.addEventListener("keyup", function (event) {
  if (event.key === "ArrowRight") {
    next();
  } else if (event.key === "ArrowLeft") {
    previous();
  }
});
