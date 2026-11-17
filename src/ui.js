export function createUI(){
 const $=id=>document.getElementById(id);
 let lines=[],lineIndex=0,doneCallback=null;
 const api={};
 api.onStart=null;api.onDialogueNext=null;
 $("start-button").addEventListener("click",()=>api.onStart?.());
 $("dialogue-next").addEventListener("click",()=>api.onDialogueNext?.());
 api.hideStart=()=>$("start-screen").hidden=true;
 api.setQuest=({title,description,progress,status})=>{$("quest-title").textContent=title;$("quest-description").textContent=description;$("quest-progress").style.width=progress+"%";$("quest-status").textContent=status;};
 api.setInteraction=label=>{const el=$("interaction-prompt");el.hidden=!label;if(label)el.querySelector("span").textContent=label;};
 api.showDialogue=(speaker,role,dialogueLines,onDone)=>{lines=dialogueLines;lineIndex=0;doneCallback=onDone;$("speaker-name").textContent=speaker;$("speaker-role").textContent=role;$("dialogue").hidden=false;$("dialogue-text").textContent=lines[0]||"";};
 api.nextDialogue=()=>{lineIndex++;if(lineIndex<lines.length){$("dialogue-text").textContent=lines[lineIndex];return false;}$("dialogue").hidden=true;const callback=doneCallback;doneCallback=null;callback?.();return true;};
 api.toast=message=>{const el=$("toast");el.textContent=message;el.hidden=false;clearTimeout(api.toastTimer);api.toastTimer=setTimeout(()=>el.hidden=true,3800);};
 api.setStats=({coins,renown})=>{if(coins!==undefined)$("coin-value").textContent=coins;if(renown!==undefined)$("renown-value").textContent=renown;};
 return api;
}