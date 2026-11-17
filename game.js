const $ = id => document.getElementById(id);
const islands = [
  {name:"Driftwood Harbor",desc:"A quiet port where new captains begin.",danger:1,unlock:1},
  {name:"Glass Reef",desc:"Bright waters hide dangerous rivals and lost cargo.",danger:2,unlock:1},
  {name:"Smuggler's Cove",desc:"A crooked hideaway full of rumors and risky deals.",danger:3,unlock:2},
  {name:"Storm Peak",desc:"A remote island battered by endless storms.",danger:4,unlock:3}
];
const fresh = () => ({level:1,xp:0,hp:30,maxHp:30,gold:12,renown:0,island:0,visits:0,log:["Your story begins at Driftwood Harbor."],battle:null});
let state;
try { state = JSON.parse(localStorage.getItem("grandTidesSave")) || fresh(); } catch { state = fresh(); }
const save = () => localStorage.setItem("grandTidesSave",JSON.stringify(state));
function journal(message){state.log.unshift(message);state.log=state.log.slice(0,9);$("journal").textContent=state.log.join("\n\n");save();}
function render(){
 $("level").textContent=state.level;$("health").textContent=state.hp+" / "+state.maxHp;$("gold").textContent=state.gold;$("renown").textContent=state.renown;
 const island=islands[state.island];$("island-name").textContent=island.name;$("island-description").textContent=island.desc;
 $("journal").textContent=state.log.join("\n\n");
 $("explore-button").disabled=!!state.battle;
 $("encounter").hidden=!state.battle && !$("encounter-title").textContent;
}
function showEncounter(title,description,actions){
 $("encounter").hidden=false;$("encounter-title").textContent=title;$("encounter-text").textContent=description;
 const area=$("encounter-actions");area.replaceChildren();
 actions.forEach(([label,fn])=>{const b=document.createElement("button");b.textContent=label;b.addEventListener("click",fn);area.append(b);});
}
function closeEncounter(){ $("encounter").hidden=true;$("encounter-title").textContent="";$("encounter-actions").replaceChildren(); }
function gainXP(amount){state.xp+=amount;while(state.xp>=state.level*25){state.xp-=state.level*25;state.level++;state.maxHp+=6;state.hp=state.maxHp;journal("LEVEL UP! You reached level "+state.level+". Your health and strength increased.");}}
function reward(){const gold=8+Math.floor(Math.random()*13);state.gold+=gold;state.renown+=5;journal("You secured "+gold+" gold and earned 5 renown.");gainXP(12);closeEncounter();render();}
function beginBattle(){
 const foe=["Rogue Deckhand","Reef Bandit","Cove Duelist","Storm Raider"][Math.min(state.island,3)];
 state.battle={foe,hp:12+state.island*7,max:12+state.island*7,guard:false};
 battleScreen();
}
function battleScreen(){
 const b=state.battle;if(!b)return;
 showEncounter("A "+b.foe+" challenges you!","Opponent health: "+b.hp+" / "+b.max+". Choose your move.",[
 ["Quick strike",()=>playerAttack(5+state.level*2)],
 ["Heavy blow",()=>playerAttack(9+state.level*2)],
 ["Guard",()=>{b.guard=true;journal("You brace yourself for the next attack.");enemyTurn();}],
 ...(state.level>=2?[["Captain's technique",()=>playerAttack(14+state.level*2)]]:[]),
 ["Retreat",()=>{state.battle=null;state.hp=Math.max(1,state.hp-3);journal("You escaped the encounter, losing a little health.");closeEncounter();render();}]
 ]);
 }
function playerAttack(damage){
 const b=state.battle;if(!b)return;b.hp-=damage;
 if(b.hp<=0){state.battle=null;journal("Victory! You defeated the "+b.foe+".");reward();return;}
 enemyTurn();
}
function enemyTurn(){
 const b=state.battle;if(!b)return;
 const damage=b.guard?2:4+state.island*2;b.guard=false;state.hp=Math.max(0,state.hp-damage);
 if(state.hp<=0){state.battle=null;state.hp=Math.ceil(state.maxHp*.6);state.gold=Math.max(0,state.gold-5);journal("Your crew brought you back to harbor. You recovered, but lost 5 gold.");closeEncounter();render();return;}
 battleScreen();$("encounter-text").textContent+=" The opponent countered for "+damage+" damage.";
}
function explore(){
 if(state.battle)return;
 state.visits++;const roll=Math.random();
 if(roll<.43)beginBattle();
 else if(roll<.73){const amount=10+Math.floor(Math.random()*18)+state.island*4;state.gold+=amount;state.renown+=2;journal("You discovered a hidden stash containing "+amount+" gold.");gainXP(7);showEncounter("Hidden treasure!","Your crew found a forgotten cache. You gained "+amount+" gold and a little experience.",[["Continue",()=>{closeEncounter();render();}]]);}
 else if(roll<.88){const heal=Math.min(state.maxHp-state.hp,8+state.island*2);state.hp+=heal;state.gold=Math.max(0,state.gold-0);journal("A traveling doctor helped your crew recover "+heal+" health.");showEncounter("A helpful stranger","A wandering medic offers assistance. Your crew recovered "+heal+" health.",[["Thank them",()=>{closeEncounter();render();}]]);}
 else {state.renown+=4;journal("You helped a local crew and earned 4 renown.");showEncounter("A local request","You helped repair a fishing boat. Word of your kindness is spreading.",[["Set sail",()=>{closeEncounter();render();}]]);}
 save();render();
}
function travel(index){
 const island=islands[index];if(state.level<island.unlock){showEncounter("Destination unavailable","You need to reach level "+island.unlock+" before attempting this voyage.",[["Understood",closeEncounter]]);return;}
 state.island=index;journal("You sailed to "+island.name+".");closeEncounter();render();
}
$("begin-button").addEventListener("click",()=>{$("game").hidden=false;$("begin-button").hidden=true;render();});
$("explore-button").addEventListener("click",explore);
$("reset-button").addEventListener("click",()=>{if(confirm("Start a completely new voyage? Your current local save will be replaced.")){state=fresh();closeEncounter();render();save();}});
const destinations=document.createElement("div");destinations.className="actions";destinations.style.marginTop="16px";
islands.forEach((island,i)=>{const button=document.createElement("button");button.textContent=island.name;button.addEventListener("click",()=>travel(i));destinations.append(button);});
$("game").insertBefore(destinations,$("encounter"));
if(state.log.length>1||state.visits>0){$("game").hidden=false;$("begin-button").hidden=true;}
render();