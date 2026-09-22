export function createGym(c){
const {THREE,island,robot,arms,legs,box,cyl,mat,obstacles,interactables}=c;
const metal=mat('#526767'),pad=mat('#394e4e'),mint=mat('#9eafa3'),peach=mat('#d9a88b');
box(1.3,.18,2.25,.06,metal,island,5,.37,1.8);box(1.03,.035,1.9,.02,pad,island,5,.48,1.8);
for(const x of [4.43,5.57]){box(.07,1.1,.07,.02,metal,island,x,.98,.95);box(.07,.07,1.15,.02,metal,island,x,1.46,1.48);}
box(1.2,.32,.18,.04,metal,island,5,1.58,.9);box(.5,.19,.025,.01,mint,island,5,1.59,1.005);
const stripes=[];for(let i=0;i<5;i++)stripes.push(box(.96,.01,.035,.005,mint,island,5,.505,1+i*.36));
box(1.3,.55,.6,.06,metal,island,7.55,.55,1.2);
function dumbbell(parent,x,y,z){const g=new THREE.Group();parent.add(g);g.position.set(x,y,z);box(.5,.055,.055,.015,metal,g);for(const a of [-.23,.23])box(.13,.24,.24,.025,pad,g,a);return g;}
dumbbell(island,7.3,.94,1.2);dumbbell(island,7.85,.94,1.2);
box(1.65,.045,2.15,.09,peach,island,6.6,.3,4.75);
for(const z of [3.8,5.7])box(1.4,.008,.018,.005,mint,island,6.6,.326,z);
const weights=arms.map(a=>dumbbell(a,0,-.48,0));weights.forEach(w=>w.visible=false);
const defs={run:{label:'러닝머신 달리기',x:5,z:3.3,duration:10,gain:-8},lift:{label:'덤벨 운동',x:7.55,z:2.25,duration:8,gain:-5},stretch:{label:'매트 스트레칭',x:6.6,z:4.75,duration:8,gain:10}};
for(const [id,d]of Object.entries(defs)){Object.assign(d,{room:'gym',need:'energy',text:d.label+' 시작! 하나, 둘!',done:'운동 끝! 몸이 한결 가벼워졌어.'});const p=box(id==='stretch'?1.7:1.4,1.5,id==='run'?2.3:1,.02,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),island,d.x,.9,id==='run'?1.8:id==='lift'?1.2:d.z);p.userData={room:'gym',choices:[id]};p.castShadow=false;p.receiveShadow=false;interactables.push(p);}
obstacles.push({x:5,z:1.8,w:1.3,d:2.25},{x:7.55,z:1.2,w:1.3,d:.6});
return {defs,begin(id){if(id==='run'){robot.position.set(5,.53,1.9);robot.rotation.y=Math.PI;}if(id==='lift')robot.rotation.y=Math.PI;},reset(){weights.forEach(w=>w.visible=false);},tick(id,t){weights.forEach(w=>w.visible=id==='lift');if(id==='run'){robot.position.y=.53+Math.abs(Math.sin(t*10))*.06;arms.forEach((a,i)=>a.rotation.x=Math.sin(t*10+i*Math.PI)*.7);legs.forEach((l,i)=>l.rotation.x=Math.sin(t*10+i*Math.PI)*.7);stripes.forEach((s,i)=>s.position.z=.92+((t*1.7+i*.36)%1.78));}if(id==='lift')arms.forEach(a=>a.rotation.x=-.4-(Math.sin(t*3)+1)*.65);if(id==='stretch'){arms.forEach((a,i)=>a.rotation.z=(i?1:-1)*1.5);robot.rotation.z=Math.sin(t*2)*.22;}}};
}
