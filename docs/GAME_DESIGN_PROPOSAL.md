# Grand Tides — Game Design Proposal
**Reference baseline · Version 1.0 · Updated 2026-11-17**

## Identity
**Grand Tides** is an original 3D, open-world, story-driven pirate adventure RPG. Its inspirations include the freedom, island structure, combat variety, and discovery loop of games such as Grand Piece Online, while its world, lore, characters, abilities, art, and systems remain original.

**Design pillars:** exploration, freedom, skill-based combat, meaningful progression, story, social adventure, and discovery.

**Core promise:** Exploration first. Adventure always. Progression naturally follows.

## Core gameplay loop
1. Explore an island, coastline, ruin, or open sea.
2. Meet characters, uncover clues, accept quests, or discover optional activities.
3. Overcome encounters and environmental challenges.
4. Earn currency, renown, equipment, relic knowledge, and story progress.
5. Improve the character or unlock a new destination.
6. Set out toward the next mystery.

Every activity should contribute to a meaningful reward, story beat, discovery, or player choice.

## World structure
- **Starting islands:** teach movement, combat, interaction, quests, and sailing.
- **Intermediate islands:** introduce new cultures, factions, mechanics, and stronger challenges.
- **Advanced islands:** contain dangerous regions, rare discoveries, dungeons, and major story arcs.
- **Special locations:** caves, shipwrecks, ruins, hidden coves, dungeons, and event areas.
- **Multiple seas:** larger world regions unlocked through story and exploration.

Each island needs a distinct visual identity, local history, memorable NPCs, landmarks, secrets, enemy groups, and at least one activity that cannot be found elsewhere.

## Sailing and transportation
Boats are the primary way to travel between islands. Sailing should be gameplay, not a loading screen: changing weather, ocean discoveries, small islands, shipwrecks, sea encounters, boat ownership, customization, and cooperative travel. More distant seas open as the story progresses.

## Character progression
Proposed systems:
- **Level and renown:** broad measures of experience and reputation.
- **Stats:** Vitality, Strength, Mastery, Stamina, and Agility.
- **Origins:** character backgrounds with traits, story connections, and optional advantages.
- **Fighting styles:** distinct melee approaches and move sets.
- **Equipment:** weapons, armor, accessories, and utility items.
- **Ancient Relics:** supernatural powers with unique abilities, growth paths, weaknesses, and lore.

Progression must support different playstyles and avoid repetitive farming as the only route forward.

## Ancient Relics
Original supernatural power system. Possible themes:
- Storm — wind, lightning, mobility.
- Tide — water, currents, pressure.
- Ember — heat and flame.
- Void — shadows and unusual spatial effects.
- Nature — plants and natural energy.
- Astral — celestial and mysterious forces.

Relics should be found through exploration, story choices, difficult encounters, and rare events—not only bought from a menu. Each relic needs a distinct visual language and progression path.

## Combat
Responsive, readable, skill-based action:
- Light and heavy attacks.
- Combos and timing windows.
- Dodging and mobility.
- Blocking and defensive counters.
- Stamina and ability cooldowns.
- Fighting styles and relic moves.
- Enemy tells, hit reactions, and varied attack patterns.
- Named enemies, bosses, dungeons, and optional group encounters.

Effects should be expressive and original: clear hit feedback, particles, trails, impact rings, sound, and animations without obscuring gameplay.

## Quests and narrative
- **Main story:** drives the central mystery, introduces major characters, and unlocks regions.
- **Side stories:** optional character arcs, local problems, and unique rewards.
- **World activities:** treasure hunts, shipwrecks, discoveries, patrols, environmental puzzles, and dynamic encounters.

Quests should favor varied objectives and memorable characters over repetitive defeat-count missions.

## Enemies, bosses, dungeons, raids
Enemy roles include common inhabitants, territorial groups, elite enemies, named rivals, bosses, and group-event enemies. Enemies should patrol, protect locations, react to the world, and have distinct behaviors.

