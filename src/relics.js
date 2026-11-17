// Ancient Relics: original supernatural abilities discovered through exploration.
// The ability behaviour itself lives in world.js (it needs enemies and effects);
// this file is just the data, so new relics are easy to add.

export const RELICS = {
  ember: {
    id: "ember",
    name: "Ember Relic",
    short: "EMBER",
    icon: "🔥",
    color: 0xff8a4a,
    cooldown: 5,
    desc: "Flame cone that burns enemies. Dropped by Captain Brinejaw.",
  },
  storm: {
    id: "storm",
    name: "Storm Relic",
    short: "STORM",
    icon: "⚡",
    color: 0xb9a7ff,
    cooldown: 6,
    desc: "Lightning that chains between up to three enemies. Awakens when all Tide Wisps are found.",
  },
  nature: {
    id: "nature",
    name: "Verdant Relic",
    short: "VERDANT",
    icon: "🌿",
    color: 0x7be08a,
    cooldown: 9,
    desc: "Heals you and lashes nearby enemies with thorns. Hidden in a grove only the Lost Sea Chart reveals.",
  },
};

export const RELIC_IDS = Object.keys(RELICS);
