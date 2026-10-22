import { useState } from "react";
import { Panel } from "./Panel";

export function CardNotes({ card }) {
  const [note, setNote] = useState("");
  return (
    <Panel title={`Notes : ${card.name}`}>
      <div className="details">
        <textarea value={note} onChange={(event) => setNote(event.target.value)} />
        <p className="hint">{note.length} caractère(s), non enregistré.</p>
      </div>
    </Panel>
  );
}
