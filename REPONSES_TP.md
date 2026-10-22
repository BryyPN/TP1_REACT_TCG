# TP Module 1 - Ma collection TCG : réponses

**Étudiant :** Bryan PHAN NGUYEN  
**Stack :** React 19, Vite, JavaScript/JSX, json-server

## Étape 0 - Mise en place

**Q0.1** Sans `#root`, `getElementById("root")` renvoie `null` et `createRoot` lève « Target container is not a DOM element ». Cette div est le point d'ancrage dans lequel React monte l'application.

**Q0.2** Vite fournit le HMR et le plugin React fournit Fast Refresh. Ensemble, ils remplacent le module modifié sans rechargement complet.

**Q0.3** L'application contient un seul fichier HTML, `index.html`. Une SPA charge une page puis modifie son interface avec JavaScript sans naviguer entre plusieurs documents HTML.

## Étape 1 - Le domaine

**Q1.1** `SAMPLE_CARDS.push(...)` provoque une erreur du type « Cannot add property ..., object is not extensible ». `Object.freeze` empêche l'ajout, la suppression et la modification des éléments du tableau. Cela protège une donnée de référence contre les mutations accidentelles.

**Q1.2** JavaScript ne vérifie pas que la valeur appartient aux quatre raretés. La tuile reçoit `rarity-legendaire` et le badge `badge-legendaire`, qui n'ont pas de style dédié : ils prennent le style par défaut. Une union TypeScript, un schéma de validation ou `parseRarity` permettrait de détecter l'erreur plus tôt.

**Q1.3** Le formateur est créé une seule fois hors de `formatPrice`, puis réutilisé. Cela évite de recréer inutilement `Intl.NumberFormat` à chaque appel.

**Q1.4** Les accolades JSX contiennent une expression JavaScript qui produit une valeur. Un `if` est une instruction ; on utilise donc un ternaire ou `&&` pour un rendu conditionnel.

## Étape 2 - Premier composant

**Q2.1** Le `console.log` affiche un élément React : un objet contenant notamment `type` et `props`. Il décrit l'interface à rendre ; ce n'est pas encore du HTML.

**Q2.2** Il y a un composant, trois éléments React créés par le JSX et trois instances rendues par React. Une instance correspond à une occurrence du composant dans l'arbre.

**Q2.3** Un nom en minuscule est interprété comme une balise HTML. JSX ne reconnaît pas `cardTile` comme le composant `CardTile`. Les composants doivent commencer par une majuscule.

**Q2.4** `CardTile()` appelle directement la fonction au lieu de laisser React gérer une instance. Des hooks placés dans cette fonction seraient alors associés au composant parent et violeraient les règles des hooks.

## Étape 3 - Props et composition

**Q3.1** Sans prop `card`, l'accès à `card.rarity` provoque un `TypeError` lorsque le composant s'exécute pendant le rendu.

**Q3.2** Dans `label = rarity`, la valeur par défaut est utilisée lorsque `label` vaut `undefined`. Une prop `label="Légendaire"` remplace donc la valeur de `rarity`.

**Q3.3** Les props sont en lecture seule. Muter une prop modifie un objet appartenant au parent sans produire une nouvelle référence ni signaler correctement le changement à React. Il faut créer une nouvelle valeur.

**Q3.4** `children` est le JSX placé entre les balises d'un composant. Il permet à `Panel` d'accueillir librement un formulaire, une grille ou des notes, au lieu de limiter son contenu à une prop `body`.

## Étape 4 - Listes et rendu conditionnel

**Q4.1** React affiche « Each child in a list should have a unique key prop ». La `key` identifie chaque élément entre deux rendus et permet de préserver correctement son identité.

**Q4.2** `card.id` reste lié à la carte. Un index peut changer après un retrait, un filtrage ou un réordonnancement et associer l'état d'une carte à une autre. Il est acceptable seulement pour une liste statique qui ne change jamais d'ordre.

**Q4.3** `0 && <p>...</p>` renvoie `0`, que React affiche. Il faut tester une expression booléenne comme `card.quantity > 0`. Dans le code final, `card.quantity === 0 && ...` évite déjà ce piège.

**Q4.4** L'early return affiche « Aucune carte à afficher. » au lieu de la grille.

**Q4.5** `filter` renvoie un nouveau tableau sans modifier `SAMPLE_CARDS`. On peut donc écrire `SAMPLE_CARDS.filter(isRare)`.

## Étape 5 - Le state

**Q5.1** Rien ne change : une variable locale est recréée au rendu suivant et sa modification ne demande pas de nouveau rendu à React.

**Q5.2** `console.log` affiche l'ancienne valeur. Un setter programme le prochain rendu ; il ne modifie pas la valeur capturée par le rendu courant.

