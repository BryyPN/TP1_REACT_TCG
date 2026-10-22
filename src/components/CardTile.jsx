import { formatPrice, isRare } from "../domain/card";
import { FavoriteButton } from "./FavoriteButton";
import { RarityBadge } from "./RarityBadge";

export function CardTile({ card, children, selected = false, onSelect }) {
  return (
    <article className={`card-tile rarity-${card.rarity} ${selected ? "is-selected" : ""}`}>
      <div className="actions">
        <h3>{card.name}</h3>
        <FavoriteButton cardId={card.id} />
      </div>
      <RarityBadge rarity={card.rarity} />
      <p className="meta">{card.set} · {card.rarity}</p>
      <p className="price">{formatPrice(card.price)}</p>
      {isRare(card) && <p className="highlight">★ Carte rare</p>}
      {card.quantity === 0 && <p className="sold-out">Plus aucun exemplaire</p>}
      {children && <div className="actions">{children}</div>}
      <div className="actions">
        <button type="button" onClick={() => onSelect(card.id)}>Notes</button>
      </div>
    </article>
  );
}
