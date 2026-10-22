import { useRef, useState } from "react";
import { parseRarity, RARITIES, SETS } from "../domain/card";

const EMPTY_DRAFT = { name: "", set: SETS[0], rarity: "commune", price: "", quantity: "1" };

function validate(draft) {
  const errors = [];
  if (draft.name.trim().length < 2) errors.push("Le nom doit contenir au moins 2 caractères.");
  if (draft.price === "" || Number.isNaN(Number(draft.price)) || Number(draft.price) < 0) errors.push("Le prix doit être un nombre positif ou nul.");
  if (!Number.isInteger(Number(draft.quantity)) || Number(draft.quantity) < 1) errors.push("La quantité doit être un entier supérieur ou égal à 1.");
  return errors;
}

export function AddCardForm({ onAdd }) {
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [submitted, setSubmitted] = useState(false);
  const nameRef = useRef(null);
  const errors = validate(draft);

  function update(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (errors.length > 0) return;
    onAdd({ ...draft, name: draft.name.trim(), price: Number(draft.price), quantity: Number(draft.quantity), rarity: parseRarity(draft.rarity) ?? "commune" });
    setDraft(EMPTY_DRAFT);
    setSubmitted(false);
    nameRef.current?.focus();
  }

  return (
    <form className="add-form" noValidate onSubmit={handleSubmit}>
      <label>Nom <input ref={nameRef} value={draft.name} onChange={(event) => update("name", event.target.value)} /></label>
      <label>Extension <select value={draft.set} onChange={(event) => update("set", event.target.value)}>{SETS.map((set) => <option key={set}>{set}</option>)}</select></label>
      <label>Rareté <select value={draft.rarity} onChange={(event) => update("rarity", event.target.value)}>{RARITIES.map((rarity) => <option key={rarity}>{rarity}</option>)}</select></label>
      <label>Prix <input inputMode="decimal" value={draft.price} onChange={(event) => update("price", event.target.value)} /></label>
      <label>Quantité <input type="number" value={draft.quantity} onChange={(event) => update("quantity", event.target.value)} /></label>
      <button type="submit">Ajouter la carte</button>
      {submitted && <ul className="errors error">{errors.map((error) => <li key={error}>{error}</li>)}</ul>}
    </form>
  );
}
