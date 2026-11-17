export function createQuestSystem({ui,onReward}){
 let stage="meet";
 const descriptions={
  meet:"Find the old mariner near the harbor.",
  beacon:"Follow the path inland and examine the ancient beacon.",
  return:"Return to the old mariner and learn what the signal means.",
  done:"The coast has noticed your arrival. Your next chapter awaits."
 };
 function update(){ui.setQuest({title:"A Light in the Mist",description:descriptions[stage],progress:stage==="meet"?18:stage==="beacon"?58:stage==="return"?84:100,status:stage==="done"?"CHAPTER COMPLETE":"MAIN STORY"});}
 function talkToMariner(){
  if(stage==="meet")return {lines:["You made it ashore. Not many ships have found this coast lately.","There's an old beacon inland. It began shining again last night, after years of silence.","Would you take a look? Follow the stone path. I'll be here when you return."],next:"beacon"};
  if(stage==="return")return {lines:["So the beacon answered you. Then the old stories may be true after all.","Beyond this harbor are other islands, each with a story the sea tried to swallow.","Take these coins. Consider them a welcome to the Shattered Coast."],next:"done"};
  if(stage==="done")return {lines:["The sea is wider than any map. There are more stories waiting beyond the horizon."],next:"done"};
  return {lines:["The beacon is inland, just beyond the village path. Look for the pale stone tower."],next:stage};
 }
 function inspectBeacon(){
  if(stage==="beacon")return {lines:["The crystal hums as you approach. A pattern of light ripples across its surface.","For a moment, a map appears: scattered islands connected by currents of pale blue light.","The beacon falls quiet again. The mariner should know what you found."],next:"return"};
  if(stage==="meet")return {lines:["The beacon is quiet. Perhaps someone in the harbor knows its story."],next:stage};
  return {lines:["The ancient crystal glows softly. Its secret has already been revealed to you."],next:stage};
 }
 function finishDialogue(result){if(result.next!==stage){stage=result.next;update();if(stage==="done"){onReward?.();ui.toast("CHAPTER ONE COMPLETE · +100 COINS · +25 RENOWN");}}}
 update();return {talkToMariner,inspectBeacon,finishDialogue};
}