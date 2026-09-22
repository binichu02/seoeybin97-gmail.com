// Stateful household objects and multi-step routines. All actions use the same
// walk / perform / finish lifecycle, so cancellation never grants a meal early.
export function createInteractions(c){
const {THREE,island,robot,head,arms,legs,orange,box,ball,cyl,mat,cream,dark,white,wood,sage,tvScreen,interactables,obstacles}=c;
const state={fridge:false,wardrobe:false,lamp:false,window:false,lid:false,tv:false,channel:0,ingredients:false,meal:null,dirty:false,water:false,flowers:false,pantry:{채소:0,버터:0,생선:0,달걀:0,우유:0}};
const held=new THREE.Group();robot.add(held);held.position.set(0,1.1,.7);
const veggie=new THREE.Group();held.add(veggie);for(let i=0;i<3;i++)ball(.13,mat(i%2?'#be6c4c':'#7aab65'),veggie,(i-1)*.2,0,0);veggie.visible=false;
const ingredientProps={};
const butter=box(.36,.18,.24,.025,mat('#ebd077'),held);butter.visible=false;ingredientProps.takeButter=butter;
const fish=new THREE.Group();held.add(fish);const fishBody=ball(.22,mat('#92b4ba'),fish);fishBody.scale.set(1.6,.65,.65);const fishTail=new THREE.Mesh(new THREE.ConeGeometry(.13,.2,3),mat('#719b9f'));fishTail.rotation.z=Math.PI/2;fishTail.position.x=-.38;fish.add(fishTail);fish.visible=false;ingredientProps.takeFish=fish;
const egg=ball(.17,mat('#f2e5cb'),held);egg.scale.y=1.35;egg.visible=false;ingredientProps.takeEgg=egg;
const milk=box(.22,.4,.22,.015,cream,held);milk.visible=false;ingredientProps.takeMilk=milk;
const mug=new THREE.Group();held.add(mug);cyl(.18,.15,.34,cream,mug);const mugHandle=new THREE.Mesh(new THREE.TorusGeometry(.1,.035,8,20),cream);mugHandle.position.set(.2,0,0);mug.add(mugHandle);mug.visible=false;
const toothbrush=box(.035,.035,.46,.01,mat('#67a69c'),robot,.35,1.8,.65);toothbrush.visible=false;
const towel=box(.6,.09,.5,.03,mat('#e4bc99'),robot,0,1.5,.7);towel.visible=false;
const spoon=box(.045,.035,.66,.015,wood,robot,.32,1.32,.7);spoon.visible=false;
const knife=box(.04,.2,.35,.015,mat('#d3dbd6',.2,.6),robot,.38,1.22,.66);knife.visible=false;
const fridge=new THREE.Group();island.add(fridge);fridge.position.set(2.22,.28,-4.9);
const inner=mat('#dce5da');box(.96,2.12,.12,.035,white,fridge,0,1.06,-.57);for(const x of [-.45,.45])box(.09,2.12,1.2,.025,white,fridge,x,1.06);for(const y of [.04,2.08])box(.96,.08,1.2,.02,white,fridge,0,y);
for(const y of [.38,.98,1.56]){box(.83,.045,1.1,.01,inner,fridge,0,y);for(let i=0;i<3;i++){if(y<1.5)ball(.11,mat(i%2?'#c8834f':'#8aaa64'),fridge,(i-1)*.24,y+.13,.18);else cyl(.065,.065,.26,cream,fridge,(i-1)*.24,y+.15,.1);}}
for(const [source,x,y,z,scale] of [[butter,-.18,.55,.33,.65],[fish,0,1.15,.28,.7],[egg,.23,.56,.3,.6],[milk,.2,1.8,.32,.65]]){const stocked=source.clone();stocked.position.set(x,y,z);stocked.scale.multiplyScalar(scale);stocked.visible=true;fridge.add(stocked);}
const fridgeDoor=new THREE.Group();fridge.add(fridgeDoor);fridgeDoor.position.set(-.48,0,.64);box(.96,2.12,.11,.035,white,fridgeDoor,.48,1.06);box(.045,.5,.06,.01,dark,fridgeDoor,.78,1.08,.09);box(.81,.018,.01,.002,inner,fridgeDoor,.48,1.48,.06);
const wardrobe=new THREE.Group();island.add(wardrobe);wardrobe.position.set(-8.35,.25,-2);
box(.92,1.85,.09,.02,sage,wardrobe,0,.92,-.79);for(const x of [-.42,.42])box(.08,1.85,1.65,.02,sage,wardrobe,x,.92);for(const y of [.04,1.82])box(.92,.08,1.65,.02,sage,wardrobe,0,y);box(.8,.04,1.5,.01,wood,wardrobe,0,.43);for(let i=0;i<3;i++)box(.18,.8,.12,.04,mat(['#d79a76','#a5b995','#96b5c7'][i]),wardrobe,(i-1)*.23,1.14,.5);
const wardrobeDoor=new THREE.Group();wardrobe.add(wardrobeDoor);wardrobeDoor.position.set(-.46,0,.84);box(.92,1.85,.065,.02,sage,wardrobeDoor,.46,.92);ball(.045,wood,wardrobeDoor,.76,.92,.06);
const lampMesh=island.children.find(m=>m.position.x===-7.8&&m.position.y===1.47);const lampLight=new THREE.PointLight('#ffd698',0,4);lampLight.position.set(-7.8,1.4,-4.9);island.add(lampLight);
const blanket=island.children.find(m=>m.position.x===-6&&m.position.y===.97);
const curtainLeft=box(.9,1.7,.06,.02,mat('#c7baa0'),island,-6.9,2,-5.76),curtainRight=box(.9,1.7,.06,.02,mat('#c7baa0'),island,-5.1,2,-5.76);
const lid=new THREE.Group();island.add(lid);lid.position.set(7.4,.99,-5.08);const lidDisk=cyl(.36,.36,.07,cream,lid,0,0,.46);lidDisk.scale.z=1.35;
const flushWater=cyl(.25,.25,.035,mat('#a3d4d8'),island,7.4,.87,-4.53);
const bathFlow=cyl(.022,.022,.4,mat('#a9e3e5',.2),island,4.55,1.5,-4.81);bathFlow.visible=false;
const sinkFlow=cyl(.023,.023,.3,mat('#a9e3e5',.2),island,-1.8,1.49,-4.96);sinkFlow.visible=false;
const dish=cyl(.25,.25,.035,cream,island,-1.8,1.4,-4.95);dish.visible=false;
const board=box(.92,.045,.52,.06,wood,island,.8,1.16,-1.3);const chopped=new THREE.Group();island.add(chopped);for(let i=0;i<9;i++)box(.065,.07,.07,.01,mat(i%2?'#b86943':'#8ba85d'),chopped,.5+(i%3)*.16,1.22,-1.48+Math.floor(i/3)*.15);chopped.visible=false;
const prepared=new THREE.Group();island.add(prepared);prepared.position.set(.8,1.23,-1.3);cyl(.32,.27,.08,cream,prepared);const food=cyl(.26,.22,.12,mat('#d9ac65'),prepared,0,.09,0);prepared.visible=false;
const tablePlate=new THREE.Group();island.add(tablePlate);tablePlate.position.set(6.6,1.02,2.8);cyl(.28,.24,.055,cream,tablePlate);const tableFood=ball(.2,mat('#d9ac65'),tablePlate,0,.09,0);tableFood.scale.y=.4;tablePlate.visible=false;
const stoveGlow=cyl(.25,.25,.018,new THREE.MeshBasicMaterial({color:'#eeab51'}),island,-.2,1.375,-4.75);stoveGlow.visible=false;
const flowerGroup=new THREE.Group();island.add(flowerGroup);for(let i=0;i<4;i++){cyl(.015,.015,.42,mat('#76975f'),flowerGroup,4+i*1.2,1.1,5.5);ball(.09,mat(i%2?'#ecbb5e':'#d99998'),flowerGroup,4+i*1.2,1.34,5.5);}flowerGroup.visible=false;
// TV is a real animated screen, with distinct channels and an off state.
const tvCanvas=document.createElement('canvas');tvCanvas.width=512;tvCanvas.height=288;const g=tvCanvas.getContext('2d');const tvTexture=new THREE.CanvasTexture(tvCanvas);tvTexture.colorSpace=THREE.SRGBColorSpace;tvScreen.material=new THREE.MeshBasicMaterial({map:tvTexture});
let tvTime=-1;
function drawTV(t){if(!state.tv){g.fillStyle='#182d2b';g.fillRect(0,0,512,288);g.fillStyle='#607a68';g.fillRect(245,255,22,3);}else if(state.channel===0){g.fillStyle='#b8d8cc';g.fillRect(0,0,512,288);g.fillStyle='#efd896';g.beginPath();g.arc(415,65,31,0,Math.PI*2);g.fill();g.fillStyle='#799f74';g.beginPath();g.moveTo(0,245);for(let x=0;x<=512;x+=8)g.lineTo(x,180+Math.sin(x*.013)*35);g.lineTo(512,288);g.lineTo(0,288);g.fill();g.fillStyle='#f6f0dc';for(let i=0;i<3;i++){g.beginPath();g.ellipse((t*13+i*180)%620-60,75+i*15,45,14,0,0,Math.PI*2);g.fill();}}else if(state.channel===1){g.fillStyle='#243d3c';g.fillRect(0,0,512,288);for(let i=0;i<14;i++){const h=40+Math.abs(Math.sin(t*3+i*.7))*145;g.fillStyle=i%2?'#b7c788':'#dcaa75';g.fillRect(25+i*34,248-h,22,h);}}else{g.fillStyle='#ead8bc';g.fillRect(0,0,512,288);g.fillStyle='#cc8d67';g.fillRect(160,115,190,90);g.fillStyle='#faf2df';for(let i=0;i<3;i++){g.beginPath();g.arc(210+i*47,85-Math.sin(t*2+i)*12,8,0,Math.PI*2);g.fill();}}if(state.tv){g.fillStyle='#203e32';g.font='bold 20px sans-serif';g.fillText(['MOMO NATURE','MOMO MUSIC','MOMO KITCHEN'][state.channel],20,30);}tvTexture.needsUpdate=true;}
drawTV(0);
const at={fridge:[2.22,-3.5],board:[.8,-2.24],stove:[-.2,-3.6],sink:[-1.8,-3.65],sofa:[-5.7,4.2],tv:[-3.95,1.6],wardrobe:[-7.35,-2],lamp:[-7.8,-3.95],bed:[-6,-2.02],basin:[4.55,-3.52],toilet:[7.4,-3.52],shower:[7.65,-1.55],garden:[6.2,4.45],chair:[5.2,3.6]};
const defs={};function add(id,label,room,where,duration,text,done,need='energy',gain=0){const [x,z]=at[where];defs[id]={label,room,x,z,duration,text,done,need,gain};}
add('fridgeOpen','냉장고 열기','kitchen','fridge',1.5,'냉장고 안에 무엇이 있을까?','냉장고를 열었어. 옆에서 원하는 재료를 골라줘.');
add('fridgeClose','냉장고 닫기','kitchen','fridge',1.2,'냉기가 나가지 않게 닫아둘게.','냉장고 문을 닫았어.');
add('takeVeg','채소 꺼내기','kitchen','fridge',2,'싱싱한 재료를 챙기는 중!','채소를 꺼냈어. 도마에서 손질해보자.');
add('takeButter','버터','kitchen','fridge',1.3,'버터를 꺼낼게.','버터를 챙겼어. 생선구이에 잘 어울려.');
add('takeFish','생선','kitchen','fridge',1.3,'신선한 생선을 꺼낼게.','생선을 챙겼어. 가스레인지에서 구워보자.');
add('takeEgg','달걀','kitchen','fridge',1.3,'달걀은 조심조심!','달걀을 챙겼어. 오믈렛을 만들 수 있어.');
add('takeMilk','우유','kitchen','fridge',1.3,'우유를 꺼낼게.','우유를 챙겼어. 부드러운 오믈렛을 만들어보자.');
add('cookFish','버터 생선구이 만들기','kitchen','stove',1,'생선구이를 만들자.','생선구이 완성!');
add('fishCook','버터에 생선 굽기','kitchen','stove',5,'버터를 녹이고 생선을 노릇하게 굽는 중!','버터 생선구이 완성!');
add('cookEgg','우유 오믈렛 만들기','kitchen','stove',1,'오믈렛을 만들자.','오믈렛 완성!');
add('eggCook','오믈렛 굽기','kitchen','stove',4,'달걀과 우유를 섞어 부드럽게 굽는 중!','오믈렛 완성!');
add('prep','도마에서 재료 썰기','kitchen','board',3,'탁탁! 먹기 좋게 썰어볼게.','재료 준비 완료!');
add('soup','수프 끓이기','kitchen','stove',5,'보글보글! 냄비를 저어줄게.','따뜻한 수프가 완성됐어.');
add('stirfry','채소 볶기','kitchen','stove',5,'지글지글, 골고루 볶아보자.','노릇한 채소볶음 완성!');
add('salad','샐러드 버무리기','kitchen','board',4,'아삭아삭한 채소를 섞는 중!','신선한 샐러드가 완성됐어.');
add('serve','완성된 음식 담기','kitchen','board',2,'그릇에 예쁘게 담아보자.','요리 완성! 식탁에서 먹기를 눌러줘.');
add('cook','수프 만들기','kitchen','fridge',1,'수프를 만들어보자.','수프 완성!');
add('cookStirfry','채소볶음 만들기','kitchen','fridge',1,'채소볶음을 만들어보자.','채소볶음 완성!');
add('cookSalad','샐러드 만들기','kitchen','fridge',1,'샐러드를 만들어보자.','샐러드 완성!');
add('eat','식탁에서 먹기','kitchen','chair',7,'잘 먹겠습니다! 천천히 맛보는 중.','맛있게 잘 먹었어! 그릇은 씻어두자.','food',35);
add('drink','물 마시기','kitchen','sink',3,'시원한 물 한 잔!','갈증이 싹 가셨네.','energy',4);
add('dishes','설거지하기','kitchen','sink',5,'뽀득뽀득! 그릇을 씻는 중이야.','그릇을 깨끗하게 씻었어.','clean',5);
add('watch','소파에서 TV 보기','living','sofa',14,'편하게 앉아서 TV를 보자.','재미있었다! 잠깐 일어나볼까?','energy',10);
add('sit','소파에 앉아 쉬기','living','sofa',10,'푹신한 소파가 최고야.','한결 편안해졌어.','energy',12);
add('tvOn','TV 켜기','living','tv',1,'TV를 켜볼게.','TV를 켰어. 소파에서 볼 수 있어.');
add('tvOff','TV 끄기','living','tv',1,'TV를 꺼둘게.','TV를 껐어.');
add('channel','TV 채널 바꾸기','living','sofa',2,'다른 채널도 볼까?','채널을 바꿨어.');
add('makeBed','이불 정리하기','bedroom','bed',4,'이불을 펴고 베개도 가지런히!','침대를 말끔하게 정리했어.');
add('lamp','침대 조명 켜기·끄기','bedroom','lamp',1.5,'조명을 바꿔볼게.','침대 조명을 바꿨어.');
add('wardrobeOpen','옷장 열기','bedroom','wardrobe',1.5,'어떤 색이 어울릴까?','옷장을 열었어.');
add('wardrobeClose','옷장 닫기','bedroom','wardrobe',1.3,'옷장도 정리해둘게.','옷장을 닫았어.');
add('outfit','옷장에서 색 바꾸기','bedroom','wardrobe',3,'오늘은 새로운 색으로!','새로운 모습으로 하루를 시작하자.');
add('curtains','커튼 열기·닫기','bedroom','bed',2,'햇빛을 조절하는 중이야.','커튼을 움직였어.');
add('lidOpen','변기 뚜껑 열기','bathroom','toilet',1,'뚜껑을 열어둘게.','변기 뚜껑을 열었어.');
add('lidClose','변기 뚜껑 닫기','bathroom','toilet',1,'뚜껑을 닫아둘게.','변기 뚜껑을 닫았어.');
add('flush','변기 물 내리기','bathroom','toilet',2.5,'쏴아! 물을 내리는 중이야.','물을 내렸어. 손도 씻자.');
add('brush','양치하기','bathroom','basin',6,'치카치카, 구석구석 깨끗하게!','상쾌해! 양치 끝.','clean',15);
add('mirror','거울 보기','bathroom','basin',3,'오늘도 멋진 모모네!','준비 완료!','energy',2);
add('dry','수건으로 닦기','bathroom','basin',4,'수건으로 뽀송하게 닦는 중!','보송보송해졌어.','clean',5);
add('tap','수도꼭지 켜기·끄기','bathroom','basin',1.2,'수도꼭지를 돌려볼게.','물 흐름을 바꿨어.');
add('tea','정원에서 차 마시기','garden','chair',7,'햇살 아래 따뜻한 차 한 잔.','정말 여유로운 시간이었어.','energy',10);
add('flowers','꽃 돌보기','garden','garden',5,'작은 꽃들에게도 관심을!','꽃이 활짝 피었어.','energy',5);
add('smell','꽃향기 맡기','garden','garden',3,'초록빛 향기가 참 좋다.','기분 좋은 향기야.','energy',3);
const roomActions={living:['watch','sit','read','tvOn','tvOff','channel','dance'],bedroom:['sleep','makeBed','lamp','wardrobeOpen','wardrobeClose','outfit','curtains'],kitchen:['fridgeOpen','fridgeClose','takeVeg','takeButter','takeFish','takeEgg','takeMilk','prep','cook','cookStirfry','cookSalad','cookFish','cookEgg','eat','drink','dishes'],bathroom:['toilet','flush','lidOpen','lidClose','wash','brush','shower','dry','mirror','tap'],garden:['water','tea','flowers','smell','eat']};
function sequence(id){if(id==='cookFish')return ['fishCook','serve'];if(id==='cookEgg')return ['eggCook','serve'];if(['cook','cookStirfry','cookSalad'].includes(id))return ['prep',({cook:'soup',cookStirfry:'stirfry',cookSalad:'salad'})[id],'serve'];if(id==='toilet')return ['lidOpen','toilet','flush','lidClose','wash'];if(id==='outfit')return ['wardrobeOpen','outfit','wardrobeClose'];return [id];}
function can(id){if(['cook','cookStirfry','cookSalad'].includes(id)&&!state.pantry.채소)return '냉장고에서 채소를 먼저 골라 꺼내줘.';if(id==='cookFish'&&(!state.pantry.생선||!state.pantry.버터))return '냉장고를 열고 생선과 버터를 먼저 골라줘.';if(id==='cookEgg'&&(!state.pantry.달걀||!state.pantry.우유))return '냉장고에서 달걀과 우유를 먼저 꺼내줘.';if(id==='eat'&&!state.meal)return '먼저 주방에서 수프·채소볶음·샐러드를 만들어줘.';if(id==='prep'&&!state.pantry.채소)return '냉장고에서 채소를 먼저 꺼내줘.';return null;}
const pops=[];function proxy(room,actions,x,y,z,w,h,d){const p=box(w,h,d,.02,new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}),island,x,y,z);p.castShadow=false;p.receiveShadow=false;p.userData.choices=actions;p.userData.room=room;interactables.push(p);pops.push(p);}
proxy('kitchen',['fridgeOpen','fridgeClose','takeVeg','takeButter','takeFish','takeEgg','takeMilk'],2.22,1.3,-4.9,1.05,2.3,1.3);
proxy('kitchen',['cook','cookStirfry','cookSalad','cookFish','cookEgg'],-.2,1.5,-4.95,1.2,.5,1);
proxy('kitchen',['prep','eat'],.8,1,-1.3,1.6,1.2,.85);
proxy('kitchen',['drink','dishes'],-1.8,1.3,-4.95,1,.5,1);
proxy('living',['watch','sit','read','channel'],-5.7,.9,5.5,3.5,1.4,1.5);
proxy('living',['tvOn','tvOff','channel','watch'],-5.7,1.6,1.6,2.65,1.55,.3);
proxy('living',['read','drink'],-5.7,.7,3.3,1.8,.7,.85);
proxy('bedroom',['sleep','makeBed','curtains'],-6,.9,-4.05,2.4,1.2,3.1);
proxy('bedroom',['lamp'],-7.8,1.1,-4.9,.85,1.4,.8);
proxy('bedroom',['wardrobeOpen','wardrobeClose','outfit'],-8.35,1.2,-2,1.05,2,1.8);
proxy('bathroom',['wash','brush','mirror','dry','tap'],4.55,1.4,-4.8,1.5,2.2,1.3);
proxy('bathroom',['toilet','flush','lidOpen','lidClose'],7.4,.8,-4.9,1.1,1.1,1.7);
proxy('bathroom',['shower','dry'],7.75,1.3,-1.6,1.7,2,1.75);
proxy('garden',['eat','tea'],6.6,.9,2.8,1.8,1.4,1.8);
for(const x of [5.2,8])proxy('garden',['tea','eat'],x,.6,2.8,.7,.9,.7);
for(const x of [4,5.2,6.4,7.6,8])proxy('garden',['water','flowers','smell'],x,.8,x===8?1.2:5.5,.7,1.3,.7);
function begin(id){held.visible=true;if(id.startsWith('take'))state.fridge=true;if(['fridgeOpen','takeVeg'].includes(id))state.fridge=true;if(id==='fridgeClose')state.fridge=false;if(id==='wardrobeOpen')state.wardrobe=true;if(id==='wardrobeClose')state.wardrobe=false;if(id==='lamp'){state.lamp=!state.lamp;}if(id==='curtains')state.window=!state.window;if(id==='lidOpen'||id==='toilet')state.lid=true;if(id==='lidClose')state.lid=false;if(id==='tap')state.water=!state.water;if(id==='tvOn'||id==='watch')state.tv=true;if(id==='tvOff')state.tv=false;if(id==='channel'){state.tv=true;state.channel=(state.channel+1)%3;}if(['watch','sit','read','channel'].includes(id)){robot.position.set(-5.7,.73,5.4);robot.rotation.y=Math.PI;}if(id==='eat'){prepared.visible=false;tableFood.visible=true;}if(['eat','tea'].includes(id)){robot.position.set(5.2,.49,2.8);robot.rotation.y=Math.PI/2;tablePlate.visible=id==='eat';}if(['fridgeOpen','fridgeClose','takeVeg','prep','soup','stirfry','salad','serve','takeButter','takeFish','takeEgg','takeMilk','fishCook','eggCook','drink','dishes','brush','mirror','dry','tap','makeBed'].includes(id))robot.rotation.y=Math.PI;if(['prep','salad','serve'].includes(id))robot.rotation.y=0;if(['wardrobeOpen','wardrobeClose','outfit'].includes(id))robot.rotation.y=-Math.PI/2;if(id==='lamp')robot.rotation.y=Math.PI;if(['soup','stirfry','salad','fishCook','eggCook'].includes(id)){state.meal=null;prepared.visible=false;}if(id==='sleep')state.lamp=false;}
function finish(id){const item={takeVeg:'채소',takeButter:'버터',takeFish:'생선',takeEgg:'달걀',takeMilk:'우유'}[id];if(item)state.pantry[item]++;if(id==='takeVeg')state.ingredients=true;if(id==='prep')chopped.visible=true;if(['soup','stirfry','salad','fishCook','eggCook'].includes(id)){state.meal={soup:'수프',stirfry:'채소볶음',salad:'샐러드',fishCook:'버터 생선구이',eggCook:'우유 오믈렛'}[id];state.ingredients=false;if(id==='fishCook'){state.pantry.생선--;state.pantry.버터--;}else if(id==='eggCook'){state.pantry.달걀--;state.pantry.우유--;}else state.pantry.채소=Math.max(0,state.pantry.채소-1);food.material.color.set(id==='salad'?'#91b269':id==='stirfry'?'#c99550':'#dbb96d');tableFood.material.color.copy(food.material.color);}if(id==='serve'){prepared.visible=true;chopped.visible=false;}if(id==='eat'){state.meal=null;prepared.visible=false;state.dirty=true;tablePlate.visible=true;tableFood.visible=false;}if(id==='dishes'){state.dirty=false;tablePlate.visible=false;tableFood.visible=true;}if(id==='outfit'){orange.color.set(['#9fbba0','#92afc7','#ee895b'][Math.floor(Math.random()*3)]);}if(id==='flowers'){state.flowers=true;flowerGroup.visible=true;}if(id==='makeBed'){blanket.position.z=-3.62;blanket.rotation.z=0;}if(id==='wash'||id==='dishes')state.water=false;}
function reset(){Object.values(ingredientProps).forEach(p=>p.visible=false);held.visible=false;veggie.visible=false;mug.visible=false;toothbrush.visible=false;towel.visible=false;knife.visible=false;spoon.visible=false;sinkFlow.visible=false;dish.visible=false;stoveGlow.visible=false;}
function tick(id,e,t,dt){const ease=1-Math.exp(-dt*7);fridgeDoor.rotation.y=THREE.MathUtils.lerp(fridgeDoor.rotation.y,state.fridge?-1.75:0,ease);wardrobeDoor.rotation.y=THREE.MathUtils.lerp(wardrobeDoor.rotation.y,state.wardrobe?-1.5:0,ease);lid.rotation.x=THREE.MathUtils.lerp(lid.rotation.x,state.lid?-1.65:0,ease);curtainLeft.position.x=THREE.MathUtils.lerp(curtainLeft.position.x,state.window?-7.25:-6.5,ease);curtainRight.position.x=THREE.MathUtils.lerp(curtainRight.position.x,state.window?-4.75:-5.5,ease);lampLight.intensity=state.lamp?2:0;if(lampMesh){lampMesh.material.emissive.set(state.lamp?'#ffbb58':'#000000');lampMesh.material.emissiveIntensity=.7;}bathFlow.visible=state.water||['wash','brush'].includes(id);sinkFlow.visible=['drink','dishes'].includes(id);dish.visible=id==='dishes';dish.rotation.z=Math.sin(t*7)*.2;stoveGlow.visible=['soup','stirfry','fishCook','eggCook'].includes(id);flushWater.scale.x=flushWater.scale.z=id==='flush'?.65+Math.sin(e*14)*.2:1;
Object.entries(ingredientProps).forEach(([key,p])=>p.visible=id===key);veggie.visible=id==='takeVeg';mug.visible=['drink','tea'].includes(id);toothbrush.visible=id==='brush';towel.visible=id==='dry';knife.visible=id==='prep';spoon.visible=['soup','stirfry','salad','eat'].includes(id);held.position.y=mug.visible?1.4+Math.sin(e*2)*.15:1.1;
if(['watch','sit','read','channel','eat','tea'].includes(id))legs.forEach(l=>l.rotation.x=-Math.PI/2);
if(['prep','soup','stirfry','salad','dishes','makeBed','brush','dry','eat','takeVeg','takeButter','takeFish','takeEgg','takeMilk','fishCook','eggCook','drink','tea','mirror','flowers'].includes(id))arms.forEach((a,i)=>{a.rotation.x=-1.15+Math.sin(t*(id==='prep'?12:6)+i)*.22;a.rotation.z=i?-.2:.2;});
if(id==='prep'){knife.position.y=1.2+Math.abs(Math.sin(t*12))*.15;chopped.visible=e>1;}
if(id==='brush'){toothbrush.position.x=.15+Math.sin(t*15)*.15;toothbrush.position.y=1.85;}
if(id==='dry')towel.position.y=1.5+Math.sin(t*5)*.25;
if(id==='mirror'){head.rotation.y=Math.sin(t*3)*.25;arms[1].rotation.z=1.4;}
if(id==='makeBed')blanket.scale.z=.8+Math.min(e/4,1)*.2;else blanket.scale.z=1;
if(id==='sleep'){blanket.position.y=1.37;blanket.scale.z=.72;}else blanket.position.y=.97;
if(id==='watch')head.rotation.y=Math.sin(t)*.04;
if(t-tvTime>.12){drawTV(t);tvTime=t;}
}
function status(){return `냉장고 ${state.fridge?'열림':'닫힘'} · ${state.meal?'음식: '+state.meal:state.ingredients?'채소 준비됨':'만든 음식 없음'}${state.dirty?' · 설거지 필요':''}`;}
function inventory(){const items=Object.entries(state.pantry).filter(([,n])=>n>0);return items.length?'가져온 재료: '+items.map(([k,n])=>`${k} ${n}`).join(' · '):'재료를 골라 꺼내보세요.';}
return {defs,roomActions,sequence,can,begin,finish,tick,reset,status,state,inventory};
}
