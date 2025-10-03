# Snake (Node.js + Express)

Jednoduchá hra **Snake** běžící v prohlížeči a servírovaná přes Node.js/Express.

## Jak spustit
1) Ujisti se, že máš nainstalovaný Node.js (doporučené LTS) a npm.
2) V terminálu přejdi do složky projektu:
   ```bash
   cd snake-node-game
   npm install
   npm start
   ```
3) Otevři prohlížeč na `http://localhost:3000`

## Ovládání
- Šipky ← ↑ → ↓ : změna směru hada
- P : pauza / pokračování
- R : restart

## Cíl hry
Sněz co nejvíce jablek. Každé jablko zvětší hada a přidá bod. Konec hry nastane při nárazu do stěny nebo do vlastního těla.

## Struktura
```
snake-node-game/
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ main.js
├─ server.js
└─ package.json
```
