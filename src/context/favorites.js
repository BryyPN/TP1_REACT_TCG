import { createContext, useContext } from "react";

export const FavoritesContext = createContext(null);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === null) {
    throw new Error("useFavorites doit être appelé sous <FavoritesProvider>");
  }
  return context;
}
