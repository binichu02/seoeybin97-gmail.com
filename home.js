import { OrbitControls } from './vendor/OrbitControls.js';
import { findPath, isWalkable } from './navigation.js';
import { createInteractions } from './interactions.js';
import { createSpatialControls } from './spatial-controls.js';

export function createHome(ctx){
const {THREE,scene,camera,renderer,root,bubble,island,robot,head,arms,legs,eyes,orange,mat,box,ball,cyl,mesh,plant,cream,dark,eyeMat}=ctx;
const wood=mat('#c8986c'),white=mat('#f7f3e9'),sage=mat('#98b397'),rose=mat('#dba895'),blue=mat('#a1c7cd'),wall=mat('#eae3d4');
const obstacles=[],interactables=[],stations={},roomLabels=[];
const addObstacle=(x,z,w,d)=>obstacles.push({x,z,w,d});
function solid(w,h,d,m,x,y,z,r=.06){const o=box(w,h,d,r,m,island,x,y,z);addObstacle(x,z,w,d);return o;}
box(18.5,.4,13.5,.18,mat('#c6c8b5'),island,0,-.08,.5);
box(18,.08,13,.02,mat('#e3d6bc'),island,0,.17,.5);
// Three open-front rooms. Doorways connect every room to the main living space.
box(6,.04,6,.01,mat('#e9c7b3'),island,-6,.23,-3);
box(6,.04,6,.01,mat('#e5d9b5'),island,0,.23,-3);
box(6,.04,6,.01,mat('#c1d8d2'),island,6,.23,-3);
box(6,.05,6.7,.02,mat('#b7c8a1'),island,6,.23,3.55);
for(let x=-9;x<3;x+=.6)box(.018,.015,6.7,.003,mat('#c9b998'),island,x,.222,3.5);
for(let x=3.1;x<9;x+=.6)for(let z=-5.9;z<0;z+=.6)box(.57,.012,.57,.006,mat((Math.round(x*10)+Math.round(z*10))%12?'#d2e1dc':'#e9eee3'),island,x,.26,z);
solid(18.2,2.7,.18,wall,0,1.56,-6.1);
solid(.18,1.35,6.1,wall,-9.1,.91,-3.05);solid(.18,1.35,6.1,wall,9.1,.91,-3.05);
for(const x of [-3,3])solid(.16,1.55,6,wall,x,1.02,-3);
for(const [x,w]of[[-8.1,1.8],[-3.2,4],[2.8,3.2],[7.8,2.4]])solid(w,.7,.16,wall,x,.6,0);
// Window frames, views, and shelves on the rear wall.
for(const x of [-6,0,6]){box(2.4,1.55,.12,.05,white,island,x,1.94,-5.96);box(2.15,1.3,.06,.02,mat('#b5d3d0'),island,x,1.94,-5.87);box(.055,1.35,.08,.01,white,island,x,1.94,-5.8);box(2.2,.055,.08,.01,white,island,x,1.94,-5.8);box(2.6,.1,.36,.02,wood,island,x,1.2,-5.7);}
// Bedroom: full bed, blanket, pillows, bedside cabinet, lamp, wardrobe.
solid(2.25,.4,3,wood,-6,.48,-4.05);box(2.14,.28,2.9,.15,white,island,-6,.8,-4.05);
box(2.2,.16,1.8,.08,sage,island,-6,.97,-3.62);box(2.32,.9,.16,.07,wood,island,-6,.92,-5.56);
for(const x of [-6.53,-5.47])box(.86,.16,.58,.12,cream,island,x,.98,-5.04);
solid(.8,.64,.75,wood,-7.8,.56,-4.9);cyl(.21,.26,.06,cream,island,-7.8,.92,-4.9);cyl(.035,.035,.42,dark,island,-7.8,1.12,-4.9);cyl(.24,.34,.36,mat('#f3dbaa'),island,-7.8,1.47,-4.9);
addObstacle(-8.35,-2,.92,1.65);
// Kitchen: cabinet fronts, countertop, cooker, pot, sink, fridge and island.
solid(4.4,.95,1.2,sage,-.5,.72,-4.95);box(4.6,.14,1.35,.04,cream,island,-.5,1.25,-4.95);
for(const x of [-2,-1,0,1]){box(.86,.78,.03,.04,mat('#a9ba9c'),island,x,.76,-4.33);box(.3,.035,.04,.01,dark,island,x,1.04,-4.28);}
box(1.2,.035,.9,.03,dark,island,-.2,1.34,-4.94);for(const x of [-.52,.14])for(const z of [-5.16,-4.74]){const r=mesh(new THREE.TorusGeometry(.16,.023,8,24),mat('#8d9791'),island,x,1.37,z);r.rotation.x=Math.PI/2;}
const pot=cyl(.24,.22,.26,mat('#cb7957'),island,-.2,1.49,-4.75);cyl(.2,.2,.015,mat('#e4bd71'),island,-.2,1.625,-4.75);box(.2,.045,.065,.02,dark,island,.1,1.56,-4.75);
addObstacle(2.22,-4.9,.96,1.24);
box(.8,.04,.65,.09,mat('#647c76'),island,-1.8,1.34,-4.95);box(.63,.035,.49,.08,blue,island,-1.8,1.36,-4.95);cyl(.035,.035,.42,mat('#afbab6',.2,.7),island,-1.8,1.55,-5.25);
solid(1.5,.8,.75,wood,.8,.65,-1.3);box(1.6,.09,.82,.03,cream,island,.8,1.09,-1.3);ball(.12,mat('#d18a57'),island,.65,1.25,-1.3);ball(.12,mat('#aab977'),island,.95,1.25,-1.3);
// Bathroom: vanity, reflective mirror, toilet and shower.
solid(1.35,.88,1.12,wood,4.55,.69,-4.8);box(1.45,.16,1.2,.06,white,island,4.55,1.2,-4.8);const basin=ball(.42,blue,island,4.55,1.28,-4.75);basin.scale.set(1,.12,.8);cyl(.035,.035,.5,mat('#a9b8b5',.18,.8),island,4.55,1.48,-5.1);box(.07,.07,.3,.03,white,island,4.55,1.72,-4.96);
box(1.35,1.05,.1,.14,white,island,4.55,2.1,-5.92);box(1.17,.87,.04,.11,mat('#aec7c6',.15,.5),island,4.55,2.1,-5.84);
solid(.95,.6,1.45,white,7.4,.54,-4.9,.2);box(.88,.85,.38,.09,white,island,7.4,.83,-5.42);const seat=mesh(new THREE.TorusGeometry(.31,.085,12,40),cream,island,7.4,.9,-4.55);seat.rotation.x=Math.PI/2;seat.scale.y=1.2;cyl(.2,.2,.03,mat('#9cb6b2'),island,7.4,.78,-4.55);
box(1.7,.12,1.75,.09,white,island,7.75,.32,-1.6);const glass=mat('#b5d7d3',.16);glass.transparent=true;glass.opacity=.25;box(.055,1.8,1.8,.01,glass,island,8.6,1.27,-1.6);cyl(.035,.035,2,white,island,8.45,1.35,-2.35);const shower=cyl(.22,.22,.055,white,island,8.22,2.38,-2.35);box(.45,.05,.05,.015,white,island,8.23,2.38,-2.35);
// Sofa faces the television across a clear aisle and a low coffee table.
solid(3.3,.7,1.35,rose,-5.7,.61,5.5,.18);box(3.3,.95,.3,.13,rose,island,-5.7,1.04,6.04);for(const x of [-7.2,-4.2])box(.32,.77,1.32,.14,rose,island,x,.98,5.5);for(const x of [-6.5,-5.5,-4.7])box(.75,.16,.91,.09,mat('#e6bead'),island,x,1.01,5.4);
box(5.5,.035,5.9,.1,mat('#e8dfc9'),island,-5.5,.27,3.6);solid(1.8,.5,.85,wood,-5.7,.55,3.3,.17);box(.52,.06,.36,.01,sage,island,-5.6,.86,3.2);cyl(.11,.09,.15,white,island,-6.2,.92,3.3);
solid(2.6,.7,.65,wood,-5.7,.59,1.6);box(2.5,1.4,.13,.05,dark,island,-5.7,1.6,1.58);
const tvScreen=box(2.3,1.2,.035,.035,mat('#182d2b'),island,-5.7,1.6,1.68);
for(let i=0;i<4;i++){plant(4+i*1.2,5.5,.8+(i%2)*.2);addObstacle(4+i*1.2,5.5,.6,.6);}
plant(8,1.2,1.5);addObstacle(8,1.2,.8,.8);plant(-8,5.8,1.25);addObstacle(-8,5.8,.8,.8);
for(const z of [1.3,2.35,3.4,4.45])box(1,.04,.62,.12,mat('#e4e4d0'),island,4.1,.29,z);
cyl(.9,.9,.09,wood,island,6.6,.93,2.8);solid(.18,.7,.18,wood,6.6,.58,2.8);for(const x of [5.2,8]){solid(.62,.54,.62,white,x,.5,2.8,.12);}
addObstacle(6.6,2.8,1.8,1.8);
const wateringCan=new THREE.Group();island.add(wateringCan);wateringCan.position.set(6.5,.29,5.1);cyl(.2,.23,.32,mat('#d6ab64'),wateringCan,0,.17);const spout=box(.08,.08,.47,.03,mat('#d6ab64'),wateringCan,0,.27,-.3);spout.rotation.x=.5;
// Labels are scene objects so they remain attached while the camera rotates.
function label(text,x,z){const c=document.createElement('canvas');c.width=512;c.height=96;const g=c.getContext('2d');g.font='500 33px sans-serif';g.fillStyle='#536557';g.textAlign='center';g.fillText(text,256,58);const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthTest:true,depthWrite:false,transparent:true}));sprite.position.set(x,.5,z);sprite.scale.set(3.3,.62,1);island.add(sprite);roomLabels.push(sprite);}
label('01  BEDROOM',-6,-.6);label('02  KITCHEN',0,-.6);label('03  BATHROOM',6,-.6);label('04  LIVING ROOM',-4.5,6.6);label('05  GARDEN',6.1,6.6);
const roomData={living:{name:'LIVING ROOM / 거실',title:'느긋하게, 나답게.',description:'소파에서 책을 읽거나 신나게 춤춰보세요.',x:-2,z:2,actions:['read','dance']},bedroom:{name:'BEDROOM / 침실',title:'충전이 필요한 순간.',description:'폭신한 침대에서 푹 쉬면 에너지가 차올라요.',x:-6.2,z:-1.4,actions:['sleep']},kitchen:{name:'KITCHEN / 주방',title:'오늘의 작은 요리사.',description:'따뜻한 한 끼를 만들고 맛있게 먹어요.',x:0,z:-2.7,actions:['cook']},bathroom:{name:'BATHROOM / 화장실',title:'뽀송뽀송, 새 기분.',description:'손을 씻거나 샤워하고 개운하게 시작해요.',x:5.5,z:-1.7,actions:['wash','shower','toilet']},garden:{name:'GARDEN / 정원',title:'초록빛 쉬는 시간.',description:'작은 식물들에게 물과 관심을 주세요.',x:5.5,z:4.2,actions:['water']}};
const defs={
sleep:{label:'잠자기',icon:'☾',x:-6,z:-2.02,duration:9,room:'bedroom',text:'포근하다… 잠깐 충전할게. Z z z',done:'푹 잤어! 다시 신나게 놀자.',need:'energy',gain:35},
cook:{label:'요리하고 먹기',icon:'♨',x:-.2,z:-3.6,duration:8,room:'kitchen',text:'보글보글! 오늘은 따뜻한 수프야.',done:'잘 먹었습니다! 배가 든든해.',need:'food',gain:35},
wash:{label:'손 씻기',icon:'◌',x:4.55,z:-3.52,duration:5,room:'bathroom',text:'구석구석, 손을 깨끗하게!',done:'손이 반짝반짝! 기분도 산뜻해.',need:'clean',gain:18},
shower:{label:'샤워하기',icon:'☂',x:7.65,z:-1.55,duration:7,room:'bathroom',text:'따뜻한 물로 오늘의 먼지를 씻어내자.',done:'뽀송뽀송! 새 로봇이 된 것 같아.',need:'clean',gain:40},
toilet:{label:'화장실 쓰기',icon:'◉',x:7.4,z:-3.52,duration:5,room:'bathroom',text:'잠깐만 기다려줘! 금방 다녀올게.',done:'개운해! 손도 씻고 가자.',need:'clean',gain:-8},
read:{label:'책 읽기',icon:'▤',x:-5.7,z:4.2,duration:8,room:'living',text:'책 속에서는 어디든 갈 수 있어.',done:'새로운 이야기를 하나 배웠어!',need:'energy',gain:12},
water:{label:'물 주기',icon:'♧',x:6.2,z:4.45,duration:6,room:'garden',text:'쑥쑥 자라렴! 내일 또 만나자.',done:'식물들도 기분이 좋아 보여 🌱',need:'energy',gain:8},
dance:{label:'춤추기',icon:'♫',x:-2,z:2,duration:5,room:'living',text:'우리 집 댄스 파티에 온 걸 환영해!',done:'함께 노니까 더 즐겁다!',need:'energy',gain:-5}};
const interactions=createInteractions({...ctx,white,wood,sage,tvScreen,interactables,obstacles});
Object.assign(defs,interactions.defs);Object.entries(interactions.roomActions).forEach(([room,actions])=>roomData[room].actions=actions);
const stationPoints=new Set();
for(const [id,d] of Object.entries(defs)){const key=d.x+','+d.z;if(stationPoints.has(key)||!roomData[d.room].actions.includes(id))continue;stationPoints.add(key);const marker=cyl(.28,.28,.015,mat('#f3dca3'),island,d.x,.3,d.z);marker.userData.activity=id;interactables.push(marker);stations[id]=marker;}
// Shared scene effects are enabled only during the matching activity.
const particles=[];for(let i=0;i<18;i++){const p=ball(.045,mat('#c4e9e7',.2),island);p.visible=false;particles.push(p);}
const book=new THREE.Group();robot.add(book);book.position.set(0,1.15,.65);book.rotation.x=-.5;box(.72,.045,.48,.015,mat('#809e80'),book);box(.64,.06,.4,.01,cream,book,0,.045,0);box(.012,.065,.4,.001,wood,book,0,.05,0);book.visible=false;
const bowl=new THREE.Group();robot.add(bowl);bowl.position.set(0,1.5,.8);cyl(.3,.18,.23,cream,bowl);cyl(.25,.25,.012,mat('#e2b26c'),bowl,0,.12,0);bowl.visible=false;
const heldCan=new THREE.Group();robot.add(heldCan);heldCan.position.set(.3,1,.65);cyl(.24,.25,.4,mat('#d6ab64'),heldCan);box(.1,.1,.6,.04,mat('#d6ab64'),heldCan,0,.12,.38);heldCan.rotation.x=-.3;heldCan.visible=false;
robot.scale.setScalar(.62);robot.position.set(-2,.28,2);
const controls=new OrbitControls(camera,renderer.domElement);controls.enablePan=false;controls.minPolarAngle=.25;controls.maxPolarAngle=1.32;controls.minDistance=9;controls.maxDistance=100;controls.enableDamping=true;controls.dampingFactor=.08;controls.target.set(0,0,.4);controls.mouseButtons={LEFT:THREE.MOUSE.ROTATE,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.ROTATE};
let follow=false,overview=true,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,selectedRoom='living',activeRoom='living',path=[],pending=null,activity=null,elapsed=0,t=0,waveUntil=0,lastUi=-1,uiKey='',sound=false,audio,colorIndex=0;
let queued=[],routineTotal=0,inspecting=false;
const keys=new Set(),clock=new THREE.Clock(),needs={energy:76,food:65,clean:82};
function resize(){const w=root.clientWidth,h=root.clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.clearViewOffset();camera.zoom=1;camera.updateProjectionMatrix();if(overview){camera.position.set(16,20,23).multiplyScalar(Math.max(1,1.3/camera.aspect));controls.target.set(0,0,.4);}controls.update();}resize();addEventListener('resize',resize);new ResizeObserver(resize).observe(root);
function speak(text){bubble.textContent=text;}
function chime(){if(!sound)return;audio??=new AudioContext();audio.resume();[523,659,784].forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain(),at=audio.currentTime+i*.12;o.frequency.value=f;g.gain.setValueAtTime(.035,at);g.gain.exponentialRampToValueAtTime(.001,at+.35);o.connect(g);g.connect(audio.destination);o.start(at);o.stop(at+.4);});}
function resetPose(){interactions.reset();if(activity&&activity.restore){robot.position.copy(activity.restore);}robot.rotation.x=0;robot.rotation.z=0;robot.position.y=.28;book.visible=false;bowl.visible=false;heldCan.visible=false;wateringCan.visible=true;particles.forEach(p=>p.visible=false);}
function cancel(silent=false,clearQueue=true){if(clearQueue){queued=[];routineTotal=0;}const had=activity||pending||path.length;resetPose();activity=null;pending=null;path=[];elapsed=0;document.querySelector('#activity-progress').hidden=true;if(had&&!silent)speak('좋아, 다른 걸 해보자!');}
function walkTo(x,z,then=null,chain=false){cancel(true,!chain);inspecting=false;path=findPath(robot.position,{x,z},obstacles);pending=then;if(!path.length){speak('그쪽으로는 갈 수 없어. 다른 바닥을 눌러줘.');pending=null;queued=[];return;}if(paused){paused=false;motionUI();}speak(then?`${defs[then].label} 하러 가는 중이야!`:'좋아, 같이 걸어가자.');}
function begin(id){const d=defs[id];activity={id,restore:robot.position.clone()};elapsed=0;waveUntil=0;robot.rotation.y=['cook','wash','water'].includes(id)?Math.PI:0;if(id==='sleep'){robot.position.set(-6,1.12,-3.15);robot.rotation.x=-Math.PI/2;}if(id==='read')robot.position.set(-5.7,.73,5.4);if(id==='toilet')robot.position.set(7.4,.57,-4.48);book.visible=id==='read';interactions.begin(id);speak((routineTotal>1?`${routineTotal-queued.length}/${routineTotal} · `:'')+d.text);chime();document.querySelector('#activity-progress').hidden=false;document.querySelector('#activity-state').textContent=`${d.label} 중`;}
function runNext(){const next=queued.shift();if(next)walkTo(defs[next].x,defs[next].z,next,true);}
function perform(id){if(id.startsWith('take')&&interactions.state.fridge&&Math.hypot(robot.position.x-defs[id].x,robot.position.z-defs[id].z)<1.5){cancel(true);if(paused){paused=false;motionUI();}begin(id);interactions.finish(id);activity.committed=true;speak(defs[id].done);return;}if(id.startsWith('take')&&(activity?.id.startsWith('take')||pending?.startsWith('take'))){queued.push(id);routineTotal++;speak(`${defs[id].label}도 이어서 꺼낼게.`);return;}const reason=interactions.can(id);if(reason){speak(reason);return;}cancel(true);queued=interactions.sequence(id);routineTotal=queued.length;runNext();setDrawer(false);}
const drawer=document.querySelector('#action-drawer'),drawerToggle=document.querySelector('#toggle-actions');
function setDrawer(open){drawer.hidden=!open;drawerToggle.setAttribute('aria-expanded',open);drawerToggle.textContent=open?'메뉴 접기':'전체 행동';if(!open&&drawer.contains(document.activeElement))drawerToggle.focus();}
drawerToggle.onclick=()=>setDrawer(drawer.hidden);
function setPanel(room,choices=null){inspecting=!!choices;selectedRoom=room;const r=roomData[room];document.querySelector('#room-name').textContent=r.name;document.querySelector('#activity-title').textContent=r.title;document.querySelector('#activity-description').textContent=r.description;document.querySelector('#activities').replaceChildren(...(choices||r.actions).map(id=>{const b=document.createElement('button');b.textContent=defs[id].label;b.dataset.action=id;b.onclick=()=>perform(id);return b;}));document.querySelectorAll('[data-room]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.room===room));}
setPanel('living');document.querySelectorAll('[data-room]').forEach(b=>b.onclick=()=>{const r=roomData[b.dataset.room];walkTo(r.x,r.z);setPanel(b.dataset.room);speak(`${r.name.split(' / ')[1]}으로 가볼까?`);});
document.querySelector('#cancel-action').onclick=()=>cancel();document.querySelector('#stop-routine').onclick=()=>cancel();
function currentRoom(){const {x,z}=robot.position;return z<0?(x<-3?'bedroom':x>3?'bathroom':'kitchen'):x>3?'garden':'living';}
const raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();let down=null;
root.addEventListener('pointerdown',e=>{root.focus({preventScroll:true});down={x:e.clientX,y:e.clientY};});root.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down.x,e.clientY-down.y)>7)return;down=null;const r=root.getBoundingClientRect();pointer.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects(interactables,false)[0];if(hit){const data=hit.object.userData;if(data.choices){setDrawer(false);spatial.openForObject(hit.object);speak('가까이 가서 스페이스바를 누르거나 가구 옆 버튼을 눌러줘.');}else{perform(data.activity);setPanel(defs[data.activity].room);}return;}if(raycaster.intersectObject(robot,true).length){wave();return;}const p=new THREE.Vector3();if(raycaster.ray.intersectPlane(new THREE.Plane(new THREE.Vector3(0,1,0),-.28),p)){if(isWalkable(p.x,p.z,obstacles))walkTo(p.x,p.z);else speak('가구가 있는 곳이야. 빈 바닥을 눌러줘!');}});
function wave(){if(activity)cancel(true);waveUntil=t+3;speak('안녕! 우리 집 구경할래? 👋');chime();}
document.querySelector('#wave').onclick=wave;document.querySelector('#dance').onclick=()=>perform('dance');document.querySelector('#color').onclick=()=>{colorIndex=(colorIndex+1)%3;orange.color.set(['#ee895b','#9fbba0','#92afc7'][colorIndex]);speak('새로운 색, 새로운 기분!');};
document.querySelector('#sound').onclick=e=>{sound=!sound;e.currentTarget.innerHTML=`<span>♪</span>소리 ${sound?'켬':'끔'}`;e.currentTarget.setAttribute('aria-pressed',sound);e.currentTarget.setAttribute('aria-label',sound?'소리 끄기':'소리 켜기');chime();};
const motion=document.querySelector('#motion');function motionUI(){motion.textContent=paused?'▶':'Ⅱ';motion.setAttribute('aria-pressed',paused);motion.setAttribute('aria-label',paused?'애니메이션 재생':'애니메이션 일시 정지');}motionUI();motion.onclick=()=>{paused=!paused;motionUI();};
function setFollow(v){follow=v;document.querySelector('#follow').setAttribute('aria-pressed',v);}
document.querySelector('#overview').onclick=()=>{overview=true;setFollow(false);resize();};document.querySelector('#follow').onclick=()=>{setFollow(!follow);overview=false;if(follow){controls.target.copy(robot.position);camera.position.copy(robot.position).add(new THREE.Vector3(8,10,12));controls.update();}};
function zoom(f){overview=false;const offset=camera.position.clone().sub(controls.target);offset.setLength(THREE.MathUtils.clamp(offset.length()*f,controls.minDistance,controls.maxDistance));camera.position.copy(controls.target).add(offset);controls.update();}
document.querySelector('#zoom-in').onclick=()=>zoom(.8);document.querySelector('#zoom-out').onclick=()=>zoom(1.25);controls.addEventListener('start',()=>overview=false);
const spatial=createSpatialControls({THREE,root,camera,robot,objects:interactables,defs,state:interactions.state,perform,cancel:()=>cancel(),approach:(x,z)=>walkTo(x,z),getActivity:()=>activity?.id,getInventory:()=>interactions.inventory(),quick:id=>{cancel(true);if(paused){paused=false;motionUI();}interactions.begin(id);interactions.finish(id);interactions.reset();speak(defs[id].done);}});
const dialog=document.querySelector('#dialog');const panels={about:['모모의 집에 온 걸 환영해요.','모모는 호기심 많은 작은 로봇이에요.\n침실에서 충전하고, 주방에서 요리하고, 정원에서 식물을 돌봐요. 원하는 방으로 함께 걸어가 모모의 하루를 만들어주세요.'],world:['방마다 다른 작은 즐거움','침실 · 잠자며 에너지 충전\n주방 · 요리하고 먹기\n화장실 · 손 씻기, 샤워, 화장실 쓰기\n거실 · 책 읽기, 춤추기\n정원 · 식물에 물 주기'],help:['모모와 함께 사는 방법','빈 바닥 클릭 / 터치 · 그곳으로 걸어가기\n드래그 · 집 둘러보기\n휠 / ＋ − · 확대와 축소\n방 이름 · 해당 방으로 이동\nW A S D / 방향키 · 직접 이동\n가구 클릭 · 앞으로 걸어가기\nSpace / E · 가까운 가구 조작\n가구 옆 선택지 · 세부 행동 / 재료 선택\n모모 따라가기 · 가까이에서 함께 걷기\n그만하기 / Esc · 행동 취소\nⅡ · 움직임 잠시 멈추기']};
document.querySelectorAll('[data-panel]').forEach(b=>b.onclick=()=>{const [title,copy]=panels[b.dataset.panel];document.querySelector('#dialog-title').textContent=title;document.querySelector('#dialog-copy').textContent=copy;keys.clear();dialog.showModal();});document.querySelectorAll('.close,.close-bottom').forEach(b=>b.onclick=()=>dialog.close());
addEventListener('keydown',e=>{if(dialog.open||/INPUT|TEXTAREA/.test(document.activeElement.tagName))return;const k=e.key.toLowerCase();if(k==='escape'){cancel();spatial.dismiss();return;}if(e.code==='Space'||k==='e'){if(e.target.closest?.('button')&&!e.target.closest?.('#world-actions'))return;e.preventDefault();if(!e.repeat){if(!spatial.activate())speak('가구에 조금 더 가까이 가줘.');}return;}if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright'].includes(k)){e.preventDefault();if(!keys.size)cancel(true);keys.add(k);}});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());
const targetMarker=mesh(new THREE.TorusGeometry(.26,.027,8,32),mat('#df9963'),island);targetMarker.rotation.x=Math.PI/2;targetMarker.visible=false;
function advance(dx,dz,dt){const n=Math.hypot(dx,dz);if(n<.001)return false;dx=dx/n*dt*2.6;dz=dz/n*dt*2.6;const old=robot.position.clone();if(isWalkable(robot.position.x+dx,robot.position.z,obstacles))robot.position.x+=dx;if(isWalkable(robot.position.x,robot.position.z+dz,obstacles))robot.position.z+=dz;robot.rotation.y=Math.atan2(dx,dz);return old.distanceTo(robot.position)>.001;}
function render(){requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.05);let moving=false;
if(!paused&&!document.hidden&&!dialog.open){t+=dt;
if(keys.size){let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dz=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);const forward=camera.getWorldDirection(new THREE.Vector3());forward.y=0;forward.normalize();const right=new THREE.Vector3(-forward.z,0,forward.x);const dir=right.multiplyScalar(dx).addScaledVector(forward,-dz);moving=advance(dir.x,dir.z,dt);}
else if(path.length){const p=path[0],dist=Math.hypot(p.x-robot.position.x,p.z-robot.position.z);if(dist<.09){path.shift();if(!path.length&&pending){const id=pending;pending=null;begin(id);}}else{moving=advance(p.x-robot.position.x,p.z-robot.position.z,Math.min(dt,dist/2.6));}}
const id=activity?.id;const dancing=id==='dance',sleeping=id==='sleep';
bowl.visible=id==='eat';heldCan.visible=id==='water';wateringCan.visible=id!=='water';if(bowl.visible){document.querySelector('#activity-state').textContent='식탁에서 맛있게 먹는 중';}if(id==='water')robot.rotation.y=0;
if(!activity)robot.position.y=.28+(moving?Math.abs(Math.sin(t*10))*.035:Math.sin(t*2)*.013);
robot.rotation.z=dancing?Math.sin(t*8)*.14:0;if(dancing)robot.position.y=.28+Math.abs(Math.sin(t*8))*.17;
head.rotation.z=sleeping?0:Math.sin(t*1.5)*.025;head.rotation.y=id==='read'?0:Math.sin(t*.7)*.05;
arms.forEach((a,i)=>{a.rotation.x=0;a.rotation.z=i?.1:-.1;if(moving)a.rotation.x=Math.sin(t*10+i*Math.PI)*.48;if(dancing)a.rotation.z=(i?1:-1)*(.7+Math.sin(t*8)*.4);if(['cook','wash','read','water'].includes(id)){a.rotation.x=-.95+(id==='read'?0:Math.sin(t*9+i)*.2);a.rotation.z=i?-.22:.22;}if(i===1&&t<waveUntil)a.rotation.z=2.3+Math.sin(t*10)*.3;});
legs.forEach((l,i)=>l.rotation.x=['read','toilet'].includes(id)?-Math.PI/2:moving?Math.sin(t*10+i*Math.PI)*.5:0);eyes.forEach(e=>e.scale.y=sleeping?.07:(t%4.4>4.2?.08:1));
particles.forEach((p,i)=>{p.visible=['soup','stirfry','fishCook','eggCook','wash','shower','water'].includes(id);if(!p.visible)return;const a=(t*1.3+i/18)%1;if(['soup','stirfry','fishCook','eggCook'].includes(id)){p.material.color.set('#f6f0de');p.position.set(-.2+Math.sin(i*5+t)*.14,1.7+a*.8,-4.75+Math.cos(i)*.14);p.scale.setScalar(.5+a*1.4);}else{p.material.color.set('#aadbe1');p.scale.setScalar(.6);if(id==='shower')p.position.set(7.9+Math.sin(i*12)*.45,2.3-a*1.8,-1.75+Math.cos(i*12)*.45);if(id==='wash')p.position.set(4.55+Math.sin(i)*.09,1.68-a*.4,-4.83);if(id==='water')p.position.set(6.2+Math.sin(i)*.18,.98-a*.65,4.8+a*.6);}});
interactions.tick(id,elapsed,t,dt);
if(activity){elapsed+=dt;const d=defs[id];document.querySelector('#task-progress').value=Math.min(1,elapsed/d.duration);if(elapsed>=d.duration){needs[d.need]=THREE.MathUtils.clamp(needs[d.need]+d.gain,0,100);if(!activity.committed)interactions.finish(id);cancel(true,false);if(queued.length)runNext();else{routineTotal=0;speak(d.done);}chime();}}
if(moving){needs.energy=Math.max(0,needs.energy-dt*.07);needs.food=Math.max(0,needs.food-dt*.04);}
const room=currentRoom();if(room!==activeRoom){activeRoom=room;if(!path.length&&!pending&&!inspecting)setPanel(room);}if(!path.length&&!activity&&!inspecting&&selectedRoom!==room)setPanel(room);
}
targetMarker.visible=path.length>0;if(path.length){const p=path[path.length-1];targetMarker.position.set(p.x,.32,p.z);targetMarker.scale.setScalar(1+Math.sin(t*4)*.1);}
if(follow){const target=robot.position.clone();target.y=.7;const delta=target.sub(controls.target).multiplyScalar(.07);controls.target.add(delta);camera.position.add(delta);}controls.update();
if(t-lastUi>.3){Object.entries(needs).forEach(([id,v])=>document.querySelector('#'+id).value=v);lastUi=t;}
spatial.update();
document.querySelector('#stop-routine').hidden=!(activity||pending||path.length);const stockStatus=interactions.status(),stockLabel=document.querySelector('#inventory');if(stockLabel.textContent!==stockStatus)stockLabel.textContent=stockStatus;
const state=activity?defs[activity.id].label:pending?'이동 중':path.length?'걷는 중':paused?'일시 정지':'쉬는 중';const nextKey=`${activeRoom}:${state}`;if(nextKey!==uiKey){root.dataset.room=activeRoom;root.dataset.activity=activity?.id||'idle';root.setAttribute('aria-label',`${roomData[activeRoom].name.split(' / ')[1]}에 있는 모모 · ${state}`);uiKey=nextKey;}
renderer.render(scene,camera);
}render();
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.querySelector('#fallback').hidden=false;});
}


