import * as THREE from "three";
import { createWorld } from "./world.js";
import { createPlayer } from "./player.js";
import { createQuestSystem } from "./quests.js";
import { createUI } from "./ui.js";
import { createProfile, STAT_IDS } from "./progression.js";
import { RELICS, RELIC_IDS } from "./relics.js";

// ---- Renderer, scene, lighting -------------------------------------------------
const canvas = document.querySelector("#world-canvas"),
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.shadowMap.autoUpdate = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.18;
renderer.info.autoReset = true;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9bcbd5);
scene.fog = new THREE.Fog(0x9bcbd5, 95, 280);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 500);
camera.position.set(0, 8, 12);
scene.add(new THREE.HemisphereLight(0xd9f3ff, 0x536b4d, 2.25));
scene.add(new THREE.AmbientLight(0xffffff, 0.28));
const sun = new THREE.DirectionalLight(0xffe5bf, 3.1);
sun.position.set(-42, 68, 34);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -55;
sun.shadow.camera.right = 55;
sun.shadow.camera.top = 55;
sun.shadow.camera.bottom = -55;
sun.shadow.bias = -0.00018;
sun.shadow.normalBias = 0.025;
sun.shadow.radius = 4;
scene.add(sun);

// ---- Game systems --------------------------------------------------------------
const profile = createProfile();
const data = profile.data; // everything that is saved
const ui = createUI();
const player = createPlayer(THREE, scene, camera, canvas);
const world = createWorld(THREE, scene, {
  camera,
  chartFound: data.chartFound,
  wispsFound: data.wisps,
  bossDefeated: data.bossDefeated,
});
const quests = createQuestSystem({ ui, profile, onReward: (r) => award(r) });

// ---- Runtime state (not saved) -------------------------------------------------
let health = profile.maxHealth();
let started = false;
let dialogueOpen = false;
let nearby = null;
let lastTime = 0;
let guarding = false;
let invuln = 0; // seconds of dodge invulnerability left
let sinceDamage = 99;
let comboCount = 0;
let comboTimer = 0;
let hudTimer = 0;
let bossShown = false;
const keys = {};
const cd = { light: 0, heavy: 0, gale: 0, pulse: 0, relic: 0 };
const cdMax = { light: 0.38, heavy: 1.25, gale: 2.2, pulse: 3.5, relic: 5 };

function startCooldown(slot, seconds) {
  cd[slot] = seconds;
  cdMax[slot] = seconds;
}
const cdMult = () => profile.cooldownMult();

// ---- HUD refresh helpers -------------------------------------------------------
function refreshStats() {
  ui.setStats({ coins: data.coins, renown: data.renown, health, maxHealth: profile.maxHealth() });
}
function refreshCharacter() {
  ui.renderCharacter({
    level: data.level,
    xp: data.xp,
    xpNeeded: profile.xpToNext(),
    statPoints: data.statPoints,
    stats: data.stats,
    relics: data.relics,
    activeRelic: data.activeRelic,
  });
}
function refreshProfile() {
  ui.setProfile({ level: data.level, xp: data.xp, xpNeeded: profile.xpToNext(), statPoints: data.statPoints });
  player.setSpeedMult(profile.speedMult());
  if (ui.isCharacterOpen()) refreshCharacter();
}
function refreshDiscoveries() {
  ui.setDiscoveries(
    "WISPS " + data.wisps + "/5  ·  CHART " + (data.chartFound ? "FOUND" : "—") + "  ·  RELICS " + data.relics.length + "/" + RELIC_IDS.length
  );
}

// ---- Rewards and progression ---------------------------------------------------
function award({ coins = 0, renown = 0, xp = 0 } = {}) {
  data.coins += coins;
  data.renown += renown;
  if (xp) {
    const gained = profile.addXp(xp);
    if (gained) {
      health = profile.maxHealth();
      ui.toast("LEVEL UP · LV. " + data.level + " · +" + gained * 2 + " STAT POINTS · PRESS C");
    }
  }
  profile.save();
  refreshStats();
  refreshProfile();
}

