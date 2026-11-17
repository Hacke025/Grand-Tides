// Main story quest chain. Stage lives in the save data so progress persists.
//
//   meet -> beacon -> return -> hunt -> slain -> done
//
// "hunt" starts the Captain's Grudge: defeat Captain Brinejaw, who holds the
// Ember Relic. If the boss is already dead when the hunt begins, it skips ahead.

export function createQuestSystem({ ui, profile, onReward }) {
  const data = profile.data;
  let stage = data.questStage || "meet";

  const quests = {
    meet: { title: "A Light in the Mist", text: "Find the old mariner near the harbor.", progress: 10, status: "MAIN STORY" },
    beacon: { title: "A Light in the Mist", text: "Follow the path inland and examine the ancient beacon.", progress: 30, status: "MAIN STORY" },
    return: { title: "A Light in the Mist", text: "Return to the old mariner and learn what the signal means.", progress: 50, status: "MAIN STORY" },
    hunt: { title: "The Captain's Grudge", text: "Find Captain Brinejaw's camp, marked by red banners, and defeat him.", progress: 65, status: "MAIN STORY · BOSS" },
    slain: { title: "The Captain's Grudge", text: "Brinejaw has fallen. Tell the old mariner, and claim the relic where he fell.", progress: 90, status: "MAIN STORY" },
    done: { title: "The Shattered Coast", text: "The coast is safe for now. Hunt for relics, wisps, and secrets, or train your strength.", progress: 100, status: "CHAPTER ONE COMPLETE" },
  };

  function update() {
    const q = quests[stage];
    ui.setQuest({ title: q.title, description: q.text, progress: q.progress, status: q.status });
  }

  function setStage(next) {
    if (next === "hunt" && data.bossDefeated) next = "slain";
    stage = next;
    data.questStage = stage;
    profile.save();
    update();
  }

  function talkToMariner() {
    if (stage === "meet")
      return { lines: ["You made it ashore. Not many ships have found this coast lately.", "There's an old beacon inland. It began shining again last night, after years of silence.", "Would you take a look? Follow the stone path. I'll be here when you return."], next: "beacon" };
    if (stage === "return")
      return {
        lines: ["So the beacon answered you. Then the old stories may be true after all.", "Take these coins. Consider them a welcome to the Shattered Coast.", "But the beacon's light drew more than you. Captain Brinejaw and his raiders have set up camp on the far side of the island, under red banners.", "He carries a relic of the old world. Until he's gone, no ship will dock safely here. Will you deal with him?"],
        next: "hunt",
        reward: { coins: 100, renown: 25, xp: 60, message: "BEACON MYSTERY SOLVED · +100 COINS · +25 RENOWN" },
      };
    if (stage === "hunt")
      return { lines: ["Brinejaw's camp is past the trees, under red banners. He is strong, and his slam shakes the ground. Watch for the red circle on the ground, and dash out of it with Gale Step.", "Train first if you must. Your strength grows from every discovery, not only from fighting."], next: stage };
    if (stage === "slain")
      return {
        lines: ["You did it. The sea air already feels lighter.", "That relic answers to those who earn it. Learn its power, and treat it with respect.", "Beyond this harbor are other islands, each with a story the sea tried to swallow. Your voyage is only beginning."],
        next: "done",
        reward: { coins: 150, renown: 40, xp: 120, message: "THE CAPTAIN'S GRUDGE COMPLETE · +150 COINS · +40 RENOWN" },
      };
    if (stage === "done") return { lines: ["The sea is wider than any map. There are more stories waiting beyond the horizon."], next: "done" };
    return { lines: ["The beacon is inland, just beyond the village path. Look for the pale stone tower."], next: stage };
  }

  function inspectBeacon() {
    if (stage === "beacon")
      return { lines: ["The crystal hums as you approach. A pattern of light ripples across its surface.", "For a moment, a map appears: scattered islands connected by currents of pale blue light.", "The beacon falls quiet again. The mariner should know what you found."], next: "return" };
    if (stage === "meet") return { lines: ["The beacon is quiet. Perhaps someone in the harbor knows its story."], next: stage };
    return { lines: ["The ancient crystal glows softly. Its secret has already been revealed to you."], next: stage };
  }

  function finishDialogue(result) {
    if (result.reward) {
      onReward?.(result.reward);
      ui.toast(result.reward.message);
    }
    if (result.next !== stage) setStage(result.next);
  }

  function bossDefeated() {
    data.bossDefeated = true;
    profile.save();
    if (stage === "hunt") setStage("slain");
  }

  update();
  return { talkToMariner, inspectBeacon, finishDialogue, bossDefeated };
}
