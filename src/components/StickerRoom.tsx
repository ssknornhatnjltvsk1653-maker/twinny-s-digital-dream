import { useState } from "react";
import { playKawaii } from "@/lib/kawaii-sound";

const NOTES = [
  {
    title: "The little check-ins",
    text: "You notice when something is off and quietly make the day softer.",
  },
  {
    title: "The random conversations",
    text: "Even the most pointless yapping becomes one of my favourite memories.",
  },
  {
    title: "The way you listen",
    text: "You make it easy to be completely myself, and that means more than you know.",
  },
];

export default function StickerRoom() {
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState(false);

  const showNote = (index: number) => {
    playKawaii("click");
    setActive(index);
    setOpened(true);
  };

  return (
    <div className="little-notes">
      <div className="scrap-note little-notes-head">
        <p className="little-notes-kicker">A SMALL COLLECTION</p>
        <h2 className="scrap-title">little things I adore</h2>
        <p className="scrap-text">choose a note and keep it close</p>
      </div>

      <div className="note-cards">
        {NOTES.map((note, i) => {
          return (
            <button
              key={i}
              type="button"
              className={`note-card${active === i ? " is-active" : ""}`}
              onClick={() => showNote(i)}
            >
              <span className="note-card-number">0{i + 1}</span>
              <span className="note-card-title">{note.title}</span>
            </button>
          );
        })}
      </div>

      <div className={`note-letter${opened ? " is-open" : ""}`}>
        <span className="note-letter-line" />
        <p className="scrap-text">
          {opened ? NOTES[active].text : "your favourite note will appear here"}
        </p>
        <span className="note-letter-signoff">{opened ? "— your twinny" : "with love"}</span>
      </div>
    </div>
  );
}
