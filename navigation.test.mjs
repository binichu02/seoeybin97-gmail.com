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

// Outdoor movement must use the connector, never the gap beside the house.
const gardenRoute=findPath({x:4,z:3.5},{x:15.2,z:4.45},[]);
assert.ok(gardenRoute.length>0);
assert.ok(gardenRoute.some(p=>p.x>9&&p.x<10));
for(const p of gardenRoute)assert.ok(isWalkable(p.x,p.z,[]));
assert.equal(isWalkable(9.5,1,[]),false);
assert.equal(isWalkable(9.5,3.5,[]),true);
assert.equal(isWalkable(15,-2,[]),false);
