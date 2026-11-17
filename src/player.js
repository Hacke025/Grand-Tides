export function createPlayer(THREE,scene,camera,canvas){
 const group=new THREE.Group();scene.add(group);
 const bodyMat=new THREE.MeshStandardMaterial({color:0x315e73,roughness:.8}),skin=new THREE.MeshStandardMaterial({color:0xc99470}),dark=new THREE.MeshStandardMaterial({color:0x27323a});
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.75,4,8),bodyMat);torso.position.y=1.35;torso.castShadow=true;group.add(torso);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.34,12,10),skin);head.position.y=2.25;head.castShadow=true;group.add(head);
 const hair=new THREE.Mesh(new THREE.SphereGeometry(.36,10,8),dark);hair.scale.set(1, .48,1);hair.position.y=2.48;group.add(hair);
 const legs=[];for(const x of [-.19,.19]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.16,.55,3,6),dark);leg.position.set(x,.48,0);leg.castShadow=true;group.add(leg);legs.push(leg);}
 const shadow=new THREE.Mesh(new THREE.CircleGeometry(.65,20),new THREE.MeshBasicMaterial({color:0x071b20,transparent:true,opacity:.28}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.04;group.add(shadow);
 group.position.set(0,1.9,-24);
 let yaw=0,pitch=.22,vertical=0,grounded=true,dash=0,pulseCooldown=0,walk=0,enabled=false;
 let dragging=false,lastX=0,lastY=0;
 canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId);});
 canvas.addEventListener("pointerup",()=>dragging=false);
 canvas.addEventListener("pointercancel",()=>dragging=false);
 canvas.addEventListener("pointermove",e=>{if(!dragging||!enabled)return;yaw-=(e.clientX-lastX)*.004;pitch=Math.max(-.05,Math.min(.65,pitch+(e.clientY-lastY)*.003));lastX=e.clientX;lastY=e.clientY;});
 function position(){return group.position.clone();}
 function galeStep(){if(dash>0)return;dash=.24;const dir=new THREE.Vector3(Math.sin(yaw),0,Math.cos(yaw));group.position.addScaledVector(dir,-3.8);group.position.y=Math.max(1.9,group.position.y);}
 function update(dt,keys){
  if(!enabled)return;
  const forward=(keys.KeyW||keys.ArrowUp?1:0)-(keys.KeyS||keys.ArrowDown?1:0);
  const side=(keys.KeyD||keys.ArrowRight?1:0)-(keys.KeyA||keys.ArrowLeft?1:0);
  const direction=new THREE.Vector3(side,0,-forward);
  if(direction.lengthSq()>0){direction.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),yaw);const speed=keys.ShiftLeft||keys.ShiftRight?9:5.6;group.position.addScaledVector(direction,speed*dt);group.rotation.y=Math.atan2(direction.x,direction.z);walk+=dt*10;}
  legs[0].rotation.x=Math.sin(walk)*.45*(direction.lengthSq()>0?1:0);legs[1].rotation.x=-legs[0].rotation.x;
  if(keys.Space&&grounded){vertical=7;grounded=false;}
  vertical-=18*dt;group.position.y+=vertical*dt;if(group.position.y<1.9){group.position.y=1.9;vertical=0;grounded=true;}
  const radius=Math.hypot(group.position.x,group.position.z);if(radius>28){group.position.x*=28/radius;group.position.z*=28/radius;}
  if(dash>0)dash-=dt;
  const target=new THREE.Vector3(group.position.x+Math.sin(yaw)*10,group.position.y+5.1+pitch*4,group.position.z+Math.cos(yaw)*10);
  camera.position.lerp(target,1-Math.exp(-6*dt));camera.lookAt(group.position.x,group.position.y+1.35,group.position.z);
 }
 return {group,position,update,galeStep,enable:()=>{enabled=true;}};
}