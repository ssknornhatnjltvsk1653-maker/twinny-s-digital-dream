import { useRef, useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

const VIDEO_SRC = "/video/twinny-surprise.mp4";

const PARTICLES = ["•", "·", "✦", "·", "•", "✧", "·", "•"];

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
    <div
      className="mystery-wrap"
      onPointerDownCapture={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onPointerMoveCapture={(event) => event.stopPropagation()}
      onPointerUpCapture={(event) => event.stopPropagation()}
      onClickCapture={(event) => event.stopPropagation()}
      onMouseDownCapture={(event) => event.stopPropagation()}
      onTouchStartCapture={(event) => event.stopPropagation()}
      onTouchMoveCapture={(event) => event.stopPropagation()}
    >
      {state !== "open" && (
        <div className={`mystery-box${state === "opening" ? " is-opening" : ""}`}>
          <button
            type="button"
            className="mystery-btn"
            onClick={open}
            aria-label="open the gift box"
          >
            <span className="gift-box" aria-hidden="true">
              <span className="gift-box-lid" />
              <span className="gift-box-body">
                <span className="gift-box-ribbon gift-box-ribbon-v" />
                <span className="gift-box-ribbon gift-box-ribbon-h" />
              </span>
            </span>
          </button>
          <p className="scrap-title mystery-label">MYSTERY BOX</p>
          <p className="scrap-text">tap the open box</p>
          <span className="mystery-glow" aria-hidden="true" />
        </div>
      )}

      {state === "open" && (
        <div className="mystery-reveal">
          <div className="scrap-note mystery-note">
            <h2 className="scrap-title">FOR MY TWINNY</h2>
            <p className="scrap-text">the last little surprise</p>
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
              tap to play
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
