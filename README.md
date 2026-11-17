# Grand Tides

**Grand Tides** is an original 3D, story-first pirate adventure prototype. Explore the Shattered Coast, meet its residents, fight coast raiders, and search the island for treasure.

## Play

https://hacke025.github.io/Grand-Tides/

## Current prototype

- Third-person 3D island exploration rendered with Three.js, with saved progress.
- Light attacks chain into a 3-hit **combo finisher**; heavy strikes cleave; **Guard** (hold V) cuts damage; **Gale Step** is a real dodge with brief invulnerability.
- **Levels, XP, and stat points** (Vitality, Strength, Mastery, Stamina, Agility). XP comes from discoveries, quests, chests, and fights, so no single activity is required. Press **C** for the character panel.
- **Ancient Relics**, original supernatural abilities found through exploration:
  - **Ember Relic**: flame cone with burn damage. Dropped by the boss.
  - **Storm Relic**: chain lightning. Awakens when all five Tide Wisps are found.
  - **Verdant Relic**: heal plus thorns. Hidden in a grove revealed by the Lost Sea Chart.
- Three enemy types with **telegraphed attacks**, territory, health bars, and leashing: Coast Raiders, Reef Brutes (one guards the shipwreck), and the boss **Captain Brinejaw**, whose ground slam shows a red warning circle.
- Main story: *A Light in the Mist* continues into *The Captain's Grudge*.
- Out-of-combat health regeneration; defeated enemies return over time, so there is nothing to farm.
- Random treasure chests, optional **Tide Wisp** collectibles, a hidden shipwreck with the **Lost Sea Chart**, and a discoveries tracker in the quest panel.
- Animated birds, swaying trees, lanterns, a campfire, and atmospheric lighting.
- Progress (level, stats, coins, relics, story stage, discoveries) saves to your browser automatically.

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
| V (hold) | Guard (reduces damage by 65%) |
| Z | Use equipped Ancient Relic |
| X | Cycle equipped relic |
| C | Character panel (or press 1-5 to spend stat points while it is open) |

Gale Step (Q) grants a short window of invulnerability, so use it to dodge the boss's slam.

## Run locally

Because the game uses JavaScript modules, run it through a local static web server rather than opening the HTML file directly. For example, use the Live Server extension in VS Code, or run `python -m http.server 8000` in the project folder and open `http://localhost:8000`.

Three.js is loaded from jsDelivr; no build step is required.

## First-island adventure goals

The Shattered Coast is the first playable destination. Its intended content includes a main-story beacon mystery, optional discoveries, treasure, hostile territory, a shipwreck side activity, and distinct landmarks. Future island updates should add their own local stories, secrets, enemy factions, and traversal challenges rather than simply reskinning the same quests.

## Visual and animation pass

The renderer now uses ACES filmic tone mapping, soft PCF shadows, atmospheric fog, a custom gradient sky dome, a visible sun and glow, drifting cloud banks, and distant island silhouettes. The Shattered Coast settlement has more detailed houses with windows, trim, chimneys, and porches. Player idle/movement/attack motion and NPC/raider idle and movement animation have also been expanded.

## Multiplayer-ready direction

The current prototype is intentionally single-player. Its systems are separated into world, player, quest, and UI modules. A later multiplayer phase can add Supabase Auth and Postgres for accounts and saved character data, with Supabase Realtime for presence and lightweight world events. A dedicated authoritative game server may be needed for synchronized movement and gameplay validation; browser clients should not be trusted to decide important shared game state.

GitHub Pages can remain the web client while Supabase supplies backend services.

## Technology

HTML · CSS · JavaScript modules · Three.js · GitHub Pages · Future backend option: Supabase

## Design principle

Progression should come from discoveries, choices, characters, and story milestones—not repetitive enemy farming.