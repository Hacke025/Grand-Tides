export function createUI(){
 const $=id=>document.getElementById(id);let lines=[],lineIndex=0,doneCallback=null;const api={onStart:null,onDialogueNext:null};
 $("start-button").addEventListener("click",()=>api.onStart?.());$("dialogue-next").addEventListener("click",()=>api.onDialogueNext?.());
 api.hideStart=()=>$("start-screen").hidden=true;
 api.setQuest=({title,description,progress,status})=>{$("quest-title").textContent=title;$("quest-description").textContent=description;$("quest-progress").style.width=progress+"%";$("quest-status").textContent=status;};
 api.setInteraction=label=>{const el=$("interaction-prompt");el.hidden=!label;if(label)el.querySelector("span").textContent=label;};
 api.showDialogue=(speaker,role,arr,onDone)=>{lines=arr;lineIndex=0;doneCallback=onDone;$("speaker-name").textContent=speaker;$("speaker-role").textContent=role;$("dialogue").hidden=false;$("dialogue-text").textContent=lines[0]||"";};
 api.nextDialogue=()=>{lineIndex++;if(lineIndex<lines.length){$("dialogue-text").textContent=lines[lineIndex];return false;}$("dialogue").hidden=true;const cb=doneCallback;doneCallback=null;cb?.();return true;};
 api.toast=message=>{const el=$("toast");el.textContent=message;el.hidden=false;clearTimeout(api.toastTimer);api.toastTimer=setTimeout(()=>el.hidden=true,3000);};
 api.setStats=({coins,renown,health})=>{if(coins!==undefined)$("coin-value").textContent=coins;if(renown!==undefined)$("renown-value").textContent=renown;if(health!==undefined){$("health-value").textContent=health+" / 100";$("health-fill").style.width=health+"%";}};
 api.damageNumber=(amount,enemy=false)=>{const el=$("combat-feedback");el.textContent=enemy?"-"+amount:"-"+amount;el.style.color=enemy?"#ff9b83":"#fff1cb";el.hidden=false;el.style.animation="none";void el.offsetWidth;el.style.animation="damage-pop .75s ease-out forwards";};
 return api;
}