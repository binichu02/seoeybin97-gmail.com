import * as THREE from 'three';
import { RoundedBoxGeometry } from './vendor/RoundedBoxGeometry.js';

const root=document.querySelector('#world'),bubble=document.querySelector('#bubble');
const scene=new THREE.Scene();scene.background=new THREE.Color('#e9ece4');
const camera=new THREE.PerspectiveCamera(34,1,.1,100);
let renderer;
try{renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});}catch(e){document.querySelector('#fallback').hidden=false;throw e;}
renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;root.append(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xf8fff3,0xa7b391,2.5));const sun=new THREE.DirectionalLight(0xfff3d7,4);sun.position.set(-4,10,6);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-12,right:12,top:12,bottom:-12});sun.shadow.normalBias=.025;sun.shadow.bias=-.0002;sun.shadow.radius=4;scene.add(sun);
const mat=(color,roughness=.65,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const orange=mat('#ee895b',.34),dark=mat('#263931',.38),cream=mat('#f6eee0'),green=mat('#9cba7c'),rim=mat('#c9d0b8');
function mesh(geo,material,parent,x=0,y=0,z=0){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function box(w,h,d,r,m,p,x=0,y=0,z=0){return mesh(new RoundedBoxGeometry(w,h,d,4,r),m,p,x,y,z)}
function ball(r,m,p,x=0,y=0,z=0){return mesh(new THREE.SphereGeometry(r,32,20),m,p,x,y,z)}
function cyl(r1,r2,h,m,p,x=0,y=0,z=0){return mesh(new THREE.CylinderGeometry(r1,r2,h,64),m,p,x,y,z)}
const floor=mesh(new THREE.PlaneGeometry(200,200),mat('#e9ece4'),scene);floor.rotation.x=-Math.PI/2;floor.position.y=-.33;
const island=new THREE.Group();scene.add(island);


const robot=new THREE.Group();island.add(robot);robot.position.set(0,.24,.35);
const body=box(1.14,1.08,.78,.24,orange,robot,0,1.04,0);box(.51,.36,.035,.06,cream,robot,0,1.09,.411);box(.3,.045,.018,.01,dark,robot,0,1.12,.435);ball(.035,mat('#b1d689'),robot,.15,.99,.443);
const head=new THREE.Group();head.position.y=2.05;robot.add(head);box(1.62,1.18,1.04,.32,orange,head);box(1.36,.77,.16,.24,dark,head,0,-.015,.49);
const eyeMat=new THREE.MeshBasicMaterial({color:'#e9fcc4'});const eyes=[];for(const x of [-.32,.32])eyes.push(box(.13,.26,.035,.065,eyeMat,head,x,.02,.589));
const smile=mesh(new THREE.TorusGeometry(.14,.018,10,32,Math.PI*.72),eyeMat,head,0,-.12,.585);smile.rotation.z=Math.PI*1.14;
for(const x of [-.85,.85]){const ear=cyl(.16,.16,.14,cream,head,x,0,0);ear.rotation.z=Math.PI/2;}
cyl(.035,.035,.31,dark,head,0,.68,-.05);const antenna=ball(.095,mat('#e8faad'),head,0,.87,-.05);
const arms=[];for(const side of [-1,1]){const arm=new THREE.Group();arm.position.set(side*.65,1.37,0);robot.add(arm);ball(.17,dark,arm);box(.28,.58,.33,.13,orange,arm,side*.055,-.3,0);ball(.16,cream,arm,side*.055,-.65,0);arm.rotation.z=side*.1;arms.push(arm);}
const legs=[];for(const side of [-1,1]){const leg=new THREE.Group();leg.position.set(side*.33,.54,0);robot.add(leg);cyl(.12,.12,.22,dark,leg,0,-.08,0);box(.4,.42,.43,.12,orange,leg,0,-.27,0);box(.46,.19,.64,.085,cream,leg,0,-.42,.09);legs.push(leg);}
function plant(x,z,scale=1){const p=new THREE.Group();p.position.set(x,.23,z);p.scale.setScalar(scale);island.add(p);cyl(.29,.21,.43,mat('#e4a47e'),p,0,.22);cyl(.3,.3,.07,cream,p,0,.45);cyl(.245,.245,.012,mat('#59634a'),p,0,.49);for(let i=0;i<5;i++){const a=i*2.4;const leaf=ball(.24,mat(i%2?'#8ba577':'#adc18f'),p,Math.sin(a)*.15,.67+i*.07,Math.cos(a)*.13);leaf.scale.set(.48,1.8,.65);leaf.rotation.z=Math.sin(a)*.55;}}

import { createHome } from './home.js';
createHome({ THREE, scene, camera, renderer, root, bubble, island, robot, head, arms, legs, eyes, orange, mat, box, ball, cyl, mesh, plant, cream, dark, eyeMat });

