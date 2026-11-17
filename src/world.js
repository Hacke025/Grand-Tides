export function createWorld(THREE,scene){
 const mat=(color,roughness=.9)=>new THREE.MeshStandardMaterial({color,roughness});
 const sand=mat(0xd7c18c),grass=mat(0x668b5b),darkGrass=mat(0x456f50),wood=mat(0x79583c),roof=mat(0x754b3d),stone=mat(0x8c9b98),gold=mat(0xe6c27e),water=mat(0x267f9a,.35);
 const ocean=new THREE.Mesh(new THREE.PlaneGeometry(500,500),water);ocean.rotation.x=-Math.PI/2;ocean.position.y=-1.25;ocean.receiveShadow=true;scene.add(ocean);
 const island=new THREE.Group();scene.add(island);
 const shore=new THREE.Mesh(new THREE.CylinderGeometry(31,34,2.2,80),sand);shore.position.y=-.25;shore.receiveShadow=true;island.add(shore);
 const land=new THREE.Mesh(new THREE.CylinderGeometry(27,30,2.4,80),grass);land.position.y=.65;land.receiveShadow=true;island.add(land);
 const inner=new THREE.Mesh(new THREE.CylinderGeometry(19,25,.35,80),darkGrass);inner.position.y=1.88;island.add(inner);
 function box(parent,x,y,z,w,h,d,material){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function tree(x,z,s=1){const g=new THREE.Group();g.position.set(x,1.8,z);const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.22*s,.34*s,3.5*s,7),wood);trunk.position.y=1.7*s;trunk.rotation.z=-.12;trunk.castShadow=true;g.add(trunk);for(let i=0;i<5;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(1.45*s,.55*s,5),mat(i%2?0x4c8055:0x5f9660));leaf.position.set(Math.cos(i*1.25)*.75*s,3.5*s,Math.sin(i*1.25)*.75*s);leaf.rotation.z=Math.cos(i*1.25)*.6;leaf.rotation.x=Math.sin(i*1.25)*.5;leaf.castShadow=true;g.add(leaf);}scene.add(g);}
 // Harbor buildings
 function house(x,z,scale=1){const g=new THREE.Group();g.position.set(x,1.8,z);box(g,0,1.7,0,5*scale,3.4*scale,4*scale,mat(0xd2b98e));const r=new THREE.Mesh(new THREE.ConeGeometry(3.7*scale,2*scale,4),roof);r.position.y=4.3*scale;r.rotation.y=Math.PI/4;r.castShadow=true;g.add(r);box(g,0,.9,2.04*scale,.9*scale,1.8*scale,.1,wood);scene.add(g);}
 house(-9,-6,1);house(8,-9,.85);house(12,2,.7);
 // Dock extends into the water
 for(let i=0;i<9;i++)box(scene,0,-.45,-19-i*1.25,5,.45,1.1,wood);
 for(const x of [-2.2,2.2])for(const z of [-20,-29]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.16,.2,2.2,7),wood);post.position.set(x,-.05,z);post.castShadow=true;scene.add(post);}
 // Trees, rocks and a winding path
 [[-18,4],[-17,12],[-11,16],[16,12],[19,5],[17,-15],[-18,-13],[3,17],[-4,12]].forEach(([x,z],i)=>tree(x,z,.8+(i%3)*.12));
 for(let i=0;i<10;i++){const x=-3+i*.68,z=-15-i*.5;const p=new THREE.Mesh(new THREE.CylinderGeometry(.8,.9,.12,6),sand);p.position.set(x,1.85,z);p.rotation.y=i*.2;scene.add(p);}
 // Beacon landmark
 const beacon=new THREE.Group();beacon.position.set(0,2,-2);scene.add(beacon);
 const base=new THREE.Mesh(new THREE.CylinderGeometry(1.35,1.7,1.4,8),stone);base.position.y=.7;base.castShadow=true;beacon.add(base);
 const pillar=new THREE.Mesh(new THREE.CylinderGeometry(.5,.8,5,8),stone);pillar.position.y=3.5;pillar.castShadow=true;beacon.add(pillar);
 const crystal=new THREE.Mesh(new THREE.OctahedronGeometry(1.05),gold);crystal.position.y=6.6;crystal.castShadow=true;beacon.add(crystal);
 const glow=new THREE.PointLight(0xf4cf86,2,18);glow.position.y=6.5;beacon.add(glow);
 // Mariner NPC
 const npc=new THREE.Group();npc.position.set(-5,1.8,-16);scene.add(npc);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.48,.58,1.45,8),mat(0x426b78));body.position.y=1.05;body.castShadow=true;npc.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.42,12,10),mat(0xc99570));head.position.y=2.05;head.castShadow=true;npc.add(head);
 const hat=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.16,12),mat(0x4c4033));hat.position.y=2.48;npc.add(hat);
 const marker=new THREE.Mesh(new THREE.OctahedronGeometry(.22),gold);marker.position.y=3.1;npc.add(marker);
 const interactables=[{type:"mariner",label:"SPEAK TO THE OLD MARINER",object:npc},{type:"beacon",label:"EXAMINE THE ANCIENT BEACON",object:beacon}];
 // Soft clouds and distant island silhouettes
 for(let i=0;i<7;i++){const cloud=new THREE.Group();for(let j=0;j<4;j++){const puff=new THREE.Mesh(new THREE.SphereGeometry(2.2,10,8),new THREE.MeshBasicMaterial({color:0xeaf1e9,transparent:true,opacity:.18}));puff.position.set(j*2,Math.sin(j)*.5,0);cloud.add(puff);}cloud.position.set(-70+i*23,28+(i%3)*5,-65-(i%2)*25);scene.add(cloud);}
 const pulseRings=[];
 function tidePulse(position){const ring=new THREE.Mesh(new THREE.RingGeometry(.5,1,48),new THREE.MeshBasicMaterial({color:0x9de8e5,transparent:true,opacity:.8,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(position.x,.15,position.z);ring.userData.life=0;scene.add(ring);pulseRings.push(ring);marker.material=mat(0xffe6a4);}
 function update(dt){crystal.rotation.y+=dt*.6;marker.rotation.y+=dt*1.4;for(let i=pulseRings.length-1;i>=0;i--){const r=pulseRings[i];r.userData.life+=dt;r.scale.setScalar(1+r.userData.life*8);r.material.opacity=Math.max(0,.8-r.userData.life);if(r.userData.life>1){scene.remove(r);r.geometry.dispose();r.material.dispose();pulseRings.splice(i,1);}}}
 return {interactables,tidePulse,update};
}