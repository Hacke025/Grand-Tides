import * as THREE from "three";
import { createWorld } from "./world.js";
import { createPlayer } from "./player.js";
import { createQuestSystem } from "./quests.js";
import { createUI } from "./ui.js";

const canvas=document.querySelector("#world-canvas");
const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.shadowMap.enabled=true;
renderer.shadowMap.type=THREE.PCFSoftShadowMap;
renderer.outputColorSpace=THREE.SRGBColorSpace;
renderer.toneMapping=THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure=1.1;

const scene=new THREE.Scene();
scene.background=new THREE.Color(0x87b7c4);
scene.fog=new THREE.Fog(0x87b7c4,65,180);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,300);
const hemi=new THREE.HemisphereLight(0xc9e7ef,0x536c4a,2.0);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe4bd,2.6);sun.position.set(-35,55,25);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-60;sun.shadow.camera.right=60;sun.shadow.camera.top=60;sun.shadow.camera.bottom=-60;scene.add(sun);

const world=createWorld(THREE,scene);
const player=createPlayer(THREE,scene,camera,canvas);
const ui=createUI();
const quests=createQuestSystem({ui,onReward:()=>{ui.setStats({coins:100,renown:25});}});
let started=false,dialogueOpen=false,nearby=null,lastTime=0;
const keys={};
window.addEventListener("keydown",e=>{keys[e.code]=true;if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.code))e.preventDefault();if(!started)return;
 if(e.code==="KeyE"){if(dialogueOpen){advanceDialogue();}else if(nearby){interact(nearby);}}
 if(e.code==="KeyQ")player.galeStep();
 if(e.code==="KeyR")world.tidePulse(player.position());
});
window.addEventListener("keyup",e=>keys[e.code]=false);
function showDialogue(speaker,role,lines,onDone){dialogueOpen=true;ui.showDialogue(speaker,role,lines,onDone);}
function advanceDialogue(){const done=ui.nextDialogue();if(done)dialogueOpen=false;}
ui.onDialogueNext=advanceDialogue;
function interact(target){
 if(target.type==="mariner"){
  const result=quests.talkToMariner();
  showDialogue("Old Mariner","KEEPER OF THE HARBOR",result.lines,()=>{quests.finishDialogue(result);});
 }else if(target.type==="beacon"){
  const result=quests.inspectBeacon();
  showDialogue("Ancient Beacon","A STRANGE MECHANISM",result.lines,()=>{quests.finishDialogue(result);});
 }
}
function updateNearby(){
 const p=player.position();let nearest=null,dist=3.2;
 for(const target of world.interactables){const d=p.distanceTo(target.object.position);if(d<dist){nearest=target;dist=d;}}
 nearby=nearest;ui.setInteraction(nearest?nearest.label:null);
}
function animate(time){
 requestAnimationFrame(animate);
 const dt=Math.min((time-lastTime)/1000||0,.04);lastTime=time;
 if(started){player.update(dt,keys);updateNearby();world.update(dt);}
 renderer.render(scene,camera);
}
requestAnimationFrame(animate);
ui.onStart=()=>{started=true;ui.hideStart();player.enable();};
window.addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2));});
document.querySelector("#loading").hidden=true;