Dungeons are multi-stage adventures combining exploration, environmental challenges, encounters, and a final reward. Raids are optional cooperative challenges, never mandatory walls for story progression.

## Items and economy
- Coins: general spending.
- Renown: reputation and milestones.
- Treasure: chests, maps, hidden caches, and island rewards.
- Materials: crafting and upgrades.
- Equipment: functional character items.
- Cosmetics: personalization.
- Relic discoveries: rare long-term collection goals.

Trading may arrive later with clear confirmation steps and anti-scam protections.

## Multiplayer and social
Future systems: accounts, saved characters, shared exploration, crews, ships, group quests, co-op dungeons, boss encounters, shared events, and optional trading. Competitive duels and arenas remain separate from the main adventure.

The current game is single-player. Reliable shared combat and movement will require server-authoritative validation; the browser client should not be trusted to decide important shared state.

## Grand Tides versus its inspirations
| Reference concept | Grand Tides direction |
|---|---|
| Multiple islands and seas | Handcrafted destinations with local stories |
| Sailing | Discovery-focused ocean travel |
| Levels and stats | Flexible progression through play and story |
| Races | Origins, traits, and character identity |
| Devil Fruits | Original Ancient Relics |
| Action combat | Timing, movement, defense, and readable effects |
| NPC missions | Character-led stories and varied objectives |
| Bosses and raids | Memorable, optional challenges |
| Currency and drops | Treasure, crafting, cosmetics, and discoveries |
| Shared online world | Crews and cooperative adventures |

## Development roadmap
### Phase 1 — First complete island
- [ ] Polished movement, camera, and controls
- [ ] Character model and animation pass
- [ ] Combat combos, dodge, block, and hit reactions
- [ ] Distinct enemy types and named encounter
- [ ] Main story chapter with a satisfying conclusion
- [ ] Side quests and environmental puzzles
- [ ] Treasure hunts and hidden locations
- [ ] First-island balance and browser testing

### Phase 2 — World expansion
- [ ] Second and third islands with unique identities
- [ ] Ocean traversal and sailing
- [ ] Boat ownership and customization
- [ ] Shops, trainers, and additional NPCs
- [ ] New factions, enemies, and bosses
- [ ] Dynamic weather and ocean discoveries

### Phase 3 — RPG progression
- [ ] Levels, stats, and character builds
- [ ] Ancient Relic discovery and mastery
- [ ] Origins and traits
- [ ] Equipment, crafting, and cosmetics
- [ ] Expanded quest arcs
- [ ] Dungeons and special challenges

### Phase 4 — Multiplayer
- [ ] Accounts and saved characters
- [ ] Shared player presence
- [ ] Crews and shared ships
- [ ] Cooperative quests and encounters
- [ ] Secure trading and social systems

### Phase 5 — Full adventure
- [ ] Main campaign across multiple seas
- [ ] Major story arcs and world-changing events
- [ ] Advanced bosses and optional endgame
- [ ] Ongoing islands, mysteries, and content updates

## Current prototype status
| System | Status |
|---|---|
| 3D Shattered Coast island | Prototype |
| Player movement and camera | Implemented |
| Light/heavy combat | Prototype |
| Gale Step and Tide Burst | Prototype |
| Coast raider AI | Prototype |
| Treasure chests | Implemented |
| Tide Wisp collectibles | Implemented |
| Old Mariner and beacon story | Started |
| Shipwreck / Lost Sea Chart side discovery | Prototype |
| Multiple islands and sailing | Planned |
| Stats, origins, Ancient Relic mastery | Planned |
| Multiplayer and crews | Planned |

## Rules for future decisions
1. Grand Tides owns its world, characters, names, lore, abilities, and visual designs.
2. No pointless grinding; give players multiple meaningful ways to progress.
3. Exploration must reward curiosity.
4. Different playstyles should be viable.
5. Story and characters should make locations memorable.
6. Build a stable single-player foundation before implementing multiplayer.
7. Prefer complete, polished gameplay loops over many disconnected features.