function spendStat(stat) {
  const before = profile.maxHealth();
  if (!profile.spend(stat)) return;
  health = Math.min(profile.maxHealth(), health + (profile.maxHealth() - before));
  refreshStats();
  refreshProfile();
}

function equipRelic(id) {
  if (!data.relics.includes(id)) return;
  data.activeRelic = id;
  profile.save();
  ui.setRelic(id);
  ui.toast(RELICS[id].name.toUpperCase() + " EQUIPPED");
  if (ui.isCharacterOpen()) refreshCharacter();
}

function cycleRelic() {
  if (!started || data.relics.length < 2) return;
  const next = data.relics[(data.relics.indexOf(data.activeRelic) + 1) % data.relics.length];
  equipRelic(next);
}

function claimRelic(id) {
  if (!data.relics.includes(id)) data.relics.push(id);
  const firstRelic = !data.activeRelic;
  if (firstRelic) data.activeRelic = id;
  profile.save();
  ui.setRelic(data.activeRelic);
  refreshDiscoveries();
  award({ xp: 80, renown: 20 });
  ui.toast(RELICS[id].name.toUpperCase() + " CLAIMED · " + (firstRelic ? "PRESS Z TO USE IT" : "PRESS X TO SWITCH RELICS"));
}

// ---- Dialogue and interaction --------------------------------------------------
function showDialogue(speaker, role, lines, done) {
  dialogueOpen = true;
  guarding = false;
  ui.setGuard(false);
  ui.showDialogue(speaker, role, lines, done);
}
function advanceDialogue() {
  if (ui.nextDialogue()) dialogueOpen = false;
}
ui.onDialogueNext = advanceDialogue;

function interact(t) {
  if (t.type === "mariner" || t.type === "beacon") {
    const mariner = t.type === "mariner";
    const result = mariner ? quests.talkToMariner() : quests.inspectBeacon();
    showDialogue(mariner ? "Old Mariner" : "Ancient Beacon", mariner ? "KEEPER OF THE HARBOR" : "A STRANGE MECHANISM", result.lines, () => quests.finishDialogue(result));
  } else if (t.type === "chest") {
    const amount = world.openChest(t);
    if (amount) {
      award({ coins: amount, xp: 6 });
      ui.toast("TREASURE FOUND  ·  +" + amount + " COINS");
    }
  } else if (t.type === "wisp" && world.collectWisp(t)) {
    data.wisps++;
    award({ coins: 8, renown: 5, xp: 10 });
    refreshDiscoveries();
    if (data.wisps >= 5 && !data.relics.includes("storm")) {
      world.revealRelic("storm");
      ui.toast("ALL WISPS FOUND · A RELIC SHRINE AWAKENS. LOOK FOR THE LIGHT.");
    } else {
      ui.toast("TIDE WISP FOUND · " + data.wisps + "/5 · +8 COINS · +5 RENOWN");
    }
  } else if (t.type === "chart" && world.collectChart(t)) {
    data.chartFound = true;
    award({ coins: 65, renown: 15, xp: 40 });
    refreshDiscoveries();
    if (!data.relics.includes("nature")) world.revealRelic("nature");
    ui.toast("LOST SEA CHART RECOVERED · A HIDDEN GROVE IS MARKED. LOOK FOR THE LIGHT.");
  } else if (t.type === "relic") {
    const id = world.claimRelic(t);
    if (id) claimRelic(id);
  }
}

function updateNearby() {
  const p = player.position();
  let nearest = null,
    dist = 3.5;
  for (const t of world.interactables) {
    if (!t.object.visible) continue;
    const d = p.distanceTo(t.object.position);
    if (d < dist) {
      nearest = t;
      dist = d;
    }
  }
  nearby = nearest;
  ui.setInteraction(nearest ? nearest.label : null);
}

// ---- Combat --------------------------------------------------------------------
function canAct() {
  return started && !dialogueOpen;
}

