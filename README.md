# Grand Tides

**Grand Tides** is an original 3D, story-first pirate adventure prototype. Explore the Shattered Coast, meet its residents, fight coast raiders, and search the island for treasure.

## Play

https://hacke025.github.io/Grand-Tides/

## Current prototype

- Third-person 3D island exploration rendered with Three.js.
- Character movement, mouse-drag camera, jumping, sprinting, and a sword model.
- Light and heavy melee attacks with slash arcs, hit sparks, and impact feedback.
- **Gale Step** mobility burst and **Tide Burst** area attack with stylized energy VFX.
- Roaming coast raiders that pursue and attack when approached.
- Random treasure chests placed around the island; opening one grants 18–55 coins. Chests respawn over time.
- Story NPC, dialogue, ancient beacon, quest tracker, health, coins, and renown HUD.
- Animated birds, swaying trees, floating treasure chests, warm lanterns, a flickering campfire, coastal rocks, grass tufts, and atmospheric lighting.
- Optional **Tide Wisp** collectibles hidden around the island; each grants coins and renown.
- A hidden shipwreck and **Lost Sea Chart** side discovery, rewarding 65 coins and 15 renown.
- Defeated raiders return after a while, keeping the coast lively without requiring constant grinding.
- Camera rotation uses the right mouse button so left-click attacks no longer accidentally drag the camera.

## Controls

| Input | Action |
|---|---|
| WASD | Move |
| Mouse drag | Rotate camera |
| Space | Jump |
| Shift | Sprint |
| Left mouse button | Light sword attack |
| F | Heavy sword strike |
| Q | Gale Step |
| R | Tide Burst (3.5-second cooldown) |
| E | Interact / open chest / continue dialogue |

## Run locally

Because the game uses JavaScript modules, run it through a local static web server rather than opening the HTML file directly. For example, use the Live Server extension in VS Code, or run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.

Three.js is loaded from jsDelivr; no build step is required.

## First-island adventure goals

The Shattered Coast is the first playable destination. Its intended content includes a main-story beacon mystery, optional discoveries, treasure, hostile territory, a shipwreck side activity, and distinct landmarks. Future island updates should add their own local stories, secrets, enemy factions, and traversal challenges rather than simply reskinning the same quests.

## Multiplayer-ready direction

The current prototype is intentionally single-player. Its systems are separated into world, player, quest, and UI modules. A later multiplayer phase can add Supabase Auth and Postgres for accounts and saved character data, with Supabase Realtime for presence and lightweight world events. A dedicated authoritative game server may be needed for synchronized movement and gameplay validation; browser clients should not be trusted to decide important shared game state.

GitHub Pages can remain the web client while Supabase supplies backend services.

## Technology

HTML · CSS · JavaScript modules · Three.js · GitHub Pages · Future backend option: Supabase

## Design principle

Progression should come from discoveries, choices, characters, and story milestones—not repetitive enemy farming.