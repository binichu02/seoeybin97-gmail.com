import assert from 'node:assert/strict';
import * as THREE from './vendor/three.module.js';
import { createInteractions } from './interactions.js';

// Exercise actual household state and object transforms without a WebGL renderer.
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>new Proxy({}, {get:()=>()=>{},set:()=>true})})};
const island=new THREE.Group(),robot=new THREE.Group(),head=new THREE.Group();
const mat=color=>new THREE.MeshStandardMaterial({color});
function put(geometry,m,p,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,m);o.position.set(x,y,z);p.add(o);return o;}
const box=(w,h,d,r,m,p,x,y,z)=>put(new THREE.BoxGeometry(w,h,d),m,p,x,y,z);
const ball=(r,m,p,x,y,z)=>put(new THREE.SphereGeometry(r,8,6),m,p,x,y,z);
const cyl=(a,b,h,m,p,x,y,z)=>put(new THREE.CylinderGeometry(a,b,h,8),m,p,x,y,z);
const cream=mat('#ffffff'),dark=mat('#333333'),wood=mat('#b89977'),sage=mat('#99bb99'),orange=mat('#ee9955');
box(1,1,1,0,cream,island,-6,.97,-3.62);box(1,1,1,0,cream,island,-7.8,1.47,-4.9);
const arms=[new THREE.Group(),new THREE.Group()],legs=[new THREE.Group(),new THREE.Group()];
const tvScreen=box(1,1,1,0,dark,island);
const i=createInteractions({THREE,island,robot,head,arms,legs,orange,box,ball,cyl,mat,cream,dark,white:cream,wood,sage,tvScreen,interactables:[],obstacles:[]});
assert.ok(i.can('eat'),'Eating requires a finished meal');
assert.ok(i.can('prep'),'Preparation requires ingredients');
assert.deepEqual(i.sequence('cook'),['prep','soup','serve']);
i.begin('fridgeOpen');i.tick('fridgeOpen',1,1,1);assert.equal(i.state.fridge,true);
i.finish('takeVeg');assert.equal(i.can('prep'),null);
i.begin('soup');i.reset();assert.equal(i.state.meal,null,'Cancelling before cooking finishes must not create food');
i.finish('soup');i.finish('serve');assert.equal(i.state.meal,'수프');assert.equal(i.can('eat'),null);
i.finish('eat');assert.equal(i.state.meal,null);assert.equal(i.state.dirty,true);
i.finish('dishes');assert.equal(i.state.dirty,false);
assert.deepEqual(i.sequence('toilet'),['lidOpen','toilet','flush','lidClose','wash']);
i.begin('watch');assert.equal(i.state.tv,true);assert.equal(robot.rotation.y,Math.PI);assert.equal(robot.position.z,5.4,'Robot sits facing TV at negative Z');
i.begin('channel');assert.equal(i.state.channel,1);i.begin('tvOff');assert.equal(i.state.tv,false);
i.begin('lidOpen');assert.equal(i.state.lid,true);i.begin('lidClose');assert.equal(i.state.lid,false);
for(const d of Object.values(i.defs))assert.ok(Number.isFinite(d.x)&&Number.isFinite(d.z)&&d.duration>0);
assert.equal(new Set(Object.values(i.roomActions).flat()).size,44);
console.log('PASS: 44 choices, recipe stages, ingredient checks, interrupted cooking, meal consumption, dishes, toilet routine, TV and seat orientation');

assert.ok(i.can('cookFish'));i.finish('takeFish');i.finish('takeButter');assert.equal(i.can('cookFish'),null);i.finish('fishCook');assert.equal(i.state.meal,'버터 생선구이');assert.equal(i.state.pantry.생선,0);assert.equal(i.state.pantry.버터,0);assert.ok(i.can('cookFish'));
i.finish('takeEgg');i.finish('takeMilk');assert.equal(i.can('cookEgg'),null);i.finish('eggCook');assert.equal(i.state.meal,'우유 오믈렛');assert.equal(i.state.pantry.우유,0);console.log('PASS: ingredient inventory, recipe requirements and consumption');