function lightAttack() {
  if (!canAct() || guarding || cd.light > 0) return;
  startCooldown("light", 0.38);
  comboCount = comboTimer > 0 ? comboCount + 1 : 1;
  comboTimer = 0.9;
  const finisher = comboCount >= 3;
  if (finisher) comboCount = 0;
  finisher ? player.heavySwing() : player.swing();
  const damage = 10 * profile.weaponMult() * (finisher ? 1.7 : 1);
  const hit = world.attack(player.position(), player.forward(), damage, finisher ? 4 : 3.3, finisher);
  if (hit) {
    ui.damageNumber(Math.round(damage));
    if (finisher) ui.toast("COMBO FINISHER");
  }
}

function heavyAttack() {
  if (!canAct() || guarding || cd.heavy > 0) return;
  startCooldown("heavy", 1.25 * cdMult());
  player.heavySwing();
  const damage = 24 * profile.weaponMult();
  const hit = world.attack(player.position(), player.forward(), damage, 4.8, true);
  if (hit) ui.damageNumber(Math.round(damage));
  else ui.toast("HEAVY STRIKE · MISSED");
}

function galeStep() {
  if (!canAct() || cd.gale > 0) return;
  startCooldown("gale", 2.2 * cdMult());
  invuln = 0.35; // dashing through danger is a real dodge
  player.galeStep();
  world.galeVfx(player.position(), player.forward());
}

function tideBurst() {
  if (!canAct() || cd.pulse > 0) return;
  startCooldown("pulse", 3.5 * cdMult());
  player.castPulse();
  const result = world.tidePulse(player.position(), 20 * profile.abilityMult());
  ui.toast(result.hits ? "TIDE BURST · " + result.hits + " HIT" : "TIDE BURST · NO TARGETS IN RANGE");
}

function useRelic() {
  if (!canAct() || guarding) return;
  const id = data.activeRelic;
  if (!id) {
    ui.toast("NO RELIC EQUIPPED · EXPLORE TO FIND ANCIENT RELICS");
    return;
  }
  if (cd.relic > 0) return;
  const relic = RELICS[id];
  startCooldown("relic", relic.cooldown * cdMult());
  player.castPulse();
  const result = world.relicAbility(id, player.position(), player.forward(), profile.abilityMult());
  if (id === "nature") {
    const heal = Math.round(profile.maxHealth() * 0.3);
    health = Math.min(profile.maxHealth(), health + heal);
    refreshStats();
    ui.floatText("+" + heal, "#9ff0a8");
  }
  ui.toast(relic.name.toUpperCase() + (result.hits ? " · " + result.hits + " HIT" : ""));
}

function takeDamage(amount) {
  if (!started) return;
  if (invuln > 0) {
    ui.floatText("DODGED", "#9ce9e2");
    return;
  }
  if (guarding) {
    amount = Math.max(1, Math.round(amount * 0.35));
    ui.floatText("BLOCKED -" + amount, "#a9dcf5");
  } else {
    ui.damageNumber(amount, true);
  }
  sinceDamage = 0;
  health = Math.max(0, health - amount);
  if (health <= 0) {
    const lost = Math.min(data.coins, Math.max(10, Math.floor(data.coins * 0.1)));
    data.coins -= lost;
    health = profile.maxHealth();
    player.respawn();
    profile.save();
    ui.toast("RESCUED AT THE HARBOR · -" + lost + " COINS");
  }
  refreshStats();
}

world.onKill = (enemy) => {
  const def = enemy.def;
  const coins = Math.round(def.coins * (0.8 + Math.random() * 0.4));
  award({ coins, renown: def.renown, xp: def.xp });
  if (def.boss) {
    quests.bossDefeated();
    world.revealRelic("ember", enemy.group.position);
    ui.toast("CAPTAIN BRINEJAW DEFEATED · A RELIC GLOWS WHERE HE FELL");
  } else {
    ui.toast(def.name.toUpperCase() + " DEFEATED  ·  +" + coins + " COINS  ·  +" + def.xp + " XP");
  }
};

