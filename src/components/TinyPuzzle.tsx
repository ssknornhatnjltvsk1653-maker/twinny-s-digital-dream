import { useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

const N = 3;
const TOTAL = N * N;
const IMG = "/pages/front.png";

// Deterministic-ish shuffle done on user action / first mount effect-free:
// we start from a fixed scrambled order so SSR and hydration match.
const START: number[] = [4, 0, 7, 2, 8, 1, 6, 3, 5];

function shuffle(prev: number[]) {
  const a = [...prev];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  // never hand back an already-solved board
  if (a.every((v, i) => v === i)) [a[0], a[1]] = [a[1]!, a[0]!];
  return a;
}

const CONFETTI = ["⭐", "✨", "💗", "🎀", "🍓", "🌟", "💫", "🧁"];

export default function TinyPuzzle() {
  const [tiles, setTiles] = useState<number[]>(START);
  const [picked, setPicked] = useState<number | null>(null);
  const solved = tiles.every((v, i) => v === i);

  const tap = (idx: number) => {
    if (solved) return;
    if (picked === null) {
      setPicked(idx);
      playKawaii("click");
      return;
    }
    if (picked === idx) {
      setPicked(null);
      return;
    }
    const next = [...tiles];
    [next[picked], next[idx]] = [next[idx]!, next[picked]!];
    setTiles(next);
    setPicked(null);
    if (next.every((v, i) => v === i)) playKawaii("win");
    else playKawaii("pop");
  };

  const reset = () => {
    setTiles(shuffle(tiles));
    setPicked(null);
    playKawaii("sparkle");
  };

  return (
    <div className="puzzle-wrap">
      <div className="scrap-note puzzle-head">
        <h2 className="scrap-title">TINY TWINNY PUZZLE 🧩</h2>
        <p className="scrap-text">tap two pieces to swap them 🎀</p>
      </div>

      <div className="puzzle-board">
        {tiles.map((tile, idx) => (
          <button
            key={idx}
            type="button"
            aria-label={`puzzle piece ${tile + 1}`}
            onClick={() => tap(idx)}
            className={`puzzle-tile${picked === idx ? " is-picked" : ""}${solved ? " is-solved" : ""}`}
            style={{
              backgroundImage: `url(${IMG})`,
              backgroundSize: `${N * 100}% ${N * 100}%`,
              backgroundPosition: `${(tile % N) * (100 / (N - 1))}% ${Math.floor(tile / N) * (100 / (N - 1))}%`,
            }}
          />
        ))}

        {solved && (
          <div className="puzzle-win">
            <span className="puzzle-win-text">YOU DID ITTT 😭⭐</span>
            <span className="puzzle-win-sub">TWINNY BRAIN ACTIVATED 🧠🎀</span>
            {CONFETTI.map((c, i) => (
              <span
                key={i}
                className="puzzle-confetti"
                style={{
                  left: `${8 + i * 11}%`,
                  animationDelay: `${(i % 4) * 0.18}s`,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      <button type="button" className="scrap-btn" onClick={reset}>
        shuffle / reset 🔁
      </button>
    </div>
  );
}
