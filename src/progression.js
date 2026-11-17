// Character progression: levels, stat points, and saved data.
// All persistent player state lives in one plain object (`profile.data`) so it can
// later be swapped for server-side storage (accounts and saved characters).

const SAVE_KEY = "grandTidesSaveV2";

export const STAT_INFO = {
  vitality: { label: "Vitality", desc: "+12 max health" },
  strength: { label: "Strength", desc: "+6% weapon damage" },
  mastery: { label: "Mastery", desc: "+8% ability and relic power" },
  stamina: { label: "Stamina", desc: "-3% ability cooldowns" },
  agility: { label: "Agility", desc: "+2.5% movement speed" },
};

export const STAT_IDS = Object.keys(STAT_INFO);

const defaults = () => ({
  version: 2,
  level: 1,
  xp: 0,
  statPoints: 0,
  stats: { vitality: 0, strength: 0, mastery: 0, stamina: 0, agility: 0 },
  coins: 0,
  renown: 0,
  relics: [],
  activeRelic: null,
  questStage: "meet",
  wisps: 0,
  chartFound: false,
  bossDefeated: false,
});

function load() {
  const base = defaults();
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return base;
    const saved = JSON.parse(raw);
    return {
      ...base,
      ...saved,
      stats: { ...base.stats, ...(saved.stats || {}) },
      relics: Array.isArray(saved.relics) ? saved.relics : [],
    };
  } catch {
    return base;
  }
}

export function createProfile() {
  const data = load();
  let timer = null;

  function save() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
      } catch {
        /* storage unavailable (private mode, quota): the game still works */
      }
    }, 250);
  }

  const xpToNext = () => 40 + (data.level - 1) * 28 + (data.level - 1) ** 2 * 4;

  // Returns how many levels were gained.
  function addXp(amount) {
    data.xp += Math.max(0, Math.round(amount));
    let gained = 0;
    while (data.xp >= xpToNext()) {
      data.xp -= xpToNext();
      data.level++;
      data.statPoints += 2;
      gained++;
    }
    save();
    return gained;
  }

  function spend(stat) {
    if (data.statPoints < 1 || !(stat in data.stats)) return false;
    data.stats[stat]++;
    data.statPoints--;
    save();
    return true;
  }

  function reset() {
    clearTimeout(timer);
    try {
      localStorage.removeItem(SAVE_KEY);
    } catch {
      /* ignore */
    }
  }

  return {
    data,
    save,
    addXp,
    spend,
    reset,
    xpToNext,
    maxHealth: () => 100 + (data.level - 1) * 5 + data.stats.vitality * 12,
    weaponMult: () => 1 + (data.level - 1) * 0.03 + data.stats.strength * 0.06,
    abilityMult: () => 1 + (data.level - 1) * 0.02 + data.stats.mastery * 0.08,
    cooldownMult: () => Math.max(0.5, 1 - data.stats.stamina * 0.03),
    speedMult: () => 1 + data.stats.agility * 0.025,
  };
}
