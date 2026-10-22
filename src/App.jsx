import { useMemo, useState } from "react";
import { AddCardForm } from "./components/AddCardForm";
import { CardGrid } from "./components/CardGrid";
import { CardNotes } from "./components/CardNotes";
import { FavoritesCount } from "./components/FavoritesCount";
import { Panel } from "./components/Panel";
import { SearchBar } from "./components/SearchBar";
import { Summary } from "./components/Summary";
import { useCards } from "./hooks/useCards";
import { useDocumentTitle } from "./hooks/useDocumentTitle";
import { collectionValue, formatPrice } from "./domain/card";

export function App() {
  const { state, retry, changeQuantity, removeCard, resetQuantities, addCard } = useCards();
  const [query, setQuery] = useState("");
  const [rarity, setRarity] = useState("toutes");
  const [selectedId, setSelectedId] = useState(null);
  const cards = useMemo(() => state.status === "success" ? state.cards : [], [state]);
  const selectedCard = cards.find((card) => card.id === selectedId);
  const visibleCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return cards.filter((card) => {
      const matchesQuery = `${card.name} ${card.set}`.toLowerCase().includes(normalizedQuery);
      return matchesQuery && (rarity === "toutes" || card.rarity === rarity);
    });
  }, [cards, query, rarity]);
  useDocumentTitle(`Ma collection (${formatPrice(collectionValue(cards))})`);

  return (
    <main className="app">
      <header className="app-header">
        <div><h1>Ma collection TCG</h1>{state.status === "success" && <Summary cards={cards} />}<FavoritesCount /></div>
        <button type="button" onClick={resetQuantities} disabled={state.status !== "success"}>Tout à 1 exemplaire</button>
      </header>
      <Panel title="Ajouter une carte"><AddCardForm onAdd={addCard} /></Panel>
      {selectedCard && <CardNotes key={selectedCard.id} card={selectedCard} />}
      {state.status === "loading" && <p className="hint">Chargement de la collection…</p>}
      {state.status === "error" && <p className="error">{state.message} <button type="button" onClick={retry}>Réessayer</button></p>}
      {state.status === "success" && (
        <Panel title={`Mes cartes (${visibleCards.length} / ${cards.length})`}>
          <SearchBar query={query} onQueryChange={setQuery} rarity={rarity} onRarityChange={setRarity} />
          <CardGrid cards={visibleCards} onQuantityChange={changeQuantity} onRemove={removeCard} selectedId={selectedId} onSelect={setSelectedId} />
        </Panel>
      )}
    </main>
  );
}
