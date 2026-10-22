export async function fetchCards() {
  const response = await fetch("http://localhost:3001/cards");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  // L'API n'est pas validée ici : elle est supposée renvoyer des cartes.
  return response.json();
}