**Q5.3** Deux appels `setQuantity(quantity + 1)` lisent la même valeur et donnent seulement `+1`. La forme fonctionnelle `setQuantity((q) => q + 1)` permet à chaque mise à jour de partir du résultat précédent et donne `+2`.

**Q5.4** ESLint signale un hook appelé conditionnellement. React doit retrouver les hooks dans le même ordre à chaque rendu.

**Q5.5** Le state local d'un enfant n'est pas lisible par son parent. Pour synchroniser le compteur et le résumé, le state doit être remonté dans leur ancêtre commun.

## Étape 6 - Remonter le state et l'immutabilité

**Q6.1** Si le tableau original est retourné après mutation, sa référence ne change pas et React peut ignorer la mise à jour. `Object.freeze` est superficiel : il protège le tableau, pas les objets qu'il contient. `map` et `{ ...card, quantity: ... }` créent les nouvelles références nécessaires.

**Q6.2** Le résumé est une donnée dérivée de `cards`, donc il ne nécessite aucun state. Stocker aussi la valeur créerait une seconde source de vérité qui pourrait devenir périmée.

**Q6.3** `QuantityControl` ne connaît pas l'id de la carte. La fonction `(delta) => onQuantityChange(card.id, delta)` ajoute l'id au delta transmis.

**Q6.4** Le reset utilise un seul `map` : `cards.map((card) => ({ ...card, quantity: 1 }))`.

**Q6.5** Les données descendent par les props : `App` fournit les cartes à `Summary` et `CardGrid`, puis `CardGrid` fournit une carte à `CardTile`. Les intentions remontent par les callbacks : quantité, suppression, sélection et ajout.

## Étape 7 - La recherche

**Q7.1** `App` doit connaître `query` pour filtrer la collection. Si le state était dans `SearchBar`, le parent ne pourrait pas filtrer les cartes.

**Q7.2** `visibleCards` est dérivé de `cards`, `query` et `rarity`. Le stocker risquerait de le laisser périmé après un ajout, un retrait ou une modification.

**Q7.3** `setQuery` reçoit le nouveau texte, exactement comme `onQueryChange`. Il peut donc être passé directement.

**Q7.4** La recherche porte sur le nom et l'extension avec `` `${card.name} ${card.set}` `` ; « fossile » trouve donc les cartes de l'extension Fossile.

**Q7.5** Le titre reste juste car `visibleCards.length` est recalculé à chaque rendu à partir de la collection et des filtres.

## Étape 8 - Les effets

**Q8.1** En développement, `StrictMode` monte, démonte puis remonte le composant pour vérifier les effets : « installé, retiré, installé ». Ce contrôle supplémentaire n'a pas lieu en production.

**Q8.2** Sans cleanup, les écouteurs s'accumulent : une touche Échap peut déclencher plusieurs handlers. Le cleanup retire l'ancien écouteur et évite doublons et fuites.

**Q8.3** Avec `[]`, le titre reste basé sur la valeur initiale et ESLint signale une dépendance manquante. Sans tableau, l'effet s'exécute après chaque rendu.

**Q8.4** `value` est déjà calculée à partir de `cards`, donc un state serait redondant. Il introduirait aussi un rendu intermédiaire avec une valeur potentiellement périmée.

**Q8.5** Modifier `document.title` est un effet de bord. Le rendu doit rester pur ; `useEffect` réalise cette synchronisation après le rendu.

## Étape 9 - Charger depuis une API

**Q9.1** Une fonction `async` renvoie une Promise, alors que `useEffect` attend éventuellement une fonction de cleanup, pas une Promise. On appelle donc la fonction asynchrone dans l'effet avec `then/catch` ou une fonction interne.

**Q9.2** Si l'URL est incorrecte, `response.ok` vaut `false` et l'application lève `HTTP 404`. `fetch` ne rejette pas automatiquement sur les réponses 4xx/5xx.

**Q9.3** En développement, `StrictMode` peut provoquer deux chargements. Le drapeau `ignore` empêche la première réponse, devenue obsolète après le cleanup, de modifier le state.

**Q9.4** Si l'utilisateur sélectionne successivement deux cartes, la première réponse peut arriver après la seconde. Le cleanup met `ignore` à `true` pour empêcher cette réponse périmée d'écraser les données actuelles.

**Q9.5** ESLint signale un hook appelé conditionnellement. Tous les hooks doivent être exécutés avant un éventuel return anticipé et dans le même ordre.

**Q9.6** Plusieurs states indépendants peuvent créer un état absurde, par exemple `isLoading === true` avec une erreur affichée. Le champ unique `status` rend ces combinaisons impossibles.

