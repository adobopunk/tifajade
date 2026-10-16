// Videos that only play while on screen, and start together.
//   data-inview-play   on each <video>
//   data-play-group    on a container: the videos inside it start together from
//                      the beginning and pause when none of them is on screen

export function initInviewPlay({ reducedMotion }) {
  if (reducedMotion.matches) return;

  const groups = new Map();
  document.querySelectorAll("video[data-inview-play]").forEach((video) => {
    const root = video.closest("[data-play-group]") || document.body;
    if (!groups.has(root)) groups.set(root, { videos: [], visible: new Set(), started: false });
    groups.get(root).videos.push(video);
  });

  groups.forEach((group) => {
    const sync = () => {
      if (!group.visible.size) {
        group.videos.forEach((v) => v.pause());
        return;
      }
      group.videos.forEach((v) => {
        if (v.preload === "none") v.preload = "auto";
        if (!group.started) v.currentTime = 0;
        v.play().catch(() => {});
      });
      group.started = true;
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) =>
          e.isIntersecting ? group.visible.add(e.target) : group.visible.delete(e.target)
        );
        sync();
      },
      { threshold: 0.25 }
    );
    group.videos.forEach((v) => io.observe(v));
  });
}
