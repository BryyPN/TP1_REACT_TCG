import { useCallback, useEffect, useState } from "react";
import { fetchCards } from "../api/cards";

export function useCards() {
  const [state, setState] = useState({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let ignore = false;
    setState({ status: "loading" });
    fetchCards()
      .then((cards) => {
        if (!ignore) setState({ status: "success", cards });
      })
      .catch((error) => {
        if (!ignore) {
          const message = error instanceof Error ? error.message : String(error);
          setState({ status: "error", message });
        }
      });
    return () => { ignore = true; };
  }, [attempt]);

  const updateCards = useCallback((transform) => {
    setState((current) => current.status === "success"
      ? { status: "success", cards: transform(current.cards) }
      : current);
  }, []);

  const changeQuantity = useCallback((id, delta) => {
    updateCards((cards) => cards.map((card) => card.id === id
      ? { ...card, quantity: Math.max(0, card.quantity + delta) }
      : card));
  }, [updateCards]);

  const removeCard = useCallback((id) => {
    updateCards((cards) => cards.filter((card) => card.id !== id));
  }, [updateCards]);

  const resetQuantities = useCallback(() => {
    updateCards((cards) => cards.map((card) => ({ ...card, quantity: 1 })));
  }, [updateCards]);

  const addCard = useCallback((newCard) => {
    updateCards((cards) => [...cards, { ...newCard, id: crypto.randomUUID() }]);
  }, [updateCards]);

  return {
    state,
    retry: () => setAttempt((value) => value + 1),
    changeQuantity,
    removeCard,
    resetQuantities,
    addCard
  };
}
