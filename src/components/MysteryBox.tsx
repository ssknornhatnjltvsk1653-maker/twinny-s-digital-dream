import { useRef, useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

// 👉 PUT YOUR VIDEO HERE:  public/video/final-video.mp4
// Replace that file with your own clip (same name) and it just works.
// If the file is missing the page still works — it shows a cute note instead.
const VIDEO_SRC = "/video/final-video.mp4";

const PARTICLES = ["✨", "⭐", "💗", "🎀", "🍓", "🌟", "💫", "☁️", "🌸", "💖"];

export default function MysteryBox() {
  const [state, setState] = useState<"idle" | "opening" | "open">("idle");
  const [videoBroken, setVideoBroken] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const open = () => {
    if (state !== "idle") return;
    playKawaii("open");
    setState("opening");
    window.setTimeout(() => {
      setState("open");
      // the click above counts as user interaction, so try to play with sound
      window.setTimeout(() => {
        const v = videoRef.current;
        if (!v) return;
        void v.play().catch(() => setNeedsTap(true));
      }, 60);
    }, 900);
  };

  const manualPlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    void v
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {
        v.muted = true;
        void v.play().catch(() => undefined);
        setNeedsTap(false);
      });
  };

  return (
    <div className="mystery-wrap">
      {state !== "open" && (
        <div className={`mystery-box${state === "opening" ? " is-opening" : ""}`}>
          <button
            type="button"
            className="mystery-btn"
            onClick={open}
            aria-label="open the mystery box"
          >
            <span className="mystery-lid">🎁</span>
          </button>
          <p className="scrap-title mystery-label">MYSTERY BOX</p>
          <p className="scrap-text">OPEN ME 🎀</p>
          <span className="mystery-glow" aria-hidden="true" />
        </div>
      )}

      {state === "open" && (
        <div className="mystery-reveal">
          <div className="scrap-note mystery-note">
            <h2 className="scrap-title">FOR MY TWINNY 🎀⭐</h2>
            <p className="scrap-text">the last little surprise 🤍</p>
          </div>

          <div className="video-frame">
            {!videoBroken ? (
              <video
                ref={videoRef}
                className="video-el"
                src={VIDEO_SRC}
                preload="none"
                playsInline
                controls
                onError={() => setVideoBroken(true)}
              />
            ) : (
              <p className="scrap-text video-missing">
                the video is not here yet 😭
                <br />
                drop it at <code>public/video/final-video.mp4</code>
              </p>
            )}
          </div>

          {needsTap && !videoBroken && (
            <button type="button" className="scrap-btn" onClick={manualPlay}>
              tap to play ▶️
            </button>
          )}

          <div className="mystery-particles" aria-hidden="true">
            {PARTICLES.map((p, i) => (
              <span
                key={i}
                className="mystery-particle"
                style={{
                  left: `${5 + i * 9.5}%`,
                  animationDelay: `${(i % 5) * 0.5}s`,
                  animationDuration: `${7 + (i % 4)}s`,
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
