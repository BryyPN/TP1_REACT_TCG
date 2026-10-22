import { useCallback, useMemo, useState } from "react";
import { FavoritesContext } from "./favorites";

export function FavoritesProvider({ children }) {
  const [favoriteIds, setFavoriteIds] = useState([]);
  const toggleFavorite = useCallback((id) => {
    setFavoriteIds((ids) => ids.includes(id)
      ? ids.filter((favoriteId) => favoriteId !== id)
      : [...ids, id]);
  }, []);
  const value = useMemo(() => ({ favoriteIds, toggleFavorite }), [favoriteIds, toggleFavorite]);
  return <FavoritesContext value={value}>{children}</FavoritesContext>;
}
