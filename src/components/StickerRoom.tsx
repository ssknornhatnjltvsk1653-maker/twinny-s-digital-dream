import { useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

type S = { e: string; x: number; y: number; r: number; s: number };

const STICKERS: S[] = [
  { e: "🍓", x: 14, y: 30, r: -8, s: 1.6 },
  { e: "⭐", x: 46, y: 22, r: 10, s: 1.5 },
  { e: "🎀", x: 76, y: 32, r: -14, s: 1.7 },
  { e: "💗", x: 22, y: 50, r: 6, s: 1.4 },
  { e: "☁️", x: 58, y: 46, r: -4, s: 1.8 },
  { e: "🐰", x: 84, y: 56, r: 12, s: 1.5 },
  { e: "🍰", x: 16, y: 70, r: -10, s: 1.4 },
  { e: "🌸", x: 44, y: 66, r: 8, s: 1.4 },
  { e: "🧸", x: 70, y: 76, r: -6, s: 1.5 },
];

const SECRET = ["🍭", "🦄", "🫧", "🍒", "🌙"];

export default function StickerRoom() {
  const [pops, setPops] = useState<Record<number, number>>({});
  const [nudge, setNudge] = useState<Record<number, { x: number; y: number }>>(
    {},
  );
  const [secrets, setSecrets] = useState<number[]>([]);

  const tap = (i: number) => {
    playKawaii(i % 2 === 0 ? "pop" : "sparkle");
    setPops((p) => ({ ...p, [i]: (p[i] ?? 0) + 1 }));
    setNudge((n) => ({
      ...n,
      [i]: {
        x: ((i * 37) % 13) - 6 + (((pops[i] ?? 0) * 5) % 9) - 4,
        y: ((i * 23) % 11) - 5,
      },
    }));
  };

  const addSecret = () => {
    if (secrets.length >= SECRET.length) {
      setSecrets([]);
      playKawaii("click");
      return;
    }
    playKawaii("sparkle");
    setSecrets((s) => [...s, s.length]);
  };

  return (
    <div className="sticker-room">
      <div className="scrap-note sticker-room-head">
        <h2 className="scrap-title">DIGITAL STICKER ROOM 🎀</h2>
        <p className="scrap-text">tap the stickers, they get shy 😭✨</p>
      </div>

      <div className="sticker-field">
        {STICKERS.map((st, i) => {
          const count = pops[i] ?? 0;
          const n = nudge[i] ?? { x: 0, y: 0 };
          return (
            <button
              key={i}
              type="button"
              aria-label={`sticker ${st.e}`}
              onClick={() => tap(i)}
              className="sticker"
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                fontSize: `${st.s}rem`,
                transform: `translate(calc(-50% + ${n.x}px), calc(-50% + ${n.y}px)) rotate(${st.r + count * 9}deg)`,
              }}
            >
              <span key={count} className="sticker-inner">
                {st.e}
              </span>
              {count > 0 && (
                <span key={`sp${count}`} className="sticker-sparkle">
                  ✨
                </span>
              )}
            </button>
          );
        })}

        {secrets.map((s, i) => (
          <span
            key={`sec${s}`}
            className="sticker-secret"
            style={{
              left: `${18 + i * 16}%`,
              top: `${86 - (i % 2) * 10}%`,
            }}
          >
            {SECRET[s]}
          </span>
        ))}
      </div>

      <button type="button" className="scrap-btn" onClick={addSecret}>
        {secrets.length >= SECRET.length
          ? "clear the mess 🧹"
          : "surprise sticker 🎁"}
      </button>
    </div>
  );
}
