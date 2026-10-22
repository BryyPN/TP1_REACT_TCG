import { useFavorites } from "../context/favorites";

export function FavoritesCount() {
  const { favoriteIds } = useFavorites();
  return <span>★ {favoriteIds.length} favori(s)</span>;
}