**Bonus** Une modification de quantité pourrait être persistée avec `PATCH /cards/:id` et un corps `{ quantity }`, mais ce n'est pas obligatoire dans ce TP.

## Étape 10 - Hooks personnalisés

**Q10.1** Ces fichiers ne contiennent pas de JSX, seulement de la logique JavaScript : l'extension `.js` suffit.

**Q10.2** Chaque appel à `useCards` possède son propre state. Deux grilles ont donc chacune leurs requêtes et leurs données ; partager un hook ne partage pas automatiquement son state.

**Q10.3** Sans le préfixe `use`, ESLint ne reconnaît pas la fonction comme un hook personnalisé et peut signaler l'utilisation de hooks dans une fonction ordinaire.

**Q10.4** `useDocumentTitle` synchronise le titre du document et restaure l'ancien titre lors du démontage. Un hook peut donc ne rien retourner.

## Étape 11 - Les favoris avec Context

**Q11.1** Sans Context, les favoris devraient passer d'`App` à `CardGrid`, `CardTile` et `FavoriteButton`, et aussi jusqu'à `FavoritesCount`. Ce prop drilling concerne des composants qui n'utilisent pas directement ces données.

**Q11.2** `useFavorites` lève l'erreur « useFavorites doit être appelé sous <FavoritesProvider> ». Cette erreur explicite est préférable à un `undefined` silencieux.

**Q11.3** Le Context transporte la valeur ; les favoris vivent réellement dans le `useState` de `FavoritesProvider`.

**Q11.4** Les consommateurs du Context, notamment les boutons de favoris et le compteur, sont rendus de nouveau quand la valeur du Context change. Il faut donc réserver Context aux données partagées qui changent peu.

**Bonus** Les favoris pourraient être synchronisés avec `localStorage`, mais ce n'est pas demandé.

## Étape 12 - Le formulaire d'ajout

**Q12.1** Sans `preventDefault`, le navigateur soumet le formulaire et recharge la page. Le state local est perdu et la carte disparaît puisqu'elle n'est pas persistée par le serveur.

**Q12.2** `update("nme", "x")` ajoute une clé `nme` au brouillon, car JavaScript accepte cette clé. Une validation stricte des champs permettrait de détecter cette faute.

**Q12.3** Les erreurs sont dérivées du brouillon à chaque rendu. Les stocker créerait une copie pouvant devenir périmée.

**Q12.4** Un bouton de remise à zéro doit avoir `type="button"` ; sinon, dans un formulaire, il est `submit` par défaut.

**Q12.5** Pour un petit formulaire, le rendu à chaque frappe est normal. React met à jour efficacement l'interface ; une optimisation ne serait nécessaire que pour un composant réellement coûteux.

**Q12.6** `event.target.value` est une chaîne qui pourrait contenir une valeur invalide. `parseRarity(...) ?? "commune"` garantit une rareté autorisée. Dans le code final, cette validation est effectuée à la soumission avant l'ajout.

## Étape 13 - Les refs

**Q13.1** Pendant le premier rendu, `inputRef.current` vaut `null`, car le DOM n'est pas encore monté. Dans un handler exécuté après le rendu, il référence l'input.

**Q13.2** Une ref conserve le nœud entre les rendus sans provoquer de nouveau rendu lorsqu'elle change. Un state serait inutile pour cette référence DOM.

**Q13.3** Modifier un state pendant le rendu provoquerait des rendus supplémentaires, voire une boucle. En développement, `StrictMode` peut rendre deux fois pour détecter ce type de problème. Cette expérience doit être retirée.

**Q13.4**

| Mécanisme | Survit aux rendus ? | Déclenche un rendu ? |
|---|---:|---:|
| Ref | Oui | Non |
| Variable locale | Non | Non |
| State | Oui | Oui |

## Étape 14 - Reset par `key`

**Q14.1** Sans `key`, React réutilise la même instance de `CardNotes` au même emplacement et conserve la note. Avec `key={selectedCard.id}`, un id différent crée une nouvelle instance et réinitialise le state.

**Q14.2** Il faut stocker `selectedId`, pas l'objet complet. Après une mise à jour, `cards.find(...)` retrouve la version actuelle de la carte.

**Q14.3** Après suppression, `find` ne retrouve plus l'id sélectionné. `selectedCard` devient `undefined`, donc le rendu conditionnel masque automatiquement le panneau.

## Vérification finale

Le projet final charge 12 cartes depuis l'API et affiche :

```text
12 cartes · 26 exemplaires · 202,50 €
```

Les bonus de persistance API et de stockage des favoris ne sont pas nécessaires pour valider le TP.

