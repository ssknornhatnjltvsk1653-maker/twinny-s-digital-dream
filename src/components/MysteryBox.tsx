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

    // Critical: start playback immediately inside the user-gesture handler.
    // Delayed play() (even 60ms later) loses the gesture and gets blocked on mobile.
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      // Start muted so autoplay is almost always allowed, then try to unmute.
      video.muted = true;
      void video
        .play()
        .then(() => {
          // Try to unmute after successful start (still inside the original gesture in most browsers)
          video.muted = false;
          setNeedsTap(false);
        })
        .catch(() => {
          // Even muted play failed (rare) → show manual button
          setNeedsTap(true);
        });
    }

    setState("opening");

    window.setTimeout(() => {
      setState("open");
    }, 700);
  };

  const manualPlay = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    void video
      .play()
      .then(() => setNeedsTap(false))
      .catch(() => {
        // Last resort: play muted so the surprise still works
        video.muted = true;
        void video.play().then(() => setNeedsTap(false)).catch(() => undefined);
      });
  };

  return (
    <div
      className="mystery-wrap"
      onPointerDownCapture={(event) => event.stopPropagation()}
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

      {/* Video is mounted early (hidden) so the click can start playback as a real user gesture */}
      <div className={`video-frame mystery-video-frame${state === "open" ? " is-visible" : ""}`}>
        {!videoBroken ? (
          <video
            ref={videoRef}
            className="video-el"
            src={VIDEO_SRC}
            preload="auto"
            playsInline
            muted
            controls={state === "open"}
            onError={() => setVideoBroken(true)}
          />
        ) : (
          <p className="scrap-text video-missing">
            the video is not here yet 😭
            <br />
            drop it at <code>public/video/twinny-surprise.mp4</code>
          </p>
        )}
      </div>

      {state === "open" && (
        <div className="mystery-reveal">
          <div className="scrap-note mystery-note">
            <h2 className="scrap-title">FOR MY TWINNY</h2>
            <p className="scrap-text">the last little surprise</p>
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
