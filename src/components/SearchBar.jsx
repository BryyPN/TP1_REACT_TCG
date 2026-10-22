import { useEffect, useRef } from "react";
import { parseRarity, RARITIES } from "../domain/card";

export function SearchBar({ query, onQueryChange, rarity, onRarityChange }) {
  const inputRef = useRef(null);
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onQueryChange("");
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onQueryChange]);

  function handleClear() {
    onQueryChange("");
    inputRef.current?.focus();
  }

  return (
    <div className="toolbar" role="search">
      <label>Recherche <input ref={inputRef} type="search" value={query} onChange={(event) => onQueryChange(event.target.value)} /></label>
      <button type="button" disabled={!query} onClick={handleClear}>Effacer</button>
      <label>Rareté
        <select value={rarity} onChange={(event) => onRarityChange(parseRarity(event.target.value) ?? "toutes")}>
          <option value="toutes">Toutes</option>
          {RARITIES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>
  );
}