// ---- Input ---------------------------------------------------------------------
ui.onSpend = spendStat;
ui.onEquip = equipRelic;
ui.onReset = () => {
  profile.reset();
  location.reload();
};
ui.onCharacterToggle = (open) => {
  if (open) refreshCharacter();
};

window.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (["Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
  if (!started || e.repeat) return;
  switch (e.code) {
    case "KeyE":
      if (dialogueOpen) advanceDialogue();
      else if (nearby) interact(nearby);
      break;
    case "KeyF":
      heavyAttack();
      break;
    case "KeyQ":
      galeStep();
      break;
    case "KeyR":
      tideBurst();
      break;
    case "KeyZ":
      useRelic();
      break;
    case "KeyX":
      cycleRelic();
      break;
    case "KeyV":
      guarding = !dialogueOpen;
      ui.setGuard(guarding);
      break;
    case "KeyC":
      ui.setCharacterOpen(!ui.isCharacterOpen());
      break;
    case "Escape":
      if (ui.isCharacterOpen()) ui.setCharacterOpen(false);
      break;
    default:
      if (ui.isCharacterOpen() && /^Digit[1-5]$/.test(e.code)) spendStat(STAT_IDS[Number(e.code.slice(5)) - 1]);
  }
});
window.addEventListener("keyup", (e) => {
  keys[e.code] = false;
  if (e.code === "KeyV") {
    guarding = false;
    ui.setGuard(false);
  }
});
window.addEventListener("blur", () => {
  for (const k in keys) keys[k] = false;
  guarding = false;
  ui.setGuard(false);
});
canvas.addEventListener("pointerdown", (e) => {
  if (e.button === 0 && started) lightAttack();
});

// ---- Main loop -----------------------------------------------------------------
function animate(time) {
  requestAnimationFrame(animate);
  const dt = Math.min((time - lastTime) / 1000 || 0, 0.04);
  lastTime = time;

  for (const slot in cd) {
    cd[slot] = Math.max(0, cd[slot] - dt);
    ui.setCooldown(slot, cdMax[slot] ? cd[slot] / cdMax[slot] : 0);
  }
  invuln = Math.max(0, invuln - dt);
  comboTimer = Math.max(0, comboTimer - dt);

  if (started) {
    player.update(dt, keys);
    updateNearby();
    world.update(dt, player.position(), takeDamage);

    // Out-of-combat regeneration, so healing never requires grinding.
    sinceDamage += dt;
    const max = profile.maxHealth();
    hudTimer += dt;
    if (sinceDamage > 6 && health < max) {
      health = Math.min(max, health + max * 0.02 * dt);
      if (hudTimer > 0.25) {
        hudTimer = 0;
        refreshStats();
      }
    }

    const boss = world.getBoss();
    const showBoss = !!(boss && boss.alive && boss.aggro);
    if (showBoss || bossShown) ui.setBoss(showBoss ? boss : null);
    bossShown = showBoss;
  }
  renderer.render(scene, camera);
}
requestAnimationFrame(animate);

// ---- Startup -------------------------------------------------------------------
ui.onStart = () => {
  started = true;
  ui.hideStart();
  player.enable();
  ui.toast(data.level > 1 || data.coins > 0 ? "WELCOME BACK, VOYAGER" : "WELCOME, VOYAGER · PRESS C FOR YOUR CHARACTER");
};

// Restore relic shrines that should already be visible in a returning player's world.
if (data.wisps >= 5 && !data.relics.includes("storm")) world.revealRelic("storm");
if (data.chartFound && !data.relics.includes("nature")) world.revealRelic("nature");
if (data.bossDefeated && !data.relics.includes("ember")) world.revealRelic("ember", world.bossHome);

ui.setRelic(data.activeRelic);
refreshStats();
refreshProfile();
refreshDiscoveries();

window.addEventListener("resize", () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
});
document.querySelector("#loading").hidden = true;
