// Contextual controls live beside the nearest object, not in the global drawer.
export function createSpatialControls({THREE,root,camera,robot,objects,defs,state,perform,quick,cancel,approach,getActivity,getInventory}){
const panel=document.createElement('section');panel.id='world-actions';panel.hidden=true;panel.setAttribute('aria-label','가까운 가구 조작');
panel.innerHTML='<div class="context-heading"><strong id="context-name"></strong><button id="context-main"></button></div><div id="context-choices"></div><p id="context-inventory"></p>';
document.body.append(panel);const main=panel.querySelector('#context-main'),choices=panel.querySelector('#context-choices');
let nearest=null,pinned=null,expanded=null,dismissed=null,signature='',lastInventory='',width=146,height=60,lastX=-1,lastY=-1;
let rect=root.getBoundingClientRect();const measure=()=>{rect=root.getBoundingClientRect();};new ResizeObserver(measure).observe(root);addEventListener('resize',measure);addEventListener('scroll',measure,{passive:true});new ResizeObserver(entries=>{width=entries[0].borderBoxSize?.[0]?.inlineSize||panel.offsetWidth;height=entries[0].borderBoxSize?.[0]?.blockSize||panel.offsetHeight;}).observe(panel);
const catalog={
fridgeOpen:{name:'냉장고',key:'fridge',on:'fridgeOpen',off:'fridgeClose',options:['takeVeg','takeButter','takeFish','takeEgg','takeMilk']},
cook:{name:'가스레인지',dock:'soup',options:['cook','cookStirfry','cookSalad','cookFish','cookEgg']},
prep:{name:'조리대',options:['prep','cookSalad','eat']},drink:{name:'주방 싱크대',options:['drink','dishes']},
watch:{name:'소파',action:'sit',active:['sit','watch','read','channel'],options:['watch','read','channel','sit']},
tvOn:{name:'TV',key:'tv',on:'tvOn',off:'tvOff',options:['watch','channel']},
read:{name:'거실 테이블',options:['read','drink']},
sleep:{name:'침대',action:'sleep',active:['sleep'],options:['sleep','makeBed','curtains']},
lamp:{name:'침대 조명',key:'lamp',on:'lamp',off:'lamp',options:[]},
wardrobeOpen:{name:'옷장',key:'wardrobe',on:'wardrobeOpen',off:'wardrobeClose',options:['outfit']},
wash:{name:'세면대',key:'water',on:'tap',off:'tap',options:['wash','brush','mirror','dry']},
toilet:{name:'변기',key:'lid',on:'lidOpen',off:'lidClose',options:['toilet','flush']},
shower:{name:'샤워기',action:'shower',active:['shower'],options:['shower','dry']},
eat:{name:'정원 식탁',options:['eat','tea']},tea:{name:'정원 의자',action:'tea',active:['tea','eat'],options:['tea','eat']},
water:{name:'화분',action:'water',active:['water','flowers','smell'],options:['water','flowers','smell']}};
const entities=objects.filter(o=>o.userData.choices).map((object,index)=>{const first=object.userData.choices[0],info=catalog[first]||{name:'가구',options:object.userData.choices};const d=defs[info.dock||first];const entry={...info,object,id:index,x:d.x,z:d.z};object.userData.context=entry;return entry;});
function pick(){const origin=robot.position;let best=null,bestD=Infinity;for(const e of entities){const d=Math.hypot(e.x-origin.x,e.z-origin.z);if(d<1.35&&d<bestD){best=e;bestD=d;}}if(pinned&&Math.hypot(pinned.x-origin.x,pinned.z-origin.z)<1.45)return pinned;return best;}
function openForObject(object){const e=object.userData.context;if(!e)return;expanded=null;dismissed=null;pinned=e;approach(e.x,e.z);}
function activate(){nearest=pick();const e=nearest;if(!e)return false;pinned=e;dismissed=null;
 if(e.key){const next=state[e.key]?e.off:e.on;quick(next);expanded=state[e.key]?e.id:null;}
 else if(e.action){if(e.active?.includes(getActivity()))cancel();else perform(e.action);expanded=e.id;}
 else expanded=expanded===e.id?null:e.id;
 signature='';update();return true;
}
main.onclick=activate;
function update(){const e=pick();nearest=e;if(!e){panel.hidden=true;signature='';return;}const active=e.active?.includes(getActivity());const shouldShow=dismissed!==e.id&&(!['fridge','wardrobe'].includes(e.key)||state[e.key]);
let verb=e.key?(state[e.key]?'끄기':'켜기'):active?'일어나기':e.action?(defs[e.action]?.label||'사용') :'';
if(['fridge','wardrobe','lid'].includes(e.key))verb=state[e.key]?'닫기':'열기';
const key=[e.id,verb,shouldShow].join('|');
if(key!==signature){signature=key;panel.querySelector('#context-name').textContent=e.name;main.textContent=verb;main.hidden=!verb;main.setAttribute('aria-label',e.name+' '+verb);panel.dataset.object=e.name;
const ids=shouldShow?e.options.filter(id=>defs[id]):[];const current=[...choices.children].map(b=>b.dataset.contextAction).join(',');if(current!==ids.join(',')){choices.replaceChildren(...ids.map(id=>{const b=document.createElement('button');b.dataset.contextAction=id;const short={takeVeg:'채소',cook:'수프',cookStirfry:'채소볶음',cookSalad:'샐러드',cookFish:'생선구이',cookEgg:'오믈렛',wardrobeOpen:'열기',wardrobeClose:'닫기',watch:'TV 보기',makeBed:'이불 정리',eat:'먹기',drink:'물 마시기',dishes:'설거지'};b.textContent=short[id]||defs[id].label;b.setAttribute('aria-label',defs[id].label);b.onclick=()=>{pinned=e;expanded=e.id;perform(id);};return b;}));}}
const inventory=e.key==='fridge'&&state.fridge?getInventory().replace('가져온 재료: ','').replace('재료를 골라 꺼내보세요.',''):'';if(inventory!==lastInventory){panel.querySelector('#context-inventory').textContent=inventory;lastInventory=inventory;}
const anchor=e.object.position.clone();anchor.y+=.65;anchor.project(camera);if(anchor.z< -1||anchor.z>1){panel.hidden=true;return;}panel.hidden=false;
let x=rect.left+(anchor.x+1)*rect.width/2+16,y=rect.top+(1-anchor.y)*rect.height/2-22;if(x+width>rect.right-6)x-=width+32;x=Math.round(Math.max(rect.left+6,Math.min(x,rect.right-width-6)));y=Math.round(Math.max(rect.top+6,Math.min(y,rect.bottom-height-6)));if(x!==lastX){panel.style.left=x+'px';lastX=x;}if(y!==lastY){panel.style.top=y+'px';lastY=y;}
}
function dismiss(){dismissed=nearest?.id;expanded=null;signature='';}
return {update,activate,openForObject,entities,dismiss};
}
