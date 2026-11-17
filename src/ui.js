// HUD and menus. This module only touches the DOM; game rules live elsewhere.
import { STAT_IDS, STAT_INFO } from "./progression.js";
import { RELICS } from "./relics.js";

export function createUI() {
  const $ = (id) => document.getElementById(id);
  let lines = [];
  let lineIndex = 0;
  let doneCallback = null;
  let toastTimer = null;
  let characterOpen = false;

  const api = { onStart: null, onDialogueNext: null, onSpend: null, onEquip: null, onReset: null, onCharacterToggle: null };

  $("start-button").addEventListener("click", () => api.onStart?.());
  $("dialogue-next").addEventListener("click", () => api.onDialogueNext?.());
  $("character-close").addEventListener("click", () => api.setCharacterOpen(false));
  $("reset-save").addEventListener("click", () => {
    if (confirm("Reset all progress and start over?")) api.onReset?.();
  });

  api.hideStart = () => ($("start-screen").hidden = true);

  api.setQuest = ({ title, description, progress, status }) => {
    $("quest-title").textContent = title;
    $("quest-description").textContent = description;
    $("quest-progress").style.width = progress + "%";
    $("quest-status").textContent = status;
  };

  api.setDiscoveries = (text) => ($("discoveries").textContent = text);

  api.setInteraction = (label) => {
    const el = $("interaction-prompt");
    el.hidden = !label;
    if (label) el.querySelector("span").textContent = label;
  };

  api.showDialogue = (speaker, role, arr, onDone) => {
    lines = arr;
    lineIndex = 0;
    doneCallback = onDone;
    $("speaker-name").textContent = speaker;
    $("speaker-role").textContent = role;
    $("dialogue").hidden = false;
    $("dialogue-text").textContent = lines[0] || "";
  };

  api.nextDialogue = () => {
    lineIndex++;
    if (lineIndex < lines.length) {
      $("dialogue-text").textContent = lines[lineIndex];
      return false;
    }
    $("dialogue").hidden = true;
    const cb = doneCallback;
    doneCallback = null;
    cb?.();
    return true;
  };

  api.toast = (message) => {
    const el = $("toast");
    el.textContent = message;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3200);
  };

  api.setStats = ({ coins, renown, health, maxHealth }) => {
    if (coins !== undefined) $("coin-value").textContent = coins;
    if (renown !== undefined) $("renown-value").textContent = renown;
    if (health !== undefined && maxHealth !== undefined) {
      $("health-value").textContent = Math.ceil(health) + " / " + maxHealth;
      $("health-fill").style.width = Math.max(0, Math.min(100, (health / maxHealth) * 100)) + "%";
    }
  };

  api.setProfile = ({ level, xp, xpNeeded, statPoints }) => {
    $("level-label").textContent = "LV. " + level;
    $("xp-level").textContent = level;
    $("xp-text").textContent = xp + " / " + xpNeeded + " XP";
    $("xp-fill").style.width = Math.min(100, (xp / xpNeeded) * 100) + "%";
    const hint = $("points-hint");
    hint.hidden = statPoints < 1;
    hint.textContent = "+" + statPoints + " STAT POINT" + (statPoints === 1 ? "" : "S") + " · PRESS C";
  };

  api.floatText = (text, color = "#fff1cb") => {
    const el = $("combat-feedback");
    el.textContent = text;
    el.style.color = color;
    el.hidden = false;
    el.style.animation = "none";
    void el.offsetWidth;
    el.style.animation = "damage-pop .75s ease-out forwards";
  };
  api.damageNumber = (amount, enemy = false) => api.floatText("-" + amount, enemy ? "#ff9b83" : "#fff1cb");

  // ratio: 0 = ready, 1 = just used
  api.setCooldown = (slot, ratio) => {
    const el = $("slot-" + slot);
    if (el) el.style.setProperty("--cd", Math.max(0, Math.min(1, ratio)).toFixed(3));
  };

  api.setRelic = (relicId) => {
    const relic = relicId ? RELICS[relicId] : null;
    $("relic-icon").textContent = relic ? relic.icon : "◇";
    $("relic-name").textContent = relic ? relic.short : "NO RELIC";
    $("slot-relic").classList.toggle("empty", !relic);
  };

  api.setBoss = (boss) => {
    const el = $("boss-bar");
    el.hidden = !boss;
    if (!boss) return;
    $("boss-name").textContent = boss.name.toUpperCase();
    $("boss-fill").style.width = Math.max(0, (boss.hp / boss.max) * 100) + "%";
  };

  api.setGuard = (on) => ($("guard-indicator").hidden = !on);

  api.isCharacterOpen = () => characterOpen;
  api.setCharacterOpen = (open) => {
    characterOpen = open;
    $("character").hidden = !open;
    api.onCharacterToggle?.(open);
  };

  // view: { level, xp, xpNeeded, statPoints, stats, relics, activeRelic }
  api.renderCharacter = (view) => {
    $("char-level").textContent = view.level;
    $("char-xp").textContent = view.xp + " / " + view.xpNeeded + " XP";
    $("char-points").textContent = view.statPoints;

    const statList = $("stat-list");
    statList.replaceChildren();
    STAT_IDS.forEach((id, i) => {
      const info = STAT_INFO[id];
      const row = document.createElement("li");
      const label = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = info.label + "  " + view.stats[id];
      const desc = document.createElement("small");
      desc.textContent = info.desc + "  ·  key " + (i + 1);
      label.append(name, desc);
      const btn = document.createElement("button");
      btn.textContent = "+";
      btn.disabled = view.statPoints < 1;
      btn.setAttribute("aria-label", "Increase " + info.label);
      btn.addEventListener("click", () => api.onSpend?.(id));
      row.append(label, btn);
      statList.append(row);
    });

    const relicList = $("relic-list");
    relicList.replaceChildren();
    Object.values(RELICS).forEach((relic) => {
      const owned = view.relics.includes(relic.id);
      const row = document.createElement("li");
      row.className = owned ? "" : "locked";
      const label = document.createElement("div");
      const name = document.createElement("strong");
      name.textContent = (owned ? relic.icon + " " : "? ") + (owned ? relic.name : "Undiscovered Relic");
      const desc = document.createElement("small");
      desc.textContent = relic.desc;
      label.append(name, desc);
      row.append(label);
      if (owned) {
        const btn = document.createElement("button");
        const active = view.activeRelic === relic.id;
        btn.textContent = active ? "ACTIVE" : "EQUIP";
        btn.disabled = active;
        btn.addEventListener("click", () => api.onEquip?.(relic.id));
        row.append(btn);
      }
      relicList.append(row);
    });
  };

  return api;
}
