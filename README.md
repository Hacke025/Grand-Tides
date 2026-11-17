# Grand Tides

**Grand Tides** is an original 3D, story-first pirate adventure prototype. Explore the Shattered Coast, meet its residents, discover mysterious landmarks, and unlock the secrets of a much larger world.

This project takes broad inspiration from open-world anime pirate RPGs, while creating its own setting, characters, story, and powers.

## Play

After GitHub Pages is enabled, the game will be available at:

https://hacke025.github.io/Grand-Tides/

## Current prototype

- Real-time 3D island environment rendered with Three.js.
- Third-person character movement with WASD, mouse-drag camera, jumping, and sprinting.
- First story quest: **A Light in the Mist**.
- NPC dialogue and proximity-based interaction.
- Two starter abilities: **Gale Step** (mobility burst) and **Tide Pulse** (a visual energy pulse).
- Responsive HUD, quest tracker, status display, and ability bar.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse drag | Rotate camera |
| Space | Jump |
| Shift | Sprint |
| E | Interact / continue dialogue |
| Q | Gale Step |
| R | Tide Pulse |

## Run locally

Because the game uses JavaScript modules, run it through a local static web server rather than opening the HTML file directly. For example, use the Live Server extension in VS Code, or run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.

Three.js is loaded from jsDelivr; no build step is required.

## Multiplayer-ready direction

The current prototype is intentionally single-player, but its systems are separated into world, player, quest, and UI modules. A later multiplayer phase can add Supabase Auth and Postgres for accounts and saved character data, with Supabase Realtime for presence and lightweight world events. A dedicated authoritative game server may be needed later for synchronized movement and gameplay validation; browser clients should never be trusted to decide important shared game state.

The static GitHub Pages build can remain the web client while Supabase supplies the backend.

## Technology

- HTML / CSS / JavaScript modules
- Three.js
- GitHub Pages (static hosting)
- Future backend option: Supabase

## Project principle

Progression should come from discoveries, choices, characters, and story milestones—not repetitive enemy farming.