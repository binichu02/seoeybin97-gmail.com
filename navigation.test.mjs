import assert from 'node:assert/strict';
import { findPath, isWalkable } from './navigation.js';

// A doorway between rooms must stay navigable while furniture remains solid.
const obstacles=[{x:-4.8,z:0,w:7.6,d:.2},{x:4.8,z:0,w:7.6,d:.2},{x:0,z:-3,w:2,d:1}];
const route=findPath({x:-6,z:3},{x:6,z:-3},obstacles);
assert.ok(route.length>10,'Route should pass through the doorway');
for(let i=1;i<route.length;i++)for(let k=0;k<=10;k++){
 const a=route[i-1],b=route[i];
 assert.ok(isWalkable(a.x+(b.x-a.x)*k/10,a.z+(b.z-a.z)*k/10,obstacles),'Every route segment must clear walls and furniture');
}
assert.ok(route.some(p=>Math.abs(p.x)<.7&&Math.abs(p.z)<.4),'Route must use the door');
assert.equal(isWalkable(0,-3,obstacles),false,'Furniture blocks movement');
assert.equal(isWalkable(10,0,obstacles),false,'Outside the house is blocked');
assert.deepEqual(findPath({x:0,z:2},{x:0,z:-3},[{x:0,z:0,w:20,d:1}]),[],'Disconnected rooms have no route');
console.log('PASS: door routing, collision-free segments, furniture, boundaries, disconnected rooms');
